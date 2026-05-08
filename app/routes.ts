import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    // Routes de l'application principale (avec guards FirstLogin et EndGame)
    layout("routes/app.layout.tsx", [
        index("routes/home.tsx"),
        ...prefix("game", [
            layout("routes/game.layout.tsx", [
                index("routes/game.index.tsx"),
            ]),
        ]),
        route("leaderboard","routes/leaderboard.tsx"),
        route("verify","routes/verify.tsx")
    ]),

    // Route reset-save (sans guards)
    route("reset-save", "routes/reset-save.tsx"),

    // Routes admin (avec AdminProvider partagé, authentification admin séparée)
    ...prefix("admin", [
        layout("routes/admin.root.layout.tsx", [
            route("login", "routes/admin.login.tsx"),
            layout("routes/admin.layout.tsx", [
                index("routes/admin.index.tsx"),
            ]),
        ]),
    ]),
] satisfies RouteConfig;
