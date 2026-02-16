import React, { useState } from "react";
import { Plus, Lightbulb, ChevronRight, Coffee } from "lucide-react";
import TaskCard from "../components/tasks/TaskCard";
import type { Task, TaskPriority } from "../types";
import { useSound } from "../hooks/useSound";

interface JournalViewProps {
  tasks: Task[];
  onAddTask: (taskData: {
    description: string;
    skillLevel: string;
    priority: TaskPriority;
    deadline: string;
    estimatedTime: string;
    wantsChunks: boolean;
    predictedSatisfaction: number;
  }) => Promise<any>;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  isClassifying: boolean;
  onTabChange?: (tab: any) => void;
}

const JournalView: React.FC<JournalViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onSelectTask,
  onEditTask,
  isClassifying,
  onTabChange,
}) => {
  const { playPop, playClick, playSuccess } = useSound();
  const [showAddForm, setShowAddForm] = useState(false);
  const [deck, setDeck] = useState({
    description: "",
    skillLevel: "intermediate",
    priority: "medium" as TaskPriority,
    deadline: "",
    estimatedTime: "60",
    wantsChunks: true,
    predictedSatisfaction: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deck.description.trim()) return;
    playSuccess();
    const success = await onAddTask(deck);
    if (success) {
      setDeck({
        description: "",
        skillLevel: "intermediate",
        priority: "medium",
        deadline: "",
        estimatedTime: "60",
        wantsChunks: true,
        predictedSatisfaction: 50,
      });
      setShowAddForm(false);
    }
  };

  const pendingTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "archived"
  );

  return (
    <div className="space-y-12 pb-20">
      <section className="max-w-4xl mx-auto">
        {!showAddForm ? (
          <button
            onClick={() => { playPop(); setShowAddForm(true); }}
            className="w-full py-4 sketch-border bg-white group hover:bg-highlighter-pink/60 transition-all flex flex-col items-center gap-2 border-dashed"
          >
            <Plus
              size={24}
              className="group-hover:rotate-90 transition-transform"
            />
            <span className="font-hand text-xl">Note down a new task...</span>
          </button>
        ) : (
          <div className="sketch-border p-4 md:p-8 bg-white transform rotate-0 md:-rotate-1 relative shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <input
                autoFocus
                value={deck.description}
                onChange={(e) =>
                  setDeck({ ...deck, description: e.target.value })
                }
                placeholder="What are we doing today?"
                className="w-full text-2xl md:text-3xl font-hand p-2 border-b-2 border-ink focus:outline-none focus:border-highlighter-pink bg-transparent"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Current Mastery
                    </label>
                    <select
                      value={deck.skillLevel}
                      onChange={(e) =>
                        setDeck({
                          ...deck,
                          skillLevel: e.target.value,
                        })
                      }
                      className="font-hand text-xl p-2 border-b-2 border-ink focus:outline-none bg-transparent appearance-none cursor-pointer"
                    >
                      <option value="total_novice">Total Novice</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="master">Master</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Priority
                    </label>
                    <div className="flex gap-2 md:gap-4 mt-2">
                      {(["low", "medium", "high"] as TaskPriority[]).map(
                        (p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { playClick(); setDeck({ ...deck, priority: p }); }}
                            className={`flex-1 py-1 px-2 sketch-border font-hand text-lg capitalize transition-all ${
                              deck.priority === p
                                ? "bg-highlighter-yellow scale-110"
                                : "bg-white opacity-50 hover:opacity-100"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={deck.deadline}
                      onChange={(e) =>
                        setDeck({ ...deck, deadline: e.target.value })
                      }
                      className="font-hand text-lg p-2 border-b-2 border-ink focus:outline-none focus:border-highlighter-pink bg-transparent w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sketch text-xs uppercase opacity-40 ml-1">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={deck.estimatedTime}
                      onChange={(e) =>
                        setDeck({
                          ...deck,
                          estimatedTime: e.target.value,
                        })
                      }
                      className="font-hand text-xl p-2 border-b-2 border-ink focus:outline-none focus:border-highlighter-yellow bg-transparent w-full"
                    />
                  </div>
                </div>
                </div>
                {/* ─── Satisfaction Check (David Burns) ─── */}
                <div className="pt-6 border-t border-ink/10">
                  <label className="font-sketch text-xs uppercase opacity-40 ml-1 block mb-2">
                    Predicted Satisfaction ({deck.predictedSatisfaction}%)
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="font-hand text-sm opacity-50">Meh</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={deck.predictedSatisfaction}
                      onChange={(e) =>
                        setDeck({
                          ...deck,
                          predictedSatisfaction: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-highlighter-pink cursor-pointer"
                    />
                    <span className="font-hand text-sm opacity-50">Joy!</span>
                  </div>
                  <p className="font-hand text-[10px] text-ink-light mt-1 italic opacity-60">
                    "Predict how good you'll feel after finishing this." — Dr. David Burns
                  </p>
                </div>
              <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-ink/10 gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={deck.wantsChunks}
                    onChange={(e) => {
                      playClick();
                      setDeck({
                        ...deck,
                        wantsChunks: e.target.checked,
                      });
                    }}
                  />
                  <span
                    className={`font-sketch relative text-lg uppercase flex items-center gap-3 py-2 px-4 sketch-border transition-all group/ai-toggle ${
                      deck.wantsChunks
                        ? "bg-highlighter-yellow scale-105 rotate-1 shadow-lg"
                        : "bg-ink/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Lightbulb
                      size={20}
                      className={
                        deck.wantsChunks
                          ? "text-highlighter-pink animate-pulse"
                          : "text-ink/40"
                      }
                    />
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-bold tracking-wider">
                        Want help? 
                      </span>
                      <span className="text-[10px] normal-case opacity-60 font-sans tracking-normal pt-0.5">
                        Uses AI to split task
                      </span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-sm border-2 border-ink ml-2 flex items-center justify-center transition-colors ${
                        deck.wantsChunks ? "bg-ink" : "bg-transparent"
                      }`}
                    >
                      {deck.wantsChunks && (
                        <div className="text-white text-xs">✓</div>
                      )}
                    </div>
                  </span>
                </label>
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => { playPop(); setShowAddForm(false); }}
                    className="flex-1 md:flex-none font-hand text-xl p-2 text-ink-light hover:underline underline-offset-4"
                  >
                    nevermind
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 md:flex-none group flex items-center justify-center gap-3 py-3 px-6 md:px-10 sketch-border bg-ink text-white font-marker text-xl md:text-2xl transition-all ${
                      isClassifying
                        ? "opacity-50 cursor-wait"
                        : "hover:bg-highlighter-pink hover:text-ink"
                    }`}
                  >
                    {isClassifying ? (
                      "Analyzing..."
                    ) : (
                      <>
                        Save Task{" "}
                        <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      <div className="columns-1 md:columns-2 gap-12 space-y-16">
        {pendingTasks.map((task, index) => (
          <div
            key={task.id}
            className="break-inside-avoid pt-4 transform transition-all"
            style={{
              transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (((index * 1.7) % 3) + 0.5)}deg)
                         translateY(${(index % 3 === 0 ? 1 : -1) * ((index * 2.3) % 10)}px)
                         translateX(${(index % 2 === 0 ? 1 : -1) * ((index * 1.3) % 5)}px)`,
            }}
          >
            <TaskCard
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onExploreChunks={onSelectTask}
              onClick={onEditTask}
            />
          </div>
        ))}
      </div>
      
      {pendingTasks.length === 0 && !showAddForm && (
        <div className="flex flex-col items-center justify-center relative min-h-[50vh] py-12 opacity-60 select-none pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[5%] animate-spin-slow opacity-20 hidden sm:block">
            <Lightbulb
              size={40}
              className="md:size-16 text-highlighter-yellow"
            />
          </div>
          <div className="absolute top-[15%] right-[10%] -rotate-12 opacity-15 hidden md:block">
            <Coffee size={60} className="lg:size-24" />
          </div>
          <div className="text-center space-y-4 pointer-events-auto">
            <div className="font-marker text-6xl md:text-8xl text-ink/20 transform -rotate-3 mb-8">
              tabula rasa
            </div>
            <p className="font-hand text-3xl md:text-4xl text-ink-light">
              what are you waiting for?
            </p>
            <p className="font-sketch text-xl opacity-60 italic">
              "Small steps, every day, lead to big results."
            </p>
            {onTabChange && (
              <button 
                onClick={() => onTabChange("guide")}
                className="mt-8 font-hand text-lg text-ink/40 hover:text-highlighter-pink hover:underline underline-offset-4 transition-colors"
              >
                (confused? read the manual)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalView;
