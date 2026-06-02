import type { DieIcon, Side } from '../types.ts';

// --- Unit filter ---

/**
 * Filter for selecting units in combat.
 * Compound combines multiple filters with AND logic.
 */
export type UnitFilter =
  | { type: 'byName'; names: string[] }
  | { type: 'byTier'; tier: number }
  | { type: 'unrouted' }
  | { type: 'routed' }
  | { type: 'reinforcement' }
  | { type: 'compound'; filters: UnitFilter[] };

// --- Effect conditions ---

export type EffectCondition =
  | { type: 'isAttacker' }
  | { type: 'isDefender' }
  /** Player has more morale dice than opponent (before card icons). */
  | { type: 'moreMoraleDice' }
  | { type: 'enemyHasRoutedUnit' }
  | { type: 'moreUnroutedUnits' }
  | { type: 'hasUnit'; unitFilter: UnitFilter };

// --- Pending input descriptors (returned by executor when input is needed) ---

export type PendingInput =
  | { type: 'chooseDice'; target: Side; amount: number; action: 'reroll' | 'convert'; convertTo?: DieIcon }
  | { type: 'chooseUnit'; target: Side; action: 'route' | 'rally' | 'destroy' | 'retreat' }
  | { type: 'chooseTokenType'; amount: number }
  | { type: 'chooseCard'; source: 'hand' | 'faceup' }
  | { type: 'chooseBranch'; optionA: string; optionB: string };

// --- Atomic combat effects ---

/**
 * Atomic effect primitives.
 * Composed into sequences to describe a card's full effect.
 */
export type CombatEffect =
  // --- Offence tokens ---
  | { type: 'gainOffenceTokens'; amount: number }
  | { type: 'loseOffenceTokens'; target: 'self' | 'enemy'; amount: number }

  // --- Defence tokens ---
  | { type: 'gainDefenceTokens'; amount: number }
  | { type: 'loseDefenceTokens'; target: 'self' | 'enemy'; amount: number }

  // --- Dice ---
  | { type: 'gainDie'; icon: DieIcon | 'random' }
  | { type: 'gainDice'; icon: DieIcon | 'random'; amount: number }
  | { type: 'loseDie'; target: 'self' | 'enemy'; icon: DieIcon | 'any'; amount: number }
  | { type: 'convertDice'; target: 'self' | 'enemy'; from: DieIcon | 'any'; to: DieIcon; amount: number }
  | { type: 'rerollDice'; target: 'self' | 'enemy' | 'both'; icon: DieIcon | 'all'; amount: number | 'all' }

  // --- Units ---
  | { type: 'routeUnit'; target: 'self' | 'enemy'; choice: 'self' | 'enemy' }
  | { type: 'rallyUnit'; amount: number }
  | { type: 'rallyAll' }
  | { type: 'destroyUnit'; target: 'self' | 'enemy'; choice: 'self' | 'enemy' }
  | { type: 'routeAllByTier'; target: 'enemy'; tier: number }
  | { type: 'placeReinforcement' }
  | { type: 'preventRouting' }
  | { type: 'preventDamage' }

  // --- Token denial ---
  | { type: 'denyTokenGain'; target: 'self' | 'enemy'; tokenType: 'offence' | 'defence' }

  // --- Conditional ---
  | { type: 'conditional'; condition: EffectCondition; then: CombatEffect[]; else?: CombatEffect[] }

  // --- Branches ---
  /** Enemy chooses which option applies (for analysis: both branches evaluated). */
  | { type: 'enemyChoice'; optionA: CombatEffect[]; optionB: CombatEffect[] }
  /** Card player chooses which option applies (for analysis: optimal branch assumed). */
  | { type: 'selfChoice'; optionA: CombatEffect[]; optionB: CombatEffect[] }

  // --- Scaling ---
  /** Apply effect once per unit of the specified side matching the filter. */
  | { type: 'perUnit'; side: 'self' | 'enemy'; unitFilter: UnitFilter; effect: CombatEffect }
  | { type: 'perDie'; dieIcon: DieIcon; effect: CombatEffect }
  /** Spend any number of dice of dieIcon; for each die spent, apply effect. */
  | { type: 'spendDiceForEffect'; dieIcon: DieIcon; effect: CombatEffect }

  // --- User input required ---
  | { type: 'userChooseDice'; target: 'self' | 'enemy'; amount: number; action: 'reroll' | 'convert'; convertTo?: DieIcon }
  | { type: 'userChooseUnit'; target: 'self' | 'enemy'; action: 'route' | 'rally' | 'destroy' | 'retreat' }
  | { type: 'userChooseTokenType'; amount: number }

  // --- Special card mechanics ---
  | { type: 'discardEnemyCard'; source: 'hand' | 'faceup'; choice: 'self' | 'enemy' | 'random' }
  | { type: 'drawCombatCard' }
  /** Play an extra card from hand, gaining only its icons (no abilities). */
  | { type: 'playExtraCard'; iconsOnly: boolean }
  /** Resolve one additional assess-damage step this round. */
  | { type: 'extraDamageStep' }
  /** Each time enemy gains (g) or (s) this combat, you gain the same. */
  | { type: 'mirrorTokens' }
  | { type: 'upgradeUnit'; from: string; to: string }
  | { type: 'moveUnit'; scope: 'any' | 'adjacent' }
  | { type: 'spendDiceForTokens'; dieIcon: DieIcon; tokensPerDie: number; tokenType: 'offence' | 'defence' }

  // --- Board / out-of-combat effects ---
  /** Effect on the game board that cannot be applied in the app. Displayed as text only. */
  | { type: 'boardEffect'; description: string };
