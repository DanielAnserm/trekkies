import { LeaderboardPage } from "~/features/leaderboard/LeaderboardPage";
import type { Route } from "./+types/leaderboard";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Classement - Trekkie" }, { name: "description", content: "Classement des joueurs Trekkie" }];
}

export default function Leaderboard() {
    return <LeaderboardPage />;
}
