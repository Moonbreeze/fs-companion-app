import { useState } from 'react';
import { factions, units, combatCards, upgrades } from '../data';
import type { FactionId } from '../data';
import FactionSelect from '../components/FactionSelect';

type Tab = 'units' | 'cards' | 'upgrades' | 'rules';

export default function ReferencePage() {
  const [faction, setFaction] = useState<FactionId>('ultramarines');
  const [tab, setTab] = useState<Tab>('units');

  const factionData = factions[faction];
  const factionUnits = units.filter((u) => u.factionId === faction);
  const factionCards = combatCards.filter((c) => c.factionId === faction);
  const factionUpgrades = upgrades.filter((u) => u.factionId === faction);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'units', label: 'Юниты' },
    { id: 'cards', label: 'Боевые карты' },
    { id: 'upgrades', label: 'Апгрейды' },
    { id: 'rules', label: 'Фазы игры' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Справочник</h2>

      <FactionSelect value={faction} onChange={setFaction} />

      <div className="wh-panel p-4">
        <p className="text-sm text-gray-400" style={{ borderLeftColor: factionData.color, borderLeftWidth: 3, paddingLeft: 12 }}>
          {factionData.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-wh-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-gothic tracking-wide transition-colors
              ${tab === t.id
                ? 'text-wh-gold border-b-2 border-wh-gold'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'units' && (
        <div className="space-y-2">
          {factionUnits.map((unit) => (
            <div key={unit.id} className="wh-panel p-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-gothic text-sm text-gray-200">{unit.name}</div>
                <div className="text-xs text-gray-500 capitalize">{unit.type}</div>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <div className="text-gray-500">Cost</div>
                  <div className="text-wh-gold font-bold">{unit.materielCost}</div>
                </div>
                <div>
                  <div className="text-gray-500">HP</div>
                  <div className="text-green-400 font-bold">{unit.health}</div>
                </div>
                <div>
                  <div className="text-gray-500">ATK</div>
                  <div className="text-red-400 font-bold">{unit.attack}</div>
                </div>
                <div>
                  <div className="text-gray-500">MRL</div>
                  <div className="text-yellow-400 font-bold">{unit.morale}</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">×{unit.limit}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cards' && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((level) => {
            const levelCards = factionCards.filter((c) => c.level === level);
            if (levelCards.length === 0) return null;
            return (
              <div key={level}>
                <div className="text-xs text-gray-500 font-gothic tracking-wide mb-1">Уровень {level}</div>
                {levelCards.map((card) => (
                  <div key={card.id} className="wh-panel p-3 mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-gothic text-sm text-gray-200">{card.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 border ${
                        card.isExecutionType === 'cunning' ? 'border-blue-500/30 text-blue-400' :
                        card.isExecutionType === 'boldness' ? 'border-yellow-500/30 text-yellow-400' :
                        'border-red-500/30 text-red-400'
                      }`}>
                        {card.isExecutionType}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span className="text-wh-red-bright">{card.damage} урона</span>
                      <span className="text-yellow-500">{card.moraleDamage} морали</span>
                    </div>
                    {card.special && <div className="text-xs text-gray-500 mt-1">{card.special}</div>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'upgrades' && (
        <div className="space-y-2">
          {[1, 2, 3].map((tier) => {
            const tierUpgrades = factionUpgrades.filter((u) => u.tier === tier);
            if (tierUpgrades.length === 0) return null;
            return (
              <div key={tier}>
                <div className="text-xs text-gray-500 font-gothic tracking-wide mb-1">Tier {tier}</div>
                {tierUpgrades.map((upgrade) => (
                  <div key={upgrade.id} className="wh-panel p-3 mb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-gothic text-sm text-gray-200">{upgrade.name}</span>
                      <span className="text-xs text-wh-gold">{upgrade.assetsCost} Assets</span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{upgrade.type}</div>
                    <div className="text-xs text-gray-400 mt-1">{upgrade.description}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'rules' && <GamePhases />}
    </div>
  );
}

function GamePhases() {
  const phases = [
    {
      name: 'I. Planning Phase',
      description: 'Игроки по очереди размещают жетоны приказов на области карты. Приказы складываются в стопки — последний положенный выполняется первым.',
      steps: [
        'Начиная с первого игрока, каждый кладёт 1 жетон приказа',
        'Повторяется 4 раза (всего 4 приказа на игрока)',
        'Приказы можно класть поверх чужих, блокируя их',
      ],
    },
    {
      name: 'II. Operations Phase',
      description: 'Игроки выполняют приказы, начиная с верхних жетонов в стопках.',
      steps: [
        'Deploy (Развёртывание) — покупка и размещение юнитов',
        'Strategize (Стратегия) — получение боевых карт/апгрейдов',
        'Dominate (Доминирование) — сбор ресурсов с области',
        'Advance (Наступление) — перемещение юнитов и начало боя',
      ],
    },
    {
      name: 'III. Refresh Phase',
      description: 'Подготовка к следующему раунду.',
      steps: [
        'Восстановить использованные жетоны приказов',
        'Проверить условия победы (objective tokens)',
        'Передать жетон первого игрока',
        'Продвинуть маркер раунда',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {phases.map((phase) => (
        <div key={phase.name} className="wh-panel p-4">
          <h4 className="font-gothic text-wh-gold tracking-wide mb-2">{phase.name}</h4>
          <p className="text-sm text-gray-400 mb-2">{phase.description}</p>
          <ul className="space-y-1">
            {phase.steps.map((step, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-2">
                <span className="text-wh-gold-dim">▸</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
