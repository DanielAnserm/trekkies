import type { Route } from "./+types/home";
import { HomePage } from "~/features/home/HomePage";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Trekkie" }, { name: "description", content: "Trekkie" }];
}

export default function Home() {
    return <HomePage />;
}
