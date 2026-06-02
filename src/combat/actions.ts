import type { FactionId } from '../data/types.ts';
import type { CombatState, CombatSideState, Side, DieIcon } from './types.ts';

const freshSide = (): CombatSideState => ({
  factionId: null,
  units: [],
  hasBastion: false,
  bastionDestroyed: false,
  dice: [],
  playedCards: [],
  combatTokens: { offence: 0, defence: 0 },
  reinforcementsUsed: 0,
});

/** Immutably update one side of combat state. */
const updateSide = (
  state: CombatState,
  side: Side,
  updater: (s: CombatSideState) => Partial<CombatSideState>,
): CombatState => {
  const current = state[side];
  return { ...state, [side]: { ...current, ...updater(current) } };
};

/** Return the initial inactive combat state. */
export const endCombat = (): CombatState => ({
  isActive: false,
  phase: 'setup',
  executionRound: 1,
  attacker: freshSide(),
  defender: freshSide(),
});

/** Start a fresh combat between two factions. */
export const startCombat = (
  attackerFaction: FactionId,
  defenderFaction: FactionId,
): CombatState => ({
  isActive: true,
  phase: 'setup',
  executionRound: 1,
  attacker: { ...freshSide(), factionId: attackerFaction },
  defender: { ...freshSide(), factionId: defenderFaction },
});

/** Add a unit to a side. */
export const addUnit = (state: CombatState, side: Side, unitId: string): CombatState =>
  updateSide(state, side, (s) => ({
    units: [...s.units, { unitId, state: 'normal', isReinforcement: false }],
  }));

/** Remove a unit by index. */
export const removeUnit = (state: CombatState, side: Side, index: number): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.filter((_, i) => i !== index),
  }));

/** Route a unit by index. */
export const routeUnit = (state: CombatState, side: Side, index: number): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.map((u, i) => (i === index ? { ...u, state: 'routed' as const } : u)),
  }));

/** Rally a routed unit by index. */
export const rallyUnit = (state: CombatState, side: Side, index: number): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.map((u, i) => (i === index ? { ...u, state: 'normal' as const } : u)),
  }));

/** Rally all units on a side. */
export const rallyAll = (state: CombatState, side: Side): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.map((u) => ({ ...u, state: 'normal' as const })),
  }));

/** Destroy (remove) a unit by index. */
export const destroyUnit = (state: CombatState, side: Side, index: number): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.filter((_, i) => i !== index),
  }));

/** Set whether a side has a bastion. */
export const setBastion = (state: CombatState, side: Side, hasBastion: boolean): CombatState =>
  updateSide(state, side, () => ({ hasBastion, bastionDestroyed: false }));

/** Mark a bastion as destroyed. */
export const destroyBastion = (state: CombatState, side: Side): CombatState =>
  updateSide(state, side, () => ({ hasBastion: false, bastionDestroyed: true }));

/** Add a reinforcement token unit to a side. */
export const addReinforcement = (state: CombatState, side: Side): CombatState =>
  updateSide(state, side, (s) => ({
    units: [...s.units, { unitId: 'reinforcement', state: 'normal', isReinforcement: true }],
    reinforcementsUsed: s.reinforcementsUsed + 1,
  }));

/** Remove a reinforcement token by index. */
export const removeReinforcement = (
  state: CombatState,
  side: Side,
  index: number,
): CombatState =>
  updateSide(state, side, (s) => ({
    units: s.units.filter((_, i) => i !== index),
    reinforcementsUsed: Math.max(0, s.reinforcementsUsed - 1),
  }));

/** Replace the dice pool for a side. */
export const setDice = (state: CombatState, side: Side, dice: DieIcon[]): CombatState =>
  updateSide(state, side, () => ({ dice }));

/** Add one die to a side's pool (max 8). */
export const addDie = (state: CombatState, side: Side, icon: DieIcon): CombatState =>
  updateSide(state, side, (s) => ({
    dice: s.dice.length < 8 ? [...s.dice, icon] : s.dice,
  }));

/** Remove a die by index. */
export const removeDie = (state: CombatState, side: Side, index: number): CombatState =>
  updateSide(state, side, (s) => ({
    dice: s.dice.filter((_, i) => i !== index),
  }));

/** Convert a die to a new icon. */
export const convertDie = (
  state: CombatState,
  side: Side,
  index: number,
  newIcon: DieIcon,
): CombatState =>
  updateSide(state, side, (s) => ({
    dice: s.dice.map((d, i) => (i === index ? newIcon : d)),
  }));

/** Set both combat token values for a side. */
export const setCombatTokens = (
  state: CombatState,
  side: Side,
  offence: number,
  defence: number,
): CombatState =>
  updateSide(state, side, () => ({ combatTokens: { offence, defence } }));

/** Adjust a combat token count by delta (clamped to ≥ 0). */
export const adjustCombatTokens = (
  state: CombatState,
  side: Side,
  tokenType: 'offence' | 'defence',
  delta: number,
): CombatState =>
  updateSide(state, side, (s) => ({
    combatTokens: {
      ...s.combatTokens,
      [tokenType]: Math.max(0, s.combatTokens[tokenType] + delta),
    },
  }));

/** Record a played card for a side. */
export const playCard = (state: CombatState, side: Side, cardId: string): CombatState =>
  updateSide(state, side, (s) => ({
    playedCards: [...s.playedCards, { cardId, executionRound: state.executionRound }],
  }));

/** Remove a played card by index. */
export const discardPlayedCard = (
  state: CombatState,
  side: Side,
  index: number,
): CombatState =>
  updateSide(state, side, (s) => ({
    playedCards: s.playedCards.filter((_, i) => i !== index),
  }));

/** Advance to the next execution round, clearing combat tokens. */
export const nextExecutionRound = (state: CombatState): CombatState => ({
  ...state,
  executionRound: Math.min(state.executionRound + 1, 3),
  attacker: { ...state.attacker, combatTokens: { offence: 0, defence: 0 } },
  defender: { ...state.defender, combatTokens: { offence: 0, defence: 0 } },
});
