import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "./services/supabase";
import { api } from "./services/api";
import Login from "./pages/Login";
import Sidebar from "./components/layout/Sidebar";
import ChunkPanel from "./components/tasks/ChunkPanel";
import CalendarView from "./views/CalendarView";
import AnalysisView from "./views/AnalysisView";
import SettingsModal from "./components/layout/SettingsModal";
import type {
  Task,
  TaskPriority,
  UserPreferences,
} from "./types";
import {
  Archive,
  Activity,
  Smile,
  Cloud,
  Sun,
  Calendar,
  ChevronRight,
  Lightbulb,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import type { Session } from "@supabase/supabase-js";
import FloatingTimer from "./components/common/FloatingTimer";
import ArchiveView from "./views/ArchiveView";
import { useToast } from "./context/ToastContext";
import { useTasks } from "./hooks/useTasks";
import JournalView from "./views/JournalView";
import GuideView from "./views/GuideView";
import { useSound } from "./hooks/useSound";

function App() {
  const { playClick, playTabs, playPop } = useSound();
  const { showToast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "journal" | "calendar" | "analysis" | "archive" | "guide"
  >("guide");

  const {
    tasks,
    setTasks,
    tasksRef,
    isScheduling,
    isClassifying,
    addTask,
    updateTask,
    deleteTask,
    handleSaveLog,
    handleSmartSchedule,
    handleAIExpand,
    updateChunk,
    addChunk,
    deleteChunk,
  } = useTasks(session);

  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    availableHours: {
      Monday: ["09:00", "17:00"],
      Tuesday: ["09:00", "17:00"],
      Wednesday: ["09:00", "17:00"],
      Thursday: ["09:00", "17:00"],
      Friday: ["09:00", "17:00"],
      Saturday: ["10:00", "14:00"],
      Sunday: ["10:00", "12:00"],
    },
    autoSchedule: false,
    soundEnabled: true,
  });
  const [moodIndex, setMoodIndex] = useState(0);
  const moods = [
    {
      icon: <Sun size={24} className="text-highlighter-yellow" />,
      label: "Radiant",
    },
    { icon: <Cloud size={24} className="text-ink-light" />, label: "Cloudy" },
    {
      icon: <Lightbulb size={24} className="text-highlighter-pink" />,
      label: "Charged",
    },
    { icon: <Smile size={24} className="text-green-500" />, label: "Content" },
  ];
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const editingTask = editingTaskId ? tasks.find(t => t.id === editingTaskId) ?? null : null;

  const taskStartTimeRef = React.useRef<number | null>(null);
  const sessionBaseTimeRef = React.useRef<number>(0);

  const runningTaskId = useMemo(
    () => tasks.find((t) => t.status === "running")?.id ?? null,
    [tasks]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) => {
        const runningTask = prevTasks.find((t) => t.status === "running");
        if (!runningTask || taskStartTimeRef.current === null) return prevTasks;

        const now = Date.now();
        const sessionElapsedSeconds = Math.floor(
          (now - taskStartTimeRef.current) / 1000,
        );
        const newTotal = sessionBaseTimeRef.current + sessionElapsedSeconds;

        if (runningTask.totalTimeSeconds === newTotal) return prevTasks;

        return prevTasks.map((t) =>
          t.id === runningTask.id
            ? { ...t, timeSpent: newTotal, totalTimeSeconds: newTotal }
            : t,
        );
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setTasks]);

  // Session tracking — anchors timer and saves progress logs on stop
  useEffect(() => {
    const runningTask = tasksRef.current.find((t) => t.status === "running");

    if (runningTask) {
      if (activeTaskId !== runningTask.id) {
        setSessionStartTime(new Date().toISOString());
        setActiveTaskId(runningTask.id);
        taskStartTimeRef.current = Date.now();
        sessionBaseTimeRef.current = runningTask.totalTimeSeconds || 0;
      }
    } else {
      if (activeTaskId && sessionStartTime) {
        const endTime = new Date().toISOString();
        const duration = Math.max(1, Math.floor(
          (new Date(endTime).getTime() - new Date(sessionStartTime).getTime()) /
            1000,
        ));

        if (duration > 0) {
          handleSaveLog(activeTaskId, {
            date: new Date().toISOString().split("T")[0],
            startTime: sessionStartTime,
            endTime: endTime,
            durationSeconds: duration,
          });

          const taskToUpdate = tasksRef.current.find(
            (t) => t.id === activeTaskId,
          );
          if (taskToUpdate) {
            api
              .upsertTask(taskToUpdate)
              .catch((e) => console.error("Final time save error:", e));
          }
        }
      }
      setSessionStartTime(null);
      setActiveTaskId(null);
      taskStartTimeRef.current = null;
      sessionBaseTimeRef.current = 0;
    }
  }, [runningTaskId, activeTaskId, sessionStartTime, handleSaveLog, tasksRef]);

  // Periodic database sync (10s) for running tasks
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const runningTask = tasksRef.current.find((t) => t.status === "running");
      if (runningTask && session) {
        api
          .upsertTask(runningTask)
          .catch((e) => console.error("Sync error:", e));
      }
    }, 10000);
    return () => clearInterval(syncInterval);
  }, [session, tasksRef]);

  // Sync on page leave — uses fetch+keepalive to include auth headers
  useEffect(() => {
    const handleUnload = () => {
      const runningTask = tasksRef.current.find((t) => t.status === "running");
      if (runningTask && session) {
        const apiUrl = import.meta.env.VITE_API_URL;
        fetch(`${apiUrl}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(runningTask),
          keepalive: true,
        });
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [session, tasksRef]);

  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        initPreferences();
        if (window.location.hash) {
          setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }, 0);
        }
      }
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        initPreferences();
        if (window.location.hash) {
          setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname + window.location.search);
          }, 0);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tasks are fetched by the useTasks hook when session changes — only load preferences here
  const initPreferences = async () => {
    try {
      const dbPrefs = await api.getPreferences();
      if (dbPrefs) {
        setPreferences(dbPrefs);
        localStorage.setItem('vellum_sound_enabled', String(dbPrefs.soundEnabled ?? true));
      }
    } catch (e) {
      console.error("Error loading preferences:", e);
    }
  };

  const handleScheduleTask = async (
    taskId: string,
    date: Date,
    hour: number,
  ) => {
    if (!session) return;
    const task = tasksRef.current.find((t) => t.id === taskId);
    const durationMin = task
      ? parseInt(task.estimatedTime.replace("m", "")) || 60
      : 60;

    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start.getTime() + durationMin * 60000);

    await updateTask(taskId, {
      scheduledStart: start.toISOString(),
      scheduledEnd: end.toISOString(),
    });
  };

  const handlePreferenceChange = async (newPrefs: UserPreferences) => {
    if (!session) return;
    setPreferences(newPrefs);
    localStorage.setItem('vellum_sound_enabled', String(newPrefs.soundEnabled));
    try {
      await api.updatePreferences(newPrefs);
    } catch (e) {
      console.error("Error updating preferences:", e);
    }
  };

  const handleUpdateProfile = async (name: string, avatarUrl: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatarUrl },
      });
      if (error) throw error;

      const {
        data: { session: newSession },
      } = await supabase.auth.refreshSession();
      setSession(newSession);
      showToast("Identity updated successfully.", "success");
    } catch (e: any) {
      console.error("Error updating profile:", e);
      showToast("Failed to update profile: " + e.message, "error");
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-paper-bg flex items-center justify-center">
        <div className="font-marker text-4xl animate-pulse">Opening your sketchbook...</div>
      </div>
    );
  }

  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-transparent text-ink selection:bg-highlighter-yellow/30 font-type overflow-x-hidden">
      <Sidebar
        user={{
          name: (session.user.user_metadata?.full_name as string) || "Human",
          email: session.user.email || "",
          avatar: (session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) as string,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={() => supabase.auth.signOut()}
        onSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={{
          name: (session.user.user_metadata?.full_name as string) || "Human",
          email: session.user.email || "",
          avatar: (session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture) as string,
        }}
        onUpdateProfile={handleUpdateProfile}
        preferences={preferences}
        onUpdatePreferences={handlePreferenceChange}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "ml-0"}`}
      >
        <nav className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-6 border-b-2 border-ink border-dashed bg-white/30 gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <button
              onClick={() => { playTabs(); setActiveTab("journal"); }}
              className={`flex items-center gap-2 font-hand text-xl md:text-2xl transition-all ${activeTab === "journal" ? "text-ink scale-110 underline decoration-wavy decoration-highlighter-yellow underline-offset-4" : "opacity-50 hover:opacity-100"}`}
            >
              <LayoutDashboard size={20} /> Canvas
            </button>
            <button
              onClick={() => { playTabs(); setActiveTab("calendar"); }}
              className={`flex items-center gap-2 font-hand text-xl md:text-2xl transition-all ${activeTab === "calendar" ? "text-ink scale-110 underline decoration-wavy decoration-highlighter-yellow underline-offset-4" : "opacity-50 hover:opacity-100"}`}
            >
              <Calendar size={20} /> Timeline
            </button>
            <button
              onClick={() => { playTabs(); setActiveTab("analysis"); }}
              className={`flex items-center gap-2 font-hand text-xl md:text-2xl transition-all ${activeTab === "analysis" ? "text-ink scale-110 underline decoration-wavy decoration-highlighter-yellow underline-offset-4" : "opacity-50 hover:opacity-100"}`}
            >
              <Activity size={20} /> Insights
            </button>
            <button
              onClick={() => { playTabs(); setActiveTab("archive"); }}
              className={`flex items-center gap-2 font-hand text-xl md:text-2xl transition-all ${activeTab === "archive" ? "text-ink scale-110 underline decoration-wavy decoration-highlighter-yellow underline-offset-4" : "opacity-50 hover:opacity-100"}`}
            >
              <Archive size={20} /> Vault
            </button>
            <button
              onClick={() => { playTabs(); setActiveTab("guide"); }}
              className={`flex items-center gap-2 font-hand text-xl md:text-2xl transition-all ${activeTab === "guide" ? "text-ink scale-110 underline decoration-wavy decoration-highlighter-yellow underline-offset-4" : "opacity-50 hover:opacity-100"}`}
            >
              <Sparkles size={20} /> Guide
            </button>
          </div>
          <button
            onClick={() => { playClick(); handleSmartSchedule(); }}
            disabled={isScheduling}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 sketch-border bg-ink text-white font-marker text-xl hover:bg-highlighter-yellow hover:text-ink transition-all ${isScheduling ? "animate-pulse" : ""}`}
          >
            <Lightbulb size={18} />{" "}
            {isScheduling ? "Thinking..." : "Smart Schedule"}
          </button>
        </nav>

        <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6 relative scroll-smooth bg-transparent">
          <div className="max-w-[1550px] mx-auto">
            {activeTab === "journal" && (
              <>
                <header className="mb-12">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                    <div className="w-full md:w-auto text-center md:text-left">
                      <h2 className="marker-text text-4xl md:text-5xl inline-block px-6 py-2 bg-highlighter-yellow -rotate-1">
                        Today's Canvas
                      </h2>
                      <p className="font-sketch text-lg md:text-xl text-ink-light mt-4 max-w-sm mx-auto md:ml-0">
                        Fill the page. Make it count.
                      </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
                      <div className="tape-effect bg-white sketch-border px-4 py-2 rotate-1 text-right flex flex-col items-end">
                        <span className="font-hand text-lg">Current Vibe</span>
                        <button
                          onClick={() => {
                            playClick();
                            setMoodIndex((prev) => (prev + 1) % moods.length);
                          }}
                          className="flex items-center gap-2 mt-1 hover:scale-110 transition-transform"
                        >
                          {moods[moodIndex].icon}
                          <span className="font-marker text-xl">
                            {moods[moodIndex].label}
                          </span>
                        </button>
                      </div>
                      <div className="sketch-border bg-white px-4 py-1 -rotate-2">
                        <span className="font-hand font-bold text-xl uppercase tracking-widest">
                          {new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </header>
                <JournalView
                  tasks={tasks}
                  onAddTask={async (deck) => {
                    const newTask = await addTask(deck);
                    if (newTask && newTask.chunks && newTask.chunks.length > 0) {
                      setSelectedTask(newTask);
                    }
                    return newTask;
                  }}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onSelectTask={setSelectedTask}
                  onEditTask={(task: Task) => setEditingTaskId(task.id)}
                  isClassifying={isClassifying}
                  onTabChange={setActiveTab}
                />
              </>
            )}

            {activeTab === "calendar" && (
              <CalendarView
                tasks={tasks}
                preferences={preferences}
                onUpdatePreferences={handlePreferenceChange}
                onAddTaskAtTime={(date: Date, hour: number) => {
                  console.log("Add task at", date, hour);
                  // This could be improved to open Journal with pre-filled date
                  setActiveTab("journal");
                }}
                onTaskClick={(task: Task) => setEditingTaskId(task.id)}
                onScheduleTask={handleScheduleTask}
                onDeleteTask={deleteTask}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === "analysis" && <AnalysisView tasks={tasks} />}
            {activeTab === "archive" && (
              <ArchiveView
                tasks={tasks}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            )}
            {activeTab === "guide" && <GuideView />}
          </div>
        </main>
      </div>

      <FloatingTimer
        task={tasks.find((t) => t.status === "running") || null}
        onUpdate={updateTask}
      />

      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-ink/70 backdrop-blur-md">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="sketch-border p-6 md:p-8 bg-white transform -rotate-1 relative shadow-2xl m-4">
              <button
                onClick={() => { playPop(); setEditingTaskId(null); }}
                className="absolute -top-4 -right-4 bg-ink text-white p-2 sketch-border hover:bg-highlighter-pink hover:text-ink transition-all"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>

              <h3 className="marker-text text-4xl mb-8 flex items-center gap-4">
                <Lightbulb className="text-highlighter-yellow" />
                Refine Task
              </h3>

              <div className="space-y-6">
                {/* Description */}
                <div className="flex flex-col">
                  <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                    The Goal
                  </label>
                  <input
                    value={editingTask.description}
                    onChange={(e) =>
                      updateTask(editingTask.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full text-3xl font-hand p-2 border-b-2 border-ink focus:outline-none focus:border-highlighter-pink bg-transparent"
                  />
                </div>

                {/* Deadline + Estimated Time */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={editingTask.deadline ? new Date(editingTask.deadline)
                        .toISOString()
                        .slice(0, 16) : ''}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const now = new Date();
                        if (selectedDate <= now) {
                          showToast("Deadline must be in the future!", "error");
                          return;
                        }
                        updateTask(editingTask.id, { deadline: e.target.value });
                      }}
                      className="font-hand text-xl p-2 border-b-2 border-ink focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Estimated Time (mins)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={parseInt(editingTask.estimatedTime) || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val < 1 || isNaN(val)) {
                          showToast("Duration must be at least 1 minute.", "error");
                          return;
                        }
                        updateTask(editingTask.id, {
                          estimatedTime: `${e.target.value}m`,
                        });
                      }}
                      className="font-hand text-xl p-2 border-b-2 border-ink focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Skill Level */}
                <div className="flex flex-col">
                  <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                    Current Mastery
                  </label>
                  <select
                    value={editingTask.skillLevel}
                    onChange={(e) => {
                      playClick();
                      updateTask(editingTask.id, { skillLevel: e.target.value });
                    }}
                    className="font-hand text-xl p-2 border-b-2 border-ink focus:outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="total_novice">Total Novice</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="master">Master</option>
                  </select>
                </div>

                {/* Priority */}
                <div className="flex flex-col">
                  <label className="font-sketch text-xs uppercase opacity-40 ml-1 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          playClick();
                          updateTask(editingTask.id, { priority: p });
                        }}
                        className={`px-4 py-1 sketch-border font-hand text-lg capitalize transition-all ${editingTask.priority === p ? "bg-highlighter-yellow scale-110 shadow-lg" : "bg-white opacity-40"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scheduling Params */}
                <div className="pt-4 border-t border-ink/10 grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Daily Repeats ({editingTask.targetSessionsPerDay || 1}x)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={editingTask.targetSessionsPerDay || 1}
                      onChange={(e) => {
                        playClick();
                        updateTask(editingTask.id, {
                          targetSessionsPerDay: parseInt(e.target.value),
                        });
                      }}
                      className="accent-ink cursor-pointer mt-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Min Spacing ({editingTask.minSpacingMinutes || 60}m)
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="480"
                      step="15"
                      value={editingTask.minSpacingMinutes || 60}
                      onChange={(e) => {
                        playClick();
                        updateTask(editingTask.id, {
                          minSpacingMinutes: parseInt(e.target.value),
                        });
                      }}
                      className="accent-ink cursor-pointer mt-2"
                    />
                  </div>
                </div>

                {/* Predicted Satisfaction */}
                <div className="pt-4 border-t border-ink/10">
                  <label className="font-sketch text-xs uppercase opacity-40 ml-1 block mb-2">
                    Predicted Satisfaction ({editingTask.predictedSatisfaction ?? 50}%)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="font-hand text-sm opacity-50">Meh</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editingTask.predictedSatisfaction ?? 50}
                      onChange={(e) => {
                        playClick();
                        updateTask(editingTask.id, {
                          predictedSatisfaction: parseInt(e.target.value),
                        });
                      }}
                      className="w-full accent-highlighter-pink cursor-pointer"
                    />
                    <span className="font-hand text-sm opacity-50">Joy!</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex justify-between items-center pt-6 border-t border-ink/10">
                  <button
                    onClick={() => {
                      playClick();
                      deleteTask(editingTask.id);
                      setEditingTaskId(null);
                    }}
                    className="text-red-500 font-hand text-lg hover:underline underline-offset-4 opacity-60 hover:opacity-100"
                  >
                    Delete Task
                  </button>
                  <button
                    onClick={() => { playClick(); setEditingTaskId(null); }}
                    className="px-6 py-2 md:px-10 md:py-3 sketch-border bg-ink text-white font-marker text-xl md:text-2xl hover:bg-highlighter-yellow hover:text-ink transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                  >
                    Save  
                  </button>
                </div>

                {(editingTask.scheduledStart || editingTask.scheduledEnd) && (
                  <div className="pt-4 border-t-2 border-dashed border-ink/10 flex justify-end">
                    <button
                      onClick={() => {
                        playClick();
                        updateTask(editingTask.id, {
                          scheduledStart: undefined,
                          scheduledEnd: undefined,
                        });
                        setEditingTaskId(null);
                        showToast("Task removed from the timeline.", "success");
                      }}
                      className="text-red-500 font-hand text-lg hover:underline underline-offset-4 opacity-60 hover:opacity-100 flex items-center gap-2"
                    >
                      Remove from Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ChunkPanel
        task={tasks.find((t) => t.id === selectedTask?.id) || null}
        onClose={() => setSelectedTask(null)}
        onUpdateChunk={updateChunk}
        onAddChunk={addChunk}
        onDeleteChunk={deleteChunk}
        onAIExpand={handleAIExpand}
        isClassifying={isClassifying}
      />
    </div>
  );
}

export default App;
