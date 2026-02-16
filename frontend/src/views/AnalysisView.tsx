import React, { useMemo } from "react";
import type { Task } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts";
import {
  Activity,
  Lightbulb,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Award,
  MoveRight,
} from "lucide-react";

interface AnalysisViewProps {
  tasks: Task[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ tasks }) => {
  const allLogs = useMemo(() => tasks.flatMap((t) => t.history || []), [tasks]);


  const activityByHour = useMemo(() => {
    const hourBuckets = new Array(24).fill(0); // total focused minutes per hour

    allLogs.forEach((log) => {
      if (!log.startTime || !log.durationSeconds || log.durationSeconds <= 0)
        return;

      const startDate = new Date(log.startTime);
      if (isNaN(startDate.getTime())) return;

      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      
      // Safety check for reasonable duration (e.g. < 24 hours) to prevent infinite loops
      const durationMins = Math.ceil(log.durationSeconds / 60);
      const totalMins = Math.min(durationMins, 24 * 60); 

      // Distribute focus time across hours the session spanned
      let remaining = totalMins;
      let hour = startHour;

      // First (partial) hour
      const firstHourMins = Math.min(remaining, 60 - startMinute);
      hourBuckets[hour] += firstHourMins;
      remaining -= firstHourMins;
      hour = (hour + 1) % 24;

      // Subsequent full hours
      while (remaining > 0) {
        const mins = Math.min(remaining, 60);
        hourBuckets[hour] += mins;
        remaining -= mins;
        hour = (hour + 1) % 24;
      }
    });

    // Find the max for relative scoring
    const maxMins = Math.max(...hourBuckets, 1);

    return hourBuckets.map((mins, i) => ({
      hour: (i % 12 || 12) + (i >= 12 ? " PM" : " AM"),
      focusMinutes: mins,
      // Energy level as a percentage of peak (0-100%)
      energyLevel: Math.round((mins / maxMins) * 100),
      label: i,
    }));
  }, [allLogs]);

  // CHART 2: COMPLETED TASKS OVER TIME
  // Shows completion history as a timeline
  const completionTimeline = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === "completed");

    if (completedTasks.length === 0) return [];

    // Group completions by date
    const dateMap = new Map<string, number>();

    completedTasks.forEach((task) => {
      // Use the last progress log as actual completion time
      const logs = task.history || [];
      let completionDate: string;

      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1];
        completionDate = new Date(
          lastLog.endTime || lastLog.date,
        ).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (task.deadline) {
        completionDate = new Date(task.deadline).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        completionDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      dateMap.set(completionDate, (dateMap.get(completionDate) || 0) + 1);
    });

    // Convert to array sorted by date
    const entries = Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      // Helper for sorting
      timestamp: new Date(date).getTime(),
      completed: count,
      cumulative: 0, // will be filled below
    }));

    // Sort chronologically
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Add cumulative count
    let cumCount = 0;
    entries.forEach((entry) => {
      cumCount += entry.completed;
      entry.cumulative = cumCount;
    });

    return entries;
  }, [tasks]);

  // CHART 3: SATISFACTION (David Burns)
  const satisfactionData = useMemo(() => {
    // Helper to get completion time
    const getCompletionTime = (t: Task) => {
      if (t.history && t.history.length > 0) {
        const last = t.history[t.history.length - 1];
        return new Date(last.endTime || last.date).getTime();
      }
      // Fallback to updated_at if available, or 0
      return 0;
    };

    return tasks
      .filter(
        (t) => t.status === "completed" && t.actualSatisfaction !== undefined,
      )
      .sort((a, b) => getCompletionTime(b) - getCompletionTime(a)) // Newest first
      .slice(0, 10) // Show last 10 completed tasks
      .map((t) => ({
        name: t.description,
        predicted: t.predictedSatisfaction || 50,
        actual: t.actualSatisfaction || 50,
        // Calculate accuracy/gap for fun
        gap: (t.actualSatisfaction || 50) - (t.predictedSatisfaction || 50),
      }));
  }, [tasks]);

  // ── Summary Stats ──
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const activeTasks = tasks.filter(
    (t) => t.status !== "completed" && t.status !== "archived",
  ).length;
  const totalFocusMinutes = Math.floor(
    tasks.reduce((acc, t) => acc + (t.totalTimeSeconds || 0), 0) / 60,
  );
  const totalSessions = allLogs.length;

  // Peak hour calculation
  const peakHourEntry = activityByHour.reduce(
    (max, curr) => (curr.focusMinutes > max.focusMinutes ? curr : max),
    activityByHour[0],
  );

  const avgSessionMins =
    totalSessions > 0
      ? Math.round(
          allLogs.reduce((sum, l) => sum + (l.durationSeconds || 0), 0) /
            totalSessions /
            60,
        )
      : 0;

  const hasLogData = allLogs.length > 0;
  const hasCompletions = completedCount > 0;

  // Custom bar shape for energy chart
  const EnergyBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    if (!height || height <= 0 || !y) return null;

    return (
      <g>
        <path
          d={`M ${x + 1} ${y + height} L ${x + 3} ${y + 3} 
             C ${x + width * 0.3} ${y - 1}, ${x + width * 0.7} ${y - 1}, ${x + width - 3} ${y + 3} 
             L ${x + width - 1} ${y + height} Z`}
          fill={fill}
          fillOpacity={0.5}
        />
        <path
          d={`M ${x + 4} ${y + 4} Q ${x + width / 2} ${y} ${x + width - 4} ${y + 4}`}
          stroke={fill}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />
      </g>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      {/* ─── Header ─── */}
      <header className="mb-6">
        <h2 className="marker-text text-3xl md:text-4xl inline-block px-4 py-1 bg-highlighter-pink -rotate-1 relative">
          Progress Insights
          <div className="absolute -right-8 -top-8 opacity-20 rotate-12 hidden md:block">
            <Activity size={48} />
          </div>
        </h2>
        <p className="font-sketch text-md md:text-lg text-ink-light mt-4">
          {hasLogData
            ? "Your real data, visualized."
            : "Start tracking tasks to build your insights."}
        </p>
      </header>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="sketch-border p-4 md:p-5 bg-white rotate-1 hover:rotate-0 transition-transform">
          <span className="font-sketch text-[9px] md:text-[10px] uppercase opacity-40 flex items-center gap-1">
            <CheckCircle size={11} /> Completed
          </span>
          <div className="marker-text text-3xl md:text-4xl mt-1">
            {completedCount}
          </div>
          <p className="font-hand text-[10px] md:text-xs mt-1 italic opacity-50">
            {activeTasks} still in progress
          </p>
        </div>
        <div className="sketch-border p-4 md:p-5 bg-white -rotate-1 hover:rotate-0 transition-transform">
          <span className="font-sketch text-[9px] md:text-[10px] uppercase opacity-40 flex items-center gap-1">
            <Clock size={11} /> Deep Work
          </span>
          <div className="marker-text text-3xl md:text-4xl mt-1">
            {totalFocusMinutes}
            <span className="text-sm md:text-base">m</span>
          </div>
          <p className="font-hand text-[10px] md:text-xs mt-1 italic opacity-50">
            {totalSessions} sessions logged
          </p>
        </div>
        <div className="sketch-border p-4 md:p-5 bg-white rotate-2 hover:rotate-0 transition-transform">
          <span className="font-sketch text-[9px] md:text-[10px] uppercase opacity-40 flex items-center gap-1">
            <TrendingUp size={11} /> Peak Hour
          </span>
          <div className="marker-text text-3xl md:text-4xl mt-1">
            {peakHourEntry.focusMinutes > 0 ? peakHourEntry.hour : "—"}
          </div>
          <p className="font-hand text-[10px] md:text-xs mt-1 italic opacity-50">
            {peakHourEntry.focusMinutes > 0
              ? `${peakHourEntry.focusMinutes}min focused here`
              : "Track to discover"}
          </p>
        </div>
        <div className="sketch-border p-4 md:p-5 bg-white -rotate-2 hover:rotate-0 transition-transform border-double border-4">
          <span className="font-sketch text-[9px] md:text-[10px] uppercase opacity-40 flex items-center gap-1">
            <Award size={11} /> Avg Session
          </span>
          <div className="marker-text text-3xl md:text-4xl mt-1">
            {avgSessionMins > 0 ? avgSessionMins : "—"}
            <span className="text-sm md:text-base">
              {avgSessionMins > 0 ? "m" : ""}
            </span>
          </div>
          <p className="font-hand text-[10px] md:text-xs mt-1 italic opacity-50 text-highlighter-pink font-bold">
            Consistency is key
          </p>
        </div>
      </div>

      {/* ─── Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pt-4">
        {/* ════════════════════════════════════════════════
            CHART 1: ENERGY / ACTIVITY LEVELS (24-Hour)
            Shows which hours you're historically most active
            ════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-marker text-xl md:text-2xl opacity-70 flex items-center gap-2">
              <Lightbulb size={18} className="text-highlighter-yellow" /> Energy
              Levels
            </h3>
            <span className="font-hand text-xs opacity-40">
              {hasLogData ? "Based on all your progress logs" : "No data yet"}
            </span>
          </div>
          <div className="h-72 md:h-80 sketch-border bg-white p-4 md:p-5 relative overflow-hidden">
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "15px 15px",
              }}
            />

            {!hasLogData ? (
              <div className="flex flex-col items-center justify-center h-full opacity-25">
                <Lightbulb size={48} className="mb-3" />
                <p className="font-hand text-lg italic text-center">
                  Start timing your tasks
                </p>
                <p className="font-sketch text-[10px] mt-1 uppercase opacity-60">
                  Your energy map will appear here
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={activityByHour}
                  margin={{ top: 15, right: 5, left: -25, bottom: 0 }}
                >
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Patrick Hand",
                      fontSize: 10,
                      fill: "#1a1a1a55",
                    }}
                    interval={2}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Courier Prime",
                      fontSize: 9,
                      fill: "#1a1a1a33",
                    }}
                    unit="m"
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-ink)", opacity: 0.03 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-highlighter-yellow p-3 sketch-border shadow-xl transform -rotate-1">
                            <p className="font-marker text-lg leading-none mb-1">
                              {data.focusMinutes} MIN
                            </p>
                            <p className="font-sketch text-[10px] uppercase opacity-60 font-black">
                              {data.hour} — {data.energyLevel}% energy
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="focusMinutes" shape={<EnergyBar />}>
                    {activityByHour.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.energyLevel >= 80
                            ? "var(--color-highlighter-pink)"
                            : entry.energyLevel >= 40
                              ? "var(--color-highlighter-yellow)"
                              : entry.focusMinutes > 0
                                ? "#c4b5a0"
                                : "#e8e4de"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {hasLogData && (
            <p className="font-hand text-xs text-center opacity-40 italic">
              Your peak productivity is at {peakHourEntry.hour} — schedule
              important tasks here!
            </p>
          )}
        </div>

        {/* ════════════════════════════════════════════════
            CHART 2: COMPLETED TASKS TIMELINE
            Shows how many tasks you completed over time
            ════════════════════════════════════════════════ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-marker text-xl md:text-2xl opacity-70 flex items-center gap-2">
              <Star size={18} className="text-highlighter-pink" /> Output Velocity
            </h3>
            <div className="bg-ink text-white px-2 py-0.5 text-[9px] font-sketch uppercase rotate-1">
              {completedCount} total
            </div>
          </div>
          <div className="h-72 md:h-80 sketch-border bg-white p-4 md:p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-15 transition-opacity">
              <Star size={90} />
            </div>

            {!hasCompletions ? (
              <div className="flex flex-col items-center justify-center h-full opacity-25">
                <CheckCircle size={48} className="mb-3" />
                <p className="font-hand text-lg italic text-center">
                  Complete tasks to see your progress
                </p>
                <p className="font-sketch text-[10px] mt-1 uppercase opacity-60">
                  Every finish line counts
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart
                  data={completionTimeline}
                  margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="gradCumulative"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-ink)"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-ink)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#00000008" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Patrick Hand",
                      fontSize: 12,
                      fill: "#1a1a1a55",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Courier Prime",
                      fontSize: 9,
                      fill: "#1a1a1a33",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 sketch-border shadow-2xl border-double border-4 transform rotate-1">
                            <div className="font-sketch text-[9px] uppercase opacity-40 mb-1">
                              {payload[0]?.payload.date}
                            </div>
                            <p className="font-marker text-2xl leading-none text-highlighter-pink">
                              {payload[0]?.payload.completed}{" "}
                              <span className="text-sm text-ink">
                                completed
                              </span>
                            </p>
                            <p className="font-hand text-xs mt-1 opacity-50">
                              {payload[0]?.payload.cumulative} total so far
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="var(--color-ink)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#gradCumulative)"
                    name="Cumulative"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--color-highlighter-pink)"
                    strokeWidth={4}
                    dot={{
                      fill: "white",
                      stroke: "var(--color-highlighter-pink)",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    name="Daily Count"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            CHART 3: SATISFACTION PREDICTION (Feeling Good)
            Compare predicted vs actual satisfaction
            ════════════════════════════════════════════════ */}
        <div className="space-y-6 lg:col-span-2 pt-8 border-t-2 border-dashed border-ink/10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* ─── Scorecard Table ─── */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-marker text-xl md:text-2xl opacity-70 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500" /> Satisfaction Scorecard
                </h3>
              </div>
              
              <div className="sketch-border bg-white p-6 relative overflow-hidden min-h-[300px]">
                {satisfactionData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center relative px-4">
                    <p className="font-sketch text-lg mb-8 opacity-40 uppercase tracking-widest border-b border-ink/10 pb-2">
                       Waiting for data...
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl relative z-10">
                      {/* Step 1 */}
                      <div className="relative group p-4 border-2 border-dashed border-ink/5 rounded-lg hover:bg-highlighter-pink/5 transition-colors">
                        <div className="absolute -top-3 -left-3 bg-white border border-ink px-2 py-0.5 font-sketch text-xs shadow-sm transform -rotate-3">
                          Step 1
                        </div>
                        <h4 className="font-marker text-lg mb-2 text-ink">Predict</h4>
                        <p className="font-hand text-sm opacity-60 leading-tight">
                          In <b>Journal</b>, set your <span className="text-highlighter-pink font-bold">Predicted Satisfaction</span> before you start.
                        </p>
                        {/* Arrow to next step */}
                        <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-20 text-ink/20">
                           <MoveRight size={24} />
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative group p-4 border-2 border-dashed border-ink/5 rounded-lg hover:bg-highlighter-yellow/5 transition-colors">
                        <div className="absolute -top-3 -left-3 bg-white border border-ink px-2 py-0.5 font-sketch text-xs shadow-sm transform rotate-2">
                          Step 2
                        </div>
                        <h4 className="font-marker text-lg mb-2 text-ink">Focus</h4>
                        <p className="font-hand text-sm opacity-60 leading-tight">
                          Use the <b>Timer</b> to work on your task without distractions.
                        </p>
                         {/* Arrow to next step */}
                        <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-20 text-ink/20">
                           <MoveRight size={24} />
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative group p-4 border-2 border-dashed border-ink/5 rounded-lg hover:bg-green-50 transition-colors">
                         <div className="absolute -top-3 -left-3 bg-white border border-ink px-2 py-0.5 font-sketch text-xs shadow-sm transform -rotate-1">
                          Step 3
                        </div>
                        <h4 className="font-marker text-lg mb-2 text-ink">Rate</h4>
                        <p className="font-hand text-sm opacity-60 leading-tight">
                          When done, rate <span className="text-green-600 font-bold">Actual Satisfaction</span> to see the truth!
                        </p>
                      </div>
                    </div>

                    {/* Fun arrow pointing up */}
                    <div className="mt-8 animate-pulse opacity-30 hidden md:block">
                        <svg width="40" height="40" viewBox="0 0 50 50" className="-rotate-90">
                           <path d="M10 25 Q 25 10 40 25" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                           <path d="M35 20 L 40 25 L 35 30" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span className="font-sketch text-xs block mt-1">Ready?</span>
                    </div>
                  </div>
                ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-hand">
                        <thead>
                          <tr className="border-b-2 border-ink/10 text-xs font-sketch uppercase opacity-40 tracking-widest">
                            <th className="pb-3 pl-2">Task</th>
                            <th className="pb-3 text-center">Predicted</th>
                            <th className="pb-3 text-center">Actual</th>
                            <th className="pb-3 text-right pr-2">Insight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {satisfactionData.map((row, i) => (
                            <tr key={i} className="border-b border-ink/5 hover:bg-highlighter-yellow/5 transition-colors group">
                              <td className="py-3 pl-2 font-bold opacity-80 max-w-[200px] truncate" title={row.name}>
                                {row.name}
                              </td>
                              <td className="py-3 text-center opacity-60">
                                {row.predicted}%
                              </td>
                              <td className="py-3 text-center font-bold text-highlighter-pink">
                                {row.actual}%
                              </td>
                              <td className="py-3 text-right pr-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  row.gap > 10 ? 'bg-green-100 text-green-700' : 
                                  row.gap < -10 ? 'bg-red-100 text-red-700' : 
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {row.gap > 0 ? `+${row.gap}%` : `${row.gap}%`}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 )}
              </div>
            </div>

            {/* ─── Sticky Note Explanation ─── */}
            <div className="w-full md:w-72 shrink-0">
               <div className="relative bg-[#fff9c4] p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  {/* Pin/Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-400 opacity-80 shadow-sm border border-black/10 z-10" />
                  
                  <h4 className="font-marker text-xl mb-4 text-ink/80 text-center leading-none mt-2">
                    "Feeling Good"
                  </h4>
                  <div className="space-y-4 font-hand text-sm leading-relaxed text-ink/70">
                    <p>
                      <span className="font-bold text-ink">Cognitive Distortion:</span> We often predict that tasks will be boring or unrewarding without evidence.
                    </p>
                    <p>
                      Dr. David Burns suggests recording your <span className="underline decoration-wavy decoration-highlighter-pink">Predicted Satisfaction</span> (0-100%) before you start, and your <span className="underline decoration-wavy decoration-highlighter-pink">Actual Satisfaction</span> after you finish.
                    </p>
                    <p className="font-bold italic text-center text-ink/90 border-t border-ink/10 pt-4 mt-2">
                      "You'll usually find you enjoyed it far more than you expected."
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
