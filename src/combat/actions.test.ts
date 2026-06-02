import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addDie,
  addReinforcement,
  addUnit,
  convertDie,
  destroyBastion,
  endCombat,
  nextExecutionRound,
  playCard,
  rallyAll,
  removeReinforcement,
  routeUnit,
  setBastion,
  setCombatTokens,
  setDice,
  startCombat,
} from './actions.ts';
import { icons } from './testHarness.ts';

test('startCombat and endCombat create expected baseline states', () => {
  const started = startCombat('ultramarines', 'chaos');
  assert.equal(started.isActive, true);
  assert.equal(started.attacker.factionId, 'ultramarines');
  assert.equal(started.defender.factionId, 'chaos');

  const ended = endCombat();
  assert.equal(ended.isActive, false);
  assert.equal(ended.phase, 'setup');
  assert.deepEqual(ended.attacker.units, []);
});

test('unit state actions update only the targeted side', () => {
  let state = startCombat('ultramarines', 'chaos');
  state = addUnit(state, 'attacker', 'um-space-marine');
  state = addUnit(state, 'defender', 'ch-cultist');
  state = routeUnit(state, 'attacker', 0);
  state = rallyAll(state, 'attacker');

  assert.equal(state.attacker.units[0]?.unitId, 'um-space-marine');
  assert.equal(state.attacker.units[0]?.state, 'normal');
  assert.equal(state.defender.units[0]?.unitId, 'ch-cultist');
  assert.equal(state.defender.units[0]?.state, 'normal');
});

test('reinforcement actions track the token unit and usage count', () => {
  let state = startCombat('ultramarines', 'chaos');
  state = addReinforcement(state, 'attacker');

  assert.equal(state.attacker.units[0]?.isReinforcement, true);
  assert.equal(state.attacker.reinforcementsUsed, 1);

  state = removeReinforcement(state, 'attacker', 0);
  assert.deepEqual(state.attacker.units, []);
  assert.equal(state.attacker.reinforcementsUsed, 0);
});

test('dice and bastion actions clamp and transform state as expected', () => {
  let state = startCombat('ultramarines', 'chaos');
  state = setDice(
    state,
    'attacker',
    icons(
      'offence',
      'offence',
      'offence',
      'offence',
      'offence',
      'offence',
      'offence',
      'offence',
    ),
  );
  state = addDie(state, 'attacker', 'morale');
  state = convertDie(state, 'attacker', 0, 'defence');
  state = setBastion(state, 'defender', true);
  state = destroyBastion(state, 'defender');

  assert.equal(state.attacker.dice.length, 8);
  assert.equal(state.attacker.dice[0], 'defence');
  assert.equal(state.defender.hasBastion, false);
  assert.equal(state.defender.bastionDestroyed, true);
});

test('nextExecutionRound advances up to round three and clears combat tokens', () => {
  let state = startCombat('ultramarines', 'chaos');
  state = setCombatTokens(state, 'attacker', 2, 1);
  state = setCombatTokens(state, 'defender', 1, 3);
  state = playCard(state, 'attacker', 'um-faith-in-the-emperor');
  state = nextExecutionRound(state);
  state = nextExecutionRound(state);
  state = nextExecutionRound(state);

  assert.equal(state.executionRound, 3);
  assert.deepEqual(state.attacker.combatTokens, { offence: 0, defence: 0 });
  assert.deepEqual(state.defender.combatTokens, { offence: 0, defence: 0 });
  assert.equal(state.attacker.playedCards[0]?.executionRound, 1);
});
