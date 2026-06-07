import { useState } from 'react';

interface OOBEPinCodeMasterProps {
  onComplete: (pin: string) => void;
  onSkip?: () => void;
}

export default function OOBEPinCodeMaster({ onComplete, onSkip }: OOBEPinCodeMasterProps) {
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleDigit = (digit: string) => {
    setError('');
    if (step === 'enter') {
      if (pin.length < 4) setPin(prev => prev + digit);
    } else {
      if (confirmPin.length < 4) setConfirmPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    if (step === 'enter') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (step === 'enter' && pin.length === 4) {
      setStep('confirm');
    } else if (step === 'confirm' && confirmPin.length === 4) {
      if (pin === confirmPin) {
        onComplete(pin);
      } else {
        setError('PIN-коды не совпадают');
        setPin('');
        setConfirmPin('');
        setStep('enter');
      }
    }
  };

  const currentPin = step === 'enter' ? pin : confirmPin;

  return (
    <div className="absolute inset-0 flex flex-col bg-white">
      {/* Header */}
      <div className="pt-12 pb-6 px-8 text-center">
        <div className="text-2xl font-bold mb-2 text-slate-800">
          {step === 'enter' ? 'Придумайте PIN-код' : 'Подтвердите PIN-код'}
        </div>
        <div className="text-slate-400 text-sm">
          {step === 'enter' ? 'Введите 4 цифры для разблокировки' : 'Повторите ваш PIN-код'}
        </div>
      </div>

      {/* PIN Dots */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              i < currentPin.length
                ? 'bg-blue-500 border-blue-500 scale-110'
                : 'border-slate-300 bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-center text-red-500 text-sm mb-4 animate-pulse">
          {error}
        </div>
      )}

      {/* Numpad */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
            <button
              key={digit}
              className="w-20 h-20 rounded-full bg-slate-50 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 text-2xl font-semibold text-slate-700 border border-slate-200"
              onClick={() => handleDigit(digit.toString())}
            >
              {digit}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <button
            className="w-20 h-20 rounded-full flex items-center justify-center"
            onClick={onSkip}
          >
            <span className="text-slate-400 text-sm font-medium">Пропустить</span>
          </button>
          <button
            className="w-20 h-20 rounded-full bg-slate-50 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 text-2xl font-semibold text-slate-700 border border-slate-200"
            onClick={() => handleDigit('0')}
          >
            0
          </button>
          <button
            className="w-20 h-20 rounded-full flex items-center justify-center"
            onClick={handleBackspace}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-slate-400">
              <path d="M20 5H9L2 12l7 7h11a2 2 0 002-2V7a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 9l-6 6M12 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Continue button */}
      <div className="px-8 pb-8">
        <button
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            currentPin.length === 4
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          onClick={handleContinue}
          disabled={currentPin.length !== 4}
        >
          {step === 'enter' ? 'Продолжить' : 'Готово'}
        </button>
      </div>
    </div>
  );
}
