import type { CombatCard } from './types';
import { combatCardEffectsData } from './combatCardEffectsData';

// --- Ultramarines Combat Cards ---

/** Ultramarines base combat cards (each appears x2 in starting deck). */
const ultramarinesBaseCards: CombatCard[] = [
  {
    id: 'um-ambush',
    factionId: 'ultramarines',
    name: 'Ambush',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 0 },
    abilityPrimary: 'Gain 2 (g).',
    abilitySecondary:
      'When enemy is routed this round, must spend [M] or be destroyed.',
    unitRequisite: '',
    isUpgrade: false,
  },
  {
    id: 'um-blessed-power-armour',
    factionId: 'ultramarines',
    name: 'Blessed Power Armour',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 0 },
    abilityPrimary: 'Gain 2 (s).',
    abilitySecondary: 'Convert up to 2 dice to [S].',
    unitRequisite: 'Bastion/ Marine/ Cruiser',
    isUpgrade: false,
  },
  {
    id: 'um-faith-in-the-emperor',
    factionId: 'ultramarines',
    name: 'Faith in the Emperor',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 1 },
    abilityPrimary: 'Gain 1 [?].',
    abilitySecondary: 'Rally 1 unit or gain 1 [M].',
    unitRequisite: 'Scout/ Marine/ Cruiser',
    isUpgrade: false,
  },
  {
    id: 'um-fury-of-the-ultramar',
    factionId: 'ultramarines',
    name: 'Fury of the Ultramar',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 0 },
    abilityPrimary: '',
    abilitySecondary: 'Enemy rerolls 1 [S]. You may reroll 1 [S].',
    unitRequisite: 'Marine/ Cruiser',
    isUpgrade: false,
  },
  {
    id: 'um-reconnaissance',
    factionId: 'ultramarines',
    name: 'Reconnaissance',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 1 },
    abilityPrimary: '',
    abilitySecondary:
      'If attacking, look at enemy card first. Gain 2 (g) or 2 (s).',
    unitRequisite: 'Scout/ Cruiser',
    isUpgrade: false,
  },
];

/** Ultramarines combat upgrade cards. */
const ultramarinesUpgradeCards: CombatCard[] = [
  {
    id: 'um-drop-pod-assault',
    factionId: 'ultramarines',
    name: 'Drop Pod Assault',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 1, morale: 0 },
    abilityPrimary: 'Gain 1 [?].',
    abilitySecondary: 'Spend 1 [M] to retreat 1 unit.',
    unitRequisite: 'Scout/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'um-glory-and-death',
    factionId: 'ultramarines',
    name: 'Glory and Death',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 1, morale: 0 },
    abilityPrimary: 'Gain 2 (g). If attacking, rally 1 unit.',
    abilitySecondary:
      'Spend 1 [M] to take 1 scout or 1 marine from any world to this world.',
    unitRequisite: 'Marine',
    isUpgrade: true,
  },
  {
    id: 'um-hold-the-line',
    factionId: 'ultramarines',
    name: 'Hold the Line',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 1, morale: 1 },
    abilityPrimary: 'Gain 2 (s). If defending, rally 1 unit.',
    abilitySecondary: 'Force opponent to lose 1 [S] or 1 [M].',
    unitRequisite: 'Marine/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'um-veteran-scouts',
    factionId: 'ultramarines',
    name: 'Veteran Scouts',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 1, morale: 1 },
    abilityPrimary: 'For each morale dice, gain 1 (g) or (s).',
    abilitySecondary: 'Spend 1 [M] to gain 2 (g).',
    unitRequisite: 'Bastion/ Marine/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'um-armoured-advance',
    factionId: 'ultramarines',
    name: 'Armoured Advance',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 2, defence: 1, morale: 0 },
    abilityPrimary: 'Gain 1 [?].',
    abilitySecondary:
      'Resolve 1 additional assess damage step this round (including tokens etc).',
    unitRequisite: 'Land Raider/ Battle Barge',
    isUpgrade: true,
  },
  {
    id: 'um-break-the-line',
    factionId: 'ultramarines',
    name: 'Break the Line',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 2, morale: 0 },
    abilityPrimary: 'Convert up to 3 [M] to [G] and/or [S].',
    abilitySecondary: 'Enemy choses 1 face up combat card to discard.',
    unitRequisite: 'Land Raider/ Battle Barge',
    isUpgrade: true,
  },
  {
    id: 'um-show-no-fear',
    factionId: 'ultramarines',
    name: 'Show No Fear',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 0, defence: 2, morale: 1 },
    abilityPrimary: 'Own units cannot become routed this round.',
    abilitySecondary: 'Spend 1 [M] rally all units.',
    unitRequisite: 'Bastion/ Marine/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'um-emperors-glory',
    factionId: 'ultramarines',
    name: "Emperor's Glory",
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 0, defence: 2, morale: 2 },
    abilityPrimary: 'Gain 2 [?].',
    abilitySecondary: 'Rally all units. Convert any dice to [M].',
    unitRequisite: 'Titan/ Battle Barge',
    isUpgrade: true,
  },
  {
    id: 'um-emperors-might',
    factionId: 'ultramarines',
    name: "Emperor's Might",
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 3, defence: 0, morale: 0 },
    abilityPrimary: 'Gain 2 [?].',
    abilitySecondary: 'Spend any [G]; gain 2 (g) per die.',
    unitRequisite: 'Titan/ Battle Barge',
    isUpgrade: true,
  },
];

// --- Chaos Combat Cards ---

/** Chaos base combat cards (each appears x2 in starting deck). */
const chaosBaseCards: CombatCard[] = [
  {
    id: 'ch-dark-faith',
    factionId: 'chaos',
    name: 'Dark Faith',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 0 },
    abilityPrimary: 'Gain 1 [M].',
    abilitySecondary:
      'If more [M] than opponent, place free Cultist on another friendly or uncontrolled world in system.',
    unitRequisite: 'Cultist/ Iconoclast',
    isUpgrade: false,
  },
  {
    id: 'ch-foul-worship',
    factionId: 'chaos',
    name: 'Foul Worship',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 1 },
    abilityPrimary: '',
    abilitySecondary:
      'If enemy has routed unit, gain 1 (s) per unrouted Cultist or Iconoclast.',
    unitRequisite: 'Cultist/ Iconoclast',
    isUpgrade: false,
  },
  {
    id: 'ch-impure-zeal',
    factionId: 'chaos',
    name: 'Impure Zeal',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 1 },
    abilityPrimary: '',
    abilitySecondary:
      'Enemy routs 1 unit, or you gain 1 (g) per unrouted Cultist or Iconoclast.',
    unitRequisite: 'Cultist/ Iconoclast',
    isUpgrade: false,
  },
  {
    id: 'ch-khornes-rage',
    factionId: 'chaos',
    name: "Khorne's Rage",
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 0 },
    abilityPrimary: '',
    abilitySecondary: 'Enemy spends 1 [S] or routs unit of his choosing.',
    unitRequisite: 'Marine/ Iconoclast',
    isUpgrade: false,
  },
  {
    id: 'ch-lure-of-chaos',
    factionId: 'chaos',
    name: 'Lure of Chaos',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 1 },
    abilityPrimary: 'Gain 1 [?].',
    abilitySecondary: 'Gain 2 (g) or 2 (s).',
    unitRequisite: '',
    isUpgrade: false,
  },
];

/** Chaos combat upgrade cards. */
const chaosUpgradeCards: CombatCard[] = [
  {
    id: 'ch-mark-khorne',
    factionId: 'chaos',
    name: 'Mark of Khorne',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 2, defence: 0, morale: 0 },
    abilityPrimary: 'Spend 1 [G] or 1 [M] to gain 3 (g).',
    abilitySecondary: 'Enemy spends 1 [S] or destroys 1 routed unit.',
    unitRequisite: 'Cultist/ Iconoclast',
    isUpgrade: true,
  },
  {
    id: 'ch-mark-nurgle',
    factionId: 'chaos',
    name: 'Mark of Nurgle',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 2, morale: 0 },
    abilityPrimary: 'Spend 1 [S] or 1 [M] to gain 3 (s).',
    abilitySecondary:
      'Enemy destroys 1 routed unit, otherwise gain 2 (s).',
    unitRequisite: 'Marine/ Iconoclast',
    isUpgrade: true,
  },
  {
    id: 'ch-mark-slaanesh',
    factionId: 'chaos',
    name: 'Mark of Slaanesh',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 1, morale: 0 },
    abilityPrimary:
      'Gain 1 [?]. If more [M] than enemy, he routs 1 unit of his choice.',
    abilitySecondary:
      'If enemy has routed unit, place free Cultist on this world.',
    unitRequisite: 'Cultist/ Iconoclast',
    isUpgrade: true,
  },
  {
    id: 'ch-mark-tzeentch',
    factionId: 'chaos',
    name: 'Mark of Tzeentch',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 0, morale: 2 },
    abilityPrimary:
      'Gain 1 [M]. If more [M] than opponent, upgrade 1 Cultist / (R) to Chaos Marine.',
    abilitySecondary: 'Convert up to 2 [M] to [G] and/or [S].',
    unitRequisite: 'Marine/ Iconoclast',
    isUpgrade: true,
  },
  {
    id: 'ch-chaos-united',
    factionId: 'chaos',
    name: 'Chaos United',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 1, morale: 1 },
    abilityPrimary:
      'Enemy may rout 1 of its units. If not, gain a die of your choice.',
    abilitySecondary:
      'Take 1 unit from any world and place it on this world. Command level cannot exceed number of Cultists in this system.',
    unitRequisite: 'Cultist/ Marine/ Helbrute',
    isUpgrade: true,
  },
  {
    id: 'ch-daemonic-resilience',
    factionId: 'chaos',
    name: 'Daemonic Resilience',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 0, defence: 2, morale: 1 },
    abilityPrimary: 'Gain 1 [M] or 1 [S].',
    abilitySecondary:
      'Gain 4 (s) unless enemy destroys 1 unit of his choice.',
    unitRequisite: 'Helbrute/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'ch-inhuman-strength',
    factionId: 'chaos',
    name: 'Inhuman Strength',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 2, defence: 0, morale: 1 },
    abilityPrimary: 'Gain 1 [G] or 1 [M].',
    abilitySecondary: 'Destroy 1 unit to gain 4 (g).',
    unitRequisite: 'Helbrute/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'ch-chaos-victorious',
    factionId: 'chaos',
    name: 'Chaos Victorious',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 1, defence: 1, morale: 1 },
    abilityPrimary:
      'Gain 2 [?]. If more [M] than enemy, rout all his Tier 0 units.',
    abilitySecondary: 'Rout 1 enemy unit.',
    unitRequisite: 'Titan/ Cruiser',
    isUpgrade: true,
  },
  {
    id: 'ch-death-and-despair',
    factionId: 'chaos',
    name: 'Death and Despair',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 2, defence: 0, morale: 1 },
    abilityPrimary:
      'Gain 2 [G] or 2 [M]. Spend any [M], each destroys 1 Tier 0 unit.',
    abilitySecondary: '',
    unitRequisite: 'Titan/ Cruiser',
    isUpgrade: true,
  },
];

// --- Orks Combat Cards ---

/** Orks base combat cards (each appears x2 in starting deck). */
const orksBaseCards: CombatCard[] = [
  {
    id: 'ork-ard-boyz',
    factionId: 'orks',
    name: "'Ard Boyz",
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 2, morale: 0 },
    abilityPrimary: 'You must reroll all of your [G].',
    abilitySecondary: 'Enemy must reroll 1 [G] for each unrouted Boyz.',
    unitRequisite: 'Boyz',
    isUpgrade: false,
  },
  {
    id: 'ork-gretchin',
    factionId: 'orks',
    name: 'Gretchin',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 0 },
    abilityPrimary:
      'Gain 1 (g) and 1 (s). Enemy rerolls 1 die of your choice.',
    abilitySecondary: 'Gain 1 [?].',
    unitRequisite: '',
    isUpgrade: false,
  },
  {
    id: 'ork-mek-boyz',
    factionId: 'orks',
    name: 'Mek Boyz',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 0 },
    abilityPrimary: 'You must reroll all of your [S].',
    abilitySecondary: 'Rally 1 unit.',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: false,
  },
  {
    id: 'ork-shoota-boyz',
    factionId: 'orks',
    name: 'Shoota Boyz',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 2, morale: 0 },
    abilityPrimary: 'Both sides must reroll all [M].',
    abilitySecondary: 'Gain 1 (g).',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: false,
  },
  {
    id: 'ork-slugga-boyz',
    factionId: 'orks',
    name: 'Slugga Boyz',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 0 },
    abilityPrimary: 'Enemy must reroll all [G].',
    abilitySecondary: 'Enemy must reroll all [S].',
    unitRequisite: '',
    isUpgrade: false,
  },
];

/** Orks combat upgrade cards. */
const orksUpgradeCards: CombatCard[] = [
  {
    id: 'ork-biker-nobz',
    factionId: 'orks',
    name: 'Biker Nobz',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 2, defence: 1, morale: 0 },
    abilityPrimary: '',
    abilitySecondary: 'Enemy must reroll 1 [S] for each unrouted Boyz.',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: true,
  },
  {
    id: 'ork-mega-nobz',
    factionId: 'orks',
    name: 'Mega Nobz',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 1, morale: 1 },
    abilityPrimary: '',
    abilitySecondary: 'Gain 1 (g) per unrouted Boyz/ Onslaught.',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: true,
  },
  {
    id: 'ork-sea-of-green',
    factionId: 'orks',
    name: 'Sea of Green',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 0, morale: 1 },
    abilityPrimary:
      'Place free (R) in this area. If you have more unrouted units, opponent spends 1 [M] or routs 1 unit of his choice.',
    abilitySecondary: 'Gain 1 (s).',
    unitRequisite: '',
    isUpgrade: true,
  },
  {
    id: 'ork-waaagh',
    factionId: 'orks',
    name: 'Waaagh!!!!',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 0, morale: 3 },
    abilityPrimary: 'Rally 1 unit.',
    abilitySecondary: 'Gain 3 (g). Opponent may retreat 1 unit.',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: true,
  },
  {
    id: 'ork-party-wagon',
    factionId: 'orks',
    name: 'Party Wagon',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 2, morale: 0 },
    abilityPrimary: 'Place free (R) in this area.',
    abilitySecondary:
      'If you have more unrouted units, gain 2 (g) and 2 (s).',
    unitRequisite: 'Wagon/ Kroozer',
    isUpgrade: true,
  },
  {
    id: 'ork-rokkit-wagon',
    factionId: 'orks',
    name: 'Rokkit Wagon',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 3, defence: 0, morale: 0 },
    abilityPrimary: '',
    abilitySecondary:
      'In this combat, each time enemy gets (g) or (s), you gain the same tokens as well.',
    unitRequisite: 'Wagon/ Kroozer',
    isUpgrade: true,
  },
  {
    id: 'ork-weirdboyz',
    factionId: 'orks',
    name: 'Weirdboyz',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 1, morale: 1 },
    abilityPrimary: 'Both sides must reroll all dice.',
    abilitySecondary:
      'Enemy discards top card of his combat deck. You gain the cards combat icons until end of this execution round.',
    unitRequisite: 'Boyz/ Onslaught',
    isUpgrade: true,
  },
  {
    id: 'ork-smasher-gargant',
    factionId: 'orks',
    name: 'Smasher Gargant',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 2, defence: 3, morale: 0 },
    abilityPrimary: '',
    abilitySecondary:
      'Choose enemy unit. Destroy unit unless enemy spends dice equal to its Tier.',
    unitRequisite: 'Gargant/ Kroozer',
    isUpgrade: true,
  },
  {
    id: 'ork-snapper-gargant',
    factionId: 'orks',
    name: 'Snapper Gargant',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 4, defence: 1, morale: 0 },
    abilityPrimary: '',
    abilitySecondary: 'Discard 1 of enemy face up combat cards.',
    unitRequisite: 'Gargant/ Kroozer',
    isUpgrade: true,
  },
];

// --- Eldar Combat Cards ---

/** Eldar base combat cards (each appears x2 in starting deck). */
const eldarBaseCards: CombatCard[] = [
  {
    id: 'eld-command-autarch',
    factionId: 'eldar',
    name: 'Command of the Autarch',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 0, morale: 0 },
    abilityPrimary:
      'Either rally 1 unit or gain 1 [M]. Play 1 card from your hand - gain its combat icons but not its abilities.',
    abilitySecondary: '',
    unitRequisite: '',
    isUpgrade: false,
  },
  {
    id: 'eld-hit-and-run',
    factionId: 'eldar',
    name: 'Hit and Run',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 1, defence: 0, morale: 0 },
    abilityPrimary: 'Gain 2 (g).',
    abilitySecondary:
      'Spend 1 [M] to move 1 unit to adjacent friendly or uncontrolled area.',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: false,
  },
  {
    id: 'eld-howling-banshees',
    factionId: 'eldar',
    name: 'Howling Banshees',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 1, defence: 0, morale: 0 },
    abilityPrimary: 'Gain 1 [?].',
    abilitySecondary:
      'Spend 1 [M] to force enemy to rout a unit of his choice.',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: false,
  },
  {
    id: 'eld-ranger-support',
    factionId: 'eldar',
    name: 'Ranger Support',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 1 },
    abilityPrimary: '',
    abilitySecondary: 'Opponent loses 1 die of his choice.',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: false,
  },
  {
    id: 'eld-striking-scorpions',
    factionId: 'eldar',
    name: 'Striking Scorpions',
    commandLevel: 0,
    materielCost: 0,
    icons: { offence: 0, defence: 1, morale: 0 },
    abilityPrimary:
      'If attacking, gain 1 (g) and 1 (s). If defending, you may retreat 1 unit.',
    abilitySecondary: 'Gain 2 (s).',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: false,
  },
];

/** Eldar combat upgrade cards. */
const eldarUpgradeCards: CombatCard[] = [
  {
    id: 'eld-fire-dragon',
    factionId: 'eldar',
    name: "Fire Dragon's Vengeance",
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 2, defence: 0, morale: 0 },
    abilityPrimary:
      'If you are attacking, opponent cannot gain (s) this execution round.',
    abilitySecondary: 'Spend 1 [M] to gain 2 (g).',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: true,
  },
  {
    id: 'eld-swooping-hawks',
    factionId: 'eldar',
    name: 'Swooping Hawks',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 2, morale: 0 },
    abilityPrimary: 'If you are defending, enemy loses 3 (g).',
    abilitySecondary: 'Gain 1 [?].',
    unitRequisite: 'Aspect/ Frigate',
    isUpgrade: true,
  },
  {
    id: 'eld-wraithguard-advance',
    factionId: 'eldar',
    name: 'Wraithguard Advance',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 1, defence: 0, morale: 1 },
    abilityPrimary: 'Gain 1 [?] or 1 [M]. Convert up to 2 [S] into [G].',
    abilitySecondary: 'Enemy spends 1 [M] or routs unit of his choosing.',
    unitRequisite: 'Wraithguard/ Frigate/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-wraithguard-support',
    factionId: 'eldar',
    name: 'Wraithguard Support',
    commandLevel: 0,
    materielCost: 2,
    icons: { offence: 0, defence: 1, morale: 1 },
    abilityPrimary: 'Gain 1 [?] or 1 [M]. Convert up to 2 [G] into [S].',
    abilitySecondary: 'Spend 1 [M] to rally 1 unit.',
    unitRequisite: 'Wraithguard/ Frigate/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-fire-prism',
    factionId: 'eldar',
    name: 'Fire Prism',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 2, defence: 1, morale: 0 },
    abilityPrimary: 'Convert any [M] into [G].',
    abilitySecondary:
      'If attacking, gain 2 (g). If defending, force enemy to lose 5 (s).',
    unitRequisite: 'Falcon/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-spiritseers-guidance',
    factionId: 'eldar',
    name: "Spiritseer's Guidance",
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 1, morale: 1 },
    abilityPrimary: 'Gain 1 [?]. Draw 1 combat card.',
    abilitySecondary:
      'Gain 1 [M]. Rout 1 unit; units cannot suffer any damage this execution round.',
    unitRequisite: 'Titan/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-wave-serpent',
    factionId: 'eldar',
    name: 'Wave Serpent',
    commandLevel: 2,
    materielCost: 4,
    icons: { offence: 1, defence: 2, morale: 0 },
    abilityPrimary: 'Gain 1 [?]. Gain 3 (s) unless enemy spends 1 [M].',
    abilitySecondary:
      'Spend 1 [M] to move any number of Tier 0 and Tier 1 units to an adjacent area - may start a new combat. Same area if card is played again.',
    unitRequisite: 'Falcon/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-holofield-emitter',
    factionId: 'eldar',
    name: 'Holofield Emitter',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 1, defence: 2, morale: 1 },
    abilityPrimary:
      'Gain 1 [?]. Enemy discards 1 random combat card from his hand.',
    abilitySecondary:
      'Gain 4 (g) unless opponent discards 1 face up card of your choice.',
    unitRequisite: 'Titan/ Stalker',
    isUpgrade: true,
  },
  {
    id: 'eld-psychic-lance',
    factionId: 'eldar',
    name: 'Psychic Lance',
    commandLevel: 3,
    materielCost: 6,
    icons: { offence: 2, defence: 1, morale: 0 },
    abilityPrimary: 'Gain 2 [?].',
    abilitySecondary: 'Spend any [G]; gain 2 (g) per die.',
    unitRequisite: 'Titan/ Stalker',
    isUpgrade: true,
  },
];

// --- Combined Data ---

const ultramarinesCombatCards: CombatCard[] = [
  ...ultramarinesBaseCards,
  ...ultramarinesUpgradeCards,
];

const chaosCombatCards: CombatCard[] = [
  ...chaosBaseCards,
  ...chaosUpgradeCards,
];

const orksCombatCards: CombatCard[] = [
  ...orksBaseCards,
  ...orksUpgradeCards,
];

const eldarCombatCards: CombatCard[] = [
  ...eldarBaseCards,
  ...eldarUpgradeCards,
];

/** All combat cards across every faction. */
export const allCombatCards: CombatCard[] = [
  ...ultramarinesCombatCards,
  ...chaosCombatCards,
  ...orksCombatCards,
  ...eldarCombatCards,
];

/** Combat cards grouped by faction ID. */
export const combatCardsByFaction: Record<string, CombatCard[]> = {
  ultramarines: ultramarinesCombatCards,
  chaos: chaosCombatCards,
  orks: orksCombatCards,
  eldar: eldarCombatCards,
};

/** All base (non-upgrade) combat cards. */
export const baseCombatCards: CombatCard[] = allCombatCards.filter(
  (c) => !c.isUpgrade
);

/** All combat upgrade cards. */
export const combatUpgradeCards: CombatCard[] = allCombatCards.filter(
  (c) => c.isUpgrade
);

/** Lookup map: card ID -> CombatCard (with formalized effects merged in). */
export const combatCardsById: Record<string, CombatCard> = Object.fromEntries(
  allCombatCards.map((card) => {
    const effects = combatCardEffectsData[card.id];
    return [card.id, effects ? { ...card, effects } : card];
  })
);

/** Returns all combat cards for the given faction, or an empty array if unknown. */
export const getCombatCardsForFaction = (factionId: string): CombatCard[] =>
  combatCardsByFaction[factionId] ?? [];

/** Returns a single combat card by ID, or undefined if not found. */
export const getCombatCard = (id: string): CombatCard | undefined =>
  combatCardsById[id];

/** Returns base (starter) combat cards for a faction. */
export const getBaseCombatCards = (factionId: string): CombatCard[] =>
  (combatCardsByFaction[factionId] ?? []).filter((c) => !c.isUpgrade);

/** Returns available combat upgrade cards for a faction. */
export const getUpgradeCombatCards = (factionId: string): CombatCard[] =>
  (combatCardsByFaction[factionId] ?? []).filter((c) => c.isUpgrade);
