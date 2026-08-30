import { Chapter } from '../types';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateStackSteps,
  generateTwoPointersSteps,
  generateRoundRobinSteps,
  generateExponentialBackoffSteps
} from '../utils/stepGenerators';

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    number: 1,
    icon: '🏘',
    title: 'Основы логики и трассировка',
    subtitle: 'Как компьютер выполняет команды шаг за шагом',
    description: 'Условия, циклы, переменные и пошаговая трассировка (dry run). Фундамент для выявления багов и написания чистого кода.',
    targetAudience: 'Для всех начинающих специалистов (Dev, QA, DevOps)',
    color: 'emerald',
    lessons: [
      {
        id: 'l-1-1',
        chapterId: 'ch-1',
        title: 'Условия и ветвления (if/elif/else)',
        shortDesc: 'Принятие решений в коде и проверка граничных условий',
        duration: '4 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Ветвление позволяет программе выбирать путь выполнения в зависимости от истинности булевого выражения (True / False).',
          analogy: 'Светофор на перекрестке: если горит зеленый — едем, если желтый — готовимся, иначе — стоим.',
          keyPoints: [
            'Порядок условий критичен: проверки выполняются сверху вниз до первого совпадения.',
            'Вложенные условия усложняют чтение — используйте guard clauses (ранний выход).',
            'Ошибки часто возникают при путанице между "==" (сравнение) и "=" (присваивание).'
          ],
          whenToUse: [
            'Валидация HTTP статус-кодов в автотестах',
            'Проверка наличия переменных окружения в пайплайне',
            'Маршрутизация бизнес-логики'
          ]
        },
        pythonCode: `# Проверка статуса сервера и HTTP кода ответа
def check_health(status_code: int, response_time_ms: int) -> str:
    if status_code == 200 and response_time_ms < 200:
        return "GREEN: Сервис в норме"
    elif status_code == 200 and response_time_ms >= 200:
        return "YELLOW: Деградация производительности"
    elif 500 <= status_code < 600:
        return "RED: Внутренняя ошибка сервера"
    else:
        return f"CRITICAL: Неизвестный статус {status_code}"

# Пример вызова
result = check_health(status_code=502, response_time_ms=120)
print(result)  # "RED: Внутренняя ошибка сервера"`,
        codeExplanation: 'Код пошагово проверяет статус ответа. Условия 500 <= status_code < 600 используют удобный синтаксис цепочки сравнений в Python.',
        visualizerType: 'array-search',
        initialData: [200, 201, 404, 500, 502],
        generateSteps: () => [
          {
            id: 0,
            description: 'Получен status_code = 502, response_time_ms = 120.',
            codeLine: 2,
            currentAction: 'init',
            metrics: { 'status_code': 502, 'response_time_ms': 120, 'Ветка': 'Старт' }
          },
          {
            id: 1,
            description: 'Проверка 1: status_code == 200 and response_time_ms < 200 -> False (502 != 200).',
            codeLine: 3,
            currentAction: 'compare',
            metrics: { 'Проверка 1': 'False', 'Переход': 'к elif' }
          },
          {
            id: 2,
            description: 'Проверка 2: status_code == 200 and response_time_ms >= 200 -> False.',
            codeLine: 5,
            currentAction: 'compare',
            metrics: { 'Проверка 2': 'False', 'Переход': 'к следующему elif' }
          },
          {
            id: 3,
            description: 'Проверка 3: 500 <= 502 < 600 -> True! Условие выполнено.',
            codeLine: 7,
            currentAction: 'found',
            metrics: { 'Ветка': 'elif 500 <= code < 600', 'Результат': '"RED: Внутренняя ошибка сервера"' }
          }
        ],
        roleTips: [
          {
            role: 'qa',
            title: 'Классы эквивалентности и граничные значения',
            content: 'Тестируйте граничные значения: 199ms, 200ms, 499, 500, 599, 600, а также отрицательные числа и None!'
          },
          {
            role: 'dev',
            title: 'Guard Clauses (Ранний возврат)',
            content: 'Избегайте «лесенки» вложенных if. Проверяйте крайние ошибочные случаи первыми и делайте return.'
          },
          {
            role: 'devops',
            title: 'Healthcheck маршрутизация',
            content: 'В Kubernetes liveness/readiness probes опираются именно на диапазон кодов 200-399.'
          }
        ],
        quickCheck: {
          question: 'Что вернет check_health(200, 200)?',
          options: [
            'GREEN: Сервис в норме',
            'YELLOW: Деградация производительности',
            'RED: Внутренняя ошибка сервера',
            'CRITICAL: Неизвестный статус'
          ],
          correctIndex: 1,
          explanation: 'При response_time_ms = 200 первое условие (< 200) ложно, а второе (>= 200) истинно.'
        }
      },
      {
        id: 'l-1-2',
        chapterId: 'ch-1',
        title: 'Циклы и ошибка Off-by-one',
        shortDesc: 'Итерации for/while и классические ошибки смещения на 1',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Циклы повторяют блок кода заданное число раз или пока истинно условие. В Python range(start, stop) не включает stop!',
          analogy: 'Забор из 5 столбов имеет ровно 4 пролета между ними. Ошибка "заборного столба" — основа всех off-by-one багов.',
          keyPoints: [
            'В Python индексы начинаются с 0, а последний элемент имеет индекс len(arr) - 1.',
            'range(5) генерирует [0, 1, 2, 3, 4] (ровно 5 чисел, но 5 не входит).',
            'В цикле while всегда проверяйте условие завершения, чтобы не получить бесконечный цикл (100% CPU).'
          ],
          whenToUse: [
            'Парсинг строк в логах',
            'Итерация по тестовым наборам',
            'Повторные попытки (retry loop) при сетевых сбоях'
          ]
        },
        pythonCode: `# Подсчет количества успешных HTTP 200 запросов
def count_successful_requests(status_codes: list[int]) -> int:
    success_count = 0
    # Внимание: range(len) идет от 0 до len - 1
    for i in range(len(status_codes)):
        code = status_codes[i]
        if code == 200:
            success_count += 1
    return success_count

# Пример
logs = [200, 404, 200, 500, 200]
print(count_successful_requests(logs))  # 3`,
        codeExplanation: 'Цикл for проходит по каждому элементу массива. Ошибка новичков — написать range(1, len+1), что приведет к IndexError.',
        visualizerType: 'array-search',
        initialData: [200, 404, 200, 500, 200],
        generateSteps: () => [
          {
            id: 0,
            description: 'Инициализация счетчика success_count = 0, длина массива 5 (индексы 0..4).',
            codeLine: 2,
            array: [200, 404, 200, 500, 200],
            currentAction: 'init',
            metrics: { 'i': '-', 'success_count': 0 }
          },
          {
            id: 1,
            description: 'Индекс 0: code = 200. Совпадение! success_count = 1.',
            codeLine: 6,
            array: [200, 404, 200, 500, 200],
            pointers: { i: 0 },
            highlightIndices: [0],
            currentAction: 'found',
            metrics: { 'i': 0, 'code': 200, 'success_count': 1 }
          },
          {
            id: 2,
            description: 'Индекс 1: code = 404. Не 200, пропускаем.',
            codeLine: 5,
            array: [200, 404, 200, 500, 200],
            pointers: { i: 1 },
            highlightIndices: [1],
            currentAction: 'compare',
            metrics: { 'i': 1, 'code': 404, 'success_count': 1 }
          },
          {
            id: 3,
            description: 'Индекс 2: code = 200. Совпадение! success_count = 2.',
            codeLine: 6,
            array: [200, 404, 200, 500, 200],
            pointers: { i: 2 },
            highlightIndices: [2],
            currentAction: 'found',
            metrics: { 'i': 2, 'code': 200, 'success_count': 2 }
          },
          {
            id: 4,
            description: 'Индекс 3: code = 500. Пропускаем.',
            codeLine: 5,
            array: [200, 404, 200, 500, 200],
            pointers: { i: 3 },
            highlightIndices: [3],
            currentAction: 'compare',
            metrics: { 'i': 3, 'code': 500, 'success_count': 2 }
          },
          {
            id: 5,
            description: 'Индекс 4: code = 200. Совпадение! success_count = 3.',
            codeLine: 6,
            array: [200, 404, 200, 500, 200],
            pointers: { i: 4 },
            highlightIndices: [4],
            currentAction: 'found',
            metrics: { 'i': 4, 'code': 200, 'success_count': 3 }
          },
          {
            id: 6,
            description: 'Цикл завершен, обработаны все 5 элементов. Возвращаем 3.',
            codeLine: 7,
            array: [200, 404, 200, 500, 200],
            currentAction: 'step',
            metrics: { 'Итого': 3 }
          }
        ],
        roleTips: [
          {
            role: 'qa',
            title: 'Главный источник багов (Off-by-one)',
            content: 'Всегда проверяйте пустой массив [], массив из 1 элемента, а также поведение на первом [0] и последнем [-1] элементах.'
          },
          {
            role: 'dev',
            title: 'Pythonic Style',
            content: 'В Python вместо range(len(arr)) лучше писать for code in status_codes, или sum(1 for c in logs if c == 200).'
          },
          {
            role: 'devops',
            title: 'Защита от зависаний',
            content: 'В bash и python скриптах автоматизации всегда ставьте таймауты и ограничение итераций (max_retries).'
          }
        ],
        quickCheck: {
          question: 'Сколько раз выполнится тело цикла for i in range(3, 7)?',
          options: ['3 раза', '4 раза (3, 4, 5, 6)', '5 раз (3, 4, 5, 6, 7)', '7 раз'],
          correctIndex: 1,
          explanation: 'Выполняется для i = 3, 4, 5, 6 (ровно 7 - 3 = 4 итерации).'
        }
      }
    ]
  },
  {
    id: 'ch-2',
    number: 2,
    icon: '⏱',
    title: 'Сложность алгоритмов (Big-O)',
    subtitle: 'Как измерить скорость и память без секундомера',
    description: 'Асимптотический анализ сложности. Почему O(1) мгновенен, O(n) масштабируем, а вложенный цикл O(n²) роняет прод.',
    targetAudience: 'Разработчики, тестировщики производительности, DevOps инженеры',
    color: 'indigo',
    lessons: [
      {
        id: 'l-2-1',
        chapterId: 'ch-2',
        title: 'Big-O на пальцах: O(1), O(n), O(n²)',
        shortDesc: 'Временная сложность и почему секунды не равны эффективности',
        duration: '6 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'Теория',
        spaceComplexity: 'Теория',
        theory: {
          intro: 'Big-O описывает, как растет время работы алгоритма при увеличении объема входных данных (N) в худшем случае.',
          analogy: 'O(1) — взять книгу с полки по номеру. O(n) — пролистать всю полку книга за книгой. O(n²) — сравнить каждую книгу с каждой.',
          keyPoints: [
            'O(1) Константное: время не зависит от N (доступ по индексу arr[i], поиск в dict).',
            'O(log n) Логарифмическое: на каждом шаге объем работы делится пополам (Бинарный поиск).',
            'O(n) Линейное: время растет пропорционально N (один цикл for).',
            'O(n²) Квадратичное: вложенный цикл for i in range(n): for j in range(n).'
          ],
          whenToUse: [
            'Оценка нагрузки на базу данных при SQL запросах',
            'Прогнозирование времени выполнения нагрузочных тестов',
            'Выбор структуры данных под требования SLA'
          ]
        },
        pythonCode: `# Примеры различных классов сложности:

# 1. O(1) - Мгновенный доступ по ключу
def get_user_role(users_dict: dict, user_id: str) -> str:
    return users_dict.get(user_id, "guest")

# 2. O(n) - Линейный проход по списку
def find_slow_request(durations: list[int], threshold: int) -> bool:
    for d in durations:
        if d > threshold:
            return True
    return False

# 3. O(n^2) - Опасный вложенный цикл (поиск дубликатов в логах)
def has_duplicate_logs_slow(logs: list[str]) -> bool:
    n = len(logs)
    for i in range(n):
        for j in range(i + 1, n):
            if logs[i] == logs[j]:
                return True
    return False`,
        codeExplanation: 'Обратите внимание: при n=1000 строк логов O(n) сделает 1000 операций, а O(n²) сделает ~500 000 сравнений!',
        visualizerType: 'array-search',
        initialData: [1, 10, 100, 1000],
        generateSteps: () => [
          {
            id: 0,
            description: 'Сравнение роста операций при N = 1 000 элементов:',
            codeLine: 1,
            currentAction: 'init',
            metrics: { 'N': 1000, 'O(1)': '1 операция', 'O(log n)': '10 операций', 'O(n)': '1 000 оп.', 'O(n²)': '1 000 000 оп.!' }
          },
          {
            id: 1,
            description: 'При N = 100 000: O(n) займет ~0.01 сек, а O(n²) займет ~10 000 000 000 операций (> 100 секунд зависания!).',
            codeLine: 15,
            currentAction: 'compare',
            metrics: { 'N': 100000, 'O(n)': '0.01 сек', 'O(n²)': '1.5+ минуты' }
          },
          {
            id: 2,
            description: 'Вывод: никогда не используйте O(n²) на больших массивах, заменяйте на Set/Dict (O(n)).',
            codeLine: 16,
            currentAction: 'found',
            metrics: { 'Рекомендация': 'Использовать Set / Hash Map' }
          }
        ],
        roleTips: [
          {
            role: 'devops',
            title: 'CPU Throttling и O(n²)',
            content: 'Вложенные циклы при обработке метрик или логов вызывают скачок CPU до 100% и триггерят автоскейлинг подов.'
          },
          {
            role: 'qa',
            title: 'Тестирование производительности (Non-functional)',
            content: 'Если автотест работает быстро на 10 записях, проверьте на 10 000 — квадратичный алгоритм сразу проявит лавинообразное замедление.'
          },
          {
            role: 'dev',
            title: 'Преждевременная оптимизация',
            content: 'Для массивов из 5 элементов O(n²) работает быстрее, чем создание тяжелых структур. Оптимизируйте там, где N растет.'
          }
        ],
        quickCheck: {
          question: 'Если массив увеличился в 10 раз, во сколько раз увеличится время работы алгоритма O(n²)?',
          options: ['В 10 раз', 'В 20 раз', 'В 100 раз (10²)', 'Не изменится'],
          correctIndex: 2,
          explanation: 'Для O(n²) при увеличении N в k раз количество операций растет как k²: 10² = 100 раз.'
        }
      }
    ]
  },
  {
    id: 'ch-3',
    number: 3,
    icon: '🌲',
    title: 'Алгоритмы поиска',
    subtitle: 'Линейный, поиск min/max и Бинарный поиск O(log n)',
    description: 'Как быстро находить элементы в массивах. Сравнение линейного и логарифмического поиска.',
    targetAudience: 'Разработчики, QA инженеры',
    color: 'amber',
    lessons: [
      {
        id: 'l-3-1',
        chapterId: 'ch-3',
        title: 'Линейный поиск и поиск Min/Max',
        shortDesc: 'Последовательный перебор элементов за O(n)',
        duration: '4 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Линейный поиск проверяет каждый элемент массива по очереди от начала до конца, пока не найдет совпадение.',
          analogy: 'Поиск ключей в связке: примеряем каждый ключ к замку по очереди.',
          keyPoints: [
            'Работает на любых массивах (даже неотсортированных).',
            'В худшем случае (элемент в самом конце или отсутствует) делает ровно N проверок.',
            'При поиске min/max инициализируйте начальное значение первым элементом arr[0], а не нулем (0)!'
          ],
          whenToUse: [
            'Поиск в коротких несортированных списках',
            'Поиск первого падения в истории тестов'
          ]
        },
        pythonCode: `# Поиск минимального значения (latency) в массиве
def find_min_latency(latencies: list[int]) -> int:
    if not latencies:
        raise ValueError("Список пуст!")
    
    min_val = latencies[0]  # Важно: инициализация первым элементом!
    for val in latencies[1:]:
        if val < min_val:
            min_val = val
    return min_val

print(find_min_latency([45, 12, 89, 5, 23]))  # 5`,
        codeExplanation: 'Инициализация min_val = latencies[0] защищает от бага, когда все числа в массиве отрицательные или больше 0.',
        visualizerType: 'array-search',
        initialData: [14, 7, 22, 5, 31, 18, 9],
        generateSteps: (data) => generateLinearSearchSteps(data || [14, 7, 22, 5, 31, 18, 9], 5),
        roleTips: [
          {
            role: 'qa',
            title: 'Баг инициализации min = 0',
            content: 'Если разработчик напишет min_val = 0, то для массива положительных чисел [10, 20, 30] функция ошибочно вернет 0!'
          },
          {
            role: 'dev',
            title: 'Встроенные функции Python',
            content: 'В Python функции min(), max() и оператор in уже реализованы на C и работают в разы быстрее ручного цикла.'
          },
          {
            role: 'devops',
            title: 'Анализ задержек (Latency P99)',
            content: 'Линейный поиск подходит для разовых метрик, но для стриминга используйте бакетирование (Prometheus Histograms).'
          }
        ],
        quickCheck: {
          question: 'Какова сложность линейного поиска в худшем случае для массива из N элементов?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctIndex: 2,
          explanation: 'В худшем случае нужно проверить все N элементов.'
        }
      },
      {
        id: 'l-3-2',
        chapterId: 'ch-3',
        title: 'Бинарный поиск (Binary Search)',
        shortDesc: 'Поиск за O(log n) делением отрезка пополам',
        duration: '7 мин',
        difficulty: 'intermediate',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Бинарный поиск на каждом шаге сравнивает искомое значение со средним элементом и отбрасывает ровно половину массива. Работает ТОЛЬКО на отсортированных данных!',
          analogy: 'Игра «Угадай число от 1 до 100»: называем 50, узнаем «больше/меньше», затем 75 и т.д. Число от 1 до 1 000 000 угадывается максимум за 20 попыток!',
          keyPoints: [
            'Обязательное условие: массив должен быть строго отсортирован.',
            'Сложность O(log₂ n): для 1 миллиарда элементов требуется всего ~30 сравнений!',
            'Вычисление середины: mid = (left + right) // 2.'
          ],
          whenToUse: [
            'Поиск в индексах баз данных (B-Tree индексы)',
            'Команда git bisect для поиска коммита, сломавшего билд',
            'Быстрый автокомплит в отсортированных словарях'
          ]
        },
        pythonCode: `# Классический бинарный поиск на Python
def binary_search(arr: list[int], target: int) -> int:
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Элемент найден, возвращаем индекс
        elif arr[mid] < target:
            left = mid + 1   # Искомое правее, отбрасываем левую часть
        else:
            right = mid - 1  # Искомое левее, отбрасываем правую часть
            
    return -1  # Элемент не найден

# Массив ОБЯЗАН быть отсортирован
sorted_data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(sorted_data, 23))  # индекс 5`,
        codeExplanation: 'На каждой итерации диапазон поиска [left, right] сокращается в 2 раза. Цикл гарантированно остановится при left > right.',
        visualizerType: 'array-search',
        initialData: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
        generateSteps: (data) => generateBinarySearchSteps(data || [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23),
        roleTips: [
          {
            role: 'devops',
            title: 'git bisect — бинарный поиск бага в CI/CD',
            content: 'Утилита git bisect использует бинарный поиск по истории коммитов, чтобы найти коммит с регрессией за log(N) шагов!'
          },
          {
            role: 'qa',
            title: 'Тест-кейсы для Binary Search',
            content: 'Проверяйте: target — первый элемент, target — последний элемент, target отсутствует (меньше минимума / больше максимума), массив из 1 элемента.'
          },
          {
            role: 'dev',
            title: 'Модуль bisect в Python',
            content: 'В стандартной библиотеке Python есть готовые функции bisect_left и bisect_right.'
          }
        ],
        quickCheck: {
          question: 'Сколько максимум проверок потребуется бинарному поиску для массива из 1024 элементов?',
          options: ['1024 проверки', '512 проверок', '10 проверок (2¹⁰ = 1024)', '1 проверка'],
          correctIndex: 2,
          explanation: 'log₂(1024) = 10. Бинарный поиск найдет любой элемент максимум за 10 шагов!'
        }
      }
    ]
  },
  {
    id: 'ch-4',
    number: 4,
    icon: '⚙️',
    title: 'Алгоритмы сортировки',
    subtitle: 'Bubble, Selection, Insertion и почему QuickSort быстрее',
    description: 'Классические квадратичные сортировки для понимания механики обменов и сдвигов элементов.',
    targetAudience: 'Разработчики, QA инженеры',
    color: 'violet',
    lessons: [
      {
        id: 'l-4-1',
        chapterId: 'ch-4',
        title: 'Пузырьковая сортировка (Bubble Sort)',
        shortDesc: 'Попарное сравнение и «всплытие» наибольших элементов',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Пузырьковая сортировка проходит по массиву, сравнивая соседние элементы и меняя их местами, если левый больше правого.',
          analogy: 'Пузырьки воздуха в воде: самый крупный пузырь быстрее всех поднимается на поверхность в конец массива.',
          keyPoints: [
            'После каждого прохода самый большой элемент гарантированно встает на свое место в конце.',
            'Флаг swapped позволяет завершить алгоритм за O(n), если массив уже был отсортирован.',
            'На практике не используется из-за медленной скорости O(n²), но идеален для понимания алгоритмики.'
          ],
          whenToUse: [
            'Обучение базовым концепциям алгоритмов',
            'Почти отсортированные короткие списки'
          ]
        },
        pythonCode: `# Пузырьковая сортировка с оптимизацией флагом
def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        # Последние i элементов уже на своих местах
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Меняем местами в Python (swap)
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # Если не было ни одного обмена, массив уже отсортирован!
        if not swapped:
            break
    return arr

print(bubble_sort([29, 10, 14, 37, 13]))  # [10, 13, 14, 29, 37]`,
        codeExplanation: 'Конструкция arr[j], arr[j+1] = arr[j+1], arr[j] — это питоничный способ обмена переменных без временной переменной.',
        visualizerType: 'array-sort',
        initialData: [29, 10, 14, 37, 13],
        generateSteps: (data) => generateBubbleSortSteps(data || [29, 10, 14, 37, 13]),
        roleTips: [
          {
            role: 'qa',
            title: 'Стабильность сортировки (Stability)',
            content: 'Bubble Sort — стабильная сортировка: элементы с равными ключами сохраняют свой исходный относительный порядок.'
          },
          {
            role: 'dev',
            title: 'Timsort в Python',
            content: 'Встроенный в Python метод arr.sort() использует Timsort — гибрид Merge Sort и Insertion Sort со сложностью O(n log n).'
          },
          {
            role: 'devops',
            title: 'Сортировка логов',
            content: 'В системах сбора логов (Elasticsearch, Loki) сортировка по timestamp выполняется на уровне LSM-деревьев, а не в памяти.'
          }
        ],
        quickCheck: {
          question: 'Зачем в алгоритме Bubble Sort нужен флаг swapped?',
          options: [
            'Чтобы развернуть массив в обратную сторону',
            'Для досрочного завершения, если массив уже отсортирован',
            'Чтобы уменьшить использование памяти',
            'Для защиты от переполнения стека'
          ],
          correctIndex: 1,
          explanation: 'Если за проход не было обменов, значит массив упорядочен и можно не выполнять оставшиеся итерации.'
        }
      },
      {
        id: 'l-4-2',
        chapterId: 'ch-4',
        title: 'Сортировка выбором (Selection Sort)',
        shortDesc: 'Поиск минимума и перемещение его в начало',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Сортировка выбором делит массив на отсортированную и неотсортированную части. На каждом шаге ищет наименьший элемент в правой части и меняет его с первым элементом неотсортированной части.',
          analogy: 'Выбор лучшего кандидата: просматриваем всех кандидатов в очереди, находим самого подходящего и ставим первым.',
          keyPoints: [
            'Делает минимальное количество обменов (ровно O(n) swaps).',
            'Всегда делает ~n²/2 сравнений, даже если массив уже отсортирован.',
            'Не является стабильной сортировкой в базовой реализации.'
          ],
          whenToUse: [
            'Когда запись в память стоит очень дорого (например, на Flash-памяти EEPROM)'
          ]
        },
        pythonCode: `# Сортировка выбором
def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Ставим найденный минимум на позицию i
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

print(selection_sort([64, 25, 12, 22, 11]))  # [11, 12, 22, 25, 64]`,
        codeExplanation: 'Алгоритм фиксирует элементы слева направо: сначала 0-й, потом 1-й, 2-й и т.д.',
        visualizerType: 'array-sort',
        initialData: [64, 25, 12, 22, 11],
        generateSteps: (data) => generateSelectionSortSteps(data || [64, 25, 12, 22, 11]),
        roleTips: [
          {
            role: 'qa',
            title: 'Тест на сохранение порядка дубликатов',
            content: 'Протестируйте массив [2a, 1, 2b] — после Selection Sort элемент 2a может оказаться после 2b (нестабильность).'
          },
          {
            role: 'dev',
            title: 'Преимущество малого числа перестановок',
            content: 'Если перемещение объектов в памяти тяжелое (тяжелые структуры данных), Selection Sort делает не более N перестановок.'
          },
          {
            role: 'devops',
            title: 'Память O(1)',
            content: 'Все базовые сортировки in-place не требуют выделения дополнительной RAM.'
          }
        ],
        quickCheck: {
          question: 'Сколько обменов (swap) максимум выполнит Selection Sort для массива длины N?',
          options: ['O(1)', 'O(n)', 'O(n²)', 'O(n log n)'],
          correctIndex: 1,
          explanation: 'На каждом из N шагов происходит максимум один обмен, итого не более N обменов.'
        }
      },
      {
        id: 'l-4-3',
        chapterId: 'ch-4',
        title: 'Сортировка вставками (Insertion Sort)',
        shortDesc: 'Построение отсортированной части по одному элементу',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Сортировка вставками берет очередной элемент и вставляет его на правильное место среди уже отсортированных элементов слева, сдвигая большие элементы вправо.',
          analogy: 'Раскладывание карт в руке: берем новую карту из колоды и вставляем ее в нужное место веера.',
          keyPoints: [
            'Очень эффективна на почти отсортированных данных (работает за O(n)).',
            'Онлайн-алгоритм: может сортировать массив по мере поступления новых данных в поток.',
            'Лежит в основе Timsort для коротких подмассивов (< 64 элементов).'
          ],
          whenToUse: [
            'Маленькие массивы (< 30-50 элементов)',
            'Потоковые данные, поступающие в реальном времени'
          ]
        },
        pythonCode: `# Сортировка вставками
def insertion_sort(arr: list[int]) -> list[int]:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Сдвигаем элементы arr[0..i-1], которые больше key
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

print(insertion_sort([12, 11, 13, 5, 6]))  # [5, 6, 11, 12, 13]`,
        codeExplanation: 'Внутренний цикл while сдвигает элементы вправо, освобождая ячейку arr[j+1] для вставки ключа key.',
        visualizerType: 'array-sort',
        initialData: [12, 11, 13, 5, 6],
        generateSteps: (data) => generateInsertionSortSteps(data || [12, 11, 13, 5, 6]),
        roleTips: [
          {
            role: 'dev',
            title: 'Почему V8 и Python используют Insertion Sort',
            content: 'На маленьких объемах данных простота Insertion Sort выигрывает у QuickSort за счет отсутствия оверхеда на рекурсию.'
          },
          {
            role: 'qa',
            title: 'Лучший случай: O(n)',
            content: 'Если передать уже отсортированный массив [1, 2, 3, 4, 5], Insertion Sort выполнит ровно N-1 проверок и 0 сдвигов!'
          },
          {
            role: 'devops',
            title: 'Адаптивность',
            content: 'Идеален для досортировки логов, приходящих с небольшим нарушением порядка из-за сетевых задержек.'
          }
        ],
        quickCheck: {
          question: 'Каково время работы Insertion Sort на уже отсортированном массиве?',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
          correctIndex: 2,
          explanation: 'На отсортированном массиве внутренний цикл while не выполняется ни разу, поэтому время линейное O(n).'
        }
      }
    ]
  },
  {
    id: 'ch-5',
    number: 5,
    icon: '📦',
    title: 'Фундаментальные структуры данных',
    subtitle: 'Стек (LIFO), Очередь (FIFO), Списки и Хэш-таблицы',
    description: 'Как устроены хранилища данных в памяти: доступ по индексу, буферы сообщений и быстрый поиск по ключу O(1).',
    targetAudience: 'Разработчики, QA инженеры, DevOps',
    color: 'blue',
    lessons: [
      {
        id: 'l-5-1',
        chapterId: 'ch-5',
        title: 'Стек (Stack — LIFO) и стек вызовов',
        shortDesc: 'Принцип «Последним пришел — первым ушел»',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(1) push/pop',
        spaceComplexity: 'O(n)',
        theory: {
          intro: 'Стек — структура данных, работающая по принципу LIFO (Last In, First Out). Добавление (push) и удаление (pop) происходят только с одного конца (вершины).',
          analogy: 'Стопка тарелок: чистую тарелку кладут наверх стопки, и берут для еды тоже самую верхнюю.',
          keyPoints: [
            'push() — положить на вершину за O(1).',
            'pop() — снять с вершины за O(1).',
            'В Python обычный list отлично работает как стек: list.append() и list.pop().'
          ],
          whenToUse: [
            'Кнопка "Назад" в браузере и отмена действий (Ctrl+Z)',
            'Call Stack (стек вызовов функций в рантайме)',
            'Парсинг вложенных структур и скобок в JSON/YAML'
          ]
        },
        pythonCode: `# Реализация стека на Python и проверка парных скобок
def is_valid_brackets(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in pairs.values():  # Открывающая скобка
            stack.append(char)      # push в стек
        elif char in pairs.keys():    # Закрывающая скобка
            if not stack or stack.pop() != pairs[char]:
                return False
                
    return len(stack) == 0  # Стек должен остаться пустым

print(is_valid_brackets("{[()]}"))  # True
print(is_valid_brackets("{[(])}"))  # False`,
        codeExplanation: 'Алгоритм использует стек для запоминания открытых скобок: последняя открытая должна закрываться первой.',
        visualizerType: 'stack',
        generateSteps: () => generateStackSteps(),
        roleTips: [
          {
            role: 'qa',
            title: 'Анализ Stack Trace при падении автотестов',
            content: 'Stack Trace в отчете тестирования — это снимок стека вызовов от точки сбоя (вершина) до точки входа.'
          },
          {
            role: 'devops',
            title: 'Stack Overflow ошибки',
            content: 'Переполнение стека случается при бесконечной рекурсии, когда память, выделенная под стек потока, заканчивается.'
          },
          {
            role: 'dev',
            title: 'Защита от pop из пустого стека',
            content: 'Перед вызовом stack.pop() всегда проверяйте if stack:, иначе Python выбросит IndexError: pop from empty list.'
          }
        ],
        quickCheck: {
          question: 'Какой элемент вернет вызов stack.pop() после операций: push(10), push(20), push(30)?',
          options: ['10', '20', '30', 'None'],
          correctIndex: 2,
          explanation: 'Стек LIFO возвращает последний добавленный элемент — 30.'
        }
      },
      {
        id: 'l-5-2',
        chapterId: 'ch-5',
        title: 'Очередь (Queue — FIFO) и Message Queues',
        shortDesc: 'Принцип «Первым пришел — первым ушел»',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(1) enqueue/dequeue',
        spaceComplexity: 'O(n)',
        theory: {
          intro: 'Очередь работает по принципу FIFO (First In, First Out). Элементы добавляются в конец (enqueue), а извлекаются из начала (dequeue).',
          analogy: 'Очередь в кассу магазина: кто первый встал в очередь, тот первым обслуживается и уходит.',
          keyPoints: [
            'В Python для очередей используйте collections.deque (O(1) для append и popleft).',
            'Обычный list.pop(0) работает медленно за O(n), так как требует сдвига всех элементов влево!',
            'Лежит в основе очередей сообщений (RabbitMQ, Kafka, AWS SQS, Celery).'
          ],
          whenToUse: [
            'Буферизация входящих сетевых пакетов',
            'Очередь задач CI/CD пайплайна (GitLab CI, GitHub Actions)',
            'Алгоритм BFS (поиск в ширину)'
          ]
        },
        pythonCode: `from collections import deque

# Симуляция очереди обработки задач в CI/CD
class TaskQueue:
    def __init__(self):
        self.queue = deque()

    def add_task(self, task_name: str):
        print(f"[+] Задача добавлена: {task_name}")
        self.queue.append(task_name)  # O(1)

    def process_next(self) -> str | None:
        if not self.queue:
            return None
        task = self.queue.popleft()   # O(1) извлечение из начала
        print(f"[*] Выполняется: {task}")
        return task

ci_queue = TaskQueue()
ci_queue.add_task("Unit Tests")
ci_queue.add_task("Build Docker Image")
ci_queue.process_next()  # Выполнит "Unit Tests"`,
        codeExplanation: 'Использование collections.deque гарантирует O(1) добавление и удаление с обоих концов очереди.',
        visualizerType: 'queue',
        generateSteps: () => [
          {
            id: 0,
            description: 'Инициализация пустой очереди deque(). Голова (Head) и Хвост (Tail) пусты.',
            codeLine: 5,
            queue: [],
            currentAction: 'init',
            metrics: { 'Длина': 0, 'Head': 'None' }
          },
          {
            id: 1,
            description: 'add_task("Unit Tests") -> элемент встает в очередь (Head).',
            codeLine: 8,
            queue: ['Unit Tests'],
            currentAction: 'push',
            metrics: { 'Длина': 1, 'Head': 'Unit Tests' }
          },
          {
            id: 2,
            description: 'add_task("Build Docker") -> элемент встает в конец очереди.',
            codeLine: 8,
            queue: ['Unit Tests', 'Build Docker'],
            currentAction: 'push',
            metrics: { 'Длина': 2, 'Tail': 'Build Docker' }
          },
          {
            id: 3,
            description: 'add_task("Deploy Staging") -> встает за Build Docker.',
            codeLine: 8,
            queue: ['Unit Tests', 'Build Docker', 'Deploy Staging'],
            currentAction: 'push',
            metrics: { 'Длина': 3, 'Tail': 'Deploy Staging' }
          },
          {
            id: 4,
            description: 'process_next(): извлекаем первый элемент "Unit Tests" (FIFO)!',
            codeLine: 13,
            queue: ['Build Docker', 'Deploy Staging'],
            currentAction: 'pop',
            metrics: { 'Обработано': 'Unit Tests', 'Новый Head': 'Build Docker' }
          }
        ],
        roleTips: [
          {
            role: 'devops',
            title: 'Dead Letter Queue (DLQ)',
            content: 'Если задача из очереди падает с ошибкой N раз, ее отправляют в DLQ для ручного разбора, чтобы не блокировать очередь.'
          },
          {
            role: 'qa',
            title: 'Тестирование порядка выполнения',
            content: 'Проверяйте race conditions: если несколько воркеров одновременно забирают задачи из очереди, не нарушается ли порядок.'
          },
          {
            role: 'dev',
            title: 'Никогда не делайте list.pop(0)',
            content: 'Вызов list.pop(0) на миллионе записей вызовет заморозку сервиса, так как Python копирует 999 999 ссылок в памяти!'
          }
        ],
        quickCheck: {
          question: 'Почему для очереди в Python рекомендуется использовать collections.deque вместо обычного list?',
          options: [
            'list не умеет хранить строки',
            'deque занимает меньше места на диске',
            'popleft() в deque работает за O(1), а list.pop(0) — медленно за O(n)',
            'deque автоматически сортирует элементы'
          ],
          correctIndex: 2,
          explanation: 'В deque удаление из начала занимает константное время O(1), а в list требует сдвига всех элементов за O(n).'
        }
      },
      {
        id: 'l-5-3',
        chapterId: 'ch-5',
        title: 'Хэш-таблицы (dict / set) и поиск за O(1)',
        shortDesc: 'Как устроен словарь Python и почему он такой быстрый',
        duration: '6 мин',
        difficulty: 'intermediate',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(1) в среднем',
        spaceComplexity: 'O(n)',
        theory: {
          intro: 'Хэш-таблица сопоставляет ключ и значение с помощью хэш-функции hash(key). Это обеспечивает поиск, добавление и удаление элементов в среднем за O(1).',
          analogy: 'Камера хранения в гардеробе: вы отдаете куртку и получаете номерок. Чтобы забрать куртку, гардеробщик сразу идет к ячейке с этим номером.',
          keyPoints: [
            'Ключи в словаре и сете обязаны быть неизменяемыми (хэшируемыми: str, int, tuple).',
            'Словари в Python сохраняют порядок вставки (начиная с Python 3.7+).',
            'Коллизии хэшей разрешаются открытой адресацией (Open Addressing).'
          ],
          whenToUse: [
            'Кэширование результатов вычислений (Memoization, Redis)',
            'Мгновенный поиск дубликатов в логах',
            'Индексация пользователей по user_id'
          ]
        },
        pythonCode: `# Быстрый поиск дубликатов в логах за O(n) вместо O(n^2)
def find_unique_ips(log_entries: list[str]) -> set[str]:
    seen_ips = set()
    for ip in log_entries:
        seen_ips.add(ip)  # Добавление в set за O(1)
    return seen_ips

logs = ["192.168.1.1", "10.0.0.5", "192.168.1.1", "172.16.0.2"]
print(find_unique_ips(logs))  # {'192.168.1.1', '10.0.0.5', '172.16.0.2'}`,
        codeExplanation: 'Использование set позволяет отфильтровать дубликаты за один проход O(n) по списку.',
        visualizerType: 'hash-map',
        initialData: [192, 10, 192, 172],
        generateSteps: () => [
          {
            id: 0,
            description: 'Инициализация пустого хэш-сета seen_ips = set().',
            codeLine: 2,
            currentAction: 'init',
            metrics: { 'Размер set': 0 }
          },
          {
            id: 1,
            description: 'ip = "192.168.1.1": hash("192.168.1.1") -> ячейка 4. Добавлен!',
            codeLine: 4,
            currentAction: 'step',
            metrics: { 'Элемент': '192.168.1.1', 'Операция': 'add (O(1))', 'Размер': 1 }
          },
          {
            id: 2,
            description: 'ip = "10.0.0.5": hash("10.0.0.5") -> ячейка 1. Добавлен!',
            codeLine: 4,
            currentAction: 'step',
            metrics: { 'Элемент': '10.0.0.5', 'Операция': 'add (O(1))', 'Размер': 2 }
          },
          {
            id: 3,
            description: 'ip = "192.168.1.1": проверка in set -> уже есть! Игнорируем дубликат.',
            codeLine: 4,
            currentAction: 'compare',
            metrics: { 'Дубликат': 'Пропущен', 'Размер': 2 }
          },
          {
            id: 4,
            description: 'ip = "172.16.0.2": hash() -> ячейка 7. Добавлен! Итого 3 уникальных IP.',
            codeLine: 4,
            currentAction: 'found',
            metrics: { 'Итого уникальных': 3, 'Сложность': 'O(n)' }
          }
        ],
        roleTips: [
          {
            role: 'qa',
            title: 'Хэшируемость типов данных',
            content: 'Списки list и словари dict нельзя использовать как ключи в dict или элементы set (TypeError: unhashable type: list).'
          },
          {
            role: 'dev',
            title: 'dict.get(key, default)',
            content: 'Используйте config.get("TIMEOUT", 30) вместо config["TIMEOUT"], чтобы избежать падения с KeyError при отсутствии ключа.'
          },
          {
            role: 'devops',
            title: 'Redis как глобальный dict',
            content: 'Redis — это распределенная хэш-таблица в оперативной памяти, работающая по тем же принципам O(1).'
          }
        ],
        quickCheck: {
          question: 'Какой тип данных в Python НЕЛЬЗЯ использовать в качестве ключа словаря dict?',
          options: ['Строку "api_key"', 'Число 42', 'Список [1, 2, 3]', 'Кортеж (1, "a")'],
          correctIndex: 2,
          explanation: 'Список list является изменяемым (mutable), поэтому не имеет фиксированного хэша и не может быть ключом словаря.'
        }
      }
    ]
  },
  {
    id: 'ch-6',
    number: 6,
    icon: '🧭',
    title: 'Рекурсия и стек вызовов',
    subtitle: 'Базовый случай, рекурсивный шаг и обход деревьев',
    description: 'Когда функция вызывает саму себя. Как устроена глубина рекурсии и почему нельзя забывать базовый случай.',
    targetAudience: 'Разработчики, QA инженеры',
    color: 'rose',
    lessons: [
      {
        id: 'l-6-1',
        chapterId: 'ch-6',
        title: 'Анатомия рекурсии: Факториал и базовый случай',
        shortDesc: 'Base Case, Recursive Step и защита от RecursionError',
        duration: '5 мин',
        difficulty: 'intermediate',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n) стек',
        theory: {
          intro: 'Рекурсия — это прием, при котором функция решает задачу, вызывая саму себя с уменьшенным набором данных, пока не дойдет до базового случая (Base Case).',
          analogy: 'Матрешка: открываем матрешку, внутри точно такая же, но меньше. Самая маленькая неделимая матрешка — это базовый случай.',
          keyPoints: [
            'Два обязательных правила: 1) Базовый случай для остановки, 2) Продвижение к базовому случаю на каждом шаге.',
            'Каждый вызов функции занимает память в стеке вызовов (Call Stack).',
            'В Python лимит глубины рекурсии по умолчанию равен 1000 (sys.getrecursionlimit()).'
          ],
          whenToUse: [
            'Обход вложенных JSON-структур неизвестной глубины',
            'Обход директорий в файловой системе',
            'Алгоритмы "Разделяй и властвуй" (QuickSort, MergeSort)'
          ]
        },
        pythonCode: `# Вычисление факториала n! = n * (n-1) * ... * 1
def factorial(n: int) -> int:
    # 1. Базовый случай (Base case)
    if n <= 1:
        return 1
    
    # 2. Рекурсивный шаг (Recursive step)
    return n * factorial(n - 1)

print(factorial(4))  # 4 * 3 * 2 * 1 = 24`,
        codeExplanation: 'Вызов factorial(4) порождает цепочку в стеке: f(4) -> f(3) -> f(2) -> f(1). При достижении f(1) стек разворачивается назад с перемножением результатов.',
        visualizerType: 'recursion-tree',
        generateSteps: () => [
          {
            id: 0,
            description: 'Вызов factorial(4): n = 4 > 1 -> ждем результат factorial(3).',
            codeLine: 7,
            stack: ['factorial(4)'],
            currentAction: 'push',
            metrics: { 'Вызов': 'factorial(4)', 'Стек': '1 фрейм' }
          },
          {
            id: 1,
            description: 'Вызов factorial(3): n = 3 > 1 -> ждем результат factorial(2).',
            codeLine: 7,
            stack: ['factorial(4)', 'factorial(3)'],
            currentAction: 'push',
            metrics: { 'Вызов': 'factorial(3)', 'Стек': '2 фрейма' }
          },
          {
            id: 2,
            description: 'Вызов factorial(2): n = 2 > 1 -> ждем результат factorial(1).',
            codeLine: 7,
            stack: ['factorial(4)', 'factorial(3)', 'factorial(2)'],
            currentAction: 'push',
            metrics: { 'Вызов': 'factorial(2)', 'Стек': '3 фрейма' }
          },
          {
            id: 3,
            description: 'Вызов factorial(1): Базовый случай достигнут (n <= 1)! Возвращаем 1.',
            codeLine: 4,
            stack: ['factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1) [Base: 1]'],
            currentAction: 'found',
            metrics: { 'Базовый случай': 'n=1 -> возврат 1' }
          },
          {
            id: 4,
            description: 'Сворачивание стека: factorial(2) = 2 * 1 = 2.',
            codeLine: 7,
            stack: ['factorial(4)', 'factorial(3)', 'factorial(2) = 2'],
            currentAction: 'pop',
            metrics: { 'f(2)': 2 }
          },
          {
            id: 5,
            description: 'Сворачивание: factorial(3) = 3 * 2 = 6.',
            codeLine: 7,
            stack: ['factorial(4)', 'factorial(3) = 6'],
            currentAction: 'pop',
            metrics: { 'f(3)': 6 }
          },
          {
            id: 6,
            description: 'Финальный возврат: factorial(4) = 4 * 6 = 24!',
            codeLine: 7,
            stack: ['Результат = 24'],
            currentAction: 'found',
            metrics: { 'Итог': 'factorial(4) = 24' }
          }
        ],
        roleTips: [
          {
            role: 'qa',
            title: 'Тестирование отрицательных чисел и нуля',
            content: 'Если передать n = -1 в код с условием if n == 1, функция уйдет в бесконечную рекурсию! Всегда проверяйте n <= 1.'
          },
          {
            role: 'dev',
            title: 'Рекурсия vs Итерация',
            content: 'Любую рекурсию можно переписать на цикл for/while со стеком. Цикл работает быстрее и не расходует стек вызовов.'
          },
          {
            role: 'devops',
            title: 'RecursionError: maximum recursion depth exceeded',
            content: 'Если ваш скрипт парсинга упал с такой ошибкой, значит структура данных имеет циклы или слишком глубокую вложенность.'
          }
        ],
        quickCheck: {
          question: 'Что произойдет, если в рекурсивной функции забыть базовый случай (Base case)?',
          options: [
            'Функция вернет 0',
            'Код автоматически превратится в цикл',
            'Произойдет переполнение стека вызовов (RecursionError)',
            'Программа завершится без ошибок'
          ],
          correctIndex: 2,
          explanation: 'Без базового случая функция будет вызывать саму себя бесконечно, пока не исчерпает стек памяти.'
        }
      }
    ]
  },
  {
    id: 'ch-7',
    number: 7,
    icon: '🎯',
    title: 'Популярные алгоритмические паттерны',
    subtitle: 'Два указателя, скользящее окно и поиск дубликатов',
    description: 'Шаблоны, которые покрывают 80% задач на собеседованиях и оптимизаций в реальном коде.',
    targetAudience: 'Разработчики, QA инженеры',
    color: 'teal',
    lessons: [
      {
        id: 'l-7-1',
        chapterId: 'ch-7',
        title: 'Два указателя (Two Pointers)',
        shortDesc: 'Движение указателей навстречу друг другу за O(n)',
        duration: '5 мин',
        difficulty: 'intermediate',
        targetRoles: ['dev', 'qa'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Паттерн двух указателей использует два индекса (обычно left и right), которые двигаются по массиву навстречу друг другу или в одну сторону с разной скоростью.',
          analogy: 'Сжатие гармошки с двух краев одновременно.',
          keyPoints: [
            'Позволяет снизить сложность с O(n²) до O(n) без дополнительной памяти O(1).',
            'Идеально подходит для проверки палиндромов, разворота массивов и поиска пары чисел с заданной суммой (Two Sum в отсортированном массиве).'
          ],
          whenToUse: [
            'Проверка симметрии данных (палиндромы)',
            'Слияние двух отсортированных списков',
            'Удаление дубликатов in-place'
          ]
        },
        pythonCode: `# Проверка строки на палиндром методом двух указателей
def is_palindrome(text: str) -> bool:
    # Очищаем строку от пробелов и приводим к нижнему регистру
    clean = "".join(ch.lower() for ch in text if ch.isalnum())
    
    left = 0
    right = len(clean) - 1
    
    while left < right:
        if clean[left] != clean[right]:
            return False
        left += 1
        right -= 1
        
    return True

print(is_palindrome("А роза упала на лапу Азора"))  # True`,
        codeExplanation: 'Указатели left и right сходятся к центру. Если все пары символов совпали, строка симметрична.',
        visualizerType: 'two-pointers',
        generateSteps: () => generateTwoPointersSteps("дед"),
        roleTips: [
          {
            role: 'qa',
            title: 'Граничные кейсы для палиндрома',
            content: 'Проверяйте: пустая строка "", строка из 1 символа "а", четная длина "abba", нечетная длина "abcba", строка только из спецсимволов "!?".'
          },
          {
            role: 'dev',
            title: 'Экономия памяти O(1)',
            content: 'В отличие от среза text == text[::-1], который создает копию строки в памяти, два указателя работают с O(1) памяти.'
          },
          {
            role: 'devops',
            title: 'Сравнение версий пакетов',
            content: 'Паттерн двух указателей часто используется при пошаговом сравнении semantic versioning (например, "2.4.1" vs "2.4.10").'
          }
        ],
        quickCheck: {
          question: 'Сколько шагов сделает алгоритм двух указателей для строки длиной 10 символов в худшем случае?',
          options: ['100 шагов (10²)', '10 шагов', '5 шагов (10 / 2)', '1 шаг'],
          correctIndex: 2,
          explanation: 'Так как оба указателя идут навстречу друг другу, они встретятся ровно в середине за n / 2 = 5 шагов.'
        }
      }
    ]
  },
  {
    id: 'ch-8',
    number: 8,
    icon: '🌐',
    title: 'Графы и деревья на пальцах',
    subtitle: 'Дерево DOM, зависимости сервисов, BFS и DFS',
    description: 'Иерархические и сетевые структуры данных. Как обойти дерево зависимостей и найти кратчайший путь.',
    targetAudience: 'Разработчики, QA инженеры, DevOps',
    color: 'cyan',
    lessons: [
      {
        id: 'l-8-1',
        chapterId: 'ch-8',
        title: 'Поиск в ширину (BFS) и глубину (DFS)',
        shortDesc: 'Обход графа: волна (очередь) vs погружение (стек)',
        duration: '7 мин',
        difficulty: 'intermediate',
        targetRoles: ['dev', 'qa', 'devops'],
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        theory: {
          intro: 'Граф состоит из вершин (nodes) и ребер (edges). BFS (Breadth-First Search) исследует соседей послойно с помощью очереди, а DFS (Depth-First Search) идет до упора вглубь с помощью стека или рекурсии.',
          analogy: 'BFS — круги на воде от брошенного камня (волна). DFS — исследование лабиринта по правилу одной руки.',
          keyPoints: [
            'BFS гарантированно находит кратчайший путь во взвешенном графе с равными весами.',
            'DFS используется для поиска циклов, топологической сортировки и проверки связности.',
            'Для предотвращения зацикливания всегда храните множество посещенных вершин visited = set().'
          ],
          whenToUse: [
            'QA: Поиск элементов в дереве DOM веб-страницы',
            'DevOps: Построение графа DAG в Terraform и CI/CD пайплайнах',
            'Маршрутизация пакетов в сети'
          ]
        },
        pythonCode: `from collections import deque

# Граф зависимостей микросервисов
graph = {
    'Gateway': ['Auth', 'Orders', 'Users'],
    'Auth': ['Database'],
    'Orders': ['Database', 'Payment'],
    'Users': ['Database'],
    'Payment': [],
    'Database': []
}

# BFS: обход сервисов по слоям (уровням зависимости)
def bfs_services(graph: dict, start: str):
    visited = set([start])
    queue = deque([start])
    
    order = []
    while queue:
        service = queue.popleft()
        order.append(service)
        
        for neighbor in graph.get(service, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return order

print("Порядок обхода:", bfs_services(graph, 'Gateway'))`,
        codeExplanation: 'BFS использует очередь deque для последовательного обхода каждого уровня зависимостей.',
        visualizerType: 'graph-bfs-dfs',
        generateSteps: () => [
          {
            id: 0,
            description: 'Старт BFS от вершины "Gateway". Добавляем в очередь и в visited.',
            codeLine: 14,
            queue: ['Gateway'],
            treeVisited: ['Gateway'],
            currentAction: 'init',
            metrics: { 'Текущий': 'Gateway', 'Очередь': '["Gateway"]' }
          },
          {
            id: 1,
            description: 'Извлекаем "Gateway". Добавляем его соседей первого уровня: Auth, Orders, Users.',
            codeLine: 20,
            queue: ['Auth', 'Orders', 'Users'],
            treeVisited: ['Gateway', 'Auth', 'Orders', 'Users'],
            currentAction: 'step',
            metrics: { 'Уровень 1': 'Auth, Orders, Users', 'Очередь': '3 сервиса' }
          },
          {
            id: 2,
            description: 'Извлекаем "Auth". Добавляем соседа: Database.',
            codeLine: 20,
            queue: ['Orders', 'Users', 'Database'],
            treeVisited: ['Gateway', 'Auth', 'Orders', 'Users', 'Database'],
            currentAction: 'step',
            metrics: { 'Уровень 2': 'Database' }
          },
          {
            id: 3,
            description: 'Извлекаем "Orders". Database уже в visited, добавляем соседа: Payment.',
            codeLine: 20,
            queue: ['Users', 'Database', 'Payment'],
            treeVisited: ['Gateway', 'Auth', 'Orders', 'Users', 'Database', 'Payment'],
            currentAction: 'step',
            metrics: { 'Новый': 'Payment' }
          },
          {
            id: 4,
            description: 'Очередь опустела. Все 6 микросервисов обойдены по уровням!',
            codeLine: 24,
            queue: [],
            treeVisited: ['Gateway', 'Auth', 'Orders', 'Users', 'Database', 'Payment'],
            currentAction: 'found',
            metrics: { 'Итог': '6 сервисов', 'Сложность': 'O(V + E)' }
          }
        ],
        roleTips: [
          {
            role: 'devops',
            title: 'Граф зависимостей в Terraform',
            content: 'Команда terraform graph строит направленный ациклический граф (DAG) и использует топологическую сортировку (DFS) для параллельного создания ресурсов.'
          },
          {
            role: 'qa',
            title: 'XPath и CSS селекторы в DOM',
            content: 'Поиск элементов в Selenium/Playwright использует обход дерева DOM. Глубокие селекторы работают медленнее коротких ID.'
          },
          {
            role: 'dev',
            title: 'Кратчайший путь',
            content: 'Если нужно найти минимальное число переходов между объектами, всегда выбирайте BFS, а не DFS.'
          }
        ],
        quickCheck: {
          question: 'Какую структуру данных использует алгоритм BFS для послойного обхода графа?',
          options: ['Стек (LIFO)', 'Очередь (FIFO)', 'Бинарное дерево', 'Хэш-таблицу без очереди'],
          correctIndex: 1,
          explanation: 'BFS использует очередь (Queue / FIFO) для сохранения порядка вершин от ближних к дальним.'
        }
      }
    ]
  },
  {
    id: 'ch-9',
    number: 9,
    icon: '🚀',
    title: 'Алгоритмы в реальной инфраструктуре',
    subtitle: 'Retry с Exponential Backoff, Round Robin и Rate Limiting',
    description: 'Инженерные алгоритмы, обеспечивающие отказоустойчивость, балансировку и стабильность продакшена.',
    targetAudience: 'DevOps инженеры, Backend разработчики, QA инженеры',
    color: 'emerald',
    lessons: [
      {
        id: 'l-9-1',
        chapterId: 'ch-9',
        title: 'Exponential Backoff с Jitter (Умный Retry)',
        shortDesc: 'Как правильно повторять упавшие сетевые запросы',
        duration: '6 мин',
        difficulty: 'intermediate',
        targetRoles: ['devops', 'dev', 'qa'],
        timeComplexity: 'O(retries)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Когда сервис падает или перегружен (503 Service Unavailable), наивный постоянный retry добивает сервер штормом запросов. Exponential Backoff экспоненциально увеличивает паузу между попытками, а Jitter добавляет случайный шум.',
          analogy: 'Если дверь заперта, не нужно долбить в нее каждую секунду. Попробуйте через 1 секунду, потом через 2, 4, 8 секунд.',
          keyPoints: [
            'Формула задержки: delay = base_delay * (2 ^ attempt) + random_jitter.',
            'Jitter (случайный разброс) критически важен: он размазывает запросы от 10 000 клиентов во времени и предотвращает "Thundering Herd Problem" (эффект собачьей своры).',
            'Всегда ограничивайте максимальную задержку (max_delay) и число попыток (max_retries).'
          ],
          whenToUse: [
            'Повтор HTTP-запросов к внешним API (Payment gateways, AWS SDK)',
            'Подключение к базе данных при перезапуске кластера',
            'Автотесты: ожидание готовности сервиса (polling)'
          ]
        },
        pythonCode: `import time
import random

# Алгоритм повторных попыток с экспоненциальной задержкой и джиттером
def retry_with_backoff(func, max_retries=4, base_delay=1.0, max_delay=30.0):
    for attempt in range(max_retries):
        try:
            return func()  # Пытаемся выполнить опасную операцию
        except Exception as e:
            if attempt == max_retries - 1:
                raise e  # Все попытки исчерпаны
                
            # Экспоненциальный рост: 1s, 2s, 4s, 8s...
            delay = min(base_delay * (2 ** attempt), max_delay)
            # Full Jitter: случайное число от 0 до delay
            jittered_delay = random.uniform(0, delay)
            
            print(f"[!] Сбой ({e}). Повтор {attempt + 1} через {jittered_delay:.2f} сек...")
            time.sleep(jittered_delay)`,
        codeExplanation: 'Формула random.uniform(0, delay) реализует стратегию Full Jitter, рекомендованную инженерами AWS Architecture.',
        visualizerType: 'exponential-backoff',
        generateSteps: () => generateExponentialBackoffSteps(),
        roleTips: [
          {
            role: 'devops',
            title: 'Thundering Herd Problem',
            content: 'Без Jitter тысячи подов Kubernetes после перезапуска базы одновременно отправят retry ровно через 2 секунды и снова обрушат ее.'
          },
          {
            role: 'qa',
            title: 'Тестирование нестабильных сетей (Chaos Testing)',
            content: 'Вводите искусственные задержки и 500 ошибки (например, с помощью Toxiproxy), чтобы проверить работу retry policy.'
          },
          {
            role: 'dev',
            title: 'Идемпотентность запросов',
            content: 'Повторять можно только идемпотентные запросы (GET, PUT, DELETE). Повтор неотменяемого POST /pay может привести к двойному списанию!'
          }
        ],
        quickCheck: {
          question: 'Зачем в алгоритме Exponential Backoff добавляется случайный шум (Jitter)?',
          options: [
            'Чтобы ускорить интернет-соединение',
            'Чтобы предотвратить одновременный шторм запросов от множества клиентов',
            'Для шифрования данных запроса',
            'Для экономии оперативной памяти'
          ],
          correctIndex: 1,
          explanation: 'Jitter размазывает одновременные повторные запросы клиентов во времени, спасая упавший сервер от перегрузки.'
        }
      },
      {
        id: 'l-9-2',
        chapterId: 'ch-9',
        title: 'Round Robin (Балансировка нагрузки)',
        shortDesc: 'Циклическое распределение запросов по серверам',
        duration: '5 мин',
        difficulty: 'beginner',
        targetRoles: ['devops', 'dev'],
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)',
        theory: {
          intro: 'Round Robin — простейший и самый надежный алгоритм балансировки нагрузки. Запросы передаются серверам по кругу по формуле index = (index + 1) % len(servers).',
          analogy: 'Раздача карт игрокам за столом: по одной карте каждому по часовой стрелке по кругу.',
          keyPoints: [
            'Работает за константное время O(1) и не требует синхронизации состояния сессий.',
            'Операция взятия остатка от деления % автоматически закольцовывает индекс в пределах списка.',
            'Лежит в основе базовой маршрутизации Nginx, HAProxy и Kubernetes Kube-Proxy.'
          ],
          whenToUse: [
            'Балансировка stateless микросервисов одинаковой мощности',
            'Ротация прокси-серверов в автотестах',
            'DNS Round Robin'
          ]
        },
        pythonCode: `# Простой балансировщик Round Robin
class RoundRobinBalancer:
    def __init__(self, backends: list[str]):
        self.backends = backends
        self.current_idx = 0

    def get_next_backend(self) -> str:
        if not self.backends:
            raise RuntimeError("Нет доступных серверов!")
            
        backend = self.backends[self.current_idx]
        # Кольцевой сдвиг указателя с помощью остатка от деления
        self.current_idx = (self.current_idx + 1) % len(self.backends)
        return backend

balancer = RoundRobinBalancer(["server-1", "server-2", "server-3"])
for req in range(5):
    print(f"Запрос {req + 1} -> {balancer.get_next_backend()}")`,
        codeExplanation: 'Формула (current_idx + 1) % len(backends) гарантирует, что после последнего сервера указатель вернется к 0.',
        visualizerType: 'round-robin',
        generateSteps: () => generateRoundRobinSteps(),
        roleTips: [
          {
            role: 'devops',
            title: 'Weighted Round Robin',
            content: 'Если серверы разной мощности (2 CPU vs 8 CPU), каждому серверу задают вес (weight), отправляя пропорционально больше запросов.'
          },
          {
            role: 'qa',
            title: 'Sticky Sessions в тестах',
            content: 'Если тестируемое приложение хранит сессии в памяти сервера (stateful), Round Robin без Sticky Sessions приведет к внезапным разлогинам!'
          },
          {
            role: 'dev',
            title: 'Потокобезопасность (Thread Safety)',
            content: 'В многопоточной среде инкремент current_idx должен быть атомарным (AtomicInteger / mutex).'
          }
        ],
        quickCheck: {
          question: 'Какой сервер обработает 7-й запрос при наличии 3 серверов (индексы 0, 1, 2) в Round Robin?',
          options: ['Сервер 0 (7 % 3 = 1 -> сервер с индексом 0)', 'Сервер 1 (индекс 0)', 'Сервер с индексом 0 (7-й запрос: 0,1,2, 0,1,2, 0)', 'Сервер 3'],
          correctIndex: 2,
          explanation: 'Последовательность серверов: 1-й->0, 2-й->1, 3-й->2, 4-й->0, 5-й->1, 6-й->2, 7-й->0.'
        }
      }
    ]
  }
];
