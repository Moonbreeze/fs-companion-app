import { unitsById } from '../../data';
import type { CombatUnit } from '../types';

/**
 * Check if at least one unrouted unit (or bastion) satisfies the card's
 * unitRequisite string (e.g. "Marine/ Cruiser" or "Bastion/ Marine").
 */
export const meetsRequisite = (
  units: CombatUnit[],
  requisite: string,
  hasBastion: boolean,
): boolean => {
  if (!requisite) return true;

  const tokens = requisite.split('/ ').map((t) => t.trim());

  return tokens.some((token) => {
    if (token === 'Bastion') return hasBastion;
    return units.some((u) => {
      if (u.isReinforcement || u.state === 'routed') return false;
      const def = unitsById[u.unitId];
      return def?.name.includes(token) ?? false;
    });
  });
};
