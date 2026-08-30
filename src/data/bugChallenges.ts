import { BugChallenge } from '../types';

export const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 'bug-1',
    title: 'Зацикливание в бинарном поиске',
    roleTarget: 'qa',
    difficulty: 'easy',
    scenario: 'Автотест упал по таймауту: функция binary_search зависла в бесконечном цикле при поиске отсутствующего элемента.',
    buggyCode: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid      # ❌ Ошибка здесь!
        else:
            right = mid - 1
            
    return -1`,
    correctLineNumber: 9,
    options: [
      {
        text: 'На строке 9 должно быть left = mid + 1, иначе диапазон не уменьшается при left == mid',
        isCorrect: true,
        explanation: 'Когда left == mid, присваивание left = mid не меняет границы поиска, приводя к бесконечному циклу while.'
      },
      {
        text: 'На строке 5 должно быть while left < right вместо <=',
        isCorrect: false,
        explanation: 'Условие <= необходимо для проверки массива из одного элемента.'
      },
      {
        text: 'На строке 3 должно быть right = len(arr)',
        isCorrect: false,
        explanation: 'len(arr) приведет к IndexError при обращении к arr[mid].'
      }
    ],
    fixedCode: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1   # ✅ Теперь диапазон строго уменьшается
        else:
            right = mid - 1
            
    return -1`,
    takeaway: 'Всегда сдвигайте границы бинарного поиска строго за пределы уже проверенной точки mid (left = mid + 1 или right = mid - 1).'
  },
  {
    id: 'bug-2',
    title: 'Ловушка изменяемого аргумента по умолчанию в Python',
    roleTarget: 'dev',
    difficulty: 'medium',
    scenario: 'Разработчик написал функцию добавления логов в очередь, но логи разных пользователей стали перемешиваться между запросами!',
    buggyCode: `def collect_metrics(metric_name, tags=[]):  # ❌ Опасный аргумент по умолчанию!
    tags.append(metric_name)
    return tags

# Вызов 1:
print(collect_metrics("cpu_high"))  # ['cpu_high']
# Вызов 2:
print(collect_metrics("mem_high"))  # ['cpu_high', 'mem_high'] - БАГ!`,
    correctLineNumber: 1,
    options: [
      {
        text: 'В строке 1 список tags=[] создается один раз при определении функции и переиспользуется всеми вызовами',
        isCorrect: true,
        explanation: 'В Python изменяемые объекты по умолчанию (списки, словари) сохраняют состояние между вызовами функции.'
      },
      {
        text: 'На строке 2 нужно использовать tags.insert(0, metric_name)',
        isCorrect: false,
        explanation: 'Метод insert не решает проблему мутации общего объекта.'
      },
      {
        text: 'Строка 3 должна возвращать кортеж tuple(tags)',
        isCorrect: false,
        explanation: 'Возврат кортежа не предотвратит накопление элементов в исходном списке tags.'
      }
    ],
    fixedCode: `def collect_metrics(metric_name, tags=None):
    if tags is None:
        tags = []  # ✅ Новый список создается при каждом вызове
    tags.append(metric_name)
    return tags`,
    takeaway: 'Никогда не используйте mutable объекты ([], {}) как default-аргументы в функциях Python. Всегда используйте None.'
  },
  {
    id: 'bug-3',
    title: 'Бесконечная рекурсия при отрицательном факториале',
    roleTarget: 'qa',
    difficulty: 'easy',
    scenario: 'При передаче отрицательного числа в функцию расчета факториала сервис падает с RecursionError: maximum recursion depth exceeded.',
    buggyCode: `def factorial(n):
    if n == 1:       # ❌ Базовый случай не ловит n <= 0
        return 1
    return n * factorial(n - 1)

factorial(-5)  # Падает с RecursionError!`,
    correctLineNumber: 2,
    options: [
      {
        text: 'Базовый случай должен быть if n <= 1: return 1 или проверять n < 0 с выбросом ValueError',
        isCorrect: true,
        explanation: 'При n = -5 проверка n == 1 никогда не сработает, и n будет бесконечно уменьшаться (-6, -7, ...).'
      },
      {
        text: 'Нужно убрать умножение на n',
        isCorrect: false,
        explanation: 'Умножение на n — это суть математической формулы факториала.'
      },
      {
        text: 'Нужно вызвать sys.setrecursionlimit(10000)',
        isCorrect: false,
        explanation: 'Увеличение лимита лишь отсрочит падение с Out of Memory.'
      }
    ],
    fixedCode: `def factorial(n):
    if n < 0:
        raise ValueError("Факториал определен только для n >= 0")
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    takeaway: 'В рекурсивных функциях базовый случай должен быть устойчив ко всему диапазону входных значений (<= вместо ==).'
  },
  {
    id: 'bug-4',
    title: 'Модификация списка во время итерации (Удаление элементов)',
    roleTarget: 'devops',
    difficulty: 'medium',
    scenario: 'Скрипт очистки старых подов в кластере пропускает половину записей из-за удаления элементов прямо во время цикла for!',
    buggyCode: `def cleanup_stale_pods(pods):
    for pod in pods:
        if pod.startswith("stale-"):
            pods.remove(pod)  # ❌ Удаление смещает индексы в массиве!
    return pods

data = ["stale-1", "stale-2", "active-1"]
print(cleanup_stale_pods(data))  # Вернет ['stale-2', 'active-1'] - БАГ!`,
    correctLineNumber: 4,
    options: [
      {
        text: 'Удаление из списка во время итерации сдвигает элементы влево, из-за чего следующий элемент пропускается',
        isCorrect: true,
        explanation: 'При удалении "stale-1" элемент "stale-2" встает на 0-й индекс, а цикл переходит к индексу 1, пропуская его.'
      },
      {
        text: 'Нужно использовать pods.pop() вместо remove()',
        isCorrect: false,
        explanation: 'pop() также изменит длину списка и нарушит итерацию.'
      },
      {
        text: 'startswith не поддерживает префиксы со знаком дефиса',
        isCorrect: false,
        explanation: 'startswith отлично работает с любыми строками.'
      }
    ],
    fixedCode: `# ✅ Решение 1: List comprehension (создание нового отфильтрованного списка)
def cleanup_stale_pods(pods):
    return [pod for pod in pods if not pod.startswith("stale-")]

# ✅ Решение 2: Итерация по копии списка pods[:]
# for pod in pods[:]:
#     if pod.startswith("stale-"):
#         pods.remove(pod)`,
    takeaway: 'Никогда не удаляйте и не добавляйте элементы в список во время прямой итерации for x in list. Создавайте новый список через comprehension.'
  },
  {
    id: 'bug-5',
    title: 'Падение стека при проверке пустых скобок',
    roleTarget: 'qa',
    difficulty: 'easy',
    scenario: 'При парсинге строки ")]}" валидатор падает с ошибкой IndexError: pop from empty list.',
    buggyCode: `def check_brackets(s):
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            stack.pop()  # ❌ Падение, если стек пуст!
    return len(stack) == 0

check_brackets(")")  # IndexError: pop from empty list`,
    correctLineNumber: 7,
    options: [
      {
        text: 'Перед вызовом stack.pop() отсутствует проверка if not stack: return False',
        isCorrect: true,
        explanation: 'Если первой встретилась закрывающая скобка, стек пуст и попытка извлечь элемент вызывает падение.'
      },
      {
        text: 'Стек должен быть строкой, а не списком',
        isCorrect: false,
        explanation: 'Список — стандартная реализация стека в Python.'
      },
      {
        text: 'len(stack) всегда возвращает отрицательное число',
        isCorrect: false,
        explanation: 'len() всегда возвращает неотрицательное целое число.'
      }
    ],
    fixedCode: `def check_brackets(s):
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            if not stack:   # ✅ Защитная проверка
                return False
            stack.pop()
    return len(stack) == 0`,
    takeaway: 'Любая операция pop() со стеком или очередью обязана иметь проверку на пустоту.'
  }
];
