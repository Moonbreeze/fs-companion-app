// Base factions shipped with the app. Custom/fan factions use any string id.
export type BaseFactionId = 'ultramarines' | 'orks' | 'eldar' | 'chaos';
export type FactionId = BaseFactionId | (string & {});

export interface Faction {
  id: FactionId;
  name: string;
  fullName: string;
  color: string;
  description: string;
}

export interface Unit {
  id: string;
  factionId: FactionId;
  name: string;
  type: 'basic' | 'elite' | 'vehicle' | 'titan';
  materielCost: number;
  health: number;
  attack: number;
  morale: number;
  special?: string;
  limit: number;
}

export interface CombatCard {
  id: string;
  factionId: FactionId;
  name: string;
  level: 1 | 2 | 3 | 4;
  damage: number;
  moraleDamage: number;
  special?: string;
  isExecutionType: 'cunning' | 'boldness' | 'brutality';
}

export interface UpgradeCard {
  id: string;
  factionId: FactionId;
  name: string;
  tier: 1 | 2 | 3;
  assetsCost: number;
  type: 'structure' | 'upgrade' | 'order';
  description: string;
}

export interface TimerConfig {
  strategyTurnTime: number;
  strategyReserve: number;
  combatTurnTime: number;
  combatReserve: number;
}
