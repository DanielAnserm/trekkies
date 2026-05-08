import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    CheckboxGroup,
    Checkbox,
    Switch,
} from "@heroui/react";
import type { PlayerAdminData } from "~/services/adminPlayerService";
import type { PlayerStats } from "~/models/game";
import { statsService } from "~/services/statsService";
import { TROPHIES } from "~/features/adventure/TrophyCard";
import { useTranslation } from "react-i18next";
import { profileService } from "~/infrastructure/services/profileService";
import type { ProfileConfig } from "~/models/profile";

interface PlayerEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: PlayerAdminData | null;
    onSave: (
        uid: string,
        updates: {
            pseudonym?: string;
            stats?: PlayerStats;
            trophies?: string[];
            profileId?: string;
            profileName?: string;
            isGameCompleted?: boolean;
        }
    ) => Promise<void>;
}

export const PlayerEditModal = ({ isOpen, onClose, player, onSave }: PlayerEditModalProps) => {
    const { t } = useTranslation();
    const [pseudonym, setPseudonym] = useState("");
    const [stats, setStats] = useState<PlayerStats>({
        character: 0,
        skills: 0,
        context: 0,
        experience: 0,
    });
    const [trophies, setTrophies] = useState<string[]>([]);
    const [profileId, setProfileId] = useState("");
    const [profileName, setProfileName] = useState("");
    const [isGameCompleted, setIsGameCompleted] = useState(false);
    const [availableProfiles, setAvailableProfiles] = useState<ProfileConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState("");

    // Charger les profils disponibles
    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const profilesData = await profileService.loadProfiles();
                setAvailableProfiles(profilesData.profiles);
            } catch (error) {
                console.error("Failed to load profiles:", error);
            }
        };

        loadProfiles();
    }, []);

    useEffect(() => {
        const loadPlayerData = async () => {
            if (player) {
                setPseudonym(player.pseudonym);
                setStats(player.stats);

                // Charger les trophées et le profil depuis Firestore
                setIsLoadingData(true);
                try {
                    const fullStats = await statsService.getPlayerStats(player.uid);
                    if (fullStats && fullStats.currentProfile) {
                        setTrophies(fullStats.currentProfile.trophies || []);
                        setProfileId(fullStats.currentProfile.profileId || "");
                        setProfileName(fullStats.currentProfile.profileName || "");
                        setIsGameCompleted(fullStats.currentProfile.isGameCompleted || false);
                    }
                } catch (error) {
                    console.error("Failed to load player data:", error);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        loadPlayerData();
    }, [player]);

    const handleSave = async () => {
        if (!player) return;

        if (!pseudonym.trim()) {
            setError("Le pseudonyme ne peut pas être vide");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await onSave(player.uid, {
                pseudonym: pseudonym.trim(),
                stats,
                trophies,
                profileId,
                profileName,
                isGameCompleted,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileChange = (selectedId: string) => {
        const profile = availableProfiles.find(p => p.id === selectedId);
        if (profile) {
            setProfileId(profile.id);
            setProfileName(profile.name);
        }
    };

    const handleStatChange = (stat: keyof PlayerStats, value: string) => {
        const numValue = parseInt(value) || 0;
        setStats(prev => ({
            ...prev,
            [stat]: numValue,
        }));
    };

    if (!player) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader>
                    <h2 className="text-xl font-bold">Modifier le joueur</h2>
                </ModalHeader>
                <ModalBody>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Pseudonyme */}
                        <Input
                            label="Pseudonyme"
                            labelPlacement="outside"
                            placeholder="Pseudonyme du joueur"
                            value={pseudonym}
                            onChange={(e) => setPseudonym(e.target.value)}
                        />

                        {/* Type de profil */}
                        {isLoadingData ? (
                            <p className="text-gray-500 text-sm">Chargement du profil...</p>
                        ) : (
                            <Select
                                label="Type de profil"
                                labelPlacement="outside"
                                placeholder="Sélectionner un type de profil"
                                selectedKeys={profileId ? [profileId] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as string;
                                    if (selected) handleProfileChange(selected);
                                }}
                            >
                                {availableProfiles.map((profile) => (
                                    <SelectItem key={profile.id} value={profile.id}>
                                        {profile.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        )}

                        {/* Stats */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Statistiques</h3>

                            <Input
                                label="Caractère"
                                labelPlacement="outside"
                                type="number"
                                min="0"
                                value={stats.character.toString()}
                                onChange={(e) => handleStatChange("character", e.target.value)}
                            />

                            <Input
                                label="Compétences"
                                labelPlacement="outside"
                                type="number"
                                min="0"
                                value={stats.skills.toString()}
                                onChange={(e) => handleStatChange("skills", e.target.value)}
                            />

                            <Input
                                label="Contexte"
                                labelPlacement="outside"
                                type="number"
                                min="0"
                                value={stats.context.toString()}
                                onChange={(e) => handleStatChange("context", e.target.value)}
                            />

                            <Input
                                label="Expérience"
                                labelPlacement="outside"
                                type="number"
                                min="0"
                                value={stats.experience.toString()}
                                onChange={(e) => handleStatChange("experience", e.target.value)}
                            />
                        </div>

                        {/* Trophées */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Trophées</h3>

                            {isLoadingData ? (
                                <p className="text-gray-500 text-sm">Chargement...</p>
                            ) : (
                                <CheckboxGroup
                                    value={trophies}
                                    onValueChange={setTrophies}
                                >
                                    {TROPHIES.map((trophy) => (
                                        <Checkbox key={trophy.key} value={trophy.key}>
                                            {t(`profile.trophy.${trophy.key}`, trophy.key)}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            )}
                        </div>

                        {/* Statut de complétion du jeu */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Statut de complétion</h3>

                            {isLoadingData ? (
                                <p className="text-gray-500 text-sm">Chargement...</p>
                            ) : (
                                <Switch
                                    isSelected={isGameCompleted}
                                    onValueChange={setIsGameCompleted}
                                >
                                    Jeu terminé
                                </Switch>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        Annuler
                    </Button>
                    <Button color="primary" onPress={handleSave} isLoading={isLoading}>
                        Enregistrer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
