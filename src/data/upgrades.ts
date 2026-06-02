import type { OrderUpgrade } from './types.ts';

// --- Ultramarines Order Upgrades ---

const ultramarinesOrderUpgrades: OrderUpgrade[] = [
  {
    id: 'um-reign-of-fire',
    factionId: 'ultramarines',
    name: 'Reign of Fire',
    commandLevel: 0,
    materielCost: 1,
    effect: 'Gain [?], convert 1 [M] into [G].',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
  {
    id: 'um-crusade',
    factionId: 'ultramarines',
    name: 'Crusade',
    commandLevel: 1,
    materielCost: 2,
    effect: 'If no friendly worlds in system, gain 1 (R).',
    orderType: 'Advance',
    limit: 'Once per round',
  },
  {
    id: 'um-direct-the-faithful',
    factionId: 'ultramarines',
    name: 'Direct the Faithful',
    commandLevel: 1,
    materielCost: 2,
    effect: 'May change 1 structure to a different structure.',
    orderType: 'Strategize',
    limit: 'Once per round',
  },
  {
    id: 'um-recruitment-worlds',
    factionId: 'ultramarines',
    name: 'Recruitment Worlds',
    commandLevel: 1,
    materielCost: 2,
    effect: 'Treat Bastions as Factories, lower deployment limit by 1 each.',
    orderType: 'Deploy',
    limit: 'Once per round',
  },
  {
    id: 'um-drop-pods',
    factionId: 'ultramarines',
    name: 'Drop Pods',
    commandLevel: 2,
    materielCost: 3,
    effect:
      'Bastions do not prevent orbital strike. Spend 2 [S] to place free Marine (may start combat).',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
];

// --- Chaos Order Upgrades ---

const chaosOrderUpgrades: OrderUpgrade[] = [
  {
    id: 'ch-fear-from-above',
    factionId: 'chaos',
    name: 'Fear from Above',
    commandLevel: 0,
    materielCost: 1,
    effect: 'Gain [?], spend 1 [M] to force any unit taking damage to rout.',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
  {
    id: 'ch-dread-ritual',
    factionId: 'chaos',
    name: 'Dread Ritual',
    commandLevel: 1,
    materielCost: 2,
    effect:
      'Purchase 1 Tier 0-2 unit; reduce cost by 1 per Cultist in active system. Factory not required.',
    orderType: 'Deploy',
    limit: 'Once per round',
  },
  {
    id: 'ch-favour-of-the-dark-gods',
    factionId: 'chaos',
    name: 'Favour of the Dark Gods',
    commandLevel: 1,
    materielCost: 2,
    effect: 'Place 2 order tokens from play area onto top of event deck.',
    orderType: 'Strategize',
    limit: 'Once per round',
  },
  {
    id: 'ch-from-the-warp',
    factionId: 'chaos',
    name: 'From the Warp',
    commandLevel: 1,
    materielCost: 2,
    effect: 'Ships can move through Warp Storms.',
    orderType: 'Advance',
    limit: 'Once per round',
  },
  {
    id: 'ch-complete-destruction',
    factionId: 'chaos',
    name: 'Complete Destruction',
    commandLevel: 2,
    materielCost: 3,
    effect:
      'Bastions do not prevent orbital strike. Spend 2 [S] to force enemy to choose unit or structure to destroy.',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
];

// --- Orks Order Upgrades ---

const orksOrderUpgrades: OrderUpgrade[] = [
  {
    id: 'ork-lootin',
    factionId: 'orks',
    name: "Lootin'",
    commandLevel: 0,
    materielCost: 1,
    effect:
      'Gain 1 [?], spend 1 die to gain 1 materiel and force enemy to lose 1 materiel.',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
  {
    id: 'ork-werk-fasta',
    factionId: 'orks',
    name: 'Werk Fasta!',
    commandLevel: 1,
    materielCost: 2,
    effect: 'May purchase structure before purchasing units.',
    orderType: 'Deploy',
    limit: 'Once per round',
  },
  {
    id: 'ork-the-green-tide',
    factionId: 'orks',
    name: 'The Green Tide',
    commandLevel: 1,
    materielCost: 2,
    effect:
      'When revealed, can resolve it as one of the other orders instead.',
    orderType: 'Strategize',
    limit: 'Once per round',
  },
  {
    id: 'ork-roks',
    factionId: 'orks',
    name: 'Ork Roks',
    commandLevel: 0,
    materielCost: 2,
    effect:
      'Can move up to 2 units through 1 uncontrolled void as if it were a friendly area.',
    orderType: 'Advance',
    limit: 'Once per round',
  },
  {
    id: 'ork-stealin',
    factionId: 'orks',
    name: "Stealin'!",
    commandLevel: 2,
    materielCost: 3,
    effect:
      "Bastions do not prevent orbital strike. Spend 1 [M] to discard an enemy asset token; you gain that token.",
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
];

// --- Eldar Order Upgrades ---

const eldarOrderUpgrades: OrderUpgrade[] = [
  {
    id: 'eld-tactical-strikes',
    factionId: 'eldar',
    name: 'Tactical Strikes',
    commandLevel: 0,
    materielCost: 1,
    effect:
      'Gain 1 [?], spend 1 [M] to choose enemy unit on the world - this must suffer damage first.',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
  {
    id: 'eld-wraithbone-singers',
    factionId: 'eldar',
    name: 'Wraithbone Singers',
    commandLevel: 1,
    materielCost: 2,
    effect:
      'When purchasing structure, may place it on world containing exactly 1 different structure.',
    orderType: 'Deploy',
    limit: 'Once per round',
  },
  {
    id: 'eld-farseer',
    factionId: 'eldar',
    name: 'Farseer',
    commandLevel: 1,
    materielCost: 2,
    effect:
      'This order can be resolved even if there are no units in the active system.',
    orderType: 'Strategize',
    limit: 'Once per round',
  },
  {
    id: 'eld-corsair-raid',
    factionId: 'eldar',
    name: 'Corsair Raid',
    commandLevel: 1,
    materielCost: 2,
    effect:
      'After resolving a combat with this order, you may perform 1 orbital strike in the active system.',
    orderType: 'Advance',
    limit: 'Once per round',
  },
  {
    id: 'eld-strafing-run',
    factionId: 'eldar',
    name: 'Strafing Run',
    commandLevel: 2,
    materielCost: 3,
    effect:
      'Bastions do not prevent orbital strike. Spend 1 [S] to move any ships in active system to friendly or empty voids in adjacent system (still resolve attack).',
    orderType: 'Advance',
    limit: 'Orbital Strike, once per round',
  },
];

// --- Combined exports ---

/** All order upgrade cards across all factions. */
export const allOrderUpgrades: OrderUpgrade[] = [
  ...ultramarinesOrderUpgrades,
  ...chaosOrderUpgrades,
  ...orksOrderUpgrades,
  ...eldarOrderUpgrades,
];

/** Order upgrades grouped by faction ID. */
export const orderUpgradesByFaction: Record<string, OrderUpgrade[]> = {
  ultramarines: ultramarinesOrderUpgrades,
  chaos: chaosOrderUpgrades,
  orks: orksOrderUpgrades,
  eldar: eldarOrderUpgrades,
};

/** Order upgrades indexed by card ID for quick lookup. */
const orderUpgradesById: Record<string, OrderUpgrade> = Object.fromEntries(
  allOrderUpgrades.map((card) => [card.id, card])
);

/** Returns all order upgrades for a given faction. */
export const getOrderUpgradesForFaction = (factionId: string): OrderUpgrade[] =>
  orderUpgradesByFaction[factionId] ?? [];

/** Returns a single order upgrade by its ID, or undefined if not found. */
export const getOrderUpgrade = (id: string): OrderUpgrade | undefined =>
  orderUpgradesById[id];
