import type { CombatSideState, CombatState, CombatUnit, DieIcon } from './types.ts';

export const makeUnit = (
  unitId: string,
  state: CombatUnit['state'] = 'normal',
  isReinforcement = false,
): CombatUnit => ({
  unitId,
  state,
  isReinforcement,
});

export const makeSide = (
  overrides: Partial<CombatSideState> = {},
): CombatSideState => ({
  factionId: 'ultramarines',
  units: [],
  hasBastion: false,
  bastionDestroyed: false,
  dice: [],
  playedCards: [],
  combatTokens: { offence: 0, defence: 0 },
  reinforcementsUsed: 0,
  ...overrides,
});

export const makeState = (
  overrides: Partial<CombatState> = {},
): CombatState => ({
  isActive: true,
  phase: 'execution',
  executionRound: 1,
  attacker: makeSide({ factionId: 'ultramarines' }),
  defender: makeSide({ factionId: 'chaos' }),
  ...overrides,
});

export const withMockedRandom = async <T>(
  values: number[],
  run: () => Promise<T> | T,
): Promise<T> => {
  const original = Math.random;
  let index = 0;
  Math.random = () => {
    const value = values[index];
    index += 1;
    return value ?? values[values.length - 1] ?? 0;
  };

  try {
    return await run();
  } finally {
    Math.random = original;
  }
};

export const icons = (...dice: DieIcon[]): DieIcon[] => dice;
