import { VisualStep } from '../types';

// Linear Search Step Generator
export function generateLinearSearchSteps(arr: number[] = [14, 7, 22, 5, 31, 18, 9], target: number = 5): VisualStep[] {
  const steps: VisualStep[] = [];
  steps.push({
    id: 0,
    description: `Инициализируем поиск элемента target = ${target} в массиве длиной ${arr.length}.`,
    codeLine: 1,
    array: [...arr],
    pointers: {},
    currentAction: 'init',
    metrics: { 'Текущий индекс': '-', 'Сравнений': 0, 'Результат': 'В процессе' }
  });

  let comparisons = 0;
  let found = false;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    steps.push({
      id: steps.length,
      description: `Шаг ${i + 1}: Проверяем элемент arr[${i}] = ${arr[i]}. Равен ли он target (${target})?`,
      codeLine: 3,
      array: [...arr],
      pointers: { i },
      highlightIndices: [i],
      currentAction: 'compare',
      metrics: { 'Текущий индекс': i, 'Сравнений': comparisons, 'Значение': arr[i] }
    });

    if (arr[i] === target) {
      steps.push({
        id: steps.length,
        description: `🎉 Элемент ${target} найден на индексе ${i}! Возвращаем индекс ${i}.`,
        codeLine: 4,
        array: [...arr],
        pointers: { i },
        foundIndex: i,
        highlightIndices: [i],
        currentAction: 'found',
        metrics: { 'Индекс': i, 'Сравнений': comparisons, 'Результат': `Найден (индекс ${i})` }
      });
      found = true;
      break;
    }
  }

  if (!found) {
    steps.push({
      id: steps.length,
      description: `Элемент ${target} отсутствует в массиве после ${comparisons} проверок. Возвращаем -1.`,
      codeLine: 5,
      array: [...arr],
      pointers: {},
      currentAction: 'discard',
      metrics: { 'Сравнений': comparisons, 'Результат': 'Не найден (-1)' }
    });
  }

  return steps;
}

// Binary Search Step Generator
export function generateBinarySearchSteps(
  arr: number[] = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  target: number = 23
): VisualStep[] {
  const steps: VisualStep[] = [];
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;

  steps.push({
    id: 0,
    description: `Бинарный поиск требует отсортированного массива. Ищем target = ${target} в диапазоне [0..${right}].`,
    codeLine: 2,
    array: [...arr],
    pointers: { left, right },
    currentAction: 'init',
    metrics: { 'Левая граница': left, 'Правая граница': right, 'Сравнений': 0 }
  });

  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    // Calculate discarded indices outside [left, right]
    const discarded: number[] = [];
    for (let k = 0; k < left; k++) discarded.push(k);
    for (let k = right + 1; k < arr.length; k++) discarded.push(k);

    steps.push({
      id: steps.length,
      description: `Вычисляем середину mid = (${left} + ${right}) // 2 = ${mid}. Значение arr[${mid}] = ${arr[mid]}.`,
      codeLine: 4,
      array: [...arr],
      pointers: { left, right, mid },
      highlightIndices: [mid],
      secondaryHighlightIndices: [left, right],
      discardedIndices: discarded,
      currentAction: 'compare',
      metrics: { 'mid (индекс)': mid, 'arr[mid]': arr[mid], 'Сравнений': comparisons }
    });

    if (arr[mid] === target) {
      steps.push({
        id: steps.length,
        description: `🎯 Успех! arr[${mid}] == ${target}. Нашли элемент за ${comparisons} шага(ов) (O(log n))!`,
        codeLine: 5,
        array: [...arr],
        pointers: { mid },
        foundIndex: mid,
        highlightIndices: [mid],
        discardedIndices: discarded,
        currentAction: 'found',
        metrics: { 'Результат': `Найден на индексе ${mid}`, 'Итого шагов': comparisons }
      });
      found = true;
      break;
    } else if (arr[mid] < target) {
      const oldMid = mid;
      left = mid + 1;
      const newDiscarded = [...discarded];
      for (let k = 0; k <= oldMid; k++) {
        if (!newDiscarded.includes(k)) newDiscarded.push(k);
      }
      steps.push({
        id: steps.length,
        description: `arr[${oldMid}] (${arr[oldMid]}) < target (${target}). Отбрасываем левую половину, сдвигаем left = ${left}.`,
        codeLine: 7,
        array: [...arr],
        pointers: { left, right },
        secondaryHighlightIndices: [left, right],
        discardedIndices: newDiscarded,
        currentAction: 'step',
        metrics: { 'Новый диапазон': `[${left}..${right}]`, 'Отброшено': `${oldMid + 1} эл.` }
      });
    } else {
      const oldMid = mid;
      right = mid - 1;
      const newDiscarded = [...discarded];
      for (let k = oldMid; k < arr.length; k++) {
        if (!newDiscarded.includes(k)) newDiscarded.push(k);
      }
      steps.push({
        id: steps.length,
        description: `arr[${oldMid}] (${arr[oldMid]}) > target (${target}). Отбрасываем правую половину, сдвигаем right = ${right}.`,
        codeLine: 9,
        array: [...arr],
        pointers: { left, right },
        secondaryHighlightIndices: [left, right],
        discardedIndices: newDiscarded,
        currentAction: 'step',
        metrics: { 'Новый диапазон': `[${left}..${right}]`, 'Отброшено': `${arr.length - oldMid} эл.` }
      });
    }
  }

  if (!found) {
    steps.push({
      id: steps.length,
      description: `Границы пересеклись (left > right). Элемент ${target} отсутствует. Возвращаем -1.`,
      codeLine: 10,
      array: [...arr],
      pointers: {},
      discardedIndices: arr.map((_, idx) => idx),
      currentAction: 'discard',
      metrics: { 'Результат': 'Не найден (-1)', 'Сравнений': comparisons }
    });
  }

  return steps;
}

// Bubble Sort Step Generator
export function generateBubbleSortSteps(initialArr: number[] = [29, 10, 14, 37, 13]): VisualStep[] {
  const arr = [...initialArr];
  const steps: VisualStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];

  steps.push({
    id: 0,
    description: `Начало пузырьковой сортировки. Массив из ${n} элементов. Проходим по парам и «всплываем» большие числа вправо.`,
    codeLine: 1,
    array: [...arr],
    pointers: {},
    currentAction: 'init',
    metrics: { 'Итерация': 'Старт', 'Сравнений': 0, 'Обменов': 0 }
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        id: steps.length,
        description: `Сравниваем пару arr[${j}] (${arr[j]}) и arr[${j + 1}] (${arr[j + 1]}).`,
        codeLine: 4,
        array: [...arr],
        pointers: { j, 'j+1': j + 1 },
        highlightIndices: [j, j + 1],
        sortedIndices: [...sorted],
        currentAction: 'compare',
        metrics: { 'Пара': `${arr[j]} vs ${arr[j + 1]}`, 'Сравнений': comparisons, 'Обменов': swaps }
      });

      if (arr[j] > arr[j + 1]) {
        swaps++;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push({
          id: steps.length,
          description: `arr[${j}] > arr[${j + 1}]! Меняем их местами (swap).`,
          codeLine: 5,
          array: [...arr],
          pointers: { j, 'j+1': j + 1 },
          highlightIndices: [j, j + 1],
          sortedIndices: [...sorted],
          currentAction: 'swap',
          metrics: { 'Обмен': `${temp} ⇄ ${arr[j]}`, 'Сравнений': comparisons, 'Обменов': swaps }
        });
      }
    }
    sorted.unshift(n - i - 1);
    steps.push({
      id: steps.length,
      description: `Конец прохода ${i + 1}: элемент arr[${n - i - 1}] (${arr[n - i - 1]}) занял свое финальное место.`,
      codeLine: 3,
      array: [...arr],
      pointers: {},
      sortedIndices: [...sorted],
      currentAction: 'step',
      metrics: { 'Закреплен': arr[n - i - 1], 'Сравнений': comparisons, 'Обменов': swaps }
    });

    if (!swapped) {
      steps.push({
        id: steps.length,
        description: `Оптимизация: за весь проход не было ни одного обмена! Массив уже полностью отсортирован.`,
        codeLine: 7,
        array: [...arr],
        pointers: {},
        sortedIndices: arr.map((_, idx) => idx),
        currentAction: 'found',
        metrics: { 'Статус': 'Досрочное завершение', 'Итого сравнений': comparisons }
      });
      break;
    }
  }

  return steps;
}

// Selection Sort Step Generator
export function generateSelectionSortSteps(initialArr: number[] = [64, 25, 12, 22, 11]): VisualStep[] {
  const arr = [...initialArr];
  const steps: VisualStep[] = [];
  const n = arr.length;
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    id: 0,
    description: `Сортировка выбором: на каждом шаге находим минимальный элемент в неотсортированной части и ставим его в начало.`,
    codeLine: 1,
    array: [...arr],
    pointers: {},
    currentAction: 'init',
    metrics: { 'Сравнений': 0, 'Обменов': 0 }
  });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({
      id: steps.length,
      description: `Шаг ${i + 1}: Ищем минимум начиная с индекса ${i}. Пока считаем min_idx = ${i} (значение ${arr[i]}).`,
      codeLine: 3,
      array: [...arr],
      pointers: { i, min_idx: minIdx },
      highlightIndices: [minIdx],
      sortedIndices: [...sorted],
      currentAction: 'step',
      metrics: { 'Ищем минимум от': `индекса ${i}`, 'Текущий min': arr[minIdx] }
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        id: steps.length,
        description: `Сравниваем arr[${j}] (${arr[j]}) с текущим минимумом arr[${minIdx}] (${arr[minIdx]}).`,
        codeLine: 5,
        array: [...arr],
        pointers: { i, min_idx: minIdx, j },
        highlightIndices: [minIdx],
        secondaryHighlightIndices: [j],
        sortedIndices: [...sorted],
        currentAction: 'compare',
        metrics: { 'Сравнение': `${arr[j]} vs ${arr[minIdx]}`, 'Сравнений': comparisons }
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          id: steps.length,
          description: `Нашли новый минимум! min_idx теперь равен ${j} (${arr[j]}).`,
          codeLine: 6,
          array: [...arr],
          pointers: { i, min_idx: minIdx, j },
          highlightIndices: [minIdx],
          sortedIndices: [...sorted],
          currentAction: 'step',
          metrics: { 'Новый min': arr[minIdx], 'Индекс': minIdx }
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      steps.push({
        id: steps.length,
        description: `Меняем найденный минимум (${arr[i]}) с элементом на позиции ${i} (${temp}).`,
        codeLine: 7,
        array: [...arr],
        pointers: { i, min_idx: minIdx },
        highlightIndices: [i, minIdx],
        sortedIndices: [...sorted],
        currentAction: 'swap',
        metrics: { 'Обмен': `${temp} ⇄ ${arr[i]}`, 'Обменов': swaps }
      });
    }

    sorted.push(i);
    steps.push({
      id: steps.length,
      description: `Позиция ${i} закреплена. Отсортировано элементов: ${sorted.length}/${n}.`,
      codeLine: 7,
      array: [...arr],
      sortedIndices: [...sorted],
      currentAction: 'step',
      metrics: { 'Закреплен': arr[i], 'Отсортировано': `${sorted.length}/${n}` }
    });
  }

  return steps;
}

// Insertion Sort Step Generator
export function generateInsertionSortSteps(initialArr: number[] = [12, 11, 13, 5, 6]): VisualStep[] {
  const arr = [...initialArr];
  const steps: VisualStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0;

  steps.push({
    id: 0,
    description: `Сортировка вставками: как карты в руке. Берем каждый элемент и вставляем на правильное место в левой отсортированной части.`,
    codeLine: 1,
    array: [...arr],
    sortedIndices: [0],
    currentAction: 'init',
    metrics: { 'Сравнений': 0, 'Сдвигов': 0 }
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      id: steps.length,
      description: `Берем ключ key = arr[${i}] (${key}) и ищем для него место среди элементов [0..${i - 1}].`,
      codeLine: 3,
      array: [...arr],
      pointers: { key_idx: i, j },
      highlightIndices: [i],
      sortedIndices: Array.from({ length: i }, (_, idx) => idx),
      currentAction: 'step',
      metrics: { 'Ключ (key)': key, 'Позиция': i }
    });

    while (j >= 0 && arr[j] > key) {
      comparisons++;
      shifts++;
      arr[j + 1] = arr[j];

      steps.push({
        id: steps.length,
        description: `arr[${j}] (${arr[j]}) > key (${key}). Сдвигаем ${arr[j]} вправо на позицию ${j + 1}.`,
        codeLine: 5,
        array: [...arr],
        pointers: { j, 'j+1': j + 1 },
        highlightIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, idx) => idx),
        currentAction: 'swap',
        metrics: { 'Сдвиг': `${arr[j]} -> [${j + 1}]`, 'Сравнений': comparisons, 'Сдвигов': shifts }
      });

      j--;
    }

    if (j >= 0) comparisons++; // loop exit comparison

    arr[j + 1] = key;
    steps.push({
      id: steps.length,
      description: `Вставляем key (${key}) на освободившуюся позицию ${j + 1}.`,
      codeLine: 7,
      array: [...arr],
      pointers: { 'вставка': j + 1 },
      highlightIndices: [j + 1],
      sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
      currentAction: 'step',
      metrics: { 'Вставлен на': j + 1, 'Элемент': key }
    });
  }

  steps.push({
    id: steps.length,
    description: `Сортировка завершена! Все элементы упорядочены.`,
    codeLine: 8,
    array: [...arr],
    sortedIndices: arr.map((_, idx) => idx),
    currentAction: 'found',
    metrics: { 'Итого сравнений': comparisons, 'Итого сдвигов': shifts }
  });

  return steps;
}

// Stack Operations Step Generator
export function generateStackSteps(): VisualStep[] {
  return [
    {
      id: 0,
      description: 'Инициализация пустого стека (LIFO — Last In, First Out). Вершина (TOP) пуста.',
      codeLine: 1,
      stack: [],
      currentAction: 'init',
      metrics: { 'Размер стека': 0, 'Вершина (top)': 'None' }
    },
    {
      id: 1,
      description: 'push("Отправка запроса"): добавляем задачу в стек.',
      codeLine: 3,
      stack: ['Отправка запроса'],
      currentAction: 'push',
      metrics: { 'Размер стека': 1, 'Вершина': '"Отправка запроса"' }
    },
    {
      id: 2,
      description: 'push("Валидация JSON"): вызывается вложенная функция, кладется поверх предыдущей.',
      codeLine: 4,
      stack: ['Отправка запроса', 'Валидация JSON'],
      currentAction: 'push',
      metrics: { 'Размер стека': 2, 'Вершина': '"Валидация JSON"' }
    },
    {
      id: 3,
      description: 'push("Парсинг схемы"): еще один уровень вложенности вызова.',
      codeLine: 5,
      stack: ['Отправка запроса', 'Валидация JSON', 'Парсинг схемы'],
      currentAction: 'push',
      metrics: { 'Размер стека': 3, 'Вершина': '"Парсинг схемы"' }
    },
    {
      id: 4,
      description: 'pop(): функция "Парсинг схемы" завершилась. Извлекаем ее с вершины стека!',
      codeLine: 7,
      stack: ['Отправка запроса', 'Валидация JSON'],
      currentAction: 'pop',
      metrics: { 'Извлечено': '"Парсинг схемы"', 'Новая вершина': '"Валидация JSON"' }
    },
    {
      id: 5,
      description: 'pop(): завершилась "Валидация JSON", возвращаем управление дальше.',
      codeLine: 8,
      stack: ['Отправка запроса'],
      currentAction: 'pop',
      metrics: { 'Извлечено': '"Валидация JSON"', 'Новая вершина': '"Отправка запроса"' }
    }
  ];
}

// Two Pointers Step Generator (Palindrome check)
export function generateTwoPointersSteps(word: string = "дед"): VisualStep[] {
  const chars = word.split('');
  const steps: VisualStep[] = [];
  let left = 0;
  let right = chars.length - 1;

  steps.push({
    id: 0,
    description: `Проверяем строку "${word}" на палиндром. Ставим указатель left в начало (0) и right в конец (${right}).`,
    codeLine: 1,
    array: chars.map((_, idx) => idx + 1), // numeric representation or custom render
    pointers: { left, right },
    currentAction: 'init',
    customData: { chars, left, right },
    metrics: { 'left': left, 'right': right, 'Символы': `${chars[left]} vs ${chars[right]}` }
  });

  let isPal = true;
  while (left < right) {
    steps.push({
      id: steps.length,
      description: `Сравниваем chars[${left}] ('${chars[left]}') и chars[${right}] ('${chars[right]}').`,
      codeLine: 3,
      array: chars.map((_, idx) => idx + 1),
      pointers: { left, right },
      highlightIndices: [left, right],
      currentAction: 'compare',
      customData: { chars, left, right },
      metrics: { 'Сравнение': `'${chars[left]}' == '${chars[right]}'`, 'left': left, 'right': right }
    });

    if (chars[left] !== chars[right]) {
      isPal = false;
      steps.push({
        id: steps.length,
        description: `Символы '${chars[left]}' и '${chars[right]}' не равны! Строка не является палиндромом.`,
        codeLine: 5,
        array: chars.map((_, idx) => idx + 1),
        pointers: { left, right },
        currentAction: 'discard',
        customData: { chars, left, right },
        metrics: { 'Результат': 'Не палиндром (False)' }
      });
      break;
    }

    left++;
    right--;
    if (left < right) {
      steps.push({
        id: steps.length,
        description: `Символы совпали! Сдвигаем left вправо (+1) и right влево (-1).`,
        codeLine: 6,
        array: chars.map((_, idx) => idx + 1),
        pointers: { left, right },
        currentAction: 'step',
        customData: { chars, left, right },
        metrics: { 'left': left, 'right': right }
      });
    }
  }

  if (isPal) {
    steps.push({
      id: steps.length,
      description: `🎉 Все пары символов совпали! Строка "${word}" — идеальный палиндром!`,
      codeLine: 7,
      array: chars.map((_, idx) => idx + 1),
      pointers: {},
      currentAction: 'found',
      customData: { chars, left, right },
      metrics: { 'Результат': 'Палиндром (True)' }
    });
  }

  return steps;
}

// Round Robin Step Generator
export function generateRoundRobinSteps(): VisualStep[] {
  return [
    {
      id: 0,
      description: 'Инициализация балансировщика Round Robin. Доступно 3 сервера: [app-1, app-2, app-3]. Указатель current = 0.',
      codeLine: 1,
      currentAction: 'init',
      customData: { servers: ['app-1 (10.0.0.1)', 'app-2 (10.0.0.2)', 'app-3 (10.0.0.3)'], activeServer: 0, request: 'Req #1 (GET /api/users)' },
      metrics: { 'Сервер': 'app-1', 'Указатель': 0 }
    },
    {
      id: 1,
      description: 'Пришел Запрос #1 -> Направляем на app-1 (индекс 0). Сдвигаем указатель: (0 + 1) % 3 = 1.',
      codeLine: 3,
      currentAction: 'step',
      customData: { servers: ['app-1 (10.0.0.1)', 'app-2 (10.0.0.2)', 'app-3 (10.0.0.3)'], activeServer: 0, request: 'Req #1 -> app-1' },
      metrics: { 'Обработал': 'app-1', 'Следующий': 'app-2 (индекс 1)' }
    },
    {
      id: 2,
      description: 'Пришел Запрос #2 -> Направляем на app-2 (индекс 1). Сдвигаем указатель: (1 + 1) % 3 = 2.',
      codeLine: 3,
      currentAction: 'step',
      customData: { servers: ['app-1 (10.0.0.1)', 'app-2 (10.0.0.2)', 'app-3 (10.0.0.3)'], activeServer: 1, request: 'Req #2 -> app-2' },
      metrics: { 'Обработал': 'app-2', 'Следующий': 'app-3 (индекс 2)' }
    },
    {
      id: 3,
      description: 'Пришел Запрос #3 -> Направляем на app-3 (индекс 2). Сдвигаем: (2 + 1) % 3 = 0 (закольцевали!).',
      codeLine: 3,
      currentAction: 'step',
      customData: { servers: ['app-1 (10.0.0.1)', 'app-2 (10.0.0.2)', 'app-3 (10.0.0.3)'], activeServer: 2, request: 'Req #3 -> app-3' },
      metrics: { 'Обработал': 'app-3', 'Следующий': 'app-1 (индекс 0)' }
    },
    {
      id: 4,
      description: 'Пришел Запрос #4 -> Снова направляем на app-1. Нагрузка распределяется равномерно без перекосов.',
      codeLine: 4,
      currentAction: 'found',
      customData: { servers: ['app-1 (10.0.0.1)', 'app-2 (10.0.0.2)', 'app-3 (10.0.0.3)'], activeServer: 0, request: 'Req #4 -> app-1' },
      metrics: { 'Балансировка': '100% равномерно', 'Сложность': 'O(1)' }
    }
  ];
}

// Exponential Backoff with Jitter
export function generateExponentialBackoffSteps(): VisualStep[] {
  return [
    {
      id: 0,
      description: 'Клиент отправляет POST /checkout. Базовый тайм-аут base_delay = 1 сек, max_retries = 4, factor = 2.',
      codeLine: 1,
      currentAction: 'init',
      customData: { attempt: 0, delay: 0, status: 'Запрос #1' },
      metrics: { 'Попытка': '1', 'Задержка': '0 сек', 'Статус': 'HTTP 503 Service Unavailable' }
    },
    {
      id: 1,
      description: 'Сбой 503! Попытка 1: delay = base * (2^0) + jitter = 1.0 + 0.3 = 1.3 сек. Ждем перед повтором.',
      codeLine: 4,
      currentAction: 'step',
      customData: { attempt: 1, delay: 1.3, status: 'Retry 1: ждем 1.3s' },
      metrics: { 'Попытка': '2', 'Задержка': '1.3 сек', 'Формула': '1 * 2^0 + rnd()' }
    },
    {
      id: 2,
      description: 'Снова 503. Попытка 2: delay = base * (2^1) + jitter = 2.0 + 0.5 = 2.5 сек. Увеличиваем паузу, давая серверу отдышаться.',
      codeLine: 5,
      currentAction: 'step',
      customData: { attempt: 2, delay: 2.5, status: 'Retry 2: ждем 2.5s' },
      metrics: { 'Попытка': '3', 'Задержка': '2.5 сек', 'Формула': '1 * 2^1 + rnd()' }
    },
    {
      id: 3,
      description: 'Попытка 3: delay = base * (2^2) + jitter = 4.0 + 0.8 = 4.8 сек.',
      codeLine: 5,
      currentAction: 'step',
      customData: { attempt: 3, delay: 4.8, status: 'Retry 3: ждем 4.8s' },
      metrics: { 'Попытка': '4', 'Задержка': '4.8 сек', 'Формула': '1 * 2^2 + rnd()' }
    },
    {
      id: 4,
      description: '🎉 Ответ получен: HTTP 200 OK! База данных восстановилась. Jitter предотвратил шторм одновременных повторов (Thundering Herd).',
      codeLine: 8,
      currentAction: 'found',
      customData: { attempt: 3, delay: 4.8, status: 'HTTP 200 OK!' },
      metrics: { 'Результат': 'Успешно (200 OK)', 'Предотвращен': 'Retry Storm' }
    }
  ];
}
