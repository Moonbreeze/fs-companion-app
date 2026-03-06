import { useState, useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';
import type { TimerConfig } from '../data/types';

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  const sign = seconds < 0 ? '-' : '';
  return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
}

function TimerSettings() {
  const config = useTimerStore((s) => s.config);
  const setConfig = useTimerStore((s) => s.setConfig);
  const playerCount = useTimerStore((s) => s.playerCount);
  const setPlayerCount = useTimerStore((s) => s.setPlayerCount);

  const updateField = (field: keyof TimerConfig, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setConfig({ [field]: num });
    }
  };

  const fields: { key: keyof TimerConfig; label: string; hint: string }[] = [
    { key: 'strategyTurnTime', label: 'Стратегический ход', hint: 'секунд на ход' },
    { key: 'strategyReserve', label: 'Стратегический резерв', hint: 'банк времени' },
    { key: 'combatTurnTime', label: 'Боевой ход', hint: 'секунд на ход' },
    { key: 'combatReserve', label: 'Боевой резерв', hint: 'банк времени' },
  ];

  return (
    <div className="wh-panel p-4 space-y-4">
      <h3 className="font-gothic text-sm text-gray-300 tracking-wide">Настройки таймера</h3>

      <div>
        <label className="text-xs text-gray-500">Количество игроков</label>
        <div className="flex gap-2 mt-1">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setPlayerCount(n)}
              className={`px-3 py-1 text-sm border font-gothic ${
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

      {fields.map((field) => (
        <div key={field.key}>
          <label className="text-xs text-gray-500">{field.label}</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              value={config[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              className="w-24 bg-black/30 border border-wh-border px-2 py-1 text-sm text-gray-200 focus:border-wh-gold focus:outline-none"
            />
            <span className="text-xs text-gray-600">{field.hint} ({formatTime(config[field.key])})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimerDisplay() {
  const {
    config, mode, currentPlayerIndex, turnTimeLeft,
    reserveTimeLeft, isRunning, playerCount,
    startTimer, pauseTimer, nextPlayer, tick, resetTimer, setMode,
  } = useTimerStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const currentReserve = reserveTimeLeft[currentPlayerIndex] ?? 0;
  const isOvertime = turnTimeLeft <= 0;
  const totalTimeLeft = turnTimeLeft + currentReserve;
  const isOutOfTime = totalTimeLeft <= 0;

  const handlePlayPause = useCallback(() => {
    if (isRunning) pauseTimer();
    else startTimer();
  }, [isRunning, pauseTimer, startTimer]);

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('strategy')}
          className={`flex-1 py-2 font-gothic text-sm tracking-wide border ${
            mode === 'strategy' ? 'border-wh-gold text-wh-gold' : 'border-wh-border text-gray-500'
          }`}
        >
          Стратегия
        </button>
        <button
          onClick={() => setMode('combat')}
          className={`flex-1 py-2 font-gothic text-sm tracking-wide border ${
            mode === 'combat' ? 'border-wh-red-bright text-wh-red-bright' : 'border-wh-border text-gray-500'
          }`}
        >
          Бой
        </button>
      </div>

      {/* Current player */}
      <div className="text-center">
        <div className="text-sm text-gray-400 font-gothic tracking-wide">Игрок {currentPlayerIndex + 1}</div>
      </div>

      {/* Main timer */}
      <div className="text-center">
        <div
          className={`font-gothic text-7xl font-bold tracking-wider transition-colors ${
            isOutOfTime ? 'text-red-600 animate-pulse' : isOvertime ? 'text-yellow-500' : 'text-wh-gold wh-glow'
          }`}
        >
          {formatTime(Math.max(turnTimeLeft, 0))}
        </div>
        {isOvertime && !isOutOfTime && (
          <div className="text-sm text-yellow-500 font-gothic mt-1">Используется резерв</div>
        )}
        {isOutOfTime && (
          <div className="text-sm text-red-500 font-gothic mt-1 animate-pulse">Время вышло!</div>
        )}
      </div>

      {/* Reserve display */}
      <div className="text-center">
        <span className="text-xs text-gray-500 font-gothic tracking-wide">Резерв: </span>
        <span className={`text-sm font-bold ${currentReserve <= 30 ? 'text-red-400' : 'text-gray-300'}`}>
          {formatTime(currentReserve)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button onClick={handlePlayPause} className="wh-button text-lg px-8 py-3">
          {isRunning ? 'Пауза' : 'Старт'}
        </button>
        <button onClick={nextPlayer} className="wh-button text-sm px-6 py-3">
          Следующий
        </button>
      </div>

      {/* All players reserves */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: playerCount }, (_, i) => (
          <div
            key={i}
            className={`text-center p-2 border ${
              i === currentPlayerIndex ? 'border-wh-gold bg-wh-gold/5' : 'border-wh-border'
            }`}
          >
            <div className="text-xs text-gray-500">P{i + 1}</div>
            <div className={`text-sm font-bold ${reserveTimeLeft[i] <= 30 ? 'text-red-400' : 'text-gray-300'}`}>
              {formatTime(reserveTimeLeft[i] ?? 0)}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button onClick={resetTimer} className="wh-button wh-button-danger text-xs">
          Сбросить таймер
        </button>
      </div>
    </div>
  );
}

export default function TimerPage() {
  const [showSettings, setShowSettings] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Таймер</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-sm text-gray-400 hover:text-wh-gold font-gothic"
        >
          {showSettings ? 'Скрыть настройки' : 'Настройки'}
        </button>
      </div>

      {showSettings && <TimerSettings />}
      <TimerDisplay />
    </div>
  );
}
