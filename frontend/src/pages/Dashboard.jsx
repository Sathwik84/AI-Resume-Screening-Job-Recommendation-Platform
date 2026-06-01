import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Briefcase, FileText, CheckCircle2, ChevronRight, AlertCircle, 
  Sparkles, Award, TrendingUp, Compass 
} from 'lucide-react';

export default function Dashboard({ setCurrentTab }) {
  const { apiFetch, isOfflineMode } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/dashboard/');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Failed to fetch dashboard data.');
      }
    } catch (e) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold animate-pulse">Assembling metrics...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Active Applications", 
      value: stats?.total_applications ?? 0, 
      icon: Briefcase, 
      color: "text-primary bg-primary/10 border-primary/20",
      desc: "Pending recruiter replies",
      tab: "jobs"
    },
    { 
      label: "Average ATS Score", 
      value: `${stats?.average_ats_score ?? 0}%`, 
      icon: TrendingUp, 
      color: "text-secondary bg-secondary/10 border-secondary/20",
      desc: "Across analyzed resumes",
      tab: "ats"
    },
    { 
      label: "Skills Match Rate", 
      value: `${stats?.skill_match_rate ?? 0}%`, 
      icon: Award, 
      color: "text-success bg-success/10 border-success/20",
      desc: "Compared to seeded market posts",
      tab: "profile"
    },
    { 
      label: "Profile Integrity", 
      value: `${stats?.profile_strength ?? 0}%`, 
      icon: Compass, 
      color: "text-warning bg-warning/10 border-warning/20",
      desc: "Resume metadata details sync",
      tab: "profile"
    }
  ];

  // Pie chart cell palettes
  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#EF4444'];

  return (
    <div className="fade-in space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-tr from-primary/10 to-secondary/10 backdrop-blur-xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 grid-mesh opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-light text-[10px] font-bold border border-primary/20">
            <Sparkles size={12} /> Placement Dashboard
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Accelerate Your Placement Prep!</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">
            Upload your resume, trigger immediate automated ATS checklists, generate targeted cover letters, and review placement alerts in sandbox environments.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('upload')}
          className="relative z-10 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2 group flex-shrink-0"
        >
          <span>Upload Resume</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid Cards stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div 
              key={i} 
              onClick={() => setCurrentTab(c.tab)}
              className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 hover:border-primary/10 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between h-36"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-gray-400">{c.label}</span>
                <div className={`p-2 rounded-xl border ${c.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-extrabold tracking-tight">{c.value}</span>
                <p className="text-[10px] text-gray-400 mt-1">{c.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm">ATS compatibility Trend</h3>
            <p className="text-[10px] text-gray-400">Score progress across your last calculations</p>
          </div>
          <div className="w-full h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.ats_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" stroke="#888" tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px'
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Radar chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm">Tech Skill Distribution</h3>
            <p className="text-[10px] text-gray-400">Chronological overlap matches</p>
          </div>
          <div className="w-full h-64 text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" r="70%" data={stats?.skill_distribution}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#888" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#888" tick={{ fontSize: 8 }} />
                <Radar name="Proficiency" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Application Status pie chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 flex flex-col gap-4 justify-between">
          <div>
            <h3 className="font-bold text-sm">Application Funnel</h3>
            <p className="text-[10px] text-gray-400">Progression statuses rates</p>
          </div>
          <div className="w-full h-48 text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.application_analytics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.application_analytics?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-gray-400 mt-2">
            {stats?.application_analytics?.map((entry, index) => (
              <span key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>

        {/* Right Activities Log */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-sm">Recent Activities Log</h3>
            <p className="text-[10px] text-gray-400">Chronological transaction tracking feeds</p>
          </div>
          <div className="flex flex-col gap-3.5 max-h-72 overflow-y-auto pr-1">
            {stats?.recent_activities?.map((a) => (
              <div key={a.id} className="flex items-start gap-4 p-3 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 transition hover:border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary-light flex items-center justify-center flex-shrink-0 text-xs">
                  <FileText size={14} />
                </div>
                <div className="flex-grow space-y-1">
                  <p className="text-xs font-semibold leading-relaxed">{a.message}</p>
                  <span className="text-[9px] text-gray-400 font-medium block">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
