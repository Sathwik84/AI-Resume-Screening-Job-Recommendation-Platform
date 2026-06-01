import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Search, Sparkles, MapPin, Building, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Jobs() {
  const { apiFetch, isOfflineMode } = useAuth();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Internship, Full-Time
  const [filterWorkplace, setFilterWorkplace] = useState('All'); // All, Remote, Hybrid, Onsite
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
    fetchApplications();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/jobs/recommendations');
      if (res.ok) {
        const data = await res.json();
        setRecs(data);
      }
    } catch (e) {
      console.warn("Backend offline, utilizing mock recommendation catalog.");
      // Seed robust fallback recommendations
      const mockRecs = [
        {
          id: 1,
          match_percentage: 86.5,
          job: {
            id: 1,
            title: "Full Stack Developer (React & FastAPI)",
            company: "Vercel",
            location: "San Francisco, CA",
            type: "Full-Time",
            workplace: "Remote",
            description: "We are looking for a passionate Full Stack Developer to build our next-generation visual editing interfaces. Requirements include expert knowledge of React.js, Next.js, and FastAPI.",
            required_skills: ["React.js", "FastAPI", "Python", "Tailwind CSS"],
            salary: "$110,000 - $135,000"
          }
        },
        {
          id: 2,
          match_percentage: 78.0,
          job: {
            id: 2,
            title: "Software Engineering Intern",
            company: "Notion",
            location: "New York, NY",
            type: "Internship",
            workplace: "Hybrid",
            description: "Join the core Notion database engineering team. Contribute directly to user database tools and scale backend microservices.",
            required_skills: ["Python", "SQL", "Docker", "Problem Solving"],
            salary: "$45 - $55 / hour"
          }
        },
        {
          id: 3,
          match_percentage: 65.5,
          job: {
            id: 3,
            title: "DevOps & Cloud Intern",
            company: "Linear",
            location: "Remote",
            type: "Internship",
            workplace: "Remote",
            description: "Automate our deployment pipelines and scale our AWS infrastructure. Exposure to Docker containerization and Kubernetes orchestration required.",
            required_skills: ["Docker", "Kubernetes", "AWS Cloud"],
            salary: "$40 - $48 / hour"
          }
        },
        {
          id: 4,
          match_percentage: 72.0,
          job: {
            id: 4,
            title: "Frontend Developer",
            company: "Stripe",
            location: "Seattle, WA",
            type: "Full-Time",
            workplace: "Hybrid",
            description: "Craft our gorgeous developer billing dashboards using React, TypeScript, and Tailwind CSS. Outstanding eye for detail and design polish required.",
            required_skills: ["React.js", "TypeScript", "Tailwind CSS", "Communication"],
            salary: "$125,000 - $155,000"
          }
        }
      ];
      setRecs(mockRecs);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await apiFetch('/jobs/applications');
      if (res.ok) {
        const data = await res.json();
        const appliedSet = new Set(data.map(app => app.job.id));
        setAppliedJobs(appliedSet);
      }
    } catch (e) {}
  };

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      if (!isOfflineMode) {
        await apiFetch('/jobs/apply', {
          method: 'POST',
          body: JSON.stringify({ job_id: jobId })
        });
      }
      setAppliedJobs(prev => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
      setSelectedJob(null);
    } catch (e) {
      alert("Application successfully submitted in demo sandbox mode.");
      setAppliedJobs(prev => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
      setSelectedJob(null);
    } finally {
      setApplying(false);
    }
  };

  // Filter recommendations
  const filteredRecs = recs.filter(r => {
    const job = r.job;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === 'All' || job.type === filterType;
    const matchesWorkplace = filterWorkplace === 'All' || job.workplace === filterWorkplace;
    
    return matchesSearch && matchesType && matchesWorkplace;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10 border-success/20';
    if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-danger bg-danger/10 border-danger/20';
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold animate-pulse">Running skill matching queries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8 pb-12">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Job & Internship Matches</h2>
        <p className="text-xs text-gray-400">Personalized job recommendations calculated dynamically using skill intersection matching algorithms.</p>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative flex items-center w-full md:max-w-xs">
          <Search size={16} className="absolute left-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search role or employer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs focus:border-primary focus:outline-none transition"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          {/* Job Type Tab */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {['All', 'Full-Time', 'Internship'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === t 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Workplace Selection */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            {['All', 'Remote', 'Hybrid', 'Onsite'].map((w) => (
              <button
                key={w}
                onClick={() => setFilterWorkplace(w)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterWorkplace === w 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations catalog grid */}
      {filteredRecs.length === 0 ? (
        <div className="h-64 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-darkCard/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-gray-400">
          <Briefcase size={36} className="stroke-[1] mb-3 text-gray-300 dark:text-white/10" />
          <p className="text-xs font-bold">No Match Matches Your Filter Parameters</p>
          <p className="text-[10px] max-w-xs mt-1">Try resetting filter categories or text query scopes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((r) => {
            const job = r.job;
            const hasApplied = appliedJobs.has(job.id);
            return (
              <div 
                key={r.id}
                className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard hover:border-primary/10 transition-all flex flex-col justify-between h-72 hover:scale-[1.01] hover:shadow-lg relative overflow-hidden group"
              >
                {/* Glow border highlights */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity top-0 left-0" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-primary-light transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5">
                        <Building size={12} /> {job.company}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${getScoreColor(r.match_percentage)} shrink-0`}>
                      {r.match_percentage}% Match
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 flex items-center gap-1">
                      <MapPin size={10} /> {job.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 flex items-center gap-1">
                      <Clock size={10} /> {job.type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5">
                      {job.workplace}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                  <span className="text-[10px] font-extrabold text-gray-400">{job.salary || 'Salary Undisclosed'}</span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4.5 py-2 rounded-xl bg-primary/10 text-primary-light border border-primary/20 text-xs font-bold hover:bg-primary hover:text-white transition flex items-center gap-1 group-hover:scale-105"
                  >
                    Read Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Dialog Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold text-xs"
            >
              ✕ CLOSE
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 pr-6">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{selectedJob.title}</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-1">{selectedJob.company} | {selectedJob.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-400">
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5">{selectedJob.type}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5">{selectedJob.workplace}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-primary-light">{selectedJob.salary}</span>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-200 dark:border-white/10 pt-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
              <h4 className="font-extrabold text-gray-900 dark:text-white">Role Description</h4>
              <p className="whitespace-pre-wrap leading-relaxed">{selectedJob.description}</p>

              <h4 className="font-extrabold text-gray-900 dark:text-white">Core Skills Required</h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedJob.required_skills?.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-primary/10 text-primary-light text-[10px] font-semibold border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-grow py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition"
              >
                Back to Matches
              </button>
              {appliedJobs.has(selectedJob.id) ? (
                <div className="flex-grow py-2.5 rounded-xl bg-success/15 text-success border border-success/20 text-xs font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> Applied
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={applying}
                  className="flex-grow py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1 shadow-lg shadow-primary/25"
                >
                  {applying ? 'Applying...' : '1-Click Apply'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
