import React, { useState } from "react";
import type { Task } from "../types";
import {
  Search,
  Download,
  Trash2,
  Calendar,
  Archive,
} from "lucide-react";
import { motion } from "framer-motion";

interface ArchiveViewProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ tasks, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const archivedTasks = tasks.filter(
    (t) => t.status === "completed" || t.status === "archived",
  );
  const filteredTasks = archivedTasks.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const exportArchive = () => {
    const data = JSON.stringify(archivedTasks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vellum-Archive-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="marker-text text-4xl md:text-5xl inline-block px-6 py-2 bg-highlighter-blue
               text-ink -rotate-1">
            Archive
          </h2>
          <p className="font-sketch text-lg md:text-xl text-ink-light mt-4">
            See how far you have come.
          </p>
        </div>

        <button
          onClick={exportArchive}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 sketch-border bg-white hover:bg-highlighter-yellow transition-all"
        >
          <Download size={20} />
          <span className="font-marker text-lg">Export Archive</span>
        </button>
      </header>

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/20"
          size={20}
        />
        <input
          type="text"
          placeholder="Search past tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 sketch-border bg-white font-hand text-2xl focus:outline-none focus:bg-highlighter-yellow/5"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="py-20 text-center opacity-20 font-hand text-3xl italic">
            "No archived tasks yet. Start by completing some tasks!"
          </div>
        ) : (
          filteredTasks.map((task, i) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={task.id}
              className="sketch-border p-6 bg-white flex justify-between items-center group hover:bg-paper-bg transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 sketch-border flex items-center justify-center opacity-40">
                  <Archive size={24} />
                </div>
                <div>
                  <h3 className="marker-text text-2xl mb-1">
                    {task.description}
                  </h3>
                  <div className="flex items-center gap-4 font-sketch text-sm text-ink-light/80">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-ink-light hover:text-highlighter-pink p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchiveView;
