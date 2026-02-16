import { useState, useCallback, useEffect, useRef } from "react";
import { api } from "../services/api";
import type { Task, TaskHistory, TaskChunk } from "../types";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import type { Session } from "@supabase/supabase-js";

export const useTasks = (session: Session | null) => {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const fetchTasks = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const dbTasks = await api.getTasks();
      setTasks(dbTasks);
    } catch (e) {
      console.error("Error fetching tasks:", e);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const fetchChunks = useCallback(async (description: string, skill: string) => {
    const data = await api.classifyTask(description, skill);
    return (data.suggested_chunks || []).map((c: { chunk_name?: string; title?: string; estimated_duration_min: number }) => ({
      id: crypto.randomUUID(),
      chunk_name: c.chunk_name || c.title,
      duration: c.estimated_duration_min,
      completed: false,
    }));
  }, []);

  useEffect(() => {
    if (session) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [session, fetchTasks]);

  const addTask = async (deck: {
    description: string;
    skillLevel: string;
    priority: string;
    deadline: string;
    estimatedTime: string;
    wantsChunks: boolean;
    predictedSatisfaction?: number;
  }) => {
    if (!session) return;
    if (!deck.deadline) {
      showToast("A deadline is essential to your journey.", "error");
      return;
    }

    setIsClassifying(true);
    try {
      let chunks: TaskChunk[] = [];
      let aiLimitReached = false;

      if (deck.wantsChunks) {
        try {
          chunks = await fetchChunks(deck.description, deck.skillLevel);
        } catch (e: any) {
          if (e.message?.includes("Daily AI limit reached")) {
            aiLimitReached = true;
            // We'll show a combined message at the end
          } else {
            throw e; 
          }
        }
      }

      const newTask: Task = {
        id: crypto.randomUUID(),
        description: deck.description,
        skillLevel: deck.skillLevel,
        priority: deck.priority as any,
        deadline: new Date(deck.deadline).toISOString(),
        estimatedTime: `${deck.estimatedTime}m`,
        status: "idle",
        timeSpent: 0,
        totalTimeSeconds: 0,
        chunks: chunks,
        history: [],
        predictedSatisfaction: deck.predictedSatisfaction,
      };

      await api.upsertTask(newTask);
      setTasks(prev => [newTask, ...prev]);
      
      if (aiLimitReached) {
        showToast("Task saved manually. (Daily AI limit reached)", "success");
      } else {
        showToast("Task added!", "success");
      }
      return newTask;
    } catch (e: any) {
      console.error("Error adding task:", e);
      showToast("Failed to save task: " + (e.message || "Something went wrong."), "error");
    } finally {
      setIsClassifying(false);
    }
  };

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const originalTasks = [...tasksRef.current];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    if (session) {
      try {
        const taskToUpdate = tasksRef.current.find(t => t.id === id);
        if (taskToUpdate) {
          const finalTask = { ...taskToUpdate, ...updates };
          await api.upsertTask(finalTask);
        }
      } catch (e) {
        console.error("Update error:", e);
        setTasks(originalTasks);
        showToast("Ink ran out. Try again?", "error");
      }
    }
  }, [session, showToast]);

  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasksRef.current.find(t => t.id === id);
    if (!taskToDelete) return;

    const confirmed = await confirm({
      title: 'Wanna Burn this?',
      message: `Are you sure you want to erase "${taskToDelete.description}" forever?`,
      confirmText: 'Burn It',
      cancelText: 'Keep It',
      type: 'danger'
    });

    if (confirmed) {
      const originalTasks = [...tasksRef.current];
      setTasks(prev => prev.filter(t => t.id !== id));
      if (session) {
        try {
          await api.deleteTask(id);
          showToast("Task erased.", "info");
        } catch (e) {
          console.error("Delete error:", e);
          setTasks(originalTasks);
          showToast("Failed to erase task.", "error");
        }
      }
    }
  }, [session, confirm, showToast]);

  const handleAIExpand = useCallback(async (task: Task) => {
    setIsClassifying(true);
    try {
      const chunks = await fetchChunks(task.description, task.skillLevel);
      if (chunks.length > 0) {
        await updateTask(task.id, { chunks });
        showToast("AI breakdown complete!", "success");
      } else {
        showToast("AI couldn't find any logical steps to add.", "info");
      }
    } catch (e: any) {
      console.error("AI breakdown error:", e);
      const message = e.message?.includes("Daily AI limit reached")
        ? "Cannot expand: Daily AI limit reached (3/3)."
        : "AI service is temporarily unavailable. Try again?";
      showToast(message, "error");
    } finally {
      setIsClassifying(false);
    }
  }, [fetchChunks, updateTask, showToast]);

  const deleteChunk = useCallback(async (taskId: string, chunkId: string) => {
    const task = tasksRef.current.find(t => t.id === taskId);
    if (!task || !task.chunks) return;

    if (session) {
      try {
        await api.deleteChunk(chunkId);
        const newChunks = task.chunks.filter(c => c.id !== chunkId);
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, chunks: newChunks } : t));
      } catch (e) {
        console.error("Delete chunk error:", e);
        showToast("Ink ran out. Couldn't delete chunk.", "error");
      }
    }
  }, [session, showToast]);

  const updateChunk = useCallback(async (taskId: string, chunkId: string, updates: Partial<TaskChunk>) => {
    const task = tasksRef.current.find(t => t.id === taskId);
    if (!task || !task.chunks) return;

    const newChunks = task.chunks.map(c => c.id === chunkId ? { ...c, ...updates } : c);
    await updateTask(taskId, { chunks: newChunks });
  }, [updateTask]);

  const addChunk = useCallback(async (taskId: string, name: string, duration: number) => {
    const task = tasksRef.current.find(t => t.id === taskId);
    if (!task) return;

    const newChunk: TaskChunk = {
      id: crypto.randomUUID(),
      chunk_name: name,
      duration,
      completed: false
    };

    const newChunks = [...(task.chunks || []), newChunk];
    await updateTask(taskId, { chunks: newChunks });
  }, [updateTask]);


  const handleSaveLog = useCallback(async (taskId: string, log: TaskHistory) => {
    if (!session) return;
    try {
      await api.createProgressLog(taskId, log);
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            history: [...(t.history || []), log]
          };
        }
        return t;
      }));
    } catch (e) {
      console.error("Log save error:", e);
    }
  }, [session]);

  const handleSmartSchedule = useCallback(async () => {
    if (!session) return;
    setIsScheduling(true);
    try {
      const result = await api.runSmartSchedule();
      if (result.schedule) {
        setTasks(prev => prev.map(t => {
          const scheduled = result.schedule.find(st => st.id === t.id);
          if (scheduled) {
            return {
              ...t,
              scheduledStart: scheduled.start,
              scheduledEnd: scheduled.end,
              status: 'idle' 
            };
          }
          return t;
        }));
        showToast("Schedule refined by AI!", "success");
      }
      if (result.unschedulableCount > 0) {
        showToast(`Heads up: ${result.unschedulableCount} tasks couldn't fit.`, "info");
      }
    } catch (e) {
      console.error("Scheduling error:", e);
      showToast("AI is a bit overwhelmed. Try again?", "error");
    } finally {
      setIsScheduling(false);
    }
  }, [session, showToast]);

  return {
    tasks,
    setTasks,
    tasksRef,
    isLoading,
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
    fetchTasks
  };
};

