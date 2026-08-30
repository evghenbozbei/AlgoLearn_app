import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, FastForward, Activity, CheckCircle2, Server, Clock } from 'lucide-react';
import { VisualStep } from '../types';

interface VisualizerProps {
  steps: VisualStep[];
  type?: string;
  onStepChange?: (currentStepIndex: number) => void;
  title?: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  steps,
  type = 'array-search',
  onStepChange,
  title
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1200);
  const timerRef = useRef<any>(null);

  const step = steps[currentStepIdx] || steps[0];

  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStepIdx);
    }
  }, [currentStepIdx, onStepChange]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speedMs]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setCurrentStepIdx(steps.length - 1);
  };

  // Render array visualization
  const renderArrayVisualization = () => {
    const arr = step.array || [];
    const pointers = step.pointers || {};

    return (
      <div className="flex flex-col items-center justify-center my-4 w-full">
        {/* Array Items Row */}
        <div className="flex flex-wrap justify-center items-end gap-1.5 sm:gap-2.5 max-w-full overflow-x-auto py-3 px-1">
          {arr.map((val, idx) => {
            const isComparing = step.highlightIndices?.includes(idx);
            const isSecondary = step.secondaryHighlightIndices?.includes(idx);
            const isSorted = step.sortedIndices?.includes(idx);
            const isDiscarded = step.discardedIndices?.includes(idx);
            const isFound = step.foundIndex === idx;

            // Find pointers pointing to this index
            const pointerLabels = Object.entries(pointers)
              .filter(([_, ptrIdx]) => ptrIdx === idx)
              .map(([label]) => label);

            let bgClass = 'bg-slate-800 border-slate-700 text-slate-100';
            if (isFound) {
              bgClass = 'bg-emerald-500/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/50 scale-105';
            } else if (isComparing) {
              bgClass = 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 animate-pulse';
            } else if (isSecondary) {
              bgClass = 'bg-indigo-500/30 border-indigo-400 text-indigo-200';
            } else if (isSorted) {
              bgClass = 'bg-blue-600/30 border-blue-400 text-blue-200';
            } else if (isDiscarded) {
              bgClass = 'bg-slate-900/60 border-slate-800 text-slate-600 opacity-40 line-through';
            }

            return (
              <div key={idx} className="flex flex-col items-center group relative">
                {/* Pointer tags above */}
                <div className="h-5 flex items-center justify-center gap-1 mb-1">
                  {pointerLabels.map((lbl, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-1.5 py-0.5 text-[10px] font-bold font-mono rounded bg-indigo-500 text-white shadow-sm"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>

                {/* Array Cell */}
                <div
                  className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm sm:text-base shadow-lg transition-all duration-200 ${bgClass}`}
                >
                  <span>{val}</span>
                </div>

                {/* Index tag below */}
                <span className="text-[11px] font-mono text-slate-500 mt-1">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Stack visualization
  const renderStackVisualization = () => {
    const stackItems = step.stack || [];
    return (
      <div className="flex flex-col items-center my-4 w-full">
        <div className="w-64 max-w-full rounded-b-2xl border-x-4 border-b-4 border-indigo-500/60 p-3 bg-slate-900/80 min-h-[160px] flex flex-col-reverse gap-2 shadow-inner">
          {stackItems.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-slate-500 text-xs italic">
              Стек пуст (Empty Stack)
            </div>
          ) : (
            stackItems.map((item, idx) => {
              const isTop = idx === stackItems.length - 1;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg font-mono text-xs flex items-center justify-between border transition-all duration-300 ${
                    isTop
                      ? 'bg-indigo-600/40 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400/50 scale-[1.02]'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="truncate">{item}</span>
                  {isTop && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500 text-white font-bold rounded">
                      TOP
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
        <span className="text-xs text-slate-400 mt-2 font-mono">
          LIFO: Last In → First Out
        </span>
      </div>
    );
  };

  // Render Queue visualization
  const renderQueueVisualization = () => {
    const queueItems = step.queue || [];
    return (
      <div className="flex flex-col items-center my-4 w-full">
        <div className="flex items-center gap-2 max-w-full overflow-x-auto p-3 rounded-xl border-y-2 border-indigo-500/50 bg-slate-900/60 min-h-[80px]">
          <span className="text-[10px] font-bold text-emerald-400 font-mono px-2 py-1 bg-emerald-950/60 rounded border border-emerald-800">
            HEAD (Выход)
          </span>
          {queueItems.length === 0 ? (
            <span className="text-xs text-slate-500 italic px-4">Очередь пуста</span>
          ) : (
            queueItems.map((item, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono whitespace-nowrap shadow"
              >
                {item}
              </div>
            ))
          )}
          <span className="text-[10px] font-bold text-amber-400 font-mono px-2 py-1 bg-amber-950/60 rounded border border-amber-800">
            TAIL (Вход)
          </span>
        </div>
        <span className="text-xs text-slate-400 mt-2 font-mono">
          FIFO: First In → First Out
        </span>
      </div>
    );
  };

  // Render Round Robin visualization
  const renderRoundRobinVisualization = () => {
    const customData = step.customData || { servers: ['app-1', 'app-2', 'app-3'], activeServer: 0, request: 'Req #1' };
    const servers: string[] = customData.servers || ['app-1', 'app-2', 'app-3'];
    const activeServerIdx: number = customData.activeServer ?? 0;

    return (
      <div className="flex flex-col items-center my-4 w-full gap-4">
        {/* Incoming Request */}
        <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center gap-2 animate-bounce">
          <Activity size={14} />
          <span>{customData.request || 'Incoming Traffic'}</span>
        </div>

        {/* Server Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
          {servers.map((srv, idx) => {
            const isActive = idx === activeServerIdx;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-lg scale-105'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <Server size={22} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                <span className="font-mono text-xs font-bold mt-1">{srv}</span>
                <span className="text-[10px] mt-0.5">
                  {isActive ? '● Обрабатывает' : '○ Ожидание'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Exponential Backoff visualization
  const renderBackoffVisualization = () => {
    const customData = step.customData || { attempt: 0, delay: 0, status: 'Start' };
    return (
      <div className="flex flex-col items-center my-4 w-full gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Clock size={16} className="text-indigo-400" />
          <span>Стратегия Retry: Exponential Backoff + Full Jitter</span>
        </div>

        {/* Attempt Timeline */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-md overflow-x-auto py-2">
          {[0, 1, 2, 3].map((att) => {
            const isCurrent = customData.attempt === att;
            const isPast = customData.attempt > att;
            const delays = ['0s (Init)', '1.3s (~2⁰)', '2.5s (~2¹)', '4.8s (~2²)'];

            let stateClass = 'bg-slate-800/80 border-slate-700 text-slate-500';
            if (isCurrent) {
              stateClass = 'bg-indigo-600/30 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400/40 scale-105 font-bold';
            } else if (isPast) {
              stateClass = 'bg-rose-500/20 border-rose-400/40 text-rose-300 line-through';
            }

            return (
              <div
                key={att}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center text-xs transition-all ${stateClass}`}
              >
                <span className="font-mono text-[11px]">Попытка #{att + 1}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{delays[att]}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Choose sub-renderer
  const renderVisualArea = () => {
    if (type === 'stack' || type === 'recursion-tree') {
      return renderStackVisualization();
    }
    if (type === 'queue' || type === 'graph-bfs-dfs') {
      return renderQueueVisualization();
    }
    if (type === 'round-robin') {
      return renderRoundRobinVisualization();
    }
    if (type === 'exponential-backoff') {
      return renderBackoffVisualization();
    }
    return renderArrayVisualization();
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Title & Step Counter */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">{title || 'Пошаговый визуализатор'}</span>
        </div>
        <div className="font-mono font-bold bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-300">
          Шаг {currentStepIdx + 1} / {steps.length}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="min-h-[160px] flex items-center justify-center">
        {renderVisualArea()}
      </div>

      {/* Description Callout */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
        <div className="font-medium">{step.description}</div>
      </div>

      {/* Metrics Row if available */}
      {step.metrics && Object.keys(step.metrics).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3.5">
          {Object.entries(step.metrics).map(([k, v], idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/50 text-[11px] font-mono">
              <span className="text-slate-500 block text-[10px]">{k}:</span>
              <span className="text-indigo-300 font-semibold truncate block">{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-[11px] text-slate-500 hidden sm:inline">Скорость:</span>
          {[
            { label: '0.5x', ms: 2000 },
            { label: '1x', ms: 1200 },
            { label: '2x', ms: 500 }
          ].map((sp) => (
            <button
              key={sp.label}
              onClick={() => setSpeedMs(sp.ms)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                speedMs === sp.ms
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            id="viz-reset-btn"
            title="В начало"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            id="viz-prev-btn"
            title="Шаг назад"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            id="viz-play-pause-btn"
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs active:scale-95 shadow-md shadow-indigo-600/30 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Пауза</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Пуск</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === steps.length - 1}
            id="viz-next-btn"
            title="Шаг вперед"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 active:scale-95 transition-all"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleJumpToEnd}
            id="viz-end-btn"
            title="В конец"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-95 transition-all hidden sm:flex"
          >
            <FastForward size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
