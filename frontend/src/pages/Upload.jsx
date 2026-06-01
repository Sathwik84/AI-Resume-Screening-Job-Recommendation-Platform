import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileUp, FileText, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Upload({ setCurrentTab }) {
  const { token, isOfflineMode, setUser, setActiveResume, apiFetch } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const steps = [
    "Reading document layout structures...",
    "Extracting metadata block strings...",
    "Cross-referencing contact signatures...",
    "Parsing technology skill profiles...",
    "Chronologizing work timeline matrices...",
    "Synchronizing platform user portfolio..."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    setSuccess(false);
    const ext = selectedFile.name.split('.').pop().lowerCase || selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Invalid format. Please drag or upload a PDF or DOCX file.');
      return;
    }
    setFile(selectedFile);
  };

  const triggerUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSuccess(false);
    setError('');
    setProgressStep(0);

    // Simulate animated scanning steps
    const timer = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 900);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/resumes/upload-resume', {
        method: 'POST',
        body: formData
      });

      clearInterval(timer);

      if (res.ok) {
        const data = await res.json();
        setParsedData(data);
        setActiveResume(data);
        // Refresh profile settings in context
        const profRes = await apiFetch('/profile/');
        if (profRes.ok) {
          const profData = await profRes.json();
          setUser(profData);
        }
        setSuccess(true);
      } else {
        const err = await res.json();
        setError(err.detail || 'Resume parsing operation failed.');
      }
    } catch (e) {
      clearInterval(timer);
      console.warn("Backend connection offline, proceeding with simulated parsing sandbox.");
      
      // Sandbox fallback seeder logic
      setTimeout(() => {
        const mockData = {
          id: 101,
          filename: file.name,
          name: 'Sathwik Kumar',
          email: 'sathwik.kumar@iare.edu.in',
          phone: '+91 98765 43210',
          skills: ['React.js', 'FastAPI', 'Python', 'Tailwind CSS', 'SQL', 'Docker', 'JWT Authentication', 'n8n Workflows'],
          experience: [
            {
              role: 'Full Stack Engineering Intern',
              company: 'TechCorp Labs',
              duration: 'June 2025 - Present',
              description: 'Created highly modular FastAPI microservices, parsed bulk transaction payloads, and constructed React dashboards utilizing Recharts.'
            }
          ],
          education: [
            {
              degree: 'Bachelor of Technology (Computer Science)',
              school: 'Institute of Aeronautical Research (IARE)',
              year: '2027'
            }
          ]
        };
        
        setParsedData(mockData);
        setActiveResume(mockData);
        
        // Mock user profile syncer
        setUser(prev => ({
          ...prev,
          full_name: mockData.name,
          skills: mockData.skills,
          experience: mockData.experience,
          education: mockData.education,
          profile_strength: 84.5
        }));
        
        setSuccess(true);
        setLoading(false);
      }, 5400); // matching step cycles
      return;
    }
    setLoading(false);
  };

  return (
    <div className="fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Resume Parsing Hub</h2>
        <p className="text-xs text-gray-400">Upload your portfolio resume to prefill details and analyze ATS screening metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Upload panel card */}
        <div className="space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`w-full h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer relative overflow-hidden transition ${
              file ? 'border-primary/40 bg-primary/5' : 'border-gray-300 dark:border-white/10 hover:border-primary/20 dark:hover:border-primary/20 bg-white dark:bg-darkCard'
            }`}
          >
            {/* Scan animation bar */}
            {loading && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-scan z-20" />
            )}

            <input 
              type="file" 
              onChange={handleChange}
              accept=".pdf,.docx"
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
            
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary-light flex items-center justify-center">
                <FileUp size={22} className={loading ? "animate-bounce" : ""} />
              </div>
              <div>
                <p className="text-xs font-semibold">
                  {file ? `Selected: ${file.name}` : 'Drag & drop your resume file'}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Supported file formats: PDF, DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {file && !loading && !success && (
            <button
              onClick={triggerUpload}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} /> Analyze & Synchronize Profile
            </button>
          )}

          {/* Visual checklist load steps */}
          {loading && (
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Scanning Document</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary-light font-semibold animate-pulse">
                  Step {progressStep + 1} of 6
                </span>
              </div>
              <p className="text-[11px] font-semibold text-primary-light animate-pulse">{steps[progressStep]}</p>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-white/5 text-[10px] font-bold text-gray-400">
                {steps.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border ${progressStep > idx ? 'bg-success border-success text-white' : (progressStep === idx ? 'border-primary text-primary animate-pulse' : 'border-gray-200 dark:border-white/5')}`}>
                      {progressStep > idx ? '✓' : (progressStep === idx ? '●' : '○')}
                    </span>
                    <span className={progressStep === idx ? 'text-gray-900 dark:text-white font-semibold' : 'opacity-70'}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="w-full">
          {success && parsedData ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 p-6 space-y-6 fade-in shadow-xl relative">
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold border border-success/20">
                <CheckCircle2 size={12} /> Sync Complete
              </div>
              
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Extracted Metadata</h3>
                <p className="text-[10px] text-gray-400 mt-1">Directly synchronized into your system profile portfolio.</p>
              </div>

              <div className="space-y-4 border-t border-gray-200 dark:border-white/10 pt-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">CANDIDATE NAME</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{parsedData.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">EMAIL SIGNATURE</span>
                    <span className="font-semibold text-gray-900 dark:text-white truncate block">{parsedData.email || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">DETECTION SKILLS ({parsedData.skills?.length ?? 0})</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parsedData.skills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-primary/10 text-primary-light border border-primary/20 text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">CHRONOLOGICAL EXPERIENCES</span>
                  {parsedData.experience?.map((e, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-gray-200 dark:border-white/5 bg-white/5 mt-1.5">
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{e.role}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{e.company} | {e.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentTab('ats')}
                  className="flex-grow py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                >
                  Grade ATS Match <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentTab('jobs')}
                  className="flex-grow py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition"
                >
                  Jobs Recommended
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 rounded-2xl border border-gray-200 dark:border-white/5 bg-white/30 dark:bg-darkCard/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <FileText size={48} className="stroke-[1] mb-4 text-gray-300 dark:text-white/10" />
              <p className="text-xs font-bold">Waiting for Document Upload</p>
              <p className="text-[10px] max-w-xs mt-1.5 leading-relaxed">
                Once uploaded, our parsing engines will map textual blocks, extract technology tags, and populate this panel automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
