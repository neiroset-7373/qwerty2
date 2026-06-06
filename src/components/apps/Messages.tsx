import { useState, useRef, useEffect } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

export default function Messages() {
  const { contacts, conversations, sendMessage } = usePhoneStore();
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const contact = contacts.find(c => c.id === activeContact);
  const convo = activeContact ? (conversations[activeContact] || { messages: [] }) : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !activeContact) return;
    sendMessage(activeContact, input.trim());
    setInput('');
  };

  if (activeContact && contact) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
        <StatusBar />
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100">
          <button className="app-btn p-1.5 rounded-xl hover:bg-slate-100" onClick={() => setActiveContact(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-500">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center shadow-sm`}>
            <span className="text-white font-bold">{contact.name[0]}</span>
          </div>
          <div>
            <div className="text-slate-800 font-semibold text-sm">{contact.name}</div>
            <div className="text-slate-400 text-xs">онлайн</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-2">
          {convo?.messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-300">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm">Начните диалог</div>
              </div>
            </div>
          )}
          {convo?.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm font-medium ${
                  msg.fromMe
                    ? 'bg-gradient-to-br from-violet-400 to-purple-500 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}
              >
                {msg.text}
                <div className={`text-xs mt-0.5 ${msg.fromMe ? 'text-purple-200' : 'text-slate-400'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-slate-100">
          <input
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-300"
            placeholder="Сообщение..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            className={`app-btn w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              input.trim() ? 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-md shadow-purple-200' : 'bg-slate-100'
            }`}
            onClick={handleSend}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={input.trim() ? 'text-white' : 'text-slate-400'}>
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <NavBar />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
      <StatusBar />
      <div className="px-4 pt-3 pb-2">
        <div className="text-2xl font-bold text-slate-800">Сообщения</div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-2 pb-4">
        {contacts.map(c => {
          const msgs = conversations[c.id]?.messages || [];
          const last = msgs[msgs.length - 1];
          return (
            <button
              key={c.id}
              className="app-btn w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
              onClick={() => setActiveContact(c.id)}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center shadow-sm flex-shrink-0 relative`}>
                <span className="text-white font-bold text-lg">{c.name[0]}</span>
                {msgs.length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 border-2 border-white notif-badge" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-slate-800 font-semibold text-sm">{c.name}</div>
                  {last && <div className="text-slate-400 text-xs">{last.time}</div>}
                </div>
                <div className="text-slate-400 text-xs truncate mt-0.5">
                  {last ? (last.fromMe ? `Вы: ${last.text}` : last.text) : 'Нет сообщений'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <NavBar />
    </div>
  );
}
