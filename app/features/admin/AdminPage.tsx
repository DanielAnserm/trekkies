import { useState, useEffect } from "react";
import { Button, Input, Spinner, Card, CardBody, Chip, useDisclosure } from "@heroui/react";
import { useAdminContext } from "~/infrastructure/context/AdminContext";
import { adminPlayerService, type PlayerAdminData } from "~/services/adminPlayerService";
import { PlayerEditModal } from "./PlayerEditModal";
import type { PlayerStats } from "~/models/game";
import {
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
    ChartBarIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export const AdminPage = () => {
    const { signOut, adminUser } = useAdminContext();
    const [players, setPlayers] = useState<PlayerAdminData[]>([]);
    const [filteredPlayers, setFilteredPlayers] = useState<PlayerAdminData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerAdminData | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [summary, setSummary] = useState({
        totalPlayers: 0,
        activePlayers: 0,
        averageStats: { character: 0, skills: 0, context: 0, experience: 0 },
        totalPlayTime: 0,
    });

    useEffect(() => {
        loadPlayers();
        loadSummary();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = players.filter((player) =>
                player.pseudonym.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers(players);
        }
    }, [searchTerm, players]);

    const loadPlayers = async () => {
        try {
            setIsLoading(true);
            const data = await adminPlayerService.getAllPlayers();
            setPlayers(data);
            setFilteredPlayers(data);
        } catch (error) {
            console.error("Failed to load players:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSummary = async () => {
        try {
            const data = await adminPlayerService.getPlayersSummary();
            setSummary(data);
        } catch (error) {
            console.error("Failed to load summary:", error);
        }
    };

    const handleEdit = (player: PlayerAdminData) => {
        setSelectedPlayer(player);
        onOpen();
    };

    const handleSave = async (
        uid: string,
        updates: {
            pseudonym?: string;
            stats?: PlayerStats;
            trophies?: string[];
            profileId?: string;
            profileName?: string;
            isGameCompleted?: boolean;
        }
    ) => {
        try {
            if (updates.pseudonym) {
                await adminPlayerService.updatePlayerPseudonym(uid, updates.pseudonym);
            }
            if (updates.stats) {
                await adminPlayerService.updatePlayerStats(uid, updates.stats);
            }
            if (updates.trophies) {
                await adminPlayerService.updatePlayerTrophies(uid, updates.trophies);
            }
            if (updates.profileId && updates.profileName) {
                await adminPlayerService.updatePlayerProfileType(uid, updates.profileId, updates.profileName);
            }
            if (updates.isGameCompleted !== undefined) {
                await adminPlayerService.updatePlayerGameCompletion(uid, updates.isGameCompleted);
            }
            await loadPlayers();
            await loadSummary();
        } catch (error: any) {
            throw error;
        }
    };

    const handleDelete = async (player: PlayerAdminData) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer le joueur "${player.pseudonym}" ?`)) {
            return;
        }

        try {
            await adminPlayerService.deletePlayer(player.uid);
            await loadPlayers();
            await loadSummary();
        } catch (error) {
            console.error("Failed to delete player:", error);
            alert("Erreur lors de la suppression du joueur");
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    const formatPlayTime = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 1000 / 60);
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Panneau d'Administration
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Connecté en tant que: {adminUser?.email}
                            </p>
                        </div>
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={handleSignOut}
                            startContent={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
                        >
                            Se déconnecter
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardBody className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <UserGroupIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Joueurs totaux</p>
                                <p className="text-2xl font-bold">{summary.totalPlayers}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <ChartBarIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Joueurs actifs (24h)</p>
                                <p className="text-2xl font-bold">{summary.activePlayers}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <ClockIcon className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Temps de jeu total</p>
                                <p className="text-2xl font-bold">
                                    {formatPlayTime(summary.totalPlayTime)}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="p-4">
                            <p className="text-sm text-gray-600 mb-2">Stats moyennes</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-500">Pers:</span>{" "}
                                    <span className="font-semibold">
                                        {summary.averageStats.character.toFixed(1)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Comp:</span>{" "}
                                    <span className="font-semibold">
                                        {summary.averageStats.skills.toFixed(1)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Ctx:</span>{" "}
                                    <span className="font-semibold">
                                        {summary.averageStats.context.toFixed(1)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Exp:</span>{" "}
                                    <span className="font-semibold">
                                        {summary.averageStats.experience.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Players Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestion des joueurs</h2>
                        <Button color="primary" onPress={loadPlayers} isDisabled={isLoading}>
                            Rafraîchir
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <Input
                            placeholder="Rechercher un joueur par pseudonyme..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                            size="lg"
                            isClearable
                            onClear={() => setSearchTerm("")}
                        />
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : filteredPlayers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {searchTerm ? "Aucun joueur trouvé" : "Aucun joueur enregistré"}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Pseudonyme
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Stats
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Scénarios
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Temps de jeu
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Dernière activité
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPlayers.map((player) => (
                                        <tr key={player.uid} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {player.pseudonym}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{player.uid}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    <Chip size="sm" variant="flat" color="primary">
                                                        C: {player.stats.character}
                                                    </Chip>
                                                    <Chip size="sm" variant="flat" color="secondary">
                                                        S: {player.stats.skills}
                                                    </Chip>
                                                    <Chip size="sm" variant="flat" color="success">
                                                        Cx: {player.stats.context}
                                                    </Chip>
                                                    <Chip size="sm" variant="flat" color="warning">
                                                        E: {player.stats.experience}
                                                    </Chip>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {player.totalScenarios}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {formatPlayTime(player.totalPlayTime)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(player.lastModifiedAt).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                        isIconOnly
                                                        onPress={() => handleEdit(player)}
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="danger"
                                                        isIconOnly
                                                        onPress={() => handleDelete(player)}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <PlayerEditModal
                isOpen={isOpen}
                onClose={onClose}
                player={selectedPlayer}
                onSave={handleSave}
            />
        </div>
    );
};
