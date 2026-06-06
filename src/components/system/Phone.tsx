import { useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import Dialer from '../apps/Dialer';
import Contacts from '../apps/Contacts';
import Messages from '../apps/Messages';
import Settings from '../apps/Settings';
import ShoheStore from '../apps/ShoheStore';
import Calculator from '../apps/Calculator';
import Music from '../apps/Music';
import Notes from '../apps/Notes';
import SecurityForZapuskOrOOBE from './sequrity_for_zapusk_or_oobe';

export default function Phone() {
  const [phoneReady, setPhoneReady] = useState(false);
  const currentApp = usePhoneStore(s => s.currentApp);
  const navigateTo = usePhoneStore(s => s.navigateTo);
  const [startX, setStartX] = useState<number | null>(null);

  const handlePhoneReady = () => {
    setPhoneReady(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 60) {
      if (dx > 0 && currentApp !== 'lock') {
        navigateTo('home', 'right');
      }
    }
    setStartX(null);
  };

  if (!phoneReady) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="relative"
          style={{
            width: 375,
            height: 812,
          }}
        >
          <div
            className="absolute inset-0 rounded-[52px] shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f0f0f0 0%, #e8e8e8 40%, #d0d0d0 100%)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 2px 6px rgba(255,255,255,0.9) inset',
            }}
          >
            <div className="absolute inset-[10px] rounded-[44px] overflow-hidden bg-black z-10">
              <SecurityForZapuskOrOOBE onPhoneReady={handlePhoneReady} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div
        className="relative flex flex-col"
        style={{
          width: 340,
          height: 720,
        }}
      >
        {/* Phone outer frame */}
        <div
          className="absolute inset-0 rounded-[52px] shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #f0f0f0 0%, #e8e8e8 40%, #d0d0d0 100%)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 2px 6px rgba(255,255,255,0.9) inset',
          }}
        />

        {/* Side buttons - volume */}
        <div className="absolute left-0 top-28 -translate-x-full pr-1">
          <div className="w-1 h-8 rounded-l-sm bg-gradient-to-r from-slate-300 to-slate-400 mb-2 shadow-sm" />
          <div className="w-1 h-8 rounded-l-sm bg-gradient-to-r from-slate-300 to-slate-400 mb-2 shadow-sm" />
        </div>
        {/* Side button - silent */}
        <div className="absolute left-0 top-20 -translate-x-full pr-1">
          <div className="w-1 h-5 rounded-l-sm bg-gradient-to-r from-slate-300 to-slate-400 shadow-sm" />
        </div>

        {/* Power button */}
        <div className="absolute right-0 top-32 translate-x-full pl-1">
          <div className="w-1 h-12 rounded-r-sm bg-gradient-to-l from-slate-300 to-slate-400 shadow-sm" />
        </div>

        {/* Inner phone bezel */}
        <div
          className="absolute rounded-[48px] overflow-hidden"
          style={{
            inset: 6,
            background: '#fff',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12)',
          }}
        />

        {/* Screen area */}
        <div
          className="absolute overflow-hidden bg-white"
          style={{
            inset: 10,
            borderRadius: 44,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Front camera dot */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[100]"
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #2d2d2d, #0a0a0a)',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.2), inset 0 0 4px rgba(255,255,255,0.1)',
            }}
          />
          {/* Camera shine */}
          <div
            className="absolute top-4 left-1/2 z-[101] pointer-events-none"
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
              transform: 'translate(-3px, -3px)',
            }}
          />

          {/* App renderer */}
          <div className="relative w-full h-full overflow-hidden">
            {currentApp === 'lock' && <LockScreen key="lock" />}
            {currentApp === 'home' && <HomeScreen key="home" />}
            {currentApp === 'dialer' && <Dialer key="dialer" />}
            {currentApp === 'contacts' && <Contacts key="contacts" />}
            {currentApp === 'messages' && <Messages key="messages" />}
            {currentApp === 'settings' && <Settings key="settings" />}
            {currentApp === 'store' && <ShoheStore key="store" />}
            {currentApp === 'calculator' && <Calculator key="calculator" />}
            {currentApp === 'music' && <Music key="music" />}
            {currentApp === 'notes' && <Notes key="notes" />}
          </div>
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[200]"
          style={{
            width: 100,
            height: 4,
            borderRadius: 2,
            background: currentApp === 'lock' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)',
          }}
        />
      </div>

      {/* Phone label outside */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-white/50 text-xs font-medium tracking-widest" style={{ letterSpacing: 3 }}>QWERUI 1.1.3</div>
      </div>
    </div>
  );
}
