import type { CombatEffect } from '../combat/effects/types.ts';

type CardEffects = {
  primary?: CombatEffect[];
  secondary?: CombatEffect[];
};

// ============================================================
// Ultramarines — base cards
// ============================================================

const umAmbush: CardEffects = {
  primary: [
    { type: 'gainOffenceTokens', amount: 2 },
  ],
  secondary: [
    { type: 'conditional', condition: { type: 'enemyHasRoutedUnit' },
      then: [{ type: 'enemyChoice',
        optionA: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
        optionB: [{ type: 'destroyUnit', target: 'enemy', choice: 'enemy' }],
      }],
    },
  ],
};

const umBlessedPowerArmour: CardEffects = {
  primary: [
    { type: 'gainDefenceTokens', amount: 2 },
  ],
  secondary: [
    { type: 'userChooseDice', target: 'self', amount: 2, action: 'convert', convertTo: 'defence' },
  ],
};

const umFaithInTheEmperor: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [{ type: 'userChooseUnit', target: 'self', action: 'rally' }],
      optionB: [{ type: 'gainDie', icon: 'morale' }],
    },
  ],
};

const umFuryOfTheUltramar: CardEffects = {
  secondary: [
    { type: 'rerollDice', target: 'enemy', icon: 'defence', amount: 1 },
    { type: 'rerollDice', target: 'self', icon: 'defence', amount: 1 },
  ],
};

const umReconnaissance: CardEffects = {
  secondary: [
    { type: 'conditional', condition: { type: 'isAttacker' },
      then: [{ type: 'selfChoice',
        optionA: [{ type: 'gainOffenceTokens', amount: 2 }],
        optionB: [{ type: 'gainDefenceTokens', amount: 2 }],
      }],
    },
  ],
};

// ============================================================
// Ultramarines — upgrade cards
// ============================================================

const umDropPodAssault: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'moveUnit', scope: 'adjacent' },
      ],
      optionB: [],
    },
  ],
};

const umGloryAndDeath: CardEffects = {
  primary: [
    { type: 'gainOffenceTokens', amount: 2 },
    { type: 'conditional', condition: { type: 'isAttacker' },
      then: [{ type: 'rallyUnit', amount: 1 }],
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'boardEffect', description: 'Take 1 Scout or Marine from any world to this world.' },
      ],
      optionB: [],
    },
  ],
};

const umHoldTheLine: CardEffects = {
  primary: [
    { type: 'gainDefenceTokens', amount: 2 },
    { type: 'conditional', condition: { type: 'isDefender' },
      then: [{ type: 'rallyUnit', amount: 1 }],
    },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'defence', amount: 1 }],
      optionB: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
    },
  ],
};

const umVeteranScouts: CardEffects = {
  primary: [
    { type: 'perDie', dieIcon: 'morale',
      effect: { type: 'userChooseTokenType', amount: 1 },
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'gainOffenceTokens', amount: 2 },
      ],
      optionB: [],
    },
  ],
};

const umArmouredAdvance: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
  ],
  secondary: [
    { type: 'extraDamageStep' },
  ],
};

const umBreakTheLine: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'convertDice', target: 'self', from: 'morale', to: 'offence', amount: 3 }],
      optionB: [{ type: 'convertDice', target: 'self', from: 'morale', to: 'defence', amount: 3 }],
    },
  ],
  secondary: [
    { type: 'discardEnemyCard', source: 'faceup', choice: 'enemy' },
  ],
};

const umShowNoFear: CardEffects = {
  primary: [
    { type: 'preventRouting' },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'rallyAll' },
      ],
      optionB: [],
    },
  ],
};

const umEmperorsGlory: CardEffects = {
  primary: [
    { type: 'gainDice', icon: 'random', amount: 2 },
  ],
  secondary: [
    { type: 'rallyAll' },
    { type: 'convertDice', target: 'self', from: 'any', to: 'morale', amount: 8 },
  ],
};

const umEmperorsMight: CardEffects = {
  primary: [
    { type: 'gainDice', icon: 'random', amount: 2 },
  ],
  secondary: [
    { type: 'spendDiceForTokens', dieIcon: 'offence', tokensPerDie: 2, tokenType: 'offence' },
  ],
};

// ============================================================
// Chaos — base cards
// ============================================================

const chDarkFaith: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'morale' },
  ],
  secondary: [
    { type: 'conditional', condition: { type: 'moreMoraleDice' },
      then: [{ type: 'boardEffect', description: 'Place free Cultist on another friendly or uncontrolled world in this system.' }],
    },
  ],
};

const chFoulWorship: CardEffects = {
  secondary: [
    { type: 'conditional', condition: { type: 'enemyHasRoutedUnit' },
      then: [{ type: 'perUnit', side: 'self',
        unitFilter: { type: 'compound', filters: [
          { type: 'byName', names: ['Cultist', 'Iconoclast'] },
          { type: 'unrouted' },
        ]},
        effect: { type: 'gainDefenceTokens', amount: 1 },
      }],
    },
  ],
};

const chImpureZeal: CardEffects = {
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
      optionB: [{ type: 'perUnit', side: 'self',
        unitFilter: { type: 'compound', filters: [
          { type: 'byName', names: ['Cultist', 'Iconoclast'] },
          { type: 'unrouted' },
        ]},
        effect: { type: 'gainOffenceTokens', amount: 1 },
      }],
    },
  ],
};

const chKhornesRage: CardEffects = {
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'defence', amount: 1 }],
      optionB: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
    },
  ],
};

const chLureOfChaos: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainOffenceTokens', amount: 2 }],
      optionB: [{ type: 'gainDefenceTokens', amount: 2 }],
    },
  ],
};

// ============================================================
// Chaos — upgrade cards
// ============================================================

const chMarkKhorne: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'offence', amount: 1 },
        { type: 'gainOffenceTokens', amount: 3 },
      ],
      optionB: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'gainOffenceTokens', amount: 3 },
      ],
    },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'defence', amount: 1 }],
      optionB: [{ type: 'destroyUnit', target: 'enemy', choice: 'enemy' }],
    },
  ],
};

const chMarkNurgle: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'defence', amount: 1 },
        { type: 'gainDefenceTokens', amount: 3 },
      ],
      optionB: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'gainDefenceTokens', amount: 3 },
      ],
    },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'destroyUnit', target: 'enemy', choice: 'enemy' }],
      optionB: [{ type: 'gainDefenceTokens', amount: 2 }],
    },
  ],
};

const chMarkSlaanesh: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
    { type: 'conditional', condition: { type: 'moreMoraleDice' },
      then: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
    },
  ],
  secondary: [
    { type: 'conditional', condition: { type: 'enemyHasRoutedUnit' },
      then: [{ type: 'boardEffect', description: 'Place free Cultist on this world.' }],
    },
  ],
};

const chMarkTzeentch: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'morale' },
    { type: 'conditional', condition: { type: 'moreMoraleDice' },
      then: [{ type: 'upgradeUnit', from: 'Cultist', to: 'Chaos Marine' }],
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [{ type: 'convertDice', target: 'self', from: 'morale', to: 'offence', amount: 2 }],
      optionB: [{ type: 'convertDice', target: 'self', from: 'morale', to: 'defence', amount: 2 }],
    },
  ],
};

const chChaosUnited: CardEffects = {
  primary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
      optionB: [{ type: 'gainDie', icon: 'random' }],
    },
  ],
  secondary: [
    { type: 'boardEffect', description: 'Take 1 unit from any world and place it on this world. Command level cannot exceed number of Cultists in this system.' },
  ],
};

const chDaemonicResilience: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainDie', icon: 'morale' }],
      optionB: [{ type: 'gainDie', icon: 'defence' }],
    },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'destroyUnit', target: 'enemy', choice: 'enemy' }],
      optionB: [{ type: 'gainDefenceTokens', amount: 4 }],
    },
  ],
};

const chInhumanStrength: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainDie', icon: 'offence' }],
      optionB: [{ type: 'gainDie', icon: 'morale' }],
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'userChooseUnit', target: 'self', action: 'destroy' },
        { type: 'gainOffenceTokens', amount: 4 },
      ],
      optionB: [],
    },
  ],
};

const chChaosVictorious: CardEffects = {
  primary: [
    { type: 'gainDice', icon: 'random', amount: 2 },
    { type: 'conditional', condition: { type: 'moreMoraleDice' },
      then: [{ type: 'routeAllByTier', target: 'enemy', tier: 0 }],
    },
  ],
  secondary: [
    { type: 'routeUnit', target: 'enemy', choice: 'self' },
  ],
};

const chDeathAndDespair: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainDice', icon: 'offence', amount: 2 }],
      optionB: [{ type: 'gainDice', icon: 'morale', amount: 2 }],
    },
    { type: 'spendDiceForEffect', dieIcon: 'morale',
      effect: { type: 'destroyUnit', target: 'enemy', choice: 'self' },
    },
  ],
};

// ============================================================
// Orks — base cards
// ============================================================

const orkArdBoyz: CardEffects = {
  primary: [
    { type: 'rerollDice', target: 'self', icon: 'offence', amount: 'all' },
  ],
  secondary: [
    { type: 'perUnit', side: 'self',
      unitFilter: { type: 'compound', filters: [
        { type: 'byName', names: ['Boyz'] },
        { type: 'unrouted' },
      ]},
      effect: { type: 'rerollDice', target: 'enemy', icon: 'offence', amount: 1 },
    },
  ],
};

const orkGretchin: CardEffects = {
  primary: [
    { type: 'gainOffenceTokens', amount: 1 },
    { type: 'gainDefenceTokens', amount: 1 },
    { type: 'userChooseDice', target: 'enemy', amount: 1, action: 'reroll' },
  ],
  secondary: [
    { type: 'gainDie', icon: 'random' },
  ],
};

const orkMekBoyz: CardEffects = {
  primary: [
    { type: 'rerollDice', target: 'self', icon: 'defence', amount: 'all' },
  ],
  secondary: [
    { type: 'rallyUnit', amount: 1 },
  ],
};

const orkShootaBoyz: CardEffects = {
  primary: [
    { type: 'rerollDice', target: 'both', icon: 'morale', amount: 'all' },
  ],
  secondary: [
    { type: 'gainOffenceTokens', amount: 1 },
  ],
};

const orkSluggaBoyz: CardEffects = {
  primary: [
    { type: 'rerollDice', target: 'enemy', icon: 'offence', amount: 'all' },
  ],
  secondary: [
    { type: 'rerollDice', target: 'enemy', icon: 'defence', amount: 'all' },
  ],
};

// ============================================================
// Orks — upgrade cards
// ============================================================

const orkBikerNobz: CardEffects = {
  secondary: [
    { type: 'perUnit', side: 'self',
      unitFilter: { type: 'compound', filters: [
        { type: 'byName', names: ['Boyz'] },
        { type: 'unrouted' },
      ]},
      effect: { type: 'rerollDice', target: 'enemy', icon: 'defence', amount: 1 },
    },
  ],
};

const orkMegaNobz: CardEffects = {
  secondary: [
    { type: 'perUnit', side: 'self',
      unitFilter: { type: 'compound', filters: [
        { type: 'byName', names: ['Boyz', 'Onslaught'] },
        { type: 'unrouted' },
      ]},
      effect: { type: 'gainOffenceTokens', amount: 1 },
    },
  ],
};

const orkSeaOfGreen: CardEffects = {
  primary: [
    { type: 'placeReinforcement' },
    { type: 'conditional', condition: { type: 'moreUnroutedUnits' },
      then: [{ type: 'enemyChoice',
        optionA: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
        optionB: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
      }],
    },
  ],
  secondary: [
    { type: 'gainDefenceTokens', amount: 1 },
  ],
};

const orkWaaagh: CardEffects = {
  primary: [
    { type: 'rallyUnit', amount: 1 },
  ],
  secondary: [
    { type: 'gainOffenceTokens', amount: 3 },
    { type: 'enemyChoice',
      optionA: [{ type: 'moveUnit', scope: 'adjacent' }],
      optionB: [],
    },
  ],
};

const orkPartyWagon: CardEffects = {
  primary: [
    { type: 'placeReinforcement' },
  ],
  secondary: [
    { type: 'conditional', condition: { type: 'moreUnroutedUnits' },
      then: [
        { type: 'gainOffenceTokens', amount: 2 },
        { type: 'gainDefenceTokens', amount: 2 },
      ],
    },
  ],
};

const orkRokkitWagon: CardEffects = {
  secondary: [
    { type: 'mirrorTokens' },
  ],
};

const orkWeirdboyz: CardEffects = {
  primary: [
    { type: 'rerollDice', target: 'both', icon: 'all', amount: 'all' },
  ],
  secondary: [
    { type: 'discardEnemyCard', source: 'hand', choice: 'random' },
  ],
};

const orkSmasherGargant: CardEffects = {
  secondary: [
    { type: 'enemyChoice',
      // Enemy spends dice equal to target unit's tier (up to 3) to save it
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'any', amount: 3 }],
      optionB: [{ type: 'destroyUnit', target: 'enemy', choice: 'self' }],
    },
  ],
};

const orkSnapperGargant: CardEffects = {
  secondary: [
    { type: 'discardEnemyCard', source: 'faceup', choice: 'self' },
  ],
};

// ============================================================
// Eldar — base cards
// ============================================================

const eldCommandAutarch: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'userChooseUnit', target: 'self', action: 'rally' }],
      optionB: [{ type: 'gainDie', icon: 'morale' }],
    },
    { type: 'playExtraCard', iconsOnly: true },
  ],
};

const eldHitAndRun: CardEffects = {
  primary: [
    { type: 'gainOffenceTokens', amount: 2 },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'moveUnit', scope: 'adjacent' },
      ],
      optionB: [],
    },
  ],
};

const eldHowlingBanshees: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'routeUnit', target: 'enemy', choice: 'enemy' },
      ],
      optionB: [],
    },
  ],
};

const eldRangerSupport: CardEffects = {
  secondary: [
    { type: 'loseDie', target: 'enemy', icon: 'any', amount: 1 },
  ],
};

const eldStrikingScorpions: CardEffects = {
  primary: [
    { type: 'conditional', condition: { type: 'isAttacker' },
      then: [
        { type: 'gainOffenceTokens', amount: 1 },
        { type: 'gainDefenceTokens', amount: 1 },
      ],
    },
    { type: 'conditional', condition: { type: 'isDefender' },
      then: [{ type: 'moveUnit', scope: 'adjacent' }],
    },
  ],
  secondary: [
    { type: 'gainDefenceTokens', amount: 2 },
  ],
};

// ============================================================
// Eldar — upgrade cards
// ============================================================

const eldFireDragon: CardEffects = {
  primary: [
    { type: 'conditional', condition: { type: 'isAttacker' },
      then: [{ type: 'denyTokenGain', target: 'enemy', tokenType: 'defence' }],
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'gainOffenceTokens', amount: 2 },
      ],
      optionB: [],
    },
  ],
};

const eldSwoopingHawks: CardEffects = {
  primary: [
    { type: 'conditional', condition: { type: 'isDefender' },
      then: [{ type: 'loseOffenceTokens', target: 'enemy', amount: 3 }],
    },
  ],
  secondary: [
    { type: 'gainDie', icon: 'random' },
  ],
};

const eldWraithguardAdvance: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainDie', icon: 'random' }],
      optionB: [{ type: 'gainDie', icon: 'morale' }],
    },
    { type: 'convertDice', target: 'self', from: 'defence', to: 'offence', amount: 2 },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
      optionB: [{ type: 'userChooseUnit', target: 'enemy', action: 'route' }],
    },
  ],
};

const eldWraithguardSupport: CardEffects = {
  primary: [
    { type: 'selfChoice',
      optionA: [{ type: 'gainDie', icon: 'random' }],
      optionB: [{ type: 'gainDie', icon: 'morale' }],
    },
    { type: 'convertDice', target: 'self', from: 'offence', to: 'defence', amount: 2 },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'userChooseUnit', target: 'self', action: 'rally' },
      ],
      optionB: [],
    },
  ],
};

const eldFirePrism: CardEffects = {
  primary: [
    { type: 'convertDice', target: 'self', from: 'morale', to: 'offence', amount: 8 },
  ],
  secondary: [
    { type: 'conditional', condition: { type: 'isAttacker' },
      then: [{ type: 'gainOffenceTokens', amount: 2 }],
    },
    { type: 'conditional', condition: { type: 'isDefender' },
      then: [{ type: 'loseDefenceTokens', target: 'enemy', amount: 5 }],
    },
  ],
};

const eldSpiritseerGuidance: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
    { type: 'drawCombatCard' },
  ],
  secondary: [
    { type: 'gainDie', icon: 'morale' },
    { type: 'routeUnit', target: 'enemy', choice: 'self' },
    { type: 'preventDamage' },
  ],
};

const eldWaveSerpent: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
    { type: 'enemyChoice',
      optionA: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
      optionB: [{ type: 'gainDefenceTokens', amount: 3 }],
    },
  ],
  secondary: [
    { type: 'selfChoice',
      optionA: [
        { type: 'loseDie', target: 'self', icon: 'morale', amount: 1 },
        { type: 'moveUnit', scope: 'adjacent' },
      ],
      optionB: [],
    },
  ],
};

const eldHolofieldEmitter: CardEffects = {
  primary: [
    { type: 'gainDie', icon: 'random' },
    { type: 'discardEnemyCard', source: 'hand', choice: 'random' },
  ],
  secondary: [
    { type: 'enemyChoice',
      optionA: [{ type: 'discardEnemyCard', source: 'faceup', choice: 'self' }],
      optionB: [{ type: 'gainOffenceTokens', amount: 4 }],
    },
  ],
};

const eldPsychicLance: CardEffects = {
  primary: [
    { type: 'gainDice', icon: 'random', amount: 2 },
  ],
  secondary: [
    { type: 'spendDiceForTokens', dieIcon: 'offence', tokensPerDie: 2, tokenType: 'offence' },
  ],
};

// ============================================================
// Lookup map
// ============================================================

/** Formalized card effects keyed by card ID. */
export const combatCardEffectsData: Record<string, CardEffects> = {
  // Ultramarines base
  'um-ambush': umAmbush,
  'um-blessed-power-armour': umBlessedPowerArmour,
  'um-faith-in-the-emperor': umFaithInTheEmperor,
  'um-fury-of-the-ultramar': umFuryOfTheUltramar,
  'um-reconnaissance': umReconnaissance,
  // Ultramarines upgrades
  'um-drop-pod-assault': umDropPodAssault,
  'um-glory-and-death': umGloryAndDeath,
  'um-hold-the-line': umHoldTheLine,
  'um-veteran-scouts': umVeteranScouts,
  'um-armoured-advance': umArmouredAdvance,
  'um-break-the-line': umBreakTheLine,
  'um-show-no-fear': umShowNoFear,
  'um-emperors-glory': umEmperorsGlory,
  'um-emperors-might': umEmperorsMight,
  // Chaos base
  'ch-dark-faith': chDarkFaith,
  'ch-foul-worship': chFoulWorship,
  'ch-impure-zeal': chImpureZeal,
  'ch-khornes-rage': chKhornesRage,
  'ch-lure-of-chaos': chLureOfChaos,
  // Chaos upgrades
  'ch-mark-khorne': chMarkKhorne,
  'ch-mark-nurgle': chMarkNurgle,
  'ch-mark-slaanesh': chMarkSlaanesh,
  'ch-mark-tzeentch': chMarkTzeentch,
  'ch-chaos-united': chChaosUnited,
  'ch-daemonic-resilience': chDaemonicResilience,
  'ch-inhuman-strength': chInhumanStrength,
  'ch-chaos-victorious': chChaosVictorious,
  'ch-death-and-despair': chDeathAndDespair,
  // Orks base
  'ork-ard-boyz': orkArdBoyz,
  'ork-gretchin': orkGretchin,
  'ork-mek-boyz': orkMekBoyz,
  'ork-shoota-boyz': orkShootaBoyz,
  'ork-slugga-boyz': orkSluggaBoyz,
  // Orks upgrades
  'ork-biker-nobz': orkBikerNobz,
  'ork-mega-nobz': orkMegaNobz,
  'ork-sea-of-green': orkSeaOfGreen,
  'ork-waaagh': orkWaaagh,
  'ork-party-wagon': orkPartyWagon,
  'ork-rokkit-wagon': orkRokkitWagon,
  'ork-weirdboyz': orkWeirdboyz,
  'ork-smasher-gargant': orkSmasherGargant,
  'ork-snapper-gargant': orkSnapperGargant,
  // Eldar base
  'eld-command-autarch': eldCommandAutarch,
  'eld-hit-and-run': eldHitAndRun,
  'eld-howling-banshees': eldHowlingBanshees,
  'eld-ranger-support': eldRangerSupport,
  'eld-striking-scorpions': eldStrikingScorpions,
  // Eldar upgrades
  'eld-fire-dragon': eldFireDragon,
  'eld-swooping-hawks': eldSwoopingHawks,
  'eld-wraithguard-advance': eldWraithguardAdvance,
  'eld-wraithguard-support': eldWraithguardSupport,
  'eld-fire-prism': eldFirePrism,
  'eld-spiritseers-guidance': eldSpiritseerGuidance,
  'eld-wave-serpent': eldWaveSerpent,
  'eld-holofield-emitter': eldHolofieldEmitter,
  'eld-psychic-lance': eldPsychicLance,
};
