import { useEffect, useRef } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

const KEYS = ['1','2','3','4','5','6','7','8','9','*','0','#'];

export default function Dialer() {
  const { callerDialed, setDialed, activeCall, startCall, endCall, callDuration, incrementCall } = usePhoneStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeCall) {
      timerRef.current = setInterval(() => incrementCall(), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeCall]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2,'0');
    const sec = (s % 60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  };

  const handleKey = (k: string) => {
    if (callerDialed.length < 14) setDialed(callerDialed + k);
  };

  const handleDelete = () => setDialed(callerDialed.slice(0, -1));

  const handleCall = () => {
    if (callerDialed.length > 0 && !activeCall) {
      startCall(callerDialed);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
      <StatusBar />

      {/* Active call overlay */}
      {activeCall && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{activeCall[0]}</span>
          </div>
          <div className="text-slate-800 text-xl font-semibold">{activeCall}</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-slate-500 text-sm font-medium">{formatDuration(callDuration)}</span>
          </div>
          <div className="mt-8 flex gap-6">
            <button className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center" onClick={() => {}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-slate-600">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="w-16 h-16 rounded-full bg-rose-500 shadow-lg shadow-rose-200 flex items-center justify-center" onClick={endCall}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-white rotate-135">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {!activeCall && (
        <>
          {/* Display */}
          <div className="flex items-center justify-center gap-3 px-6 py-5 min-h-16">
            <span className="text-slate-800 font-light tracking-widest" style={{ fontSize: 28, letterSpacing: 4, fontVariantNumeric: 'tabular-nums' }}>
              {callerDialed || <span className="text-slate-300">Введите номер</span>}
            </span>
            {callerDialed && (
              <button className="app-btn p-2 rounded-full hover:bg-slate-100 transition-colors" onClick={handleDelete}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <line x1="18" y1="9" x2="13" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="13" y1="9" x2="18" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Keypad */}
          <div className="flex-1 px-8 grid grid-cols-3 gap-2 content-center">
            {KEYS.map(k => (
              <button
                key={k}
                className="app-btn h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-semibold text-xl transition-colors flex items-center justify-center shadow-sm"
                onClick={() => handleKey(k)}
                style={{ transition: 'all 0.1s cubic-bezier(0.34,1.56,0.64,1)' }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Call button */}
          <div className="flex justify-center py-5">
            <button
              className={`app-btn w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all
                ${callerDialed ? 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-200' : 'bg-slate-200'}`}
              onClick={handleCall}
              disabled={!callerDialed}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className={callerDialed ? 'text-white' : 'text-slate-400'}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </>
      )}

      <NavBar />
    </div>
  );
}
