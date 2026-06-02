// --- Faction ---

export type BaseFactionId = 'ultramarines' | 'orks' | 'eldar' | 'chaos';
export type FactionId = BaseFactionId | (string & {});

export interface Faction {
  id: FactionId;
  name: string;
  fullName: string;
  color: string;
  description: string;
  dominateAbility: string;
}

// --- Units ---

export interface Unit {
  id: string;
  factionId: FactionId;
  name: string;
  commandLevel: number; // 0, 1, 2, 3
  materielCost: number;
  forgeCost: boolean; // requires forge token
  combatValue: number; // number of dice rolled
  health: number;
  morale: number;
  unitType: 'ground' | 'ship';
  limit: number; // max figures available
}

export interface Bastion {
  factionId: FactionId;
  combatValue: number;
  health: number;
  morale: number;
}

export interface Structure {
  type: 'factory' | 'city' | 'bastion';
  materielCost: number;
}

// --- Combat Cards ---

export interface CombatCardIcons {
  offence: number; // gun icons on card edge
  defence: number; // shield icons on card edge
  morale: number; // morale icons on card edge
}

export interface CombatCard {
  id: string;
  factionId: FactionId;
  name: string;
  commandLevel: number; // tier / command level requirement (for upgrades)
  materielCost: number; // cost to purchase (0 for base cards)
  icons: CombatCardIcons;
  abilityPrimary: string; // green ability box text
  abilitySecondary: string; // brown unit ability box text
  unitRequisite: string; // unit type(s) required for secondary ability, e.g. "Marine/ Cruiser"
  isUpgrade: boolean; // true = combat upgrade card, false = base combat card
  /**
   * Formalized programmatic effects. Optional — cards without this field
   * display text only. Cards with this field can be analyzed by the app.
   */
  effects?: {
    primary?: import('../combat/effects/types').CombatEffect[];
    secondary?: import('../combat/effects/types').CombatEffect[];
  };
}

// --- Order Upgrades ---

export interface OrderUpgrade {
  id: string;
  factionId: FactionId;
  name: string;
  commandLevel: number;
  materielCost: number;
  effect: string;
  orderType: string; // "Advance" | "Deploy" | "Strategize" | "Dominate"
  limit: string; // e.g. "Once per round", "Orbital Strike, once per round"
}

// --- Event Cards ---

export interface EventCard {
  id: string;
  factionId: FactionId;
  name: string;
  warpStormMove: string;
  eventType: 'tactic' | 'scheme';
  effect: string;
}

// --- Assets ---

export type AssetType = 'reinforcement' | 'cache' | 'forge';

export interface PlayerAssets {
  reinforcement: number; // 0–3
  cache: number; // 0–3
  forge: number; // 0–3
}

// --- Territory Tracking ---

export interface TerritoryInfo {
  worldName: string;
  structure: 'factory' | 'city' | 'bastion' | null;
  materielValue: number;
  assetType: AssetType | 'prosperity' | null;
  unitCapacity: number;
}

// --- Session ---

export interface PlayerState {
  name: string;
  factionId: FactionId;
  materiel: number; // 0–14
  assets: PlayerAssets;
  combatDeck: string[]; // card IDs currently in combat deck (10 cards)
  removedFromDeck: string[]; // base card IDs removed when purchasing upgrades
  orderUpgrades: string[]; // purchased order upgrade card IDs
  territories: TerritoryInfo[];
  objectiveTokens: number;
}

export interface TimerConfig {
  strategyTurnTime: number; // seconds per strategic turn
  strategyReserve: number; // reserve bank in seconds
  combatTurnTime: number; // seconds per combat action
  combatReserve: number; // reserve bank in seconds
}

// --- Combat State (re-exported from src/combat/types for backward compatibility) ---

export type { DieIcon, CombatUnit, PlayedCard, CombatSideState, CombatState } from '../combat/types';
