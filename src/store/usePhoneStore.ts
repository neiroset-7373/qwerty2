import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppName, Contact, Conversation, StoreApp, IconStyle } from '../types';

interface PhoneStore {
  currentApp: AppName;
  previousApp: AppName;
  isLocked: boolean;
  animDirection: 'left' | 'right' | 'up' | 'down' | 'fade';
  contacts: Contact[];
  conversations: Record<string, Conversation>;
  installedApps: string[];
  storeApps: StoreApp[];
  activeCall: string | null;
  callDuration: number;
  callerDialed: string;
  pinCode: string;
  isOOBECompleted: boolean;
  iconStyle: IconStyle;

  navigateTo: (app: AppName, dir?: 'left' | 'right' | 'up' | 'down' | 'fade') => void;
  goBack: () => void;
  unlock: () => void;
  lock: () => void;
  sendMessage: (contactId: string, text: string) => void;
  installApp: (appId: string) => void;
  startCall: (name: string) => void;
  endCall: () => void;
  setDialed: (val: string) => void;
  incrementCall: () => void;
  setPinCode: (pin: string) => void;
  completeOOBE: (iconStyle: IconStyle) => void;
  verifyPin: (pin: string) => boolean;
  resetSettings: () => void;
}

const initialStoreApps: StoreApp[] = [
  { id: 'calculator', name: 'Калькулятор', color: '#6366f1', gradient: 'from-indigo-400 to-violet-600', installed: false, size: '8 МБ', rating: 4.7, category: 'Утилиты', icon: '/apps_icons/system/Android Style/iz_marketa/calculator.jpg' },
  { id: 'music', name: 'Музыка', color: '#f43f5e', gradient: 'from-rose-400 to-pink-600', installed: false, size: '24 МБ', rating: 4.8, category: 'Развлечения', icon: '/apps_icons/system/Android Style/iz_marketa/music.png' },
  { id: 'notes', name: 'Заметки', color: '#f97316', gradient: 'from-orange-400 to-amber-500', installed: false, size: '12 МБ', rating: 4.6, category: 'Продуктивность', icon: '/apps_icons/system/Android Style/iz_marketa/zametki.png' },
  { id: 'qwertyai', name: 'WintoBot AI', color: '#8b5cf6', gradient: 'from-violet-400 to-purple-600', installed: false, size: '15 МБ', rating: 4.9, category: 'AI Ассистент', icon: '/apps_icons/system/Android Style/iz_marketa/wintobot_logo.jpg' },
];

export const usePhoneStore = create<PhoneStore>()(
  persist(
    (set, get) => ({
      currentApp: 'lock',
      previousApp: 'home',
      isLocked: true,
      animDirection: 'fade',
      contacts: [],
      conversations: {},
      installedApps: [],
      storeApps: initialStoreApps,
      activeCall: null,
      callDuration: 0,
      callerDialed: '',
      pinCode: '',
      isOOBECompleted: false,
      iconStyle: 'android',

      navigateTo: (app, dir = 'left') => {
        const prev = get().currentApp;
        set({ previousApp: prev, currentApp: app, animDirection: dir });
      },

      goBack: () => {
        const prev = get().previousApp;
        set({ currentApp: prev, previousApp: 'home', animDirection: 'right' });
      },

      unlock: () => {
        set({ isLocked: false, currentApp: 'home', animDirection: 'up' });
      },

      lock: () => {
        set({ isLocked: true, currentApp: 'lock', animDirection: 'down' });
      },

      sendMessage: (contactId, text) => {
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const newMsg = { id: Date.now().toString(), contactId, text, fromMe: true, time: timeStr };
        const convs = { ...get().conversations };
        if (!convs[contactId]) convs[contactId] = { contactId, messages: [] };
        convs[contactId] = { ...convs[contactId], messages: [...convs[contactId].messages, newMsg] };
        set({ conversations: convs });
      },

      installApp: (appId) => {
        const apps = get().storeApps.map(a => a.id === appId ? { ...a, installed: true } : a);
        set({ storeApps: apps, installedApps: [...get().installedApps, appId] });
      },

      startCall: (name) => {
        set({ activeCall: name, callDuration: 0 });
      },

      endCall: () => {
        set({ activeCall: null, callDuration: 0 });
      },

      setDialed: (val) => set({ callerDialed: val }),

      incrementCall: () => set(s => ({ callDuration: s.callDuration + 1 })),

      setPinCode: (pin) => set({ pinCode: pin }),

      completeOOBE: (iconStyle: IconStyle) => set({ isOOBECompleted: true, iconStyle }),

      verifyPin: (pin) => get().pinCode === pin,

      resetSettings: () => {
        set({
          isOOBECompleted: false,
          iconStyle: 'android',
          pinCode: '',
          installedApps: [],
          storeApps: initialStoreApps,
        });
      },
    }),
    {
      name: 'qwerui-storage',
      partialize: (state) => ({
        isOOBECompleted: state.isOOBECompleted,
        iconStyle: state.iconStyle,
        pinCode: state.pinCode,
        installedApps: state.installedApps,
        storeApps: state.storeApps,
        conversations: state.conversations,
      }),
    }
  )
);
