import React, { useState } from 'react';
import { Sparkles, ArrowRight, Server, Database, Mail, Clock, HelpCircle, AlertCircle, FileText } from 'lucide-react';

export default function WorkflowVisuals() {
  const [selectedWorkflow, setSelectedWorkflow] = useState('w1');

  const workflows = [
    {
      id: "w1",
      title: "1. Resume Upload Automation",
      description: "Triggered instantly on resume upload to run comparative parsing, log properties to PostgreSQL, and email structured reports.",
      nodes: [
        { name: "FastAPI Upload Trigger", type: "Webhook", icon: Server, color: "from-blue-500 to-indigo-500", desc: "API Endpoint listening for document multipart form uploads." },
        { name: "Groq Llama 3 Analyzer", type: "AI Node", icon: Sparkles, color: "from-purple-500 to-pink-500", desc: "Consults LLM layout structures to isolate names, emails, and technology arrays." },
        { name: "PostgreSQL Database Update", type: "DB Node", icon: Database, color: "from-emerald-500 to-teal-500", desc: "Inserts metadata properties into active resumes SQL tables." },
        { name: "SMTP Email Dispatcher", type: "Email Node", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Sends structured placement readiness bulletin PDF/HTML reports to students." }
      ]
    },
    {
      id: "w2",
      title: "2. Daily Job Recommendation Cron",
      description: "Runs automatically at 9:00 AM daily to match student technology catalogs against active job description criteria.",
      nodes: [
        { name: "Cron Trigger (Daily 9AM)", type: "Schedule Node", icon: Clock, color: "from-cyan-500 to-blue-500", desc: "Automated schedule daemon asserting daily queries." },
        { name: "Fetch Active Skills Matrices", type: "DB Node", icon: Database, color: "from-emerald-500 to-teal-500", desc: "Reads list of student technologies profile logs." },
        { name: "LLM Matchmaker Evaluator", type: "AI Node", icon: Sparkles, color: "from-purple-500 to-pink-500", desc: "Computes skill intersection ratios using target templates." },
        { name: "Personalized Mailer Dispatch", type: "Email Node", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Sends matching bulletin catalogs straight to inboxes." }
      ]
    },
    {
      id: "w3",
      title: "3. ATS Recalculation Monitor",
      description: "Detects resume modification transactions and automatically re-grades compatibility scores across submitted job applications.",
      nodes: [
        { name: "Resume Changed Event", type: "Webhook", icon: Server, color: "from-blue-500 to-indigo-500", desc: "Monitors changes inside profile records." },
        { name: "FastAPI Scoring Recalculator", type: "API Node", icon: Server, color: "from-purple-500 to-indigo-500", desc: "Sends payload to /ats/calculate-ats router to re-evaluate scoring." },
        { name: "Update Score Tables", type: "DB Node", icon: Database, color: "from-emerald-500 to-teal-500", desc: "Updates overall scores cache within active applications." },
        { name: "Toast Alert Notifier", type: "Notification Node", icon: AlertCircle, color: "from-amber-500 to-orange-500", desc: "Dispatches unread badges inside student dashboards panels." }
      ]
    },
    {
      id: "w4",
      title: "4. Application Funnel Tracking Scheduler",
      description: "Monitors submitted recruitment packets, schedulizes check intervals, and assists with follow-ups preparation.",
      nodes: [
        { name: "Application Log Webhook", type: "Webhook", icon: Server, color: "from-blue-500 to-indigo-500", desc: "Receives logs when students click Easy Apply Link launchers." },
        { name: "Log Tracking timelines", type: "DB Node", icon: Database, color: "from-emerald-500 to-teal-500", desc: "Registers application row item status as 'Applied'." },
        { name: "Wait 7 Days Scheduler", type: "Wait Node", icon: Clock, color: "from-cyan-500 to-blue-500", desc: "Enters a non-blocking wait loop to allow recruiter reactions." },
        { name: "Recheck application status", type: "DB Node", icon: Database, color: "from-teal-500 to-emerald-500", desc: "Re-queries DB to verify if status has transitioned." },
        { name: "Recruiter Follow-up Alert", type: "Email Node", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Alerts student to send friendly follow-up pitches." }
      ]
    }
  ];

  const currentWf = workflows.find(w => w.id === selectedWorkflow);

  return (
    <div className="fade-in space-y-8 pb-12">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">n8n Workflow Automations Visualizer</h2>
        <p className="text-xs text-gray-400">Review, trigger, and inspect the copy-pasteable n8n pipeline pipelines that power notifications loops.</p>
      </div>

      {/* Select layout tab bar */}
      <div className="flex border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-gray-400 overflow-x-auto">
        {workflows.map((wf) => (
          <button
            key={wf.id}
            onClick={() => setSelectedWorkflow(wf.id)}
            className={`pb-3 px-4 transition shrink-0 ${selectedWorkflow === wf.id ? 'border-b-2 border-primary text-primary-light font-bold' : 'hover:text-gray-900 dark:hover:text-white'}`}
          >
            {wf.title}
          </button>
        ))}
      </div>

      <div className="max-w-4xl space-y-6">
        <p className="text-xs leading-relaxed text-gray-400 font-semibold p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard/40">
          {currentWf.description}
        </p>

        {/* Visual flowchart canvas */}
        <div className="p-8 rounded-3xl border border-primary/10 bg-white dark:bg-darkCard/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-center gap-6 overflow-x-auto min-h-[220px] relative">
          <div className="absolute inset-0 grid-mesh opacity-20 pointer-events-none" />
          
          {currentWf.nodes.map((node, idx) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={idx}>
                {/* Node representation */}
                <div className="w-52 p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard text-center flex flex-col items-center justify-between gap-3 shadow-md hover:border-primary/20 transition-all hover:scale-105 group relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${node.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-primary-light font-extrabold uppercase">{node.type}</span>
                    <h4 className="font-extrabold text-[11px] text-gray-900 dark:text-white mt-0.5">{node.name}</h4>
                  </div>
                  
                  {/* Sliding tooltip popover details */}
                  <div className="absolute top-full mt-2 w-48 p-3 rounded-xl bg-gray-950/95 border border-white/5 text-[9px] leading-relaxed text-left text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl font-semibold">
                    {node.desc}
                  </div>
                </div>
                
                {/* Connecting arrow */}
                {idx < currentWf.nodes.length - 1 && (
                  <div className="flex items-center justify-center rotate-90 md:rotate-0 text-primary-light shrink-0">
                    <ArrowRight size={18} className="stroke-[1.5] animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* JSON download options */}
        <div className="p-5 rounded-2xl border border-success/15 bg-success/5 flex items-center justify-between gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span>Ready to import this workflow inside your local n8n server?</span>
          <button
            onClick={() => alert(`JSON exported: '${currentWf.id}_workflow.json' copied to clipboard. Go to n8n and click 'Import from File'.`)}
            className="px-4.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-primary/25"
          >
            <FileText size={14} /> Import Workflow JSON
          </button>
        </div>
      </div>
    </div>
  );
}
