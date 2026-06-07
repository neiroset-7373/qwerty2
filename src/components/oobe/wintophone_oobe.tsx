import { useState, useEffect } from 'react';
import OOBEPinCodeMaster from './OOBE_pincode_master';
import { IconStyle } from '../../types';

interface WintoPhoneOOBEProps {
  onComplete: (settings: { iconStyle: IconStyle; pinCode?: string }) => void;
}

type OOBEStep = 'loading' | 'welcome' | 'loading-wifi' | 'wifi' | 'loading-pin' | 'pin' | 'loading-update' | 'update' | 'loading-install' | 'install' | 'loading-icons' | 'icons' | 'complete';

export default function WintoPhoneOOBE({ onComplete }: WintoPhoneOOBEProps) {
  const [step, setStep] = useState<OOBEStep>('loading');
  const [settings, setSettings] = useState<{
    wifiConnected: boolean;
    pinSet: boolean;
    pinCode: string;
    iconStyle: IconStyle;
  }>({
    wifiConnected: false,
    pinSet: false,
    pinCode: '',
    iconStyle: 'android',
  });

  // Задержка 2 секунды перед каждым шагом
  const withLoading = (nextStep: OOBEStep, delay: number = 2000) => {
    setStep('loading');
    setTimeout(() => setStep(nextStep), delay);
  };

  // Инициализация - переход к приветствию
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNextToWelcome = () => {
    withLoading('loading-wifi');
  };

  const handleWifiConnect = () => {
    setSettings(prev => ({ ...prev, wifiConnected: true }));
    withLoading('loading-pin');
    setTimeout(() => setStep('pin'), 2000);
  };

  const handlePinComplete = (pin: string) => {
    setSettings(prev => ({ ...prev, pinSet: true, pinCode: pin }));
    withLoading('loading-update');
    setTimeout(() => setStep('update'), 2000);
  };

  const handlePinSkip = () => {
    withLoading('loading-update');
    setTimeout(() => setStep('update'), 2000);
  };

  const handleUpdateComplete = () => {
    withLoading('loading-install');
    setTimeout(() => setStep('install'), 2000);
  };

  const handleInstallComplete = () => {
    withLoading('loading-icons');
    setTimeout(() => setStep('icons'), 2000);
  };

  const handleIconSelect = (style: IconStyle) => {
    setSettings(prev => ({ ...prev, iconStyle: style }));
    setTimeout(() => {
      onComplete({ 
        iconStyle: style, 
        pinCode: settings.pinSet ? settings.pinCode : undefined 
      });
    }, 500);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {step === 'loading' && <LoadingScreen />}
      {step === 'welcome' && <WelcomeScreen onNext={() => withLoading('loading-wifi')} />}
      {step === 'loading-wifi' && <LoadingScreen />}
      {step === 'wifi' && <WiFiScreen connected={settings.wifiConnected} onConnect={handleWifiConnect} />}
      {step === 'loading-pin' && <LoadingScreen />}
      {step === 'pin' && (
        <OOBEPinCodeMaster onComplete={handlePinComplete} onSkip={handlePinSkip} />
      )}
      {step === 'loading-update' && <LoadingScreen />}
      {step === 'update' && <UpdateScreen onComplete={handleUpdateComplete} />}
      {step === 'loading-install' && <LoadingScreen />}
      {step === 'install' && <InstallScreen onComplete={handleInstallComplete} />}
      {step === 'loading-icons' && <LoadingScreen />}
      {step === 'icons' && <IconSelectionScreen selected={settings.iconStyle} onSelect={handleIconSelect} />}
    </div>
  );
}

// ============ Loading Screen ============
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

// ============ Update Screen ============
function UpdateScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Проверка обновлений...');

  useEffect(() => {
    const stages = [
      { p: 15, s: 'Проверка обновлений...' },
      { p: 35, s: 'Поиск доступных обновлений...' },
      { p: 60, s: 'Загрузка обновлений...' },
      { p: 85, s: 'Установка обновлений...' },
      { p: 100, s: 'Готово!' },
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].p);
        setStatus(stages[currentStage].s);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8">
      {/* Icon */}
      <div className="mb-10">
        <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-blue-500">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 text-center text-slate-800">Обновление</h2>
      <p className="text-slate-400 text-center mb-8">{status}</p>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-slate-400 text-sm mt-3">{progress}%</div>
      </div>
    </div>
  );
}

// ============ Install Screen ============
function InstallScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Установка приложений...');

  useEffect(() => {
    const stages = [
      { p: 10, s: 'Подготовка...' },
      { p: 30, s: 'Установка Калькулятора...' },
      { p: 50, s: 'Установка Музыки...' },
      { p: 70, s: 'Установка Заметок...' },
      { p: 90, s: 'Настройка системы...' },
      { p: 100, s: 'Готово!' },
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgress(stages[currentStage].p);
        setStatus(stages[currentStage].s);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8">
      {/* Icon */}
      <div className="mb-10">
        <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-blue-500">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 text-center text-slate-800">Установка</h2>
      <p className="text-slate-400 text-center mb-8">{status}</p>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-slate-400 text-sm mt-3">{progress}%</div>
      </div>

      {/* App icons preview */}
      <div className="mt-10 grid grid-cols-4 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M9 7h6M9 12h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ============ Welcome Screen ============
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white p-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Logo */}
      <div className="mb-10 animate-float">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold mb-3 text-center text-slate-800 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>QwerUI</h1>
      <p className="text-xl text-blue-500 font-semibold mb-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Версия 1.1.3</p>
      <p className="text-slate-400 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Добро пожаловать</p>

      {/* Start button */}
      <button
        onClick={onNext}
        className="px-14 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        Начать настройку
      </button>

      {/* Version info */}
      <div className="absolute bottom-8 text-slate-400 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        Android 17 · QwerUI 1.1.3
      </div>
    </div>
  );
}
function WiFiScreen({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white p-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* WiFi Icon */}
      <div className="mb-10">
        <div className={`w-28 h-28 rounded-full ${connected ? 'bg-green-100' : 'bg-blue-50'} flex items-center justify-center transition-colors duration-300`}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className={connected ? 'text-green-500' : 'text-blue-500'}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 text-center text-slate-800">Wi-Fi</h2>
      <p className="text-slate-400 text-center mb-10">
        {connected ? 'Подключено к сети' : 'Подключитесь к сети Wi-Fi'}
      </p>

      {/* Connect button */}
      {!connected ? (
        <button
          onClick={onConnect}
          className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Подключиться
        </button>
      ) : (
        <button
          onClick={() => onConnect()}
          className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Продолжить
        </button>
      )}

      {/* Network list (decorative) */}
      <div className="mt-10 w-full max-w-sm space-y-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-slate-700 font-medium">Home Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-500 rounded" />
            <span className="text-green-500 text-xs font-medium">Отлично</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Icon Selection Screen ============
function IconSelectionScreen({ selected, onSelect }: { selected: IconStyle; onSelect: (style: IconStyle) => void }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white p-8 transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Title */}
      <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Выберите стиль</h2>
      <p className="text-slate-400 text-center mb-10">Выберите дизайн иконок</p>

      {/* Options */}
      <div className="w-full max-w-md space-y-4">
        {/* Android Style */}
        <button
          onClick={() => onSelect('android')}
          className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 ${
            selected === 'android'
              ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
              : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-slate-800">Android Style</div>
              <div className="text-slate-400 text-sm">Классический Android</div>
            </div>
            {selected === 'android' && (
              <div className="ml-auto">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Preview icons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              '/apps_icons/system/Android Style/standart/dialer.jpg',
              '/apps_icons/system/Android Style/standart/messages.jpg',
              '/apps_icons/system/Android Style/standart/settings.jpeg',
              '/apps_icons/system/Android Style/standart/store.png'
            ].map((icon, i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src={icon} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </button>

        {/* Wintozo Style */}
        <button
          onClick={() => onSelect('wintozo')}
          className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 ${
            selected === 'wintozo'
              ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
              : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-slate-800">Wintozo Style</div>
              <div className="text-slate-400 text-sm">Уникальный дизайн</div>
            </div>
            {selected === 'wintozo' && (
              <div className="ml-auto">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Preview icons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              '/apps_icons/system/Wintozo Syle/standartnie/phone.jpg',
              '/apps_icons/system/Wintozo Syle/standartnie/messeges.png',
              '/apps_icons/system/Wintozo Syle/standartnie/settings.png',
              '/apps_icons/system/Wintozo Syle/standartnie/qwerty_Apps.png'
            ].map((icon, i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img src={icon} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}