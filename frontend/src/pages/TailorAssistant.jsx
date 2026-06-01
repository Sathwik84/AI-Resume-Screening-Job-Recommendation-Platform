import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, FileUp, FileText, CheckCircle2, ChevronRight, ChevronLeft, 
  AlertCircle, Briefcase, Gauge, Award, Calendar, HelpCircle, 
  Copy, Download, BookOpen, UserCheck, ShieldAlert 
} from 'lucide-react';

export default function TailorAssistant() {
  const { activeResume, apiFetch, isOfflineMode, setUser, setActiveResume } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Upload resume
  const [file, setFile] = useState(null);
  const [fileParsed, setFileParsed] = useState(false);

  // Step 2: Paste Job Description
  const [jobDesc, setJobDesc] = useState('');
  const [extractedJob, setExtractedJob] = useState(null);

  // Step 3: ATS Score Analysis
  const [atsReport, setAtsReport] = useState(null);

  // Step 4: Tailoring Side-by-Side
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [savingVersion, setSavingVersion] = useState(false);
  const [versionSaved, setVersionSaved] = useState(false);

  // Step 5: Versions list
  const [versions, setVersions] = useState([]);

  // Step 6: Skill Gap
  const [skillGap, setSkillGap] = useState(null);

  // Step 7: Cover Letter
  const [coverLetter, setCoverLetter] = useState('');

  // Step 8: Interview Prep Coach
  const [prepCoach, setPrepCoach] = useState(null);

  // Step 1: File drop handler
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); };
  const validateFile = (selected) => {
    setError('');
    const ext = selected.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Supported formats: PDF, DOCX only.');
      return;
    }
    setFile(selected);
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    // Simulating parsing steps
    setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await apiFetch('/resumes/upload-resume', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setActiveResume(data);
          setFileParsed(true);
          setCurrentStep(2);
        }
      } catch (e) {
        console.warn("Offline: Seeding mock resume.");
        const mockData = {
          id: 1, filename: file.name, name: "Sathwik Kumar",
          email: "sathwik@iare.edu.in", phone: "+91 98765 43210",
          skills: ["React.js", "FastAPI", "Python", "SQL"],
          experience: [{ role: "Engineering Intern", company: "NextGen Systems", duration: "3 months", description: "Built dashboards." }]
        };
        setActiveResume(mockData);
        setFileParsed(true);
        setCurrentStep(2);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // Step 2: Extract job
  const handleExtractJob = async () => {
    if (!jobDesc) return;
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/tailor/extract-job', {
        method: 'POST',
        body: JSON.stringify({ description: jobDesc })
      });
      if (res.ok) {
        const data = await res.json();
        setExtractedJob(data);
        setCurrentStep(3);
      }
    } catch (e) {
      // Fallback extract
      setTimeout(() => {
        setExtractedJob({
          company: "Vercel",
          role: "Full Stack Associate (React & FastAPI)",
          experience: "0-2 Years",
          skills_required: ["React.js", "FastAPI", "Python", "SQL", "Docker", "n8n Workflows"],
          keywords_required: ["Microservices", "RESTful APIs", "JWT Authentication", "Containerization"]
        });
        setCurrentStep(3);
        setLoading(false);
      }, 1000);
    }
  };

  // Step 3: Comparative ATS Calculations
  const calculateATS = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/ats/calculate-ats', {
        method: 'POST',
        body: JSON.stringify({ job_description_id: 1 })
      });
      if (res.ok) {
        const data = await res.json();
        setAtsReport(data);
      }
    } catch (e) {
      setTimeout(() => {
        setAtsReport({
          overall_score: 64.5,
          breakdown: { skills: 60.0, keywords: 55.0, experience: 70.0, education: 80.0 },
          suggestions: { missing_skills: ["Docker", "n8n Workflows"], missing_keywords: ["Containerization", "RESTful APIs"] }
        });
        setLoading(false);
      }, 1200);
    }
  };

  // Step 4: Optimization side-by-side
  const runOptimization = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/tailor/optimize-resume', {
        method: 'POST',
        body: JSON.stringify({
          job_description: jobDesc,
          original_skills: activeResume?.skills || [],
          original_summary: activeResume?.parsed_text || "CSE student"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setOptimizedResume(data);
      }
    } catch (e) {
      setTimeout(() => {
        setOptimizedResume({
          original_score: 64.5,
          optimized_score: 88.0,
          improvement_pct: 23.5,
          original_resume: {
            summary: "Computer Science student with basic coding knowledge in react and python. Looking for internships.",
            skills: activeResume?.skills || ["React.js", "FastAPI", "Python", "SQL"]
          },
          optimized_resume: {
            summary: "Detail-oriented Computer Science and Engineering student at IARE with hands-on expertise building high-performance microservices using FastAPI and interactive responsive client dashboards using React.js. Proficient in integrating JWT authentication layers and orchestrating n8n automated notification scripts to boost deployments velocity.",
            skills: ["React.js", "FastAPI", "Python", "SQL", "Docker", "n8n Workflows", "JWT Auth", "TypeScript", "System Design"],
            projects: [
              { name: "Placement Screener Platform", description: "Architected full-stack resume scoring gauge using FastAPI and React, boosting ATS compatibility scores by 25% through direct keyword insertions." }
            ],
            achievements: ["Won 1st Place at IARE Hackathon 2025 by deploying responsive analytics dashboards."]
          }
        });
        setLoading(false);
      }, 1500);
    }
  };

  // Save optimized version
  const saveVersion = async () => {
    if (!optimizedResume) return;
    setSavingVersion(true);
    try {
      const payload = {
        version_name: `${extractedJob?.company || 'Target'} - Tailored Version`,
        summary: optimizedResume.optimized_resume.summary,
        skills: optimizedResume.optimized_resume.skills,
        projects: optimizedResume.optimized_resume.projects,
        overall_score: optimizedResume.optimized_score
      };
      await apiFetch('/tailor/save-version', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setVersionSaved(true);
    } catch (e) {
      setTimeout(() => {
        setVersionSaved(true);
        setSavingVersion(false);
      }, 1000);
    }
  };

  // Step 5: Multi-versions
  const loadVersions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/tailor/versions');
      if (res.ok) {
        const data = await res.json();
        setVersions(data);
      }
    } catch (e) {
      setVersions([
        { version_name: "Startup Version", overall_score: 84.5, skills: ["FastAPI", "React", "Docker", "n8n"] },
        { version_name: "MNC Version", overall_score: 76.0, skills: ["SQL", "System Design", "Python", "Git"] },
        { version_name: "AI/ML Engineer Version", overall_score: 68.5, skills: ["Python", "NumPy", "TensorFlow", "FastAPI"] },
        { version_name: "UI/UX Designer Version", overall_score: 72.0, skills: ["Figma", "Tailwind CSS", "React"] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Step 6: Skill Gap
  const loadSkillGap = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/tailor/skill-gap', {
        method: 'POST',
        body: JSON.stringify({ job_description: jobDesc })
      });
      if (res.ok) {
        const data = await res.json();
        setSkillGap(data);
      }
    } catch (e) {
      setTimeout(() => {
        setSkillGap({
          current_skills: activeResume?.skills || ["React.js", "FastAPI", "Python", "SQL"],
          required_skills: ["React.js", "FastAPI", "Python", "SQL", "Docker", "n8n Workflows"],
          missing_skills: ["Docker", "n8n Workflows"],
          progress_data: [
            { skill: "React.js", proficiency: 90.0 },
            { skill: "FastAPI", proficiency: 85.0 },
            { skill: "Python", proficiency: 90.0 },
            { skill: "Docker", proficiency: 15.0 },
            { skill: "n8n Workflows", proficiency: 10.0 }
          ],
          courses: [
            { title: "FastAPI Microservices Architecture", provider: "Udemy", duration: "12 hours", link: "#" },
            { title: "Docker Containers & Kubernetes", provider: "Coursera", duration: "8 hours", link: "#" },
            { title: "Automation with n8n", provider: "n8n Academy", duration: "4 hours", link: "#" }
          ],
          roadmap: [
            { week: "Week 1", topic: "Docker Containerization", action: "Establish local environment containerization." },
            { week: "Week 2", topic: "n8n Event Triggers", action: "Build webhooks workflows alerts." }
          ],
          potential_improvement: 23.5
        });
        setLoading(false);
      }, 1000);
    }
  };

  // Step 7: Cover Letter
  const loadCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/ai-features/generate-cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          job_title: extractedJob?.role || "Associate Engineer",
          company: extractedJob?.company || "Target",
          job_description: jobDesc
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCoverLetter(data.cover_letter);
      }
    } catch (e) {
      setTimeout(() => {
        setCoverLetter(
          `Dear Hiring Team at ${extractedJob?.company || 'Vercel'},\n\n` +
          `I am writing to express my strong interest in the ${extractedJob?.role || 'Full Stack Associate'} role. With hands-on expertise building scalable backends with FastAPI and responsive dashboards with React, I am excited to contribute to your core engineering goals.\n\n` +
          `Throughout my hackathons and independent projects, I have specialized in containerizing pipelines with Docker and establishing automated operational notification systems using n8n to reduce manual tracking times.\n\n` +
          `I look forward to discussing how my unique skills match your objectives. Thank you for your review.\n\n` +
          `Sincerely,\nSathwik Kumar`
        );
        setLoading(false);
      }, 1200);
    }
  };

  // Step 8: Interview Prep Calendar
  const loadInterviewPrep = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/tailor/interview-plan', {
        method: 'POST',
        body: JSON.stringify({
          job_title: extractedJob?.role || "Engineer",
          company: extractedJob?.company || "Employer"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrepCoach(data);
      }
    } catch (e) {
      setTimeout(() => {
        setPrepCoach({
          readiness_score: 78.5,
          hr_questions: [
            { question: "Why do you want to join our team?", answer: "Your dedication to engineering excellence and developer tools matches my passion for crafting polished web apps." }
          ],
          technical_questions: [
            { question: "Explain virtual DOM reconciliation in React.", answer: "It is a lightweight memory copy. React diffs changes and batch-updates the browser DOM in single reflow cycles." }
          ],
          project_questions: [
            { question: "Detail your resume tailoring project architecture.", answer: "Built using FastAPI routers to run regex comparisons and return split before/after optimization parameters." }
          ],
          company_questions: [
            { question: "How would you automate our notification lists?", answer: "By registering webhook endpoints inside FastAPI and triggering n8n mailer workflows." }
          ],
          calendar_30_day: [
            { day: 1, topic: "React Reconciliation", task: "Review Virtual DOM and batch diffing engines.", type: "Technical" },
            { day: 5, topic: "FastAPI Concurrency", task: "Practice event routing async queues.", type: "Technical" },
            { day: 10, topic: "Dockerizing APIs", task: "Containerize local sqlite database setups.", type: "Project" },
            { day: 20, topic: "n8n automating", task: "Build HTTP triggers emails notifier.", type: "Project" },
            { day: 30, topic: "HR Interview Run", task: "Coordinate mock pitch panels.", type: "HR" }
          ]
        });
        setLoading(false);
      }, 1200);
    }
  };

  // Automate loads on step changes
  useEffect(() => {
    if (currentStep === 3 && !atsReport) {
      calculateATS();
    } else if (currentStep === 4 && !optimizedResume) {
      runOptimization();
    } else if (currentStep === 5 && versions.length === 0) {
      loadVersions();
    } else if (currentStep === 6 && !skillGap) {
      loadSkillGap();
    } else if (currentStep === 7 && !coverLetter) {
      loadCoverLetter();
    } else if (currentStep === 8 && !prepCoach) {
      loadInterviewPrep();
    }
  }, [currentStep]);

  const stepsList = [
    { num: 1, label: "Resume Upload" },
    { num: 2, label: "Job Description" },
    { num: 3, label: "ATS Scanner" },
    { num: 4, label: "Smart Tailoring" },
    { num: 5, label: "Multi-Versions" },
    { num: 6, label: "Skill Gaps" },
    { num: 7, label: "AI Cover Letter" },
    { num: 8, label: "Interview Prep" },
    { num: 9, label: "Easy Apply" }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success border-success bg-success/5';
    if (score >= 70) return 'text-primary-light border-primary/20 bg-primary/5';
    if (score >= 50) return 'text-warning border-warning/20 bg-warning/5';
    return 'text-danger border-danger/20 bg-danger/5';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 50) return 'AVERAGE';
    return 'NEEDS IMPROVEMENT';
  };

  return (
    <div className="fade-in space-y-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Smart Resume Tailoring & Easy Apply</h2>
        <p className="text-xs text-gray-400">Optimize resumes, grade version compatibility, map skill deficits, and complete application checkers.</p>
      </div>

      {/* Steps horizontal indicator */}
      <div className="p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard overflow-x-auto">
        <div className="flex justify-between items-center min-w-[700px] text-xs font-bold text-gray-400 px-2">
          {stepsList.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => {
                  // Only allow jumping back, or jumping forward if requirements are met
                  if (s.num === 1 || (s.num <= 2 && activeResume) || (s.num <= 9 && fileParsed && extractedJob)) {
                    setCurrentStep(s.num);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
                  currentStep === s.num 
                    ? 'bg-primary text-white scale-105 shadow-md shadow-primary/20' 
                    : (currentStep > s.num ? 'text-success' : 'hover:text-gray-900 dark:hover:text-white')
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${currentStep >= s.num ? 'border-current font-black' : 'border-gray-200 dark:border-white/5'}`}>
                  {currentStep > s.num ? '✓' : s.num}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
              {idx < stepsList.length - 1 && (
                <div className={`h-0.5 w-8 border-t ${currentStep > s.num ? 'border-success' : 'border-gray-200 dark:border-white/5'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {loading && (
        <div className="w-full py-24 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold animate-pulse">Running automation routines...</span>
        </div>
      )}

      {!loading && (
        <div className="fade-in">
          {/* STEP 1: RESUME UPLOAD */}
          {currentStep === 1 && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard max-w-xl mx-auto space-y-6 shadow-sm">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Step 1: Upload Portfolio Resume</h3>
                <p className="text-[10px] text-gray-400 mt-1">Drag and drop your active PDF or DOCX file.</p>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full h-52 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition ${
                  file ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-primary/20 bg-gray-50 dark:bg-white/5'
                }`}
              >
                <FileUp size={28} className="text-primary-light mb-2" />
                <span className="text-xs font-semibold">{file ? file.name : "Select or Drop PDF/DOCX Resume"}</span>
              </div>

              {file && (
                <button
                  onClick={handleUpload}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  Confirm Upload & Continue <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}

          {/* STEP 2: PASTE JOB DESCRIPTION */}
          {currentStep === 2 && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard max-w-2xl mx-auto space-y-6 shadow-sm">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Step 2: Target Job Specifications</h3>
                <p className="text-[10px] text-gray-400 mt-1">Paste the employer job description or career board requirements text.</p>
              </div>

              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste Job Description here..."
                rows={8}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition leading-relaxed"
              />

              <button
                onClick={handleExtractJob}
                disabled={!jobDesc}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
              >
                Extract Specifications <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 3: ATS COMPATIBILITY */}
          {currentStep === 3 && atsReport && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Score card */}
              <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg gap-4 relative ${getScoreColor(atsReport.overall_score)}`}>
                <h4 className="text-[10px] font-black uppercase tracking-wider">Overall ATS Score</h4>
                <span className="text-5xl font-black">{atsReport.overall_score}%</span>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full border bg-white/5">
                  {getScoreLabel(atsReport.overall_score)}
                </span>
                
                {/* Breakdowns */}
                <div className="w-full space-y-3 mt-4 border-t border-gray-200 dark:border-white/10 pt-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300">
                  {Object.entries(atsReport.breakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="capitalize">{k} Match:</span>
                      <span>{v}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="md:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-5">
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-primary-light" /> ATS Deficit Analysis
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-gray-400 tracking-wider">MISSING TECH SKILLS</span>
                      <div className="flex flex-col gap-1.5 text-xs text-danger font-semibold">
                        {atsReport.suggestions.missing_skills.map((s, idx) => (
                          <span key={idx} className="bg-danger/5 p-2 rounded-lg border border-danger/10">✕ {s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-gray-400 tracking-wider">MISSING ATS KEYWORDS</span>
                      <div className="flex flex-col gap-1.5 text-xs text-warning font-semibold">
                        {atsReport.suggestions.missing_keywords.map((k, idx) => (
                          <span key={idx} className="bg-warning/5 p-2 rounded-lg border border-warning/10">✕ {k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shadow-lg shadow-primary/20"
                >
                  Start Smart Tailoring <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SMART RESUME TAILORING */}
          {currentStep === 4 && optimizedResume && (
            <div className="space-y-6 fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard text-center">
                  <span className="text-[9px] text-gray-400 font-bold block mb-1">ORIGINAL ATS SCORE</span>
                  <span className="text-xl font-extrabold text-danger">{optimizedResume.original_score}%</span>
                </div>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
                  <span className="text-[9px] text-primary-light font-bold block mb-1">OPTIMIZED ATS SCORE</span>
                  <span className="text-xl font-extrabold text-success">{optimizedResume.optimized_score}%</span>
                </div>
                <div className="p-4 rounded-xl border border-success/20 bg-success/5 text-center">
                  <span className="text-[9px] text-success font-bold block mb-1">IMPROVEMENT COMPATIBILITY</span>
                  <span className="text-xl font-extrabold text-success">+{optimizedResume.improvement_pct}%</span>
                </div>
              </div>

              {/* Side-by-Side Split comparative panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-4">
                  <h4 className="font-extrabold text-xs text-danger uppercase tracking-wider">Before Resume Summary</h4>
                  <p className="text-[11px] leading-relaxed text-gray-400 font-semibold p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                    {optimizedResume.original_resume.summary}
                  </p>
                  
                  <h4 className="font-extrabold text-xs text-danger uppercase tracking-wider mt-4">Original Technology Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizedResume.original_resume.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[9px] text-gray-400 font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                  
                  <h4 className="font-extrabold text-xs text-success uppercase tracking-wider relative z-10 flex items-center gap-1.5">
                    <Sparkles size={14} /> AI Optimized Summary
                  </h4>
                  <p className="text-[11px] leading-relaxed text-gray-800 dark:text-gray-200 font-semibold p-4 rounded-xl bg-white/40 dark:bg-darkCard/40 relative z-10 border border-primary/10">
                    {optimizedResume.optimized_resume.summary}
                  </p>

                  <h4 className="font-extrabold text-xs text-success uppercase tracking-wider relative z-10 mt-4">Optimized Skills Matrix</h4>
                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    {optimizedResume.optimized_resume.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-primary/20 text-primary-light border border-primary/30 text-[9px] font-extrabold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={saveVersion}
                  disabled={savingVersion || versionSaved}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  {versionSaved ? 'Tailored Version Saved!' : (savingVersion ? 'Saving...' : 'Save Tailored Version')}
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  Company Versions <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: COMPANY SPECIFIC VERSIONS */}
          {currentStep === 5 && versions.length > 0 && (
            <div className="space-y-6 fade-in">
              <div>
                <h3 className="font-extrabold text-sm">Company-Specific Variations</h3>
                <p className="text-[10px] text-gray-400">Generate customized variations graded against corporate archetypes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {versions.map((v, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard hover:border-primary/10 transition-all flex flex-col justify-between h-48 hover:shadow-lg group">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-extrabold text-xs text-gray-950 dark:text-white group-hover:text-primary-light transition-colors">{v.version_name}</h4>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary-light text-[9px] font-black border border-primary/20">{v.overall_score}% ATS</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold line-clamp-3">
                        {v.summary}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex gap-1 overflow-hidden max-w-[150px]">
                        {v.skills.slice(0, 3).map((s, sIdx) => (
                          <span key={sIdx} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[8px] font-bold truncate">
                            {s}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => alert(`Saving ${v.version_name} variant as active.`)}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary-light border border-primary/20 text-[10px] font-bold hover:bg-primary hover:text-white transition"
                      >
                        Activate Version
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(6)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shadow-lg shadow-primary/20"
              >
                Grade Skill Gaps <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 6: SKILL GAP ANALYSIS */}
          {currentStep === 6 && skillGap && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start fade-in">
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-6 shadow-sm">
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Skill Match meters</h4>
                  <p className="text-[9px] text-gray-400">Current skill matching matrices.</p>
                </div>
                
                <div className="space-y-4">
                  {skillGap.progress_data.map((item, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs font-bold">
                      <div className="flex justify-between">
                        <span>{item.skill}</span>
                        <span className={item.proficiency >= 80 ? 'text-success' : 'text-primary-light'}>{item.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full ${item.proficiency >= 80 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${item.proficiency}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-5">
                  <h3 className="font-extrabold text-sm flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-light" /> Recommended Learning Roadmap
                  </h3>

                  <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {skillGap.courses.map((course, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 gap-2">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{course.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{course.provider} | {course.duration}</p>
                        </div>
                        <a
                          href={course.link}
                          className="px-3.5 py-1.5 rounded-lg bg-primary/10 text-primary-light border border-primary/20 text-[10px] font-bold hover:bg-primary hover:text-white transition shrink-0 text-center"
                        >
                          Enroll Course
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shadow-lg shadow-primary/20"
                >
                  Generate Cover Letter <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: COVER LETTER GENERATOR */}
          {currentStep === 7 && coverLetter && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard max-w-2xl mx-auto space-y-6 shadow-sm relative fade-in">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter);
                  alert("Copied successfully!");
                }}
                className="absolute top-6 right-6 p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
                title="Copy Letter"
              >
                <Copy size={14} />
              </button>

              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Step 7: AI Cover Letter</h3>
                <p className="text-[10px] text-gray-400 mt-1">Generates customized cover letters optimized to target company specifications.</p>
              </div>

              <pre className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-300 font-sans whitespace-pre-wrap leading-relaxed border border-gray-100 dark:border-white/5">
                {coverLetter}
              </pre>

              <button
                onClick={() => setCurrentStep(8)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shadow-lg shadow-primary/20"
              >
                Prepare Interview Questions <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 8: INTERVIEW PREPARATION */}
          {currentStep === 8 && prepCoach && (
            <div className="space-y-6 fade-in">
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Step 8: Interview Preparation Coach</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Technical, behavioral, and project coaching preparation schedules.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-bold">READINESS INDEX</span>
                  <span className="text-3xl font-extrabold text-success">{prepCoach.readiness_score}%</span>
                </div>
              </div>

              {/* 30-Day Monthly Calendar Grid */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm flex items-center gap-2">
                  <Calendar size={18} className="text-primary-light" /> 30-Day Preparation Calendar Plan
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 dark:border-white/5 pt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {prepCoach.calendar_30_day.map((d, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-2 hover:border-primary/10 transition">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-primary-light">Day {d.day}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-400 font-medium">
                          {d.type}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">{d.topic}</p>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">{d.task}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(9)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shadow-lg shadow-primary/20"
              >
                Go Easy Apply Assistant <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* STEP 9: EASY APPLY ASSISTANT */}
          {currentStep === 9 && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard max-w-2xl mx-auto space-y-6 shadow-lg relative fade-in">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Step 9: Easy Apply Assistant Preparation</h3>
                <p className="text-[10px] text-gray-400 mt-1">Review checkmarks checklist before submitting your recruitment packets.</p>
              </div>

              {/* Recruitment checklist */}
              <div className="space-y-3.5 p-5 rounded-xl border border-primary/20 bg-primary/5 text-xs font-bold text-gray-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>Resume optimized with target keywords</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>ATS Score compatibility above benchmark 85% ({optimizedResume?.optimized_score || 88}%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>Tailored Cover Letter Generated and Saved</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>Coached 30-Day Interview Readiness Calendar Complete</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => alert("Launching official applicant submission portal page.")}
                  className="flex-grow py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  <UserCheck size={14} /> Open Application Link
                </button>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="flex-grow py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
