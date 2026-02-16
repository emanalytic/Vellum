import { supabase } from "./supabase";
import type {
  Task,
  TaskHistory,
  UserPreferences,
  SchedulerResult,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function getHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No active session");
  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

async function assertOk(res: Response, fallback: string) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).message || `${fallback} (${res.status})`);
  }
}

export const api = {
  async getTasks(): Promise<Task[]> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks`, { headers });
    await assertOk(res, "Failed to fetch tasks");
    return res.json();
  },

  async upsertTask(task: Partial<Task> & { id: string }) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify(task),
    });
    await assertOk(res, "Failed to save task");
    return res.json();
  },

  async deleteTask(taskId: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers,
    });
    await assertOk(res, "Failed to delete task");
  },
  
  async deleteChunk(chunkId: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks/chunk/${chunkId}`, {
      method: "DELETE",
      headers,
    });
    await assertOk(res, "Failed to delete chunk");
  },

  async createProgressLog(taskId: string, log: TaskHistory) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks/log/${taskId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(log),
    });
    await assertOk(res, "Failed to log progress");
  },

  async getPreferences(): Promise<UserPreferences | null> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks/preferences`, { headers });
    if (res.status === 404) return null;
    await assertOk(res, "Failed to fetch preferences");
    return res.json();
  },

  async updatePreferences(prefs: UserPreferences) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/tasks/preferences`, {
      method: "POST",
      headers,
      body: JSON.stringify(prefs),
    });
    await assertOk(res, "Failed to update preferences");
  },

  async runSmartSchedule(): Promise<SchedulerResult> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/scheduler/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
    await assertOk(res, "Scheduling failed");
    return res.json();
  },

  async classifyTask(description: string, skillLevel: string) {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/ai/classify-task`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        task_description: description,
        skill_level: skillLevel,
      }),
    });
    await assertOk(res, "AI classification failed");
    return res.json();
  },
};
