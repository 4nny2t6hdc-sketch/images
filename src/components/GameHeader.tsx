import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookText, HelpCircle, Trophy } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  asyksWon: number;
  streak: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenNovelInfo: () => void;
  onOpenRules: () => void;
  onRestart: () => void;
  currentRound: number;
  totalRounds: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  asyksWon,
  streak,
  isMuted,
  onToggleSound,
  onOpenNovelInfo,
  onOpenRules,
  onRestart,
  currentRound,
  totalRounds,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark (Single text element in high-character display font) */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onRestart();
            }}
            className="text-lg sm:text-xl font-bold tracking-tight text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Прозрение: Асық ату
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={onOpenNovelInfo}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <BookText className="w-4 h-4 text-amber-500" />
            <span>О романе</span>
          </button>
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Правила асық ату</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions and score status */}
        <div className="flex items-center gap-3">
          {/* Asyks Won meter with tabular nums */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs font-mono tabular-nums">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-semibold">{asyksWon}</span>
            <span className="text-stone-500 hidden sm:inline">асық</span>
            {streak > 1 && (
              <span className="text-emerald-400 font-bold ml-1">🔥 {streak}x</span>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="p-2 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            aria-label="Начать заново"
            className="p-2 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
