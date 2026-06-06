import { useState, useEffect } from 'react';

interface PinCodeWintozoProps {
  storedPin: string;
  onUnlock: () => void;
  onError?: () => void;
}

export default function PinCodeWintozo({ storedPin, onUnlock, onError }: PinCodeWintozoProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === storedPin) {
            onUnlock();
          } else {
            setError(true);
            setShake(true);
            setTimeout(() => {
              setShake(false);
              setError(false);
              setPin('');
            }, 500);
            onError?.();
          }
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  // Reset error when user starts typing again
  useEffect(() => {
    if (pin.length > 0 && pin.length < 4) {
      setError(false);
    }
  }, [pin]);

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white backdrop-blur-xl">
      {/* Header */}
      <div className="pt-12 pb-6 px-8 text-center">
        <div className="text-xl font-bold mb-2">Введите PIN-код</div>
        <div className="text-slate-400 text-sm">Для разблокировки устройства</div>
      </div>

      {/* PIN Dots */}
      <div className={`flex items-center justify-center gap-4 mb-8 transition-all duration-300 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              i < pin.length
                ? error
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white border-white scale-110'
                : error
                ? 'border-red-500/50 bg-transparent'
                : 'border-slate-500 bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center text-red-400 text-sm mb-4 animate-pulse">
          Неверный PIN-код
        </div>
      )}

      {/* Numpad */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button
              key={digit}
              className="w-20 h-20 rounded-full bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-600/50 transition-all duration-200 text-2xl font-semibold backdrop-blur-sm border border-slate-700/30 active:scale-95"
              onClick={() => handleDigit(digit.toString())}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm font-medium">SOS</span>
          </div>
          <button
            className="w-20 h-20 rounded-full bg-slate-800/50 hover:bg-slate-700/50 active:bg-slate-600/50 transition-all duration-200 text-2xl font-semibold backdrop-blur-sm border border-slate-700/30 active:scale-95"
            onClick={() => handleDigit('0')}
          >
            0
          </button>
          <button
            className="w-20 h-20 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleBackspace}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-slate-400">
              <path d="M20 5H9L2 12l7 7h11a2 2 0 002-2V7a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 9l-6 6M12 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
    </div>
  );
}
