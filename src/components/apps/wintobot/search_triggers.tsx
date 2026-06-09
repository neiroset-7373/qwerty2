// Триггеры и их полные ответы
export interface Trigger {
  keywords: string[];
  response: string;
}

export const TRIGGERS: Trigger[] = [
  {
    keywords: ['QwerUI', 'КверУИ', 'История QwerUI', 'что такое QwerUI', 'QwerUI это', 'интерфейс QwerUI'],
    response: `QwerUI — это фирменный пользовательский интерфейс и один из ключевых проектов Wintozo Corporation (ранее Qwerty Corp). Полная хронология проекта:

📱 Запуски и ранние этапы:
Проект развивался как оболочка и визуальный стиль для операционных систем компании (таких как QwertyOS). Разработка шла параллельно с другими крупными проектами корпорации.

❄️ Заморозка:
В начале 2026 года на фоне внутренних перестановок, смены названия компании на Wintozo Corporation и фокуса на релизе Spidi Clicker, активная разработка интерфейса была временно приостановлена.

🔄 Возрождение (15 мая 2026 года):
После закрытия Spidi Clicker, Wintozo Corporation официально вернулась к проекту и продолжила существование QwerUI.

✅ Текущий статус:
На данный момент проект активно поддерживается и развивается. Актуальной и стабильной версией является 1.1.3.`
  },
  {
    keywords: ['Wintozo Messenger', 'Винтозо Мессенджер', 'Мессенджер', 'wintozo messenger', 'мессенджер'],
    response: `Wintozo Messenger — проект мессенджера в стиле Frutiger Aero, задуманный ещё в июле 2025 года. Работа над проектом была возобновлена 21 марта 2026 года. После выхода версии 1.0 возникли критические проблемы с серверами, поэтому версия 1.1 выпущена не была.`
  },
  {
    keywords: ['Wintozo', 'Винтозо', 'Qwerty Corp', 'wintozo', 'qwerty corp', 'компания wintozo'],
    response: `Wintozo Corporation (ранее Qwerty Corp) — разработчик кроссплатформенных проектов, таких как Spidi Clicker (закрыт на v3.1), QwerUI (актуальная v1.1.3), SpidiOS (версия 2.0 от Wintozo), Wintozo Мессенджер и Winto Bot.`
  },
  {
    keywords: ['Spidi Clicker', 'Спиди Кликер', 'spidi clicker', 'кликер', 'игра спиди'],
    response: `Spidi Clicker — это игра-кликер, основанная на React от Wintozo Corporation, разработанная для работы на телефонах и компьютерах. Официальный релиз состоялся 8 апреля 2026 года в знак примирения между Wintozo Corporation и Spidi. Проект официально закрылся 12 мая 2026 года, его финальной версией стала версия 3.1.

👥 Разделение ролей в проекте:
• Wintozo Corporation: Авторы идеи, разработчики и полные управляющие программным кодом.
• Spidi: Главный герой игры, ответственный за медиа-контент (иконки и музыкальное сопровождение).`
  },
  {
    keywords: ['SpidiOS', 'СпидиОС', 'spidos', 'спидиос', 'Spidi Phone'],
    response: `SpidiOS — это проект симулятора телефона «Spidi Phone», прошедший через несколько этапов разработки:

🔹 Начало (Январь 2026 года):
В Qwerty Corp велась активная работа над первыми бета-версиями проекта (1.1 Beta 1, 2 и 3). Из-за внезапной ссоры между Qwerty Corp и Spidi официальный релиз от компании так и не состоялся.

🔹 Переход к Spidi (Февраль 2026 года):
Проект временно перешел в руки самого Spidi. Он выпустил его официально, но в сильно упрощенном формате — в виде одного HTML-файла. На тот момент этот релиз не имел отношения к Wintozo.

🔹 Возвращение к Wintozo Corporation:
Позже проект снова вернулся в собственность Wintozo Corporation. Разработка была продолжена силами компании, однако за всё время возобновления проекта вышла только одна единственная версия — версия 2.0.`
  }
];

export function findTrigger(message: string): string | null {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const trigger of TRIGGERS) {
    for (const keyword of trigger.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      // Проверка на полное совпадение или вхождение
      if (lowerMessage === lowerKeyword || lowerMessage.includes(lowerKeyword)) {
        return trigger.response;
      }
    }
  }
  
  return null;
}
