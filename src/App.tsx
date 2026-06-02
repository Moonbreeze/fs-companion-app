import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useSessionStore } from './stores/sessionStore';
import { factions } from './data';
import type { FactionId, TimerConfig } from './data';
import FactionSelect from './components/FactionSelect';
import Layout from './components/Layout';
import ResourcesPage from './pages/ResourcesPage';
import CombatPage from './pages/CombatPage';
import ReferencePage from './pages/ReferencePage';
import TimerPage from './pages/TimerPage';

const DEFAULT_TIMER: TimerConfig = {
  strategyTurnTime: 120,
  strategyReserve: 600,
  combatTurnTime: 30,
  combatReserve: 120,
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface PlayerSetup {
  factionId: FactionId | null;
  name: string;
}

function SessionSetup() {
  const startSession = useSessionStore((s) => s.startSession);
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState<PlayerSetup[]>(
    Array.from({ length: 4 }, () => ({ factionId: null, name: '' })),
  );
  const [timer, setTimer] = useState<TimerConfig>(DEFAULT_TIMER);

  const updatePlayer = (index: number, update: Partial<PlayerSetup>) => {
    setPlayers(players.map((p, i) => (i === index ? { ...p, ...update } : p)));
  };

  const activePlayers = players.slice(0, playerCount);
  const usedFactions = activePlayers.map((p) => p.factionId).filter(Boolean) as FactionId[];
  const allFactionsSelected = activePlayers.every((p) => p.factionId !== null);

  const handleStart = () => {
    if (!allFactionsSelected) return;
    const configs = activePlayers.map((p) => ({
      factionId: p.factionId!,  // validated by allFactionsSelected check
      name: p.name || factions[p.factionId!].name,
    }));
    startSession(configs, timer);
  };

  const updateTimer = (field: keyof TimerConfig, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setTimer({ ...timer, [field]: num });
    }
  };

  const timerFields: { key: keyof TimerConfig; label: string }[] = [
    { key: 'strategyTurnTime', label: 'Стратегический ход (сек)' },
    { key: 'strategyReserve', label: 'Стратегический резерв (сек)' },
    { key: 'combatTurnTime', label: 'Боевой ход (сек)' },
    { key: 'combatReserve', label: 'Боевой резерв (сек)' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-gothic text-3xl text-wh-gold wh-glow tracking-wider font-bold">
            Forbidden Stars
          </h1>
          <p className="font-gothic text-sm text-gray-500 tracking-widest uppercase mt-1">
            Companion
          </p>
        </div>

        {/* Player count */}
        <div className="wh-panel p-6 space-y-6">
          <div>
            <label className="text-xs text-gray-400 font-gothic tracking-wide">Количество игроков</label>
            <div className="flex gap-2 mt-2">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setPlayerCount(n)}
                  className={`px-4 py-2 text-sm font-gothic border ${
                    playerCount === n
                      ? 'border-wh-gold text-wh-gold'
                      : 'border-wh-border text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Player configs */}
          {activePlayers.map((player, index) => (
            <div key={index} className="bg-black/30 p-4 border border-wh-border space-y-3">
              <div className="text-sm text-gray-400 font-gothic tracking-wide">
                Игрок {index + 1}
              </div>
              <input
                type="text"
                placeholder="Имя игрока"
                value={player.name}
                onChange={(e) => updatePlayer(index, { name: e.target.value })}
                className="w-full bg-black/30 border border-wh-border px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-wh-gold focus:outline-none"
              />
              <FactionSelect
                value={player.factionId}
                onChange={(id) => updatePlayer(index, { factionId: id })}
                exclude={usedFactions.filter((f) => f !== player.factionId)}
                label="Фракция"
              />
            </div>
          ))}
        </div>

        {/* Timer config */}
        <div className="wh-panel p-6 space-y-4">
          <h3 className="font-gothic text-sm text-gray-300 tracking-wide">Настройки таймера</h3>
          <div className="grid grid-cols-2 gap-4">
            {timerFields.map((field) => (
              <div key={field.key}>
                <label className="text-xs text-gray-500">{field.label}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={timer[field.key]}
                    onChange={(e) => updateTimer(field.key, e.target.value)}
                    className="w-24 bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
                  />
                  <span className="text-xs text-gray-600">{formatTime(timer[field.key])}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={!allFactionsSelected}
            className={`wh-button text-lg px-10 py-3 ${!allFactionsSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Начать сессию
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const isActive = useSessionStore((s) => s.isActive);

  if (!isActive) {
    return <SessionSetup />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ResourcesPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/reference" element={<ReferencePage />} />
          <Route path="/timer" element={<TimerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
