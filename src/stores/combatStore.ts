import { create } from 'zustand';
import type { FactionId } from '../data/types';

interface CombatUnit {
  unitId: string;
  currentHealth: number;
}

interface CombatSide {
  factionId: FactionId | null;
  units: CombatUnit[];
  moraleTotal: number;
  moraleDamage: number;
  usedCardIds: string[];
}

interface CombatState {
  attacker: CombatSide;
  defender: CombatSide;
  round: number;
  isActive: boolean;

  startCombat: (attackerFaction: FactionId, defenderFaction: FactionId) => void;
  addUnit: (side: 'attacker' | 'defender', unitId: string, health: number) => void;
  removeUnit: (side: 'attacker' | 'defender', index: number) => void;
  applyDamage: (side: 'attacker' | 'defender', unitIndex: number, damage: number) => void;
  applyMoraleDamage: (side: 'attacker' | 'defender', damage: number) => void;
  useCard: (side: 'attacker' | 'defender', cardId: string) => void;
  nextRound: () => void;
  endCombat: () => void;
}

const freshSide = (): CombatSide => ({
  factionId: null,
  units: [],
  moraleTotal: 0,
  moraleDamage: 0,
  usedCardIds: [],
});

function updateSide(
  state: CombatState,
  side: 'attacker' | 'defender',
  updater: (s: CombatSide) => Partial<CombatSide>
): Partial<CombatState> {
  const current = state[side];
  return { [side]: { ...current, ...updater(current) } };
}

export const useCombatStore = create<CombatState>((set) => ({
  attacker: freshSide(),
  defender: freshSide(),
  round: 1,
  isActive: false,

  startCombat: (attackerFaction, defenderFaction) =>
    set({
      attacker: { ...freshSide(), factionId: attackerFaction },
      defender: { ...freshSide(), factionId: defenderFaction },
      round: 1,
      isActive: true,
    }),

  addUnit: (side, unitId, health) =>
    set((state) =>
      updateSide(state, side, (s) => ({
        units: [...s.units, { unitId, currentHealth: health }],
      }))
    ),

  removeUnit: (side, index) =>
    set((state) =>
      updateSide(state, side, (s) => ({
        units: s.units.filter((_, i) => i !== index),
      }))
    ),

  applyDamage: (side, unitIndex, damage) =>
    set((state) =>
      updateSide(state, side, (s) => ({
        units: s.units.map((u, i) =>
          i === unitIndex
            ? { ...u, currentHealth: Math.max(0, u.currentHealth - damage) }
            : u
        ),
      }))
    ),

  applyMoraleDamage: (side, damage) =>
    set((state) =>
      updateSide(state, side, (s) => ({
        moraleDamage: s.moraleDamage + damage,
      }))
    ),

  useCard: (side, cardId) =>
    set((state) =>
      updateSide(state, side, (s) => ({
        usedCardIds: [...s.usedCardIds, cardId],
      }))
    ),

  nextRound: () =>
    set((state) => ({ round: Math.min(state.round + 1, 5) })),

  endCombat: () =>
    set({
      attacker: freshSide(),
      defender: freshSide(),
      round: 1,
      isActive: false,
    }),
}));
