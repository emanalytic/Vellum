import React, { useState } from 'react';
import type { Task, TaskChunk } from '../../types';
import { X, CheckSquare, Square, Lightbulb, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChunkPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdateChunk: (taskId: string, chunkId: string, updates: Partial<TaskChunk>) => void;
  onAddChunk: (taskId: string, name: string, duration: number) => void;
  onDeleteChunk: (taskId: string, chunkId: string) => void;
  onAIExpand?: (task: Task) => void;
  isClassifying?: boolean;
}

const ChunkPanel: React.FC<ChunkPanelProps> = ({ task, onClose, onUpdateChunk, onAddChunk, onDeleteChunk, onAIExpand, isClassifying }) => {
  const [newChunkName, setNewChunkName] = useState('');
  const [newChunkDuration, setNewChunkDuration] = useState('15');
  const [editingChunkId, setEditingChunkId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  if (!task) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChunkName.trim()) return;
    onAddChunk(task.id, newChunkName, parseInt(newChunkDuration) || 15);
    setNewChunkName('');
  };

  const startEdit = (chunk: TaskChunk) => {
    setEditingChunkId(chunk.id);
    setEditingValue(chunk.chunk_name);
  };

  const saveEdit = (chunkId: string) => {
    onUpdateChunk(task.id, chunkId, { chunk_name: editingValue });
    setEditingChunkId(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-paper-bg z-50 border-l-4 border-ink shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-start p-8 pb-4 bg-paper-bg z-10 shrink-0">
          <div>
            <span className="font-sketch text-sm uppercase tracking-widest text-ink-light block mb-1">Breakdown</span>
            <h2 className="marker-text text-3xl leading-tight truncate max-w-[300px]" title={task.description}>{task.description}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-highlighter-pink rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 scroll-smooth custom-scrollbar">
           {/* Add New Chunk Form */}
          <form onSubmit={handleAdd} className="sketch-border p-4 bg-white border-dashed">
            <h3 className="font-sketch text-xs uppercase opacity-40 mb-3">Add Custom Milestone</h3>
            <div className="flex gap-2">
              <input 
                value={newChunkName}
                onChange={e => setNewChunkName(e.target.value)}
                placeholder="Next step..."
                className="flex-1 font-hand text-lg border-b border-ink/20 focus:border-highlighter-yellow focus:outline-none bg-transparent"
              />
              <input 
                type="number"
                value={newChunkDuration}
                onChange={e => setNewChunkDuration(e.target.value)}
                className="w-12 font-mono text-sm border-b border-ink/20 focus:border-highlighter-yellow focus:outline-none bg-transparent text-center"
              />
              <button type="submit" className="p-2 bg-ink text-white hover:bg-highlighter-yellow hover:text-ink transition-all sketch-border">
                <Plus size={16} />
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {(task.chunks || []).map((chunk) => (
              <div key={chunk.id} className={`flex items-start gap-4 p-3 sketch-border bg-white transition-all ${chunk.completed ? 'opacity-40 grayscale rotate-1' : 'hover:scale-102 -rotate-1'}`}>
                <button 
                  onClick={() => onUpdateChunk(task.id, chunk.id, { completed: !chunk.completed })}
                  className="mt-1 shrink-0"
                >
                  {chunk.completed ? <CheckSquare size={22} className="text-highlighter-pink" /> : <Square size={22} />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingChunkId === chunk.id ? (
                    <div className="flex gap-1 items-center">
                      <input 
                        autoFocus
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        className="w-full font-hand text-lg border-b border-ink focus:outline-none bg-transparent"
                      />
                      <button onClick={() => saveEdit(chunk.id)} className="text-green-600"><Check size={18}/></button>
                    </div>
                  ) : (
                    <div className="group flex items-center gap-2">
                      <p className={`font-hand text-xl leading-snug truncate ${chunk.completed ? 'line-through' : ''}`}>
                        {chunk.chunk_name}
                      </p>
                      <button onClick={() => startEdit(chunk)} className="opacity-0 group-hover:opacity-30 transition-opacity">
                        <Edit2 size={12} />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] px-1 bg-highlighter-yellow/30">{chunk.duration}m</span>
                    {chunk.completed && <span className="font-sketch text-[10px] text-highlighter-pink uppercase">Mission Success</span>}
                  </div>
                </div>

                <button 
                  onClick={() => onDeleteChunk(task.id, chunk.id)}
                  className="text-ink-light hover:text-red-500 opacity-20 hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {(!task.chunks || task.chunks.length === 0) && (
            <div className="text-center py-20 opacity-20 group">
              <Lightbulb size={40} className="mx-auto mb-4 group-hover:rotate-12 transition-all" />
              <p className="font-hand text-2xl">The scroll is empty.</p>
              <p className="font-sketch mb-6">Add your own paths or use AI.</p>
              {onAIExpand && (
                <button 
                  onClick={() => onAIExpand(task)}
                  disabled={isClassifying}
                  className={`px-6 py-2 bg-ink justify-self-center  text-white font-marker text-xl sketch-border transition-all flex items-center justify-center gap-2 ${isClassifying ? 'opacity-70 cursor-not-allowed' : 'hover:bg-highlighter-yellow hover:text-ink'}`}
                >
                  {isClassifying ? (
                    <>
                      <Lightbulb size={18} className="animate-pulse" />
                      wait up...
                    </>
                  ) : 'Want AI help?'}
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="px-8 pt-5 pb-8 border-t-2 border-ink border-dashed mt-auto shrink-0 bg-paper-bg">
          <div className="flex justify-between items-center font-sketch text-lg mb-2">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-highlighter-pink animate-ping" />
                <span>Completion Status</span>
             </div>
             <span className="font-mono">{Math.round((task.chunks?.filter(c => c.completed).length || 0) / (task.chunks?.length || 1) * 100)}%</span>
          </div>
          <div className="h-6 sketch-border bg-white overflow-hidden p-1">
            <motion.div 
              className="h-full bg-highlighter-pink"
              initial={{ width: 0 }}
              animate={{ 
                width: `${task.chunks && task.chunks.length > 0 
                  ? (task.chunks.filter(c => c.completed).length / task.chunks.length) * 100 
                  : 0}%` 
              }}
              transition={{ type: 'spring', bounce: 0.2 }}
            />
          </div>
          <p className="text-center font-hand text-sm mt-4 opacity-40 italic">
            "Rome wasn't built in a day, but they were laying bricks every hour."
          </p>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChunkPanel;
