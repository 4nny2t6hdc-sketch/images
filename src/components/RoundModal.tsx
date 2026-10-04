import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, AnswerOption } from '../types/game';
import { AsykSvg } from './AsykSvg';
import { ASYK_DESCRIPTIONS } from '../data/questions';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Compass, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoundModalProps {
  isOpen: boolean;
  question: Question;
  selectedOption: AnswerOption | null;
  onNext: () => void;
  currentRound: number;
  totalRounds: number;
}

export const RoundModal: React.FC<RoundModalProps> = ({
  isOpen,
  question,
  selectedOption,
  onNext,
  currentRound,
  totalRounds,
}) => {
  const isCorrect = selectedOption?.isCorrect ?? false;
  const asykInfo = selectedOption ? ASYK_DESCRIPTIONS[selectedOption.asykType] : null;

  useEffect(() => {
    if (isOpen && isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FBBF24', '#10B981', '#38BDF8'],
        });
      } catch (err) {
        // Fallback gracefully if confetti fails
      }
    }
  }, [isOpen, isCorrect]);

  // Handle keyboard [Enter] or [Space] to proceed
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext]);

  if (!isOpen || !selectedOption) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Top Status Banner with Accent Glow */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">
                      ДӘЛ ТИДІ! МЕРГЕН БРОСОК
                    </h3>
                    <p className="text-xs text-stone-400">
                      Асық шеңберден ұшып түсті · Правильный ответ
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400">
                  <XCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-rose-400">
                      МҮЛТ КЕТТІ · ПРОМАХ
                    </h3>
                    <p className="text-xs text-stone-400">
                      Асық орнынан қозғалмады · Неточный выбор
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Asyk Trophy Visual */}
            <div className="flex items-center gap-2 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
              <AsykSvg type={selectedOption.asykType} size={36} glow={isCorrect} />
              <div className="text-right">
                <span className="block text-xs font-bold text-amber-300">
                  {asykInfo?.title.split(' ')[0]}
                </span>
                <span className="text-[10px] text-stone-400">
                  {isCorrect ? '+100 очков' : '+0 очков'}
                </span>
              </div>
            </div>
          </div>

          {/* Literary Analysis & Novel Explanation */}
          <div className="my-5 space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* The Correct Answer Notice if missed */}
            {!isCorrect && (
              <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs sm:text-sm text-stone-200">
                <span className="font-semibold text-rose-300">Правильный ответ: </span>
                {question.options.find((o) => o.isCorrect)?.text}
              </div>
            )}

            {/* In-depth Literary Explanation */}
            <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Литературный анализ романа «Прозрение»</span>
              </div>
              <p className="text-stone-200 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>

            {/* Historical Context / Saken Zhunusov lore */}
            <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-900/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                <Compass className="w-4 h-4" />
                <span>Историко-культурный контекст эпохи</span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                {question.historicalContext}
              </p>
            </div>

            {/* Asyk meaning lore */}
            {asykInfo && (
              <div className="flex items-center gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80 text-xs text-stone-400">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong className="text-amber-300">{asykInfo.title}:</strong> {asykInfo.description}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <div className="text-xs text-stone-500 font-mono">
              Сұрақ {currentRound} / {totalRounds} · [Enter] для продолжения
            </div>

            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all duration-150 shadow-lg shadow-amber-500/20 cursor-pointer text-sm whitespace-nowrap"
            >
              <span>{currentRound < totalRounds ? 'Следующий бросок' : 'Итоги игры'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
