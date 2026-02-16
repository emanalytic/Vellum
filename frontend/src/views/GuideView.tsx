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
} from 'lucide-react';

const GuideView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-12 pb-48 space-y-32">
      
      {/* ─── Header ─── */}
      <header className="text-center space-y-8 relative">
        <h1 className="marker-text text-6xl md:text-8xl">
          User Manual
        </h1>
        <p className="font-hand text-3xl md:text-4xl text-ink/60 max-w-3xl mx-auto leading-relaxed">
          How to use this app.
        </p>
      </header>

      {/* ─── 0. NAVIGATION ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Settings className="text-ink" size={32} />
             Navigation
          </h2>
          <p className="font-hand text-xl text-ink/60">Where to find everything.</p>
        </div>
        <div className="space-y-8">
           <div className="sketch-border bg-white p-8 shadow-sm">
             <h3 className="font-marker text-2xl mb-6">The Sidebar</h3>
             <ul className="space-y-6 font-hand text-xl">
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><LayoutDashboard size={18} /></div>
                 <div>
                    <strong>Tasks Tab:</strong> This is your main list where you add new things to do.
                 </div>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><Calendar size={18} /></div>
                 <div>
                    <strong>Calendar Tab:</strong> This shows your tasks on a 24-hour timeline.
                 </div>
               </li>
               <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><BarChart3 size={18} /></div>
                 <div>
                    <strong>Analytics Tab:</strong> See charts of how much time you've spent on tasks.
                 </div>
               </li>
               <li className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded bg-ink/5 flex items-center justify-center shrink-0 mt-1"><Settings size={18} /></div>
                 <div>
                    <strong>Settings:</strong> At the bottom of the sidebar. You can set your name and your working hours here.
                 </div>
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* ─── 1. TASKS ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Pencil className="text-highlighter-blue" size={32} />
             Work with Tasks
          </h2>
          <p className="font-hand text-xl text-ink/60">Adding and organizing.</p>
        </div>
        <div className="space-y-10">
           <div className="sketch-border bg-white p-8 relative">
             <h3 className="font-marker text-2xl mb-6">How to Add a Task</h3>
             <p className="font-hand text-xl leading-relaxed mb-8">
               Go to the <strong>Tasks</strong> tab and type what you need to do in the input box.
             </p>
             <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3 border-l-4 border-highlighter-blue pl-4">
                  <h4 className="font-marker text-xl flex items-center gap-2"><Target size={18}/> Skill & Priority</h4>
                  <p className="font-hand text-lg opacity-70">
                    Pick how hard the task is and how important it is. This helps the app decide when to schedule it.
                  </p>
                </div>
                <div className="space-y-3 border-l-4 border-highlighter-yellow pl-4">
                  <h4 className="font-marker text-xl flex items-center gap-2"><Lightbulb size={18}/> AI Chunks</h4>
                  <p className="font-hand text-lg opacity-70">
                    Turn this on to have the AI split your one big task into smaller sub-tasks automatically.
                  </p>
                </div>
             </div>
           </div>

           <div className="sketch-border bg-[#fff9c4] p-10 transform rotate-1 shadow-xl">
              <h3 className="font-marker text-3xl mb-6 flex items-center gap-3">
                <TrendingUp size={28} /> Satisfaction Score
              </h3>
              <p className="font-hand text-xl leading-relaxed">
                Before starting, guess how good you'll feel once it's done (0-100%). After you finish, give a real rating. This helps you realize that working is usually less painful than you think.
              </p>
           </div>
           
           <div className="p-6 sketch-border border-dashed bg-white/50">
              <h4 className="font-marker text-xl mb-4">Edit or Delete</h4>
              <p className="font-hand text-lg opacity-80">
                Click the <strong>Pencil</strong> icon on a task card to change details. Click the <strong>Trash</strong> icon to delete it.
              </p>
           </div>
        </div>
      </section>

      {/* ─── 2. CALENDAR ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Calendar className="text-highlighter-pink" size={32} />
             Calendar
          </h2>
          <p className="font-hand text-xl text-ink/60">Planning your day.</p>
        </div>
        <div className="space-y-8">
           <div className="sketch-border bg-white p-10">
             <h3 className="font-marker text-3xl mb-6">The Timeline</h3>
             <p className="font-hand text-xl mb-8">
               The Calendar shows you at what time you should start each task.
             </p>
             
             <div className="space-y-12">
                <div className="flex gap-8 items-start relative pb-8 border-b border-ink/5">
                  <div className="bg-ink text-white p-4 font-marker text-xl rotate-3 shrink-0">AUTO</div>
                  <div>
                    <h4 className="font-marker text-2xl mb-2">Smart Schedule</h4>
                    <p className="font-hand text-xl opacity-80">Click the "Smart Schedule" button at the top. The app will automatically place all your tasks into empty time slots based on your work hours.</p>
                  </div>
                </div>

                <div className="flex gap-8 items-start relative">
                  <div className="bg-white border-4 border-ink p-4 font-marker text-xl -rotate-2 shrink-0">MANUAL</div>
                  <div>
                    <h4 className="font-marker text-2xl mb-2">Picking a Slot</h4>
                    <p className="font-hand text-xl opacity-80">Click any hour on the calendar grid. A menu will open where you can pick a task to assign to that specific time.</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* ─── 3. WORKING ─── */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
        <div className="md:text-right sticky top-24">
          <h2 className="marker-text text-4xl mb-4 flex md:justify-end items-center gap-3">
             <Clock className="text-green-600" size={32} />
             Progress
          </h2>
          <p className="font-hand text-xl text-ink/60">Getting things done.</p>
        </div>
        <div className="space-y-12">
           <div className="sketch-border bg-white p-10">
             <h3 className="font-marker text-3xl mb-8">Tracking Work</h3>
             <ul className="space-y-12">
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0">1</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl">Start/Stop Timer</h4>
                      <p className="font-hand text-xl opacity-80 italic">
                        Click <strong>Start</strong> on your task when you begin working. This tracks exactly how much time you are spending.
                      </p>
                   </div>
                </li>
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0">2</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl">Sub-tasks</h4>
                      <p className="font-hand text-xl opacity-80">
                        Click a task to open the side panel. Here you can check off the smaller steps.
                      </p>
                   </div>
                </li>
                <li className="flex gap-6">
                   <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-marker text-2xl shrink-0">3</div>
                   <div className="space-y-3">
                      <h4 className="font-marker text-2xl">The Archive</h4>
                      <p className="font-hand text-xl opacity-80">
                        When a task is 100% finished, it moves to the <strong>Archive</strong> tab in the sidebar. You can see everything you've completed there.
                      </p>
                   </div>
                </li>
             </ul>
           </div>
        </div>
      </section>
    </div>
  );
};

export default GuideView;
