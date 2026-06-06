import { useEffect } from 'react';

interface SetupScreenProps {
  onComplete: () => void;
}

export default function SetupScreen({ onComplete }: SetupScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <img
        src="/system_setup/WintoPhone_Setup.jpg"
        alt="Setup"
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
}
