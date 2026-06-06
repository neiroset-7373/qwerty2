import { useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

export default function Contacts() {
  const { contacts, navigateTo, startCall } = usePhoneStore();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedContact = contacts.find(c => c.id === selected);

  if (selectedContact) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
        <StatusBar />
        <div className="flex-1 flex flex-col items-center pt-8 px-6 gap-5">
          {/* Avatar */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedContact.color} shadow-lg flex items-center justify-center`}>
            <span className="text-white text-4xl font-bold">{selectedContact.name[0]}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{selectedContact.name}</div>
            <div className="text-slate-400 text-sm mt-1">{selectedContact.phone}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-6 mt-2">
            <ActionBtn color="from-sky-400 to-blue-500" icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            } label="Позвонить" onClick={() => { startCall(selectedContact.name); navigateTo('dialer', 'left'); }} />
            <ActionBtn color="from-rose-400 to-pink-500" icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            } label="Сообщение" onClick={() => { navigateTo('messages', 'left'); }} />
          </div>

          <div className="w-full mt-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="text-xs text-slate-400 uppercase tracking-widest" style={{ fontSize: 9 }}>Мобильный</div>
              <div className="text-slate-700 font-medium mt-0.5">{selectedContact.phone}</div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-4">
          <button className="app-btn w-full py-3 rounded-2xl bg-rose-50 text-rose-500 font-medium text-sm hover:bg-rose-100 transition-colors" onClick={() => setSelected(null)}>
            Назад к контактам
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
        <div className="text-2xl font-bold text-slate-800">Контакты</div>
        <div className="mt-2 flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-400">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-slate-400 text-sm">Поиск</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 space-y-2">
        {contacts.map(c => (
          <button
            key={c.id}
            className="app-btn w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            onClick={() => setSelected(c.id)}
          >
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
              <span className="text-white font-bold text-lg">{c.name[0]}</span>
            </div>
            <div>
              <div className="text-slate-800 font-semibold text-sm">{c.name}</div>
              <div className="text-slate-400 text-xs">{c.phone}</div>
            </div>
          </button>
        ))}
      </div>

      <NavBar />
    </div>
  );
}

function ActionBtn({ color, icon, label, onClick }: { color: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button className={`app-btn w-14 h-14 rounded-2xl bg-gradient-to-br ${color} shadow-md flex items-center justify-center`} onClick={onClick}>
        {icon}
      </button>
      <span className="text-xs text-slate-500 font-medium">{label}</span>
    </div>
  );
}
