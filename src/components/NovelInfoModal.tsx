import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Feather, History, HeartHandshake } from 'lucide-react';

interface NovelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovelInfoModal: React.FC<NovelInfoModalProps> = ({ isOpen, onClose }) => {
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

          {/* Header with Author portrait */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-stone-800">
            <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-600/50 shadow-lg bg-stone-950">
              <img
                src="/src/assets/images/saken_zhunusov_art_1791091458433.jpg"
                alt="Сакен Нурмакович Жунусов"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Халық жазушысы · Народный писатель Казахстана
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold text-stone-100"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Сакен Нурмакович Жунусов
              </h2>
              <div className="text-xs text-stone-400 font-mono">
                1934 – 2006 · «Сәкен сері»
              </div>
              <p className="text-xs sm:text-sm text-stone-300 pt-1 leading-relaxed">
                Выдающийся казахский писатель, драматург, лауреат Государственной премии Республики Казахстан. Человек редкого универсального таланта: мыслитель, музыкант, певец и борец.
              </p>
            </div>
          </div>

          {/* Core Insights about «Прозрение» */}
          <div className="py-6 space-y-5">
            <div className="flex items-start gap-3 p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-300">
                  Роман-реквием «Прозрение» («Заманай мен Аманай»)
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Повесть-роман рассказывает пронзительную историю престарелой бабушки Балкии и ее внука Аманая. Вынужденные покинуть родные степи в страшные годы коллективизации 1930-х годов и голода, беженцы оказались в чужой стране. Но зов родной земли («Атамекен») оказывается сильнее страха смерти и границ.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
              <History className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-300">
                  Историческая правда и память поколений
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Сакен Жунусов одним из первых в отечественной литературе открыл завесу молчания над трагедией казахской откочевки за кордон. Книга стала памятником всем соотечественникам, преодолевшим через снежные бураны, скалы и пули обратный путь к родному очагу.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-stone-950/70 border border-stone-800 rounded-2xl">
              <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-300">
                  Философский смысл: Зов жусана
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Полынь (жусан) выступает лейтмотивом произведения: пока человек хранит память предков и верность родной почве, он духовно непобедим. В 1997 году режиссер Болат Шарип создал по роману одноименный фильм «Заманай мен Аманай», вошедший в золотой фонд казахстанского кино.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end pt-4 border-t border-stone-800">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-colors cursor-pointer text-sm"
            >
              Түсінікті · Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
