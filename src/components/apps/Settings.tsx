import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

const SETTINGS_ITEMS = [
  { label: 'Wi-Fi', sub: 'Подключено', color: 'from-sky-400 to-blue-500', icon: '📶', img: '/settings/QwerUI 2.0 Pack/vkladka wifi.jpg' },
  { label: 'Bluetooth', sub: 'Выключен', color: 'from-violet-400 to-purple-500', icon: '🔷' },
  { label: 'Звук', sub: 'Нормальный', color: 'from-rose-400 to-pink-500', icon: '🔊', img: '/settings/QwerUI 2.0 Pack/vkladka_zvyk.jpg' },
  { label: 'Экран', sub: 'Авто', color: 'from-amber-400 to-orange-500', icon: '☀️', img: '/settings/QwerUI 2.0 Pack/vkladka ekran.jpg' },
  { label: 'Аккумулятор', sub: '75%', color: 'from-teal-400 to-cyan-500', icon: '🔋', img: '/settings/QwerUI 2.0 Pack/vkaldka battery.jpg' },
  { label: 'Хранилище', sub: '12 ГБ свободно', color: 'from-indigo-400 to-violet-500', icon: '💾' },
  { label: 'Приложения', sub: '5 установлено', color: 'from-orange-400 to-red-500', icon: '📱', img: '/settings/QwerUI 2.0 Pack/vkladka apps.jpg' },
  { label: 'Безопасность', sub: 'Биометрия', color: 'from-emerald-400 to-teal-500', icon: '🔒', img: '/settings/QwerUI 2.0 Pack/vkladka_bezopasnost.jpg' },
  { label: 'О телефоне', sub: 'QwerUI 1.1.3 · Android 17', color: 'from-slate-400 to-gray-600', icon: 'ℹ️', img: '/logos_for_razine_temi/logo_dark_theme.png', darkImg: '/logos_for_razine_temi/logo_dark_theme.png' },
];

export default function Settings() {
  const lock = usePhoneStore(s => s.lock);
  const resetSettings = usePhoneStore(s => s.resetSettings);

  const handleReset = () => {
    if (confirm('Вы уверены? Все данные будут удалены и телефон перезагрузится.')) {
      resetSettings();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
      <StatusBar />
      <div className="px-4 pt-3 pb-2">
        <div className="text-2xl font-bold text-slate-800">Настройки</div>
      </div>

      {/* Profile card */}
      <div className="mx-4 mb-3 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-4 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 shadow-md flex items-center justify-center overflow-hidden">
          <img src="/apps_icons/system/Android Style/standart/settings.jpeg" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold text-slate-800">QwerUI</div>
          <div className="text-xs text-slate-500">QwerUI 1.1.3 — Android 17</div>
          <div className="text-xs text-violet-400 mt-0.5">Аккаунт QwerUI</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-1.5 pb-4">
        {SETTINGS_ITEMS.map((item, i) => (
          <button key={i} className="app-btn w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden`}>
              {item.img ? (
                <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
              ) : (
                <span style={{ fontSize: 16 }}>{item.icon}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-slate-800 font-semibold text-sm">{item.label}</div>
              <div className="text-slate-400 text-xs">{item.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-300">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}

        {/* Lock button */}
        <button
          className="app-btn w-full mt-3 py-3 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 text-rose-500 font-semibold text-sm hover:from-rose-100 hover:to-pink-100 transition-colors"
          onClick={lock}
        >
          Заблокировать экран
        </button>

        {/* Reset button */}
        <button
          className="app-btn w-full mt-3 py-3 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-colors shadow-lg"
          onClick={handleReset}
        >
          Сброс настроек
        </button>
      </div>

      <NavBar />
    </div>
  );
}
