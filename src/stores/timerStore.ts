import { create } from 'zustand';
import type { TimerConfig } from '../data/types';

type TimerMode = 'strategy' | 'combat';

interface TimerState {
  config: TimerConfig;
  mode: TimerMode;
  currentPlayerIndex: number;
  turnTimeLeft: number;
  reserveTimeLeft: number[];
  isRunning: boolean;
  playerCount: number;

  setConfig: (config: Partial<TimerConfig>) => void;
  setMode: (mode: TimerMode) => void;
  setPlayerCount: (count: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  nextPlayer: () => void;
  tick: () => void;
  resetTimer: () => void;
}

const DEFAULT_CONFIG: TimerConfig = {
  strategyTurnTime: 120,
  strategyReserve: 600,
  combatTurnTime: 30,
  combatReserve: 120,
};

function getTurnTime(config: TimerConfig, mode: TimerMode): number {
  return mode === 'strategy' ? config.strategyTurnTime : config.combatTurnTime;
}

function getReserveTime(config: TimerConfig, mode: TimerMode): number {
  return mode === 'strategy' ? config.strategyReserve : config.combatReserve;
}

function buildReserveArray(config: TimerConfig, mode: TimerMode, count: number): number[] {
  return Array.from({ length: count }, () => getReserveTime(config, mode));
}

export const useTimerStore = create<TimerState>((set) => ({
  config: DEFAULT_CONFIG,
  mode: 'strategy',
  currentPlayerIndex: 0,
  turnTimeLeft: DEFAULT_CONFIG.strategyTurnTime,
  reserveTimeLeft: buildReserveArray(DEFAULT_CONFIG, 'strategy', 4),
  isRunning: false,
  playerCount: 4,

  setConfig: (partial) =>
    set((state) => {
      const config = { ...state.config, ...partial };
      return {
        config,
        turnTimeLeft: getTurnTime(config, state.mode),
        reserveTimeLeft: buildReserveArray(config, state.mode, state.playerCount),
      };
    }),

  setMode: (mode) =>
    set((state) => ({
      mode,
      currentPlayerIndex: 0,
      turnTimeLeft: getTurnTime(state.config, mode),
      reserveTimeLeft: buildReserveArray(state.config, mode, state.playerCount),
      isRunning: false,
    })),

  setPlayerCount: (count) =>
    set((state) => ({
      playerCount: count,
      currentPlayerIndex: 0,
      turnTimeLeft: getTurnTime(state.config, state.mode),
      reserveTimeLeft: buildReserveArray(state.config, state.mode, count),
      isRunning: false,
    })),

  startTimer: () => set({ isRunning: true }),

  pauseTimer: () => set({ isRunning: false }),

  nextPlayer: () =>
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerCount,
      turnTimeLeft: getTurnTime(state.config, state.mode),
    })),

  tick: () =>
    set((state) => {
      if (!state.isRunning) return state;

      if (state.turnTimeLeft > 0) {
        return { turnTimeLeft: state.turnTimeLeft - 1 };
      }

      // Turn time exhausted — eat into reserve
      const reserve = [...state.reserveTimeLeft];
      const idx = state.currentPlayerIndex;
      if (reserve[idx] > 0) {
        reserve[idx] = reserve[idx] - 1;
        return { reserveTimeLeft: reserve };
      }

      // Reserve also exhausted — stop
      return { isRunning: false };
    }),

  resetTimer: () =>
    set((state) => ({
      currentPlayerIndex: 0,
      turnTimeLeft: getTurnTime(state.config, state.mode),
      reserveTimeLeft: buildReserveArray(state.config, state.mode, state.playerCount),
      isRunning: false,
    })),
}));
