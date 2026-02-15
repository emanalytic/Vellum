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
  Settings,
  Moon,
  Sun,
  Clock,
  CheckCircle2,
  Pencil
} from 'lucide-react';

const GuideView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-12 pb-48 space-y-32">
      
      {/* ─── Header: The Big Picture ─── */}
      <header className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-highlighter-yellow/15 rounded-full blur-[100px] -z-10" />
        <h1 className="marker-text text-6xl md:text-8xl -rotate-1">
          The User Manual
        </h1>
        <p className="font-hand text-3xl md:text-4xl text-ink/60 max-w-3xl mx-auto leading-relaxed italic">
          "From chaos to a sketch, from a sketch to a plan."
        </p>
      </header>

      {/* ─── 0. NAVIGATION & NAVIGATION ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Settings className="text-ink" size={32} />
             Navigation
          </h2>
          <p className="font-hand text-xl text-ink/60">Your home base.</p>
        </div>
        <div className="space-y-8">
           <div className="sketch-border bg-white p-8 shadow-sm relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Settings size={160} />
             </div>
             <h3 className="font-marker text-2xl mb-6">The Command Center</h3>
             <ul className="space-y-6 font-hand text-xl">
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><Sparkles size={18} className="text-highlighter-yellow" /></div>
                 <div>
                    <strong>System Mood:</strong> Click your avatar in the sidebar. Vellum tracks your <em>Energy Vibe</em> (Calm, Focused, Tired, etc.) during work sessions. We correlate this with your output velocity in your Insights.
                 </div>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><Settings size={18} /></div>
                 <div>
                    <strong>Working Win-dows:</strong> Open the Settings modal to define your daily start/end times. The <strong>Smart Scheduler</strong> acts as your personal assistant and will <em>never</em> book tasks during your off-hours.
                 </div>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><LayoutDashboard size={18} /></div>
                 <div>
                    <strong>View Toggles:</strong> Switch between the <em>Canvas</em> (Entry), <em>Timeline</em> (Execution), and <em>Insights</em> (Review) at any time. Your data syncs instantly.
                 </div>
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* ─── 1. THE CANVAS ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <LayoutDashboard className="text-highlighter-blue" size={32} />
             The Canvas
          </h2>
          <p className="font-hand text-xl text-ink/60">Where thoughts land.</p>
        </div>
        <div className="space-y-10">
           <div className="sketch-border bg-white p-8 relative overflow-hidden">
             <h3 className="font-marker text-2xl mb-6">Structuring a Pursuit</h3>
             <p className="font-hand text-xl leading-relaxed mb-8">
               A "Task" in Vellum is called a <strong>Pursuit</strong>. Deep work requires more than just a checkbox.
             </p>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3 border-l-4 border-highlighter-blue pl-4">
                  <h4 className="font-marker text-xl flex items-center gap-2"><Target size={18}/> Mastery & Buffers</h4>
                  <p className="font-hand text-lg opacity-70">
                    If you're a <strong>Novice</strong>, we add extra time to your estimate to prevent "Planning Fallacy". If you're a <strong>Master</strong>, we keep the schedule lean and tight.
                  </p>
                </div>
                <div className="space-y-3 border-l-4 border-highlighter-yellow pl-4">
                  <h4 className="font-marker text-xl flex items-center gap-2"><Lightbulb size={18}/> The Lightbulb (AI)</h4>
                  <p className="font-hand text-lg opacity-70">
                    Stuck on a big goal? Toggle the AI lightbulb. We'll split it into 3-5 <strong>Chunks</strong> automatically. This turns "vague dread" into a clear step-by-step path.
                  </p>
                </div>
             </div>
           </div>

           <div className="sketch-border bg-[#fff9c4] p-10 transform rotate-1 shadow-xl relative">
              <div className="absolute top-4 right-4 text-ink/10 rotate-12"><Brain size={48} /></div>
              <h3 className="font-marker text-3xl mb-6 flex items-center gap-3">
                <TrendingUp size={28} /> The "Feeling Good" Science
              </h3>
              <p className="font-hand text-xl leading-relaxed">
                We use the <strong>Satisfaction Slider</strong> based on Dr. David Burns' cognitive behavioral therapy techniques. 
                <br/><br/>
                Plan the task, predict your satisfaction (0-100%), and then rate it again once finished. <strong>You'll find that the "Actual" score is almost always higher than the "Predicted" score.</strong> This creates a biological feedback loop that crushes future procrastination.
              </p>
           </div>
           
           <div className="p-6 sketch-border border-dashed bg-white/50">
              <h4 className="font-marker text-xl mb-4">Refining Your List</h4>
              <p className="font-hand text-lg opacity-80 italic">
                "Plans change. Use the <strong>Pencil</strong> icon on any card to adjust time or priority. If a pursuit is no longer relevant, use the <strong>Trash</strong> icon—it will stay in your Vault for 30 days before vanishing."
              </p>
           </div>
        </div>
      </section>

      {/* ─── 2. THE TIMELINE ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Calendar className="text-highlighter-pink" size={32} />
             The Timeline
          </h2>
          <p className="font-hand text-xl text-ink/60">Organizing reality.</p>
        </div>
        <div className="space-y-8">
           <div className="sketch-border bg-white p-10">
             <h3 className="font-marker text-3xl mb-6">The Tetris of Time</h3>
             <p className="font-hand text-xl mb-12">
               You can't do everything. The Timeline helps you see what's actually possible in 24 hours.
             </p>
             
             <div className="space-y-16">
                <div className="flex gap-8 items-start relative pb-8 border-b border-ink/5">
                  <div className="bg-ink text-white p-4 font-marker text-xl rotate-3 shrink-0 shadow-lg select-none">AUTO</div>
                  <div>
                    <h4 className="font-marker text-2xl mb-2">Smart Schedule</h4>
                    <p className="font-hand text-xl opacity-80 leading-relaxed">Click the button in the top bar. Vellum calculates the optimal day by balancing deadlines, priorities, and your energy windows. It's like having a project manager in your pocket.</p>
                  </div>
                </div>

                <div className="flex gap-8 items-start relative">
                  <div className="bg-white border-4 border-ink p-4 font-marker text-xl -rotate-2 shrink-0 shadow-lg select-none">MANUAL</div>
                  <div>
                    <h4 className="font-marker text-2xl mb-2">Seal the Slot</h4>
                    <p className="font-hand text-xl opacity-80 leading-relaxed">Click any hour on the grid to open the <strong>Commit Modal</strong>. You can drag existing tasks here or create a "Quick Habit" for things like lunch or commute.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div className="sketch-border p-6 bg-paper-bg/40 border-dashed border-ink/20 transform -rotate-1">
                     <h5 className="font-marker text-xl mb-3 flex items-center gap-2 text-ink/40"><Moon size={18}/> Night Owl Presets</h5>
                     <p className="font-hand text-lg">Toggle between Early Bird and Night Owl presets to instantly shift your entire week's schedule window.</p>
                  </div>
                  <div className="sketch-border p-6 bg-paper-bg/40 border-dashed border-ink/20 transform rotate-1">
                     <h5 className="font-marker text-xl mb-3 flex items-center gap-2 text-ink/40"><Calendar size={18}/> Weekly View</h5>
                     <p className="font-hand text-lg">Zoom out to the 7-day view to see your distribution of work and plan for upcoming deadlines.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ─── 3. THE EXECUTION ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Clock className="text-green-600" size={32} />
             Execution
          </h2>
          <p className="font-hand text-xl text-ink/60">Building the engine.</p>
        </div>
        <div className="space-y-12">
           <div className="sketch-border bg-white p-10">
             <h3 className="font-marker text-3xl mb-8">Fueling the System</h3>
             <ul className="space-y-12">
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg">1</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl">The Active Timer</h4>
                      <p className="font-hand text-xl opacity-80 leading-relaxed">
                        Click <strong>Start</strong> when you enter "Deep Work". A persistent timer will track your session. <strong>Important:</strong> If you step away for a call or coffee, hit Stop. We only want focused data.
                      </p>
                   </div>
                </li>
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg">2</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl">The Chunk Panel</h4>
                      <p className="font-hand text-xl opacity-80 leading-relaxed">
                        Click <strong>Explore Chunks</strong> on any card. Checking off these sub-tasks updates your live progress bar. This gives your brain the dopamine hit it needs to finish the bigger goal.
                      </p>
                   </div>
                </li>
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg">3</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl flex items-center gap-2"><Archive size={20}/> The Vault (Archive)</h4>
                      <p className="font-hand text-xl opacity-80 leading-relaxed">
                        Once a pursuit is 100% complete, it moves to the <strong>Vault</strong>. You can restore old tasks if you need to redo them, or look back at your history to see just how much you've accomplished.
                      </p>
                   </div>
                </li>
             </ul>
           </div>

           {/* Data Breakdown */}
           <div className="grid sm:grid-cols-2 gap-10">
              <div className="sketch-border p-8 bg-white border-dashed border-ink relative overflow-hidden group hover:bg-highlighter-pink/5 transition-colors">
                 <Activity className="absolute -top-6 -right-6 opacity-5 group-hover:opacity-20 transition-opacity" size={120} />
                 <h4 className="font-marker text-3xl mb-4 flex items-center gap-3">
                    <Activity size={24} className="text-highlighter-pink" /> Velocity
                 </h4>
                 <p className="font-hand text-xl opacity-70 leading-relaxed">
                    We track <strong>Estimated vs Actual</strong> time. If you consistently under-estimate, the AI will learn your pace and adjust future schedules automatically.
                 </p>
              </div>
              <div className="sketch-border p-8 bg-white border-dashed border-ink relative overflow-hidden group hover:bg-highlighter-yellow/5 transition-colors">
                 <Sun className="absolute -top-6 -right-6 opacity-5 group-hover:opacity-20 transition-opacity" size={120} />
                 <h4 className="font-marker text-3xl mb-4 flex items-center gap-3">
                    <Sun size={24} className="text-highlighter-yellow" /> Energy
                 </h4>
                 <p className="font-hand text-xl opacity-70 leading-relaxed">
                    Our heatmap shows your <strong>Peak Hours</strong>. Discover if you're a morning genius or a midnight wizard, and stop doing low-priority chores during your peak!
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* ─── Final Anthem: Motivation ─── */}
      <footer className="mt-32 p-16 bg-white sketch-border border-double border-8 relative text-center max-w-5xl mx-auto transform hover:scale-[1.01] transition-all shadow-2xl">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-highlighter-pink px-10 py-3 rotate-1 font-marker text-white text-3xl shadow-xl border-4 border-white">
          THE GOLDEN RULE
        </div>
        <h4 className="font-marker text-5xl mb-8 mt-6">
          "Action precedes motivation."
        </h4>
        <p className="font-hand text-3xl leading-relaxed text-ink/60 max-w-3xl mx-auto">
          Planning is a form of procrastination if you never start the clock. 
          Use the <strong>Chunks</strong>. Set the timer for <span className="underline decoration-wavy decoration-highlighter-yellow font-bold text-ink">5 minutes</span>. 
          The momentum will do the rest.
        </p>
        <div className="mt-12 flex justify-center gap-4 opacity-20">
           <Pencil size={24} /><Sparkles size={24} /><CheckCircle2 size={24} />
        </div>
        <div className="mt-6 font-sketch text-lg uppercase tracking-[0.6em] opacity-30">
          BUILT FOR ARTISTS. POWERED BY AI.
        </div>
      </footer>
    </div>
  );
};

export default GuideView;
