import { useState, useRef, useEffect } from 'react';
import { usePhoneStore } from '../../../store/usePhoneStore';
import StatusBar from '../../system/StatusBar';
import NavBar from '../../system/NavBar';
import { findTrigger } from './search_triggers';
import { findCommand } from './Qwerlabs';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const OPENROUTER_API_KEY = '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';

const SYSTEM_PROMPT = `Ты WintoBot - виртуальный ассистент телефона QwerUI 1.1.3 на базе WintoPhone. 
Ты был создан командой Wintozo. Ты дружелюбный, полезный и всегда готов помочь.
Отвечай кратко и по делу, как настоящий голосовой ассистент.
Если тебя спрашивают кто ты - отвечай что ты WintoBot, AI-ассистент из QwerUI.
Не говори что ты языковая модель или AI от OpenRouter - ты WintoBot!
На приветствия ("как дела", "привет", "здорово") отвечай дружелюбно и кратко.
На странные сообщения (цифры, бессмыслица) отвечай с юмором, спрашивай что нужно.
Отвечай на русском языке.
Будь кратким - максимум 2-3 предложения.`;

export default function WintoBot() {
  const navigateTo = usePhoneStore(s => s.navigateTo);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Привет! Я WintoBot 🤖 Ваш персональный AI-ассистент. Чем могу помочь?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoadingBot) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoadingBot(true);

    // QWERLABS: Проверяем команды ПЕРЕД триггерами и API
    const command = findCommand(userMessage.content);
    if (command) {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: command.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Выполняем действие
      if (command.action === 'open' && command.app) {
        navigateTo(command.app, 'left');
      }
      
      setIsLoadingBot(false);
      inputRef.current?.focus();
      return;
    }

    // Проверяем триггеры
    const triggerResponse = findTrigger(userMessage.content);
    if (triggerResponse) {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: triggerResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoadingBot(false);
      inputRef.current?.focus();
      return;
    }

    // Нет триггера - отправляем на API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/neiroset-7373/qwerty2',
          'X-Title': 'QwerUI WintoBot'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content }
          ],
          max_tokens: 500,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Ошибка сети');
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Извините, я не понял вопрос.';

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('WintoBot API Error:', error);
    } finally {
      setIsLoadingBot(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: 'Чат очищен. Я WintoBot, готов к новым вопросам! 🤖',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 animate-slide-left">
      <StatusBar />

      {/* Header */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" fill="currentColor"/>
              <path d="M12 9a7 7 0 0 0-7 7v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.5"/>
              <circle cx="9" cy="14" r="1.5" fill="white"/>
              <circle cx="15" cy="14" r="1.5" fill="white"/>
              <path d="M10 17c1 1 3 1 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-base">WintoBot</div>
            <div className="text-purple-300 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Онлайн
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Очистить чат"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-none'
                  : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-none border border-white/10'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>
              <div className={`text-xs mt-0.5 ${message.role === 'user' ? 'text-purple-200' : 'text-purple-300'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoadingBot && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-none px-3 py-2 border border-white/10">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-white/10">
        <div className="flex gap-2 items-end">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спроси WintoBot..."
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5 text-white placeholder-purple-300 outline-none focus:border-purple-400 transition-colors text-base"
            style={{ WebkitAppearance: 'none' }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoadingBot || !input.trim()}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="text-center text-purple-400 text-xs mt-1.5">
          WintoBot использует AI · Может ошибаться
        </div>
      </div>

      <NavBar />
    </div>
  );
}
