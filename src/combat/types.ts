import type { FactionId } from '../data/types';

export type { FactionId } from '../data/types';

export type Side = 'attacker' | 'defender';

/** Combat phases matching the game flow. */
export const CombatPhase = ['setup', 'preparation', 'execution', 'resolution'] as const;
export type CombatPhase = (typeof CombatPhase)[number];

/** A single die face result. */
export type DieIcon = 'offence' | 'defence' | 'morale';

/** A unit participating in combat. */
export type CombatUnit = {
  unitId: string;
  state: 'normal' | 'routed';
  isReinforcement: boolean;
};

/** A combat card that has been played this combat. */
export type PlayedCard = {
  cardId: string;
  executionRound: number;
};

/** Current state of one side in combat. */
export type CombatSideState = {
  factionId: FactionId | null;
  units: CombatUnit[];
  hasBastion: boolean;
  bastionDestroyed: boolean;
  /** Current dice results, max 8. */
  dice: DieIcon[];
  playedCards: PlayedCard[];
  /** Temporary tokens cleared at end of each execution round. */
  combatTokens: { offence: number; defence: number };
  reinforcementsUsed: number;
};

/** Full combat state (pure data, no actions). */
export type CombatState = {
  isActive: boolean;
  phase: CombatPhase;
  /** Current execution round (1–3). */
  executionRound: number;
  attacker: CombatSideState;
  defender: CombatSideState;
};

/** Result of tallying all icons for one side. */
export type CombatTotals = {
  /** Dice offence + tokens + played card icons. */
  offence: number;
  /** Dice defence + tokens + played card icons. */
  defence: number;
  /** Dice morale + card icons + unrouted unit morale + bastion morale. */
  morale: number;
};

/** Result of the resolution phase. */
export type CombatResult = {
  attackerMorale: number;
  defenderMorale: number;
  winner: 'attacker' | 'defender';
};
