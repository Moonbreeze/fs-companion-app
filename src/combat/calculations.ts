import { unitsById, bastions, combatCardsById } from '../data/index.ts';
import type { FactionId } from '../data/types.ts';
import type { CombatUnit, CombatSideState, DieIcon, CombatTotals, CombatResult } from './types.ts';

/**
 * Calculate number of dice for a side.
 * Sum of unrouted non-reinforcement unit combat values + bastion, capped at 8.
 */
export const calculateDiceCount = (
  units: CombatUnit[],
  hasBastion: boolean,
  factionId: FactionId | null,
): number => {
  let total = units
    .filter((u) => u.state === 'normal' && !u.isReinforcement)
    .reduce((sum, u) => {
      const unitDef = unitsById[u.unitId];
      return sum + (unitDef?.combatValue ?? 0);
    }, 0);

  if (hasBastion && factionId) {
    const bastion = bastions[factionId];
    if (bastion) total += bastion.combatValue;
  }

  return Math.min(total, 8);
};

/**
 * Tally all offence, defence, and morale icons for one side.
 * Includes dice, played card icons, combat tokens, unit morale, and bastion morale.
 */
export const calculateTotals = (side: CombatSideState): CombatTotals => {
  const diceOffence = side.dice.filter((d) => d === 'offence').length;
  const diceDefence = side.dice.filter((d) => d === 'defence').length;
  const diceMorale = side.dice.filter((d) => d === 'morale').length;

  const cardOffence = side.playedCards.reduce(
    (sum, pc) => sum + (combatCardsById[pc.cardId]?.icons.offence ?? 0),
    0,
  );
  const cardDefence = side.playedCards.reduce(
    (sum, pc) => sum + (combatCardsById[pc.cardId]?.icons.defence ?? 0),
    0,
  );
  const cardMorale = side.playedCards.reduce(
    (sum, pc) => sum + (combatCardsById[pc.cardId]?.icons.morale ?? 0),
    0,
  );

  const unitMorale = side.units
    .filter((u) => u.state === 'normal' && !u.isReinforcement)
    .reduce((sum, u) => sum + (unitsById[u.unitId]?.morale ?? 0), 0);

  const bastionMorale =
    side.hasBastion && !side.bastionDestroyed && side.factionId
      ? (bastions[side.factionId]?.morale ?? 0)
      : 0;

  return {
    offence: diceOffence + cardOffence + side.combatTokens.offence,
    defence: diceDefence + cardDefence + side.combatTokens.defence,
    morale: diceMorale + cardMorale + unitMorale + bastionMorale,
  };
};

/**
 * Determine the winner by morale totals. Defender wins ties.
 */
export const determineWinner = (
  attacker: CombatSideState,
  defender: CombatSideState,
): CombatResult => {
  const attackerMorale = calculateTotals(attacker).morale;
  const defenderMorale = calculateTotals(defender).morale;
  return {
    attackerMorale,
    defenderMorale,
    winner: attackerMorale > defenderMorale ? 'attacker' : 'defender',
  };
};

const DIE_ICONS: DieIcon[] = ['offence', 'defence', 'morale'];

/** Roll N random dice. */
export const rollDice = (count: number): DieIcon[] =>
  Array.from({ length: count }, () => DIE_ICONS[Math.floor(Math.random() * 3)]);
