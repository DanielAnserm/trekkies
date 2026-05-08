import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { usePseudoContext } from "~/infrastructure/context/PseudoContext";
import { profileService } from "~/infrastructure/services/profileService";
import { GlobalStatsManager } from "~/infrastructure/utils/stats/GlobalStatsManager";
import { LayoutCard, LayoutCardBody, LayoutCardHeader } from "~/components/common/LayoutCard";
import { Button, Input } from "@heroui/react";
import { TutorialOnboarding } from "./TutorialOnboarding";

const ONBOARDING_STATE_KEY = "trekkie_onboarding_state";

export const FirstLoginPage = () => {
    const { t } = useTranslation();
    const { setPseudo, setNeedsFirstLogin } = usePseudoContext();
    const [pseudo, setPseudoInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showProfileDescription, setShowProfileDescription] = useState(false);
    const [profileConfig, setProfileConfig] = useState<any>(null);
    const navigate = useNavigate();

    // Restaurer l'état du tutoriel au montage (en cas de rafraîchissement)
    useEffect(() => {
        const restoreOnboardingState = async () => {
            try {
                const onboardingState = localStorage.getItem(ONBOARDING_STATE_KEY);

                if (onboardingState) {
                    const state = JSON.parse(onboardingState);

                    // Si on était dans le tutoriel, y retourner
                    if (state.step === "tutorial") {
                        const globalStatsManager = new GlobalStatsManager();
                        const data = await globalStatsManager.loadGlobalStats();

                        if (data?.profile) {
                            // Récupérer le profil config
                            const config = await profileService.getProfile(data.profile.profileId);
                            setProfileConfig(config);
                            setShowTutorial(true);
                        }
                    }
                    // Si on était dans la description du profil, y retourner
                    else if (state.step === "profile-description") {
                        const globalStatsManager = new GlobalStatsManager();
                        const data = await globalStatsManager.loadGlobalStats();

                        if (data?.profile) {
                            const config = await profileService.getProfile(data.profile.profileId);
                            setProfileConfig(config);
                            setShowProfileDescription(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la restauration de l'état d'onboarding:", error);
                // En cas d'erreur, nettoyer le localStorage
                localStorage.removeItem(ONBOARDING_STATE_KEY);
            }
        };

        restoreOnboardingState();
    }, []);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Valider que le pseudo n'est pas vide
        if (!pseudo.trim()) {
            return; // Le formulaire HTML empêchera déjà la soumission grâce à "required"
        }

        setIsLoading(true);

        try {
            // 1. Sauvegarder le pseudo (obligatoire)
            await setPseudo(pseudo.trim());

            // 2. Sélectionner et générer le profil
            const config = await profileService.selectRandomProfile();
            const profile = profileService.generateInitialProfile(config);

            // 3. Sauvegarder le profil initial
            const globalStatsManager = new GlobalStatsManager();
            await globalStatsManager.saveGlobalStats(profile.statistics, profile, "initial", false);

            // 4. Stocker la config du profil et afficher le tutoriel
            setProfileConfig(config);

            // Sauvegarder l'état dans le localStorage
            localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify({ step: "tutorial" }));

            setShowTutorial(true);
        } catch (error) {
            console.error("Erreur lors de l'initialisation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTutorialComplete = () => {
        // Quand le tutoriel est terminé, afficher la description du profil

        // Mettre à jour l'état dans le localStorage
        localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify({ step: "profile-description" }));

        setShowTutorial(false);
        setShowProfileDescription(true);
    };

    const handleContinue = async () => {
        // Marquer le profil comme non nouveau
        const globalStatsManager = new GlobalStatsManager();
        const data = await globalStatsManager.loadGlobalStats();
        if (data && data.profile) {
            data.profile.isNewProfile = false;
            await globalStatsManager.saveGlobalStats(data.profile.statistics, data.profile, "initial", false);

            // Nettoyer l'état d'onboarding du localStorage
            localStorage.removeItem(ONBOARDING_STATE_KEY);

            setNeedsFirstLogin(false);
        }

        // Pas besoin de navigate, le guard va automatiquement afficher l'app
    };

    // Page du tutoriel
    if (showTutorial) {
        return <TutorialOnboarding onComplete={handleTutorialComplete} />;
    }

    // Page de description du profil
    if (showProfileDescription && profileConfig) {
        return (
            <LayoutCard>
                <LayoutCardHeader>
                    <h1>{profileConfig.description.title}</h1>
                </LayoutCardHeader>
                <LayoutCardBody>
                    <Markdown>{profileConfig.description.content}</Markdown>

                    <Button
                        color="primary"
                        size="lg"
                        onPress={handleContinue}
                        isLoading={isLoading}
                        className="w-full max-w-2xs mx-auto"
                    >
                        {profileConfig.description.continueButton}
                    </Button>
                </LayoutCardBody>
            </LayoutCard>
        );
    }

    // Page de saisie du pseudo
    return (
        <LayoutCard>
            <LayoutCardHeader>
                <h1>{t("firstLogin.title")}</h1>
            </LayoutCardHeader>
            <LayoutCardBody>
                <Markdown>{t("firstLogin.description")}</Markdown>

                <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mx-auto">
                    <Input
                        label={t("login.form.username.label")}
                        labelPlacement="outside-top"
                        placeholder={t("firstLogin.pseudoPlaceholder")}
                        value={pseudo}
                        onChange={(e) => setPseudoInput(e.target.value)}
                        size="lg"
                        maxLength={50}
                        isDisabled={isLoading}
                        isRequired
                        errorMessage={t("login.form.username.required")}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        color="primary"
                        isLoading={isLoading}
                        isDisabled={isLoading || !pseudo.trim()}
                        className="w-full max-w-2xs mx-auto mt-4"
                    >
                        {t("login.form.submit.label")}
                    </Button>
                </Form>
            </LayoutCardBody>
        </LayoutCard>
    );
};
