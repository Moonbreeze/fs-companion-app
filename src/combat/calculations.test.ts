import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateDiceCount,
  calculateTotals,
  determineWinner,
  rollDice,
} from './calculations.ts';
import { icons, makeSide, makeUnit, withMockedRandom } from './testHarness.ts';

test('calculateDiceCount sums unrouted non-reinforcement combat and caps at 8', () => {
  const dice = calculateDiceCount(
    [
      makeUnit('um-space-marine'),
      makeUnit('um-land-raider'),
      makeUnit('um-battle-barge'),
      makeUnit('um-scout', 'routed'),
      makeUnit('reinforcement', 'normal', true),
    ],
    true,
    'ultramarines',
  );

  assert.equal(dice, 8);
});

test('calculateTotals counts dice, cards, tokens, unit morale, and bastion morale', () => {
  const totals = calculateTotals(
    makeSide({
      factionId: 'ultramarines',
      hasBastion: true,
      dice: icons('offence', 'defence', 'morale', 'morale'),
      playedCards: [
        { cardId: 'um-faith-in-the-emperor', executionRound: 1 },
        { cardId: 'um-fury-of-the-ultramar', executionRound: 2 },
      ],
      combatTokens: { offence: 2, defence: 1 },
      units: [
        makeUnit('um-scout'),
        makeUnit('um-space-marine'),
        makeUnit('um-land-raider', 'routed'),
        makeUnit('reinforcement', 'normal', true),
      ],
    }),
  );

  assert.deepEqual(totals, {
    offence: 3,
    defence: 3,
    morale: 9,
  });
});

test('determineWinner gives ties to defender', () => {
  const attacker = makeSide({
    units: [makeUnit('um-space-marine')],
    dice: icons('morale'),
  });
  const defender = makeSide({
    factionId: 'chaos',
    units: [makeUnit('ch-cultist'), makeUnit('ch-cultist')],
  });

  assert.deepEqual(determineWinner(attacker, defender), {
    attackerMorale: 3,
    defenderMorale: 4,
    winner: 'defender',
  });

  const tiedDefender = makeSide({
    factionId: 'chaos',
    units: [makeUnit('ch-cultist')],
    dice: icons('morale'),
  });

  assert.equal(determineWinner(attacker, tiedDefender).winner, 'defender');
});

test('rollDice maps random buckets to offence, defence, morale', async () => {
  await withMockedRandom([0, 0.34, 0.99], () => {
    assert.deepEqual(rollDice(3), icons('offence', 'defence', 'morale'));
  });
});
