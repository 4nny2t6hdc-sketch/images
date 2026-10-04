import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from './components/GameHeader';
import { AsykArena } from './components/AsykArena';
import { QuestionCard } from './components/QuestionCard';
import { RoundModal } from './components/RoundModal';
import { SummaryScreen } from './components/SummaryScreen';
import { NovelInfoModal } from './components/NovelInfoModal';
import { RulesModal } from './components/RulesModal';
import { AsykSvg } from './components/AsykSvg';
import { QUESTIONS_DATA } from './data/questions';
import { AnswerOption, RoundResult, GameSummary } from './types/game';
import { sounds } from './utils/audio';
import { Play, Sparkles, BookOpen, Target, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [gameState, setGameState] = useState<'WELCOME' | 'PLAYING' | 'SUMMARY'>('WELCOME');
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Score and Stats
  const [score, setScore] = useState<number>(0);
  const [asyksWon, setAsyksWon] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());

  // Info Modals
  const [isNovelInfoOpen, setIsNovelInfoOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const currentQuestion = QUESTIONS_DATA[currentRoundIndex] || QUESTIONS_DATA[0];
  const totalRounds = QUESTIONS_DATA.length;

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const handleStartGame = () => {
    sounds.playThrow();
    setGameState('PLAYING');
    setCurrentRoundIndex(0);
    setScore(0);
    setAsyksWon(0);
    setStreak(0);
    setLongestStreak(0);
    setRoundResults([]);
    setSelectedOption(null);
    setIsLocked(false);
    setIsModalOpen(false);
    setRoundStartTime(Date.now());
  };

  const handleSelectOption = useCallback((option: AnswerOption) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedOption(option);

    const isCorrect = option.isCorrect;
    const timeSpent = Math.round((Date.now() - roundStartTime) / 1000);

    const newRoundResult: RoundResult = {
      questionId: currentQuestion.id,
      selectedOptionId: option.id,
      isCorrect,
      accuracyScore: isCorrect ? 100 : 0,
      timeSpentSeconds: timeSpent,
    };

    setRoundResults((prev) => [...prev, newRoundResult]);

    if (isCorrect) {
      setScore((prev) => prev + 100 + streak * 20);
      setAsyksWon((prev) => prev + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setLongestStreak((curr) => Math.max(curr, nextStreak));
        return nextStreak;
      });
    } else {
      setStreak(0);
    }

    // Open round summary modal
    setIsModalOpen(true);
  }, [isLocked, roundStartTime, currentQuestion.id, streak]);

  const handleNextRound = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
    setIsLocked(false);
    setHoveredOptionId(null);

    if (currentRoundIndex + 1 < totalRounds) {
      setCurrentRoundIndex((prev) => prev + 1);
      setRoundStartTime(Date.now());
    } else {
      // Completed all 10 questions!
      setGameState('SUMMARY');
      sounds.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an info modal is open
      if (isNovelInfoOpen || isRulesOpen) return;

      if (gameState === 'PLAYING' && !isLocked && !isModalOpen) {
        const key = e.key.toUpperCase();
        let targetIndex = -1;
        if (key === '1' || key === 'A') targetIndex = 0;
        if (key === '2' || key === 'B') targetIndex = 1;
        if (key === '3' || key === 'C') targetIndex = 2;
        if (key === '4' || key === 'D') targetIndex = 3;

        if (targetIndex !== -1 && currentQuestion.options[targetIndex]) {
          e.preventDefault();
          handleSelectOption(currentQuestion.options[targetIndex]);
        }
      }

      if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isLocked, isModalOpen, currentQuestion, isNovelInfoOpen, isRulesOpen, handleSelectOption]);

  const gameSummaryData: GameSummary = {
    totalQuestions: totalRounds,
    correctAnswers: asyksWon,
    asyksKnockedOut: asyksWon,
    totalScore: score,
    accuracyPercentage: Math.round((asyksWon / totalRounds) * 100),
    streak,
    longestStreak,
    titleRank: asyksWon >= 9 ? 'Бас Мерген' : asyksWon >= 7 ? 'Сақа шебері' : 'Ізденуші мерген',
    rankDescription: '',
    roundResults,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col relative overflow-x-hidden">
      {/* Cinematic Steppe Background with layered warm gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url('/src/assets/images/steppe_sunset_landscape_1791091423150.jpg')`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-stone-950/80 via-stone-950/90 to-stone-950" />

      {/* Top Navigation Bar adhering to 3-zone contract */}
      <GameHeader
        score={score}
        asyksWon={asyksWon}
        streak={streak}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenNovelInfo={() => setIsNovelInfoOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onRestart={handleStartGame}
        currentRound={currentRoundIndex + 1}
        totalRounds={totalRounds}
      />

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {gameState === 'WELCOME' && (
          <div className="w-full max-w-3xl my-auto text-center space-y-8 py-6">
            {/* Thematic Hero Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-xs sm:text-sm text-amber-300 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Әдеби-интерактивті ұлттық ойын</span>
              <span aria-hidden="true">·</span>
              <span>10 сұрақ</span>
            </div>

            {/* Title Lockup in High-Character Display Face */}
            <div className="space-y-3">
              <h1
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-100 tracking-tight leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Сакен Жунусов <br />
                <span className="text-amber-400">«Прозрение»</span>
              </h1>
              <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Интерактивная литературная игра в стиле казахского национального состязания <strong>«Асық ату»</strong>. Погрузитесь в драматическую историю романа «Заманай мен Аманай», испытайте меткость и проверьте знание шедевра отечественной классики!
              </p>
            </div>

            {/* Illustrated Game Pieces Preview */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 py-4">
              <div className="flex flex-col items-center gap-2">
                <AsykSvg type="alshy" size={54} glow />
                <span className="text-xs font-semibold text-amber-300">Алшы</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AsykSvg type="tayke" size={54} />
                <span className="text-xs font-semibold text-emerald-300">Тәйке</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <AsykSvg type="saka" size={68} glow />
                </div>
                <span className="text-xs font-bold text-amber-400">Сақа (Бита)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AsykSvg type="buk" size={54} />
                <span className="text-xs font-semibold text-rose-300">Бүк</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AsykSvg type="shik" size={54} />
                <span className="text-xs font-semibold text-sky-300">Шік</span>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                  <Target className="w-4 h-4" />
                  <span>Механика асық ату</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Прицеливайтесь свинцовой Сақа и выбивайте правильные ответы из игрового круга с реалистичным звуком и физикой.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>10 глубоких вопросов</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Исследуйте образы бабушки Балкии и Аманая, символ полыни (жусан), исторические факты откочевки и судьбу писателя.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Звания мергена</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Собирайте выбитые асыки, побеждайте в сериях и завоюйте почетное звание «Бас Мерген степи».
                </p>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStartGame}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-base rounded-2xl transition-all duration-200 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Play className="w-5 h-5 fill-stone-950 transition-transform group-hover:scale-110" />
                <span>Ойынды бастау · Начать игру</span>
              </button>

              <button
                onClick={() => setIsNovelInfoOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-sm font-medium rounded-2xl transition-colors cursor-pointer"
              >
                Читать о романе
              </button>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="w-full space-y-6">
            {/* Top Interactive Progress Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                <span className="text-amber-400 font-bold">Раунд {currentRoundIndex + 1}</span>
                <span>/</span>
                <span>{totalRounds}</span>
                <span className="hidden sm:inline text-stone-600">·</span>
                <span className="hidden sm:inline text-stone-400">
                  Выбито асыков: {asyksWon}
                </span>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {QUESTIONS_DATA.map((_, i) => {
                  const result = roundResults[i];
                  let dotColor = 'bg-stone-800';
                  if (result) {
                    dotColor = result.isCorrect ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-rose-500';
                  } else if (i === currentRoundIndex) {
                    dotColor = 'bg-amber-400 ring-2 ring-amber-400/40';
                  }
                  return (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentRoundIndex ? 'w-5' : 'w-2'
                      } ${dotColor}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Asyk Arena with Interactive Physics, Knucklebone Throwing & Particles */}
            <AsykArena
              options={currentQuestion.options}
              onSelectOption={handleSelectOption}
              hoveredOptionId={hoveredOptionId}
              onHoverOption={setHoveredOptionId}
              isLocked={isLocked}
              selectedOptionId={selectedOption?.id || null}
              roundNumber={currentRoundIndex}
            />

            {/* Question and Option Cards */}
            <QuestionCard
              question={currentQuestion}
              currentRound={currentRoundIndex + 1}
              totalRounds={totalRounds}
              onSelectOption={handleSelectOption}
              hoveredOptionId={hoveredOptionId}
              onHoverOption={setHoveredOptionId}
              isLocked={isLocked}
              selectedOptionId={selectedOption?.id || null}
            />
          </div>
        )}

        {gameState === 'SUMMARY' && (
          <SummaryScreen
            summary={gameSummaryData}
            questions={QUESTIONS_DATA}
            onRestart={handleStartGame}
          />
        )}
      </main>

      {/* Round Result Modal */}
      <RoundModal
        isOpen={isModalOpen}
        question={currentQuestion}
        selectedOption={selectedOption}
        onNext={handleNextRound}
        currentRound={currentRoundIndex + 1}
        totalRounds={totalRounds}
      />

      {/* Educational Lore Modals */}
      <NovelInfoModal
        isOpen={isNovelInfoOpen}
        onClose={() => setIsNovelInfoOpen(false)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Footer (Zero-Pill and quiet, compliant with constitution) */}
      <footer className="w-full border-t border-stone-900 bg-stone-950/80 py-4 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Сакен Нурмакович Жунусов (1934–2006) · «Прозрение» («Заманай мен Аманай»)</span>
          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setIsNovelInfoOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Биография
            </button>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              О правилах
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
