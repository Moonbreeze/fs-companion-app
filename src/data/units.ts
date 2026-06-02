import type { Bastion, Unit } from './types.ts';

// --- Ultramarines ---

const ultramarinesUnits: Unit[] = [
  {
    id: 'um-scout',
    factionId: 'ultramarines',
    name: 'Scout',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 1,
    health: 2,
    morale: 2,
    unitType: 'ground',
    limit: 4,
  },
  {
    id: 'um-strike-cruiser',
    factionId: 'ultramarines',
    name: 'Strike Cruiser',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 2,
    health: 2,
    morale: 2,
    unitType: 'ship',
    limit: 4,
  },
  {
    id: 'um-space-marine',
    factionId: 'ultramarines',
    name: 'Space Marine',
    commandLevel: 1,
    materielCost: 3,
    forgeCost: false,
    combatValue: 2,
    health: 3,
    morale: 2,
    unitType: 'ground',
    limit: 3,
  },
  {
    id: 'um-land-raider',
    factionId: 'ultramarines',
    name: 'Land Raider',
    commandLevel: 2,
    materielCost: 4,
    forgeCost: false,
    combatValue: 3,
    health: 4,
    morale: 3,
    unitType: 'ground',
    limit: 2,
  },
  {
    id: 'um-battle-barge',
    factionId: 'ultramarines',
    name: 'Battle Barge',
    commandLevel: 2,
    materielCost: 5,
    forgeCost: true,
    combatValue: 4,
    health: 5,
    morale: 4,
    unitType: 'ship',
    limit: 2,
  },
  {
    id: 'um-warlord-titan',
    factionId: 'ultramarines',
    name: 'Warlord Titan',
    commandLevel: 3,
    materielCost: 5,
    forgeCost: true,
    combatValue: 3,
    health: 5,
    morale: 4,
    unitType: 'ground',
    limit: 1,
  },
];

// --- Chaos ---

const chaosUnits: Unit[] = [
  {
    id: 'ch-cultist',
    factionId: 'chaos',
    name: 'Cultist',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 1,
    health: 2,
    morale: 2,
    unitType: 'ground',
    limit: 4,
  },
  {
    id: 'ch-iconoclast-destroyer',
    factionId: 'chaos',
    name: 'Iconoclast Destroyer',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 2,
    health: 3,
    morale: 2,
    unitType: 'ship',
    limit: 4,
  },
  {
    id: 'ch-chaos-marine',
    factionId: 'chaos',
    name: 'Chaos Marine',
    commandLevel: 1,
    materielCost: 3,
    forgeCost: false,
    combatValue: 3,
    health: 4,
    morale: 2,
    unitType: 'ground',
    limit: 3,
  },
  {
    id: 'ch-helbrute',
    factionId: 'chaos',
    name: 'Helbrute',
    commandLevel: 2,
    materielCost: 4,
    forgeCost: false,
    combatValue: 4,
    health: 5,
    morale: 3,
    unitType: 'ground',
    limit: 2,
  },
  {
    id: 'ch-repulsive-cruiser',
    factionId: 'chaos',
    name: 'Repulsive Cruiser',
    commandLevel: 2,
    materielCost: 5,
    forgeCost: true,
    combatValue: 4,
    health: 5,
    morale: 4,
    unitType: 'ship',
    limit: 2,
  },
  {
    id: 'ch-chaos-reaver-titan',
    factionId: 'chaos',
    name: 'Chaos Reaver Titan',
    commandLevel: 3,
    materielCost: 5,
    forgeCost: true,
    combatValue: 3,
    health: 5,
    morale: 3,
    unitType: 'ground',
    limit: 1,
  },
];

// --- Orks ---

const orksUnits: Unit[] = [
  {
    id: 'ork-boyz',
    factionId: 'orks',
    name: 'Ork Boyz',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 2,
    health: 1,
    morale: 2,
    unitType: 'ground',
    limit: 4,
  },
  {
    id: 'ork-onslaught-attack-ships',
    factionId: 'orks',
    name: 'Onslaught Attack Ships',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 1,
    health: 3,
    morale: 2,
    unitType: 'ship',
    limit: 4,
  },
  {
    id: 'ork-nobz',
    factionId: 'orks',
    name: 'Nobz',
    commandLevel: 1,
    materielCost: 3,
    forgeCost: false,
    combatValue: 2,
    health: 4,
    morale: 2,
    unitType: 'ground',
    limit: 3,
  },
  {
    id: 'ork-battlewagons',
    factionId: 'orks',
    name: 'Battlewagons',
    commandLevel: 2,
    materielCost: 4,
    forgeCost: false,
    combatValue: 3,
    health: 5,
    morale: 3,
    unitType: 'ground',
    limit: 2,
  },
  {
    id: 'ork-kill-kroozers',
    factionId: 'orks',
    name: 'Kill Kroozers',
    commandLevel: 2,
    materielCost: 5,
    forgeCost: true,
    combatValue: 3,
    health: 6,
    morale: 4,
    unitType: 'ship',
    limit: 2,
  },
  {
    id: 'ork-gargants',
    factionId: 'orks',
    name: 'Gargants',
    commandLevel: 3,
    materielCost: 5,
    forgeCost: true,
    combatValue: 3,
    health: 6,
    morale: 3,
    unitType: 'ground',
    limit: 1,
  },
];

// --- Eldar ---

const eldarUnits: Unit[] = [
  {
    id: 'eld-aspect-warriors',
    factionId: 'eldar',
    name: 'Aspect Warriors',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 2,
    health: 2,
    morale: 2,
    unitType: 'ground',
    limit: 4,
  },
  {
    id: 'eld-hellebore-frigates',
    factionId: 'eldar',
    name: 'Hellebore Frigates',
    commandLevel: 0,
    materielCost: 2,
    forgeCost: false,
    combatValue: 3,
    health: 4,
    morale: 1,
    unitType: 'ship',
    limit: 4,
  },
  {
    id: 'eld-wraithguard',
    factionId: 'eldar',
    name: 'Wraithguard',
    commandLevel: 1,
    materielCost: 3,
    forgeCost: false,
    combatValue: 2,
    health: 4,
    morale: 2,
    unitType: 'ground',
    limit: 3,
  },
  {
    id: 'eld-falcons',
    factionId: 'eldar',
    name: 'Falcons',
    commandLevel: 2,
    materielCost: 4,
    forgeCost: false,
    combatValue: 3,
    health: 5,
    morale: 3,
    unitType: 'ground',
    limit: 2,
  },
  {
    id: 'eld-void-stalkers',
    factionId: 'eldar',
    name: 'Void Stalkers',
    commandLevel: 2,
    materielCost: 5,
    forgeCost: true,
    combatValue: 4,
    health: 5,
    morale: 4,
    unitType: 'ship',
    limit: 2,
  },
  {
    id: 'eld-warlock-titans',
    factionId: 'eldar',
    name: 'Warlock Titans',
    commandLevel: 3,
    materielCost: 5,
    forgeCost: true,
    combatValue: 4,
    health: 5,
    morale: 3,
    unitType: 'ground',
    limit: 1,
  },
];

// --- Combined exports ---

/** All units across all factions. */
export const allUnits: Unit[] = [
  ...ultramarinesUnits,
  ...chaosUnits,
  ...orksUnits,
  ...eldarUnits,
];

/** Units grouped by faction ID. */
export const unitsByFaction: Record<string, Unit[]> = {
  ultramarines: ultramarinesUnits,
  chaos: chaosUnits,
  orks: orksUnits,
  eldar: eldarUnits,
};

/** Units indexed by unit ID. */
export const unitsById: Record<string, Unit> = Object.fromEntries(
  allUnits.map((unit) => [unit.id, unit])
);

/** Bastion combat stats per faction. */
export const bastions: Record<string, Bastion> = {
  ultramarines: { factionId: 'ultramarines', combatValue: 2, health: 3, morale: 2 },
  chaos: { factionId: 'chaos', combatValue: 2, health: 3, morale: 2 },
  orks: { factionId: 'orks', combatValue: 2, health: 3, morale: 2 },
  eldar: { factionId: 'eldar', combatValue: 2, health: 3, morale: 1 },
};

/** Returns all units belonging to the given faction. */
export const getUnitsForFaction = (factionId: string): Unit[] => {
  return unitsByFaction[factionId] ?? [];
};

/** Returns a single unit by its ID, or undefined if not found. */
export const getUnit = (id: string): Unit | undefined => {
  return unitsById[id];
};
