import { create } from 'zustand';
import type { FactionId } from '../data/types';

interface PlayerState {
  factionId: FactionId;
  name: string;
  materiel: number;
  assets: number;
}

interface GameState {
  players: PlayerState[];
  currentRound: number;

  addPlayer: (factionId: FactionId, name: string) => void;
  removePlayer: (index: number) => void;
  updateResources: (index: number, materiel: number, assets: number) => void;
  adjustResource: (index: number, resource: 'materiel' | 'assets', delta: number) => void;
  nextRound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  currentRound: 1,

  addPlayer: (factionId, name) =>
    set((state) => ({
      players: [...state.players, { factionId, name, materiel: 0, assets: 0 }],
    })),

  removePlayer: (index) =>
    set((state) => ({
      players: state.players.filter((_, i) => i !== index),
    })),

  updateResources: (index, materiel, assets) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === index ? { ...p, materiel, assets } : p
      ),
    })),

  adjustResource: (index, resource, delta) =>
    set((state) => ({
      players: state.players.map((p, i) =>
        i === index ? { ...p, [resource]: p[resource] + delta } : p
      ),
    })),

  nextRound: () =>
    set((state) => ({ currentRound: state.currentRound + 1 })),

  resetGame: () =>
    set({ players: [], currentRound: 1 }),
}));
