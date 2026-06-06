#!/bin/bash

# QwerUI 1.1.3 - Автоматический деплой в GitHub
# Использование: ./deploy.sh

echo "🚀 QwerUI 1.1.3 - Деплой в GitHub"
echo "=================================="
echo ""

# Проверка git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен!"
    exit 1
fi

# Переход в директорию проекта
cd "$(dirname "$0")"

# Проверка наличия файлов
if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден!"
    exit 1
fi

if [ ! -f ".github/workflows/android.yml" ]; then
    echo "❌ GitHub Actions workflow не найден!"
    exit 1
fi

echo "✅ Все файлы на месте"
echo ""

# Инициализация git если нужно
if [ ! -d ".git" ]; then
    echo "📦 Инициализация git..."
    git init
fi

# Добавление файлов
echo "📝 Добавление файлов..."
git add .

# Коммит
echo "💾 Создание коммита..."
git commit -m "QwerUI 1.1.3 - Android build with GitHub Actions"

# Настройка remote
echo "🔗 Настройка remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/neiroset-7373/qwerty2.git

# Определение ветки
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🌿 Переименование ветки в main..."
    git branch -M main
fi

# Push
echo "📤 Отправка в GitHub..."
git push -u origin main

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "📱 Следующие шаги:"
echo "   1. Перейдите: https://github.com/neiroset-7373/qwerty2/actions"
echo "   2. Дождитесь завершения сборки (~5-10 мин)"
echo "   3. Скачайте APK из артефактов"
echo ""
echo "🏷️  Для создания релиза выполните:"
echo "   git tag v1.1.3"
echo "   git push origin v1.1.3"
echo ""
