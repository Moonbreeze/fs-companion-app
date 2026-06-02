import { unitsById } from '../../data';
import type { CombatState, CombatSideState, Side } from '../types';
import * as actions from '../actions';
import { rollDice } from '../calculations';
import type { CombatEffect, EffectCondition, UnitFilter, PendingInput } from './types';

export type EffectExecutionResult = {
  state: CombatState;
  pendingInputs: PendingInput[];
};

// --- Condition evaluation ---

const checkCondition = (
  condition: EffectCondition,
  state: CombatState,
  side: Side,
): boolean => {
  const self = state[side];
  const enemy = state[side === 'attacker' ? 'defender' : 'attacker'];

  switch (condition.type) {
    case 'isAttacker':
      return side === 'attacker';
    case 'isDefender':
      return side === 'defender';
    case 'moreMoraleDice': {
      const selfM = self.dice.filter((d) => d === 'morale').length;
      const enemyM = enemy.dice.filter((d) => d === 'morale').length;
      return selfM > enemyM;
    }
    case 'enemyHasRoutedUnit':
      return enemy.units.some((u) => u.state === 'routed');
    case 'moreUnroutedUnits': {
      const selfUnrouted = self.units.filter((u) => u.state === 'normal').length;
      const enemyUnrouted = enemy.units.filter((u) => u.state === 'normal').length;
      return selfUnrouted > enemyUnrouted;
    }
    case 'hasUnit': {
      const targetSide = self;
      return targetSide.units.some((u) => matchesFilter(u.unitId, u.state === 'normal', u.isReinforcement, condition.unitFilter));
    }
  }
};

// --- Unit filter matching ---

const matchesFilter = (
  unitId: string,
  isUnrouted: boolean,
  isReinforcement: boolean,
  filter: UnitFilter,
): boolean => {
  const unitDef = unitsById[unitId];

  switch (filter.type) {
    case 'byName': {
      if (!unitDef) return false;
      return filter.names.some((n) => unitDef.name.includes(n));
    }
    case 'byTier': {
      if (!unitDef) return false;
      return unitDef.commandLevel === filter.tier;
    }
    case 'unrouted':
      return isUnrouted;
    case 'routed':
      return !isUnrouted;
    case 'reinforcement':
      return isReinforcement;
    case 'compound':
      return filter.filters.every((f) => matchesFilter(unitId, isUnrouted, isReinforcement, f));
  }
};

const countMatchingUnits = (sideState: CombatSideState, filter: UnitFilter): number =>
  sideState.units.filter((u) =>
    matchesFilter(u.unitId, u.state === 'normal', u.isReinforcement, filter)
  ).length;

// --- Core executor ---

/**
 * Apply an array of effects to combat state.
 * Automatic effects are applied immediately; effects requiring user input are
 * returned as pending inputs (execution stops at the first pending input).
 */
export const executeEffects = (
  state: CombatState,
  side: Side,
  effects: CombatEffect[],
): EffectExecutionResult => {
  let current = state;
  const pending: PendingInput[] = [];

  for (const effect of effects) {
    const result = applyEffect(current, side, effect);
    current = result.state;
    if (result.pendingInputs.length > 0) {
      pending.push(...result.pendingInputs);
      break; // stop at first pending input
    }
  }

  return { state: current, pendingInputs: pending };
};

const applyEffect = (
  state: CombatState,
  side: Side,
  effect: CombatEffect,
): EffectExecutionResult => {
  const enemySide: Side = side === 'attacker' ? 'defender' : 'attacker';

  switch (effect.type) {
    // --- Tokens ---
    case 'gainOffenceTokens':
      return done(actions.adjustCombatTokens(state, side, 'offence', effect.amount));

    case 'loseOffenceTokens': {
      const target = effect.target === 'self' ? side : enemySide;
      return done(actions.adjustCombatTokens(state, target, 'offence', -effect.amount));
    }

    case 'gainDefenceTokens':
      return done(actions.adjustCombatTokens(state, side, 'defence', effect.amount));

    case 'loseDefenceTokens': {
      const target = effect.target === 'self' ? side : enemySide;
      return done(actions.adjustCombatTokens(state, target, 'defence', -effect.amount));
    }

    // --- Dice ---
    case 'gainDie': {
      const icon = effect.icon === 'random' ? rollDice(1)[0] : effect.icon;
      // icon is DieIcon here since rollDice returns DieIcon[]
      return done(actions.addDie(state, side, icon));
    }

    case 'gainDice': {
      let s = state;
      for (const icon of rollDice(effect.amount)) {
        const resolved = effect.icon === 'random' ? icon : effect.icon;
        s = actions.addDie(s, side, resolved);
      }
      return done(s);
    }

    case 'loseDie': {
      const target = effect.target === 'self' ? side : enemySide;
      const targetState = state[target];
      const candidates = targetState.dice
        .map((icon, idx) => ({ icon, idx }))
        .filter(({ icon }) => effect.icon === 'any' || icon === effect.icon);
      if (candidates.length === 0) return done(state);
      // Remove first N matching dice (deterministic for auto-apply)
      let s = state;
      const toRemove = candidates.slice(0, effect.amount).map((c) => c.idx).sort((a, b) => b - a);
      for (const idx of toRemove) {
        s = actions.removeDie(s, target, idx);
      }
      return done(s);
    }

    case 'convertDice': {
      const target = effect.target === 'self' ? side : enemySide;
      const targetState = state[target];
      const candidates = targetState.dice
        .map((icon, idx) => ({ icon, idx }))
        .filter(({ icon }) => effect.from === 'any' || icon === effect.from)
        .slice(0, effect.amount);
      let s = state;
      for (const { idx } of candidates) {
        s = actions.convertDie(s, target, idx, effect.to);
      }
      return done(s);
    }

    case 'rerollDice': {
      // Reroll is non-deterministic — just re-randomize matching dice
      const applyReroll = (s: CombatState, t: Side) => {
        const ts = s[t];
        const indices = ts.dice
          .map((icon, idx) => ({ icon, idx }))
          .filter(({ icon }) => effect.icon === 'all' || icon === effect.icon)
          .map((c) => c.idx);
        const count = effect.amount === 'all' ? indices.length : Math.min(effect.amount, indices.length);
        let result = s;
        for (const icon of rollDice(count)) {
          const idx = indices.shift();
          if (idx !== undefined) result = actions.convertDie(result, t, idx, icon);
        }
        return result;
      };

      if (effect.target === 'both') {
        return done(applyReroll(applyReroll(state, side), enemySide));
      }
      const target = effect.target === 'self' ? side : enemySide;
      return done(applyReroll(state, target));
    }

    // --- Units ---
    case 'routeUnit': {
      const target = effect.target === 'self' ? side : enemySide;
      const targetState = state[target];
      const unrouted = targetState.units.findIndex((u) => u.state === 'normal');
      if (unrouted === -1) return done(state);
      if (effect.choice === 'enemy') {
        // Enemy chooses — requires input
        return pending([{ type: 'chooseUnit', target, action: 'route' }], state);
      }
      return done(actions.routeUnit(state, target, unrouted));
    }

    case 'rallyUnit': {
      const routed = state[side].units.findIndex((u) => u.state === 'routed');
      if (routed === -1) return done(state);
      return done(actions.rallyUnit(state, side, routed));
    }

    case 'rallyAll':
      return done(actions.rallyAll(state, side));

    case 'destroyUnit': {
      const target = effect.target === 'self' ? side : enemySide;
      if (effect.choice === 'enemy' || effect.choice === 'self') {
        return pending([{ type: 'chooseUnit', target, action: 'destroy' }], state);
      }
      return done(state);
    }

    case 'routeAllByTier': {
      const target = effect.target === 'enemy' ? enemySide : side;
      let s = state;
      const indices = state[target].units
        .map((u, i) => ({ u, i }))
        .filter(({ u }) => {
          const def = unitsById[u.unitId];
          return def && def.commandLevel === effect.tier && u.state === 'normal';
        })
        .map(({ i }) => i)
        .sort((a, b) => b - a); // reverse so indices stay valid
      for (const idx of indices) {
        s = actions.routeUnit(s, target, idx);
      }
      return done(s);
    }

    case 'placeReinforcement':
      return done(actions.addReinforcement(state, side));

    case 'preventRouting':
    case 'preventDamage':
    case 'denyTokenGain':
      // Passive effects — tracked by UI/game state, not mutating CombatState here
      return done(state);

    // --- Conditional ---
    case 'conditional': {
      const condMet = checkCondition(effect.condition, state, side);
      const branch = condMet ? effect.then : (effect.else ?? []);
      return executeEffects(state, side, branch);
    }

    // --- Branches ---
    case 'enemyChoice':
    case 'selfChoice':
      // Both require input — return as pending
      return pending([{
        type: 'chooseBranch',
        optionA: 'Option A',
        optionB: 'Option B',
      }], state);

    // --- Scaling ---
    case 'perUnit': {
      const targetSide = effect.side === 'self' ? side : enemySide;
      const count = countMatchingUnits(state[targetSide], effect.unitFilter);
      let s = state;
      for (let i = 0; i < count; i++) {
        const result = applyEffect(s, side, effect.effect);
        s = result.state;
        if (result.pendingInputs.length > 0) return pending(result.pendingInputs, s);
      }
      return done(s);
    }

    case 'perDie': {
      const count = state[side].dice.filter((d) => d === effect.dieIcon).length;
      let s = state;
      for (let i = 0; i < count; i++) {
        const result = applyEffect(s, side, effect.effect);
        s = result.state;
        if (result.pendingInputs.length > 0) return pending(result.pendingInputs, s);
      }
      return done(s);
    }

    case 'spendDiceForEffect':
      // Requires user to select which dice to spend
      return pending([{ type: 'chooseDice', target: side, amount: state[side].dice.filter((d) => d === effect.dieIcon).length, action: 'reroll' }], state);

    // --- User input ---
    case 'userChooseDice':
      return pending([{ type: 'chooseDice', target: effect.target === 'self' ? side : enemySide, amount: effect.amount, action: effect.action, convertTo: effect.convertTo }], state);

    case 'userChooseUnit':
      return pending([{ type: 'chooseUnit', target: effect.target === 'self' ? side : enemySide, action: effect.action }], state);

    case 'userChooseTokenType':
      return pending([{ type: 'chooseTokenType', amount: effect.amount }], state);

    // --- Special ---
    case 'discardEnemyCard':
      return pending([{ type: 'chooseCard', source: effect.source }], state);

    case 'drawCombatCard':
    case 'playExtraCard':
    case 'extraDamageStep':
    case 'mirrorTokens':
    case 'upgradeUnit':
    case 'moveUnit':
    case 'spendDiceForTokens':
    case 'boardEffect':
      // Complex/board effects — handled manually by players
      return done(state);
  }
};

// --- Helpers ---

const done = (state: CombatState): EffectExecutionResult =>
  ({ state, pendingInputs: [] });

const pending = (inputs: PendingInput[], state: CombatState): EffectExecutionResult =>
  ({ state, pendingInputs: inputs });
