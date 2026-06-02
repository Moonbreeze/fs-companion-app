export type {
  Side,
  CombatPhase,
  DieIcon,
  CombatUnit,
  PlayedCard,
  CombatSideState,
  CombatState,
  CombatTotals,
  CombatResult,
} from './types.ts';

export { calculateDiceCount, calculateTotals, determineWinner, rollDice } from './calculations.ts';

export type { CombatEffect, EffectCondition, UnitFilter, PendingInput, EffectExecutionResult } from './effects/index.ts';
export { executeEffects } from './effects/index.ts';

export type { EffectImpact, CardAnalysis } from './analysis/index.ts';
export { analyzeAvailableCards, meetsRequisite } from './analysis/index.ts';

export {
  endCombat,
  startCombat,
  addUnit,
  removeUnit,
  routeUnit,
  rallyUnit,
  rallyAll,
  destroyUnit,
  setBastion,
  destroyBastion,
  addReinforcement,
  removeReinforcement,
  setDice,
  addDie,
  removeDie,
  convertDie,
  setCombatTokens,
  adjustCombatTokens,
  playCard,
  discardPlayedCard,
  nextExecutionRound,
} from './actions.ts';
