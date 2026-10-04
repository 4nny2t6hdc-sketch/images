import React from 'react';
import { motion } from 'motion/react';
import { Question, AnswerOption } from '../types/game';
import { AsykSvg } from './AsykSvg';
import { BookOpen, Quote } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentRound: number;
  totalRounds: number;
  onSelectOption: (option: AnswerOption) => void;
  hoveredOptionId: string | null;
  onHoverOption: (id: string | null) => void;
  isLocked: boolean;
  selectedOptionId: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentRound,
  totalRounds,
  onSelectOption,
  hoveredOptionId,
  onHoverOption,
  isLocked,
  selectedOptionId,
}) => {
  return (
    <div className="w-full bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-md">
      {/* Top Editorial Metadata (Zero-Pill discipline: unboxed clean text) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800/80 text-xs text-amber-400/90">
        <div className="flex items-center gap-2 font-medium">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Сакен Жунусов «Прозрение»</span>
          <span aria-hidden="true" className="text-stone-600">·</span>
          <span>«Заманай мен Аманай»</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-stone-400 tabular-nums">
          <span>Сұрақ {currentRound}</span>
          <span aria-hidden="true" className="text-stone-600">/</span>
          <span>{totalRounds}</span>
        </div>
      </div>

      {/* Main Question Text */}
      <div className="py-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-stone-100 leading-snug tracking-tight">
          {question.question}
        </h2>

        {/* Thematic literary excerpt / quote if available */}
        {question.quote && (
          <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-stone-950/60 border-l-4 border-amber-500 text-stone-300 italic text-xs sm:text-sm">
            <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{question.quote}</p>
          </div>
        )}
      </div>

      {/* Interactive Answer Options (Target cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {question.options.map((option, idx) => {
          const isHovered = hoveredOptionId === option.id;
          const isSelected = selectedOptionId === option.id;

          const asykNames: Record<string, string> = {
            alshy: 'Алшы',
            tayke: 'Тәйке',
            buk: 'Бүк',
            shik: 'Шік',
          };

          return (
            <motion.button
              key={option.id}
              onClick={() => onSelectOption(option)}
              onMouseEnter={() => !isLocked && onHoverOption(option.id)}
              onMouseLeave={() => !isLocked && onHoverOption(null)}
              disabled={isLocked}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              className={`group relative text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                isSelected
                  ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : isHovered
                  ? 'bg-stone-800/90 border-amber-500/60 shadow-md'
                  : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
              } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
            >
              {/* Left Asyk Icon & Option Badge */}
              <div className="flex flex-col items-center shrink-0">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                    isHovered || isSelected
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {option.label}
                </span>

                <div className="mt-1.5">
                  <AsykSvg type={option.asykType} size={32} glow={isHovered} />
                </div>
              </div>

              {/* Option Text and Asyk Type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase">
                    {asykNames[option.asykType]}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Клавиша [{idx + 1}]</span>
                </div>
                <p className="text-sm font-medium text-stone-200 group-hover:text-stone-100 leading-normal">
                  {option.text}
                </p>
              </div>

              {/* Subdued throw crosshair indicator */}
              <div
                className={`self-center shrink-0 w-2 h-2 rounded-full transition-all duration-200 ${
                  isHovered || isSelected
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                    : 'bg-stone-700'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
