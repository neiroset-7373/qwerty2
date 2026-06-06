import { useState } from 'react';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  color: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    title: 'Список покупок',
    content: 'Хлеб, молоко, яйца, фрукты, овощи, сыр',
    date: 'Сегодня',
    color: 'bg-yellow-100'
  },
  {
    id: 2,
    title: 'Идеи для проекта',
    content: 'Создать новое приложение, разработать дизайн, протестировать функционал',
    date: 'Вчера',
    color: 'bg-blue-100'
  },
  {
    id: 3,
    title: 'Важные звонки',
    content: 'Позвонить маме, позвонить клиенту, заказать билеты',
    date: '20 января',
    color: 'bg-green-100'
  },
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const colors = [
    'bg-yellow-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-orange-100'
  ];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: newTitle || 'Новая заметка',
      content: newContent,
      date: 'Только что',
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsEditing(false);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
    setSelectedNote(null);
  };

  if (isEditing) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
        <StatusBar />
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="text-slate-600 p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-600">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="text-xl font-bold text-slate-800">Новая заметка</div>
          <button
            onClick={handleCreateNote}
            className="text-blue-500 font-semibold px-3"
          >
            Сохранить
          </button>
        </div>

        <div className="flex-1 px-4 py-3">
          <input
            type="text"
            placeholder="Заголовок"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-2xl font-bold text-slate-800 placeholder-slate-300 outline-none mb-3"
          />
          <textarea
            placeholder="Текст заметки..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full flex-1 text-slate-600 placeholder-slate-300 outline-none resize-none leading-relaxed"
          />
        </div>

        <NavBar />
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
        <StatusBar />
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <button onClick={() => setSelectedNote(null)} className="text-slate-600 p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-600">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteNote(selectedNote.id)}
              className="text-red-500 p-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={`flex-1 px-4 py-3 ${selectedNote.color}`}>
          <div className="text-2xl font-bold text-slate-800 mb-2">{selectedNote.title}</div>
          <div className="text-sm text-slate-500 mb-4">{selectedNote.date}</div>
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {selectedNote.content}
          </div>
        </div>

        <NavBar />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-white animate-slide-left">
      <StatusBar />
      <div className="px-4 pt-3 pb-2">
        <div className="text-2xl font-bold text-slate-800">Заметки</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2">
        <div className="space-y-3">
          {notes.map(note => (
            <button
              key={note.id}
              className={`w-full p-4 rounded-2xl text-left transition-all hover:shadow-md ${note.color}`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="font-bold text-slate-800 mb-1">{note.title}</div>
              <div className="text-sm text-slate-600 line-clamp-2">{note.content}</div>
              <div className="text-xs text-slate-500 mt-2">{note.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating action button */}
      <button
        className="absolute bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center hover:scale-105 transition-transform"
        onClick={() => setIsEditing(true)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      <NavBar />
    </div>
  );
}
