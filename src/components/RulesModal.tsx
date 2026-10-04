import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Award, Sparkles } from 'lucide-react';
import { AsykSvg } from './AsykSvg';
import { ASYK_DESCRIPTIONS } from '../data/questions';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-1.5 pb-6 border-b border-stone-800 text-center sm:text-left">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Ұлттық ойын дәстүрі · Традиции национальной игры
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-stone-100"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Қазақтың асық ату ойыны
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 pt-1 leading-relaxed">
              Асық ату (игра в бабки) — одна из древнейших кочевых игр казахского народа, развивающая зоркость, меткость, твердость руки и стратегическое мышление.
            </p>
          </div>

          {/* Master Knucklebone: Сақа */}
          <div className="py-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-stone-950/80 border border-amber-800/40 rounded-2xl">
              <div className="p-2 bg-stone-900 rounded-2xl shrink-0">
                <AsykSvg type="saka" size={72} glow={true} />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-base font-bold text-amber-300">Сақа (Saka)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Главная бита
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Самый крупный и увесистый асык из коленного сустава архара или матерого барана. Для придания максимальной кинетической энергии и устойчивости в него заливали свинец («қорғасын құйған сақа») и украшали медным пояском или бирюзой.
                </p>
              </div>
            </div>

            {/* 4 Classical Positions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>4 положения асыка в игре</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                  <AsykSvg type="alshy" size={44} glow />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-amber-300">Алшы (Alshy)</div>
                    <div className="text-[11px] text-amber-400 font-medium">Высшая позиция</div>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      Асык встал на ребро выемкой кверху. Символ победы и высшей удачи. «Алшы түссін!» — пожелание триумфа.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                  <AsykSvg type="tayke" size={44} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-emerald-300">Тәйке (Tayke)</div>
                    <div className="text-[11px] text-emerald-400 font-medium">Обратное ребро</div>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      Асык встал на противоположное гладкое ребро. Вторая по старшинству позиция после Алшы.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                  <AsykSvg type="buk" size={44} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-rose-300">Бүк (Buk)</div>
                    <div className="text-[11px] text-rose-400 font-medium">Спинка вверх</div>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      Асык лежит выпуклой спинкой кверху («бүк түсу»). Базовое устойчивое положение в кругу.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-2xl flex items-start gap-3">
                  <AsykSvg type="shik" size={44} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-sky-300">Шік (Shik)</div>
                    <div className="text-[11px] text-sky-400 font-medium">Выемка вверх</div>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      Асык лежит углублением (ложбинкой) кверху («шік түсу»). В игре парная позиция к «Бүк».
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to play in our game */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Как играть в литературную викторину:</span>
              </div>
              <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside leading-relaxed">
                <li>Каждый из 4 вариантов ответа привязан к асыку внутри круга (шеңбер).</li>
                <li>Вы можете <strong>нажать на любой асык или карточку ответа</strong> — ваша Сақа моментально вылетит и собьет цель!</li>
                <li>Либо <strong>натяните Сақа мышкой / пальцем</strong> как рогатку и отпустите для броска.</li>
                <li>За точные попадания вы получаете очки и собираете выбитые асыки в свой фонд мергена!</li>
              </ul>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end pt-4 border-t border-stone-800">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors cursor-pointer text-sm"
            >
              Бастауға дайынмын · Готов играть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
