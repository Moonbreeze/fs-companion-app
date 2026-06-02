import { create } from 'zustand';
import type { FactionId, PlayerState, TimerConfig, TerritoryInfo, AssetType } from '../data/types';

// Base combat card IDs per faction (5 unique, each x2 = 10 cards in deck)
const BASE_COMBAT_DECKS: Record<string, string[]> = {
  ultramarines: [
    'um-ambush', 'um-ambush',
    'um-blessed-power-armour', 'um-blessed-power-armour',
    'um-faith-in-the-emperor', 'um-faith-in-the-emperor',
    'um-fury-of-the-ultramar', 'um-fury-of-the-ultramar',
    'um-reconnaissance', 'um-reconnaissance',
  ],
  chaos: [
    'ch-dark-faith', 'ch-dark-faith',
    'ch-foul-worship', 'ch-foul-worship',
    'ch-impure-zeal', 'ch-impure-zeal',
    'ch-khornes-rage', 'ch-khornes-rage',
    'ch-lure-of-chaos', 'ch-lure-of-chaos',
  ],
  orks: [
    'ork-ard-boyz', 'ork-ard-boyz',
    'ork-gretchin', 'ork-gretchin',
    'ork-mek-boyz', 'ork-mek-boyz',
    'ork-shoota-boyz', 'ork-shoota-boyz',
    'ork-slugga-boyz', 'ork-slugga-boyz',
  ],
  eldar: [
    'eld-command-autarch', 'eld-command-autarch',
    'eld-hit-and-run', 'eld-hit-and-run',
    'eld-howling-banshees', 'eld-howling-banshees',
    'eld-ranger-support', 'eld-ranger-support',
    'eld-striking-scorpions', 'eld-striking-scorpions',
  ],
};

const MAX_MATERIEL = 14;
const MAX_ASSET = 3;

function createPlayer(factionId: FactionId, name: string): PlayerState {
  return {
    name,
    factionId,
    materiel: 6, // starting materiel
    assets: { reinforcement: 0, cache: 0, forge: 0 },
    combatDeck: [...(BASE_COMBAT_DECKS[factionId] ?? [])],
    removedFromDeck: [],
    orderUpgrades: [],
    territories: [],
    objectiveTokens: 0,
  };
}

interface SessionState {
  // Session config
  isActive: boolean;
  timerConfig: TimerConfig;
  players: PlayerState[];
  currentRound: number; // 1–8
  firstPlayerIndex: number;

  // Session lifecycle
  startSession: (players: { factionId: FactionId; name: string }[], timerConfig: TimerConfig) => void;
  endSession: () => void;

  // Round management
  nextRound: () => void;

  // Resource management
  setMateriel: (playerIndex: number, value: number) => void;
  adjustMateriel: (playerIndex: number, delta: number) => void;
  setAsset: (playerIndex: number, assetType: AssetType, value: number) => void;
  adjustAsset: (playerIndex: number, assetType: AssetType, delta: number) => void;
  adjustObjectives: (playerIndex: number, delta: number) => void;

  // Territory management
  addTerritory: (playerIndex: number, territory: TerritoryInfo) => void;
  removeTerritory: (playerIndex: number, worldName: string) => void;
  updateTerritory: (playerIndex: number, worldName: string, updates: Partial<TerritoryInfo>) => void;

  // Combat deck management
  purchaseCombatUpgrade: (playerIndex: number, upgradeCardId: string, removedBaseCardId: string) => void;

  // Order upgrade management
  purchaseOrderUpgrade: (playerIndex: number, upgradeId: string) => void;

  // Computed helpers
  getCommandLevel: (playerIndex: number) => number;
  getMaterielIncome: (playerIndex: number) => number;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  isActive: false,
  timerConfig: {
    strategyTurnTime: 120,
    strategyReserve: 600,
    combatTurnTime: 30,
    combatReserve: 120,
  },
  players: [],
  currentRound: 1,
  firstPlayerIndex: 0,

  startSession: (playerConfigs, timerConfig) =>
    set({
      isActive: true,
      timerConfig,
      players: playerConfigs.map((p) => createPlayer(p.factionId, p.name)),
      currentRound: 1,
      firstPlayerIndex: 0,
    }),

  endSession: () =>
    set({
      isActive: false,
      players: [],
      currentRound: 1,
      firstPlayerIndex: 0,
    }),

  nextRound: () =>
    set((state) => ({
      currentRound: Math.min(state.currentRound + 1, 8),
      firstPlayerIndex: (state.firstPlayerIndex + 1) % state.players.length,
    })),

  setMateriel: (playerIndex, value) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex ? { ...p, materiel: Math.max(0, Math.min(MAX_MATERIEL, value)) } : p
      ),
    })),

  adjustMateriel: (playerIndex, delta) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, materiel: Math.max(0, Math.min(MAX_MATERIEL, p.materiel + delta)) }
          : p
      ),
    })),

  setAsset: (playerIndex, assetType, value) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, assets: { ...p.assets, [assetType]: Math.max(0, Math.min(MAX_ASSET, value)) } }
          : p
      ),
    })),

  adjustAsset: (playerIndex, assetType, delta) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              assets: {
                ...p.assets,
                [assetType]: Math.max(0, Math.min(MAX_ASSET, p.assets[assetType] + delta)),
              },
            }
          : p
      ),
    })),

  adjustObjectives: (playerIndex, delta) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex ? { ...p, objectiveTokens: Math.max(0, p.objectiveTokens + delta) } : p
      ),
    })),

  addTerritory: (playerIndex, territory) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex ? { ...p, territories: [...p.territories, territory] } : p
      ),
    })),

  removeTerritory: (playerIndex, worldName) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, territories: p.territories.filter((t) => t.worldName !== worldName) }
          : p
      ),
    })),

  updateTerritory: (playerIndex, worldName, updates) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? {
              ...p,
              territories: p.territories.map((t) =>
                t.worldName === worldName ? { ...t, ...updates } : t
              ),
            }
          : p
      ),
    })),

  purchaseCombatUpgrade: (playerIndex, upgradeCardId, removedBaseCardId) =>
    set((state) => ({
      players: state.players.map((p, i) => {
        if (i !== playerIndex) return p;
        // Remove 2 copies of the base card, add 2 copies of upgrade
        let removedCount = 0;
        const newDeck = p.combatDeck.filter((id) => {
          if (id === removedBaseCardId && removedCount < 2) {
            removedCount++;
            return false;
          }
          return true;
        });
        newDeck.push(upgradeCardId, upgradeCardId);
        return {
          ...p,
          combatDeck: newDeck,
          removedFromDeck: [...p.removedFromDeck, removedBaseCardId],
        };
      }),
    })),

  purchaseOrderUpgrade: (playerIndex, upgradeId) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === playerIndex
          ? { ...p, orderUpgrades: [...p.orderUpgrades, upgradeId] }
          : p
      ),
    })),

  getCommandLevel: (playerIndex) => {
    const player = get().players[playerIndex];
    if (!player) return 0;
    return player.territories.filter((t) => t.structure === 'city').length;
  },

  getMaterielIncome: (playerIndex) => {
    const player = get().players[playerIndex];
    if (!player) return 0;
    return player.territories.reduce((sum, t) => sum + t.materielValue, 0);
  },
}));
