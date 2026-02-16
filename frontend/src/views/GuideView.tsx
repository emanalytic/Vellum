import React from 'react';
import { 
  TrendingUp, 
  LayoutDashboard, 
  Calendar, 
  Settings,
  Lightbulb, 
  Target, 
  Clock,
  Pencil,
  BarChart3,
  Moon,
  Sun,
  Archive,
  MousePointer2,
  CheckCircle2,
  Quote,
  Activity,
  Star
} from 'lucide-react';

const GuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 pb-32 space-y-24">
      
      {/* ─── Header ─── */}
      <header className="text-center space-y-4 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-highlighter-yellow/20 -rotate-2 blur-xl" />
        <h1 className="marker-text text-5xl md:text-6xl text-ink">
          The Manual
        </h1>
        <p className="font-hand text-xl md:text-2xl text-ink/50 max-w-xl mx-auto italic">
          Everything you need to know about navigating your workflow.
        </p>
      </header>

      {/* ─── 0. NAVIGATION ─── */}
      <section className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
        <div className="md:text-right sticky top-24 pt-2">
          <h2 className="marker-text text-2xl mb-2 flex md:justify-end items-center gap-2">
             <Settings className="text-ink" size={20} />
             Navigation
          </h2>
          <p className="font-hand text-base text-ink/40">Getting around.</p>
        </div>
        
        <div className="space-y-6">
           <div className="sketch-border bg-white p-6 shadow-sm relative overflow-hidden group">
             {/* Tape Effect */}
             <div className="absolute -top-1 -left-4 w-12 h-6 bg-highlighter-pink/20 -rotate-12" />
             
             <h3 className="font-marker text-lg mb-4 text-ink/80">The Sidebar</h3>
             <ul className="space-y-4 font-hand text-base leading-snug">
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded bg-ink/5 flex items-center justify-center mt-0.5"><LayoutDashboard size={14} /></div>
                 <span><strong>Canvas:</strong> Your main board. This is where you scribble new ideas and manage active work.</span>
               </li>
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded bg-ink/5 flex items-center justify-center mt-0.5"><Calendar size={14} /></div>
                 <span><strong>Timeline:</strong> Your interactive timeline for visualizing the hours ahead.</span>
               </li>
               <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-ink/5 flex items-center justify-center mt-0.5"><BarChart3 size={14} /></div>
                 <span><strong>Insights:</strong> Deep dives into how you're spending your focus time.</span>
               </li>
               <li className="flex items-start gap-3">
                 <div className="w-6 h-6 rounded bg-ink/5 flex items-center justify-center mt-0.5"><Settings size={14} /></div>
                 <span><strong>Settings:</strong> Tucked at the bottom. Use this to toggle your identity and core work hours.</span>
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* ─── 1. CANVAS ─── */}
      <section className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
        <div className="md:text-right sticky top-24 pt-2">
          <h2 className="marker-text text-2xl mb-2 flex md:justify-end items-center gap-2">
             <Pencil className="text-highlighter-blue" size={20} />
             Canvas
          </h2>
          <p className="font-hand text-base text-ink/40">Task Management.</p>
        </div>
        
        <div className="space-y-8">
           <div className="sketch-border bg-white p-6 relative">
             <h3 className="font-marker text-lg mb-4">Adding a Task</h3>
             <p className="font-hand text-base mb-6 opacity-70">
               Click the plus button at the top of <strong>Canvas</strong> to begin.
             </p>
             <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2 border-l-2 border-highlighter-blue/40 pl-3">
                  <h4 className="font-marker text-base flex items-center gap-2 text-ink/60"><Target size={14}/> Parameters</h4>
                  <p className="font-hand text-sm leading-relaxed opacity-60">
                    Set your <strong>Skill Level</strong> (Mastery) and <strong>Priority</strong>. This isn't just metadata—the Smart Scheduler uses this to rank tasks.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-highlighter-yellow/40 pl-3">
                  <h4 className="font-marker text-base flex items-center gap-2 text-ink/60"><Lightbulb size={14}/> AI Chunks</h4>
                  <p className="font-hand text-sm leading-relaxed opacity-60">
                    Struggling to start? The <strong>Want Help?</strong> toggle uses AI to break your task into actionable sub-tasks.
                  </p>
                </div>
             </div>
           </div>

           {/* David Burns Sticky Note */}
           <div className="sketch-border bg-[#fff9c4] p-8 transform rotate-1 shadow-sm relative group hover:rotate-0 transition-transform cursor-default">
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-20 transition-opacity"><Quote size={40} /></div>
              <h3 className="font-marker text-xl mb-3 flex items-center gap-2 text-ink/80">
                <TrendingUp size={18} className="text-green-600" /> David Burns' Method
              </h3>
              <p className="font-hand text-base leading-relaxed text-ink/70">
                Dr. David Burns, author of <em>Feeling Good</em>, suggests predicting your <strong>Satisfaction Level</strong> before you work. 
                <br/><br/>
                We often overestimate how painful a task will be. By predicting joy first, and recording the actual result later, you retrain your brain to stop procrastinating.
              </p>
           </div>
        </div>
      </section>

      {/* ─── 2. TIMELINE ─── */}
      <section className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
        <div className="md:text-right sticky top-24 pt-2">
          <h2 className="marker-text text-2xl mb-2 flex md:justify-end items-center gap-2">
             <Calendar className="text-highlighter-pink" size={20} />
             Timeline
          </h2>
          <p className="font-hand text-base text-ink/40">Visual Scheduling.</p>
        </div>
        
        <div className="space-y-6">
           <div className="sketch-border bg-white p-6">
             <h3 className="font-marker text-lg mb-4">Scheduling your Flow</h3>
             <p className="font-hand text-base mb-8 opacity-70">The calendar view is where your tasks meet the reality of time.</p>
             
             <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="bg-ink text-white px-3 py-1 font-marker text-sm rotate-1 shrink-0">AUTO</div>
                  <div>
                    <h4 className="font-marker text-base mb-1">Smart Schedule</h4>
                    <p className="font-hand text-sm opacity-60 leading-relaxed">Let the engine automatically place all your tasks based on priority, deadline, and your available <strong>WIN-DOWS</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="bg-white border-2 border-ink px-3 py-1 font-marker text-sm -rotate-1 shrink-0">MANUAL</div>
                  <div>
                    <h4 className="font-marker text-base mb-1">Grid Booking</h4>
                    <p className="font-hand text-sm opacity-60 leading-relaxed">Click any open hour on the timeline to manually "Seal the Slot." Use this for tasks that <em>must</em> happen at a specific time.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="sketch-border p-4 bg-paper-bg/40 border-dashed border-ink/10 relative">
                     <div className="absolute top-1 right-2 text-ink/10 rotate-12"><Moon size={12}/></div>
                     <h5 className="font-marker text-sm mb-2 flex items-center gap-2 text-ink/60">Night Owl</h5>
                     <p className="font-hand text-xs opacity-70">Sets your window to later hours (e.g., 2 PM to 2 AM). Use this if you do your best work when the sun is down.</p>
                  </div>
                  <div className="sketch-border p-4 bg-paper-bg/40 border-dashed border-ink/10 relative">
                     <div className="absolute top-1 right-2 text-ink/10 -rotate-12"><Sun size={12}/></div>
                     <h5 className="font-marker text-sm mb-2 flex items-center gap-2 text-ink/60">Early Bird</h5>
                     <p className="font-hand text-xs opacity-70">Focuses your energy in the morning (e.g., 7 AM to 7 PM). Ideal for early risers who want to clear the deck by dinner.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ─── 3. EXECUTION ─── */}
      <section className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
        <div className="md:text-right sticky top-24 pt-2">
          <h2 className="marker-text text-2xl mb-2 flex md:justify-end items-center gap-2">
             <Clock className="text-green-600" size={20} />
             Execution
          </h2>
          <p className="font-hand text-base text-ink/40">Tracking progress.</p>
        </div>
        
        <div className="space-y-6">
           <div className="sketch-border bg-white p-6">
             <ul className="space-y-8 font-hand text-base">
                <li className="flex gap-5">
                   <div className="w-8 h-8 sketch-border flex items-center justify-center font-marker text-sm shrink-0">01</div>
                   <div>
                      <h4 className="font-marker text-base">The Timer</h4>
                      <p className="opacity-60 text-sm leading-relaxed">
                        Every session is logged. Start the clock on a task to track <strong>Actual Time</strong> vs <strong>Estimated Time</strong>.
                      </p>
                   </div>
                </li>
                <li className="flex gap-5">
                   <div className="w-8 h-8 sketch-border flex items-center justify-center font-marker text-sm shrink-0">02</div>
                   <div>
                      <h4 className="font-marker text-base">Sub-Tasks (Chunks)</h4>
                      <p className="opacity-60 text-sm leading-relaxed">
                        Click any task to expand the side panel. Deleting or completing these smaller steps updates your overall progress in real-time.
                      </p>
                   </div>
                </li>
                <li className="flex gap-5">
                   <div className="w-8 h-8 sketch-border flex items-center justify-center font-marker text-sm shrink-0">03</div>
                   <div>
                      <h4 className="font-marker text-base flex items-center gap-2">The Vault <Archive size={14}/></h4>
                      <p className="opacity-60 text-sm leading-relaxed">
                        When a task is complete, it is archived in <strong>The Vault</strong>. You can search or export your history from there anytime.
                      </p>
                   </div>
                </li>
             </ul>
           </div>
        </div>
      </section>

      {/* ─── 4. INSIGHTS ─── */}
      <section className="grid md:grid-cols-[180px_1fr] gap-8 items-start">
        <div className="md:text-right sticky top-24 pt-2">
          <h2 className="marker-text text-2xl mb-2 flex md:justify-end items-center gap-2">
             <Activity className="text-highlighter-pink" size={20} />
             Insights
          </h2>
          <p className="font-hand text-base text-ink/40">Data Visualization.</p>
        </div>
        
        <div className="space-y-6">
           <div className="sketch-border bg-white p-6 relative">
             <div className="absolute -bottom-2 -right-2 transform rotate-12 opacity-5"><TrendingUp size={60} /></div>
             <h3 className="font-marker text-lg mb-4">Your Progress Dashboard</h3>
             <p className="font-hand text-base mb-6 opacity-70">The Insights tab processes your logs to show you the truth about your productivity.</p>
             
             <div className="space-y-6 font-hand text-sm">
                <div className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-highlighter-yellow/30 flex items-center justify-center mt-0.5 shrink-0"><Lightbulb size={12} /></div>
                   <div>
                      <strong>Energy Map:</strong> A 24-hour heat map showing when you are actually most focused. Use this to identify if you're a true Night Owl or Early Bird.
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-highlighter-pink/30 flex items-center justify-center mt-0.5 shrink-0"><Star size={12} /></div>
                   <div>
                      <strong>Growth Timeline:</strong> Visualizes your task completion velocity. Watch your "Vault" grow as you master your schedule.
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 shrink-0"><CheckCircle2 size={12} className="text-green-600" /></div>
                   <div>
                      <strong>Satisfaction Scorecard:</strong> This compares your <em>Predicted</em> vs <em>Actual</em> satisfaction scores. It's the ultimate tool for overcoming the "Emotional Weight" of starting.
                   </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ─── Closing Quote ─── */}
      <footer className="mt-20 pt-16 border-t-4 border-double border-ink/20 text-center max-w-2xl mx-auto space-y-8 relative">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-ink/5"><Quote size={80} /></div>
        
        <p className="font-hand text-2xl leading-relaxed text-ink/80 italic relative z-10">
          "The greatest source of fatigue is not the work itself, but the <strong>emotional weight</strong> of the tasks we leave unfinished."
        </p>
        
        <div className="flex flex-col items-center gap-2 opacity-50 relative z-10">
          <div className="w-12 h-[2px] bg-ink" />
          <p className="font-marker text-sm tracking-widest uppercase">Take the first step.</p>
        </div>
        
        <div className="pt-12 flex justify-center gap-6 opacity-10">
           <Pencil size={20} /><SparklesIcon size={20} /><CheckCircle2 size={20} /><MousePointer2 size={20} />
        </div>
      </footer>
    </div>
  );
};

/* Internal simple Sparkles placeholder icon */
const SparklesIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813L4.275 10.725 10.088 12.637 12 18.45l1.912-5.813L19.725 13.275 13.912 11.363Z"/>
    <path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>
  </svg>
);

export default GuideView;
