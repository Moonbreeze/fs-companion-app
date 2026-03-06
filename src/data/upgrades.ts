import type { UpgradeCard } from './types';

// --- Ultramarines Upgrades ---

const ultramarinesUpgrades: UpgradeCard[] = [
  {
    id: 'um-up-1a',
    factionId: 'ultramarines',
    name: 'Tactical Relay',
    tier: 1,
    assetsCost: 1,
    type: 'structure',
    description: 'Build a comms relay. Friendly units in this area may reroll one combat die per round.',
  },
  {
    id: 'um-up-1b',
    factionId: 'ultramarines',
    name: 'Auspex Scan',
    tier: 1,
    assetsCost: 2,
    type: 'order',
    description: 'Reveal all enemy orders in one system before resolving them.',
  },
  {
    id: 'um-up-2a',
    factionId: 'ultramarines',
    name: 'Armoury Requisition',
    tier: 2,
    assetsCost: 2,
    type: 'upgrade',
    description: 'All Space Marine units gain +1 attack permanently.',
  },
  {
    id: 'um-up-2b',
    factionId: 'ultramarines',
    name: 'Fortress Monastery',
    tier: 2,
    assetsCost: 3,
    type: 'structure',
    description: 'Build a fortified position. Units defending here gain +2 health during combat.',
  },
  {
    id: 'um-up-3a',
    factionId: 'ultramarines',
    name: 'Orbital Lance Battery',
    tier: 3,
    assetsCost: 4,
    type: 'structure',
    description: 'Once per game round, deal 2 damage to any enemy force in an adjacent system.',
  },
  {
    id: 'um-up-3b',
    factionId: 'ultramarines',
    name: 'Codex Tactics',
    tier: 3,
    assetsCost: 3,
    type: 'order',
    description: 'Place one additional order token during the planning phase.',
  },
];

// --- Orks Upgrades ---

const orksUpgrades: UpgradeCard[] = [
  {
    id: 'ork-up-1a',
    factionId: 'orks',
    name: 'Scrap Pile',
    tier: 1,
    assetsCost: 1,
    type: 'structure',
    description: 'Build a scrap heap. Reduce the materiel cost of vehicles built here by 1.',
  },
  {
    id: 'ork-up-1b',
    factionId: 'orks',
    name: "Lootin' Spree",
    tier: 1,
    assetsCost: 1,
    type: 'order',
    description: 'After winning a combat, gain 2 materiel from the defeated player\'s supply.',
  },
  {
    id: 'ork-up-2a',
    factionId: 'orks',
    name: 'Big Mek Workshop',
    tier: 2,
    assetsCost: 2,
    type: 'structure',
    description: 'Build a workshop. All Ork vehicles gain +1 health while in this area.',
  },
  {
    id: 'ork-up-2b',
    factionId: 'orks',
    name: 'Bigger Choppas',
    tier: 2,
    assetsCost: 3,
    type: 'upgrade',
    description: 'All Boyz units gain +1 attack permanently.',
  },
  {
    id: 'ork-up-3a',
    factionId: 'orks',
    name: 'Tellyporta Pad',
    tier: 3,
    assetsCost: 3,
    type: 'structure',
    description: 'Once per round, teleport one Ork unit to any area with a friendly unit.',
  },
  {
    id: 'ork-up-3b',
    factionId: 'orks',
    name: 'WAAAGH! Banner',
    tier: 3,
    assetsCost: 4,
    type: 'upgrade',
    description: 'All Ork units gain +1 morale. Brutality combat cards deal +1 damage.',
  },
];

// --- Eldar Upgrades ---

const eldarUpgrades: UpgradeCard[] = [
  {
    id: 'eld-up-1a',
    factionId: 'eldar',
    name: 'Webway Gate',
    tier: 1,
    assetsCost: 2,
    type: 'structure',
    description: 'Build a webway gate. Eldar units may move between areas with gates as one move.',
  },
  {
    id: 'eld-up-1b',
    factionId: 'eldar',
    name: 'Farseer Guidance',
    tier: 1,
    assetsCost: 1,
    type: 'order',
    description: 'Look at the top 3 combat cards and rearrange them in any order.',
  },
  {
    id: 'eld-up-2a',
    factionId: 'eldar',
    name: 'Spirit Stones',
    tier: 2,
    assetsCost: 2,
    type: 'upgrade',
    description: 'All Eldar units gain +1 morale permanently.',
  },
  {
    id: 'eld-up-2b',
    factionId: 'eldar',
    name: 'Wraithbone Bastion',
    tier: 2,
    assetsCost: 3,
    type: 'structure',
    description: 'Build a bastion. Defending Eldar units reduce all incoming damage by 1.',
  },
  {
    id: 'eld-up-3a',
    factionId: 'eldar',
    name: 'Infinity Circuit',
    tier: 3,
    assetsCost: 4,
    type: 'structure',
    description: 'Once per round, return one destroyed non-titan Eldar unit to this area.',
  },
  {
    id: 'eld-up-3b',
    factionId: 'eldar',
    name: 'Path of the Seer',
    tier: 3,
    assetsCost: 3,
    type: 'order',
    description: 'Cancel one enemy order token before it resolves. Usable once per game round.',
  },
];

// --- Chaos Upgrades ---

const chaosUpgrades: UpgradeCard[] = [
  {
    id: 'ch-up-1a',
    factionId: 'chaos',
    name: 'Skull Altar',
    tier: 1,
    assetsCost: 1,
    type: 'structure',
    description: 'Build a dark shrine. Sacrifice a Cultist here to draw one extra combat card.',
  },
  {
    id: 'ch-up-1b',
    factionId: 'chaos',
    name: 'Corrupt the Weak',
    tier: 1,
    assetsCost: 2,
    type: 'order',
    description: 'Convert one enemy basic unit to a Cultist under your control.',
  },
  {
    id: 'ch-up-2a',
    factionId: 'chaos',
    name: 'Warp Forge',
    tier: 2,
    assetsCost: 2,
    type: 'structure',
    description: 'Build a warp forge. Chaos vehicles built here gain +1 attack.',
  },
  {
    id: 'ch-up-2b',
    factionId: 'chaos',
    name: 'Blood Tithe',
    tier: 2,
    assetsCost: 3,
    type: 'upgrade',
    description: 'Whenever an enemy unit is destroyed in combat, gain 1 materiel.',
  },
  {
    id: 'ch-up-3a',
    factionId: 'chaos',
    name: 'Warp Storm',
    tier: 3,
    assetsCost: 4,
    type: 'order',
    description: 'Deal 1 damage to all units in a target system. Chaos units are immune.',
  },
  {
    id: 'ch-up-3b',
    factionId: 'chaos',
    name: 'Dark Apotheosis',
    tier: 3,
    assetsCost: 3,
    type: 'upgrade',
    description: 'One Chaos Marine permanently becomes a Daemon Prince: +2 health, +1 attack.',
  },
];

// Combined exports

export const allUpgrades: UpgradeCard[] = [
  ...ultramarinesUpgrades,
  ...orksUpgrades,
  ...eldarUpgrades,
  ...chaosUpgrades,
];

export const upgradesByFaction: Record<string, UpgradeCard[]> = {
  ultramarines: ultramarinesUpgrades,
  orks: orksUpgrades,
  eldar: eldarUpgrades,
  chaos: chaosUpgrades,
};

export const upgradesById: Record<string, UpgradeCard> = Object.fromEntries(
  allUpgrades.map((card) => [card.id, card])
);

export function getUpgradesForFaction(factionId: string): UpgradeCard[] {
  return upgradesByFaction[factionId] ?? [];
}

export function getUpgrade(id: string): UpgradeCard | undefined {
  return upgradesById[id];
}
