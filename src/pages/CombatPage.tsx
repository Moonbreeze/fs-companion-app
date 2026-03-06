import { useState } from 'react';
import { useCombatStore } from '../stores/combatStore';
import { factions, units, combatCards } from '../data';
import FactionSelect from '../components/FactionSelect';
import type { FactionId } from '../data';

function CombatSidePanel({ side }: { side: 'attacker' | 'defender' }) {
  const data = useCombatStore((s) => s[side]);
  const addUnit = useCombatStore((s) => s.addUnit);
  const removeUnit = useCombatStore((s) => s.removeUnit);
  const applyDamage = useCombatStore((s) => s.applyDamage);
  const applyMoraleDamage = useCombatStore((s) => s.applyMoraleDamage);
  const useCard = useCombatStore((s) => s.useCard);

  if (!data.factionId) return null;

  const faction = factions[data.factionId];
  const factionUnits = units.filter((u) => u.factionId === data.factionId);
  const factionCards = combatCards.filter((c) => c.factionId === data.factionId);

  const totalMorale = data.units.reduce((sum, u) => {
    const unitDef = units.find((ud) => ud.id === u.unitId);
    return sum + (unitDef?.morale ?? 0);
  }, 0);

  return (
    <div className="wh-panel p-4 flex-1" style={{ borderColor: faction.color + '40' }}>
      <h3 className="font-gothic tracking-wide mb-3" style={{ color: faction.color }}>
        {side === 'attacker' ? 'Атакующий' : 'Защитник'}: {faction.name}
      </h3>

      {/* Add units */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Добавить юнит:</div>
        <div className="flex flex-wrap gap-1">
          {factionUnits.map((unit) => (
            <button
              key={unit.id}
              onClick={() => addUnit(side, unit.id, unit.health)}
              className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold"
            >
              {unit.name}
            </button>
          ))}
        </div>
      </div>

      {/* Units in combat */}
      <div className="space-y-2 mb-3">
        {data.units.map((u, idx) => {
          const unitDef = units.find((ud) => ud.id === u.unitId);
          return (
            <div key={idx} className="flex items-center gap-2 bg-black/30 p-2 border border-wh-border">
              <span className="text-sm text-gray-200 flex-1">{unitDef?.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => applyDamage(side, idx, 1)}
                  className="text-xs px-1 border border-wh-border text-wh-red-bright hover:bg-wh-red/20"
                >
                  -1
                </button>
                <span className={`text-sm font-bold min-w-[3ch] text-center ${u.currentHealth <= 0 ? 'text-red-600 line-through' : 'text-green-400'}`}>
                  {u.currentHealth}/{unitDef?.health}
                </span>
                <button
                  onClick={() => applyDamage(side, idx, -1)}
                  className="text-xs px-1 border border-wh-border text-green-400 hover:bg-green-900/20"
                >
                  +1
                </button>
              </div>
              <button onClick={() => removeUnit(side, idx)} className="text-gray-600 hover:text-wh-red-bright text-xs">
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Morale */}
      <div className="bg-black/30 p-2 border border-wh-border mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-gothic">Мораль</span>
          <div className="flex items-center gap-2">
            <button onClick={() => applyMoraleDamage(side, -1)} className="text-xs px-1 border border-wh-border text-green-400">+</button>
            <span className={`text-sm font-bold ${data.moraleDamage >= totalMorale ? 'text-red-500' : 'text-yellow-400'}`}>
              {data.moraleDamage} / {totalMorale}
            </span>
            <button onClick={() => applyMoraleDamage(side, 1)} className="text-xs px-1 border border-wh-border text-wh-red-bright">-</button>
          </div>
        </div>
        {data.moraleDamage >= totalMorale && totalMorale > 0 && (
          <div className="text-xs text-red-400 mt-1 font-gothic">Мораль сломлена — отступление!</div>
        )}
      </div>

      {/* Combat cards */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Боевые карты:</div>
        <div className="space-y-1">
          {factionCards.map((card) => {
            const used = data.usedCardIds.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => useCard(side, card.id)}
                className={`w-full text-left text-xs p-2 border transition-colors
                  ${used
                    ? 'border-gray-700 text-gray-600 bg-black/20 line-through'
                    : 'border-wh-border text-gray-300 hover:border-wh-gold'
                  }`}
              >
                <span className="font-gothic">{card.name}</span>
                <span className="text-gray-500 ml-2">Lv{card.level}</span>
                <span className="text-wh-red-bright ml-2">{card.damage}D</span>
                <span className="text-yellow-500 ml-1">{card.moraleDamage}M</span>
                {card.special && <span className="text-gray-500 ml-2">— {card.special}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CombatPage() {
  const isActive = useCombatStore((s) => s.isActive);
  const round = useCombatStore((s) => s.round);
  const startCombat = useCombatStore((s) => s.startCombat);
  const nextRound = useCombatStore((s) => s.nextRound);
  const endCombat = useCombatStore((s) => s.endCombat);
  const attacker = useCombatStore((s) => s.attacker);
  const defender = useCombatStore((s) => s.defender);

  if (!isActive) {
    return (
      <div className="space-y-6">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Боевой помощник</h2>
        <CombatSetup onStart={startCombat} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">
          Бой — Раунд {round}
        </h2>
        <div className="flex gap-2">
          <button onClick={nextRound} className="wh-button text-xs py-1 px-3">Следующий раунд</button>
          <button onClick={endCombat} className="wh-button wh-button-danger text-xs py-1 px-3">Завершить бой</button>
        </div>
      </div>

      {/* Opponent cards hint */}
      {attacker.factionId && defender.factionId && (
        <OpponentCardsHint attackerFaction={attacker.factionId} defenderFaction={defender.factionId} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CombatSidePanel side="attacker" />
        <CombatSidePanel side="defender" />
      </div>
    </div>
  );
}

function CombatSetup({ onStart }: { onStart: (a: FactionId, d: FactionId) => void }) {
  const [attackerFaction, setAttackerFaction] = useState<FactionId | null>(null);
  const [defenderFaction, setDefenderFaction] = useState<FactionId | null>(null);

  return (
    <div className="wh-panel p-6 space-y-4">
      <FactionSelect value={attackerFaction} onChange={setAttackerFaction} label="Атакующий" />
      <FactionSelect value={defenderFaction} onChange={setDefenderFaction} label="Защитник" />
      {attackerFaction && defenderFaction && (
        <button onClick={() => onStart(attackerFaction, defenderFaction)} className="wh-button">
          Начать бой
        </button>
      )}
    </div>
  );
}

function OpponentCardsHint({ attackerFaction, defenderFaction }: { attackerFaction: FactionId; defenderFaction: FactionId }) {
  const attackerUsed = useCombatStore((s) => s.attacker.usedCardIds);
  const defenderUsed = useCombatStore((s) => s.defender.usedCardIds);

  const attackerRemaining = combatCards.filter(
    (c) => c.factionId === attackerFaction && !attackerUsed.includes(c.id)
  );
  const defenderRemaining = combatCards.filter(
    (c) => c.factionId === defenderFaction && !defenderUsed.includes(c.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-black/30 p-3 border border-wh-border">
        <div className="text-xs text-gray-500 font-gothic mb-1">
          Возможные карты {factions[attackerFaction].name} ({attackerRemaining.length} осталось)
        </div>
        <div className="text-xs text-gray-400 space-y-0.5">
          {attackerRemaining.map((c) => (
            <div key={c.id}>
              <span className="text-gray-300">{c.name}</span>
              <span className="text-gray-600 ml-1">Lv{c.level} {c.damage}D/{c.moraleDamage}M</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black/30 p-3 border border-wh-border">
        <div className="text-xs text-gray-500 font-gothic mb-1">
          Возможные карты {factions[defenderFaction].name} ({defenderRemaining.length} осталось)
        </div>
        <div className="text-xs text-gray-400 space-y-0.5">
          {defenderRemaining.map((c) => (
            <div key={c.id}>
              <span className="text-gray-300">{c.name}</span>
              <span className="text-gray-600 ml-1">Lv{c.level} {c.damage}D/{c.moraleDamage}M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

