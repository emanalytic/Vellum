import React, { useState } from 'react';
import { api } from '../../services/api';
import { Lightbulb, Loader2, Clock, ListChecks } from 'lucide-react';
import { useToast } from '../../context/ToastContext';



interface TaskClassification {
  workload_type: string;
  intensity: string;
  baseline_duration_min: number;
  variance_profile: string;
  confidence: number;
  suggested_chunks: { chunk_name: string; estimated_duration_min: number }[];
}

const TaskClassifier: React.FC = () => {
  const { showToast } = useToast();
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaskClassification | null>(null);

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await api.classifyTask(description, 'intermediate');
      setResult(data);
    } catch (error) {
      console.error('Classification error:', error);
      showToast('Failed to classify task. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleClassify} className="sketch-border p-6 bg-white transform -rotate-1">
        <label className="marker-text text-2xl mb-4 block underline decoration-highlighter-yellow decoration-4">
          What are you working on?
        </label>
        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Read chapter 4 of biology and summarize key concepts..."
            className="w-full h-32 p-4 font-sketch text-xl border-2 border-ink rounded-lg focus:outline-none focus:ring-2 focus:ring-highlighter-yellow resize-none"
          />
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 sketch-border bg-ink text-white hover:bg-highlighter-pink hover:text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Lightbulb className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-2xl font-sketch font-bold">Classify with AI</span>
          </button>
        </div>
      </form>

      {result && (
        <div className="sketch-border p-6 bg-white transform rotate-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-6">
            <h3 className="marker-text text-3xl text-ink">AI Analysis</h3>
            <div className="bg-highlighter-yellow px-3 py-1 sketch-border -rotate-2">
              <span className="font-sketch font-bold text-lg">{(result.confidence * 100).toFixed(0)}% Confidence</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-3 border-2 border-ink rounded-lg bg-paper-bg flex flex-col items-center text-center">
              <Lightbulb className="w-6 h-6 mb-1" />
              <span className="font-sketch text-xs text-ink-light uppercase tracking-wider">Type</span>
              <span className="font-sketch font-bold text-lg capitalize">{result.workload_type.replace('_', ' ')}</span>
            </div>
            <div className="p-3 border-2 border-ink rounded-lg bg-paper-bg flex flex-col items-center text-center">
              <Lightbulb className="w-6 h-6 mb-1" />
              <span className="font-sketch text-xs text-ink-light uppercase tracking-wider">Intensity</span>
              <span className="font-sketch font-bold text-lg capitalize">{result.intensity}</span>
            </div>
            <div className="p-3 border-2 border-ink rounded-lg bg-paper-bg flex flex-col items-center text-center">
              <Clock className="w-6 h-6 mb-1" />
              <span className="font-sketch text-xs text-ink-light uppercase tracking-wider">Duration</span>
              <span className="font-sketch font-bold text-lg">{result.baseline_duration_min} min</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-6 h-6" />
              <h4 className="marker-text text-xl">Suggested Chunks</h4>
            </div>
            <div className="space-y-3">
              {result.suggested_chunks.map((chunk, index) => (
                <div key={index} className="flex justify-between items-center p-3 border-b-2 border-ink border-dashed font-sketch text-xl">
                  <span>{chunk.chunk_name}</span>
                  <span className="bg-highlighter-pink/30 px-2 rounded">{chunk.estimated_duration_min}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskClassifier;
