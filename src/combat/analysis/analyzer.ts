import { combatCardsById, getCombatCardsForFaction, unitsById } from '../../data/index.ts';
import type { CombatCard } from '../../data/types.ts';
import type { CombatState, Side } from '../types.ts';
import type { CombatEffect, EffectCondition, UnitFilter } from '../effects/types.ts';
import type { EffectImpact, CardAnalysis } from './types.ts';
import { meetsRequisite } from './requisiteCheck.ts';

// --- Helpers ---

const zero = (): EffectImpact => ({
  offenceMin: 0, offenceMax: 0,
  defenceMin: 0, defenceMax: 0,
  moraleMin: 0, moraleMax: 0,
  notes: [],
});

const add = (a: EffectImpact, b: EffectImpact): EffectImpact => ({
  offenceMin: a.offenceMin + b.offenceMin,
  offenceMax: a.offenceMax + b.offenceMax,
  defenceMin: a.defenceMin + b.defenceMin,
  defenceMax: a.defenceMax + b.defenceMax,
  moraleMin: a.moraleMin + b.moraleMin,
  moraleMax: a.moraleMax + b.moraleMax,
  notes: [...a.notes, ...b.notes],
});

/** Min of two impacts (worst case from card player's perspective). */
const minImpact = (a: EffectImpact, b: EffectImpact): EffectImpact => ({
  offenceMin: Math.min(a.offenceMin, b.offenceMin),
  offenceMax: Math.min(a.offenceMax, b.offenceMax),
  defenceMin: Math.min(a.defenceMin, b.defenceMin),
  defenceMax: Math.min(a.defenceMax, b.defenceMax),
  moraleMin: Math.min(a.moraleMin, b.moraleMin),
  moraleMax: Math.min(a.moraleMax, b.moraleMax),
  notes: [...a.notes, ...b.notes],
});

/** Max of two impacts (best case from card player's perspective). */
const maxImpact = (a: EffectImpact, b: EffectImpact): EffectImpact => ({
  offenceMin: Math.max(a.offenceMin, b.offenceMin),
  offenceMax: Math.max(a.offenceMax, b.offenceMax),
  defenceMin: Math.max(a.defenceMin, b.defenceMin),
  defenceMax: Math.max(a.defenceMax, b.defenceMax),
  moraleMin: Math.max(a.moraleMin, b.moraleMin),
  moraleMax: Math.max(a.moraleMax, b.moraleMax),
  notes: [...a.notes, ...b.notes],
});

const combineRange = (
  minImpactA: EffectImpact,
  maxImpactA: EffectImpact,
): EffectImpact => ({
  offenceMin: minImpactA.offenceMin,
  offenceMax: maxImpactA.offenceMax,
  defenceMin: minImpactA.defenceMin,
  defenceMax: maxImpactA.defenceMax,
  moraleMin: minImpactA.moraleMin,
  moraleMax: maxImpactA.moraleMax,
  notes: [...minImpactA.notes, ...maxImpactA.notes].filter(
    (n, i, arr) => arr.indexOf(n) === i,
  ),
});

// --- Condition evaluation (static) ---

const checkCondition = (
  condition: EffectCondition,
  state: CombatState,
  side: Side,
): boolean => {
  const self = state[side];
  const enemy = state[side === 'attacker' ? 'defender' : 'attacker'];

  switch (condition.type) {
    case 'isAttacker': return side === 'attacker';
    case 'isDefender': return side === 'defender';
    case 'moreMoraleDice': {
      const selfM = self.dice.filter((d) => d === 'morale').length;
      const enemyM = enemy.dice.filter((d) => d === 'morale').length;
      return selfM > enemyM;
    }
    case 'enemyHasRoutedUnit':
      return enemy.units.some((u) => u.state === 'routed');
    case 'moreUnroutedUnits': {
      const selfU = self.units.filter((u) => u.state === 'normal').length;
      const enemyU = enemy.units.filter((u) => u.state === 'normal').length;
      return selfU > enemyU;
    }
    case 'hasUnit': {
      return self.units.some((u) =>
        matchesFilter(u.unitId, u.state === 'normal', u.isReinforcement, condition.unitFilter)
      );
    }
  }
};

// --- Unit filter ---

const matchesFilter = (
  unitId: string,
  isUnrouted: boolean,
  isReinforcement: boolean,
  filter: UnitFilter,
): boolean => {
  const def = unitsById[unitId];
  switch (filter.type) {
    case 'byName': return def ? filter.names.some((n) => def.name.includes(n)) : false;
    case 'byTier': return def ? def.commandLevel === filter.tier : false;
    case 'unrouted': return isUnrouted;
    case 'routed': return !isUnrouted;
    case 'reinforcement': return isReinforcement;
    case 'compound': return filter.filters.every((f) =>
      matchesFilter(unitId, isUnrouted, isReinforcement, f)
    );
  }
};

const countUnits = (state: CombatState, side: Side, filter: UnitFilter): number =>
  state[side].units.filter((u) =>
    matchesFilter(u.unitId, u.state === 'normal', u.isReinforcement, filter)
  ).length;

// --- Core impact analyzer ---

const analyzeEffects = (
  effects: CombatEffect[],
  state: CombatState,
  side: Side,
): EffectImpact => {
  return effects.reduce((acc, eff) => add(acc, analyzeEffect(eff, state, side)), zero());
};

const analyzeEffect = (
  effect: CombatEffect,
  state: CombatState,
  side: Side,
): EffectImpact => {
  const enemySide: Side = side === 'attacker' ? 'defender' : 'attacker';

  switch (effect.type) {
    // --- Certain tokens/dice gains ---
    case 'gainOffenceTokens':
      return { ...zero(), offenceMin: effect.amount, offenceMax: effect.amount };
    case 'gainDefenceTokens':
      return { ...zero(), defenceMin: effect.amount, defenceMax: effect.amount };

    case 'loseOffenceTokens': {
      if (effect.target === 'enemy') {
        // Enemy loses offence → note it (doesn't change self icons)
        return { ...zero(), notes: [`Enemy loses ${effect.amount} offence token(s)`] };
      }
      return { ...zero(), offenceMin: -effect.amount, offenceMax: -effect.amount };
    }

    case 'loseDefenceTokens': {
      if (effect.target === 'enemy') {
        return { ...zero(), notes: [`Enemy loses ${effect.amount} defence token(s)`] };
      }
      return { ...zero(), defenceMin: -effect.amount, defenceMax: -effect.amount };
    }

    case 'gainDie': {
      if (effect.icon === 'random') {
        // Any icon — best case = best icon for our side, worst case = worst icon
        return combineRange(
          { ...zero(), offenceMin: 0, defenceMin: 0, moraleMin: 0 },
          { ...zero(), offenceMax: 1, defenceMax: 1, moraleMax: 1, notes: ['Gain 1 random die'] },
        );
      }
      const k = effect.icon === 'offence' ? 'offence' : effect.icon === 'defence' ? 'defence' : 'morale';
      const val: EffectImpact = zero();
      return { ...val, [`${k}Min`]: 1, [`${k}Max`]: 1 } as EffectImpact;
    }

    case 'gainDice': {
      if (effect.icon === 'random') {
        return {
          ...zero(),
          offenceMin: 0, offenceMax: effect.amount,
          defenceMin: 0, defenceMax: effect.amount,
          moraleMin: 0, moraleMax: effect.amount,
          notes: [`Gain ${effect.amount} random dice`],
        };
      }
      const k = effect.icon === 'offence' ? 'offence' : effect.icon === 'defence' ? 'defence' : 'morale';
      return { ...zero(), [`${k}Min`]: effect.amount, [`${k}Max`]: effect.amount } as EffectImpact;
    }

    case 'loseDie': {
      const target = effect.target === 'self' ? side : enemySide;
      const pool = state[target].dice;
      const count = Math.min(
        effect.amount,
        effect.icon === 'any' ? pool.length : pool.filter((d) => d === effect.icon).length,
      );
      if (count === 0) return zero();
      if (effect.target === 'enemy') {
        return { ...zero(), notes: [`Enemy loses ${count} die/dice`] };
      }
      // Self loses a die — worst case = lose best icon, but we don't know which, so just note it
      return { ...zero(), notes: [`Lose ${count} die/dice`] };
    }

    case 'convertDice': {
      const target = effect.target === 'self' ? side : enemySide;
      const pool = state[target].dice;
      const count = Math.min(
        effect.amount,
        effect.from === 'any' ? pool.length : pool.filter((d) => d === effect.from).length,
      );
      if (count === 0) return zero();
      if (target === side) {
        // Converting self dice: subtract the "from" type, add the "to" type
        const fromKey = effect.from === 'any' ? null : effect.from;
        const toKey = effect.to;
        const result = zero();
        if (fromKey) {
          result[`${fromKey}Min` as keyof EffectImpact] = -count as never;
          result[`${fromKey}Max` as keyof EffectImpact] = -count as never;
        }
        result[`${toKey}Min` as keyof EffectImpact] = count as never;
        result[`${toKey}Max` as keyof EffectImpact] = count as never;
        return result;
      }
      return { ...zero(), notes: [`Convert ${count} enemy dice to [${effect.to}]`] };
    }

    case 'rerollDice': {
      const targets = effect.target === 'both' ? [side, enemySide] : [effect.target === 'self' ? side : enemySide];
      let impact = zero();
      for (const target of targets) {
        const pool = state[target].dice;
        const count = effect.amount === 'all'
          ? (effect.icon === 'all' ? pool.length : pool.filter((d) => d === effect.icon).length)
          : Math.min(effect.amount, effect.icon === 'all' ? pool.length : pool.filter((d) => d === effect.icon).length);
        if (count === 0) continue;
        if (target === side) {
          // Rerolling own dice is risky — could lose the icon
          if (effect.icon !== 'all') {
            const k = effect.icon;
            impact = add(impact, combineRange(
              { ...zero(), [`${k}Min`]: -count } as EffectImpact,
              zero(),
            ));
          } else {
            impact = add(impact, { ...zero(), notes: [`Reroll ${count} of own dice`] });
          }
        } else {
          // Rerolling enemy dice — enemy might lose their icon
          const label = effect.icon === 'all' ? '' : ` [${effect.icon}]`;
          impact = add(impact, { ...zero(), notes: [`Enemy rerolls ${count}${label} dice`] });
        }
      }
      return impact;
    }

    // --- Units ---
    case 'routeUnit': {
      const target = effect.target === 'self' ? side : enemySide;
      return {
        ...zero(),
        notes: [target === side ? 'Route 1 own unit' : 'Route 1 enemy unit'],
      };
    }
    case 'rallyUnit':
      return { ...zero(), notes: [`Rally ${effect.amount} unit(s)`] };
    case 'rallyAll':
      return { ...zero(), notes: ['Rally all units'] };
    case 'destroyUnit': {
      const target = effect.target === 'self' ? side : enemySide;
      return { ...zero(), notes: [target === side ? 'Destroy 1 own unit' : 'Destroy 1 enemy unit'] };
    }
    case 'routeAllByTier':
      return { ...zero(), notes: [`Route all enemy Tier ${effect.tier} units`] };
    case 'placeReinforcement':
      return { ...zero(), notes: ['Place reinforcement'] };
    case 'preventRouting':
      return { ...zero(), notes: ['Own units cannot be routed this round'] };
    case 'preventDamage':
      return { ...zero(), notes: ['Units take no damage this round'] };

    // --- Token denial ---
    case 'denyTokenGain': {
      const target = effect.target === 'enemy' ? 'Enemy' : 'Self';
      return { ...zero(), notes: [`${target} cannot gain ${effect.tokenType} tokens`] };
    }

    // --- Conditional ---
    case 'conditional': {
      const condMet = checkCondition(effect.condition, state, side);
      const branch = condMet ? effect.then : (effect.else ?? []);
      return analyzeEffects(branch, state, side);
    }

    // --- Branches ---
    case 'selfChoice': {
      // Card player picks the optimal option
      const a = analyzeEffects(effect.optionA, state, side);
      const b = analyzeEffects(effect.optionB, state, side);
      return maxImpact(a, b);
    }

    case 'enemyChoice': {
      // Enemy picks the option that is worst for the card player
      const a = analyzeEffects(effect.optionA, state, side);
      const b = analyzeEffects(effect.optionB, state, side);
      return minImpact(a, b);
    }

    // --- Scaling ---
    case 'perUnit': {
      const targetSide = effect.side === 'self' ? side : enemySide;
      const count = countUnits(state, targetSide, effect.unitFilter);
      if (count === 0) return zero();
      const perEffect = analyzeEffect(effect.effect, state, side);
      return {
        offenceMin: perEffect.offenceMin * count,
        offenceMax: perEffect.offenceMax * count,
        defenceMin: perEffect.defenceMin * count,
        defenceMax: perEffect.defenceMax * count,
        moraleMin: perEffect.moraleMin * count,
        moraleMax: perEffect.moraleMax * count,
        notes: perEffect.notes.map((n) => `×${count}: ${n}`),
      };
    }

    case 'perDie': {
      const count = state[side].dice.filter((d) => d === effect.dieIcon).length;
      if (count === 0) return zero();
      const perEffect = analyzeEffect(effect.effect, state, side);
      return {
        offenceMin: perEffect.offenceMin * count,
        offenceMax: perEffect.offenceMax * count,
        defenceMin: perEffect.defenceMin * count,
        defenceMax: perEffect.defenceMax * count,
        moraleMin: perEffect.moraleMin * count,
        moraleMax: perEffect.moraleMax * count,
        notes: perEffect.notes.map((n) => `×${count}: ${n}`),
      };
    }

    case 'spendDiceForEffect': {
      const maxDice = state[side].dice.filter((d) => d === effect.dieIcon).length;
      return { ...zero(), notes: [`Spend up to ${maxDice} [${effect.dieIcon}] dice for effect`] };
    }

    // --- User input ---
    case 'userChooseDice':
      return { ...zero(), notes: [`Choose ${effect.amount} dice to ${effect.action}`] };
    case 'userChooseUnit':
      return { ...zero(), notes: [`${effect.action} 1 ${effect.target === 'self' ? 'own' : 'enemy'} unit`] };
    case 'userChooseTokenType':
      return { ...zero(), offenceMin: 0, offenceMax: effect.amount, defenceMin: 0, defenceMax: effect.amount };

    // --- Special ---
    case 'discardEnemyCard':
      return { ...zero(), notes: [`Discard enemy ${effect.source} card`] };
    case 'drawCombatCard':
      return { ...zero(), notes: ['Draw 1 combat card'] };
    case 'playExtraCard':
      return { ...zero(), notes: ['Play extra card (icons only)'] };
    case 'extraDamageStep':
      return { ...zero(), notes: ['Extra damage step'] };
    case 'mirrorTokens':
      return { ...zero(), notes: ['Mirror enemy tokens'] };
    case 'upgradeUnit':
      return { ...zero(), notes: [`Upgrade ${effect.from} → ${effect.to}`] };
    case 'moveUnit':
      return { ...zero(), notes: ['Move/retreat unit'] };
    case 'spendDiceForTokens': {
      const count = state[side].dice.filter((d) => d === effect.dieIcon).length;
      const maxTokens = count * effect.tokensPerDie;
      if (effect.tokenType === 'offence') {
        return { ...zero(), offenceMin: 0, offenceMax: maxTokens };
      }
      return { ...zero(), defenceMin: 0, defenceMax: maxTokens };
    }
    case 'boardEffect':
      return { ...zero(), notes: [effect.description] };
  }
};

// --- Icon impact helper ---

const iconsToImpact = (icons: { offence: number; defence: number; morale: number }): EffectImpact => ({
  offenceMin: icons.offence, offenceMax: icons.offence,
  defenceMin: icons.defence, defenceMax: icons.defence,
  moraleMin: icons.morale, moraleMax: icons.morale,
  notes: [],
});

// --- Main API ---

/**
 * Analyze all available cards for the given side and compute their potential impact.
 * Based on the current combat state.
 */
export const analyzeAvailableCards = (
  state: CombatState,
  side: Side,
): CardAnalysis[] => {
  const sideState = state[side];
  if (!sideState.factionId) return [];

  const allCards = getCombatCardsForFaction(sideState.factionId) as CombatCard[];

  const playedIds = new Set(sideState.playedCards.map((pc) => pc.cardId));

  return allCards
    .filter((card) => !playedIds.has(card.id))
    .map((card): CardAnalysis => {
      const cardData = combatCardsById[card.id];
      const effects = cardData?.effects;

      const canPlaySecondary = meetsRequisite(
        sideState.units,
        card.unitRequisite,
        sideState.hasBastion && !sideState.bastionDestroyed,
      );

      const iconsImpact = iconsToImpact(card.icons);

      const primaryImpact = effects?.primary
        ? analyzeEffects(effects.primary, state, side)
        : null;

      const secondaryImpact = effects?.secondary && canPlaySecondary
        ? analyzeEffects(effects.secondary, state, side)
        : null;

      const partsToAdd: EffectImpact[] = [iconsImpact];
      if (primaryImpact) partsToAdd.push(primaryImpact);
      if (secondaryImpact) partsToAdd.push(secondaryImpact);

      const total = partsToAdd.reduce(add, zero());

      return {
        cardId: card.id,
        cardName: card.name,
        icons: card.icons,
        canPlaySecondary,
        primary: primaryImpact,
        secondary: secondaryImpact,
        total,
      };
    });
};
