import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useHref,
    useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "./i18n/i18n";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#AACA36" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=yes"
                />
                <Meta />
                <Links />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href="/favicon-96x96.png"
                ></link>
            </head>
            <body className="h-full min-h-dvh bg-primary-500 flex flex-col justify-center items-stretch w-full">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
export default function App() {
    const navigate = useNavigate();

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
            <ToastProvider />
            <Outlet />
        </HeroUIProvider>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "Une erreur inattendue est survenue.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Erreur";
        details =
            error.status === 404
                ? "La page demandée est introuvable."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
