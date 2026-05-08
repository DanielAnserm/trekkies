import type { RouteHandle } from "./game.layout";
import { GamePageView } from "~/features/adventure/GamePageView";
import type { Route } from "./+types/game.index";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Trekkie" }, { name: "description", content: "Trekkie" }];
}

export const handle: RouteHandle = {
    titleKey: "",
    displayStatsCard: false,
    getDynamicTitle: (context, t) => {
        const { gameState, stage: scenario } = context.gameContext;
        const { userProfile } = context.userContext;
        const { currentView } = context.viewContext;

        // Logique pour déterminer le titre selon la vue actuelle
        switch (currentView) {
            // case "start":
            //     return t("start.title", { pseudo: userProfile?.pseudonym || t("common.anonymousPlayer") });
            case "profile":
                return t("profile.title", {
                    pseudo:
                        userProfile?.pseudonym || t("common.anonymousPlayer"),
                });
            case "game":
                return scenario?.title || "Trekkie";
            default:
                return t("profile.title", {
                    pseudo:
                        userProfile?.pseudonym || t("common.anonymousPlayer"),
                });
        }
    },
};
export default function GamePlay() {
    return <GamePageView />;
}
