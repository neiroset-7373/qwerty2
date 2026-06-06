export type AppName =
  | 'home'
  | 'lock'
  | 'dialer'
  | 'contacts'
  | 'messages'
  | 'settings'
  | 'store'
  | 'calculator'
  | 'music'
  | 'notes';

export type IconStyle = 'android' | 'wintozo';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  color: string;
}

export interface Message {
  id: string;
  contactId: string;
  text: string;
  fromMe: boolean;
  time: string;
}

export interface Conversation {
  contactId: string;
  messages: Message[];
}

export interface StoreApp {
  id: string;
  name: string;
  color: string;
  gradient: string;
  installed: boolean;
  size: string;
  rating: number;
  category: string;
  icon?: string;
}
