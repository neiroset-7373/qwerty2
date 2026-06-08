import { useState, useRef, useEffect } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

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
Не говори что ты языковая модель или AI от OpenRouter - ты WintoBot!`;

export default function QwertyAI() {
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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
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
        })
      });

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
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Произошла ошибка подключения. Проверьте интернет и попробуйте снова. 📡',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
      <StatusBar dark />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3 3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" fill="currentColor"/>
              <path d="M12 9a7 7 0 0 0-7 7v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.5"/>
              <circle cx="9" cy="14" r="1.5" fill="white"/>
              <circle cx="15" cy="14" r="1.5" fill="white"/>
              <path d="M10 17c1 1 3 1 4 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-lg">WintoBot</div>
            <div className="text-purple-300 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Онлайн
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Очистить чат"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-none'
                  : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-none border border-white/10'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-purple-300'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-none px-4 py-3 border border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спроси WintoBot..."
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-purple-400 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="text-center text-purple-400 text-xs mt-2">
          WintoBot использует AI · Может ошибаться
        </div>
      </div>

      <NavBar />
    </div>
  );
}
