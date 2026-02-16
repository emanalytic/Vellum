import React, { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, UserPreferences } from "../types";
import { useSound } from "../hooks/useSound";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Clock,
  Moon,
  Sun,
  Plus,
  Check,
  Pin,
  X,
} from "lucide-react";

interface CalendarViewProps {
  tasks: Task[];
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  onAddTaskAtTime?: (date: Date, hour: number) => void;
  onTaskClick?: (task: Task) => void;
  onScheduleTask?: (taskId: string, date: Date, hour: number) => void;
  onTabChange?: (tab: any) => void;
}

const HOUR_HEIGHT = 60; // px per hour row — single source of truth

const formatHour = (h: number) => {
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12} ${ampm}`;
};

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  preferences,
  onUpdatePreferences,
  onAddTaskAtTime,
  onTaskClick,
  onScheduleTask,
  onTabChange,
}) => {
  const { playClick, playTabs, playPop } = useSound();
  const [view, setView] = useState<"day" | "week">("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const getDayName = useCallback(
    (date: Date) => date.toLocaleDateString("en-US", { weekday: "long" }),
    [],
  );
  const dayName = getDayName(currentDate);
  const dayAvailability = preferences.availableHours[dayName] || [
    "09:00",
    "17:00",
  ];
  const startHourVal = parseInt(dayAvailability[0].split(":")[0]);
  const isNightOwl = startHourVal >= 11;

  const hourSequence = useMemo(() => {
    const startStr = (preferences.availableHours[getDayName(currentDate)] || [
      "09:00",
      "17:00",
    ])[0];
    const startHour = parseInt(startStr.split(":")[0]);
    const seq: number[] = [];
    for (let i = 0; i < 24; i++) {
      seq.push((startHour + i) % 24);
    }
    return seq;
  }, [preferences.availableHours, currentDate, getDayName]);

  // Check if an hour falls within the available window (handles overnight like 14:00→02:00)
  const isHourAvailable = useCallback(
    (h: number, day: string): boolean => {
      const [start, end] = preferences.availableHours[day] || [
        "09:00",
        "17:00",
      ];
      const startH = parseInt(start.split(":")[0]);
      const endH = parseInt(end.split(":")[0]);
      if (startH === endH) return false;
      if (startH < endH) return h >= startH && h < endH;
      return h >= startH || h < endH;
    },
    [preferences.availableHours],
  );

  // Tasks scheduled for the current day
  const scheduledTasks = useMemo(
    () =>
      tasks.filter((t) => {
        if (!t.scheduledStart || !t.scheduledEnd) return false;
        const taskDate = new Date(t.scheduledStart);
        return taskDate.toDateString() === currentDate.toDateString();
      }),
    [tasks, currentDate],
  );

  const unscheduledTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !t.scheduledStart &&
          t.status !== "completed" &&
          t.status !== "archived",
      ),
    [tasks],
  );

  // Position tasks in columns to avoid visual overlap
  const positionedTasks = useMemo(() => {
    if (scheduledTasks.length === 0) return [];

    const sorted = [...scheduledTasks].sort(
      (a, b) =>
        new Date(a.scheduledStart!).getTime() -
        new Date(b.scheduledStart!).getTime(),
    );

    // Build clusters of overlapping tasks
    const clusters: Task[][] = [];
    for (const t of sorted) {
      const tStart = new Date(t.scheduledStart!).getTime();
      const lastCluster = clusters[clusters.length - 1];

      if (!lastCluster) {
        clusters.push([t]);
        continue;
      }

      // Check if this task overlaps with ANY task in the last cluster
      const clusterEnd = Math.max(
        ...lastCluster.map((ct) => new Date(ct.scheduledEnd!).getTime()),
      );
      if (tStart < clusterEnd) {
        lastCluster.push(t);
      } else {
        clusters.push([t]);
      }
    }

    // Assign columns within each cluster
    const result: (Task & { _col: number; _maxCol: number })[] = [];

    for (const cluster of clusters) {
      const columns: Task[][] = [];
      const taskCols: Map<string, number> = new Map();

      for (const t of cluster) {
        const tStart = new Date(t.scheduledStart!).getTime();
        let placed = false;

        for (let ci = 0; ci < columns.length; ci++) {
          const lastInCol = columns[ci][columns[ci].length - 1];
          if (tStart >= new Date(lastInCol.scheduledEnd!).getTime()) {
            columns[ci].push(t);
            taskCols.set(t.id, ci);
            placed = true;
            break;
          }
        }

        if (!placed) {
          columns.push([t]);
          taskCols.set(t.id, columns.length - 1);
        }
      }

      const maxCol = columns.length;
      for (const t of cluster) {
        result.push({ ...t, _col: taskCols.get(t.id) || 0, _maxCol: maxCol });
      }
    }

    return result;
  }, [scheduledTasks]);

  // Calculate pixel position for a task based on its time + the hourSequence
  const getTaskStyle = useCallback(
    (task: Task & { _col: number; _maxCol: number }): React.CSSProperties => {
      const start = new Date(task.scheduledStart!);
      const end = new Date(task.scheduledEnd!);
      const taskStartHour = start.getHours();

      // Find this hour's index in our sequence
      let seqIndex = hourSequence.indexOf(taskStartHour);
      if (seqIndex === -1) {
        const seqStart = hourSequence[0];
        seqIndex = (taskStartHour - seqStart + 24) % 24;
      }

      const startMinutes = start.getMinutes();
      const durationMinutes = Math.max(
        (end.getTime() - start.getTime()) / 60000,
        15,
      );

      const top = seqIndex * HOUR_HEIGHT + (startMinutes / 60) * HOUR_HEIGHT;
      const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 20);

      const totalCols = task._maxCol || 1;
      const col = task._col || 0;
      const colWidth = 100 / totalCols;
      const left = col * colWidth;
      // Always have a small gap for visual "card" look
      const gap = 2;

      return {
        position: "absolute" as const,
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${left}% + ${gap}px)`,
        width: `calc(${colWidth}% - ${gap * 2}px)`,
        zIndex: 20,
      };
    },
    [hourSequence],
  );

  const updateDayAvailability = useCallback(
    (day: string, type: "start" | "end", value: string) => {
      const newHours = { ...preferences.availableHours };
      const current = [...(newHours[day] || ["09:00", "17:00"])];
      if (type === "start") current[0] = value;
      else current[1] = value;
      newHours[day] = current;
      onUpdatePreferences({ ...preferences, availableHours: newHours });
    },
    [preferences, onUpdatePreferences],
  );

  const setNightOwlPreset = useCallback(() => {
    const hours: Record<string, [string, string]> = {};
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      hours[day] = ["14:00", "02:00"];
    });
    onUpdatePreferences({ ...preferences, availableHours: hours });
  }, [preferences, onUpdatePreferences]);

  const setEarlyBirdPreset = useCallback(() => {
    const hours: Record<string, [string, string]> = {};
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].forEach((day) => {
      hours[day] = ["07:00", "19:00"];
    });
    onUpdatePreferences({ ...preferences, availableHours: hours });
  }, [preferences, onUpdatePreferences]);

  const randomQuote = useMemo(() => {
    const q = [
      "Time is the brush. The day is the canvas.",
      "A plan is just a sketch of your future success.",
      "Success is a series of small wins.",
      "Nature abhors a vacuum. Fill your slots.",
      "Schedule your priorities, don't prioritize your schedule.",
    ];
    return q[Math.floor(Math.random() * q.length)];
  }, []);

  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [currentDate]);

  const navigateDate = useCallback(
    (direction: number) => {
      const days = view === "day" ? 1 : 7;
      setCurrentDate((prev) => {
        const next = new Date(prev);
        next.setDate(prev.getDate() + direction * days);
        return next;
      });
    },
    [view],
  );

  const handleSlotClick = useCallback((h: number) => {
    setActiveSlot((prev) => (prev === h ? null : h));
  }, []);

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-highlighter-pink";
      case "medium":
        return "border-l-highlighter-yellow";
      default:
        return "border-l-green-400";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50";
      case "medium":
        return "bg-yellow-50/50";
      default:
        return "bg-green-50/30";
    }
  };

  const gridTotalHeight = 24 * HOUR_HEIGHT;

  return (
    <div className="flex flex-col gap-4 pb-10 relative w-full max-w-full mx-auto px-2 md:px-0">
      {/* ─── Header ─── */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-end gap-4 p-4 bg-white sketch-border border-ink shadow-sm">
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
          <h2 className="marker-text text-3xl md:text-5xl inline-block px-4 py-1 bg-highlighter-yellow shadow-sketch rotate-1">
            The Blueprint
          </h2>
          <div className="flex gap-4 md:gap-8 mt-4 font-hand text-xl md:text-2xl text-ink-light ml-2">
            <button
                onClick={() => { playClick(); setView("day"); }}
                className={`px-4 py-1 font-marker text-sm transition-all ${
                  view === "day"
                    ? "bg-ink text-white rotate-1"
                    : "bg-white text-ink hover:bg-highlighter-yellow/30"
                }`}
              >
                Day
              </button>
              <button
                onClick={() => { playClick(); setView("week"); }}
                className={`px-4 py-1 font-marker text-sm transition-all ${
                  view === "week"
                    ? "bg-ink text-white -rotate-1"
                    : "bg-white text-ink hover:bg-highlighter-yellow/30"
                }`}
              >
                Week
              </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white p-3 sketch-border shadow-md">
          <button
            onClick={() => { playClick(); setNightOwlPreset(); }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 sketch-border transition-all text-sm md:text-base ${isNightOwl ? "bg-ink text-white shadow-lg" : "hover:bg-highlighter-yellow bg-white"}`}
          >
            <Moon
              size={16}
              className={isNightOwl ? "text-highlighter-yellow" : ""}
            />
            <span className="font-hand text-lg md:text-xl">Night Owl</span>
          </button>
          <button
            onClick={() => { playClick(); setEarlyBirdPreset(); }}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 sketch-border transition-all text-sm md:text-base ${!isNightOwl ? "bg-ink text-white shadow-lg" : "hover:bg-highlighter-yellow bg-white"}`}
          >
            <Sun
              size={16}
              className={!isNightOwl ? "text-highlighter-yellow" : ""}
            />
            <span className="font-hand text-lg md:text-xl">Early Bird</span>
          </button>
        </div>

        {/* Date Nav */}
        <div className="flex items-center justify-between xl:justify-center gap-3 sketch-border bg-white px-4 py-2 shadow-lg -rotate-1 self-center xl:self-auto">
          <button
            onClick={() => { playTabs(); navigateDate(-1); }}
            className="p-2 hover:bg-highlighter-pink/20 rounded-full transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-center min-w-[140px]">
            <div className="font-sketch text-[10px] md:text-xs uppercase opacity-40 font-black">
              {view === "day"
                ? dayName
                : `Week of ${weekDates[0].toLocaleDateString([], { month: "short", day: "numeric" })}`}
            </div>
            <div className="font-type font-bold text-xl md:text-2xl">
              {currentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <button
            onClick={() => { playTabs(); navigateDate(1); }}
            className="p-2 hover:bg-highlighter-pink/20 rounded-full transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex flex-col lg:flex-row gap-4 w-full min-h-[600px] lg:h-[800px]">
        {/* Calendar Grid */}
        <div className="flex-1 sketch-border bg-white relative overflow-hidden flex flex-col shadow-2xl min-h-[500px]">
          {/* Sticky Quote - Day View Only */}
          {view === "day" && (
            <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-highlighter-yellow/95 p-4 pt-10 sketch-border rotate-2 z-30 shadow-xl max-w-[160px] md:max-w-[200px] border-t-[16px] border-t-ink/10 hidden sm:block pointer-events-none">
              <Pin
                size={24}
                className="absolute top-1 left-1/2 -translate-x-1/2 text-ink/40"
              />
              <p className="font-hand text-base md:text-lg leading-tight text-ink font-bold italic">
                "{randomQuote}"
              </p>
            </div>
          )}

          {view === "day" ? (
            /* ─── DAY VIEW ─── */
            <div
              ref={gridRef}
              className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar"
            >
              <div
                className="flex"
                style={{ minHeight: `${gridTotalHeight}px` }}
              >
                {/* Timeline Labels Column */}
                <div className="w-14 md:w-[72px] shrink-0 border-r-2 border-ink bg-white sticky left-0 z-10 select-none">
                  {hourSequence.map((h) => {
                    const available = isHourAvailable(h, dayName);
                    return (
                      <div
                        key={`label-${h}`}
                        onClick={() => { playPop(); handleSlotClick(h); }}
                        className={`relative flex items-start justify-end pr-2 md:pr-3 font-mono text-[9px] md:text-xs font-black border-b border-ink/10 cursor-pointer hover:bg-highlighter-yellow/30 transition-colors ${
                          available
                            ? "text-green-700 bg-green-50/30"
                            : "text-ink/20 bg-ink/[0.03]"
                        }`}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                      >
                        <span className="relative -top-[7px] bg-inherit px-0.5 leading-none whitespace-nowrap">
                          {formatHour(h)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex-1 relative">
                  {hourSequence.map((h) => {
                    const available = isHourAvailable(h, dayName);
                    return (
                      <div
                        key={`slot-${h}`}
                        onClick={() => { playPop(); handleSlotClick(h); }}
                        className={`border-b border-ink/10 cursor-pointer transition-colors group relative ${
                          available
                            ? "bg-green-50/30 hover:bg-green-100/40"
                            : "bg-ink/2 hover:bg-ink/5"
                        } ${activeSlot === h ? "bg-highlighter-yellow/15 ring-1 ring-inset ring-highlighter-yellow/50" : ""}`}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                      >
                        {available && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400/60" />
                        )}
                        <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-linear-to-l from-white/80 to-transparent">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playPop();
                              handleSlotClick(h);
                            }}
                            className="p-1 rounded-full bg-highlighter-yellow hover:scale-110 transition-transform shadow-sm border border-ink/10"
                            title="Add another task to this hour"
                          >
                            <Plus size={14} className="text-ink" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Scheduled Tasks Layer - absolutely positioned over the grid rows */}
                  {positionedTasks.map((task) => {
                    const style = getTaskStyle(task);
                    const heightNum = parseFloat(String(style.height));
                    const isCompact = heightNum < 36;
                    const isTiny = heightNum < 24;

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick?.(task);
                        }}
                        className={`rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all border-2 border-ink/15 hover:border-ink/40 shadow-sm hover:shadow-md group/task border-l-4 ${getPriorityBorderColor(task.priority)} ${getPriorityBg(task.priority)}`}
                        style={style}
                      >
                        <div
                          className={`flex-1 flex flex-col justify-center px-1.5 md:px-2 ${isTiny ? "py-0" : "py-1"}`}
                        >
                          <div className="flex justify-between items-start gap-1 min-w-0">
                            <p
                              className={`marker-text leading-tight flex-1 truncate ${isTiny ? "text-[9px]" : isCompact ? "text-[11px]" : "text-xs md:text-sm"}`}
                            >
                              {task.description}
                            </p>
                            {!isTiny && task._maxCol <= 2 && (
                              <Clock
                                size={isCompact ? 9 : 12}
                                className="text-ink/20 group-hover/task:text-highlighter-pink transition-colors shrink-0 mt-0.5"
                              />
                            )}
                          </div>
                          {!isCompact && task._maxCol <= 2 && (
                            <div className="flex justify-between items-center opacity-80 font-sketch text-[7px] md:text-[9px] pt-0.5 mt-auto">
                              <span className="font-bold">
                                {new Date(
                                  task.scheduledStart!,
                                ).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </span>
                              <div className="flex items-center gap-1">
                                {task.status === "completed" && (
                                  <Check size={8} className="text-green-600" />
                                )}
                                <span className="bg-ink text-white px-1 py-px uppercase text-[6px] md:text-[7px] font-black rounded-[2px]">
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Current Time Indicator */}
                  {currentDate.toDateString() === new Date().toDateString() &&
                    (() => {
                      const now = new Date();
                      const nowHour = now.getHours();
                      let seqIdx = hourSequence.indexOf(nowHour);
                      if (seqIdx === -1) {
                        const seqStart = hourSequence[0];
                        seqIdx = (nowHour - seqStart + 24) % 24;
                      }
                      const topPx =
                        seqIdx * HOUR_HEIGHT +
                        (now.getMinutes() / 60) * HOUR_HEIGHT;
                      return (
                        <div
                          className="absolute left-0 right-0 z-[25] pointer-events-none flex items-center"
                          style={{ top: `${topPx}px` }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-highlighter-pink border-2 border-white shadow-md -ml-1 shrink-0" />
                          <div className="flex-1 h-[2px] bg-highlighter-pink/70" />
                        </div>
                      );
                    })()}
                </div>
              </div>
            </div>
          ) : (
            /* ─── WEEK VIEW ─── */
            <div className="flex flex-1 overflow-x-auto p-3 gap-3 custom-scrollbar bg-paper-bg/30">
              {weekDates.map((date) => {
                const dName = getDayName(date);
                const dayTasks = tasks.filter((t) => {
                  if (t.scheduledStart) {
                    return (
                      new Date(t.scheduledStart).toDateString() ===
                      date.toDateString()
                    );
                  }
                  return (
                    t.deadline &&
                    new Date(t.deadline).toDateString() === date.toDateString()
                  );
                });
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={date.toISOString()}
                    className={`flex-1 min-w-[150px] md:min-w-[180px] flex flex-col bg-white sketch-border p-3 border-dashed shadow-md ${isToday ? "ring-2 ring-highlighter-pink" : ""}`}
                  >
                    <div
                      className={`text-center border-b-4 border-ink pb-2 mb-3 ${isToday ? "bg-highlighter-yellow/20 -mx-3 px-3 pt-1" : ""}`}
                    >
                      <span className="font-sketch text-[10px] uppercase block opacity-40 font-black">
                        {dName.slice(0, 3)}
                      </span>
                      <span className="font-type font-black text-2xl md:text-3xl">
                        {date.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                      {dayTasks.length === 0 && (
                        <p className="text-center font-hand text-sm opacity-20 italic py-6">
                          Empty canvas
                          {onTabChange && (
                            <button
                              onClick={() => onTabChange("guide")}
                              className="block mx-auto mt-2 text-xs text-highlighter-pink hover:underline"
                            >
                              Need help?
                            </button>
                          )}
                        </p>
                      )}
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick?.(task)}
                          className={`p-2.5 sketch-border bg-white text-xs shadow-sm hover:scale-[1.03] transition-transform cursor-pointer border-l-[6px] ${
                            task.priority === "high"
                              ? "border-l-highlighter-pink"
                              : task.priority === "medium"
                                ? "border-l-highlighter-yellow"
                                : "border-l-green-400"
                          }`}
                        >
                          <p className="font-hand text-base md:text-lg font-bold leading-tight line-clamp-2">
                            {task.description}
                          </p>
                          {task.scheduledStart && (
                            <p className="font-mono text-[9px] mt-1 opacity-50">
                              {new Date(task.scheduledStart).toLocaleTimeString(
                                [],
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Sidebar: Availability Windows ─── */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0">
          <div className="sketch-border bg-white p-4 md:p-5 shadow-2xl relative flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Settings
                size={20}
                className="text-highlighter-pink animate-spin-slow"
              />
              <h3 className="font-marker text-xl md:text-2xl">WIN-DOWS</h3>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-[450px] lg:max-h-none custom-scrollbar">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <div
                  key={day}
                  className="bg-paper-bg/5 p-2 border-b border-ink/5 flex flex-col gap-1"
                >
                  <label className="font-sketch text-[9px] md:text-[10px] uppercase opacity-60 font-black tracking-widest">
                    {day}
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-white p-1 sketch-border border-dashed border">
                      <input
                        type="time"
                        value={preferences.availableHours[day]?.[0] || "09:00"}
                        onChange={(e) =>
                          updateDayAvailability(day, "start", e.target.value)
                        }
                        className="w-full font-mono text-xs focus:outline-none bg-transparent"
                      />
                    </div>
                    <span className="opacity-40 text-[8px] font-black">TO</span>
                    <div className="flex-1 bg-white p-1 sketch-border border-dashed border">
                      <input
                        type="time"
                        value={preferences.availableHours[day]?.[1] || "17:00"}
                        onChange={(e) =>
                          updateDayAvailability(day, "end", e.target.value)
                        }
                        className="w-full font-mono text-xs focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 pt-3 border-t-2 border-ink/10 border-dashed space-y-2">
              <div className="flex justify-between items-center font-sketch text-xs opacity-60">
                <span>Scheduled today</span>
                <span className="font-bold text-ink">
                  {scheduledTasks.length}
                </span>
              </div>
              <div className="flex justify-between items-center font-sketch text-xs opacity-60">
                <span>Unscheduled</span>
                <span className="font-bold text-highlighter-pink">
                  {unscheduledTasks.length}
                </span>
              </div>
              <p className="font-hand text-xs opacity-40 italic text-center pt-2">
                "Sketch your boundaries. Respect your rest."
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── SLOT ASSIGNMENT MODAL ─── */}
      <AnimatePresence>
        {activeSlot !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-sm"
            onClick={() => setActiveSlot(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white border-4 border-ink shadow-[12px_12px_0_rgba(0,0,0,0.9)] p-5 sm:p-8 relative overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-highlighter-yellow via-highlighter-pink to-highlighter-yellow" />

              {/* Close Button */}
              <button
                onClick={() => setActiveSlot(null)}
                className="absolute top-3 right-3 p-1.5 hover:bg-ink/10 rounded-full transition-colors z-10"
              >
                <X size={20} className="text-ink/50" />
              </button>

              {/* Header */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-ink/10 pb-4 pr-8">
                <div>
                  <h4 className="font-marker text-2xl sm:text-3xl leading-none">
                    COMMIT TO THE SLOT
                  </h4>
                  <p className="font-sketch text-[10px] uppercase opacity-40 mt-1 tracking-widest">
                    {getDayName(currentDate)} •{" "}
                    {currentDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-ink text-white px-3 py-1.5 font-mono text-xl sm:text-2xl rotate-2 flex flex-col items-center shrink-0">
                  <span className="text-[9px] opacity-50 font-sketch uppercase">
                    Start
                  </span>
                  {formatHour(activeSlot)}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {/* New Task Button */}
                <button
                  onClick={() => {
                    playPop();
                    onAddTaskAtTime?.(currentDate, activeSlot);
                    setActiveSlot(null);
                  }}
                  className="w-full text-left p-4 font-hand text-xl sm:text-2xl bg-highlighter-yellow/20 hover:bg-highlighter-yellow/50 transition-all sketch-border border-dashed flex items-center gap-4 group relative overflow-hidden"
                >
                  <div className="bg-white/60 p-2 sketch-border group-hover:bg-white transition-colors shrink-0">
                    <Plus
                      size={24}
                      className="group-hover:rotate-90 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="block font-bold">New Pursuit</span>
                    <span className="block text-xs font-sketch uppercase opacity-60">
                      Draft from scratch
                    </span>
                  </div>
                </button>

                {/* Existing Tasks */}
                <div className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-ink/10" />
                    <p className="font-sketch text-[10px] uppercase opacity-40 tracking-widest whitespace-nowrap">
                      Awaiting Assignment
                    </p>
                    <div className="h-px flex-1 bg-ink/10" />
                  </div>

                  {unscheduledTasks.length === 0 ? (
                    <div className="text-center py-8 opacity-30">
                      <Clock size={32} className="mx-auto mb-2" />
                      <p className="font-hand text-lg italic">
                        No tasks awaiting timing...
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {unscheduledTasks.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onScheduleTask?.(t.id, currentDate, activeSlot!);
                            setActiveSlot(null);
                          }}
                          className="w-full text-left p-3 font-hand bg-white hover:bg-highlighter-pink/5 transition-all border-2 border-ink group flex justify-between items-center shadow-[3px_3px_0_rgba(0,0,0,0.8)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_rgba(0,0,0,0.8)]"
                        >
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-lg sm:text-xl font-bold leading-tight group-hover:underline underline-offset-4 truncate">
                              {t.description}
                            </span>
                            <span className="text-[10px] font-sketch opacity-50 uppercase tracking-tighter">
                              {t.estimatedTime} estimated
                            </span>
                          </div>
                          <span
                            className={`ml-2 shrink-0 bg-ink text-white text-[9px] px-2 py-0.5 font-sketch uppercase border-l-4 ${
                              t.priority === "high"
                                ? "border-l-highlighter-pink"
                                : t.priority === "medium"
                                  ? "border-l-highlighter-yellow"
                                  : "border-l-green-400"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-ink/10">
                <button
                  onClick={() => setActiveSlot(null)}
                  className="w-full py-3 font-marker text-xl bg-white hover:bg-ink hover:text-white transition-all border-2 border-ink shadow-[6px_6px_0_rgba(0,0,0,0.9)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
