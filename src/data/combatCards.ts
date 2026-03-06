import type { CombatCard } from './types';

// --- Ultramarines Combat Cards ---

const ultramarinesCombatCards: CombatCard[] = [
  {
    id: 'um-cc-1a',
    factionId: 'ultramarines',
    name: 'Bolter Discipline',
    level: 1,
    damage: 1,
    moraleDamage: 0,
    isExecutionType: 'boldness',
    special: 'Reroll one die this combat round.',
  },
  {
    id: 'um-cc-1b',
    factionId: 'ultramarines',
    name: 'Tactical Withdrawal',
    level: 1,
    damage: 0,
    moraleDamage: 1,
    isExecutionType: 'cunning',
    special: 'Reduce incoming damage by 1.',
  },
  {
    id: 'um-cc-2a',
    factionId: 'ultramarines',
    name: 'Rapid Fire',
    level: 2,
    damage: 2,
    moraleDamage: 1,
    isExecutionType: 'boldness',
  },
  {
    id: 'um-cc-2b',
    factionId: 'ultramarines',
    name: 'Hold the Line',
    level: 2,
    damage: 1,
    moraleDamage: 2,
    isExecutionType: 'cunning',
    special: 'Negate all morale damage this round.',
  },
  {
    id: 'um-cc-3a',
    factionId: 'ultramarines',
    name: 'Codex Assault',
    level: 3,
    damage: 3,
    moraleDamage: 1,
    isExecutionType: 'brutality',
    special: 'Deal +1 damage if you have more units than your opponent.',
  },
  {
    id: 'um-cc-3b',
    factionId: 'ultramarines',
    name: 'Guilliman\'s Stratagem',
    level: 3,
    damage: 2,
    moraleDamage: 2,
    isExecutionType: 'cunning',
    special: 'Look at your opponent\'s next combat card.',
  },
  {
    id: 'um-cc-4a',
    factionId: 'ultramarines',
    name: 'Orbital Bombardment',
    level: 4,
    damage: 4,
    moraleDamage: 2,
    isExecutionType: 'brutality',
    special: 'Destroy one enemy vehicle outright.',
  },
  {
    id: 'um-cc-4b',
    factionId: 'ultramarines',
    name: 'Courage and Honour',
    level: 4,
    damage: 3,
    moraleDamage: 3,
    isExecutionType: 'boldness',
    special: 'All friendly units gain +1 morale this round.',
  },
];

// --- Orks Combat Cards ---

const orksCombatCards: CombatCard[] = [
  {
    id: 'ork-cc-1a',
    factionId: 'orks',
    name: 'Mob Up',
    level: 1,
    damage: 1,
    moraleDamage: 0,
    isExecutionType: 'brutality',
    special: '+1 damage for each additional Ork unit in combat.',
  },
  {
    id: 'ork-cc-1b',
    factionId: 'orks',
    name: 'Sneaky Git',
    level: 1,
    damage: 0,
    moraleDamage: 1,
    isExecutionType: 'cunning',
  },
  {
    id: 'ork-cc-2a',
    factionId: 'orks',
    name: 'Dakka Dakka Dakka',
    level: 2,
    damage: 2,
    moraleDamage: 0,
    isExecutionType: 'brutality',
    special: 'Roll an extra attack die.',
  },
  {
    id: 'ork-cc-2b',
    factionId: 'orks',
    name: 'Ere We Go',
    level: 2,
    damage: 1,
    moraleDamage: 2,
    isExecutionType: 'boldness',
    special: 'Move one unit from an adjacent area into this combat.',
  },
  {
    id: 'ork-cc-3a',
    factionId: 'orks',
    name: 'WAAAGH!',
    level: 3,
    damage: 3,
    moraleDamage: 1,
    isExecutionType: 'brutality',
    special: 'All Ork units gain +1 attack this round.',
  },
  {
    id: 'ork-cc-3b',
    factionId: 'orks',
    name: 'Krumpin Time',
    level: 3,
    damage: 2,
    moraleDamage: 2,
    isExecutionType: 'boldness',
  },
  {
    id: 'ork-cc-4a',
    factionId: 'orks',
    name: 'Gork Smash',
    level: 4,
    damage: 5,
    moraleDamage: 1,
    isExecutionType: 'brutality',
    special: 'Deal double damage to titans.',
  },
  {
    id: 'ork-cc-4b',
    factionId: 'orks',
    name: 'Mork Smash',
    level: 4,
    damage: 3,
    moraleDamage: 3,
    isExecutionType: 'boldness',
    special: 'Enemy cannot play cunning cards next round.',
  },
];

// --- Eldar Combat Cards ---

const eldarCombatCards: CombatCard[] = [
  {
    id: 'eld-cc-1a',
    factionId: 'eldar',
    name: 'Feigned Retreat',
    level: 1,
    damage: 0,
    moraleDamage: 1,
    isExecutionType: 'cunning',
    special: 'Reduce incoming damage by 1.',
  },
  {
    id: 'eld-cc-1b',
    factionId: 'eldar',
    name: 'Shuriken Storm',
    level: 1,
    damage: 1,
    moraleDamage: 1,
    isExecutionType: 'boldness',
  },
  {
    id: 'eld-cc-2a',
    factionId: 'eldar',
    name: 'Eldritch Storm',
    level: 2,
    damage: 2,
    moraleDamage: 1,
    isExecutionType: 'cunning',
    special: 'Deal 1 morale damage to each enemy unit.',
  },
  {
    id: 'eld-cc-2b',
    factionId: 'eldar',
    name: 'Bladestorm',
    level: 2,
    damage: 2,
    moraleDamage: 1,
    isExecutionType: 'boldness',
  },
  {
    id: 'eld-cc-3a',
    factionId: 'eldar',
    name: 'Doom',
    level: 3,
    damage: 2,
    moraleDamage: 3,
    isExecutionType: 'cunning',
    special: 'Target enemy unit takes double morale damage this round.',
  },
  {
    id: 'eld-cc-3b',
    factionId: 'eldar',
    name: 'Fire and Fade',
    level: 3,
    damage: 3,
    moraleDamage: 1,
    isExecutionType: 'cunning',
    special: 'After resolving, one friendly unit may retreat safely.',
  },
  {
    id: 'eld-cc-4a',
    factionId: 'eldar',
    name: 'Mind War',
    level: 4,
    damage: 2,
    moraleDamage: 4,
    isExecutionType: 'cunning',
    special: 'Destroy one enemy unit with morale 1.',
  },
  {
    id: 'eld-cc-4b',
    factionId: 'eldar',
    name: 'Avatar of Khaine',
    level: 4,
    damage: 4,
    moraleDamage: 2,
    isExecutionType: 'boldness',
    special: 'All friendly units are immune to morale damage this round.',
  },
];

// --- Chaos Combat Cards ---

const chaosCombatCards: CombatCard[] = [
  {
    id: 'ch-cc-1a',
    factionId: 'chaos',
    name: 'Blood Offering',
    level: 1,
    damage: 1,
    moraleDamage: 0,
    isExecutionType: 'brutality',
    special: 'Sacrifice a Cultist to deal +2 damage.',
  },
  {
    id: 'ch-cc-1b',
    factionId: 'chaos',
    name: 'Dark Whispers',
    level: 1,
    damage: 0,
    moraleDamage: 2,
    isExecutionType: 'cunning',
  },
  {
    id: 'ch-cc-2a',
    factionId: 'chaos',
    name: 'Warp Surge',
    level: 2,
    damage: 2,
    moraleDamage: 1,
    isExecutionType: 'boldness',
    special: 'One friendly unit gains +1 health until end of combat.',
  },
  {
    id: 'ch-cc-2b',
    factionId: 'chaos',
    name: 'Berserker Rage',
    level: 2,
    damage: 3,
    moraleDamage: 0,
    isExecutionType: 'brutality',
  },
  {
    id: 'ch-cc-3a',
    factionId: 'chaos',
    name: 'Skull Harvest',
    level: 3,
    damage: 3,
    moraleDamage: 2,
    isExecutionType: 'brutality',
    special: 'Gain +1 damage for each unit destroyed so far this combat.',
  },
  {
    id: 'ch-cc-3b',
    factionId: 'chaos',
    name: 'Warp Rift',
    level: 3,
    damage: 2,
    moraleDamage: 2,
    isExecutionType: 'cunning',
    special: 'Remove one enemy upgrade effect for this combat.',
  },
  {
    id: 'ch-cc-4a',
    factionId: 'chaos',
    name: 'Blood for the Blood God',
    level: 4,
    damage: 5,
    moraleDamage: 2,
    isExecutionType: 'brutality',
    special: 'Deal 1 damage to all units, including your own.',
  },
  {
    id: 'ch-cc-4b',
    factionId: 'chaos',
    name: 'Daemonic Possession',
    level: 4,
    damage: 3,
    moraleDamage: 3,
    isExecutionType: 'cunning',
    special: 'Take control of one enemy basic unit for this combat round.',
  },
];

// Combined exports

export const allCombatCards: CombatCard[] = [
  ...ultramarinesCombatCards,
  ...orksCombatCards,
  ...eldarCombatCards,
  ...chaosCombatCards,
];

export const combatCardsByFaction: Record<string, CombatCard[]> = {
  ultramarines: ultramarinesCombatCards,
  orks: orksCombatCards,
  eldar: eldarCombatCards,
  chaos: chaosCombatCards,
};

export const combatCardsById: Record<string, CombatCard> = Object.fromEntries(
  allCombatCards.map((card) => [card.id, card])
);

export function getCombatCardsForFaction(factionId: string): CombatCard[] {
  return combatCardsByFaction[factionId] ?? [];
}

export function getCombatCard(id: string): CombatCard | undefined {
  return combatCardsById[id];
}
