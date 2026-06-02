import { create } from 'zustand';

import * as actions from '../combat/actions';
import { executeEffects } from '../combat/effects';
import { rollDice } from '../combat/calculations';
import { meetsRequisite } from '../combat/analysis';
import { combatCardsById } from '../data';
import type { CombatState, Side, DieIcon } from '../combat/types';
import type { PendingInput } from '../combat/effects';
import type { FactionId } from '../data/types';

type PendingEffects = {
  side: Side;
  inputs: PendingInput[];
};

type CombatActions = {
  // --- Lifecycle ---
  startCombat: (attackerFaction: FactionId, defenderFaction: FactionId) => void;
  endCombat: () => void;
  setPhase: (phase: CombatState['phase']) => void;

  // --- Unit management ---
  addUnit: (side: Side, unitId: string) => void;
  removeUnit: (side: Side, index: number) => void;
  routeUnit: (side: Side, index: number) => void;
  rallyUnit: (side: Side, index: number) => void;
  rallyAll: (side: Side) => void;
  destroyUnit: (side: Side, index: number) => void;

  // --- Bastion ---
  setBastion: (side: Side, hasBastion: boolean) => void;
  destroyBastion: (side: Side) => void;

  // --- Reinforcements ---
  addReinforcement: (side: Side) => void;
  removeReinforcement: (side: Side, index: number) => void;

  // --- Dice ---
  setDice: (side: Side, dice: DieIcon[]) => void;
  addDie: (side: Side, icon: DieIcon) => void;
  removeDie: (side: Side, index: number) => void;
  convertDie: (side: Side, index: number, newIcon: DieIcon) => void;

  // --- Combat tokens ---
  setCombatTokens: (side: Side, offence: number, defence: number) => void;
  adjustCombatTokens: (side: Side, type: 'offence' | 'defence', delta: number) => void;

  // --- Cards ---
  playCard: (side: Side, cardId: string) => void;
  discardPlayedCard: (side: Side, index: number) => void;

  // --- Pending effect resolution ---
  dismissPending: () => void;
  resolveBranchChoice: (optionIndex: 0 | 1) => void;
  resolveUnitChoice: (unitIndex: number) => void;
  resolveDiceChoice: (diceIndices: number[]) => void;
  resolveTokenTypeChoice: (tokenType: 'offence' | 'defence') => void;

  // --- Execution round flow ---
  nextExecutionRound: () => void;
};

type StoreState = CombatState & CombatActions & {
  pendingEffects: PendingEffects | null;
};

export const useCombatStore = create<StoreState>((set, get) => ({
  ...actions.endCombat(),
  pendingEffects: null,

  startCombat: (atk, def) => set({ ...actions.startCombat(atk, def), pendingEffects: null }),
  endCombat: () => set({ ...actions.endCombat(), pendingEffects: null }),
  setPhase: (phase) => set((s) => ({ ...s, phase })),

  addUnit: (side, unitId) => set((s) => actions.addUnit(s, side, unitId)),
  removeUnit: (side, index) => set((s) => actions.removeUnit(s, side, index)),
  routeUnit: (side, index) => set((s) => actions.routeUnit(s, side, index)),
  rallyUnit: (side, index) => set((s) => actions.rallyUnit(s, side, index)),
  rallyAll: (side) => set((s) => actions.rallyAll(s, side)),
  destroyUnit: (side, index) => set((s) => actions.destroyUnit(s, side, index)),

  setBastion: (side, hasBastion) => set((s) => actions.setBastion(s, side, hasBastion)),
  destroyBastion: (side) => set((s) => actions.destroyBastion(s, side)),

  addReinforcement: (side) => set((s) => actions.addReinforcement(s, side)),
  removeReinforcement: (side, index) =>
    set((s) => actions.removeReinforcement(s, side, index)),

  setDice: (side, dice) => set((s) => actions.setDice(s, side, dice)),
  addDie: (side, icon) => set((s) => actions.addDie(s, side, icon)),
  removeDie: (side, index) => set((s) => actions.removeDie(s, side, index)),
  convertDie: (side, index, newIcon) =>
    set((s) => actions.convertDie(s, side, index, newIcon)),

  setCombatTokens: (side, offence, defence) =>
    set((s) => actions.setCombatTokens(s, side, offence, defence)),
  adjustCombatTokens: (side, type, delta) =>
    set((s) => actions.adjustCombatTokens(s, side, type, delta)),

  playCard: (side, cardId) =>
    set((s) => {
      // Record the card as played first
      const withCard = actions.playCard(s, side, cardId);

      const card = combatCardsById[cardId];
      if (!card?.effects) return { ...withCard, pendingEffects: null };

      const sideState = withCard[side];
      const canSecondary = meetsRequisite(
        sideState.units,
        card.unitRequisite,
        sideState.hasBastion && !sideState.bastionDestroyed,
      );

      const effectsToRun = [
        ...(card.effects.primary ?? []),
        ...(canSecondary ? (card.effects.secondary ?? []) : []),
      ];

      if (effectsToRun.length === 0) return { ...withCard, pendingEffects: null };

      const result = executeEffects(withCard, side, effectsToRun);

      const pendingEffects: PendingEffects | null =
        result.pendingInputs.length > 0
          ? { side, inputs: result.pendingInputs }
          : null;

      return { ...result.state, pendingEffects };
    }),

  discardPlayedCard: (side, index) =>
    set((s) => actions.discardPlayedCard(s, side, index)),

  dismissPending: () => set({ pendingEffects: null }),

  resolveBranchChoice: (optionIndex) => {
    const pending = get().pendingEffects;
    if (!pending) return;
    const input = pending.inputs[0];
    if (input?.type !== 'chooseBranch') return;
    void optionIndex;
    // Branch resolution just clears the pending — actual effects
    // require re-running execute with the chosen branch, which the
    // UI should handle by calling specific store actions manually.
    set((s) => ({ ...s, pendingEffects: pending.inputs.length > 1 ? { ...pending, inputs: pending.inputs.slice(1) } : null }));
  },

  resolveUnitChoice: (unitIndex) => {
    const pending = get().pendingEffects;
    if (!pending) return;
    const input = pending.inputs[0];
    if (input?.type !== 'chooseUnit') return;
    set((s) => {
      let newState: CombatState = s;
      if (input.action === 'route') newState = actions.routeUnit(s, input.target as Side, unitIndex);
      else if (input.action === 'rally') newState = actions.rallyUnit(s, input.target as Side, unitIndex);
      else if (input.action === 'destroy') newState = actions.destroyUnit(s, input.target as Side, unitIndex);
      const remaining = pending.inputs.slice(1);
      return { ...newState, pendingEffects: remaining.length > 0 ? { ...pending, inputs: remaining } : null };
    });
  },

  resolveDiceChoice: (diceIndices) => {
    const pending = get().pendingEffects;
    if (!pending) return;
    const input = pending.inputs[0];
    if (input?.type !== 'chooseDice') return;
    set((s) => {
      let newState: CombatState = s;
      const target = input.target as Side;
      if (input.action === 'reroll') {
        const newIcons: DieIcon[] = rollDice(diceIndices.length);
        diceIndices.forEach((idx, i) => {
          newState = actions.convertDie(newState, target, idx, newIcons[i]);
        });
      } else if (input.action === 'convert' && input.convertTo) {
        diceIndices.forEach((idx) => {
          newState = actions.convertDie(newState, target, idx, input.convertTo!);
        });
      }
      const remaining = pending.inputs.slice(1);
      return { ...newState, pendingEffects: remaining.length > 0 ? { ...pending, inputs: remaining } : null };
    });
  },

  resolveTokenTypeChoice: (tokenType) => {
    const pending = get().pendingEffects;
    if (!pending) return;
    const input = pending.inputs[0];
    if (input?.type !== 'chooseTokenType') return;
    set((s) => {
      const newState = actions.adjustCombatTokens(s, pending.side, tokenType, input.amount);
      const remaining = pending.inputs.slice(1);
      return { ...newState, pendingEffects: remaining.length > 0 ? { ...pending, inputs: remaining } : null };
    });
  },

  nextExecutionRound: () =>
    set((s) => ({ ...actions.nextExecutionRound(s), pendingEffects: null })),
}));
