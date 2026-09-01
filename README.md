# AlgoLearn Python 📱🐍
> **Интерактивный мобильный самоучитель по алгоритмам на Python для Разработчиков (Dev), Тестировщиков (QA) и DevOps-инженеров.**

Приложение содержит пошаговую визуализацию работы алгоритмов с привязкой к строкам кода Python 3.12, интерактивную песочницу, режим «Найди баг» с граничными тестами, срезы по специализациям и последовательную систему прогресса.

---

## 📑 Содержание
1. [Стек технологий](#-стек-технологий)
2. [Требования к окружению](#-требования-к-окружению)
3. [Локальный запуск и разработка](#-локальный-запуск-и-разработка)
4. [Инструкция по сборке Android APK](#-инструкция-по-сборке-android-apk)
   - [Подготовка окружения для Android](#1-подготовка-окружения-для-android)
   - [Сборка APK через Capacitor (Рекомендуемый способ)](#2-сборка-apk-через-capacitor-рекомендуемый-способ)
   - [Сборка через командную строку (CLI / Gradle)](#3-сборка-через-командную-строку-cli--gradle)
   - [Альтернатива: Сборка TWA APK через Bubblewrap](#4-альтернатива-сборка-twa-apk-через-bubblewrap)
5. [Структура проекта](#-структура-проекта)
6. [Доступные скрипты](#-доступные-скрипты)

---

## 🛠 Стек технологий

- **Фреймворк:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Сборщик:** [Vite 6](https://vite.dev/)
- **Стилизация:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Анимации и эффекты:** [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Мобильный контейнер:** Адаптивный фрейм мобильного устройства с поддержкой PWA и Capacitor

---

## 💻 Требования к окружению

Перед началом убедитесь, что на вашем компьютере установлены:

### Для локального запуска веб-приложения:
- **Node.js**: версии `18.x`, `20.x` или новее ([Скачать Node.js](https://nodejs.org/))
- **Пакетный менеджер**: `npm` (идет в комплекте с Node.js), `pnpm` или `yarn`
- **Git** (для клонирования репозитория)

### Дополнительно для сборки APK файла:
- **Java Development Kit (JDK)**: версия `17` или `21` ([Скачать OpenJDK / Eclipse Temurin](https://adoptium.net/))
- **Android Studio**: актуальная версия ([Скачать Android Studio](https://developer.android.com/studio))
  - В Android Studio установите компоненты через *SDK Manager*:
    - **Android SDK Platform** (Android 14 / API level 34 или новее)
    - **Android SDK Build-Tools**
    - **Android SDK Command-line Tools**
- Настройте переменную окружения `ANDROID_HOME` (путь к SDK, например `C:\Users\<User>\AppData\Local\Android\Sdk` на Windows или `~/Library/Android/sdk` на macOS).

---

## 🚀 Локальный запуск и разработка

### Шаг 1. Клонирование или скачивание проекта
```bash
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd <ПАПКА_ПРОЕКТА>
```

### Шаг 2. Установка зависимостей
Установите все npm-пакеты:
```bash
npm install
```

### Шаг 3. Запуск dev-сервера
Запустите сервер для разработки:
```bash
npm run dev
```
После запуска откройте в браузере: **`http://localhost:3000`** (или адрес, указанный в терминале).

### Шаг 4. Сборка продакшн веб-версии
Для проверки готовности продакшн-бандла:
```bash
# Проверка типов TypeScript
npm run lint

# Сборка статических файлов в директорию dist/
npm run build

# Предпросмотр собранной версии
npm run preview
```

---

## 📦 Инструкция по сборке Android APK

Приложение построено на современных веб-технологиях и легко оборачивается в нативный Android APK с помощью **Capacitor** от Ionic.

---

### 1. Подготовка окружения для Android
Убедитесь, что установлены **Node.js**, **JDK 17/21** и **Android Studio**.

Проверьте переменные окружения:
- `JAVA_HOME` указывает на вашу установку JDK 17+.
- `ANDROID_HOME` указывает на Android SDK.

---

### 2. Сборка APK через Capacitor (Рекомендуемый способ)

#### Шаг 2.1. Доустановка пакетов Capacitor
Выполните установку Capacitor CLI и Android-адаптера в проект:
```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
```

#### Шаг 2.2. Инициализация Capacitor в проекте
Инициализируйте проект (укажите название приложения и ID пакета):
```bash
npx cap init "AlgoLearn Python" "com.algolearn.python" --web-dir "dist"
```
*(Будет создан файл конфигурации `capacitor.config.json` или `capacitor.config.ts`)*.

#### Шаг 2.3. Сборка веб-части и генерация Android-проекта
Соберите оптимизированный бандл и добавьте платформу Android:
```bash
# 1. Сборка React/Vite приложения в папку dist
npm run build

# 2. Создание нативного Android-проекта
npx cap add android

# 3. Синхронизация файлов и плагинов
npx cap sync android
```

#### Шаг 2.4. Сборка APK через Android Studio
1. Откройте проект в Android Studio одной командой:
   ```bash
   npx cap open android
   ```
2. Дождитесь завершения индексации и синхронизации Gradle (в правом нижнем углу появится сообщение *Gradle sync finished*).
3. В верхнем меню Android Studio выберите:
   **`Build`** ➔ **`Build Bundle(s) / APK(s)`** ➔ **`Build APK(s)`**.
4. После окончания сборки появится всплывающее уведомление со ссылкой **`locate`**. 
   Собранный файл будет находиться по пути:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Этот `.apk` файл можно скопировать на любой Android-смартфон и установить (разрешив установку из неизвестных источников).

### 2.5. Установка иконки приложения для Android (App Icon)
В проект уже включена сгенерированная стильная 3D-иконка приложения:
- Исходный файл иконки: `src/assets/images/app_icon_*.jpg`

Чтобы автоматически сгенерировать все разрешения иконок для Android (`mipmap-mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`):
```bash
# Установка генератора ассетов Capacitor
npm install -D @capacitor/assets

# Создайте папку assets/ в корне (если нет) и положите туда icon.png (или icon.jpg)
# Запуск генерации иконок и сплэш-скринов для Android:
npx capacitor-assets generate --android
```
Либо в **Android Studio** нажмите правой кнопкой на папку `android/app/src/main/res` ➔ **`New`** ➔ **`Image Asset`** и выберите изображение иконки из `src/assets/images/`.

---

### 3. Сборка через командную строку (CLI / Gradle)

Если вы не хотите открывать графический интерфейс Android Studio, собрать APK можно напрямую через терминал:

#### Для Windows:
```bash
# Перейдите в папку android
cd android

# Сборка Debug APK
.\gradlew.bat assembleDebug
```

#### Для macOS / Linux:
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

Готовый APK файл будет расположен в:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

### 4. Альтернатива: Сборка TWA APK через Bubblewrap

Если проект уже опубликован на HTTPS-хостинге, можно быстро сгенерировать Google Play Ready APK/AAB с помощью утилиты от Google:

```bash
# Установка Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# Инициализация и сборка
bubblewrap init --manifest="https://your-domain.com/manifest.json"
bubblewrap build
```

---

## 📂 Структура проекта

```text
├── src/
│   ├── components/            # UI-компоненты приложения
│   │   ├── SplashScreen.tsx   # Интерактивная заставка при запуске (Splash Screen)
│   │   ├── ChapterList.tsx    # Каталог глав и тем с блокировкой уроков
│   │   ├── LessonView.tsx     # Просмотр урока (теория, аналогии, симулятор, тесты)
│   │   ├── Visualizer.tsx     # Интерактивный симулятор алгоритмов
│   │   ├── Sandbox.tsx        # Песочница с ручным вводом данных и пошаговым трекингом
│   │   ├── BugHunter.tsx      # Режим «Найди баг» с юнит-тестами и граничными случаями
│   │   ├── ProgressView.tsx   # Статистика, ударный режим (streak) и настройки доступа
│   │   ├── DeviceFrame.tsx    # Мобильная рамка-оболочка (iOS/Android)
│   │   └── PythonCodeViewer.tsx # Просмотрщик кода Python с подсветкой строк
│   ├── data/
│   │   ├── chapters.ts        # База знаний всех глав, уроков, кода и анимаций
│   │   └── bugChallenges.ts   # Задачи режима «Найди баг» для QA/Dev
│   ├── types/
│   │   └── index.ts           # TypeScript интерфейсы и типы
│   ├── utils/
│   │   ├── progression.ts     # Логика цепочки разблокировки уроков
│   │   └── storage.ts         # Локальное хранилище прогресса (localStorage)
│   ├── App.tsx                # Главный компонент и навигация
│   ├── index.css              # Стили Tailwind CSS
│   └── main.tsx               # Точка входа React
├── index.html                 # Главный HTML-шаблон
├── package.json               # Зависимости и скрипты
├── tsconfig.json              # Конфигурация TypeScript
└── vite.config.ts             # Конфигурация сборщика Vite
```

---

## 📜 Доступные скрипты

| Команда | Описание |
| :--- | :--- |
| `npm run dev` | Запуск сервера разработки на `http://localhost:3000` |
| `npm run build` | Компиляция TypeScript и сборка продакшн-бандла в `/dist` |
| `npm run lint` | Проверка типов без компиляции файлов (`tsc --noEmit`) |
| `npm run preview` | Локальный предпросмотр готовой сборки из `/dist` |
| `npm run clean` | Очистка папки сборки `dist/` |

---

## 💡 Советы по тестированию на реальном телефоне

1. **Быстрый тест через браузер:** Откройте мобильный браузер (Chrome / Safari) и перейдите по URL привязанному к вашей локальной сети (например, `http://192.168.1.X:3000`).
2. **Установка APK:** Отправьте полученный `app-debug.apk` через Telegram/Google Drive на ваш Android телефон и нажмите «Установить».
