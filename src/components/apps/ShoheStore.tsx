import { useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

export default function ShoheStore() {
  const { storeApps, installApp, navigateTo } = usePhoneStore();
  const [installing, setInstalling] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const iconStyle = usePhoneStore(s => s.iconStyle);

  const appIcons = iconStyle === 'android' 
    ? { 
        calculator: '/apps_icons/system/Android Style/iz_marketa/calculator.jpg', 
        music: '/apps_icons/system/Android Style/iz_marketa/music.png', 
        notes: '/apps_icons/system/Android Style/iz_marketa/zametki.png',
        qwertyai: '/apps_icons/system/Android Style/iz_marketa/wintobot_logo.jpg'
      }
    : { 
        calculator: '/apps_icons/system/Wintozo Syle/magazinskie/calculator.png', 
        music: '/apps_icons/system/Wintozo Syle/magazinskie/music.png', 
        notes: '/apps_icons/system/Wintozo Syle/magazinskie/zametki.png',
        qwertyai: '/apps_icons/system/Wintozo Syle/magazinskie/wintobot_logo.jpg'
      };

  const handleInstall = (appId: string) => {
    if (installing || done.has(appId)) return;
    setInstalling(appId);
    setTimeout(() => {
      installApp(appId);
      setDone(prev => new Set([...prev, appId]));
      setInstalling(null);
    }, 2000);
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
      <StatusBar />

      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <div className="text-2xl font-bold text-slate-800">Qwerty Apps</div>
        <div className="text-xs text-slate-400 mt-0.5">Android 17 · Официальный магазин</div>
      </div>

      {/* Banner */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden h-28 bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 flex items-center px-5 relative">
        <div>
          <div className="text-white font-bold text-lg">Qwerty Apps</div>
          <div className="text-white/80 text-xs mt-0.5">Лучшие приложения для QwerUI</div>
        </div>
        <div className="absolute right-4 opacity-20">
          <div className="w-20 h-20 rounded-full border-4 border-white" />
        </div>
        <div className="absolute right-8 bottom-2 opacity-10">
          <div className="w-12 h-12 rounded-full border-4 border-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4">
        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3" style={{ fontSize: 9, letterSpacing: 2 }}>
          Доступные приложения
        </div>

        <div className="space-y-3">
          {storeApps.map(app => {
            const isInstalling = installing === app.id;
            const isInstalled = app.installed;
            return (
              <div key={app.id} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                {/* App icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} shadow-md flex-shrink-0 shadow-slate-200 flex items-center justify-center overflow-hidden`}>
                  <img src={app.id === 'calculator' ? appIcons.calculator : app.id === 'music' ? appIcons.music : appIcons.notes} alt={app.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 font-bold text-sm">{app.name}</div>
                  <div className="text-slate-400 text-xs">{app.category} · {app.size}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-sm ${i < Math.floor(app.rating) ? 'bg-amber-400' : 'bg-slate-200'}`} />
                    ))}
                    <span className="text-slate-400 text-xs ml-1">{app.rating}</span>
                  </div>
                </div>

                {/* Install button */}
                <button
                  className={`app-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isInstalled
                      ? 'bg-slate-100 text-slate-400'
                      : isInstalling
                      ? 'bg-teal-100 text-teal-500'
                      : 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-md shadow-teal-100'
                  }`}
                  onClick={() => handleInstall(app.id)}
                  disabled={isInstalled || !!isInstalling}
                >
                  {isInstalled ? 'Открыть' : isInstalling ? '...' : 'Установить'}
                </button>
              </div>
            );
          })}
        </div>

        {installing && (
          <div className="mt-4 p-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
            <span className="text-teal-600 text-xs font-medium">Установка...</span>
          </div>
        )}

        {storeApps.filter(a => a.installed).length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2" style={{ fontSize: 9, letterSpacing: 2 }}>
              Установлено
            </div>
            <button
              className="app-btn w-full py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold text-sm shadow-md shadow-teal-100"
              onClick={() => navigateTo('home', 'right')}
            >
              Перейти на рабочий стол
            </button>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
}
