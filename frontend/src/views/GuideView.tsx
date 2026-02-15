import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  Archive, 
  Lightbulb, 
  Target, 
  Brain, 
  Coffee
} from 'lucide-react';

const GuideView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-8 pb-32 space-y-20">
      
      {/* ─── Header Section ─── */}
      <header className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-highlighter-yellow/20 rounded-full blur-3xl -z-10" />
        <h1 className="marker-text text-5xl md:text-7xl -rotate-2">
          Owner's Manual
        </h1>
        <p className="font-hand text-2xl md:text-3xl text-ink/70 max-w-2xl mx-auto leading-relaxed">
          "A rough guide to turning your chaos into art."
        </p>
      </header>

      {/* ─── Philosophy Section ─── */}
      <section className="sketch-border bg-white p-8 md:p-12 transform rotate-1 relative">
        <div className="absolute -top-4 -left-4 bg-ink text-white px-4 py-1 font-marker text-xl -rotate-3">
          The Philosophy
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-marker text-3xl">Not Another To-Do List</h3>
            <p className="font-hand text-xl leading-loose text-ink/80">
              Vellum isn't about checking boxes. It's about <span className="font-bold bg-highlighter-yellow/40 px-1">flow</span>. 
              Most tools treat you like a machine. We treat you like a creative engine that needs 
              structure, rhythm, and the occasional break.
            </p>
            <div className="flex gap-4 font-sketch text-sm opacity-60 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Coffee size={16}/> messy is okay</span>
              <span className="flex items-center gap-2"><Brain size={16}/> trust your brain</span>
            </div>
          </div>
          <div className="bg-paper-bg p-6 sketch-border border-dashed transform -rotate-1">
             <h4 className="font-marker text-xl mb-4 text-center">The Vellum Cycle</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-highlighter-blue flex items-center justify-center font-marker text-white">1</div>
                  <p className="font-hand text-lg">Dump your brain into the <strong>Canvas</strong>.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-highlighter-pink flex items-center justify-center font-marker text-white">2</div>
                  <p className="font-hand text-lg">Let AI structure it on the <strong>Timeline</strong>.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-highlighter-yellow flex items-center justify-center font-marker text-white">3</div>
                  <p className="font-hand text-lg">Work & learn from <strong>Insights</strong>.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Walkthrough ─── */}
      <div className="space-y-20">
        
        {/* 1. The Canvas */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 md:gap-16 items-start">
           <div className="space-y-8 order-2 md:order-1">
            <div className="sketch-border bg-white p-6 relative group hover:scale-[1.01] transition-transform">
              <h3 className="font-marker text-2xl mb-2">Intentional Input</h3>
              <p className="font-hand text-lg text-ink/80 mb-4">
                When you add a task, we ask for context. Why? Because "Write Report" allows you to procrastinate. 
                "Write Report (Advanced, High Priority)" gives us data to help you.
              </p>
              <ul className="space-y-3 font-hand text-lg pl-4 border-l-2 border-highlighter-blue/30">
                <li className="flex items-start gap-2">
                  <Target size={18} className="mt-1 text-highlighter-blue" />
                  <span><strong>Mastery Level:</strong> Be honest. "Beginner" adds buffer time. "Master" keeps it tight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={18} className="mt-1 text-highlighter-yellow" />
                  <span><strong>AI Breakdown:</strong> Toggle the lightbulb. We'll split big scary goals into bite-sized chunks automatically.</span>
                </li>
              </ul>
            </div>
            
             <div className="sketch-border bg-[#fff9c4] p-6 transform rotate-1">
                <h3 className="font-marker text-xl mb-2 flex items-center gap-2">
                  <TrendingUp size={20} /> The "Feeling Good" Method
                </h3>
                <p className="font-hand text-lg text-ink/80">
                  Before you start, we ask for <strong>Predicted Satisfaction</strong>. After you finish, we ask for <strong>Actual Satisfaction</strong>. 
                  <br/><br/>
                  <em>Spoiler: You almost always enjoy the work more than you think you will. This trains your brain to stop dreading work.</em>
                </p>
             </div>
          </div>
          <div className="md:text-left md:sticky md:top-24 order-1 md:order-2">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-start items-center gap-3">
              <LayoutDashboard className="text-highlighter-blue" size={32} />
              The Canvas
            </h2>
            <p className="font-hand text-xl text-ink/60">
              Your daily scratchpad. Where every plan begins.
            </p>
          </div>
        </div>

        {/* 2. The Timeline */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
          <div className="md:text-right md:sticky md:top-24">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
              <Calendar className="text-highlighter-pink" size={32} />
              The Timeline
            </h2>
            <p className="font-hand text-xl text-ink/60">
              Time is finite. Treat it that way.
            </p>
          </div>
          <div className="space-y-8">
            <div className="sketch-border bg-white p-6">
              <h3 className="font-marker text-2xl mb-2">Smart Schedule</h3>
              <p className="font-hand text-lg text-ink/80 mb-4">
                Don't drag-and-drop unless you want to. Hit the <strong>Smart Schedule</strong> button in the navbar. 
                We solve the Tetris puzzle for you, fitting tasks into your available hours based on priority and deadline.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="sketch-border p-4 border-dashed border-ink/20 transform -rotate-1">
                  <h4 className="font-marker text-lg mb-2">The 24h Rule</h4>
                  <p className="font-hand text-base opacity-70">
                    We only show one day. If it doesn't fit today, it stays in the queue. No future-tripping. Focus on <em>now</em>.
                  </p>
               </div>
               <div className="sketch-border p-4 border-dashed border-ink/20 transform rotate-1">
                  <h4 className="font-marker text-lg mb-2">Real Hours</h4>
                  <p className="font-hand text-base opacity-70">
                    Check your Settings. If you say you work 9-5, we won't schedule tasks at 6pm. Respect your own boundaries.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* 3. Insights */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 md:gap-16 items-start">
          <div className="space-y-8 order-2 md:order-1">
            <div className="sketch-border bg-white p-6 relative overflow-hidden group hover:bg-green-50/30 transition-colors">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Activity size={100} />
               </div>
               <h3 className="font-marker text-2xl mb-4">Focus Velocity</h3>
               <p className="font-hand text-lg text-ink/80 mb-6">
                 We track every minute you spend in the <strong>Timer</strong>. 
                 The "Energy Levels" chart shows your <strong>Peak Productivity Hour</strong>.
               </p>
               <div className="bg-ink text-white p-4 sketch-border font-hand text-lg transform -rotate-1 inline-block shadow-lg">
                 "If your peak is 10am, don't waste it on email."
               </div>
            </div>
             <div className="font-hand text-lg text-ink/80 px-4 border-l-4 border-ink flex items-start gap-4">
                <Archive className="shrink-0 mt-1 opacity-50" />
                <p><strong>The Vault:</strong> Your trophy room. Completed tasks live here. When you feel unproductive, look here to see how far you've come.</p>
             </div>
          </div>
          <div className="md:text-left md:sticky md:top-24 order-1 md:order-2">
             <h2 className="marker-text text-4xl mb-4 flex md:justify-start items-center gap-3">
              <Activity className="text-green-500" size={32} />
              Insights
            </h2>
            <p className="font-hand text-xl text-ink/60">
              Learn your own manual.
            </p>
          </div>
        </div>

      </div>

      {/* ─── Footer / Tip ─── */}
      <div className="mt-20 p-10 bg-white sketch-border border-dashed relative text-center max-w-3xl mx-auto transform hover:rotate-1 transition-transform">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-highlighter-pink px-6 py-2 rotate-1 font-marker text-white text-xl shadow-lg border-2 border-white">
          Final Pro Tip
        </div>
        <h4 className="font-marker text-3xl mb-6 mt-4">
          <Lightbulb className="inline-block mr-2 text-highlighter-yellow mb-1" size={32}/> 
          Just Start.
        </h4>
        <p className="font-hand text-2xl leading-relaxed text-ink/70 max-w-xl mx-auto">
          The hardest part of any task is often the emotional weight we attach to it. 
          Break it down. Set the timer for 5 minutes. 
        </p>
         <div className="mt-6 font-sketch text-lg uppercase tracking-[0.2em] opacity-40">
            Action precedes motivation
         </div>
      </div>

    </div>
  );
};

export default GuideView;
