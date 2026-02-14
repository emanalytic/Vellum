import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Square, Coffee, Lightbulb } from 'lucide-react';
import { useConfirm } from '../../context/ConfirmContext';
import type { Task } from '../../types';

interface FloatingTimerProps {
  task: Task | null;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({ task, onUpdate }) => {
  useConfirm();
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [satisfaction, setSatisfaction] = React.useState(50);

  if (!task) return null;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // Progress shows current minute for visual interest, using total time to persist across reloads
  const progress = ((task.totalTimeSeconds || task.timeSpent || 0) % 60) / 60; 
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 150, opacity: 0, scale: 0.5 }}
        className="fixed bottom-6 md:bottom-10 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[60] group"
      >
        {/* Shadow/Back Layer */}
        <div className="absolute inset-0 bg-ink translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2 rounded-3xl opacity-20 blur-sm" />
        
        <div className="relative sketch-border bg-white p-4 md:p-6 flex flex-row items-center gap-4 md:gap-8 w-full md:min-w-[420px] overflow-hidden">
          {/* Animated Background Pulse */}
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-10 -top-10 w-40 h-40 bg-highlighter-yellow rounded-full blur-3xl opacity-20"
          />

          <div className="relative shrink-0 scale-75 md:scale-100">
            <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
              {/* Background circle */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-ink/5"
              />
              {/* Progress circle */}
              <motion.circle
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke="var(--color-highlighter-yellow)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Lightbulb size={14} className="text-highlighter-pink mb-1 animate-pulse" />
              <span className="font-mono text-xl font-bold tracking-tighter">{formatTime(task.totalTimeSeconds || task.timeSpent || 0)}</span>
            </div>
          </div>

          <div className="flex-1 relative z-10 min-w-0">
            <h4 className="font-marker text-lg md:text-2xl leading-none mb-1 truncate">{task.description}</h4>
            <div className="flex items-center gap-1 mb-2 md:mb-4">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1" />
               <span className="font-sketch text-[10px] md:text-xs uppercase opacity-40 truncate">Focusing Deeply...</span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {isCompleting ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex flex-col">
                    <span className="font-sketch text-[10px] uppercase opacity-40">
                      Actual Satisfaction ({satisfaction}%)
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      autoFocus
                      value={satisfaction}
                      onChange={(e) => setSatisfaction(parseInt(e.target.value))}
                      className="w-32 md:w-48 accent-highlighter-pink cursor-pointer h-2 bg-ink/10 rounded-lg appearance-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      onUpdate(task.id, {
                        status: "completed",
                        actualSatisfaction: satisfaction,
                      });
                      setIsCompleting(false);
                    }}
                    className="p-2 bg-highlighter-pink text-ink hover:bg-ink hover:text-white transition-colors border-2 border-ink rounded-sm"
                    title="Seal It"
                  >
                    <Square size={16} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => setIsCompleting(false)}
                    className="p-2 text-ink/40 hover:text-ink transition-colors"
                  >
                    <Pause size={16} className="rotate-45" />
                  </button>
                </div>
              ) : (
                <>
                  {task.status === "running" ? (
                    <button
                      onClick={() => onUpdate(task.id, { status: "paused" })}
                      className="w-10 h-10 md:w-12 md:h-12 sketch-border bg-white flex items-center justify-center hover:bg-highlighter-yellow transition-all active:scale-95 shrink-0"
                      title="Pause Ritual"
                    >
                      <Pause size={18} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdate(task.id, { status: "running" })}
                      className="w-10 h-10 md:w-12 md:h-12 sketch-border bg-white flex items-center justify-center hover:bg-highlighter-yellow transition-all active:scale-95 shrink-0"
                      title="Resume Ritual"
                    >
                      <Play size={18} fill="currentColor" />
                    </button>
                  )}

                  <button
                    onClick={() => setIsCompleting(true)}
                    className="w-10 h-10 md:w-12 md:h-12 sketch-border bg-white flex items-center justify-center hover:bg-highlighter-pink transition-all active:scale-95 shrink-0"
                    title="Finish Quest"
                  >
                    <Square size={16} fill="currentColor" />
                  </button>

                  <div className="h-4 md:h-6 w-[2px] bg-ink/10 mx-1 shrink-0" />

                  <button
                    className="p-1 md:p-2 opacity-40 hover:opacity-100 transition-opacity hover:text-highlighter-pink shrink-0"
                    title="Mental Break"
                  >
                    <Coffee size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingTimer;
