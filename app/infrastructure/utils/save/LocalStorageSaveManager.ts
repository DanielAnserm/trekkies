import type { SaveData, SaveManager } from "~/models/game";

export class LocalStorageSaveManager implements SaveManager {
    private readonly SAVE_KEY = "trekkie_game_save";
    private readonly CURRENT_VERSION = "1.0.0";

    async save(data: SaveData): Promise<void> {
        try {
            const saveData: SaveData = {
                ...data,
                timestamp: Date.now(),
                version: this.CURRENT_VERSION,
            };

            const serializedData = JSON.stringify(saveData);
            localStorage.setItem(this.SAVE_KEY, serializedData);
            console.log("Game saved successfully");
        } catch (error) {
            console.error("Failed to save game:", error);
            throw new Error("Failed to save game");
        }
    }

    async load(): Promise<SaveData | null> {
        try {
            const serializedData = localStorage.getItem(this.SAVE_KEY);

            if (!serializedData) {
                return null;
            }

            const saveData: SaveData = JSON.parse(serializedData);

            // Vérification de version (optionnel)
            if (saveData.version !== this.CURRENT_VERSION) {
                console.warn("Save version mismatch, but attempting to load anyway");
            }

            console.log("Game loaded successfully");
            return saveData;
        } catch (error) {
            console.error("Failed to load game:", error);
            // En cas d'erreur, on supprime la sauvegarde corrompue
            await this.delete();
            return null;
        }
    }

    async exists(): Promise<boolean> {
        try {
            const serializedData = localStorage.getItem(this.SAVE_KEY);
            return serializedData !== null;
        } catch (error) {
            console.error("Failed to check save existence:", error);
            return false;
        }
    }

    async delete(): Promise<void> {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log("Save deleted successfully");
        } catch (error) {
            console.error("Failed to delete save:", error);
            throw new Error("Failed to delete save");
        }
    }

    async getSaveInfo(): Promise<{ timestamp: number; version: string } | null> {
        try {
            const saveData = await this.load();
            if (!saveData) return null;

            return {
                timestamp: saveData.timestamp,
                version: saveData.version,
            };
        } catch (error) {
            return null;
        }
    }
}
