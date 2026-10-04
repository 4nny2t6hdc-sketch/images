import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AsykSvg } from './AsykSvg';
import { AnswerOption } from '../types/game';
import { sounds } from '../utils/audio';

interface AsykArenaProps {
  options: AnswerOption[];
  onSelectOption: (option: AnswerOption) => void;
  hoveredOptionId: string | null;
  onHoverOption: (id: string | null) => void;
  isLocked: boolean;
  selectedOptionId: string | null;
  roundNumber: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export const AsykArena: React.FC<AsykArenaProps> = ({
  options,
  onSelectOption,
  hoveredOptionId,
  onHoverOption,
  isLocked,
  selectedOptionId,
  roundNumber,
}) => {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [sakaPos, setSakaPos] = useState<{ x: number; y: number }>({ x: 50, y: 88 });
  const [sakaRotation, setSakaRotation] = useState<number>(0);
  const [isThrowing, setIsThrowing] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [knockedOutId, setKnockedOutId] = useState<string | null>(null);
  const [isDraggingSaka, setIsDraggingSaka] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [aimVector, setAimVector] = useState<{ dx: number; dy: number } | null>(null);

  // 4 Target Asyk coordinates in percentage (%) within the arena
  // Arranged inside the circle (Шеңбер)
  const targetPositions: Record<number, { x: number; y: number; labelPos: string }> = {
    0: { x: 26, y: 34, labelPos: 'top' }, // A (Алшы / top-left)
    1: { x: 74, y: 34, labelPos: 'top' }, // B (Тәйке / top-right)
    2: { x: 34, y: 56, labelPos: 'bottom' }, // C (Бүк / bottom-left)
    3: { x: 66, y: 56, labelPos: 'bottom' }, // D (Шік / bottom-right)
  };

  // Reset arena state when round changes
  useEffect(() => {
    setSakaPos({ x: 50, y: 88 });
    setSakaRotation(0);
    setIsThrowing(false);
    setKnockedOutId(null);
    setParticles([]);
    setIsDraggingSaka(false);
    setAimVector(null);
  }, [roundNumber]);

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.04,
            life: p.life + 1,
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 24);
    return () => clearInterval(interval);
  }, [particles]);

  const spawnHitParticles = (x: number, y: number, isWinner: boolean) => {
    const newParticles: Particle[] = [];
    const colors = isWinner
      ? ['#FBBF24', '#F59E0B', '#FDE68A', '#FFFFFF', '#67E8F9']
      : ['#D1D5DB', '#9CA3AF', '#FCA5A5', '#78716C'];

    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 4.5;
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleLaunchAtOption = (option: AnswerOption, targetIndex: number) => {
    if (isLocked || isThrowing) return;

    const target = targetPositions[targetIndex];
    if (!target) return;

    setIsThrowing(true);
    setKnockedOutId(option.id);

    // Calculate flight angle
    const dx = target.x - sakaPos.x;
    const dy = target.y - sakaPos.y;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    setSakaRotation(angleDeg);

    // Play whoosh sound
    sounds.playThrow();

    // Saka flies to target
    setSakaPos({ x: target.x, y: target.y });

    // On collision (after flight travel time)
    setTimeout(() => {
      sounds.playAsykHit();
      spawnHitParticles(target.x, target.y, option.isCorrect);

      if (option.isCorrect) {
        sounds.playSuccess();
      } else {
        sounds.playMistake();
      }

      // Finalize selection to trigger quiz progression
      setTimeout(() => {
        onSelectOption(option);
      }, 700);
    }, 450);
  };

  // Dragging Saka slingshot mechanics
  const handleSakaPointerDown = (e: React.PointerEvent) => {
    if (isLocked || isThrowing) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingSaka(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleSakaPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSaka || !dragStart || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const currentX = e.clientX;
    const currentY = e.clientY;

    const pullX = dragStart.x - currentX;
    const pullY = dragStart.y - currentY;

    // Constrain vector
    const length = Math.min(Math.sqrt(pullX * pullX + pullY * pullY), 120);
    const angle = Math.atan2(pullY, pullX);

    setAimVector({
      dx: Math.cos(angle) * length,
      dy: Math.sin(angle) * length,
    });

    // Check which asyk is closest to line of fire
    let closestIndex = -1;
    let maxDot = -1;
    options.forEach((_, idx) => {
      const pos = targetPositions[idx];
      const targetVec = { x: pos.x - 50, y: pos.y - 88 };
      const targetDist = Math.sqrt(targetVec.x * targetVec.x + targetVec.y * targetVec.y);
      const dot = (targetVec.x * Math.cos(angle) + targetVec.y * Math.sin(angle)) / targetDist;
      if (dot > maxDot && dot > 0.8) {
        maxDot = dot;
        closestIndex = idx;
      }
    });

    if (closestIndex !== -1) {
      onHoverOption(options[closestIndex]?.id || null);
    } else {
      onHoverOption(null);
    }
  };

  const handleSakaPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingSaka) return;
    setIsDraggingSaka(false);
    setDragStart(null);

    // If an option was aimed at, trigger throw
    const targetIdx = options.findIndex((opt) => opt.id === hoveredOptionId);
    if (targetIdx !== -1 && options[targetIdx]) {
      handleLaunchAtOption(options[targetIdx], targetIdx);
    } else {
      // Find nearest target if pulled sufficiently
      if (aimVector && Math.sqrt(aimVector.dx * aimVector.dx + aimVector.dy * aimVector.dy) > 30) {
        // Find closest
        let closestIdx = 0;
        let bestDot = -999;
        options.forEach((_, idx) => {
          const pos = targetPositions[idx];
          const aimAngle = Math.atan2(aimVector.dy, aimVector.dx);
          const targetVec = { x: pos.x - 50, y: pos.y - 88 };
          const targetDist = Math.sqrt(targetVec.x * targetVec.x + targetVec.y * targetVec.y);
          const dot = (targetVec.x * Math.cos(aimAngle) + targetVec.y * Math.sin(aimAngle)) / targetDist;
          if (dot > bestDot) {
            bestDot = dot;
            closestIdx = idx;
          }
        });
        if (options[closestIdx]) {
          handleLaunchAtOption(options[closestIdx], closestIdx);
        }
      }
    }
    setAimVector(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-amber-950/40 bg-stone-950 shadow-2xl">
      {/* Background Carpet & Felt Texture with safe fallback */}
      <div
        ref={arenaRef}
        className="relative h-[360px] sm:h-[420px] md:h-[460px] w-full select-none overflow-hidden touch-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 45%, rgba(68, 30, 18, 0.72) 0%, rgba(20, 12, 8, 0.95) 100%), url('/src/assets/images/kazakh_felt_carpet_1791091443402.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle Ornamental Steppe Border Overlay */}
        <div className="pointer-events-none absolute inset-0 border-[6px] border-amber-800/30 rounded-2xl" />

        {/* Ambient Top Lighting Beam */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_40%] from-amber-500/15 via-transparent to-black/60" />

        {/* The Sacred Asyk Circle: "Шеңбер" (Ring on the ground) */}
        <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
          {/* Outer circle with Kazakh felt ornament motif */}
          <div className="relative flex items-center justify-center h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 rounded-full border-2 border-dashed border-amber-500/40 shadow-[0_0_24px_rgba(245,158,11,0.15)]">
            {/* Center bullseye mark (Ортасы) */}
            <div className="h-6 w-6 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            </div>

            {/* Inscribed Traditional Title */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-stone-900/90 border border-amber-700/50 rounded-full text-[10px] uppercase tracking-widest text-amber-300 font-semibold shadow-sm">
              Шеңбер · Игровой круг
            </div>
          </div>
        </div>

        {/* The Baseline: "Мере сызығы" (Throwing Boundary Line) */}
        <div className="pointer-events-none absolute bottom-[18%] left-8 right-8 flex items-center justify-center">
          <div className="w-full border-b border-dashed border-amber-600/40 flex items-center justify-center relative">
            <span className="bg-stone-950/80 px-3 py-0.5 text-[10px] tracking-wider text-amber-400/80 uppercase font-medium border border-amber-900/40 rounded-full">
              Мере · Линия броска
            </span>
          </div>
        </div>

        {/* Aim Trajectory Line when Dragging or Hovering */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {aimVector && (
            <line
              x1={`${sakaPos.x}%`}
              y1={`${sakaPos.y}%`}
              x2={`${sakaPos.x + aimVector.dx * 0.4}%`}
              y2={`${sakaPos.y + aimVector.dy * 0.4}%`}
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="6 4"
              opacity="0.9"
            />
          )}

          {!isThrowing && hoveredOptionId && (
            (() => {
              const targetIdx = options.findIndex((o) => o.id === hoveredOptionId);
              if (targetIdx === -1) return null;
              const target = targetPositions[targetIdx];
              return (
                <line
                  x1={`${sakaPos.x}%`}
                  y1={`${sakaPos.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke="#FDE68A"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.75"
                />
              );
            })()
          )}
        </svg>

        {/* Target Asyks inside the circle */}
        {options.map((option, idx) => {
          const pos = targetPositions[idx];
          if (!pos) return null;
          const isHovered = hoveredOptionId === option.id;
          const isKnocked = knockedOutId === option.id;
          const isChosen = selectedOptionId === option.id;

          // Asyk type labels in Kazakh
          const asykTypeLabels: Record<string, string> = {
            alshy: 'Алшы',
            tayke: 'Тәйке',
            buk: 'Бүк',
            shik: 'Шік',
          };

          return (
            <motion.div
              key={option.id}
              onClick={() => handleLaunchAtOption(option, idx)}
              onMouseEnter={() => !isLocked && onHoverOption(option.id)}
              onMouseLeave={() => !isLocked && onHoverOption(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              animate={
                isKnocked
                  ? {
                      x: (pos.x < 50 ? -120 : 120),
                      y: -90,
                      rotate: 720,
                      opacity: 0,
                      scale: 0.6,
                      transition: { duration: 0.65, ease: 'easeOut' },
                    }
                  : {
                      scale: isHovered ? 1.15 : 1,
                      y: isHovered ? -4 : 0,
                    }
              }
              whileTap={{ scale: 0.95 }}
            >
              {/* Target Indicator Ring */}
              <div
                className={`relative flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  isHovered
                    ? 'bg-amber-950/70 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                    : 'bg-black/30 hover:bg-black/50'
                }`}
              >
                {/* Asyk Badge Tag with Option Letter */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                      isHovered
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-800 text-amber-300 border border-amber-600/40'
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-300 tracking-wide">
                    {asykTypeLabels[option.asykType] || 'Асық'}
                  </span>
                </div>

                {/* Target Asyk 3D Graphic */}
                <div className="relative">
                  <AsykSvg
                    type={option.asykType}
                    size={48}
                    glow={isHovered}
                    className="transform transition-transform duration-200 group-hover:rotate-6"
                  />

                  {/* Target Aim reticle on hover */}
                  {isHovered && !isLocked && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 -m-1 border border-dashed border-amber-300 rounded-full animate-spin [animation-duration:8s] pointer-events-none"
                    />
                  )}
                </div>

                {/* Quick Hint Tooltip on hover */}
                <div className="mt-1 max-w-[140px] text-center">
                  <span className="line-clamp-1 text-[10px] text-stone-300 font-medium leading-tight">
                    {option.text}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* The Master Knucklebone: Сақа (Saka) */}
        <motion.div
          onPointerDown={handleSakaPointerDown}
          onPointerMove={handleSakaPointerMove}
          onPointerUp={handleSakaPointerUp}
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 ${
            isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{
            left: `${sakaPos.x}%`,
            top: `${sakaPos.y}%`,
          }}
          animate={
            isThrowing
              ? {
                  rotate: sakaRotation + 720,
                  scale: [1, 1.3, 0.95],
                  transition: { duration: 0.45, ease: 'easeInOut' },
                }
              : {
                  rotate: sakaRotation,
                }
          }
          whileHover={{ scale: isLocked ? 1 : 1.08 }}
        >
          <div className="relative flex flex-col items-center">
            {/* Saka Glow & Pulses */}
            <div className="relative">
              <AsykSvg type="saka" size={62} glow={!isLocked} />

              {/* Aiming Reticle Ring */}
              {!isThrowing && !isLocked && (
                <div className="absolute -inset-2 rounded-full border border-amber-400/50 animate-pulse pointer-events-none" />
              )}
            </div>

            {/* Label Under Saka */}
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-stone-950/90 border border-amber-500/50 text-[10px] font-bold tracking-wider text-amber-300 shadow">
              ҚОРҒАСЫН САҚА
            </div>
          </div>
        </motion.div>

        {/* Dynamic Collision Particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.alpha,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* Action Instruction Bar at bottom right */}
        <div className="pointer-events-none absolute bottom-3 right-4 hidden sm:flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg border border-amber-900/40 text-[11px] text-stone-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Нажмите на асык или вариант ответа для прицельного броска!</span>
        </div>
      </div>
    </div>
  );
};
