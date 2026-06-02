import type { CombatCardIcons } from '../../data/types.ts';

/** Min/max change in icons from the card player's perspective. */
export type EffectImpact = {
  /** Change in card player's own offence tokens/dice. */
  offenceMin: number;
  offenceMax: number;
  /** Change in card player's own defence tokens/dice. */
  defenceMin: number;
  defenceMax: number;
  /** Change in card player's morale. */
  moraleMin: number;
  moraleMax: number;
  /** Text notes for effects that can't be expressed numerically. */
  notes: string[];
};

/** Analysis of one card that a side could potentially play. */
export type CardAnalysis = {
  cardId: string;
  cardName: string;
  /** Permanent icons on the card (always applied when played). */
  icons: CombatCardIcons;
  /** Whether the secondary ability can be activated (unitRequisite met). */
  canPlaySecondary: boolean;
  /** Impact of the primary (green) ability — guaranteed if card is played. */
  primary: EffectImpact | null;
  /** Impact of the secondary (brown) ability — only if requisite is met. */
  secondary: EffectImpact | null;
  /** Total worst/best case: icons + primary + secondary (if secondary can be played). */
  total: EffectImpact;
};
