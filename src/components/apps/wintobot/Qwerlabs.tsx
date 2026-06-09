import { AppName } from '../../../types';

export interface Command {
  keywords: string[];
  action: 'open' | 'close' | 'info';
  app: AppName | null;
  response: string;
}

export const COMMANDS: Command[] = [
  // Калькулятор
  {
    keywords: ['открой калькулятор', 'запусти калькулятор', 'открой калькулятор', 'калькулятор', 'calculator'],
    action: 'open',
    app: 'calculator',
    response: 'Открываю Калькулятор 🧮'
  },
  // Музыка
  {
    keywords: ['открой музыку', 'запусти музыку', 'открой музыку', 'музыка', 'music'],
    action: 'open',
    app: 'music',
    response: 'Открываю Музыку 🎵'
  },
  // Заметки
  {
    keywords: ['открой заметки', 'запусти заметки', 'открой заметки', 'заметки', 'notes', 'заметка'],
    action: 'open',
    app: 'notes',
    response: 'Открываю Заметки 📝'
  },
  // Звонки
  {
    keywords: ['открой звонки', 'запусти звонки', 'открой звонки', 'звонки', 'dialer', 'телефон'],
    action: 'open',
    app: 'dialer',
    response: 'Открываю Звонки 📞'
  },
  // Сообщения
  {
    keywords: ['открой сообщения', 'запусти сообщения', 'открой сообщения', 'сообщения', 'messages', 'чат'],
    action: 'open',
    app: 'messages',
    response: 'Открываю Сообщения 💬'
  },
  // Контакты
  {
    keywords: ['открой контакты', 'запусти контакты', 'открой контакты', 'контакты', 'contacts'],
    action: 'open',
    app: 'contacts',
    response: 'Открываю Контакты 👥'
  },
  // Настройки
  {
    keywords: ['открой настройки', 'запусти настройки', 'открой настройки', 'настройки', 'settings'],
    action: 'open',
    app: 'settings',
    response: 'Открываю Настройки ⚙️'
  },
  // Магазин
  {
    keywords: ['открой магазин', 'запусти магазин', 'открой магазин', 'магазин', 'store', 'qwerty apps'],
    action: 'open',
    app: 'store',
    response: 'Открываю Qwerty Apps 🛒'
  },
  // WintoBot
  {
    keywords: ['открой винтобот', 'запусти винтобот', 'открой винтобот', 'wintobot', 'винтобот'],
    action: 'info',
    app: null,
    response: 'Я уже здесь! Чем могу помочь? 🤖'
  }
];

export function findCommand(message: string): { action: Command['action']; app: AppName | null; response: string } | null {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const command of COMMANDS) {
    for (const keyword of command.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      if (lowerMessage.includes(lowerKeyword)) {
        return {
          action: command.action,
          app: command.app,
          response: command.response
        };
      }
    }
  }
  
  return null;
}
