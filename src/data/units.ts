import type { Unit } from './types';

// --- Ultramarines ---

const ultramarinesUnits: Unit[] = [
  {
    id: 'um-scout',
    factionId: 'ultramarines',
    name: 'Scout',
    type: 'basic',
    materielCost: 1,
    health: 1,
    attack: 1,
    morale: 1,
    special: 'Infiltrate: May be placed in any friendly or unoccupied area.',
    limit: 4,
  },
  {
    id: 'um-space-marine',
    factionId: 'ultramarines',
    name: 'Space Marine',
    type: 'basic',
    materielCost: 2,
    health: 2,
    attack: 2,
    morale: 2,
    special: 'And They Shall Know No Fear: Ignores the first morale hit each combat round.',
    limit: 4,
  },
  {
    id: 'um-rhino',
    factionId: 'ultramarines',
    name: 'Rhino',
    type: 'vehicle',
    materielCost: 3,
    health: 3,
    attack: 2,
    morale: 2,
    special: 'Transport: Carries one basic unit during movement.',
    limit: 2,
  },
  {
    id: 'um-land-raider',
    factionId: 'ultramarines',
    name: 'Land Raider',
    type: 'vehicle',
    materielCost: 4,
    health: 4,
    attack: 3,
    morale: 2,
    special: 'Armoured Assault: Absorbs 1 damage before taking health loss.',
    limit: 2,
  },
  {
    id: 'um-thunderhawk',
    factionId: 'ultramarines',
    name: 'Thunderhawk',
    type: 'titan',
    materielCost: 5,
    health: 5,
    attack: 4,
    morale: 3,
    special: 'Orbital Strike: Deals 1 bonus damage on the first combat round.',
    limit: 1,
  },
];

// --- Orks ---

const orksUnits: Unit[] = [
  {
    id: 'ork-boyz',
    factionId: 'orks',
    name: 'Boyz',
    type: 'basic',
    materielCost: 1,
    health: 1,
    attack: 1,
    morale: 1,
    special: "WAAAGH!: Gains +1 attack when another Ork unit is in the same combat.",
    limit: 4,
  },
  {
    id: 'ork-stormboyz',
    factionId: 'orks',
    name: 'Stormboyz',
    type: 'basic',
    materielCost: 2,
    health: 1,
    attack: 2,
    morale: 1,
    special: 'Rokkit Charge: May move an extra area before combat.',
    limit: 3,
  },
  {
    id: 'ork-killa-kan',
    factionId: 'orks',
    name: 'Killa Kan',
    type: 'vehicle',
    materielCost: 3,
    health: 3,
    attack: 2,
    morale: 1,
    special: 'Ramshackle: 50% chance to ignore the first point of damage each round.',
    limit: 2,
  },
  {
    id: 'ork-battlewagon',
    factionId: 'orks',
    name: 'Battlewagon',
    type: 'vehicle',
    materielCost: 4,
    health: 4,
    attack: 3,
    morale: 1,
    special: "Deff Rolla: Deals 1 damage to defenders before combat cards are played.",
    limit: 2,
  },
  {
    id: 'ork-stompa',
    factionId: 'orks',
    name: 'Stompa',
    type: 'titan',
    materielCost: 5,
    health: 5,
    attack: 4,
    morale: 2,
    special: 'Mega Choppa: Doubles damage from brutality combat cards.',
    limit: 1,
  },
];

// --- Eldar ---

const eldarUnits: Unit[] = [
  {
    id: 'eld-guardian',
    factionId: 'eldar',
    name: 'Guardian',
    type: 'basic',
    materielCost: 1,
    health: 1,
    attack: 1,
    morale: 2,
    special: 'Shuriken Catapult: Deals +1 morale damage.',
    limit: 4,
  },
  {
    id: 'eld-ranger',
    factionId: 'eldar',
    name: 'Ranger',
    type: 'basic',
    materielCost: 2,
    health: 1,
    attack: 2,
    morale: 2,
    special: 'Pathfinder: May retreat before combat without penalty.',
    limit: 3,
  },
  {
    id: 'eld-war-walker',
    factionId: 'eldar',
    name: 'War Walker',
    type: 'vehicle',
    materielCost: 3,
    health: 2,
    attack: 3,
    morale: 2,
    special: 'Scout Vehicle: May move through enemy-occupied areas.',
    limit: 2,
  },
  {
    id: 'eld-falcon',
    factionId: 'eldar',
    name: 'Falcon',
    type: 'vehicle',
    materielCost: 4,
    health: 3,
    attack: 3,
    morale: 3,
    special: 'Holo-fields: Reduces incoming damage by 1 each combat round.',
    limit: 2,
  },
  {
    id: 'eld-wraithknight',
    factionId: 'eldar',
    name: 'Wraithknight',
    type: 'titan',
    materielCost: 5,
    health: 5,
    attack: 4,
    morale: 3,
    special: 'Wraithcannon: Ignores armour abilities when dealing damage.',
    limit: 1,
  },
];

// --- Chaos ---

const chaosUnits: Unit[] = [
  {
    id: 'ch-cultist',
    factionId: 'chaos',
    name: 'Cultist',
    type: 'basic',
    materielCost: 1,
    health: 1,
    attack: 1,
    morale: 1,
    special: 'Expendable: May be sacrificed to prevent 1 damage to another Chaos unit.',
    limit: 4,
  },
  {
    id: 'ch-chaos-marine',
    factionId: 'chaos',
    name: 'Chaos Marine',
    type: 'elite',
    materielCost: 3,
    health: 2,
    attack: 2,
    morale: 2,
    special: 'Mark of Khorne: Gains +1 attack when an enemy unit is destroyed.',
    limit: 3,
  },
  {
    id: 'ch-helbrute',
    factionId: 'chaos',
    name: 'Helbrute',
    type: 'vehicle',
    materielCost: 3,
    health: 3,
    attack: 3,
    morale: 1,
    special: 'Crazed: Deals 1 damage to a random unit (friend or foe) each combat round.',
    limit: 2,
  },
  {
    id: 'ch-defiler',
    factionId: 'chaos',
    name: 'Defiler',
    type: 'vehicle',
    materielCost: 4,
    health: 4,
    attack: 3,
    morale: 2,
    special: 'Battle Cannon: Deals 1 bonus damage to vehicles and titans.',
    limit: 2,
  },
  {
    id: 'ch-heldrake',
    factionId: 'chaos',
    name: 'Heldrake',
    type: 'titan',
    materielCost: 5,
    health: 5,
    attack: 4,
    morale: 3,
    special: 'Baleflamer: Deals 2 morale damage to all enemy basic units.',
    limit: 1,
  },
];

// Combined exports

export const allUnits: Unit[] = [
  ...ultramarinesUnits,
  ...orksUnits,
  ...eldarUnits,
  ...chaosUnits,
];

export const unitsByFaction: Record<string, Unit[]> = {
  ultramarines: ultramarinesUnits,
  orks: orksUnits,
  eldar: eldarUnits,
  chaos: chaosUnits,
};

export const unitsById: Record<string, Unit> = Object.fromEntries(
  allUnits.map((unit) => [unit.id, unit])
);

export function getUnitsForFaction(factionId: string): Unit[] {
  return unitsByFaction[factionId] ?? [];
}

export function getUnit(id: string): Unit | undefined {
  return unitsById[id];
}
