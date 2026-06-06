# Быстрый деплой QwerUI в GitHub

## Команды для пуша

```bash
cd wintophone/qwerui-2.0

# 1. Инициализация (если первый раз)
git init
git add .
git commit -m "QwerUI 1.1.3 - Android build with Capacitor"

# 2. Добавление remote
git remote add origin https://github.com/neiroset-7373/qwerty2.git

# 3. Push в main
git branch -M main
git push -u origin main

# 4. Создание тега для релиза (опционально)
git tag v1.1.3
git push origin v1.1.3
```

## После пуша

1. Перейдите на https://github.com/neiroset-7373/qwerty2/actions
2. Дождитесь завершения "Build Android APK" (~5-10 минут)
3. Скачайте APK из артефактов

## Ссылки

- **Репозиторий:** https://github.com/neiroset-7373/qwerty2
- **Actions:** https://github.com/neiroset-7373/qwerty2/actions
- **Releases:** https://github.com/neiroset-7373/qwerty2/releases

---
**QwerUI 1.1.3** · org.wintozo.qwerui
