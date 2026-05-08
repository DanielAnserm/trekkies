import { useViewContext } from "~/infrastructure/context/ViewProvider";
import { GameCard } from "./GameCard";
import { ProfiletCard } from "./ProfileCard";
import { StartCard } from "./StartCard";
import { PostulationBadgeCard } from "./PostulationBadgeCard";

type Props = {};

export const GamePageView = (props: Props) => {
    const { currentView } = useViewContext();

    switch (currentView) {
        case "profile":
            return <ProfiletCard />;
        case "game":
            return <GameCard />;
        case "postulation_badge":
            return <PostulationBadgeCard />;
        default:
            return <ProfiletCard />;
    }
};
