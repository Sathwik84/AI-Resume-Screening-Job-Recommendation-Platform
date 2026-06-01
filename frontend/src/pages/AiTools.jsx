import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Map, Clipboard, Copy, FileText, HelpCircle, ChevronRight } from 'lucide-react';

export default function AiTools() {
  const { user, apiFetch, isOfflineMode } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('roadmap'); // roadmap, coverletter, interview
  const [loading, setLoading] = useState(false);
  
  // Roadmap States
  const [targetJob, setTargetJob] = useState('');
  const [roadmap, setRoadmap] = useState(null);

  // Cover Letter States
  const [clTitle, setClTitle] = useState('');
  const [clCompany, setClCompany] = useState('');
  const [clDesc, setClDesc] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Interview Prep States
  const [intTitle, setIntTitle] = useState('');
  const [intCompany, setIntCompany] = useState('');
  const [questions, setQuestions] = useState([]);

  // Generate Learning Roadmap
  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!targetJob) return;
    setLoading(true);
    setRoadmap(null);
    try {
      const res = await apiFetch('/ai-features/generate-roadmap', {
        method: 'POST',
        body: JSON.stringify({ target_job_title: targetJob })
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
      }
    } catch (e) {
      console.warn("Backend offline, launching simulated roadmap matrices.");
      setTimeout(() => {
        setRoadmap([
          {
            phase: "Phase 1: Basic Bridging",
            title: "Advanced Systems Foundations",
            description: `Transitioning your skills React, Python to advanced ${targetJob} capabilities.`,
            duration: "2 Weeks",
            topics: ["Software Design Patterns", "Data Structures Optimization"]
          },
          {
            phase: "Phase 2: Platform Mastery",
            title: "Scalable Server Implementations",
            description: "Learn concurrent back-ends, ORM queries, and transaction caches.",
            duration: "3 Weeks",
            topics: ["FastAPI Routing", "Database indexing rules", "SQLAlchemy ORM"]
          },
          {
            phase: "Phase 3: Deployments Automation",
            title: "Container Operations & Cron Jobs",
            description: "Study containers orchestration and webhook notifications servers.",
            duration: "2 Weeks",
            topics: ["Docker Hub", "n8n Webhook Listeners", "Kubernetes Pods"]
          },
          {
            phase: "Phase 4: Advanced Analytics Capstone",
            title: "Real-time Metrics Visualizers",
            description: "Deploy client tracking grids and render charts.",
            duration: "2 Weeks",
            topics: ["Recharts Integration", "State Management optimizing"]
          }
        ]);
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = async (e) => {
    e.preventDefault();
    if (!clTitle || !clCompany) return;
    setLoading(true);
    setCoverLetter('');
    try {
      const res = await apiFetch('/ai-features/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          job_title: clTitle,
          company: clCompany,
          job_description: clDesc
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoverLetter(data.cover_letter);
      }
    } catch (e) {
      console.warn("Backend offline, utilizing template parser fallback cover letter.");
      setTimeout(() => {
        const skillsStr = user?.skills?.slice(0, 4).join(', ') || 'React, Python, SQL';
        setCoverLetter(
          `Dear Recruiting Team at ${clCompany},\n\n` +
          `I am writing to express my eager interest in applying for the ${clTitle} position at your team. With a strong academic background from the Institute of Aeronautical Research (IARE) and hands-on skills in ${skillsStr}, I am confident in my capacity to add technical value from day one.\n\n` +
          `Throughout my academic and independent work, I have specialized in building responsive layouts with Tailwind CSS, drafting high-performance APIs utilizing FastAPI, and containerizing pipelines to boost deployment cycles. Connecting frontend aesthetics with structured backend architectures is where my core strengths lie.\n\n` +
          `I look forward to discussing how my technical background and automation projects align with ${clCompany}'s growth strategy. Thank you for your review.\n\n` +
          `Sincerely,\n` +
          `${user?.full_name || 'Sathwik Kumar'}`
        );
        setLoading(false);
      }, 1800);
      return;
    }
    setLoading(false);
  };

  // Generate Interview Prep
  const handleGenerateInterview = async (e) => {
    e.preventDefault();
    if (!intTitle) return;
    setLoading(true);
    setQuestions([]);
    try {
      const res = await apiFetch('/ai-features/interview-prep', {
        method: 'POST',
        body: JSON.stringify({
          job_title: intTitle,
          company: intCompany || 'Target Employer'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch (e) {
      console.warn("Backend offline, loading template Q&As sheets.");
      setTimeout(() => {
        const isFrontend = intTitle.toLowerCase().includes('front') || intTitle.toLowerCase().includes('react');
        if (isFrontend) {
          setQuestions([
            {
              question: "How does virtual DOM diffing boost React layout speeds?",
              answer: "React maintains a virtual copy of the DOM tree. On state change, it reconciles the virtual representation with the previous structure, computes the minimal diff updates, and patches only the precise nodes in a single browser reflow batch."
            },
            {
              question: "Explain the rules of React Hooks and context loops.",
              answer: "Hooks must only be called at the top-level of React functional components (not inside loops or conditionals) to preserve index execution call orders. Context is used to avoid prop-drilling by providing reactive user states globally."
            }
          ]);
        } else {
          setQuestions([
            {
              question: "Why is FastAPI extremely concurrent and efficient?",
              answer: "FastAPI is built on Uvicorn and Starlette, native async gateways. By employing single-threaded event polling and async/await socket triggers, it routes requests concurrently without waiting on blocking I/O."
            },
            {
              question: "Explain index optimizations in relational SQL databases.",
              answer: "Relational indexes create B-Tree catalogs linking column values to row references. This collapses query lookups to logarithmic O(log N) speeds but introduces write overhead due to catalog rebuildings."
            }
          ]);
        }
        setLoading(false);
      }, 1400);
      return;
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Cover Letter copied to clipboard!");
  };

  return (
    <div className="fade-in space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">AI Career Hub</h2>
          <p className="text-xs text-gray-400">Leverage AI assistant modules to draft cover letters, preparation sheets, and transition roadmaps.</p>
        </div>
      </div>

      {/* Selector SubTabs */}
      <div className="flex border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-gray-400">
        <button
          onClick={() => { setActiveSubTab('roadmap'); setLoading(false); }}
          className={`pb-3 px-4 transition ${activeSubTab === 'roadmap' ? 'border-b-2 border-primary text-primary-light font-bold' : 'hover:text-gray-900 dark:hover:text-white'}`}
        >
          Learning Roadmap
        </button>
        <button
          onClick={() => { setActiveSubTab('coverletter'); setLoading(false); }}
          className={`pb-3 px-4 transition ${activeSubTab === 'coverletter' ? 'border-b-2 border-primary text-primary-light font-bold' : 'hover:text-gray-900 dark:hover:text-white'}`}
        >
          Cover Letter Generator
        </button>
        <button
          onClick={() => { setActiveSubTab('interview'); setLoading(false); }}
          className={`pb-3 px-4 transition ${activeSubTab === 'interview' ? 'border-b-2 border-primary text-primary-light font-bold' : 'hover:text-gray-900 dark:hover:text-white'}`}
        >
          Interview Prep Coach
        </button>
      </div>

      {loading && (
        <div className="w-full py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold animate-pulse">Consulting AI Career assistant...</span>
        </div>
      )}

      {!loading && (
        <div className="max-w-3xl">
          {/* TAB 1: ROADMAP */}
          {activeSubTab === 'roadmap' && (
            <div className="space-y-6 fade-in">
              <form onSubmit={handleGenerateRoadmap} className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard flex items-end gap-4 max-w-xl">
                <div className="flex-grow flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-gray-400">TARGET CAREER PROFESSION</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud DevOps Engineer"
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!targetJob}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles size={14} /> Map Milestones
                </button>
              </form>

              {/* RENDER ROADMAP */}
              {roadmap ? (
                <div className="space-y-8 relative pl-6 border-l border-gray-200 dark:border-white/10 ml-4 pt-2">
                  {roadmap.map((node, idx) => (
                    <div key={idx} className="relative group text-xs">
                      {/* Node point */}
                      <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-primary to-secondary border-4 border-white dark:border-darkCard" />
                      
                      <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-3.5 shadow-sm group-hover:border-primary/10 transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] text-primary-light font-extrabold uppercase">{node.phase}</span>
                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">{node.title}</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[9px] font-bold text-gray-400 shrink-0">
                            {node.duration}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-semibold">
                          {node.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5">
                          {node.topics?.map((topic, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[9px] font-bold">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-darkCard/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <Map size={36} className="stroke-[1] mb-3 text-gray-300 dark:text-white/10" />
                  <p className="text-xs font-bold">Waiting for Roadmap Parameters</p>
                  <p className="text-[10px] max-w-xs mt-1">Input your target profession to review progressive technology milestones.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COVER LETTER */}
          {activeSubTab === 'coverletter' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start fade-in">
              <form onSubmit={handleGenerateCoverLetter} className="md:col-span-2 p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-4 text-xs font-semibold text-gray-400 shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400">JOB POSITION TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Associate"
                    value={clTitle}
                    onChange={(e) => setClTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400">COMPANY EMPLOYER NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel Inc."
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!clTitle || !clCompany}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  <Sparkles size={14} /> Draft Letter
                </button>
              </form>

              {/* RENDER LETTER */}
              <div className="md:col-span-3">
                {coverLetter ? (
                  <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-lg space-y-4 relative fade-in">
                    <button
                      onClick={handleCopy}
                      className="absolute top-4 right-4 p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
                      title="Copy Cover Letter"
                    >
                      <Copy size={14} />
                    </button>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Drafted Cover Letter</h4>
                    <pre className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300 font-sans whitespace-pre-wrap pt-2 border-t border-gray-100 dark:border-white/5">
                      {coverLetter}
                    </pre>
                  </div>
                ) : (
                  <div className="h-72 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-darkCard/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-gray-400">
                    <FileText size={36} className="stroke-[1] mb-3 text-gray-300 dark:text-white/10" />
                    <p className="text-xs font-bold">Waiting for Details Form</p>
                    <p className="text-[10px] max-w-xs mt-1">Input job metadata parameters on the left to compile custom cover letters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INTERVIEW PREP */}
          {activeSubTab === 'interview' && (
            <div className="space-y-6 fade-in">
              <form onSubmit={handleGenerateInterview} className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard flex flex-col sm:flex-row items-end gap-4 max-w-2xl shadow-sm">
                <div className="flex-grow flex flex-col gap-1.5 w-full text-xs font-semibold text-gray-400">
                  <label className="text-[10px] font-bold text-gray-400">TARGET JOB TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. React Developer"
                    value={intTitle}
                    onChange={(e) => setIntTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                    required
                  />
                </div>
                
                <div className="flex-grow flex flex-col gap-1.5 w-full text-xs font-semibold text-gray-400">
                  <label className="text-[10px] font-bold text-gray-400">EMPLOYER (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel"
                    value={intCompany}
                    onChange={(e) => setIntCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!intTitle}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Sparkles size={14} /> Coach QA Sheets
                </button>
              </form>

              {/* RENDER QA */}
              {questions.length > 0 ? (
                <div className="space-y-4 fade-in">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-2.5">
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                        <HelpCircle size={16} className="text-secondary" /> Q: {q.question}
                      </h4>
                      <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 font-semibold pl-6 border-l-2 border-secondary/20">
                        {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-darkCard/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <HelpCircle size={36} className="stroke-[1] mb-3 text-gray-300 dark:text-white/10" />
                  <p className="text-xs font-bold">Waiting for Role Parameters</p>
                  <p className="text-[10px] max-w-xs mt-1">Submit target professions to review custom technical preparation QA sheets.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
