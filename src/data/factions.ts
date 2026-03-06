import type { Faction } from './types';

export const factions: Record<string, Faction> = {
  ultramarines: {
    id: 'ultramarines',
    name: 'Ultramarines',
    fullName: 'Ultramarines Chapter',
    color: '#2952a3',
    description: 'The stalwart defenders of the Imperium, masters of tactical flexibility and disciplined warfare.',
  },
  orks: {
    id: 'orks',
    name: 'Orks',
    fullName: 'Evil Sunz Warband',
    color: '#3d8b37',
    description: 'Brutal and cunning, the Orks live for war and destruction, overwhelming foes with sheer numbers and ferocity.',
  },
  eldar: {
    id: 'eldar',
    name: 'Eldar',
    fullName: 'Craftworld Iyanden',
    color: '#7d3c98',
    description: 'Ancient and enigmatic, the Eldar use superior technology and psychic prowess to outmaneuver their enemies.',
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    fullName: 'World Eaters Warband',
    color: '#922b21',
    description: 'Followers of the Dark Gods, fueled by rage and corruption, seeking to drown the galaxy in blood.',
  },
};

export const factionList = Object.values(factions);

export function getFaction(id: string): Faction | undefined {
  return factions[id];
}
