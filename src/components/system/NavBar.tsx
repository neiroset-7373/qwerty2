import { usePhoneStore } from '../../store/usePhoneStore';

export default function NavBar() {
  const { navigateTo, goBack } = usePhoneStore();

  return (
    <div className="flex items-center justify-around py-2 px-4 border-t border-slate-100 bg-white">
      {/* Back */}
      <button className="app-btn p-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Home */}
      <button className="app-btn p-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors" onClick={() => navigateTo('home', 'down')}>
        <div className="w-5 h-5 rounded-full border-2 border-slate-400" />
      </button>
      {/* Recent (goes home) */}
      <button className="app-btn p-2 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors" onClick={() => navigateTo('home', 'right')}>
        <div className="w-4 h-4 rounded-sm border-2 border-slate-400" />
      </button>
    </div>
  );
}
