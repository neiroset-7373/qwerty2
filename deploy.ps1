# QwerUI 1.1.3 - Автоматический деплой в GitHub
# Использование: .\deploy.ps1

Write-Host "🚀 QwerUI 1.1.3 - Деплой в GitHub" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Проверка git
try {
    $null = Get-Command git -ErrorAction Stop
} catch {
    Write-Host "❌ Git не установлен!" -ForegroundColor Red
    exit 1
}

# Переход в директорию скрипта
Set-Location $PSScriptRoot

# Проверка наличия файлов
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json не найден!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".github/workflows/android.yml")) {
    Write-Host "❌ GitHub Actions workflow не найден!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Все файлы на месте" -ForegroundColor Green
Write-Host ""

# Инициализация git если нужно
if (-not (Test-Path ".git")) {
    Write-Host "📦 Инициализация git..." -ForegroundColor Yellow
    git init
}

# Добавление файлов
Write-Host "📝 Добавление файлов..." -ForegroundColor Yellow
git add .

# Коммит
Write-Host "💾 Создание коммита..." -ForegroundColor Yellow
git commit -m "QwerUI 1.1.3 - Android build with GitHub Actions"

# Настройка remote
Write-Host "🔗 Настройка remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/neiroset-7373/qwerty2.git

# Определение ветки
$CURRENT_BRANCH = git branch --show-current
if ($CURRENT_BRANCH -ne "main") {
    Write-Host "🌿 Переименование ветки в main..." -ForegroundColor Yellow
    git branch -M main
}

# Push
Write-Host "📤 Отправка в GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ Деплой завершен!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Перейдите: https://github.com/neiroset-7373/qwerty2/actions"
Write-Host "   2. Дождитесь завершения сборки (~5-10 мин)"
Write-Host "   3. Скачайте APK из артефактов"
Write-Host ""
Write-Host "🏷️  Для создания релиза выполните:" -ForegroundColor Cyan
Write-Host "   git tag v1.1.3"
Write-Host "   git push origin v1.1.3"
Write-Host ""
