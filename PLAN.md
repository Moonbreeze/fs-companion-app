# План: Разделение механик и отображения + формализация боевых эффектов карт

## Контекст

Приложение-компаньон для настольной игры Forbidden Stars. Текущее состояние: боевая логика (подсчёт иконок, морали, кубов) размазана между `combatStore.ts` и `CombatPage.tsx`. Эффекты карт хранятся как текстовые строки (`abilityPrimary`, `abilitySecondary`) и не формализованы — приложение не может их применять программно.

Цель: выделить слой боевых механик, формализовать эффекты карт, реализовать анализ возможных ходов противника.

---

## Фаза 1: Выделение слоя боевых механик

### Цель

Вся боевая логика живёт в `src/combat/` — чистые функции без зависимостей от React/Zustand. Store и UI становятся тонкими обёртками.

### Шаг 1.1: Создать директорию `src/combat/` и типы боевого состояния

Создать файл `src/combat/types.ts`. Перенести и расширить боевые типы из `src/data/types.ts`:

- `CombatSideState` — текущее состояние стороны (уже существует в `src/data/types.ts`, перенести сюда)
- `CombatState` — полное состояние боя (phase, executionRound, attacker, defender)
- `CombatUnit`, `PlayedCard`, `DieIcon` — перенести из `src/data/types.ts`

В `src/data/types.ts` оставить только реэкспорты из `src/combat/types.ts` для обратной совместимости на переходном этапе (удалить после полной миграции).

**Новые типы:**
```typescript
/** Результат подсчёта иконок для одной стороны. */
type CombatTotals = {
  offence: number;  // кубы + токены + иконки сыгранных карт
  defence: number;
  morale: number;   // кубы + иконки карт + мораль незароученных юнитов + бастион
};

/** Результат фазы resolution. */
type CombatResult = {
  attackerMorale: number;
  defenderMorale: number;
  winner: 'attacker' | 'defender';
};
```

### Шаг 1.2: Вынести чистые функции подсчёта в `src/combat/calculations.ts`

Извлечь логику, которая сейчас дублируется в `CombatPage.tsx` и `combatStore.ts`:

**Из `CombatPage.tsx`:**
- `calcDiceCount` (строки 28–40) → `calculateDiceCount(units, hasBastion, factionId): number`
- Подсчёт иконок с карт (строки 117–119) → часть `calculateTotals`
- Подсчёт морали юнитов + бастиона (строки 127–135) → часть `calculateTotals`
- `calcMorale` (строки 455–463) → заменяется на `calculateTotals`

**Из `combatStore.ts`:**
- `getOffenceTotal` (строки 280–285) → заменяется на `calculateTotals`
- `getDefenceTotal` (строки 287–291) → заменяется на `calculateTotals`
- `getMoraleTotal` (строки 293–298) → заменяется на `calculateTotals`
- `countIconsFromCards` (строки 84–93) → часть `calculateTotals`

**Экспортируемые функции:**
```typescript
/** Рассчитать количество кубов для стороны на основе юнитов и бастиона. */
const calculateDiceCount = (units: CombatUnit[], hasBastion: boolean, factionId: FactionId | null): number

/** Подсчитать все итоги (offence, defence, morale) для одной стороны. */
const calculateTotals = (side: CombatSideState): CombatTotals

/** Определить победителя по морали обеих сторон. Защитник побеждает при ничьей. */
const determineWinner = (attacker: CombatSideState, defender: CombatSideState): CombatResult

/** Бросить N кубов (рандомные DieIcon). */
const rollDice = (count: number): DieIcon[]
```

Все функции — чистые (кроме `rollDice`), зависят только от данных из `src/data/` (unitsById, bastions, combatCardsById). Эти зависимости передаются как импорты, а не через DI — данные статичны.

### Шаг 1.3: Вынести мутации состояния в `src/combat/actions.ts`

Чистые функции-редьюсеры вида `(state, payload) => state`. Каждая возвращает новый `CombatState`:

```typescript
const startCombat = (attackerFaction: FactionId, defenderFaction: FactionId): CombatState
const addUnit = (state: CombatState, side: Side, unitId: string): CombatState
const removeUnit = (state: CombatState, side: Side, index: number): CombatState
const routeUnit = (state: CombatState, side: Side, index: number): CombatState
const rallyUnit = (state: CombatState, side: Side, index: number): CombatState
const rallyAll = (state: CombatState, side: Side): CombatState
const destroyUnit = (state: CombatState, side: Side, index: number): CombatState
const setBastion = (state: CombatState, side: Side, hasBastion: boolean): CombatState
const destroyBastion = (state: CombatState, side: Side): CombatState
const addReinforcement = (state: CombatState, side: Side): CombatState
const removeReinforcement = (state: CombatState, side: Side, index: number): CombatState
const setDice = (state: CombatState, side: Side, dice: DieIcon[]): CombatState
const addDie = (state: CombatState, side: Side, icon: DieIcon): CombatState
const removeDie = (state: CombatState, side: Side, index: number): CombatState
const convertDie = (state: CombatState, side: Side, index: number, newIcon: DieIcon): CombatState
const setCombatTokens = (state: CombatState, side: Side, offence: number, defence: number): CombatState
const adjustCombatTokens = (state: CombatState, side: Side, tokenType: 'offence' | 'defence', delta: number): CombatState
const playCard = (state: CombatState, side: Side, cardId: string): CombatState
const discardPlayedCard = (state: CombatState, side: Side, index: number): CombatState
const nextExecutionRound = (state: CombatState): CombatState
const endCombat = (): CombatState
```

Логика 1:1 из текущего `combatStore.ts`, но без Zustand. Хелпер `updateSide` (строки 74–81 combatStore.ts) переносится сюда как внутренний утилит.

### Шаг 1.4: Создать `src/combat/index.ts`

Реэкспорт всего публичного API:
- Типы из `types.ts`
- Функции из `calculations.ts`
- Действия из `actions.ts`

### Шаг 1.5: Переписать `combatStore.ts` как тонкую обёртку

Store становится минимальным — хранит `CombatState` и делегирует все мутации в `src/combat/actions`, все вычисления в `src/combat/calculations`:

```typescript
import { create } from 'zustand';
import * as actions from '../combat/actions';
import * as calc from '../combat/calculations';
import type { CombatState } from '../combat/types';

export const useCombatStore = create<CombatState & CombatActions>((set, get) => ({
  ...actions.endCombat(), // начальное состояние = "неактивный бой"

  startCombat: (atk, def) => set(actions.startCombat(atk, def)),
  addUnit: (side, unitId) => set((s) => actions.addUnit(s, side, unitId)),
  // ... остальные методы — однострочные делегаты
}));
```

Методы `getOffenceTotal`, `getDefenceTotal`, `getMoraleTotal` удаляются из стора. Компоненты вызывают `calculateTotals` напрямую, передавая `side` из стора.

### Шаг 1.6: Обновить `CombatPage.tsx`

- Удалить `calcDiceCount` (строки 28–40) — импортировать из `src/combat`
- Удалить `rollDie` (строка 25) — использовать `rollDice` из `src/combat`
- Удалить подсчёт иконок в `ExecutionSidePanel` (строки 117–135) — заменить на `calculateTotals(data)`
- Удалить `calcMorale` в `CombatPage` (строки 455–463) — заменить на `determineWinner`
- Компоненты отображения (`DieChip`, `CombatUnitRow`, `CombatCardIconsSmall`) остаются без изменений — это чистый UI

**Проверка:** после этого шага вся игровая логика в `CombatPage.tsx` сводится к вызовам функций из `src/combat/` и методов стора. В компоненте остаётся только рендеринг и обработка пользовательских событий.

---

## Фаза 2: Формализация эффектов карт

### Цель

Каждая боевая карта получает формальное описание эффектов, которое приложение может исполнять программно. Текстовые описания (`abilityPrimary`, `abilitySecondary`) сохраняются для отображения.

### Шаг 2.1: Спроектировать систему типов для эффектов — `src/combat/effects/types.ts`

Эффекты карт делятся на **атомарные действия** (primitives), которые комбинируются в последовательности:

```typescript
/** Атомарные боевые действия. */
type CombatEffect =
  // --- Токены ---
  | { type: 'gainOffenceTokens'; amount: number }
  | { type: 'gainDefenceTokens'; amount: number }
  | { type: 'loseOffenceTokens'; target: 'self' | 'enemy'; amount: number }
  | { type: 'loseDefenceTokens'; target: 'self' | 'enemy'; amount: number }

  // --- Кубы ---
  | { type: 'gainDie'; icon: DieIcon | 'random' }
  | { type: 'gainDice'; icon: DieIcon | 'random'; amount: number }
  | { type: 'loseDie'; target: 'self' | 'enemy'; icon: DieIcon | 'any'; amount: number }
  | { type: 'convertDice'; target: 'self' | 'enemy'; from: DieIcon | 'any'; to: DieIcon; amount: number }
  | { type: 'rerollDice'; target: 'self' | 'enemy' | 'both'; icon: DieIcon | 'all'; amount: number | 'all' }

  // --- Юниты ---
  | { type: 'routeUnit'; target: 'self' | 'enemy'; choice: 'self' | 'enemy' }
  | { type: 'rallyUnit'; amount: number }
  | { type: 'rallyAll' }
  | { type: 'destroyUnit'; target: 'self' | 'enemy'; choice: 'self' | 'enemy' }
  | { type: 'placeReinforcement' }
  | { type: 'preventRouting' }  // юниты не могут быть routed в этот раунд
  | { type: 'preventDamage' }   // юниты не получают урона в этот execution round

  // --- Условные ---
  | { type: 'conditional'; condition: EffectCondition; then: CombatEffect[]; else?: CombatEffect[] }

  // --- Выбор противника (развилки) ---
  | { type: 'enemyChoice'; optionA: CombatEffect[]; optionB: CombatEffect[] }

  // --- Масштабирование ---
  | { type: 'perUnit'; unitFilter: UnitFilter; effect: CombatEffect }
  | { type: 'perDie'; dieIcon: DieIcon; effect: CombatEffect }

  // --- Требующие пользовательского ввода ---
  | { type: 'userChooseDice'; target: 'self' | 'enemy'; amount: number; action: 'reroll' | 'convert'; convertTo?: DieIcon }
  | { type: 'userChooseUnit'; target: 'self' | 'enemy'; action: 'route' | 'rally' | 'destroy' | 'retreat' }
  | { type: 'userChooseTokenType'; amount: number }  // gain N (g) or (s), player chooses

  // --- Специальные (уникальные эффекты карт) ---
  | { type: 'discardEnemyCard'; source: 'hand' | 'faceup'; choice: 'self' | 'enemy' | 'random' }
  | { type: 'drawCombatCard' }
  | { type: 'playExtraCard'; iconsOnly: boolean }     // Eldar "Command of the Autarch"
  | { type: 'extraDamageStep' }                        // UM "Armoured Advance"
  | { type: 'mirrorTokens' }                           // Ork "Rokkit Wagon" — copy enemy tokens
  | { type: 'upgradeUnit'; from: string; to: string }  // Chaos "Mark of Tzeentch"
  | { type: 'moveUnit'; scope: 'any' | 'adjacent' }   // movement during combat
  | { type: 'spendDiceForTokens'; dieIcon: DieIcon; tokensPerDie: number; tokenType: 'offence' | 'defence' }

type EffectCondition =
  | { type: 'isAttacker' }
  | { type: 'isDefender' }
  | { type: 'moreMoraleDice' }     // больше [M] чем у оппонента
  | { type: 'enemyHasRoutedUnit' }
  | { type: 'moreUnroutedUnits' }
  | { type: 'hasUnit'; unitFilter: UnitFilter }

type UnitFilter =
  | { type: 'byName'; names: string[] }    // "Boyz", "Onslaught", etc.
  | { type: 'byTier'; tier: number }
  | { type: 'unrouted' }
  | { type: 'routed' }
  | { type: 'reinforcement' }
```

Это покроет подавляющее большинство эффектов карт. Для edge-кейсов (2-3 уникальных карты) допускается специальный тип — лучше, чем переусложнять систему.

### Шаг 2.2: Расширить тип `CombatCard` — `src/data/types.ts`

Добавить поле с формализованными эффектами:

```typescript
interface CombatCard {
  // ... существующие поля ...
  effects?: {
    primary?: CombatEffect[];    // зелёная область — эффект без реквизитов
    secondary?: CombatEffect[];  // коричневая область — требует юнита
  };
}
```

Поле `effects` опциональное — карты без формализованных эффектов продолжают работать как раньше (отображается текст). Это позволяет внедрять эффекты инкрементально, карта за картой.

### Шаг 2.3: Формализовать эффекты базовых карт — `src/data/combatCards.ts`

Начать с базовых карт (5 × 4 фракции = 20 уникальных). Они критичны для анализа первого раунда. Пример:

```typescript
// Ultramarines — Ambush
{
  id: 'um-ambush',
  // ... существующие поля ...
  effects: {
    primary: [
      { type: 'gainOffenceTokens', amount: 2 },
    ],
    secondary: [
      // "When enemy is routed this round, must spend [M] or be destroyed"
      // Это пассивный эффект — обрабатывается отдельно
      { type: 'conditional', condition: { type: 'enemyHasRoutedUnit' },
        then: [{ type: 'enemyChoice',
          optionA: [{ type: 'loseDie', target: 'enemy', icon: 'morale', amount: 1 }],
          optionB: [{ type: 'destroyUnit', target: 'enemy', choice: 'enemy' }],
        }],
      },
    ],
  },
},

// Orks — Slugga Boyz
{
  id: 'ork-slugga-boyz',
  effects: {
    primary: [
      { type: 'rerollDice', target: 'enemy', icon: 'offence', amount: 'all' },
    ],
    secondary: [
      { type: 'rerollDice', target: 'enemy', icon: 'defence', amount: 'all' },
    ],
  },
},
```

Каждую карту формализовать, сверяя с текстовым описанием. Описания (`abilityPrimary`, `abilitySecondary`) НЕ удалять — они нужны для отображения.

**Порядок работы по фракциям:**
1. Ultramarines (5 базовых) — наиболее прямолинейные эффекты
2. Orks (5 базовых) — много reroll-механик
3. Chaos (5 базовых) — условные эффекты (moreMoraleDice)
4. Eldar (5 базовых) — самые сложные (Command of the Autarch, retreat)

### Шаг 2.4: Формализовать эффекты апгрейд-карт — `src/data/combatCards.ts`

Аналогично шагу 2.3, но для upgrade-карт (9 × 4 фракции = 36 уникальных). Приоритет по tier:
1. Tier 0 апгрейды (16 карт) — наиболее часто покупаемые
2. Tier 2 апгрейды (12 карт)
3. Tier 3 апгрейды (8 карт) — редко в игре, можно последними

### Шаг 2.5: Написать исполнитель эффектов — `src/combat/effects/executor.ts`

Функция, применяющая массив `CombatEffect[]` к `CombatState`:

```typescript
type EffectExecutionResult = {
  state: CombatState;
  pendingInputs: PendingInput[];  // эффекты, требующие пользовательского ввода
};

type PendingInput =
  | { type: 'chooseDice'; /* ... */ }
  | { type: 'chooseUnit'; /* ... */ }
  | { type: 'chooseTokenType'; /* ... */ }
  | { type: 'chooseCard'; /* ... */ };

/** Применить эффекты карты к состоянию боя. */
const executeEffects = (
  state: CombatState,
  side: Side,
  effects: CombatEffect[],
): EffectExecutionResult
```

Исполнитель:
- Обрабатывает автоматические эффекты последовательно, мутируя копию `CombatState`
- При встрече эффекта, требующего ввода — останавливается, возвращает `pendingInputs`
- При встрече `conditional` — проверяет условие по текущему состоянию
- При встрече `enemyChoice` — **не исполняет**, а возвращает как pending (для анализа — пробует обе ветки)

**Важно:** `rerollDice` не исполняется детерминировано. Для реального применения — вызывает рандом. Для анализа — используется отдельная логика (см. фазу 3).

### Шаг 2.6: Создать `src/combat/effects/index.ts`

Реэкспорт типов и исполнителя.

---

## Фаза 3: Анализ возможных ходов противника

### Цель

Перед тем как выбрать свою карту, игрок видит, какие карты может сыграть противник и каков worst-case/best-case по иконкам для каждой.

### Шаг 3.1: Определить модель анализа — `src/combat/analysis/types.ts`

```typescript
/** Анализ одной возможной карты противника. */
type CardAnalysis = {
  cardId: string;
  cardName: string;

  /** Иконки карты (постоянные, добавляются при розыгрыше). */
  icons: CombatCardIcons;

  /** Можно ли сыграть карту (есть ли незароученный юнит-реквизит для secondary). */
  canPlaySecondary: boolean;

  /** Эффект primary — гарантированный. Расчёт иконок worst/best case. */
  primary: EffectImpact;

  /** Эффект secondary — только если выполнен реквизит. */
  secondary: EffectImpact | null;

  /** Суммарный worst/best case (icons + primary + secondary). */
  total: EffectImpact;
};

/** Влияние эффекта на баланс иконок. */
type EffectImpact = {
  /** Минимальное/максимальное изменение иконок ДЛЯ стороны, играющей карту. */
  offenceMin: number;
  offenceMax: number;
  defenceMin: number;
  defenceMax: number;
  moraleMin: number;
  moraleMax: number;

  /** Дополнительные заметки (rout, destroy, специальные эффекты). */
  notes: string[];
};
```

### Шаг 3.2: Написать статический анализатор — `src/combat/analysis/analyzer.ts`

```typescript
/** Проанализировать все доступные карты стороны и их потенциальное влияние. */
const analyzeAvailableCards = (
  state: CombatState,
  side: Side,
): CardAnalysis[]
```

Логика:
1. Получить список карт фракции, исключить уже сыгранные
2. Для каждой карты:
   a. Проверить `canPlaySecondary` — есть ли незароученный юнит, подходящий под `unitRequisite`
   b. Если `effects.primary` определён — вычислить `EffectImpact` статически
   c. Если `effects.secondary` определён и `canPlaySecondary` — аналогично
   d. Для `conditional` — проверить условие по текущему состоянию, если true — включить then-ветку, иначе else-ветку
   e. Для `enemyChoice` — включить обе ветки; min = худшая для анализируемой стороны, max = лучшая
   f. Для `rerollDice` — min/max считать статистически (worst case: все reroll в невыгодную сторону, best: все в выгодную)
   g. Для `perUnit` / `perDie` — посчитать количество по текущему состоянию, умножить
   h. Для эффектов с пользовательским вводом — предположить оптимальный выбор для анализируемой стороны
3. Суммировать: icons карты (постоянные) + primary + secondary

### Шаг 3.3: Написать `src/combat/analysis/requisiteCheck.ts`

Утилита для проверки `unitRequisite` строки против текущих юнитов:

```typescript
/** Проверить, есть ли незароученный юнит, удовлетворяющий реквизиту. */
const meetsRequisite = (
  units: CombatUnit[],
  requisite: string,    // "Marine/ Cruiser", "Bastion/ Marine/ Cruiser"
  hasBastion: boolean,
): boolean
```

Парсинг строки `unitRequisite`: разделить по `"/ "`, для каждого токена проверить совпадение с именем юнита (частичное — "Marine" матчит "Space Marine" и "Chaos Marine"). "Bastion" проверяется отдельно по `hasBastion`.

### Шаг 3.4: Создать `src/combat/analysis/index.ts`

Реэкспорт.

### Шаг 3.5: Обновить `CombatPage.tsx` — заменить `OpponentCardsHint`

Текущий `OpponentCardsHint` (строки 408–432) просто показывает список оставшихся карт. Заменить на компонент, использующий `analyzeAvailableCards`:

Для каждой карты противника показывать:
- Название и постоянные иконки (как сейчас)
- **Можно ли активировать secondary** (серым если нет подходящего юнита)
- **Worst/best case по offence** — красным
- **Worst/best case по defence** — синим
- **Worst/best case по morale** — жёлтым
- **Спецэффекты** (rout, destroy, retreat) — текстовые пометки

Компонент показывает данные для ОБЕИХ сторон: "что может сыграть противник" и "что могу сыграть я". Это помогает принять решение.

---

## Фаза 4: Интеграция пользовательского ввода для эффектов

### Цель

Когда игрок разыгрывает карту, приложение автоматически применяет простые эффекты и запрашивает ввод для сложных.

### Шаг 4.1: Добавить состояние pending inputs в `combatStore`

```typescript
// В CombatState:
pendingEffects: PendingInput[];
```

При вызове `playCard` в сторе: вместо простого добавления в `playedCards` — прогнать `executeEffects`. Автоматические эффекты применяются сразу, `pendingInputs` сохраняются в стор.

### Шаг 4.2: Создать UI-компоненты для пользовательского ввода

В `CombatPage.tsx` (или отдельные компоненты в `src/components/combat/`):

- `DiceChooser` — выбрать N кубов из пула (для convert/reroll)
- `UnitChooser` — выбрать юнита (для route/destroy/retreat)
- `TokenTypeChooser` — выбрать тип токена (offence или defence)
- `CardChooser` — выбрать карту (для Eldar "Command of the Autarch")

Каждый компонент:
1. Показывает варианты на основе `PendingInput`
2. При выборе — вызывает action в сторе, который применяет оставшуюся часть эффекта
3. После обработки всех pending inputs — состояние обновлено

### Шаг 4.3: Обработка `enemyChoice` в реальном бою

Когда эффект содержит `enemyChoice`, UI показывает обе опции и запрашивает у пользователя, что выбрал противник (в настольной игре противник делает выбор устно). Компонент: "Противник выбирает:" с двумя кнопками.

---

## Порядок выполнения и зависимости

```
Фаза 1 (механики)
  1.1 types ──┐
  1.2 calc ───┤
  1.3 actions ┤
  1.4 index ──┤ (после 1.1–1.3)
  1.5 store ──┤ (после 1.4)
  1.6 UI ─────┘ (после 1.5)

Фаза 2 (эффекты)
  2.1 effect types ──┐ (после 1.4)
  2.2 extend card ───┤ (после 2.1)
  2.3 base cards ────┤ (после 2.2)
  2.4 upgrade cards ─┤ (после 2.2, можно параллельно с 2.3)
  2.5 executor ──────┤ (после 2.1, можно параллельно с 2.3/2.4)
  2.6 index ─────────┘ (после 2.5)

Фаза 3 (анализ)
  3.1 analysis types ──┐ (после 2.1)
  3.2 analyzer ────────┤ (после 2.5, 2.3)
  3.3 requisite check ─┤ (после 1.1)
  3.4 index ───────────┤ (после 3.2, 3.3)
  3.5 UI ──────────────┘ (после 3.4)

Фаза 4 (ввод)
  4.1 pending state ─┐ (после 2.5)
  4.2 UI components ─┤ (после 4.1)
  4.3 enemy choice ──┘ (после 4.2)
```

## Валидация

После каждой фазы проверить:
- `npm run build` / `npx tsc --noEmit` — без ошибок типизации
- Ручная проверка в браузере — UI работает как прежде
- Фаза 1: итоги боя на экране идентичны тем, что были до рефакторинга
- Фаза 2: эффекты в объекте `effects` соответствуют текстовым описаниям `abilityPrimary`/`abilitySecondary`
- Фаза 3: анализ карт показывает корректные диапазоны иконок
- Фаза 4: автоматические эффекты применяются, pending inputs запрашиваются

## Ключевые принципы

1. **Инкрементальность** — каждый шаг оставляет приложение рабочим. Поле `effects` опционально, карты без него работают как прежде.
2. **Чистые функции** — вся логика в `src/combat/` не зависит от React/Zustand. Тестируема в изоляции.
3. **UI — тонкая обёртка** — компоненты занимаются отображением и пользовательскими событиями, не вычислениями.
4. **Текстовые описания сохраняются** — `abilityPrimary`/`abilitySecondary` остаются для отображения, `effects` — для программного исполнения.
5. **Кодстайл** — следовать правилам из CLAUDE.md: стрелочные функции, `type` вместо `interface`, `as const` для enum-подобных типов, JSDoc на экспортах, early return, импорты через index.ts.
