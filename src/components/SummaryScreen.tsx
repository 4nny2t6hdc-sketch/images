import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GameSummary, Question } from '../types/game';
import { AsykSvg } from './AsykSvg';
import { Trophy, RotateCcw, CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, Share2 } from 'lucide-react';

interface SummaryScreenProps {
  summary: GameSummary;
  questions: Question[];
  onRestart: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  summary,
  questions,
  onRestart,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const getRankBadge = (correct: number) => {
    if (correct >= 9) {
      return {
        title: 'Бас Мерген · Хранитель памяти степи',
        description: 'Вы проявили виртуозную меткость и глубочайшее знание романа Сакена Жунусова «Прозрение». Истинный хранитель духовного наследия народа!',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/40',
      };
    } else if (correct >= 7) {
      return {
        title: 'Сақа шебері · Знаток творчества',
        description: 'Превосходный результат! Вы отлично ориентируетесь в сюжетных линиях, исторических параллелях и характерах романа «Прозрение».',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/40',
      };
    } else if (correct >= 5) {
      return {
        title: 'Ізденуші мерген · Вдумчивый читатель',
        description: 'Хороший результат. Основные идеи и мотивы произведения вам близки, а игра вдохновит перечитать страницы великой повести.',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/40',
      };
    } else {
      return {
        title: 'Жас ойыншы · Начало пути к прозрению',
        description: 'Первое знакомство с книгой состоялось! Роман Сакена Жунусова полон драматизма и мудрости — обязательно ознакомьтесь с ним подробнее.',
        color: 'text-amber-300',
        bg: 'bg-stone-800 border-stone-700',
      };
    }
  };

  const rank = getRankBadge(summary.correctAnswers);

  const handleShare = () => {
    const text = `Я прошел литературную игру «Прозрение: Асық ату» по роману Сакена Жунусова с результатом ${summary.correctAnswers}/10 (${summary.asyksKnockedOut} асықов)! Мой ранг: ${rank.title}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
      >
        {/* Title & Celebration Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-10 h-10" />
          </div>
          <h1
            className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Ойын аяқталды · Игра завершена
          </h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto">
            Итоги литературной игры-викторины по роману Сакена Жунусова «Прозрение» («Заманай мен Аманай»)
          </p>
        </div>

        {/* Rank Banner */}
        <div className={`p-6 rounded-2xl border text-center space-y-2 ${rank.bg}`}>
          <div className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Присужденное звание игрока
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold ${rank.color}`}>
            {rank.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {rank.description}
          </p>
        </div>

        {/* Key Metrics Grid (Zero-Pill discipline: unboxed cards with hairline borders) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-center">
            <div className="text-xs text-stone-400">Точных бросков</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">
              {summary.correctAnswers} / 10
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">правильных ответов</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-center">
            <div className="text-xs text-stone-400">Выбито асыков</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">
              {summary.asyksKnockedOut}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">ұтылған асық</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-center">
            <div className="text-xs text-stone-400">Точность бросков</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-sky-400">
              {Math.round((summary.correctAnswers / 10) * 100)}%
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">мергендік деңгейі</div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 text-center">
            <div className="text-xs text-stone-400">Серия побед</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-400">
              {summary.longestStreak}x
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">максимум подряд</div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-semibold text-stone-200 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Разбор всех 10 вопросов романа</span>
          </h3>

          <div className="divide-y divide-stone-800 rounded-2xl border border-stone-800 overflow-hidden bg-stone-950/60">
            {questions.map((q, idx) => {
              const res = summary.roundResults.find((r) => r.questionId === q.id);
              const isCorrect = res?.isCorrect ?? false;
              const isExpanded = expandedIndex === idx;

              return (
                <div key={q.id} className="transition-colors hover:bg-stone-900/50">
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="text-xs text-stone-400 font-mono">Сұрақ {idx + 1}</div>
                        <div className="text-sm font-medium text-stone-200 line-clamp-1">
                          {q.question}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4 pt-1 space-y-2 text-xs sm:text-sm text-stone-300 bg-stone-900/80 border-t border-stone-800"
                    >
                      <div className="p-3 bg-stone-950/60 rounded-xl">
                        <span className="font-semibold text-amber-300">Правильный ответ: </span>
                        {q.options.find((o) => o.isCorrect)?.text}
                      </div>
                      <p className="leading-relaxed text-stone-300">
                        {q.explanation}
                      </p>
                      <div className="text-xs text-amber-400/90 italic pt-1">
                        {q.historicalContext}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{copied ? 'Скопировано в буфер!' : 'Поделиться результатом'}</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-sm font-bold rounded-xl transition-all duration-150 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Қайта ойнау · Сыграть снова</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
