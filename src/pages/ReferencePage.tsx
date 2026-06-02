import { useState } from 'react';

import { factions, unitsByFaction, bastions, getBaseCombatCards, getUpgradeCombatCards, getOrderUpgradesForFaction } from '../data';
import type { FactionId, Unit, CombatCard, OrderUpgrade } from '../data';
import FactionSelect from '../components/FactionSelect';

type Tab = 'units' | 'cards' | 'orderUpgrades' | 'rules';

function IconBadge({ icon, value }: { icon: string; value: number; }) {
  if (value === 0) return null;
  const colorMap: Record<string, string> = {
    offence: 'text-red-400 border-red-500/40',
    defence: 'text-blue-400 border-blue-500/40',
    morale: 'text-yellow-400 border-yellow-500/40',
  };
  const labels: Record<string, string> = { offence: 'A', defence: 'D', morale: 'M' };
  return (
    <span className={`text-xs px-1.5 py-0.5 border ${colorMap[icon]}`}>
      {labels[icon]}{value}
    </span>
  );
}

function CombatCardIcons({ icons }: { icons: { offence: number; defence: number; morale: number } }) {
  return (
    <div className="flex gap-1">
      <IconBadge icon="offence" value={icons.offence} />
      <IconBadge icon="defence" value={icons.defence} />
      <IconBadge icon="morale" value={icons.morale} />
    </div>
  );
}

function UnitCard({ unit }: { unit: Unit }) {
  return (
    <div className="wh-panel p-3 flex items-center gap-4">
      <div className="flex-1">
        <div className="font-gothic text-sm text-gray-200">{unit.name}</div>
        <div className="text-xs text-gray-500">
          {unit.unitType === 'ground' ? 'Наземный' : 'Корабль'} · Tier {unit.commandLevel}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        <div>
          <div className="text-gray-500">Цена</div>
          <div className="text-wh-gold font-bold">
            {unit.materielCost}{unit.forgeCost ? '+F' : ''}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Кубы</div>
          <div className="text-red-400 font-bold">{unit.combatValue}</div>
        </div>
        <div>
          <div className="text-gray-500">HP</div>
          <div className="text-green-400 font-bold">{unit.health}</div>
        </div>
        <div>
          <div className="text-gray-500">MRL</div>
          <div className="text-yellow-400 font-bold">{unit.morale}</div>
        </div>
        <div>
          <div className="text-gray-500">Лимит</div>
          <div className="text-gray-300 font-bold">{unit.limit}</div>
        </div>
      </div>
    </div>
  );
}

function CombatCardEntry({ card }: { card: CombatCard }) {
  return (
    <div className="wh-panel p-3 mb-1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-gothic text-sm text-gray-200">{card.name}</span>
          <CombatCardIcons icons={card.icons} />
        </div>
        {card.isUpgrade && (
          <span className="text-xs text-wh-gold">
            {card.materielCost}m · Tier {card.commandLevel}
          </span>
        )}
      </div>
      {card.abilityPrimary && (
        <div className="text-xs text-green-400/80 mt-1">{card.abilityPrimary}</div>
      )}
      {card.abilitySecondary && (
        <div className="text-xs text-amber-400/70 mt-1">{card.abilitySecondary}</div>
      )}
      {card.unitRequisite && (
        <div className="text-xs text-gray-500 mt-1">Требуется: {card.unitRequisite}</div>
      )}
    </div>
  );
}

function OrderUpgradeEntry({ upgrade }: { upgrade: OrderUpgrade }) {
  const orderColors: Record<string, string> = {
    Deploy: 'border-green-500/40 text-green-400',
    Strategize: 'border-blue-500/40 text-blue-400',
    Dominate: 'border-yellow-500/40 text-yellow-400',
    Advance: 'border-red-500/40 text-red-400',
  };

  return (
    <div className="wh-panel p-3 mb-1">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-gothic text-sm text-gray-200">{upgrade.name}</span>
          <span className={`text-xs px-1.5 py-0.5 border ${orderColors[upgrade.orderType] ?? 'border-gray-500 text-gray-400'}`}>
            {upgrade.orderType}
          </span>
        </div>
        <span className="text-xs text-wh-gold">
          {upgrade.materielCost}m · Tier {upgrade.commandLevel}
        </span>
      </div>
      <div className="text-xs text-gray-300 mt-1">{upgrade.effect}</div>
      {upgrade.limit && (
        <div className="text-xs text-gray-500 mt-1">{upgrade.limit}</div>
      )}
    </div>
  );
}

function GamePhases() {
  const phases = [
    {
      name: 'I. Фаза планирования',
      description: 'Игроки по очереди размещают 4 жетона приказов рубашкой вверх на системы. Приказы складываются в стопки — последний положенный выполняется первым. Можно класть поверх чужих приказов, блокируя их.',
    },
    {
      name: 'II. Фаза операций',
      description: 'Игроки поочерёдно выполняют верхние приказы из стопок.',
      steps: [
        { label: 'Deploy', text: 'Покупка юнитов (нужна фабрика в системе) и 1 структуры. Лимит развёртывания = сумма вместимостей дружественных миров с фабриками.' },
        { label: 'Strategize', text: 'Покупка до 1 боевого апгрейда + 1 апгрейда приказа. Жетон приказа кладётся на колоду событий.' },
        { label: 'Dominate', text: 'Сбор ассетов с контролируемых миров + способность фракции.' },
        { label: 'Advance', text: 'Перемещение юнитов (наземных и кораблей) + начало боя или орбитальный удар.' },
      ],
    },
    {
      name: 'III. Фаза обновления',
      description: 'Подготовка к следующему раунду.',
      steps: [
        { label: '1', text: 'Сбор objective-жетонов с контролируемых миров.' },
        { label: '2', text: 'Сбор materiel (сумма значений дружественных миров, макс. 14).' },
        { label: '3', text: 'Ралли всех routed юнитов.' },
        { label: '4', text: 'События и варп-штормы (вытягивание событий, перемещение штормов).' },
        { label: '5', text: 'Передача жетона первого игрока, продвижение маркера раунда.' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {phases.map((phase) => (
        <div key={phase.name} className="wh-panel p-4">
          <h4 className="font-gothic text-wh-gold tracking-wide mb-2">{phase.name}</h4>
          <p className="text-sm text-gray-400 mb-2">{phase.description}</p>
          {phase.steps && (
            <ul className="space-y-1">
              {phase.steps.map((step, i) => (
                <li key={i} className="text-xs text-gray-300 flex gap-2">
                  <span className="text-wh-gold-dim font-gothic min-w-[2rem]">{step.label}</span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReferencePage() {
  const [faction, setFaction] = useState<FactionId>('ultramarines');
  const [tab, setTab] = useState<Tab>('units');

  const factionData = factions[faction];
  const factionUnits = unitsByFaction[faction] ?? [];
  const baseCards = getBaseCombatCards(faction);
  const upgradeCards = getUpgradeCombatCards(faction);
  const orderUpgrades = getOrderUpgradesForFaction(faction);
  const bastion = bastions[faction];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'units', label: 'Юниты' },
    { id: 'cards', label: 'Боевые карты' },
    { id: 'orderUpgrades', label: 'Апгрейды приказов' },
    { id: 'rules', label: 'Фазы игры' },
  ];

  // Group units by command level
  const unitsByTier = [0, 1, 2, 3].map((tier) => ({
    tier,
    units: factionUnits.filter((u) => u.commandLevel === tier),
  })).filter((g) => g.units.length > 0);

  // Group upgrade cards by command level
  const upgradesByTier = [0, 2, 3].map((tier) => ({
    tier,
    cards: upgradeCards.filter((c) => c.commandLevel === tier),
  })).filter((g) => g.cards.length > 0);

  // Group order upgrades by command level
  const ordersByTier = [0, 1, 2].map((tier) => ({
    tier,
    upgrades: orderUpgrades.filter((u) => u.commandLevel === tier),
  })).filter((g) => g.upgrades.length > 0);

  return (
    <div className="space-y-6">
      <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Справочник</h2>

      <FactionSelect value={faction} onChange={setFaction} />

      <div className="wh-panel p-4">
        <p className="text-sm text-gray-400" style={{ borderLeftColor: factionData.color, borderLeftWidth: 3, paddingLeft: 12 }}>
          {factionData.description}
        </p>
        {factionData.dominateAbility && (
          <p className="text-xs text-yellow-400/70 mt-2" style={{ paddingLeft: 12 }}>
            Dominate: {factionData.dominateAbility}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-wh-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-gothic tracking-wide transition-colors whitespace-nowrap
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
        <div className="space-y-4">
          {unitsByTier.map(({ tier, units }) => (
            <div key={tier}>
              <div className="text-xs text-gray-500 font-gothic tracking-wide mb-1">Tier {tier}</div>
              <div className="space-y-1">
                {units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} />
                ))}
              </div>
            </div>
          ))}
          {/* Bastion */}
          {bastion && (
            <div>
              <div className="text-xs text-gray-500 font-gothic tracking-wide mb-1">Бастион</div>
              <div className="wh-panel p-3">
                <div className="font-gothic text-sm text-gray-200 mb-1">Bastion</div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-400">Кубы: <span className="text-red-400 font-bold">{bastion.combatValue}</span></span>
                  <span className="text-gray-400">HP: <span className="text-green-400 font-bold">{bastion.health}</span></span>
                  <span className="text-gray-400">MRL: <span className="text-yellow-400 font-bold">{bastion.morale}</span></span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Не может быть routed. Блокирует орбитальный удар.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'cards' && (
        <div className="space-y-6">
          {/* Base cards */}
          <div>
            <div className="text-xs text-gray-500 font-gothic tracking-wide mb-2">
              Базовые карты (×2 каждая в колоде)
            </div>
            {baseCards.map((card) => (
              <CombatCardEntry key={card.id} card={card} />
            ))}
          </div>

          {/* Upgrade cards */}
          <div>
            <div className="text-xs text-gray-500 font-gothic tracking-wide mb-2">
              Карты улучшений
            </div>
            {upgradesByTier.map(({ tier, cards }) => (
              <div key={tier} className="mb-3">
                <div className="text-xs text-gray-600 mb-1">Tier {tier}</div>
                {cards.map((card) => (
                  <CombatCardEntry key={card.id} card={card} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orderUpgrades' && (
        <div className="space-y-4">
          {ordersByTier.map(({ tier, upgrades }) => (
            <div key={tier}>
              <div className="text-xs text-gray-500 font-gothic tracking-wide mb-1">Tier {tier}</div>
              {upgrades.map((upgrade) => (
                <OrderUpgradeEntry key={upgrade.id} upgrade={upgrade} />
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'rules' && <GamePhases />}
    </div>
  );
}
