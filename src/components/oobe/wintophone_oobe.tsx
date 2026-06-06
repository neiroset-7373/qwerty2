import { useState, useEffect } from 'react';
import OOBEPinCodeMaster from './OOBE_pincode_master';
import { IconStyle } from '../../types';

interface WintoPhoneOOBEProps {
  onComplete: (settings: { iconStyle: IconStyle; pinCode?: string }) => void;
}

type OOBEStep = 'welcome' | 'wifi' | 'pin' | 'icons' | 'complete';

export default function WintoPhoneOOBE({ onComplete }: WintoPhoneOOBEProps) {
  const [step, setStep] = useState<OOBEStep>('welcome');
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

  const handleWifiConnect = () => {
    setSettings(prev => ({ ...prev, wifiConnected: true }));
    setTimeout(() => setStep('pin'), 500);
  };

  const handlePinComplete = (pin: string) => {
    setSettings(prev => ({ ...prev, pinSet: true, pinCode: pin }));
    setTimeout(() => setStep('icons'), 500);
  };

  const handlePinSkip = () => {
    setTimeout(() => setStep('icons'), 500);
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
    <div className="absolute inset-0 overflow-hidden">
      {step === 'welcome' && <WelcomeScreen onNext={() => setStep('wifi')} />}
      {step === 'wifi' && <WiFiScreen connected={settings.wifiConnected} onConnect={handleWifiConnect} />}
      {step === 'pin' && (
        <OOBEPinCodeMaster onComplete={handlePinComplete} onSkip={handlePinSkip} />
      )}
      {step === 'icons' && <IconSelectionScreen selected={settings.iconStyle} onSelect={handleIconSelect} />}
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
    <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white p-8 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Logo */}
      <div className="mb-8 animate-float">
        <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>QwerUI</h1>
      <p className="text-2xl text-white/90 mb-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Версия 1.1.3</p>
      <p className="text-white/70 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Добро пожаловать</p>

      {/* Start button */}
      <button
        onClick={onNext}
        className="px-12 py-5 bg-white text-violet-600 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        Начать настройку
      </button>

      {/* Version info */}
      <div className="absolute bottom-8 text-white/50 text-sm animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        Android 17 · QwerUI 1.1.3
      </div>
    </div>
  );
}

// ============ WiFi Screen ============
function WiFiScreen({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* WiFi Icon */}
      <div className="mb-8">
        <div className={`w-32 h-32 rounded-full ${connected ? 'bg-green-500/20' : 'bg-slate-700/30'} flex items-center justify-center`}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className={connected ? 'text-green-400' : 'text-slate-400'}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-3 text-center">Wi-Fi</h2>
      <p className="text-slate-400 text-center mb-8">
        {connected ? 'Подключено к сети' : 'Подключитесь к сети Wi-Fi'}
      </p>

      {/* Connect button */}
      {!connected ? (
        <button
          onClick={onConnect}
          className="px-10 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Подключиться
        </button>
      ) : (
        <button
          onClick={() => onConnect()}
          className="px-10 py-4 bg-green-500 text-white rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Продолжить
        </button>
      )}

      {/* Network list (decorative) */}
      <div className="mt-8 w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-400">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white">Home Network</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-400 rounded" />
            <span className="text-green-400 text-xs">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Icon Selection Screen ============
function IconSelectionScreen({ selected, onSelect }: { selected: IconStyle; onSelect: (style: IconStyle) => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-2 text-center">Выберите стиль</h2>
      <p className="text-slate-400 text-center mb-8">Выберите дизайн иконок</p>

      {/* Options */}
      <div className="w-full max-w-md space-y-4">
        {/* Android Style */}
        <button
          onClick={() => onSelect('android')}
          className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 ${
            selected === 'android'
              ? 'border-violet-500 bg-gradient-to-r from-violet-500/20 to-purple-500/20'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">Android Style</div>
              <div className="text-slate-400 text-sm">Классический Android</div>
            </div>
          </div>

          {/* Preview icons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              '/apps_icons/system/Android Style/standart/dialer.jpg',
              '/apps_icons/system/Android Style/standart/messages.jpg',
              '/apps_icons/system/Android Style/standart/settings.jpeg',
              '/apps_icons/system/Android Style/standart/store.png'
            ].map((icon, i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-700 overflow-hidden">
                <img src={icon} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </button>

        {/* Wintozo Style */}
        <button
          onClick={() => onSelect('wintozo')}
          className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 ${
            selected === 'wintozo'
              ? 'border-violet-500 bg-gradient-to-r from-violet-500/20 to-purple-500/20'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">Wintozo Style</div>
              <div className="text-slate-400 text-sm">Уникальный дизайн</div>
            </div>
          </div>

          {/* Preview icons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              '/apps_icons/system/Wintozo Syle/standartnie/phone.jpg',
              '/apps_icons/system/Wintozo Syle/standartnie/messeges.png',
              '/apps_icons/system/Wintozo Syle/standartnie/settings.png',
              '/apps_icons/system/Wintozo Syle/standartnie/qwerty_Apps.png'
            ].map((icon, i) => (
              <div key={i} className="aspect-square rounded-xl bg-slate-700 overflow-hidden">
                <img src={icon} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
}