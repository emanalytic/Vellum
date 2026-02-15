import React from 'react';
import { Pencil, Sparkles, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

const GuideView: React.FC = () => {
  const processSteps = [
    {
      title: "1. Capture the Goal",
      icon: <Pencil className="text-highlighter-yellow" size={28} />,
      desc: "Type a task into the Canvas. Our AI immediately reads your goal and breaks it down into up to 5 manageable 'chunks'. It calculates how long each part should take based on whether you're a beginner or an expert.",
      color: "border-highlighter-yellow/40",
      bg: "bg-highlighter-yellow/5"
    },
    {
      title: "2. Build the Timeline",
      icon: <Sparkles className="text-highlighter-blue" size={28} />,
      desc: "Click 'Smart Schedule' to let the engine take over. It looks at your available hours and the urgency of your tasks, then automatically places them into empty slots on your daily timeline for you.",
      color: "border-highlighter-blue/40",
      bg: "bg-highlighter-blue/5"
    },
    {
      title: "3. Track Your Focus",
      icon: <Clock className="text-highlighter-pink" size={28} />,
      desc: "Use the floating timer while you work. We don't just track time; we measure your 'Focus Velocity'—the difference between how long we thought a task would take and how long it actually took you.",
      color: "border-highlighter-pink/40",
      bg: "bg-highlighter-pink/5"
    },
    {
      title: "4. Discover Your Peak",
      icon: <TrendingUp className="text-ink" size={28} />,
      desc: "Over time, the app builds a map of your energy levels. By looking at your history, we pinpoint your 'Peak Productivity Hour'—the specific time of day when you are statistically most likely to get things done.",
      color: "border-ink/20",
      bg: "bg-ink/5"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-16">
        <h2 className="marker-text text-5xl inline-block px-6 py-2 bg-highlighter-yellow -rotate-1 mb-6">
          The Workflow
        </h2>
        <p className="font-hand text-2xl text-ink/80 leading-relaxed italic">
          "A step-by-step look at how Vellum turns your chaos into a plan."
        </p>
      </header>

      <div className="space-y-10">
        {processSteps.map((step, i) => (
          <div key={i} className={`flex flex-col md:flex-row gap-8 items-center p-8 sketch-border ${step.bg} ${step.color} relative group transition-transform hover:scale-[1.01]`}>
            <div className="w-16 h-16 shrink-0 bg-white sketch-border flex items-center justify-center shadow-sm">
              {step.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-marker text-2xl mb-3 flex items-center gap-2">
                {step.title}
              </h3>
              <p className="font-hand text-xl leading-relaxed text-ink/90">
                {step.desc}
              </p>
            </div>

            {/* Step Number Tag */}
            <div className="absolute -top-4 -left-4 bg-ink text-white w-10 h-10 rounded-full flex items-center justify-center font-marker text-xl shadow-lg border-2 border-white">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-10 bg-white sketch-border border-dashed relative">
        <div className="absolute -top-6 left-10 bg-highlighter-pink px-4 py-1 rotate-1 font-marker text-white">
          Pro Tip
        </div>
        <h4 className="font-marker text-2xl mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-green-600" /> Achieving Flow
        </h4>
        <p className="font-hand text-xl leading-relaxed text-ink/70">
          The best way to use Vellum is to be honest with your <strong>Skill Level</strong>. If you're struggling with a task, set yourself as a 'Beginner' so the AI gives you more time and smaller, easier steps. If you're flying through tasks, use 'Expert' to keep your timeline lean.
        </p>
      </div>

      <footer className="mt-16 text-center opacity-40 font-sketch text-sm uppercase tracking-widest">
        Designed for builders.
      </footer>
    </div>
  );
};

export default GuideView;
