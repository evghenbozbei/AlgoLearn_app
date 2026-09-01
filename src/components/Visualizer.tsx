import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Activity,
  CheckCircle2,
  Server,
  Clock
} from 'lucide-react';
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

            let cellStyle = {
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            };

            let customClasses = '';

            if (isFound) {
              cellStyle = {
                backgroundColor: 'var(--accent-emerald-bg)',
                borderColor: 'var(--accent-emerald-border)',
                color: 'var(--accent-emerald-text)'
              };
              customClasses = 'ring-2 ring-emerald-500 scale-105 font-extrabold';
            } else if (isComparing) {
              cellStyle = {
                backgroundColor: 'var(--accent-amber-bg)',
                borderColor: 'var(--accent-amber-border)',
                color: 'var(--accent-amber-text)'
              };
              customClasses = 'ring-2 ring-amber-500 animate-pulse font-bold';
            } else if (isSecondary) {
              cellStyle = {
                backgroundColor: 'var(--accent-indigo-bg)',
                borderColor: 'var(--accent-indigo-border)',
                color: 'var(--accent-indigo-text)'
              };
            } else if (isSorted) {
              cellStyle = {
                backgroundColor: 'var(--accent-cyan-bg)',
                borderColor: 'var(--accent-cyan-border)',
                color: 'var(--accent-cyan-text)'
              };
            } else if (isDiscarded) {
              cellStyle = {
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-faint)'
              };
              customClasses = 'opacity-40 line-through';
            }

            return (
              <div key={idx} className="flex flex-col items-center group relative">
                {/* Pointer tags above */}
                <div className="h-5 flex items-center justify-center gap-1 mb-1">
                  {pointerLabels.map((lbl, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-1.5 py-0.5 text-[10px] font-bold font-mono rounded bg-indigo-600 text-white shadow-sm"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>

                {/* Array Cell */}
                <div
                  style={cellStyle}
                  className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold text-sm sm:text-base shadow-sm transition-all duration-200 ${customClasses}`}
                >
                  <span>{val}</span>
                </div>

                {/* Index tag below */}
                <span
                  style={{ color: 'var(--text-muted)' }}
                  className="text-[11px] font-mono mt-1"
                >
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
        <div
          style={{
            backgroundColor: 'var(--card-subtle-bg)',
            borderColor: 'var(--accent-indigo-border)'
          }}
          className="w-64 max-w-full rounded-b-2xl border-x-4 border-b-4 p-3 min-h-[160px] flex flex-col-reverse gap-2 shadow-inner"
        >
          {stackItems.length === 0 ? (
            <div
              style={{ color: 'var(--text-muted)' }}
              className="h-28 flex items-center justify-center text-xs italic"
            >
              Стек пуст (Empty Stack)
            </div>
          ) : (
            stackItems.map((item, idx) => {
              const isTop = idx === stackItems.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isTop ? 'var(--accent-indigo-bg)' : 'var(--card-bg)',
                    borderColor: isTop ? 'var(--accent-indigo-border)' : 'var(--card-border)',
                    color: isTop ? 'var(--accent-indigo-text)' : 'var(--text-primary)'
                  }}
                  className={`p-2.5 rounded-lg font-mono text-xs flex items-center justify-between border transition-all duration-300 ${
                    isTop ? 'shadow-md ring-1 ring-indigo-500 scale-[1.02] font-bold' : ''
                  }`}
                >
                  <span className="truncate">{item}</span>
                  {isTop && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-indigo-600 text-white font-bold rounded">
                      TOP
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
        <span
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-2 font-mono"
        >
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
        <div
          style={{
            borderColor: 'var(--accent-indigo-border)',
            backgroundColor: 'var(--card-subtle-bg)'
          }}
          className="flex items-center gap-2 max-w-full overflow-x-auto p-3 rounded-xl border-y-2 min-h-[80px]"
        >
          <span
            style={{
              backgroundColor: 'var(--accent-emerald-bg)',
              color: 'var(--accent-emerald-text)',
              borderColor: 'var(--accent-emerald-border)'
            }}
            className="text-[10px] font-bold font-mono px-2 py-1 rounded border"
          >
            HEAD (Выход)
          </span>
          {queueItems.length === 0 ? (
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-xs italic px-4"
            >
              Очередь пуста
            </span>
          ) : (
            queueItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-primary)'
                }}
                className="px-3 py-2 rounded-lg border text-xs font-mono whitespace-nowrap shadow-sm"
              >
                {item}
              </div>
            ))
          )}
          <span
            style={{
              backgroundColor: 'var(--accent-amber-bg)',
              color: 'var(--accent-amber-text)',
              borderColor: 'var(--accent-amber-border)'
            }}
            className="text-[10px] font-bold font-mono px-2 py-1 rounded border"
          >
            TAIL (Вход)
          </span>
        </div>
        <span
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-2 font-mono"
        >
          FIFO: First In → First Out
        </span>
      </div>
    );
  };

  // Render Round Robin visualization
  const renderRoundRobinVisualization = () => {
    const customData = step.customData || {
      servers: ['app-1', 'app-2', 'app-3'],
      activeServer: 0,
      request: 'Req #1'
    };
    const servers: string[] = customData.servers || ['app-1', 'app-2', 'app-3'];
    const activeServerIdx: number = customData.activeServer ?? 0;

    return (
      <div className="flex flex-col items-center my-4 w-full gap-4">
        {/* Incoming Request */}
        <div
          style={{
            backgroundColor: 'var(--accent-amber-bg)',
            borderColor: 'var(--accent-amber-border)',
            color: 'var(--accent-amber-text)'
          }}
          className="px-4 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 animate-bounce shadow-sm"
        >
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
                style={{
                  backgroundColor: isActive ? 'var(--accent-emerald-bg)' : 'var(--card-subtle-bg)',
                  borderColor: isActive ? 'var(--accent-emerald-border)' : 'var(--card-border)',
                  color: isActive ? 'var(--accent-emerald-text)' : 'var(--text-secondary)'
                }}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all duration-300 shadow-sm ${
                  isActive ? 'ring-2 ring-emerald-500 scale-105 font-bold' : 'opacity-70'
                }`}
              >
                <Server size={22} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
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
        <div
          style={{ color: 'var(--text-secondary)' }}
          className="flex items-center gap-2 text-xs font-mono"
        >
          <Clock size={16} className="text-indigo-500" />
          <span>Стратегия Retry: Exponential Backoff + Full Jitter</span>
        </div>

        {/* Attempt Timeline */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full max-w-md overflow-x-auto py-2">
          {[0, 1, 2, 3].map((att) => {
            const isCurrent = customData.attempt === att;
            const isPast = customData.attempt > att;
            const delays = ['0s (Init)', '1.3s (~2⁰)', '2.5s (~2¹)', '4.8s (~2²)'];

            let stateStyle = {
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-muted)'
            };

            let customClass = '';

            if (isCurrent) {
              stateStyle = {
                backgroundColor: 'var(--accent-indigo-bg)',
                borderColor: 'var(--accent-indigo-border)',
                color: 'var(--accent-indigo-text)'
              };
              customClass = 'ring-2 ring-indigo-500 scale-105 font-bold';
            } else if (isPast) {
              stateStyle = {
                backgroundColor: 'var(--accent-rose-bg)',
                borderColor: 'var(--accent-rose-border)',
                color: 'var(--accent-rose-text)'
              };
              customClass = 'line-through opacity-70';
            }

            return (
              <div
                key={att}
                style={stateStyle}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center text-xs transition-all shadow-sm ${customClass}`}
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
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)'
      }}
      className="rounded-2xl border p-3.5 sm:p-5 shadow-lg backdrop-blur-md transition-colors"
    >
      {/* Title & Step Counter */}
      <div
        style={{ borderColor: 'var(--card-border)' }}
        className="flex items-center justify-between border-b pb-2.5 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span
            style={{ color: 'var(--text-primary)' }}
            className="font-semibold"
          >
            {title || 'Пошаговый визуализатор'}
          </span>
        </div>
        <div
          style={{
            backgroundColor: 'var(--card-subtle-bg)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--card-border)'
          }}
          className="font-mono font-bold px-2.5 py-0.5 rounded-full border text-[11px]"
        >
          Шаг {currentStepIdx + 1} / {steps.length}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="min-h-[160px] flex items-center justify-center">
        {renderVisualArea()}
      </div>

      {/* Description Callout */}
      <div
        style={{
          backgroundColor: 'var(--card-subtle-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-primary)'
        }}
        className="p-3 rounded-xl border mb-3 text-xs sm:text-sm leading-relaxed font-sans shadow-inner"
      >
        <div className="font-medium">{step.description}</div>
      </div>

      {/* Metrics Row if available */}
      {step.metrics && Object.keys(step.metrics).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3.5">
          {Object.entries(step.metrics).map(([k, v], idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)'
              }}
              className="p-2 rounded-lg border text-[11px] font-mono"
            >
              <span style={{ color: 'var(--text-muted)' }} className="block text-[10px]">
                {k}:
              </span>
              <span className="text-indigo-500 font-semibold truncate block">
                {String(v)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Controls Bar */}
      <div
        style={{ borderColor: 'var(--card-border)' }}
        className="flex items-center justify-between pt-2 border-t gap-2"
      >
        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <span style={{ color: 'var(--text-muted)' }} className="text-[11px] hidden sm:inline">
            Скорость:
          </span>
          {[
            { label: '0.5x', ms: 2000 },
            { label: '1x', ms: 1200 },
            { label: '2x', ms: 500 }
          ].map((sp) => (
            <button
              key={sp.label}
              onClick={() => setSpeedMs(sp.ms)}
              style={{
                backgroundColor: speedMs === sp.ms ? undefined : 'var(--card-subtle-bg)',
                borderColor: speedMs === sp.ms ? undefined : 'var(--card-border)',
                color: speedMs === sp.ms ? undefined : 'var(--text-secondary)'
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                speedMs === sp.ms
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'hover:opacity-90'
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
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="p-2 rounded-lg border active:scale-95 transition-all hover:opacity-90"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            id="viz-prev-btn"
            title="Шаг назад"
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="p-2 rounded-lg border disabled:opacity-30 active:scale-95 transition-all hover:opacity-90"
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
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="p-2 rounded-lg border disabled:opacity-30 active:scale-95 transition-all hover:opacity-90"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleJumpToEnd}
            id="viz-end-btn"
            title="В конец"
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="p-2 rounded-lg border active:scale-95 transition-all hidden sm:flex hover:opacity-90"
          >
            <FastForward size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
