import { useState, useRef, useEffect } from 'react';
import { usePhoneStore } from '../../store/usePhoneStore';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url: string;
  file?: File;
}

export default function Music() {
  const navigateTo = usePhoneStore(s => s.navigateTo);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files)
        .filter(file => file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|m4a)$/i))
        .map((file, index) => ({
          id: Date.now() + index,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Локальный файл',
          duration: '0:00',
          url: URL.createObjectURL(file),
          file,
        }));
      setTracks(prev => [...prev, ...newTracks]);
      if (tracks.length === 0 && newTracks.length > 0) {
        setCurrentTrackIndex(0);
      }
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && currentTrackIndex >= 0 && tracks[currentTrackIndex]) {
      audioRef.current.src = tracks[currentTrackIndex].url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || currentTrackIndex < 0) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    if (tracks.length === 0) return;
    if (direction === 'next') {
      setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    } else {
      setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white animate-slide-left">
      <audio ref={audioRef} onEnded={() => skipTrack('next')} />
      <StatusBar dark />

      {/* Header with add button */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="text-slate-400 text-xs uppercase tracking-widest">Музыка</div>
        <label className="cursor-pointer">
          <input type="file" accept=".mp3,.wav,.m4a,audio/*" multiple onChange={handleFileSelect} className="hidden" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </label>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {currentTrack ? (
          <>
            <div className="w-64 h-64 rounded-3xl shadow-2xl mb-8 flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className={`w-48 h-48 rounded-full border-4 border-white/20 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-white/80">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Song Info */}
            <div className="text-center mb-8">
              <div className="text-white text-2xl font-bold mb-1">{currentTrack.title}</div>
              <div className="text-purple-300 text-lg">{currentTrack.artist}</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-2">
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-purple-300 text-xs mt-1">
                <span>{formatTime((progress / 100) * (audioRef.current?.duration || 0))}</span>
                <span>{currentTrack.duration || '0:00'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                className="text-purple-300 hover:text-white transition-colors"
                onClick={() => skipTrack('prev')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button
                className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-105 transition-transform"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                className="text-purple-300 hover:text-white transition-colors"
                onClick={() => skipTrack('next')}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
                </svg>
              </button>
            </div>

            {/* Volume */}
            <div className="w-full mt-8">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-300">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                    style={{ width: `${volume}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-purple-400">
                <circle cx="5" cy="17" r="3" fill="currentColor"/>
                <circle cx="17" cy="13" r="3" fill="currentColor"/>
                <path d="M7 17V7l12-3v10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Нет треков</h3>
            <p className="text-purple-300 mb-6">Добавьте музыку с вашего устройства</p>
            <label className="cursor-pointer">
              <input type="file" accept=".mp3,.wav,.m4a,audio/*" multiple onChange={handleFileSelect} className="hidden" />
              <div className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
                Выбрать файлы
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Playlist Toggle */}
      {tracks.length > 0 && (
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="mx-4 mb-20 py-2 px-4 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
        >
          {showPlaylist ? 'Скрыть плейлист' : `Плейлист (${tracks.length})`}
        </button>
      )}

      {/* Playlist */}
      {showPlaylist && tracks.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl rounded-t-3xl max-h-64 overflow-y-auto scrollbar-hide">
          <div className="p-4">
            <div className="text-purple-300 text-xs uppercase tracking-widest mb-3">Плейлист</div>
            <div className="space-y-2">
              {tracks.map((track, i) => (
                <button
                  key={track.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    i === currentTrackIndex ? 'bg-purple-500/30' : 'hover:bg-white/10'
                  }`}
                  onClick={() => playTrack(i)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className={`text-sm font-semibold truncate ${i === currentTrackIndex ? 'text-white' : 'text-slate-300'}`}>
                      {track.title}
                    </div>
                    <div className="text-xs text-purple-400">{track.artist}</div>
                  </div>
                  {i === currentTrackIndex && isPlaying && (
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(bar => (
                        <div
                          key={bar}
                          className="w-1 bg-purple-400 rounded-full animate-pulse"
                          style={{ height: `${12 + Math.random() * 8}px`, animationDelay: `${bar * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
}
