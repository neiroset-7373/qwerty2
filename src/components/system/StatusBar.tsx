import { useEffect, useState } from 'react';

export default function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className={`flex items-center justify-between px-4 pt-2 pb-1 z-50 relative ${dark ? 'text-white' : 'text-slate-800'}`} style={{ fontSize: 11, fontWeight: 600 }}>
      <span style={{ letterSpacing: 0.5 }}>{h}:{m}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex items-end gap-px h-3">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className={`w-0.5 rounded-sm ${i < 4 ? 'opacity-100' : 'opacity-30'} ${dark ? 'bg-white' : 'bg-slate-800'}`} style={{ height: `${(i + 2) * 2}px` }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="14" height="10" viewBox="0 0 24 18" fill="none" className={dark ? 'text-white' : 'text-slate-800'}>
          <path d="M12 14l2-2a2.83 2.83 0 00-4 0l2 2z" fill="currentColor"/>
          <path d="M12 9.5l4-4a5.66 5.66 0 00-8 0l4 4z" fill="currentColor" opacity="0.7"/>
          <path d="M12 4L18 -2a11.31 11.31 0 00-12 0L12 4z" fill="currentColor" opacity="0.4"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-px">
          <div className={`rounded-sm border ${dark ? 'border-white' : 'border-slate-800'}`} style={{ width: 20, height: 10 }}>
            <div className={`rounded-sm m-px ${dark ? 'bg-white' : 'bg-slate-800'}`} style={{ width: '75%', height: '100%' }} />
          </div>
          <div className={`rounded-r-sm ${dark ? 'bg-white' : 'bg-slate-800'}`} style={{ width: 2, height: 4 }} />
        </div>
      </div>
    </div>
  );
}
