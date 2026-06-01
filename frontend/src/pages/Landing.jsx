import React from 'react';
import { Sparkles, FileText, CheckCircle, BarChart3, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function Landing({ setCurrentTab, token }) {
  const features = [
    {
      title: "AI Heuristic Parsing",
      description: "Extract names, contact details, experiences, and skill sets automatically within seconds using advanced LLMs.",
      icon: FileText,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Real-time ATS Analytics",
      description: "Identify keyword voids and check experience alignment against job descriptions with a live scoring engine.",
      icon: BarChart3,
      color: "from-cyan-500 to-indigo-500"
    },
    {
      title: "Hyper-personalized Matchmaking",
      description: "Receive job recommendations calculated dynamically using skill intersection matching algorithms.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-cyan-500"
    }
  ];

  const steps = [
    { num: "01", title: "Upload Resume", text: "Drag-and-drop your PDF/DOCX. Our engine extracts layout parameters automatically." },
    { num: "02", title: "Target Jobs", text: "Choose from seeded high-profile roles or paste your target description to check scores." },
    { num: "03", title: "Enhance Profile", text: "Incorporate missing tech skills, generate cover letters, and plot career paths." },
    { num: "04", title: "Land Offers", text: "Apply with 1-click and track progression using scheduled notification pipelines." }
  ];

  return (
    <div className="w-full relative overflow-hidden bg-gray-50 dark:bg-darkBg transition-colors grid-mesh dark:grid-mesh pb-20">
      {/* Background blobs */}
      <div className="glow-blob bg-primary top-10 left-1/4 animate-pulse-slow" />
      <div className="glow-blob bg-secondary bottom-10 right-1/4 animate-pulse-slow" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 md:pt-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary-light text-xs font-semibold mb-6 animate-bounce">
          <Sparkles size={14} /> AI-powered Student Placement Accelerator
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
          Bridge the Gap Between <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-secondary bg-clip-text text-transparent">
            Your Resume & Target Jobs
          </span>
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed">
          Upload your resume, analyze real-time ATS keyword compatibility, generate tailored cover letters, and automate application reporting workflows powered by n8n.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button 
            onClick={() => setCurrentTab(token ? 'dashboard' : 'login')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-light shadow-lg shadow-primary/25 hover:shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
          >
            Start Analyzing Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white/5 dark:bg-darkCard hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold text-sm transition"
          >
            See How It Works
          </a>
        </div>

        {/* Floating Landing Mockup Dashboard Preview */}
        <div className="w-full rounded-2xl border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-darkCard/40 backdrop-blur-xl p-4 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-2xl pointer-events-none" />
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-200 dark:border-white/5 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-danger/60" />
            <span className="w-3 h-3 rounded-full bg-warning/60" />
            <span className="w-3 h-3 rounded-full bg-success/60" />
            <span className="text-xs font-semibold ml-2">Resume Score Analysis Sandbox</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-left">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex flex-col gap-2">
              <span className="text-xs text-gray-400">Extracted Skills</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["React.js", "FastAPI", "Python", "Docker"].map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary-light border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-gray-400 mb-1">ATS Match Score</span>
              <span className="text-3xl font-extrabold text-success">84%</span>
              <span className="text-[10px] text-gray-400 mt-1">Excellent Keyword Match</span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex flex-col justify-between">
              <span className="text-xs text-gray-400">Missing Keywords Checklist</span>
              <div className="flex flex-col gap-1.5 pt-1 text-[11px] font-semibold text-danger">
                <span>✕ CI/CD Pipelines</span>
                <span>✕ Kubernetes Orchestration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 md:pt-36">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Core Platform Capabilities</h2>
          <p className="text-gray-400 text-sm md:text-base">Everything a student needs to tailor applications and clear screen checks.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 hover:border-primary/20 transition-all group flex flex-col justify-between h-64 hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center text-primary-light">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary-light transition-colors">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-5xl mx-auto px-6 pt-24 md:pt-36">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">How It Works</h2>
          <p className="text-gray-400 text-sm">Four quick steps to transition from parsing to placement offers.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-darkCard border border-gray-200 dark:border-white/5 flex flex-col justify-between h-48 relative">
              <span className="text-4xl font-black bg-gradient-to-br from-gray-200 to-gray-400 dark:from-white/5 dark:to-white/10 bg-clip-text text-transparent absolute top-4 right-4">
                {s.num}
              </span>
              <div className="flex flex-col gap-2 mt-auto">
                <h3 className="font-bold text-sm">{s.title}</h3>
                <p className="text-gray-400 text-[11px] leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 md:pt-36">
        <div className="p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-tr from-primary/5 to-secondary/5 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 grid-mesh opacity-30 pointer-events-none" />
          <div className="flex flex-col gap-3 max-w-md relative z-10">
            <div className="flex gap-1 text-warning">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic text-sm md:text-base leading-relaxed">
              "The ATS analyzer pinpointed exact skill keywords that were missing from my resume. After adding them and using the learning roadmap tool, I cleared screening at stripe and secured a full-time offer!"
            </p>
            <div>
              <p className="font-bold text-xs">Rohit Verma</p>
              <p className="text-[10px] text-gray-400">IARE CSE Student, Placed at Stripe</p>
            </div>
          </div>
          <div className="w-full md:w-auto ml-auto relative z-10 text-center md:text-right">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to clear your screens?</h3>
            <button 
              onClick={() => setCurrentTab('login')}
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-light shadow-lg hover:shadow-primary/20 transition"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
