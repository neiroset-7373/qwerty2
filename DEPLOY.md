# Инструкция по развертыванию QwerUI Android

## Быстрый старт

### 1. Push в GitHub

```bash
cd wintophone/qwerui-2.0

# Инициализация git (если еще не инициализирован)
git init
git add .
git commit -m "Initial QwerUI 1.1.3 commit with Android support"

# Добавление remote (замените URL на ваш)
git remote add origin https://github.com/neiroset-7373/qwerty2.git

# Push в основную ветку
git branch -M main
git push -u origin main
```

### 2. Автоматическая сборка

После пуша GitHub Actions автоматически:
1. ✅ Установит Node.js 24
2. ✅ Установит Java 21
3. ✅ Соберет Vite проект
4. ✅ Синхронизирует Capacitor
5. ✅ Соберет Android APK
6. ✅ Загрузит APK в артефакты

### 3. Получение APK

**Вариант 1: Через GitHub Actions**
1. Перейдите на https://github.com/neiroset-7373/qwerty2/actions
2. Выберите последний запуск "Build Android APK"
3. В разделе "Artifacts" скачайте `app-debug`
4. Распакуйте ZIP и получите `app-debug.apk`

**Вариант 2: Через Releases (при наличии тега)**
```bash
# Создание тега для релиза
git tag v1.1.3
git push origin v1.1.3
```
APK появится в Releases: https://github.com/neiroset-7373/qwerty2/releases

## Требования на GitHub

### Переменные окружения (не обязательны для debug)

Для подписанных релизных сборок добавьте в GitHub Secrets:
- `KEYSTORE_PATH` - путь к keystore
- `KEYSTORE_PASSWORD` - пароль keystore
- `KEY_ALIAS` - алиас ключа
- `KEY_PASSWORD` - пароль ключа

### Разрешения workflow

Убедитесь что у Actions есть разрешения:
- Contents: read/write
- Actions: read/write

## Локальная тестовая сборка

```bash
# Установка зависимостей
npm install

# Сборка
npm run build
npx cap sync android

# Открыть в Android Studio
npx cap open android

# Или собрать APK локально
cd android
./gradlew assembleDebug
```

APK будет в: `android/app/build/outputs/apk/debug/app-debug.apk`

## Структура репозитория

```
qwerty2/
├── .github/workflows/
│   └── android.yml       # CI/CD для Android
├── src/                  # React код
├── android/              # Android проект
├── capacitor.config.ts   # Capacitor настройки
├── package.json
└── README_ANDROID.md     # Документация
```

## Характеристики приложения

- **Версия:** 1.1.3
- **Package:** org.wintozo.qwerui
- **Min SDK:** Android 8 (API 26)
- **Target SDK:** Android 14 (API 34)
- **Java:** 21
- **Node.js:** 24

## Разрешения

- 📱 INTERNET
- 📶 ACCESS_NETWORK_STATE
- 📁 READ/WRITE_EXTERNAL_STORAGE
- 🎵 READ_MEDIA_AUDIO

## Поддержка

При проблемах со сборкой:
1. Проверьте логи GitHub Actions
2. Убедитесь что все файлы на месте
3. Проверьте совместимость версий

---
**QwerUI 1.1.3** · Wintozo
