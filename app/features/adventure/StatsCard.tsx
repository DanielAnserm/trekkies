import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "~/infrastructure/context/GameProvider";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";

type Props = {};

export const StatsCard = (props: Props) => {
    const { t } = useTranslation();
    const { gameState } = useGameContext();
    if(gameState?.currentScenario === "end") {
        return null; // Do not show stats card on end scenario
    }
    return (
        <Accordion variant="shadow" className="max-w-lg w-full mx-auto" defaultExpandedKeys={["1"]}>
            <AccordionItem key="1" aria-label={t("common.statistics")} title={<div className="font-semibold text-center justify-center">{t("common.statistics")}</div>}>
                {/* <Card className="max-w-lg mx-auto text-center border-0 w-full gap" shadow="none">
                    <CardHeader className="font-semibold text-center justify-center pb-2">Statistiques</CardHeader>
                    <CardBody className="pt-2">
                        
                    </CardBody>
                </Card> */}
                <dl className="grid w-full grid-cols-2 gap-2 text-left">
                    {gameState?.profile?.statistics &&
                        Object.entries(gameState?.profile?.statistics).map(([stat, value]) => (
                            <Card key={stat} className="border border-transparent dark:border-default-100" shadow="sm">
                                <div className="flex p-2">
                                    <div className="flex flex-col gap-y-1">
                                        <dt className="text-small font-medium text-default-700">
                                            {" "}
                                            {t(`profile.statistics.${stat}`, { defaultValue: stat })}
                                        </dt>
                                        <dd className="text-2xl font-semibold text-default-900">{value}</dd>
                                    </div>
                                </div>
                            </Card>
                        ))}
                </dl>
            </AccordionItem>
        </Accordion>
    );
};
