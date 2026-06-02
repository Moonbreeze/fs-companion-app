import type { Faction } from './types';

export const factions: Record<string, Faction> = {
  ultramarines: {
    id: 'ultramarines',
    name: 'Ultramarines',
    fullName: 'Ultramarines Chapter',
    color: '#2952a3',
    description: 'The stalwart defenders of the Imperium, masters of tactical flexibility and disciplined warfare.',
    dominateAbility: 'Spend 1 materiel to upgrade a Scout to a Space Marine, or a Space Marine to a Land Raider, in active system.',
  },
  orks: {
    id: 'orks',
    name: 'Orks',
    fullName: 'Evil Sunz Warband',
    color: '#3d8b37',
    description: 'Brutal and cunning, the Orks live for war and destruction, overwhelming foes with sheer numbers and ferocity.',
    dominateAbility: 'Purchase 1 unit and place it on a world in the active system.',
  },
  eldar: {
    id: 'eldar',
    name: 'Eldar',
    fullName: 'Craftworld Iyanden',
    color: '#7d3c98',
    description: 'Ancient and enigmatic, the Eldar use superior technology and psychic prowess to outmaneuver their enemies.',
    dominateAbility: 'Take 1 unit from a world in the active system, and place it on any friendly world.',
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    fullName: 'World Eaters Warband',
    color: '#922b21',
    description: 'Followers of the Dark Gods, fueled by rage and corruption, seeking to drown the galaxy in blood.',
    dominateAbility: 'Take 1 cultist from active system and place on friendly or uncontested world in adjacent system.',
  },
};

export const factionList = Object.values(factions);

export function getFaction(id: string): Faction | undefined {
  return factions[id];
}
