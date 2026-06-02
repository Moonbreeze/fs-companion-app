import test from 'node:test';
import assert from 'node:assert/strict';

import { meetsRequisite } from './requisiteCheck.ts';
import { makeUnit } from '../testHarness.ts';

test('meetsRequisite returns true for empty requisite', () => {
  assert.equal(meetsRequisite([], '', false), true);
});

test('meetsRequisite matches bastion or matching unrouted unit names', () => {
  assert.equal(meetsRequisite([], 'Bastion/ Marine', true), true);
  assert.equal(meetsRequisite([makeUnit('um-space-marine')], 'Bastion/ Marine', false), true);
});

test('meetsRequisite ignores routed and reinforcement units', () => {
  const units = [
    makeUnit('um-space-marine', 'routed'),
    makeUnit('reinforcement', 'normal', true),
    makeUnit('um-scout'),
  ];

  assert.equal(meetsRequisite(units, 'Marine/ Cruiser', false), false);
  assert.equal(meetsRequisite(units, 'Scout/ Cruiser', false), true);
});
