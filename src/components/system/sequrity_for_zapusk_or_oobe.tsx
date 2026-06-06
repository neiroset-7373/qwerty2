import { useEffect, useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import SetupScreen from './SetupScreen';
import WintoPhoneOOBE from '../oobe/wintophone_oobe';
import { IconStyle } from '../../types';

interface SecurityForZapuskOrOOBEProps {
  onPhoneReady: () => void;
}

type PhoneStartupState = 'setup' | 'oobe' | 'restart' | 'ready';

export default function SecurityForZapuskOrOOBE({ onPhoneReady }: SecurityForZapuskOrOOBEProps) {
  const isOOBECompleted = usePhoneStore(s => s.isOOBECompleted);
  const [startupState, setStartupState] = useState<PhoneStartupState>('setup');

  useEffect(() => {
    if (isOOBECompleted) {
      // Уже настроен - сразу на рабочий стол
      setStartupState('ready');
      setTimeout(() => onPhoneReady(), 100);
    } else {
      // Не настроен - сначала setup, потом oobe, потом перезапуск
      setStartupState('setup');
    }
  }, [isOOBECompleted, onPhoneReady]);

  const handleSetupComplete = () => {
    setStartupState('oobe');
  };

  const handleOOBEComplete = (settings: { iconStyle: IconStyle; pinCode?: string }) => {
    // Сохраняем настройки
    const { completeOOBE, setPinCode, navigateTo } = usePhoneStore.getState();
    completeOOBE(settings.iconStyle);
    if (settings.pinCode) {
      setPinCode(settings.pinCode);
      // Если установлен PIN - показываем экран блокировки
      navigateTo('lock', 'fade');
    } else {
      // Если нет PIN - сразу на home
      navigateTo('home', 'fade');
    }
    // Показываем экран перезапуска (чёрный экран с фото)
    setStartupState('restart');
  };

  const handleRestartComplete = () => {
    // Перезапуск завершён - запускаем систему на экран блокировки
    const { navigateTo } = usePhoneStore.getState();
    navigateTo('lock', 'fade');
    setStartupState('ready');
    setTimeout(() => onPhoneReady(), 100);
  };

  if (startupState === 'setup') {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (startupState === 'oobe') {
    return <WintoPhoneOOBE onComplete={handleOOBEComplete} />;
  }

  if (startupState === 'restart') {
    return <RestartScreen onRestartComplete={handleRestartComplete} />;
  }

  return null; // ready - переходим на рабочий стол
}

function RestartScreen({ onRestartComplete }: { onRestartComplete: () => void }) {
  useEffect(() => {
    // Симулируем перезапуск: чёрный экран с фото запуска, затем система
    const timer = setTimeout(onRestartComplete, 4000);
    return () => clearTimeout(timer);
  }, [onRestartComplete]);

  return (
    <div className="absolute inset-0 bg-black">
      <img
        src="/system_setup/WintoPhone_Setup.jpg"
        alt="WintoPhone"
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
}