import { useState, useMemo } from 'react';

import { useSessionStore } from '../stores/sessionStore';
import { factions, unitsByFaction, getUpgradeCombatCards, getOrderUpgradesForFaction } from '../data';
import type { AssetType, TerritoryInfo, Unit, CombatCard, OrderUpgrade } from '../data';

const ASSET_LABELS: Record<AssetType, string> = {
  reinforcement: 'Подкрепление',
  cache: 'Кэш',
  forge: 'Кузница',
};

const ASSET_COLORS: Record<AssetType, string> = {
  reinforcement: 'text-green-400',
  cache: 'text-yellow-300',
  forge: 'text-orange-400',
};

const STRUCTURE_OPTIONS: { value: TerritoryInfo['structure']; label: string }[] = [
  { value: null, label: 'Нет' },
  { value: 'factory', label: 'Фабрика' },
  { value: 'city', label: 'Город' },
  { value: 'bastion', label: 'Бастион' },
];

const ASSET_TYPE_OPTIONS: { value: TerritoryInfo['assetType']; label: string }[] = [
  { value: null, label: 'Нет' },
  { value: 'reinforcement', label: 'Подкрепление' },
  { value: 'cache', label: 'Кэш' },
  { value: 'forge', label: 'Кузница' },
  { value: 'prosperity', label: 'Процветание' },
];

const STRUCTURE_LABELS: Record<string, string> = {
  factory: 'Фабрика',
  city: 'Город',
  bastion: 'Бастион',
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  reinforcement: 'Подкрепление',
  cache: 'Кэш',
  forge: 'Кузница',
  prosperity: 'Процветание',
};

/** Stepper control with +/- buttons around a value. */
function Stepper({
  value,
  onDecrement,
  onIncrement,
  color = 'text-wh-gold',
  size = 'text-2xl',
}: {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  color?: string;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border"
      >
        -
      </button>
      <span className={`${size} font-bold ${color} min-w-[2ch] text-center`}>{value}</span>
      <button
        onClick={onIncrement}
        className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border"
      >
        +
      </button>
    </div>
  );
}

/** Form to add a new territory to a player. */
function AddTerritoryForm({ onAdd }: { onAdd: (t: TerritoryInfo) => void }) {
  const [worldName, setWorldName] = useState('');
  const [structure, setStructure] = useState<TerritoryInfo['structure']>(null);
  const [materielValue, setMaterielValue] = useState(0);
  const [assetType, setAssetType] = useState<TerritoryInfo['assetType']>(null);
  const [unitCapacity, setUnitCapacity] = useState(1);

  const handleAdd = () => {
    if (!worldName.trim()) return;

    onAdd({
      worldName: worldName.trim(),
      structure,
      materielValue,
      assetType,
      unitCapacity,
    });
    setWorldName('');
    setStructure(null);
    setMaterielValue(0);
    setAssetType(null);
    setUnitCapacity(1);
  };

  return (
    <div className="bg-black/40 p-3 border border-wh-border space-y-2 mt-2">
      <div className="text-xs text-gray-400 font-gothic tracking-wide">Добавить территорию</div>
      <input
        type="text"
        placeholder="Название мира"
        value={worldName}
        onChange={(e) => setWorldName(e.target.value)}
        className="w-full bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 placeholder-gray-600 focus:border-wh-gold focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Структура</label>
          <select
            value={structure ?? ''}
            onChange={(e) => setStructure((e.target.value || null) as TerritoryInfo['structure'])}
            className="w-full bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
          >
            {STRUCTURE_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Ресурс</label>
          <select
            value={assetType ?? ''}
            onChange={(e) => setAssetType((e.target.value || null) as TerritoryInfo['assetType'])}
            className="w-full bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
          >
            {ASSET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Materiel</label>
          <input
            type="number"
            min={0}
            value={materielValue}
            onChange={(e) => setMaterielValue(Number(e.target.value))}
            className="w-full bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Вместимость</label>
          <input
            type="number"
            min={0}
            value={unitCapacity}
            onChange={(e) => setUnitCapacity(Number(e.target.value))}
            className="w-full bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
          />
        </div>
      </div>
      <button onClick={handleAdd} className="wh-button text-xs py-1 px-3">
        Добавить
      </button>
    </div>
  );
}

type PlanItem =
  | { type: 'unit'; id: string; name: string; materielCost: number; commandLevel: number; forgeCost: boolean }
  | { type: 'combatUpgrade'; id: string; name: string; materielCost: number; commandLevel: number }
  | { type: 'orderUpgrade'; id: string; name: string; materielCost: number; commandLevel: number };

/** Purchase planner for a player: add units/upgrades and check affordability. */
function Planner({ playerIndex }: { playerIndex: number }) {
  const player = useSessionStore((s) => s.players[playerIndex]);
  const getCommandLevel = useSessionStore((s) => s.getCommandLevel);

  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  const factionUnits = unitsByFaction[player.factionId] ?? [];
  const combatUpgrades = getUpgradeCombatCards(player.factionId);
  const orderUpgrades = getOrderUpgradesForFaction(player.factionId);
  const commandLevel = getCommandLevel(playerIndex);

  const addUnit = (unit: Unit) => {
    setPlanItems([
      ...planItems,
      {
        type: 'unit',
        id: unit.id,
        name: unit.name,
        materielCost: unit.materielCost,
        commandLevel: unit.commandLevel,
        forgeCost: unit.forgeCost,
      },
    ]);
  };

  const addCombatUpgrade = (card: CombatCard) => {
    setPlanItems([
      ...planItems,
      {
        type: 'combatUpgrade',
        id: card.id,
        name: card.name,
        materielCost: card.materielCost,
        commandLevel: card.commandLevel,
      },
    ]);
  };

  const addOrderUpgrade = (upgrade: OrderUpgrade) => {
    setPlanItems([
      ...planItems,
      {
        type: 'orderUpgrade',
        id: upgrade.id,
        name: upgrade.name,
        materielCost: upgrade.materielCost,
        commandLevel: upgrade.commandLevel,
      },
    ]);
  };

  const removeFromPlan = (idx: number) => {
    setPlanItems(planItems.filter((_, i) => i !== idx));
  };

  // Calculate costs with cache discount logic:
  // Each cache token reduces cost of 1 unit/structure by 2, max 1 cache per item.
  // Cache does NOT apply to upgrades.
  const analysis = useMemo(() => {
    const cacheEligible = planItems.filter((item) => item.type === 'unit');
    const nonCacheItems = planItems.filter((item) => item.type !== 'unit');

    // Sort cache-eligible items by cost descending to maximize discount
    const sortedEligible = [...cacheEligible].sort((a, b) => b.materielCost - a.materielCost);

    const availableCaches = player.assets.cache;
    let cachesUsed = 0;
    let totalMateriel = 0;

    for (const item of sortedEligible) {
      const discount = cachesUsed < availableCaches ? 2 : 0;
      totalMateriel += Math.max(0, item.materielCost - discount);
      if (discount > 0) cachesUsed++;
    }

    for (const item of nonCacheItems) {
      totalMateriel += item.materielCost;
    }

    // Count forge requirements
    const forgesNeeded = planItems.filter(
      (item) => item.type === 'unit' && (item as PlanItem & { type: 'unit' }).forgeCost
    ).length;

    // Check command level requirements
    const maxCommandRequired = planItems.reduce((max, item) => Math.max(max, item.commandLevel), 0);
    const commandOk = maxCommandRequired <= commandLevel;

    // Check forge availability (each forge token can reduce command level by 1 OR satisfy forge cost)
    const forgeOk = forgesNeeded <= player.assets.forge;

    const canAfford = totalMateriel <= player.materiel && commandOk && forgeOk;

    return { totalMateriel, cachesUsed, forgesNeeded, maxCommandRequired, commandOk, forgeOk, canAfford };
  }, [planItems, player.materiel, player.assets.cache, player.assets.forge, commandLevel]);

  return (
    <details className="group">
      <summary className="font-gothic text-sm text-gray-300 tracking-wide cursor-pointer hover:text-wh-gold transition-colors">
        Планировщик
      </summary>
      <div className="mt-3 space-y-3">
        {/* Units */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Юниты</div>
          <div className="flex flex-wrap gap-1">
            {factionUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => addUnit(unit)}
                className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold transition-colors"
              >
                {unit.name} ({unit.materielCost}m, ур.{unit.commandLevel}
                {unit.forgeCost ? ', F' : ''})
              </button>
            ))}
          </div>
        </div>

        {/* Combat upgrades */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Боевые апгрейды</div>
          <div className="flex flex-wrap gap-1">
            {combatUpgrades.map((card) => (
              <button
                key={card.id}
                onClick={() => addCombatUpgrade(card)}
                className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold transition-colors"
              >
                {card.name} ({card.materielCost}m, ур.{card.commandLevel})
              </button>
            ))}
          </div>
        </div>

        {/* Order upgrades */}
        <div>
          <div className="text-xs text-gray-500 mb-1">Апгрейды приказов</div>
          <div className="flex flex-wrap gap-1">
            {orderUpgrades.map((upgrade) => (
              <button
                key={upgrade.id}
                onClick={() => addOrderUpgrade(upgrade)}
                className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold transition-colors"
              >
                {upgrade.name} ({upgrade.materielCost}m, ур.{upgrade.commandLevel})
              </button>
            ))}
          </div>
        </div>

        {/* Plan summary */}
        {planItems.length > 0 && (
          <div className="bg-black/40 p-3 border border-wh-border">
            <div className="text-xs text-gray-400 mb-2 font-gothic">Запланировано:</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {planItems.map((item, idx) => (
                <span
                  key={idx}
                  onClick={() => removeFromPlan(idx)}
                  className="text-xs px-2 py-1 bg-wh-dark border border-wh-border text-gray-300 cursor-pointer hover:border-wh-red-bright hover:text-wh-red-bright"
                >
                  {item.name} ×
                </span>
              ))}
            </div>

            <div className="space-y-1 text-sm font-gothic">
              <div className={analysis.canAfford ? 'text-green-400' : 'text-wh-red-bright'}>
                Materiel: {analysis.totalMateriel} / {player.materiel}
                {analysis.cachesUsed > 0 && (
                  <span className="text-yellow-300 ml-1">(кэш ×{analysis.cachesUsed})</span>
                )}
                {analysis.totalMateriel > player.materiel && ' — не хватает!'}
              </div>

              <div className={analysis.commandOk ? 'text-green-400' : 'text-wh-red-bright'}>
                Уровень командования: требуется {analysis.maxCommandRequired}, текущий {commandLevel}
                {!analysis.commandOk && ' — недостаточно!'}
              </div>

              {analysis.forgesNeeded > 0 && (
                <div className={analysis.forgeOk ? 'text-green-400' : 'text-wh-red-bright'}>
                  Кузница: требуется {analysis.forgesNeeded}, доступно {player.assets.forge}
                  {!analysis.forgeOk && ' — недостаточно!'}
                </div>
              )}
            </div>

            <button
              onClick={() => setPlanItems([])}
              className="text-xs text-gray-500 hover:text-gray-300 mt-2"
            >
              Очистить план
            </button>
          </div>
        )}
      </div>
    </details>
  );
}

/** Panel for a single player with all resource tracking. */
function PlayerPanel({ index }: { index: number }) {
  const player = useSessionStore((s) => s.players[index]);
  const firstPlayerIndex = useSessionStore((s) => s.firstPlayerIndex);
  const adjustMateriel = useSessionStore((s) => s.adjustMateriel);
  const adjustAsset = useSessionStore((s) => s.adjustAsset);
  const adjustObjectives = useSessionStore((s) => s.adjustObjectives);
  const addTerritory = useSessionStore((s) => s.addTerritory);
  const removeTerritory = useSessionStore((s) => s.removeTerritory);
  const getCommandLevel = useSessionStore((s) => s.getCommandLevel);
  const getMaterielIncome = useSessionStore((s) => s.getMaterielIncome);

  const faction = factions[player.factionId];
  const commandLevel = getCommandLevel(index);
  const materielIncome = getMaterielIncome(index);
  const isFirstPlayer = firstPlayerIndex === index;

  const assetTypes: AssetType[] = ['reinforcement', 'cache', 'forge'];

  return (
    <div className="wh-panel p-4" style={{ borderColor: faction.color + '40' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-gothic text-lg tracking-wide flex items-center gap-2" style={{ color: faction.color }}>
            {player.name || faction.name}
            {isFirstPlayer && (
              <span className="text-xs text-wh-gold border border-wh-gold px-1.5 py-0.5 font-gothic tracking-wider">
                1-й игрок
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500">{faction.fullName}</p>
        </div>
        <div className="text-right text-xs space-y-1">
          <div className="text-gray-400">
            Командование: <span className="text-wh-gold font-bold">{commandLevel}</span>
          </div>
          <div className="text-gray-400">
            Доход: <span className="text-wh-gold font-bold">+{materielIncome}</span>
          </div>
        </div>
      </div>

      {/* Materiel dial */}
      <div className="bg-black/30 p-3 border border-wh-border mb-3">
        <div className="text-xs text-gray-400 font-gothic tracking-wide mb-1">Materiel</div>
        <Stepper
          value={player.materiel}
          onDecrement={() => adjustMateriel(index, -1)}
          onIncrement={() => adjustMateriel(index, 1)}
          color="text-wh-gold"
        />
      </div>

      {/* Asset tokens */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {assetTypes.map((assetType) => (
          <div key={assetType} className="bg-black/30 p-2 border border-wh-border">
            <div className="text-xs text-gray-400 font-gothic tracking-wide mb-1">
              {ASSET_LABELS[assetType]}
            </div>
            <Stepper
              value={player.assets[assetType]}
              onDecrement={() => adjustAsset(index, assetType, -1)}
              onIncrement={() => adjustAsset(index, assetType, 1)}
              color={ASSET_COLORS[assetType]}
              size="text-xl"
            />
          </div>
        ))}
      </div>

      {/* Objective tokens */}
      <div className="bg-black/30 p-3 border border-wh-border mb-3">
        <div className="text-xs text-gray-400 font-gothic tracking-wide mb-1">Жетоны целей</div>
        <Stepper
          value={player.objectiveTokens}
          onDecrement={() => adjustObjectives(index, -1)}
          onIncrement={() => adjustObjectives(index, 1)}
          color="text-wh-red-bright"
        />
      </div>

      {/* Territories (collapsible) */}
      <details className="group mb-3">
        <summary className="font-gothic text-sm text-gray-300 tracking-wide cursor-pointer hover:text-wh-gold transition-colors">
          Территории ({player.territories.length})
        </summary>
        <div className="mt-2 space-y-2">
          {player.territories.length === 0 && (
            <p className="text-xs text-gray-600 italic">Нет контролируемых территорий</p>
          )}
          {player.territories.map((territory) => (
            <div
              key={territory.worldName}
              className="bg-black/30 p-2 border border-wh-border flex items-center justify-between"
            >
              <div className="text-sm">
                <span className="text-gray-200 font-gothic">{territory.worldName}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {territory.structure ? STRUCTURE_LABELS[territory.structure] : '—'}
                  {' | '}M: {territory.materielValue}
                  {territory.assetType ? ` | ${ASSET_TYPE_LABELS[territory.assetType]}` : ''}
                  {' | '} вмест.: {territory.unitCapacity}
                </span>
              </div>
              <button
                onClick={() => removeTerritory(index, territory.worldName)}
                className="text-gray-600 hover:text-wh-red-bright text-xs ml-2"
              >
                Убрать
              </button>
            </div>
          ))}
          <AddTerritoryForm onAdd={(t) => addTerritory(index, t)} />
        </div>
      </details>

      {/* Planner (collapsible) */}
      <Planner playerIndex={index} />
    </div>
  );
}

/** Resources page — main session tracking view. */
export default function ResourcesPage() {
  const isActive = useSessionStore((s) => s.isActive);
  const players = useSessionStore((s) => s.players);
  const currentRound = useSessionStore((s) => s.currentRound);
  const firstPlayerIndex = useSessionStore((s) => s.firstPlayerIndex);
  const nextRound = useSessionStore((s) => s.nextRound);

  if (!isActive) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-gothic text-lg text-gray-500 tracking-wide">
          Начните сессию на главной странице
        </p>
      </div>
    );
  }

  const firstPlayer = players[firstPlayerIndex];
  const firstPlayerFaction = firstPlayer ? factions[firstPlayer.factionId] : undefined;

  return (
    <div className="space-y-6">
      {/* Header: round + first player */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">
            Раунд {currentRound} / 8
          </h2>
          {firstPlayerFaction && (
            <p className="text-sm text-gray-400">
              Первый игрок:{' '}
              <span style={{ color: firstPlayerFaction.color }} className="font-gothic">
                {firstPlayer.name || firstPlayerFaction.name}
              </span>
            </p>
          )}
        </div>
        <button onClick={nextRound} className="wh-button text-sm py-1.5 px-4">
          Следующий раунд
        </button>
      </div>

      {/* Player panels */}
      <div className="space-y-4">
        {players.map((_, index) => (
          <PlayerPanel key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
