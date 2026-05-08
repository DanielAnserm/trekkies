import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button, Input } from "@heroui/react";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { useAdminContext } from "~/infrastructure/context/AdminContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const AdminLoginPage = () => {
    const { signIn } = useAdminContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email.trim(), password);

            // Rediriger vers la page précédente ou vers /admin
            const from = (location.state as any)?.from?.pathname || "/admin";
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
            <LayoutCard className="w-full max-w-md">
                <LayoutCardHeader>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
                        <p className="text-gray-600 mt-2">Connexion réservée aux administrateurs</p>
                    </div>
                </LayoutCardHeader>
                <LayoutCardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <Input
                            label="Email"
                            labelPlacement="outside"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                            isDisabled={isLoading}
                            isRequired
                            autoComplete="email"
                        />

                        <Input
                            label="Mot de passe"
                            labelPlacement="outside"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="lg"
                            isDisabled={isLoading}
                            isRequired
                            autoComplete="current-password"
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            }
                        />

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            color="primary"
                            isLoading={isLoading}
                            isDisabled={isLoading || !email.trim() || !password.trim()}
                            className="w-full mt-4"
                        >
                            Se connecter
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Button
                            variant="light"
                            color="default"
                            onPress={() => navigate("/")}
                            isDisabled={isLoading}
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </LayoutCardBody>
            </LayoutCard>
        </div>
    );
};
