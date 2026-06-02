import { useState } from 'react';

import { useCombatStore } from '../stores/combatStore';
import { factions, unitsByFaction, unitsById, combatCardsById, getCombatCardsForFaction } from '../data';
import { calculateDiceCount, calculateTotals, determineWinner, rollDice, analyzeAvailableCards } from '../combat';
import type { CardAnalysis } from '../combat';
import type { FactionId, DieIcon, CombatUnit } from '../data';
import FactionSelect from '../components/FactionSelect';

const DIE_COLORS: Record<DieIcon, string> = {
  offence: 'bg-red-600',
  defence: 'bg-blue-600',
  morale: 'bg-yellow-500',
};

const DIE_LABELS: Record<DieIcon, string> = {
  offence: 'A',
  defence: 'D',
  morale: 'M',
};

const DIE_CYCLE: DieIcon[] = ['offence', 'defence', 'morale'];

type Side = 'attacker' | 'defender';


/** A single die icon, clickable to cycle. */
function DieChip({ icon, onClick, onRemove }: { icon: DieIcon; onClick: () => void; onRemove: () => void }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-8 h-8 ${DIE_COLORS[icon]} text-white text-xs font-bold flex items-center justify-center border border-white/20 hover:brightness-125`}
      >
        {DIE_LABELS[icon]}
      </button>
      <button
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-4 h-4 bg-black border border-gray-600 text-gray-400 text-[10px] hidden group-hover:flex items-center justify-center hover:text-wh-red-bright"
      >
        ×
      </button>
    </div>
  );
}

/** Unit row in combat. */
function CombatUnitRow({ unit, index, side }: { unit: CombatUnit; index: number; side: Side }) {
  const routeUnit = useCombatStore((s) => s.routeUnit);
  const rallyUnit = useCombatStore((s) => s.rallyUnit);
  const destroyUnit = useCombatStore((s) => s.destroyUnit);

  const unitDef = unit.isReinforcement ? null : unitsById[unit.unitId];
  const name = unit.isReinforcement ? 'Подкрепление' : (unitDef?.name ?? unit.unitId);
  const isRouted = unit.state === 'routed';

  return (
    <div className={`flex items-center gap-2 bg-black/30 p-2 border border-wh-border ${isRouted ? 'opacity-50' : ''}`}>
      <span className={`text-sm flex-1 ${isRouted ? 'text-red-400 line-through' : 'text-gray-200'}`}>
        {name}
        {unitDef && <span className="text-xs text-gray-500 ml-1">({unitDef.combatValue}d, {unitDef.health}hp, {unitDef.morale}m)</span>}
      </span>
      <div className="flex gap-1">
        {isRouted ? (
          <button onClick={() => rallyUnit(side, index)} className="text-xs px-1.5 py-0.5 border border-green-500/40 text-green-400 hover:bg-green-900/20">
            Rally
          </button>
        ) : (
          <button onClick={() => routeUnit(side, index)} className="text-xs px-1.5 py-0.5 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-900/20">
            Rout
          </button>
        )}
        <button onClick={() => destroyUnit(side, index)} className="text-xs px-1.5 py-0.5 border border-red-500/40 text-red-400 hover:bg-red-900/20">
          ×
        </button>
      </div>
    </div>
  );
}

/** Side panel during combat execution. */
function ExecutionSidePanel({ side }: { side: Side }) {
  const data = useCombatStore((s) => s[side]);
  const addUnit = useCombatStore((s) => s.addUnit);
  const addReinforcement = useCombatStore((s) => s.addReinforcement);
  const addDie = useCombatStore((s) => s.addDie);
  const removeDie = useCombatStore((s) => s.removeDie);
  const convertDie = useCombatStore((s) => s.convertDie);
  const adjustCombatTokens = useCombatStore((s) => s.adjustCombatTokens);
  const playCard = useCombatStore((s) => s.playCard);
  const discardPlayedCard = useCombatStore((s) => s.discardPlayedCard);
  if (!data.factionId) return null;

  const faction = factions[data.factionId];
  const factionUnits = unitsByFaction[data.factionId] ?? [];
  const allCards = getCombatCardsForFaction(data.factionId);
  const playedCardIds = new Set(data.playedCards.map((pc) => pc.cardId));

  const totals = calculateTotals(data);
  const totalOffence = totals.offence;
  const totalDefence = totals.defence;
  const totalMorale = totals.morale;

  const handleConvertDie = (index: number) => {
    const current = data.dice[index];
    const nextIcon = DIE_CYCLE[(DIE_CYCLE.indexOf(current) + 1) % 3];
    convertDie(side, index, nextIcon);
  };

  return (
    <div className="wh-panel p-4 flex-1" style={{ borderColor: faction.color + '40' }}>
      <h3 className="font-gothic tracking-wide mb-3" style={{ color: faction.color }}>
        {side === 'attacker' ? 'Атакующий' : 'Защитник'}: {faction.name}
      </h3>

      {/* Units */}
      <div className="space-y-1 mb-3">
        {data.units.map((u, idx) => (
          <CombatUnitRow key={idx} unit={u} index={idx} side={side} />
        ))}
        {data.hasBastion && !data.bastionDestroyed && (
          <div className="flex items-center gap-2 bg-black/30 p-2 border border-wh-border border-dashed">
            <span className="text-sm text-gray-300 flex-1">Бастион</span>
            <button onClick={() => useCombatStore.getState().destroyBastion(side)} className="text-xs px-1.5 py-0.5 border border-red-500/40 text-red-400">
              Разрушить
            </button>
          </div>
        )}
      </div>

      {/* Quick add */}
      <div className="flex flex-wrap gap-1 mb-3">
        {factionUnits.map((unit) => (
          <button key={unit.id} onClick={() => addUnit(side, unit.id)}
            className="text-[10px] px-1.5 py-0.5 border border-wh-border text-gray-400 hover:text-wh-gold hover:border-wh-gold">
            +{unit.name}
          </button>
        ))}
        <button onClick={() => addReinforcement(side)}
          className="text-[10px] px-1.5 py-0.5 border border-green-500/40 text-green-400 hover:border-green-400">
          +Подкр.
        </button>
      </div>

      {/* Dice pool */}
      <div className="bg-black/30 p-2 border border-wh-border mb-3">
        <div className="text-xs text-gray-500 font-gothic mb-1">Кубы ({data.dice.length}/8)</div>
        <div className="flex flex-wrap gap-1 mb-1">
          {data.dice.map((die, idx) => (
            <DieChip key={idx} icon={die} onClick={() => handleConvertDie(idx)} onRemove={() => removeDie(side, idx)} />
          ))}
        </div>
        <div className="flex gap-1">
          {DIE_CYCLE.map((icon) => (
            <button key={icon} onClick={() => addDie(side, icon)}
              className={`text-[10px] px-1.5 py-0.5 border border-wh-border text-gray-400 hover:text-white`}>
              +{DIE_LABELS[icon]}
            </button>
          ))}
        </div>
      </div>

      {/* Combat tokens */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/30 p-2 border border-wh-border">
          <div className="text-[10px] text-gray-500">Токены атаки</div>
          <div className="flex items-center gap-1 mt-1">
            <button onClick={() => adjustCombatTokens(side, 'offence', -1)} className="text-xs text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-wh-border">-</button>
            <span className="text-sm font-bold text-red-400 min-w-[2ch] text-center">{data.combatTokens.offence}</span>
            <button onClick={() => adjustCombatTokens(side, 'offence', 1)} className="text-xs text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-wh-border">+</button>
          </div>
        </div>
        <div className="bg-black/30 p-2 border border-wh-border">
          <div className="text-[10px] text-gray-500">Токены защиты</div>
          <div className="flex items-center gap-1 mt-1">
            <button onClick={() => adjustCombatTokens(side, 'defence', -1)} className="text-xs text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-wh-border">-</button>
            <span className="text-sm font-bold text-blue-400 min-w-[2ch] text-center">{data.combatTokens.defence}</span>
            <button onClick={() => adjustCombatTokens(side, 'defence', 1)} className="text-xs text-gray-400 hover:text-white w-5 h-5 flex items-center justify-center border border-wh-border">+</button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-black/20 p-2 border border-wh-border mb-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-gray-500">Атака</div>
          <div className="text-red-400 font-bold text-lg">{totalOffence}</div>
        </div>
        <div>
          <div className="text-gray-500">Защита</div>
          <div className="text-blue-400 font-bold text-lg">{totalDefence}</div>
        </div>
        <div>
          <div className="text-gray-500">Мораль</div>
          <div className="text-yellow-400 font-bold text-lg">{totalMorale}</div>
        </div>
      </div>

      {/* Played cards */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 font-gothic mb-1">Сыгранные карты</div>
        {data.playedCards.length === 0 && <div className="text-xs text-gray-600 italic">Нет</div>}
        {data.playedCards.map((pc, idx) => {
          const card = combatCardsById[pc.cardId];
          return (
            <div key={idx} className="bg-black/30 p-2 border border-wh-border mb-1 flex items-start gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-200 font-gothic">{card?.name ?? pc.cardId}</div>
                {card && <CombatCardIconsSmall icons={card.icons} />}
                {card?.abilityPrimary && <div className="text-[10px] text-green-400/70 mt-0.5">{card.abilityPrimary}</div>}
                {card?.abilitySecondary && <div className="text-[10px] text-amber-400/60 mt-0.5">{card.abilitySecondary}</div>}
              </div>
              <button onClick={() => discardPlayedCard(side, idx)} className="text-gray-600 hover:text-wh-red-bright text-xs">×</button>
            </div>
          );
        })}
      </div>

      {/* Play cards */}
      <details className="group">
        <summary className="text-xs text-gray-400 font-gothic cursor-pointer hover:text-wh-gold">Сыграть карту...</summary>
        <div className="mt-1 space-y-1">
          {allCards.map((card) => {
            const isPlayed = playedCardIds.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => { if (!isPlayed) playCard(side, card.id); }}
                disabled={isPlayed}
                className={`w-full text-left text-xs p-2 border transition-colors
                  ${isPlayed
                    ? 'border-gray-700 text-gray-600 bg-black/20'
                    : 'border-wh-border text-gray-300 hover:border-wh-gold'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-gothic">{card.name}</span>
                  <CombatCardIconsSmall icons={card.icons} />
                  {card.isUpgrade && <span className="text-wh-gold">★</span>}
                </div>
                {card.unitRequisite && <div className="text-[10px] text-gray-500">{card.unitRequisite}</div>}
              </button>
            );
          })}
        </div>
      </details>
    </div>
  );
}

/** Small inline icon badges for combat cards. */
function CombatCardIconsSmall({ icons }: { icons: { offence: number; defence: number; morale: number } }) {
  const total = icons.offence + icons.defence + icons.morale;
  if (total === 0) return null;
  return (
    <span className="inline-flex gap-0.5">
      {icons.offence > 0 && <span className="text-[10px] text-red-400">A{icons.offence}</span>}
      {icons.defence > 0 && <span className="text-[10px] text-blue-400">D{icons.defence}</span>}
      {icons.morale > 0 && <span className="text-[10px] text-yellow-400">M{icons.morale}</span>}
    </span>
  );
}

// ============================================================
// Pending input UI components (Phase 4)
// ============================================================

/** Overlay shown when a played card requires user input to resolve its effects. */
function PendingInputsOverlay() {
  const pending = useCombatStore((s) => s.pendingEffects);
  const sideState = useCombatStore((s) => pending ? s[pending.side] : null);
  const dismissPending = useCombatStore((s) => s.dismissPending);
  const resolveUnitChoice = useCombatStore((s) => s.resolveUnitChoice);
  const resolveDiceChoice = useCombatStore((s) => s.resolveDiceChoice);
  const resolveTokenTypeChoice = useCombatStore((s) => s.resolveTokenTypeChoice);
  const resolveBranchChoice = useCombatStore((s) => s.resolveBranchChoice);

  if (!pending || !sideState) return null;

  const input = pending.inputs[0];
  if (!input) return null;

  const sideLabel = pending.side === 'attacker' ? 'Атакующий' : 'Защитник';

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="wh-panel p-5 max-w-sm w-full space-y-4 border border-wh-gold/40">
        <div className="font-gothic text-wh-gold text-sm tracking-wide">
          {sideLabel}: выбор эффекта
        </div>
        <div className="text-xs text-gray-400">
          Осталось шагов: {pending.inputs.length}
        </div>

        {input.type === 'chooseUnit' && (
          <div className="space-y-2">
            <div className="text-xs text-gray-300 font-gothic">
              {input.action === 'route' ? 'Выбери юнита для зарутки:' :
               input.action === 'rally' ? 'Выбери юнита для ралли:' :
               input.action === 'destroy' ? 'Выбери юнита для уничтожения:' :
               'Выбери юнита для отступления:'}
            </div>
            {useCombatStore.getState()[input.target].units.map((u, idx) => {
              const name = u.isReinforcement ? 'Подкрепление' : (combatCardsById[u.unitId] ? combatCardsById[u.unitId].name : u.unitId);
              const isActionable = input.action === 'rally' ? u.state === 'routed' : u.state === 'normal';
              if (!isActionable) return null;
              return (
                <button
                  key={idx}
                  onClick={() => resolveUnitChoice(idx)}
                  className="w-full text-left text-xs p-2 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold"
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {input.type === 'chooseDice' && (
          <DiceChooserInput
            target={input.target}
            amount={input.amount}
            action={input.action}
            convertTo={input.convertTo}
            onResolve={resolveDiceChoice}
          />
        )}

        {input.type === 'chooseTokenType' && (
          <div className="space-y-2">
            <div className="text-xs text-gray-300 font-gothic">
              Выбери тип токена (+{input.amount}):
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => resolveTokenTypeChoice('offence')}
                className="flex-1 py-2 border border-red-500/50 text-red-400 text-xs hover:bg-red-900/20 font-gothic"
              >
                Атака (g) +{input.amount}
              </button>
              <button
                onClick={() => resolveTokenTypeChoice('defence')}
                className="flex-1 py-2 border border-blue-500/50 text-blue-400 text-xs hover:bg-blue-900/20 font-gothic"
              >
                Защита (s) +{input.amount}
              </button>
            </div>
          </div>
        )}

        {input.type === 'chooseBranch' && (
          <div className="space-y-2">
            <div className="text-xs text-gray-300 font-gothic">Выбор эффекта:</div>
            <button
              onClick={() => resolveBranchChoice(0)}
              className="w-full text-left text-xs p-2 border border-wh-border text-gray-300 hover:border-wh-gold"
            >
              {input.optionA}
            </button>
            <button
              onClick={() => resolveBranchChoice(1)}
              className="w-full text-left text-xs p-2 border border-wh-border text-gray-300 hover:border-wh-gold"
            >
              {input.optionB}
            </button>
          </div>
        )}

        {(input.type === 'chooseCard') && (
          <div className="text-xs text-gray-400 italic">
            Разыграй карту вручную (из руки).
          </div>
        )}

        <button onClick={dismissPending} className="w-full text-xs py-1.5 border border-gray-700 text-gray-500 hover:text-gray-300">
          Пропустить / применить вручную
        </button>
      </div>
    </div>
  );
}

function DiceChooserInput({ target, amount, action, convertTo, onResolve }: {
  target: Side;
  amount: number;
  action: 'reroll' | 'convert';
  convertTo?: DieIcon;
  onResolve: (indices: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const dice = useCombatStore((s) => s[target].dice);

  const toggle = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : prev.length < amount ? [...prev, idx] : prev
    );
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-300 font-gothic">
        {action === 'reroll' ? `Выбери до ${amount} кубов для переброса:` : `Выбери до ${amount} кубов (→ ${convertTo ?? '?'}):`}
      </div>
      <div className="flex flex-wrap gap-1">
        {dice.map((die, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={`w-8 h-8 text-xs font-bold border transition-colors
              ${DIE_COLORS[die]} ${selected.includes(idx) ? 'ring-2 ring-wh-gold' : 'opacity-60'}`}
          >
            {DIE_LABELS[die]}
          </button>
        ))}
      </div>
      <button
        onClick={() => onResolve(selected)}
        disabled={selected.length === 0}
        className="wh-button text-xs py-1 px-3 disabled:opacity-40"
      >
        Применить ({selected.length})
      </button>
    </div>
  );
}

/** Setup phase — select factions & units. */
function CombatSetup() {
  const [attackerFaction, setAttackerFaction] = useState<FactionId | null>(null);
  const [defenderFaction, setDefenderFaction] = useState<FactionId | null>(null);
  const [attackerUnits, setAttackerUnits] = useState<string[]>([]);
  const [defenderUnits, setDefenderUnits] = useState<string[]>([]);
  const [defenderHasBastion, setDefenderHasBastion] = useState(false);

  const startCombat = useCombatStore((s) => s.startCombat);
  const addUnit = useCombatStore((s) => s.addUnit);
  const setBastion = useCombatStore((s) => s.setBastion);
  const setPhase = useCombatStore((s) => s.setPhase);
  const setDice = useCombatStore((s) => s.setDice);

  const handleStart = () => {
    if (!attackerFaction || !defenderFaction) return;

    startCombat(attackerFaction, defenderFaction);

    // Add units
    attackerUnits.forEach((uid) => addUnit('attacker', uid));
    defenderUnits.forEach((uid) => addUnit('defender', uid));

    if (defenderHasBastion) setBastion('defender', true);

    // Roll dice
    const atkCount = calculateDiceCount(
      attackerUnits.map((uid) => ({ unitId: uid, state: 'normal' as const, isReinforcement: false })),
      false, attackerFaction,
    );
    const defCount = calculateDiceCount(
      defenderUnits.map((uid) => ({ unitId: uid, state: 'normal' as const, isReinforcement: false })),
      defenderHasBastion, defenderFaction,
    );

    setDice('attacker', rollDice(atkCount));
    setDice('defender', rollDice(defCount));

    setPhase('execution');
  };

  const addUnitToSide = (side: 'attacker' | 'defender', unitId: string) => {
    if (side === 'attacker') setAttackerUnits([...attackerUnits, unitId]);
    else setDefenderUnits([...defenderUnits, unitId]);
  };

  const removeUnitFromSide = (side: 'attacker' | 'defender', index: number) => {
    if (side === 'attacker') setAttackerUnits(attackerUnits.filter((_, i) => i !== index));
    else setDefenderUnits(defenderUnits.filter((_, i) => i !== index));
  };

  const renderUnitPicker = (side: 'attacker' | 'defender', factionId: FactionId | null, selectedUnits: string[]) => {
    if (!factionId) return null;
    const units = unitsByFaction[factionId] ?? [];
    return (
      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-1">Юниты:</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {units.map((unit) => (
            <button key={unit.id} onClick={() => addUnitToSide(side, unit.id)}
              className="text-xs px-2 py-1 border border-wh-border text-gray-300 hover:border-wh-gold hover:text-wh-gold">
              {unit.name}
            </button>
          ))}
        </div>
        <div className="space-y-1">
          {selectedUnits.map((uid, idx) => {
            const unitDef = unitsById[uid];
            return (
              <div key={idx} className="flex items-center gap-2 bg-black/30 p-1.5 border border-wh-border text-xs">
                <span className="text-gray-200 flex-1">{unitDef?.name ?? uid}</span>
                <button onClick={() => removeUnitFromSide(side, idx)} className="text-gray-600 hover:text-wh-red-bright">×</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="wh-panel p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <FactionSelect value={attackerFaction} onChange={setAttackerFaction} label="Атакующий" />
          {renderUnitPicker('attacker', attackerFaction, attackerUnits)}
        </div>
        <div>
          <FactionSelect value={defenderFaction} onChange={setDefenderFaction} label="Защитник" />
          {renderUnitPicker('defender', defenderFaction, defenderUnits)}
          {defenderFaction && (
            <label className="flex items-center gap-2 mt-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={defenderHasBastion}
                onChange={(e) => setDefenderHasBastion(e.target.checked)}
                className="accent-wh-gold"
              />
              Бастион
            </label>
          )}
        </div>
      </div>
      {attackerFaction && defenderFaction && (
        <button onClick={handleStart} className="wh-button">Начать бой</button>
      )}
    </div>
  );
}

/** Impact badge for a numeric range. */
function ImpactBadge({ min, max, color }: { min: number; max: number; color: string }) {
  if (min === 0 && max === 0) return null;
  const label = min === max ? `${min > 0 ? '+' : ''}${min}` : `${min > 0 ? '+' : ''}${min}…${max > 0 ? '+' : ''}${max}`;
  return <span className={`text-[10px] font-bold ${color}`}>{label}</span>;
}

/** Summary row for a single card analysis. */
function CardAnalysisRow({ analysis }: { analysis: CardAnalysis }) {
  const t = analysis.total;
  const hasNumeric = t.offenceMin !== 0 || t.offenceMax !== 0 || t.defenceMin !== 0 || t.defenceMax !== 0 || t.moraleMin !== 0 || t.moraleMax !== 0;
  const uniqueNotes = [...new Set(t.notes)];

  return (
    <div className="bg-black/20 p-1.5 border border-wh-border/50 mb-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-gray-200 font-gothic">{analysis.cardName}</span>
        <CombatCardIconsSmall icons={analysis.icons} />
        {!analysis.canPlaySecondary && (
          <span className="text-[9px] text-gray-600 italic">нет реквизита</span>
        )}
      </div>
      {hasNumeric && (
        <div className="flex gap-2 mt-0.5">
          <ImpactBadge min={t.offenceMin} max={t.offenceMax} color="text-red-400" />
          <ImpactBadge min={t.defenceMin} max={t.defenceMax} color="text-blue-400" />
          <ImpactBadge min={t.moraleMin} max={t.moraleMax} color="text-yellow-400" />
        </div>
      )}
      {uniqueNotes.length > 0 && (
        <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">
          {uniqueNotes.join(' · ')}
        </div>
      )}
    </div>
  );
}

/** Available cards with analysis hint for a combat side. */
function OpponentCardsHint({ side }: { side: Side }) {
  const combatState = useCombatStore((s) => s);
  const data = combatState[side];
  if (!data.factionId) return null;

  const faction = factions[data.factionId];
  const analyses = analyzeAvailableCards(combatState, side);

  return (
    <div className="bg-black/30 p-3 border border-wh-border">
      <div className="text-xs text-gray-500 font-gothic mb-2">
        Карты {faction.name} ({analyses.length} доступно)
      </div>
      {analyses.length === 0 && <div className="text-xs text-gray-600 italic">Все карты сыграны</div>}
      {analyses.map((analysis) => (
        <CardAnalysisRow key={analysis.cardId} analysis={analysis} />
      ))}
    </div>
  );
}

export default function CombatPage() {
  const isActive = useCombatStore((s) => s.isActive);
  const phase = useCombatStore((s) => s.phase);
  const executionRound = useCombatStore((s) => s.executionRound);
  const nextExecutionRound = useCombatStore((s) => s.nextExecutionRound);
  const setPhase = useCombatStore((s) => s.setPhase);
  const endCombat = useCombatStore((s) => s.endCombat);

  const attacker = useCombatStore((s) => s.attacker);
  const defender = useCombatStore((s) => s.defender);

  if (!isActive || phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Боевой помощник</h2>
        <CombatSetup />
      </div>
    );
  }

  const handleNextRound = () => {
    if (executionRound >= 3) {
      setPhase('resolution');
    } else {
      nextExecutionRound();
    }
  };

  if (phase === 'resolution') {
    const result = determineWinner(attacker, defender);
    const atkMorale = result.attackerMorale;
    const defMorale = result.defenderMorale;
    const winner = result.winner === 'attacker' ? 'Атакующий побеждает!' : atkMorale === defMorale ? 'Защитник побеждает (ничья)!' : 'Защитник побеждает!';

    return (
      <div className="space-y-6">
        <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">Итоги боя</h2>
        <div className="wh-panel p-6 text-center space-y-4">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-sm text-gray-400 font-gothic">Атакующий</div>
              <div className="text-4xl font-bold text-yellow-400 mt-2">{atkMorale}</div>
              <div className="text-xs text-gray-500 mt-1">мораль</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 font-gothic">Защитник</div>
              <div className="text-4xl font-bold text-yellow-400 mt-2">{defMorale}</div>
              <div className="text-xs text-gray-500 mt-1">мораль</div>
            </div>
          </div>
          <div className="font-gothic text-xl text-wh-gold wh-glow">{winner}</div>
          <button onClick={endCombat} className="wh-button">Завершить бой</button>
        </div>
      </div>
    );
  }

  // Execution phase
  return (
    <>
      <PendingInputsOverlay />
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-gothic text-xl text-wh-gold tracking-wider wh-glow">
            Бой — Раунд {executionRound}/3
          </h2>
          <div className="flex gap-2">
            <button onClick={handleNextRound} className="wh-button text-xs py-1 px-3">
              {executionRound >= 3 ? 'К итогам' : 'Следующий раунд'}
            </button>
            <button onClick={endCombat} className="wh-button wh-button-danger text-xs py-1 px-3">Завершить</button>
          </div>
        </div>

        {/* Opponent hints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OpponentCardsHint side="attacker" />
          <OpponentCardsHint side="defender" />
        </div>

        {/* Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExecutionSidePanel side="attacker" />
          <ExecutionSidePanel side="defender" />
        </div>
      </div>
    </>
  );
}
