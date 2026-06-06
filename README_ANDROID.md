# QwerUI Android Build

Phone UI Simulation built with React, Vite, Tailwind CSS and Capacitor.

## Version
- **App Version:** 1.1.3
- **Package:** org.wintozo.qwerui
- **Android:** 8+ (API 26+)
- **Node.js:** 24
- **Java:** 21

## CI/CD

GitHub Actions автоматически собирает APK при каждом пуше в main/master ветку.

### Workflow
1. Установка Node.js 24
2. Установка Java 21
3. Установка зависимостей npm
4. Сборка Vite проекта
5. Синхронизация Capacitor
6. Сборка Android APK через Gradle
7. Загрузка APK в артефакты
8. Создание релиза (при наличии тега)

## Локальная сборка

```bash
# Установка зависимостей
npm install

# Сборка web части
npm run build

# Синхронизация Capacitor
npm run cap:sync

# Сборка APK
npm run android:build

# Открыть в Android Studio
npm run cap:open
```

## GitHub Actions

APK файл будет доступен в:
- **Артефакты:** Вкладка Actions → Build Android APK → app-debug
- **Релизы:** При создании тега в Releases

## Структура

```
wintophone/qwerui-2.0/
├── .github/workflows/
│   └── android.yml          # CI/CD workflow
├── src/                      # React исходники
├── android/                  # Android проект
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/org/wintozo/qwerui/MainActivity.java
│   │   │   └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   └── settings.gradle
├── capacitor.config.ts       # Capacitor конфигурация
└── package.json
```

## Разрешения

- INTERNET - доступ к интернету
- ACCESS_NETWORK_STATE - состояние сети
- READ_EXTERNAL_STORAGE - чтение файлов
- WRITE_EXTERNAL_STORAGE - запись файлов
- READ_MEDIA_AUDIO - доступ к аудио (Android 13+)

## Лицензия

QwerUI 1.1.3
