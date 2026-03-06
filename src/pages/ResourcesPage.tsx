import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { factions, units, upgrades } from '../data';
import FactionSelect from '../components/FactionSelect';
import type { FactionId } from '../data';

function PlayerPanel({ index }: { index: number }) {
  const player = useGameStore((s) => s.players[index]);
  const adjustResource = useGameStore((s) => s.adjustResource);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const faction = factions[player.factionId];

  const [planItems, setPlanItems] = useState<{ id: string; type: 'unit' | 'upgrade' }[]>([]);

  const factionUnits = units.filter((u) => u.factionId === player.factionId);
  const factionUpgrades = upgrades.filter((u) => u.factionId === player.factionId);

  const planCost = planItems.reduce((sum, item) => {
    if (item.type === 'unit') {
      const unit = factionUnits.find((u) => u.id === item.id);
      return { materiel: sum.materiel + (unit?.materielCost ?? 0), assets: sum.assets };
    }
    const upgrade = factionUpgrades.find((u) => u.id === item.id);
    return { materiel: sum.materiel, assets: sum.assets + (upgrade?.assetsCost ?? 0) };
  }, { materiel: 0, assets: 0 });

  const canAfford = planCost.materiel <= player.materiel && planCost.assets <= player.assets;

  const addToPlan = (id: string, type: 'unit' | 'upgrade') => {
    setPlanItems([...planItems, { id, type }]);
  };

  const removeFromPlan = (idx: number) => {
    setPlanItems(planItems.filter((_, i) => i !== idx));
  };

  const getPlanItemName = (item: { id: string; type: 'unit' | 'upgrade' }) => {
    if (item.type === 'unit') return factionUnits.find((u) => u.id === item.id)?.name ?? item.id;
    return factionUpgrades.find((u) => u.id === item.id)?.name ?? item.id;
  };

  return (
    <div className="wh-panel p-4" style={{ borderColor: faction.color + '40' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-gothic text-lg tracking-wide" style={{ color: faction.color }}>
            {player.name || faction.name}
          </h3>
          <p className="text-xs text-gray-500">{faction.fullName}</p>
        </div>
        <button onClick={() => removePlayer(index)} className="text-gray-600 hover:text-wh-red-bright text-sm">
          Убрать
        </button>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/30 p-3 border border-wh-border">
          <div className="text-xs text-gray-400 font-gothic tracking-wide mb-1">Materiel</div>
          <div className="flex items-center gap-2">
            <button onClick={() => adjustResource(index, 'materiel', -1)} className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border">-</button>
            <span className="text-2xl font-bold text-wh-gold min-w-[2ch] text-center">{player.materiel}</span>
            <button onClick={() => adjustResource(index, 'materiel', 1)} className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border">+</button>
          </div>
        </div>
        <div className="bg-black/30 p-3 border border-wh-border">
          <div className="text-xs text-gray-400 font-gothic tracking-wide mb-1">Assets</div>
          <div className="flex items-center gap-2">
            <button onClick={() => adjustResource(index, 'assets', -1)} className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border">-</button>
            <span className="text-2xl font-bold text-wh-gold min-w-[2ch] text-center">{player.assets}</span>
            <button onClick={() => adjustResource(index, 'assets', 1)} className="text-gray-400 hover:text-white text-lg w-7 h-7 flex items-center justify-center border border-wh-border">+</button>
          </div>
        </div>
      </div>

      {/* Planner */}
      <details className="group">
        <summary className="font-gothic text-sm text-gray-300 tracking-wide cursor-pointer hover:text-wh-gold transition-colors">
          Планировщик
        </summary>
        <div className="mt-3 space-y-3">
          {/* Add units */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Юниты (Materiel)</div>
            <div className="flex flex-wrap gap-1">
              {factionUnits.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => addToPlan(unit.id, 'unit')}
                  className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold transition-colors"
                >
                  {unit.name} ({unit.materielCost})
                </button>
              ))}
            </div>
          </div>

          {/* Add upgrades */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Апгрейды (Assets)</div>
            <div className="flex flex-wrap gap-1">
              {factionUpgrades.map((upgrade) => (
                <button
                  key={upgrade.id}
                  onClick={() => addToPlan(upgrade.id, 'upgrade')}
                  className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold transition-colors"
                >
                  {upgrade.name} ({upgrade.assetsCost})
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
                    {getPlanItemName(item)} ×
                  </span>
                ))}
              </div>
              <div className={`text-sm font-gothic ${canAfford ? 'text-green-400' : 'text-wh-red-bright'}`}>
                Итого: {planCost.materiel} Materiel, {planCost.assets} Assets
                {!canAfford && ' — не хватает ресурсов!'}
              </div>
              <button onClick={() => setPlanItems([])} className="text-xs text-gray-500 hover:text-gray-300 mt-1">
                Очистить план
              </button>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

export default function ResourcesPage() {
  const players = useGameStore((s) => s.players);
  const currentRound = useGameStore((s) => s.currentRound);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const nextRound = useGameStore((s) => s.nextRound);
  const resetGame = useGameStore((s) => s.resetGame);
  const [selectedFaction, setSelectedFaction] = useState<FactionId | null>(null);
  const [playerName, setPlayerName] = useState('');

  const usedFactions = players.map((p) => p.factionId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Ресурсы</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 font-gothic">Раунд {currentRound}</span>
          <button onClick={nextRound} className="wh-button text-xs py-1 px-3">Следующий раунд</button>
        </div>
      </div>

      {/* Player panels */}
      <div className="space-y-4">
        {players.map((_, index) => (
          <PlayerPanel key={index} index={index} />
        ))}
      </div>

      {/* Add player */}
      {players.length < 4 && (
        <div className="wh-panel p-4">
          <h3 className="font-gothic text-sm text-gray-300 tracking-wide mb-3">Добавить игрока</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Имя игрока"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-black/30 border border-wh-border px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-wh-gold focus:outline-none"
            />
            <FactionSelect
              value={selectedFaction}
              onChange={setSelectedFaction}
              exclude={usedFactions}
              label="Фракция"
            />
            {selectedFaction && (
              <button
                onClick={() => {
                  addPlayer(selectedFaction, playerName || factions[selectedFaction].name);
                  setSelectedFaction(null);
                  setPlayerName('');
                }}
                className="wh-button text-sm"
              >
                Добавить
              </button>
            )}
          </div>
        </div>
      )}

      {players.length > 0 && (
        <button onClick={resetGame} className="wh-button wh-button-danger text-xs">
          Сбросить игру
        </button>
      )}
    </div>
  );
}
