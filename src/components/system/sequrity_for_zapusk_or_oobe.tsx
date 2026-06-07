import { useEffect, useState } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import SetupScreen from './SetupScreen';
import WintoPhoneOOBE from '../oobe/wintophone_oobe';
import { IconStyle } from '../../types';

interface SecurityForZapuskOrOOBEProps {
  onPhoneReady: () => void;
}

type PhoneStartupState = 'photo' | 'setup' | 'oobe' | 'ready';

export default function SecurityForZapuskOrOOBE({ onPhoneReady }: SecurityForZapuskOrOOBEProps) {
  const isOOBECompleted = usePhoneStore(s => s.isOOBECompleted);
  const [startupState, setStartupState] = useState<PhoneStartupState>('photo');
  const [isHydrated, setIsHydrated] = useState(false);

  // Сначала показываем фото 4 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // После фото проверяем состояние OOBE
  useEffect(() => {
    if (!isHydrated) return;
    
    if (isOOBECompleted) {
      // Уже настроен - сразу на рабочий стол
      setStartupState('ready');
      setTimeout(() => onPhoneReady(), 100);
    } else {
      // Не настроен - сначала setup, потом oobe, потом перезапуск
      setStartupState('setup');
    }
  }, [isHydrated, isOOBECompleted, onPhoneReady]);

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
    // Перезапуск: фото 4 секунды, потом готово
    setStartupState('photo');
    setTimeout(() => {
      setStartupState('ready');
      onPhoneReady();
    }, 4000);
  };

  if (startupState === 'photo') {
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

  if (startupState === 'setup') {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (startupState === 'oobe') {
    return <WintoPhoneOOBE onComplete={handleOOBEComplete} />;
  }

  // ready - показываем белый экран пока Phone не переключится
  return null;
}
