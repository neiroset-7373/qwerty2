import { useState, useEffect } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from './StatusBar';
import PinCodeWintozo from '../oobe/PinCode_wintozo';

export default function LockScreen() {
  const unlock = usePhoneStore(s => s.unlock);
  const pinCode = usePhoneStore(s => s.pinCode);
  const isLocked = usePhoneStore(s => s.isLocked);
  const [showPinScreen, setShowPinScreen] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [time, setTime] = useState(new Date());
  const [hint, setHint] = useState(false);

  // Если не заблокирован и нет PIN-кода - сразу показываем home
  if (!isLocked && !pinCode) {
    return null;
  }

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    setTimeout(() => setHint(true), 1200);
    return () => clearInterval(t);
  }, []);

  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];

  const dayStr = `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]}`;
  const timeStr = `${time.getHours().toString().padStart(2,'0')}:${time.getMinutes().toString().padStart(2,'0')}`;

  const handleSwipeUp = () => {
    if (pinCode) {
      setShowPinScreen(true);
    } else {
      unlock();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setDragY(0);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartY(e.clientY);
    setDragY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const dy = startY - e.touches[0].clientY;
    if (dy > 0) setDragY(dy);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (startY === null) return;
    const dy = startY - e.clientY;
    if (dy > 0) setDragY(dy);
  };

  const handleEnd = () => {
    if (dragY > 80) {
      handleSwipeUp();
    } else {
      setDragY(0);
    }
    setStartY(null);
  };

  const progress = Math.min(dragY / 120, 1);

  // Show PIN screen if user swiped up and PIN is set
  if (showPinScreen) {
    return (
      <PinCodeWintozo
        storedPin={pinCode}
        onUnlock={unlock}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col select-none cursor-grab active:cursor-grabbing overflow-hidden"
      style={{
        background: `linear-gradient(160deg, #667eea 0%, #764ba2 40%, #f093fb 100%)`,
        transform: `translateY(-${dragY * 0.4}px)`,
        transition: startY ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <StatusBar dark />

      {/* Top overlay on drag */}
      <div className="absolute inset-0 bg-white pointer-events-none" style={{ opacity: progress * 0.3 }} />

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="text-white/70 text-sm font-medium tracking-widest uppercase" style={{ letterSpacing: 3 }}>{dayStr}</div>
        <div className="text-white font-bold" style={{ fontSize: 76, lineHeight: 1, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>{timeStr}</div>
        <div className="mt-2 text-white/60 text-xs">Android 17 · QwerUI 1.1.3</div>
      </div>

      {/* Swipe indicator */}
      <div
        className="flex flex-col items-center pb-8 gap-3"
        style={{ opacity: hint ? 1 : 0, transition: 'opacity 0.5s' }}
      >
        <div className="flex flex-col items-center gap-1" style={{ opacity: 1 - progress }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white animate-bounce">
            <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white/70 text-xs font-medium tracking-wide">
            {pinCode ? 'Свайп для ввода PIN' : 'Свайп вверх для разблокировки'}
          </span>
        </div>
        {/* Progress arc */}
        {progress > 0 && (
          <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center" style={{ background: `conic-gradient(rgba(255,255,255,0.8) ${progress * 360}deg, transparent 0deg)` }}>
            <div className="w-8 h-8 rounded-full bg-purple-800/50" />
          </div>
        )}
      </div>
    </div>
  );
}
