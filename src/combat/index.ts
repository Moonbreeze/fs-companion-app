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
} from './types';

export { calculateDiceCount, calculateTotals, determineWinner, rollDice } from './calculations';

export type { CombatEffect, EffectCondition, UnitFilter, PendingInput, EffectExecutionResult } from './effects';
export { executeEffects } from './effects';

export type { EffectImpact, CardAnalysis } from './analysis';
export { analyzeAvailableCards, meetsRequisite } from './analysis';

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
} from './actions';
