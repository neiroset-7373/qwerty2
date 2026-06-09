import { useRef, useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import { AppName, IconStyle } from '../types';
import StatusBar from './StatusBar';

const ICONS = {
  android: {
    dialer: '/apps_icons/system/Android Style/standart/dialer.jpg',
    messages: '/apps_icons/system/Android Style/standart/messages.jpg',
    settings: '/apps_icons/system/Android Style/standart/settings.jpeg',
    store: '/apps_icons/system/Android Style/standart/store.png',
    calculator: '/apps_icons/system/Android Style/iz_marketa/calculator.jpg',
    music: '/apps_icons/system/Android Style/iz_marketa/music.png',
    notes: '/apps_icons/system/Android Style/iz_marketa/zametki.png',
    contacts: '/apps_icons/system/Android Style/standart/dialer.jpg',
  },
  wintozo: {
    dialer: '/apps_icons/system/Wintozo Syle/standartnie/phone.jpg',
    messages: '/apps_icons/system/Wintozo Syle/standartnie/messeges.png',
    settings: '/apps_icons/system/Wintozo Syle/standartnie/settings.png',
    store: '/apps_icons/system/Wintozo Syle/standartnie/qwerty_Apps.png',
    calculator: '/apps_icons/system/Wintozo Syle/magazinskie/calculator.png',
    music: '/apps_icons/system/Wintozo Syle/magazinskie/music.png',
    notes: '/apps_icons/system/Wintozo Syle/magazinskie/zametki.png',
    contacts: '/apps_icons/system/Wintozo Syle/standartnie/phone.jpg',
  },
};

const getStoreAppIcon = (appId: string, iconStyle: IconStyle): string => {
  if (iconStyle === 'android') {
    return `/apps_icons/system/Android Style/iz_marketa/${appId === 'calculator' ? 'calculator.jpg' : appId === 'music' ? 'music.png' : appId === 'qwertyai' ? 'wintobot_logo.jpg' : 'zametki.png'}`;
  } else {
    return `/apps_icons/system/Wintozo Syle/magazinskie/${appId === 'qwertyai' ? 'wintobot_logo.jpg' : appId}.png`;
  }
};

// Обновляем имя приложения qwertyai на WintoBot

export default function HomeScreen() {
  const navigateTo = usePhoneStore(s => s.navigateTo);
  const lock = usePhoneStore(s => s.lock);
  const storeApps = usePhoneStore(s => s.storeApps);
  const iconStyle = usePhoneStore(s => s.iconStyle);
  const [startY, setStartY] = useState<number | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentIcons = iconStyle === 'android' ? ICONS.android : ICONS.wintozo;

  const SYSTEM_APPS: { id: AppName; label: string; gradient: string; color: string; icon: string }[] = [
    { id: 'dialer', label: 'Звонки', gradient: 'from-sky-400 to-blue-600', color: '#3b82f6', icon: currentIcons.dialer },
    { id: 'contacts', label: 'Контакты', gradient: 'from-violet-400 to-purple-600', color: '#8b5cf6', icon: currentIcons.contacts },
    { id: 'messages', label: 'Сообщения', gradient: 'from-rose-400 to-pink-600', color: '#f43f5e', icon: currentIcons.messages },
    { id: 'settings', label: 'Настройки', gradient: 'from-slate-400 to-gray-600', color: '#6b7280', icon: currentIcons.settings },
    { id: 'store', label: 'Qwerty Apps', gradient: 'from-teal-400 to-cyan-600', color: '#0ea5e9', icon: currentIcons.store },
  ];

  const installedStoreApps = storeApps.filter(a => a.installed).map(app => ({
    ...app,
    icon: getStoreAppIcon(app.id, iconStyle)
  }));

  const handleSwipeDown = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(y);
  };

  const handleSwipeMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startY === null) return;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    if (y - startY > 80) {
      lock();
      setStartY(null);
    }
  };

  const handleSwipeEnd = () => setStartY(null);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col bg-white"
      onTouchStart={handleSwipeDown}
      onTouchMove={handleSwipeMove as any}
      onTouchEnd={handleSwipeEnd}
      onMouseDown={handleSwipeDown as any}
      onMouseMove={handleSwipeMove as any}
      onMouseUp={handleSwipeEnd}
    >
      <StatusBar />

      {/* OS Label */}
      <div className="px-4 pt-1 pb-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-medium tracking-widest uppercase" style={{ letterSpacing: 2 }}>QwerUI 1.1.3</div>
          <div className="text-xs text-slate-300" style={{ fontSize: 10 }}>Android 17</div>
        </div>
        <div className="text-xs text-slate-300" style={{ fontSize: 10 }}>Свайп ↓ — блокировка</div>
      </div>

      {/* App Grid */}
      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide">
        {/* System apps */}
        <div className="mb-2">
          <div className="text-xs text-slate-300 font-semibold uppercase tracking-widest mb-2 px-1" style={{ fontSize: 9, letterSpacing: 2 }}>Система</div>
          <div className="grid grid-cols-4 gap-3">
            {SYSTEM_APPS.map(app => (
              <AppIcon
                key={app.id}
                gradient={app.gradient}
                label={app.label}
                icon={app.icon}
                pressed={pressed === app.id}
                onPress={() => {
                  setPressed(app.id);
                  setTimeout(() => { setPressed(null); navigateTo(app.id as AppName, 'left'); }, 120);
                }}
              />
            ))}
          </div>
        </div>

        {/* Installed store apps */}
        {installedStoreApps.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-slate-300 font-semibold uppercase tracking-widest mb-2 px-1" style={{ fontSize: 9, letterSpacing: 2 }}>Установлено</div>
            <div className="grid grid-cols-4 gap-3">
              {installedStoreApps.map(app => (
                <AppIcon
                  key={app.id}
                  gradient={app.gradient}
                  label={app.name}
                  icon={app.icon}
                  pressed={pressed === app.id}
                  onPress={() => {
                    setPressed(app.id);
                    setTimeout(() => {
                      setPressed(null);
                      navigateTo(app.id as AppName, 'left');
                    }, 120);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dock */}
      <div className="mx-4 mb-4 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-around py-3 px-2">
        {[
          { id: 'dialer', gradient: 'from-sky-400 to-blue-500', icon: currentIcons.dialer },
          { id: 'messages', gradient: 'from-rose-400 to-pink-500', icon: currentIcons.messages },
          { id: 'store', gradient: 'from-teal-400 to-cyan-500', icon: currentIcons.store },
          { id: 'settings', gradient: 'from-slate-400 to-gray-500', icon: currentIcons.settings },
        ].map(app => (
          <button
            key={app.id}
            className={`app-btn w-12 h-12 rounded-2xl bg-gradient-to-br ${app.gradient} shadow-md flex items-center justify-center overflow-hidden`}
            onClick={() => navigateTo(app.id as AppName, 'up')}
          >
            <img src={app.icon} alt={app.id} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AppIcon({ gradient, label, pressed, onPress, icon }: { gradient: string; label: string; pressed: boolean; onPress: () => void; icon: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        className={`app-btn w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-md ${pressed ? 'scale-90' : 'scale-100'} flex items-center justify-center overflow-hidden`}
        onClick={onPress}
        style={{ transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <img src={icon} alt={label} className="w-full h-full object-cover" />
      </button>
      <span className="text-slate-500 font-medium text-center leading-tight" style={{ fontSize: 9, maxWidth: 56 }}>{label}</span>
    </div>
  );
}
