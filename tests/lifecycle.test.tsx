import assert from 'node:assert/strict';
import { register } from 'node:module';
import { afterEach, beforeEach, test, type TestContext } from 'node:test';
import React, { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { ThemeProvider } from '../src/context/ThemeContext';
import { CHAPTERS } from '../src/data/chapters';
import { createInitialProgress } from '../src/utils/storage';
import { generateLinearSearchSteps } from '../src/utils/stepGenerators';
import { QUIZ_QUESTIONS } from '../src/data/quizzes';

register('./assets-loader.mjs', import.meta.url);
const { default: App } = await import('../src/App');
const { SplashScreen } = await import('../src/components/SplashScreen');
const { PythonCodeViewer } = await import('../src/components/PythonCodeViewer');
const { LessonView } = await import('../src/components/LessonView');
const { Sandbox } = await import('../src/components/Sandbox');
const { QuizView } = await import('../src/components/QuizView');

let dom: JSDOM;
let container: HTMLElement;
let root: Root;
const globalNames = ['window', 'document', 'navigator', 'localStorage', 'IS_REACT_ACT_ENVIRONMENT'];
let originalGlobals: Map<string, PropertyDescriptor | undefined>;

beforeEach((t) => {
  dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost' });
  dom.window.scrollTo = () => {};
  originalGlobals = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  for (const name of globalNames) {
    Object.defineProperty(globalThis, name, {
      configurable: true, writable: true,
      value: name === 'IS_REACT_ACT_ENVIRONMENT' ? true : dom.window[name]
    });
  }
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true });
  container = document.getElementById('root')!;
  root = createRoot(container);
  (t as TestContext).mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
});

afterEach(() => {
  act(() => root.unmount());
  dom.window.close();
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
});

function button(text: string): HTMLButtonElement {
  const match = [...container.querySelectorAll('button')].find(el => el.textContent?.includes(text));
  assert.ok(match, `Button not found: ${text}`);
  return match;
}

function click(element: HTMLElement) {
  act(() => element.click());
}

function openFirstLesson(t: TestContext) {
  act(() => root.render(<StrictMode><ThemeProvider><App /></ThemeProvider></StrictMode>));
  click(button('Пропустить'));
  act(() => t.mock.timers.tick(200));
  click(button('Начать'));
}

test('moving to the next lesson clears the answer, code highlight and playback', (t) => {
  openFirstLesson(t);
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  click(button('Проверка'));
  const lesson = CHAPTERS[0].lessons[0];
  const wrongAnswer = lesson.quickCheck.options.find((_, index) => index !== lesson.quickCheck.correctIndex)!;
  click(button(wrongAnswer));
  assert.equal(button(wrongAnswer).disabled, true);
  click(button('Завершить & Далее'));
  act(() => t.mock.timers.tick(300));
  assert.equal(container.querySelector('h1')?.textContent, CHAPTERS[0].lessons[1].title);
  assert.match(container.textContent!, /Шаг 1 \/ /);
  assert.match(container.querySelector('#viz-play-pause-btn')!.textContent!, /Пуск/);
  click(button('Проверка'));
  for (const option of CHAPTERS[0].lessons[1].quickCheck.options) {
    assert.equal(button(option).disabled, false);
  }
});

test('leaving a lesson cancels its delayed navigation', (t) => {
  openFirstLesson(t);
  click(button('Завершить & Далее'));
  click(container.querySelector<HTMLButtonElement>('#lesson-back-btn')!);
  act(() => t.mock.timers.tick(1000));
  assert.equal(container.querySelector('#lesson-back-btn'), null);
  assert.ok(button('Начать'));
});

test('repeated next clicks keep a single delayed transition', (t) => {
  openFirstLesson(t);
  click(button('Завершить & Далее'));
  click(button(CHAPTERS[0].lessons[1].title));
  assert.equal(container.querySelector('h1')?.textContent, CHAPTERS[0].lessons[0].title);
  act(() => t.mock.timers.tick(300));
  assert.equal(container.querySelector('h1')?.textContent, CHAPTERS[0].lessons[1].title);
});

test('playback stops and starts at step one when changing lessons', (t) => {
  openFirstLesson(t);
  click(container.querySelector<HTMLButtonElement>('#viz-play-pause-btn')!);
  act(() => t.mock.timers.tick(1200));
  click(button('Завершить & Далее'));
  act(() => t.mock.timers.tick(300));
  act(() => t.mock.timers.tick(2400));
  assert.match(container.textContent!, /Шаг 1 \/ /);
  assert.match(container.querySelector('#viz-play-pause-btn')!.textContent!, /Пуск/);
});

test('copy notification lasts two seconds after the most recent click', (t) => {
  act(() => root.render(<PythonCodeViewer code="print(1)" />));
  click(button('Копировать'));
  act(() => t.mock.timers.tick(1500));
  click(button('Скопировано!'));
  act(() => t.mock.timers.tick(500));
  assert.ok(button('Скопировано!'));
  act(() => t.mock.timers.tick(1500));
  assert.ok(button('Копировать'));
});

test('unmounting the code viewer cancels its notification timeout', (t) => {
  const clear = t.mock.method(globalThis, 'clearTimeout');
  act(() => root.render(<PythonCodeViewer code="print(1)" />));
  click(button('Копировать'));
  const before = clear.mock.callCount();
  act(() => root.render(null));
  assert.equal(clear.mock.callCount(), before + 1);
  act(() => t.mock.timers.tick(3000));
});

test('splash skip near automatic completion finishes only once', (t) => {
  const finish = t.mock.fn();
  act(() => root.render(<StrictMode><SplashScreen onFinish={finish} /></StrictMode>));
  act(() => t.mock.timers.tick(2560));
  click(button('Пропустить'));
  act(() => t.mock.timers.tick(200));
  assert.equal(finish.mock.callCount(), 1);
  act(() => t.mock.timers.tick(3000));
  assert.equal(finish.mock.callCount(), 1);
});

test('unmounting the splash during fade cancels its finish callback', (t) => {
  const finish = t.mock.fn();
  act(() => root.render(<SplashScreen onFinish={finish} />));
  act(() => t.mock.timers.tick(2600));
  act(() => root.render(null));
  act(() => t.mock.timers.tick(1000));
  assert.equal(finish.mock.callCount(), 0);
});

test('lesson playback, bookmarks and tabs reuse the generated steps', (t) => {
  const generator = t.mock.method(CHAPTERS[0].lessons[0], 'generateSteps');
  openFirstLesson(t);
  const initialCalls = generator.mock.callCount();
  assert.ok(initialCalls > 0);
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  click(container.querySelector<HTMLButtonElement>('#viz-play-pause-btn')!);
  act(() => t.mock.timers.tick(1200));
  click(container.querySelector<HTMLButtonElement>('#lesson-bookmark-btn')!);
  click(button('Теория & Аналогия'));
  click(button('Симулятор & Код'));
  assert.equal(generator.mock.callCount(), initialCalls);
});

test('lesson steps are regenerated when the input data changes', (t) => {
  const generator = t.mock.fn((data: number[]) => generateLinearSearchSteps(data, 2));
  const lesson = { ...CHAPTERS[0].lessons[0], initialData: [1, 2], generateSteps: generator };
  const render = (currentLesson: typeof lesson) => act(() => root.render(
    <LessonView lesson={currentLesson} progress={createInitialProgress()} onBack={() => {}}
      onSelectLesson={() => {}} onToggleBookmark={() => {}} onCompleteLesson={() => {}} />
  ));
  render(lesson);
  assert.equal(generator.mock.callCount(), 1);
  render({ ...lesson, title: 'Updated title' });
  assert.equal(generator.mock.callCount(), 1);
  render({ ...lesson, initialData: [3, 4] });
  assert.equal(generator.mock.callCount(), 2);
  assert.deepEqual(generator.mock.calls[1].arguments[0], [3, 4]);
});

function pasteInto(id: string, text: string) {
  const input = container.querySelector<HTMLInputElement>(`#${id}`)!;
  input.setSelectionRange(0, input.value.length);
  const event = new dom.window.Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
  act(() => { input.dispatchEvent(event); });
}

test('oversized paste is rejected before entering array state and valid input recovers', () => {
  act(() => root.render(<Sandbox />));
  const input = container.querySelector<HTMLInputElement>('#sandbox-array')!;
  const initial = input.value;
  pasteInto('sandbox-array', '1,'.repeat(100_000));
  assert.equal(input.value, initial);
  assert.equal(input.getAttribute('aria-invalid'), 'true');
  assert.match(container.querySelector('[role="alert"]')!.textContent!, /256/);
  assert.equal(container.querySelector('#viz-play-pause-btn'), null);
  pasteInto('sandbox-array', '3, 2, 1');
  assert.equal(input.value, '3, 2, 1');
  assert.equal(input.getAttribute('aria-invalid'), 'false');
  assert.ok(container.querySelector('#viz-play-pause-btn'));
});

test('invalid array interrupts playback and corrected data restarts from step one', (t) => {
  act(() => root.render(<Sandbox />));
  click(container.querySelector<HTMLButtonElement>('#viz-play-pause-btn')!);
  act(() => t.mock.timers.tick(1200));
  pasteInto('sandbox-array', '12abc');
  assert.equal(container.querySelector('#viz-play-pause-btn'), null);
  act(() => t.mock.timers.tick(2400));
  pasteInto('sandbox-array', '1, 2');
  assert.match(container.textContent!, /Шаг 1 \/ /);
  assert.match(container.querySelector('#viz-play-pause-btn')!.textContent!, /Пуск/);
});

test('invalid target blocks search but does not prevent sorting', () => {
  act(() => root.render(<Sandbox />));
  pasteInto('sandbox-target', '9007199254740992');
  assert.equal(container.querySelector('#viz-play-pause-btn'), null);
  assert.ok(container.querySelector('#sandbox-target-error'));
  click(button('Bubble Sort'));
  assert.ok(container.querySelector('#viz-play-pause-btn'));
  click(button('Бинарный поиск'));
  assert.equal(container.querySelector('#viz-play-pause-btn'), null);
  pasteInto('sandbox-target', '0');
  assert.ok(container.querySelector('#viz-play-pause-btn'));
  assert.equal(container.querySelector('#sandbox-target-error'), null);
});

function highlightedCode() {
  const row = [...container.querySelectorAll('tr')].find(row => row.classList.contains('bg-indigo-500/25'));
  assert.ok(row, 'The current Python line must be highlighted');
  return row.lastElementChild!.textContent!.trim();
}

test('bubble swap highlights the same Python assignment in sandbox and lesson', () => {
  act(() => root.render(<Sandbox />));
  click(button('Bubble Sort'));
  pasteInto('sandbox-array', '2, 1');
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  const assignment = 'arr[j], arr[j + 1] = arr[j + 1], arr[j]';
  assert.equal(highlightedCode(), assignment);
  const lesson = CHAPTERS.flatMap(chapter => chapter.lessons).find(lesson => lesson.id === 'l-4-1')!;
  act(() => root.render(<LessonView lesson={{ ...lesson, initialData: [2, 1] }}
    progress={createInitialProgress()} onBack={() => {}} onSelectLesson={() => {}}
    onToggleBookmark={() => {}} onCompleteLesson={() => {}} />));
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  click(container.querySelector<HTMLButtonElement>('#viz-next-btn')!);
  assert.equal(highlightedCode(), assignment);
});

for (const lastCorrect of [true, false]) {
  test(`quiz saves the displayed score when the last answer is ${lastCorrect ? 'correct' : 'wrong'}`, (t) => {
    const save = t.mock.fn();
    act(() => root.render(<QuizView onSaveScore={save} />));
    QUIZ_QUESTIONS.forEach((question, index) => {
      const last = index === QUIZ_QUESTIONS.length - 1;
      const option = last && !lastCorrect ? (question.correctIndex + 1) % question.options.length : question.correctIndex;
      click(button(question.options[option]));
      click(button(last ? 'Завершить квиз' : 'Следующий вопрос'));
    });
    const expected = QUIZ_QUESTIONS.length - (lastCorrect ? 0 : 1);
    assert.equal(save.mock.callCount(), 1);
    assert.deepEqual(save.mock.calls[0].arguments, ['all', expected]);
    assert.match(container.textContent!, new RegExp(`Ваш результат: ${expected} из ${QUIZ_QUESTIONS.length}`));
  });
}

test('single-question quiz and restart each score an answer exactly once', (t) => {
  const save = t.mock.fn();
  act(() => root.render(<QuizView onSaveScore={save} />));
  click(button('Глава 1'));
  const question = QUIZ_QUESTIONS.find(question => question.chapterId === 'ch-1')!;
  click(button(question.options[question.correctIndex]));
  click(button('Завершить квиз'));
  assert.deepEqual(save.mock.calls[0].arguments, ['ch-1', 1]);
  assert.match(container.textContent!, /100%/);
  click(button('Пройти еще раз'));
  click(button(question.options[(question.correctIndex + 1) % question.options.length]));
  click(button('Завершить квиз'));
  assert.deepEqual(save.mock.calls[1].arguments, ['ch-1', 0]);
  assert.match(container.textContent!, /Ваш результат: 0 из 1/);
});
