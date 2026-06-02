import test from 'node:test';
import assert from 'node:assert/strict';

import { executeEffects } from './executor.ts';
import { icons, makeSide, makeState, makeUnit, withMockedRandom } from '../testHarness.ts';
import type { CombatEffect } from './types.ts';

test('executeEffects applies deterministic token and dice effects', () => {
  const state = makeState({
    attacker: makeSide({
      factionId: 'ultramarines',
      dice: icons('offence', 'morale', 'morale'),
      combatTokens: { offence: 1, defence: 0 },
      units: [makeUnit('um-space-marine')],
    }),
    defender: makeSide({
      factionId: 'chaos',
      dice: icons('defence', 'morale'),
      combatTokens: { offence: 0, defence: 2 },
      units: [makeUnit('ch-cultist')],
    }),
  });

  const effects: CombatEffect[] = [
    { type: 'gainOffenceTokens', amount: 2 },
    { type: 'loseDefenceTokens', target: 'enemy', amount: 1 },
    { type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 },
    { type: 'convertDice', target: 'self', from: 'morale', to: 'defence', amount: 1 },
  ];

  const result = executeEffects(state, 'attacker', effects);

  assert.deepEqual(result.pendingInputs, []);
  assert.deepEqual(result.state.attacker.combatTokens, { offence: 3, defence: 0 });
  assert.deepEqual(result.state.defender.combatTokens, { offence: 0, defence: 1 });
  assert.deepEqual(result.state.attacker.dice, icons('offence', 'defence', 'morale'));
  assert.deepEqual(result.state.defender.dice, icons('defence'));
});

test('executeEffects supports conditional, perUnit, perDie, and route-all flows', () => {
  const state = makeState({
    attacker: makeSide({
      factionId: 'chaos',
      dice: icons('morale', 'morale', 'offence'),
      units: [
        makeUnit('ch-cultist'),
        makeUnit('ch-iconoclast-destroyer'),
        makeUnit('ch-chaos-marine'),
      ],
    }),
    defender: makeSide({
      factionId: 'ultramarines',
      dice: icons('morale'),
      units: [
        makeUnit('um-scout'),
        makeUnit('um-space-marine'),
        makeUnit('um-land-raider'),
      ],
    }),
  });

  const effects: CombatEffect[] = [
    {
      type: 'conditional',
      condition: { type: 'moreMoraleDice' },
      then: [{ type: 'gainDefenceTokens', amount: 1 }],
    },
    {
      type: 'perUnit',
      side: 'self',
      unitFilter: {
        type: 'compound',
        filters: [
          { type: 'byName', names: ['Cultist', 'Iconoclast'] },
          { type: 'unrouted' },
        ],
      },
      effect: { type: 'gainOffenceTokens', amount: 1 },
    },
    {
      type: 'perDie',
      dieIcon: 'morale',
      effect: { type: 'gainDefenceTokens', amount: 1 },
    },
    { type: 'routeAllByTier', target: 'enemy', tier: 0 },
  ];

  const result = executeEffects(state, 'attacker', effects);

  assert.deepEqual(result.pendingInputs, []);
  assert.deepEqual(result.state.attacker.combatTokens, { offence: 2, defence: 3 });
  assert.equal(result.state.defender.units[0]?.state, 'routed');
  assert.equal(result.state.defender.units[1]?.state, 'normal');
  assert.equal(result.state.defender.units[2]?.state, 'normal');
});

test('executeEffects returns pending input and stops after the first blocking effect', () => {
  const state = makeState({
    attacker: makeSide({
      dice: icons('morale'),
      units: [makeUnit('um-space-marine', 'routed')],
    }),
    defender: makeSide({
      factionId: 'chaos',
      units: [makeUnit('ch-cultist')],
    }),
  });

  const effects: CombatEffect[] = [
    { type: 'gainOffenceTokens', amount: 1 },
    { type: 'userChooseUnit', target: 'self', action: 'rally' },
    { type: 'gainDefenceTokens', amount: 99 },
  ];

  const result = executeEffects(state, 'attacker', effects);

  assert.deepEqual(result.state.attacker.combatTokens, { offence: 1, defence: 0 });
  assert.deepEqual(result.pendingInputs, [
    { type: 'chooseUnit', target: 'attacker', action: 'rally' },
  ]);
  assert.deepEqual(result.state.attacker.dice, icons('morale'));
});

test('executeEffects rerolls selected dice with deterministic randomness', async () => {
  const state = makeState({
    attacker: makeSide({ dice: icons('offence', 'defence') }),
    defender: makeSide({ factionId: 'chaos', dice: icons('defence', 'morale') }),
  });

  await withMockedRandom([0.99, 0], () => {
    const result = executeEffects(state, 'attacker', [
      { type: 'rerollDice', target: 'both', icon: 'defence', amount: 1 },
    ]);

    assert.deepEqual(result.pendingInputs, []);
    assert.deepEqual(result.state.attacker.dice, icons('offence', 'morale'));
    assert.deepEqual(result.state.defender.dice, icons('offence', 'morale'));
  });
});
