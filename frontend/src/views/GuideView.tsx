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
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-12 pb-48 space-y-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-40 -left-10 w-64 h-64 bg-highlighter-blue/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute top-[40%] -right-20 w-96 h-96 bg-highlighter-pink/5 rounded-full blur-[120px] -z-10" />
      
      {/* ─── Header: The Big Picture ─── */}
      <header className="text-center space-y-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-highlighter-yellow/15 rounded-full blur-[100px] -z-10" />
        <div className="inline-block relative">
          <h1 className="marker-text text-6xl md:text-8xl -rotate-1 relative z-10">
            The User Manual
          </h1>
          <div className="absolute -bottom-4 left-0 w-full h-6 bg-highlighter-yellow/40 -rotate-1 skew-x-12 z-0" />
        </div>
        <p className="font-hand text-3xl md:text-4xl text-ink/60 max-w-3xl mx-auto leading-relaxed italic relative">
          "From chaos to a sketch, from a sketch to a plan."
          <Sparkles className="absolute -right-8 -top-4 text-highlighter-yellow opacity-40 rotate-12" size={32} />
        </p>
      </header>

      {/* ─── 0. NAVIGATION & NAVIGATION ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start relative">
        <div className="md:text-right sticky top-24">
          <div className="inline-block relative">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3 relative z-10">
               <Settings className="text-ink" size={32} />
               Navigation
            </h2>
            <div className="absolute -bottom-2 right-0 w-32 h-4 bg-highlighter-blue/30 -rotate-2 -z-10" />
          </div>
          <p className="font-hand text-xl text-ink/60">Your home base.</p>
        </div>
        
        <div className="space-y-8 relative">
           {/* Tape effect */}
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 shadow-sm rotate-2 z-20 mix-blend-multiply border-x border-ink/5" />
           
           <div className="sketch-border bg-white p-8 shadow-sm relative overflow-hidden group transform hover:rotate-1 transition-transform">
             <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Settings size={160} />
             </div>
             <h3 className="font-marker text-2xl mb-6 flex items-center gap-2">
                The Command Center
                <div className="h-1 grow bg-dotted-ink opacity-10" />
             </h3>
             <ul className="space-y-6 font-hand text-xl">
               <li className="flex items-start gap-4 group/item">
                 <div className="w-10 h-10 rounded-full bg-highlighter-yellow/20 flex items-center justify-center shrink-0 mt-1 transition-transform group-hover/item:scale-110">
                    <Sparkles size={20} className="text-ink" />
                 </div>
                 <div>
                    <span className="font-bold underline decoration-highlighter-yellow/60 decoration-4">System Mood:</span> Click your avatar. We track your vibe during work to see how it affects your speed.
                 </div>
               </li>
               <li className="flex items-start gap-4 group/item">
                 <div className="w-10 h-10 rounded-full bg-highlighter-blue/20 flex items-center justify-center shrink-0 mt-1 transition-transform group-hover/item:scale-110">
                    <Settings size={20} className="text-ink" />
                 </div>
                 <div>
                    <span className="font-bold underline decoration-highlighter-blue/40 decoration-4">Win-dows:</span> Set your hours in Settings. The Smart Scheduler respects your sleep.
                 </div>
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* ─── 1. THE CANVAS ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start relative">
        <div className="md:text-right sticky top-24">
          <div className="inline-block relative">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3 relative z-10">
               <LayoutDashboard className="text-highlighter-blue" size={32} />
               The Canvas
            </h2>
            <div className="absolute -bottom-2 right-0 w-40 h-4 bg-highlighter-yellow/30 rotate-1 -z-10" />
          </div>
          <p className="font-hand text-xl text-ink/60">Where thoughts land.</p>
        </div>
        
        <div className="space-y-10">
           <div className="sketch-border bg-white p-8 relative overflow-hidden transform -rotate-1 shadow-sm hover:rotate-0 transition-transform">
             <div className="absolute top-0 right-0 w-16 h-16 bg-highlighter-blue/5 rounded-bl-[100px]" />
             <h3 className="font-marker text-2xl mb-6 italic underline decoration-wavy decoration-highlighter-blue/30">Structuring a Pursuit</h3>
             <p className="font-hand text-xl leading-relaxed mb-8">
               A "Task" here is a <strong>Pursuit</strong>. Deep work needs context, not just a label.
             </p>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-4 sketch-border border-dashed border-highlighter-blue/40 bg-highlighter-blue/5">
                  <h4 className="font-marker text-xl flex items-center gap-2 mb-2">
                    <Target size={18} className="text-highlighter-blue" />
                    Buffers
                  </h4>
                  <p className="font-hand text-lg opacity-80">
                    Novices get 25% extra time. Masters stay lean.
                  </p>
                </div>
                <div className="p-4 sketch-border border-dashed border-highlighter-yellow/40 bg-highlighter-yellow/5">
                  <h4 className="font-marker text-xl flex items-center gap-2 mb-2">
                    <Lightbulb size={18} className="text-highlighter-yellow" />
                    AI Chunking
                  </h4>
                  <p className="font-hand text-lg opacity-80">
                    Splits big goals into 3-5 manageable steps automatically.
                  </p>
                </div>
             </div>
           </div>

           <div className="sketch-border bg-[#fff9c4] p-10 transform rotate-1 shadow-xl relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 text-ink/5 rotate-12 group-hover:scale-110 transition-transform"><Brain size={120} /></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-highlighter-pink/20" />
              <h3 className="font-marker text-3xl mb-6 flex items-center gap-3">
                <TrendingUp size={28} className="text-highlighter-pink" /> 
                Feeling Good Science
              </h3>
              <p className="font-hand text-xl leading-relaxed relative z-10">
                Predict your joy (0-100%), then rate it after. <span className="bg-highlighter-pink/20 px-1">Evidence shows</span> that the "Actual" joy is almost always higher than predicted, crushing procrastination loops.
              </p>
           </div>
           
           <div className="p-6 sketch-border border-dashed bg-white transform -rotate-1 flex gap-4 items-center">
              <Pencil size={32} className="text-ink/20 shrink-0" />
              <p className="font-hand text-lg opacity-80 italic">
                "Use the <strong>Pencil</strong> to refine time, and <strong>Trash</strong> to archive. Vaulted tasks vanish after 30 days."
              </p>
           </div>
        </div>
      </section>

      {/* ─── 2. THE TIMELINE ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start relative">
        <div className="md:text-right sticky top-24">
          <div className="inline-block relative">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3 relative z-10">
               <Calendar className="text-highlighter-pink" size={32} />
               The Timeline
            </h2>
            <div className="absolute -bottom-2 right-0 w-36 h-4 bg-highlighter-pink/30 -rotate-1 -z-10" />
          </div>
          <p className="font-hand text-xl text-ink/60">Organizing reality.</p>
        </div>
        
        <div className="space-y-8">
           <div className="sketch-border bg-white p-10 transform rotate-1 shadow-md hover:rotate-0 transition-all">
             {/* "Post-it" sticker */}
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-highlighter-pink/10 sketch-border flex items-center justify-center -rotate-12 z-20">
                <Calendar size={32} className="text-highlighter-pink/40" />
             </div>
             
             <h3 className="font-marker text-3xl mb-8">The Tetris of Time</h3>
             
             <div className="space-y-12">
                <div className="relative p-6 sketch-border border-dashed border-ink/10 group hover:border-ink/30 transition-colors">
                  <div className="absolute top-2 right-2 bg-ink text-white px-3 py-1 font-marker text-sm rotate-3 shadow-md">AUTO</div>
                  <h4 className="font-marker text-2xl mb-2 flex items-center gap-2">
                    Smart Schedule
                  </h4>
                  <p className="font-hand text-xl opacity-80 leading-relaxed">
                    Balances deadlines, priority, and energy windows automatically. Magic.
                  </p>
                </div>

                <div className="relative p-6 sketch-border border-dashed border-ink/10 group hover:border-ink/30 transition-colors">
                  <div className="absolute top-2 right-2 bg-white border border-ink px-3 py-1 font-marker text-sm -rotate-3 shadow-md">MANUAL</div>
                  <h4 className="font-marker text-2xl mb-2 flex items-center gap-2">
                    Seal the Slot
                  </h4>
                  <p className="font-hand text-xl opacity-80 leading-relaxed">
                    Click any hour on the grid to commit a specific task or habit.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="sketch-border p-6 bg-paper-bg/40 border-double border-4 border-ink/10 transform -rotate-2 hover:rotate-0 transition-transform">
                     <h5 className="font-marker text-xl mb-3 flex items-center gap-2 text-ink/40"><Moon size={18}/> Night Owl</h5>
                     <p className="font-hand text-lg">One-click shift for midnight wizards.</p>
                  </div>
                  <div className="sketch-border p-6 bg-paper-bg/40 border-double border-4 border-ink/10 transform rotate-2 hover:rotate-0 transition-transform">
                     <h5 className="font-marker text-xl mb-3 flex items-center gap-2 text-ink/40"><Calendar size={18}/> Weekly View</h5>
                     <p className="font-hand text-lg">Zoom out for the 7-day master plan.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ─── 3. THE EXECUTION ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start relative">
        <div className="md:text-right sticky top-24">
          <div className="inline-block relative">
            <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3 relative z-10">
               <Clock className="text-green-600" size={32} />
               Execution
            </h2>
            <div className="absolute -bottom-2 right-0 w-32 h-4 bg-green-200/40 rotate-1 -z-10" />
          </div>
          <p className="font-hand text-xl text-ink/60">Building the engine.</p>
        </div>
        
        <div className="space-y-12">
           <div className="sketch-border bg-white p-10 transform -rotate-1 shadow-sm">
             <h3 className="font-marker text-3xl mb-8">Fueling the System</h3>
             <ul className="space-y-10">
                <li className="flex gap-6 items-center group">
                   <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg group-hover:rotate-6 transition-transform">1</div>
                   <div>
                      <h4 className="font-marker text-2xl">Start/Stop</h4>
                      <p className="font-hand text-xl opacity-80">Track deep work. Stop for coffee. Clean data = smart AI.</p>
                   </div>
                </li>
                <li className="flex gap-6 items-center group">
                   <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg group-hover:-rotate-6 transition-transform">2</div>
                   <div>
                      <h4 className="font-marker text-2xl">Chunking</h4>
                      <p className="font-hand text-xl opacity-80">Micro-wins keep the dopamine flowing.</p>
                   </div>
                </li>
                <li className="flex gap-6 items-center group">
                   <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center font-marker text-2xl shrink-0 shadow-lg group-hover:rotate-3 transition-transform">3</div>
                   <div>
                      <h4 className="font-marker text-2xl">The Vault</h4>
                      <p className="font-hand text-xl opacity-80 flex items-center gap-2">
                        Archive forever. <Archive size={18} className="opacity-40" />
                      </p>
                   </div>
                </li>
             </ul>
           </div>

           <div className="grid sm:grid-cols-2 gap-10">
              <div className="sketch-border p-8 bg-white shadow-sm transform rotate-1 group hover:-rotate-1 transition-all">
                 <h4 className="font-marker text-2xl mb-4 flex items-center gap-3">
                    <Activity size={24} className="text-highlighter-pink" /> Velocity
                 </h4>
                 <div className="w-full h-1 bg-highlighter-pink/10 mb-4" />
                 <p className="font-hand text-xl opacity-70">
                    Calculates your true capacity by comparing estimates vs reality.
                 </p>
              </div>
              <div className="sketch-border p-8 bg-white shadow-sm transform -rotate-1 group hover:rotate-1 transition-all">
                 <h4 className="font-marker text-2xl mb-4 flex items-center gap-3">
                    <Sun size={24} className="text-highlighter-yellow" /> Energy
                 </h4>
                 <div className="w-full h-1 bg-highlighter-yellow/10 mb-4" />
                 <p className="font-hand text-xl opacity-70">
                    Discover your peak hours. Work with your biology, not against it.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* ─── Final Anthem: Motivation ─── */}
      <footer className="mt-32 p-16 bg-white sketch-border border-double border-12 border-ink/5 relative text-center max-w-5xl mx-auto transform hover:scale-[1.02] transition-all shadow-2xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-highlighter-pink px-12 py-4 rotate-1 font-marker text-white text-3xl shadow-xl border-4 border-white select-none">
          THE GOLDEN RULE
        </div>
        
        <div className="space-y-8 mt-6">
          <h4 className="marker-text text-5xl">
            "Action precedes motivation."
          </h4>
          <p className="font-hand text-3xl leading-relaxed text-ink/60 max-w-3xl mx-auto">
            Planning is a form of procrastination if you never start the clock. 
            Set the timer for <span className="underline decoration-wavy decoration-highlighter-yellow font-bold text-ink">5 minutes</span>. 
            The momentum will do the rest.
          </p>
          
          <div className="pt-8 flex justify-center gap-8 opacity-20 filter grayscale hover:grayscale-0 transition-all cursor-crosshair">
             <Pencil size={32} className="rotate-12 transition-transform hover:scale-125" />
             <Sparkles size={32} className="-rotate-12 transition-transform hover:scale-125" />
             <CheckCircle2 size={32} className="rotate-6 transition-transform hover:scale-125" />
          </div>
          
          <div className="pt-4 font-sketch text-lg uppercase tracking-[0.8em] opacity-30 select-none">
            BUILT FOR ARTISTS. POWERED BY AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuideView;
