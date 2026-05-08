import { describe, expect, it } from "vitest";
import { checkConditionSafe } from "./tokenizer";
import { ConditionOperator } from "./models";
import { type PlayerStats } from "~/models/game";

describe("checkConditionSafe", () => {
    const stats: PlayerStats = {
        character: 10,
        skills: 5,
        context: 3,
        experience: 7,
    };

    it("returns true for empty condition", () => {
        expect(checkConditionSafe("", stats)).toBe(true);
        expect(checkConditionSafe("   ", stats)).toBe(true);
    });

    it("evaluates single GREATER_THAN condition", () => {
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN} 5`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN} 15`, stats)
        ).toBe(false);
    });

    it("evaluates single GREATER_THAN_EQUAL condition", () => {
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN_EQUAL} 2`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN_EQUAL} 10`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN_EQUAL} 11`, stats)
        ).toBe(false);
    });

    it("evaluates single LESS_THAN_EQUAL condition", () => {
        expect(
            checkConditionSafe(`skills ${ConditionOperator.LESS_THAN_EQUAL} 5`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`skills ${ConditionOperator.LESS_THAN_EQUAL} 4`, stats)
        ).toBe(false);
    });

    it("evaluates single EQUAL condition", () => {
        expect(
            checkConditionSafe(`context ${ConditionOperator.EQUAL} 3`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`context ${ConditionOperator.EQUAL} 2`, stats)
        ).toBe(false);
    });

    it("evaluates single NOT_EQUAL condition", () => {
        expect(
            checkConditionSafe(`experience ${ConditionOperator.NOT_EQUAL} 5`, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`experience ${ConditionOperator.NOT_EQUAL} 7`, stats)
        ).toBe(false);
    });

    it("evaluates AND logical operator", () => {
        const cond = `character ${ConditionOperator.GREATER_THAN} 5 ${ConditionOperator.AND} skills ${ConditionOperator.LESS_THAN} 10`;
        expect(checkConditionSafe(cond, stats)).toBe(true);

        const condFalse = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.AND} skills ${ConditionOperator.LESS_THAN} 10`;
        expect(checkConditionSafe(condFalse, stats)).toBe(false);
    });

    it("evaluates OR logical operator", () => {
        const cond = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.OR} skills ${ConditionOperator.LESS_THAN} 10`;
        expect(checkConditionSafe(cond, stats)).toBe(true);

        const condFalse = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.OR} skills ${ConditionOperator.LESS_THAN} 2`;
        expect(checkConditionSafe(condFalse, stats)).toBe(false);
    });

    it("evaluates mixed AND/OR logical operators", () => {
        const cond = `character ${ConditionOperator.GREATER_THAN} 5 ${ConditionOperator.AND} skills ${ConditionOperator.LESS_THAN} 10 ${ConditionOperator.OR} context ${ConditionOperator.EQUAL} 1`;
        expect(checkConditionSafe(cond, stats)).toBe(true);

        const cond2 = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.AND} skills ${ConditionOperator.LESS_THAN} 10 ${ConditionOperator.OR} context ${ConditionOperator.EQUAL} 1`;
        expect(checkConditionSafe(cond2, stats)).toBe(false);
    });

    it("returns false for invalid stat", () => {
        expect(
            checkConditionSafe(`invalidStat ${ConditionOperator.GREATER_THAN} 5`, stats)
        ).toBe(false);
    });

    it("returns false for invalid operator", () => {
        expect(
            checkConditionSafe(`character ?? 5`, stats)
        ).toBe(false);
    });

    it("returns false for invalid value", () => {
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN} notANumber`, stats)
        ).toBe(false);
    });

    it("evaluates multiple AND conditions", () => {
        const cond = `character ${ConditionOperator.GREATER_THAN} 5 ${ConditionOperator.AND} skills ${ConditionOperator.GREATER_THAN_EQUAL} 5 ${ConditionOperator.AND} context ${ConditionOperator.LESS_THAN_EQUAL} 3`;
        expect(checkConditionSafe(cond, stats)).toBe(true);

        const condFalse = `character ${ConditionOperator.GREATER_THAN} 5 ${ConditionOperator.AND} skills ${ConditionOperator.GREATER_THAN_EQUAL} 6 ${ConditionOperator.AND} context ${ConditionOperator.LESS_THAN_EQUAL} 3`;
        expect(checkConditionSafe(condFalse, stats)).toBe(false);
    });

    it("evaluates multiple OR conditions", () => {
        const cond = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.OR} skills ${ConditionOperator.GREATER_THAN_EQUAL} 5 ${ConditionOperator.OR} context ${ConditionOperator.LESS_THAN_EQUAL} 2`;
        expect(checkConditionSafe(cond, stats)).toBe(true);

        const condFalse = `character ${ConditionOperator.GREATER_THAN} 15 ${ConditionOperator.OR} skills ${ConditionOperator.GREATER_THAN_EQUAL} 6 ${ConditionOperator.OR} context ${ConditionOperator.LESS_THAN_EQUAL} 2`;
        expect(checkConditionSafe(condFalse, stats)).toBe(false);
    });

    it("handles whitespace and extra spaces", () => {
        expect(
            checkConditionSafe(`  character   ${ConditionOperator.GREATER_THAN}   5  `, stats)
        ).toBe(true);
        expect(
            checkConditionSafe(`skills${ConditionOperator.LESS_THAN_EQUAL}5`, stats)
        ).toBe(true);
    });

    it("returns false for incomplete condition", () => {
        expect(
            checkConditionSafe(`character ${ConditionOperator.GREATER_THAN}`, stats)
        ).toBe(false);
        expect(
            checkConditionSafe(`character`, stats)
        ).toBe(false);
    });

    it("returns false for null or undefined stats", () => {
        // @ts-expect-error
        expect(checkConditionSafe(`character ${ConditionOperator.GREATER_THAN} 5`, null)).toBe(false);
        // @ts-expect-error
        expect(checkConditionSafe(`character ${ConditionOperator.GREATER_THAN} 5`, undefined)).toBe(false);
    });
});