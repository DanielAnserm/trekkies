import type { ProfileConfig, ProfilesData } from "~/models/profile";
import type { PlayerStats, Profile } from "~/models/game";
import { generateTraits } from "../utils/profile/generator";
import traitJson from "../utils/stats/traits.json";

const PROFILES_API_PATH = import.meta.env.VITE_PROFILES_API_PATH || "/api/profiles/profiles.json";

export class ProfileService {
  private static instance: ProfileService;
  private cachedProfiles: ProfilesData | null = null;

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async loadProfiles(): Promise<ProfilesData> {
    if (this.cachedProfiles) {
      return this.cachedProfiles;
    }

    try {
      const response = await fetch(PROFILES_API_PATH, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.cachedProfiles = data;
      return this.cachedProfiles as ProfilesData;
    } catch (error) {
      console.error("Failed to load profiles:", error);
      throw new Error("Unable to load profiles");
    }
  }

  async getProfile(profileId: string): Promise<ProfileConfig | null> {
    const profiles = await this.loadProfiles();
    return profiles.profiles.find(p => p.id === profileId) || null;
  }

  async selectRandomProfile(): Promise<ProfileConfig> {
    const profiles = await this.loadProfiles();
    
    // Calculer le poids total
    const totalWeight = profiles.profiles.reduce((sum, p) => sum + p.weight, 0);
    
    // Sélection pondérée
    let random = Math.random() * totalWeight;
    
    for (const profile of profiles.profiles) {
      random -= profile.weight;
      if (random <= 0) {
        return profile;
      }
    }
    
    // Fallback
    return profiles.profiles[0];
  }

  generateInitialProfile(profileConfig: ProfileConfig): Profile {
    const stats = { ...profileConfig.initialStats };
    
    // Distribution aléatoire des points restants
    const { remaining, stats: allowedStats } = profileConfig.randomDistribution;
    let pointsToDistribute = remaining;
    
    while (pointsToDistribute > 0) {
      const randomStat = allowedStats[Math.floor(Math.random() * allowedStats.length)];
      stats[randomStat]++;
      pointsToDistribute--;
    }

    return {
      statistics: stats,
      interests: [],
      playerParameters: {},
      traits: generateTraits(stats, traitJson.traits),
      isNewProfile: true,
      trophies: [],
      profileId: profileConfig.id,
      profileName: profileConfig.name
    };
  }

  clearCache(): void {
    this.cachedProfiles = null;
  }
}

export const profileService = ProfileService.getInstance();