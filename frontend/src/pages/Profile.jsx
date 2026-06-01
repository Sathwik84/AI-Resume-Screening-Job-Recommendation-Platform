import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Sparkles, Plus, Trash2, Mail, Phone, Calendar, MapPin, Building, GraduationCap, Edit3 } from 'lucide-react';

export default function Profile() {
  const { user, setUser, apiFetch, isOfflineMode } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [summary, setSummary] = useState(user?.summary || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      full_name: fullName,
      summary: summary,
      skills: skills
    };

    try {
      const res = await apiFetch('/profile/', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setShowEdit(false);
      }
    } catch (e) {
      console.warn("Backend offline, updating profile states locally.");
      setUser(prev => ({
        ...prev,
        full_name: fullName,
        summary: summary,
        skills: skills,
        profile_strength: Math.min(100.0, 45.0 + skills.length * 5.0 + (summary ? 15.0 : 0.0))
      }));
      setShowEdit(false);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fade-in space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Student Portfolio Profile</h2>
          <p className="text-xs text-gray-400">Manage your active credentials, skills timeline, and academic records.</p>
        </div>
        <button
          onClick={() => {
            setFullName(user.full_name || '');
            setSummary(user.summary || '');
            setSkills(user.skills || []);
            setShowEdit(true);
          }}
          className="px-4.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition flex items-center gap-1.5"
        >
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column Profile Card */}
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard flex flex-col items-center text-center shadow-md relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-extrabold text-white text-3xl shadow-xl shadow-primary/20">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <h3 className="font-extrabold text-base text-gray-900 dark:text-white mt-4">{user.full_name || 'Talented Student'}</h3>
          <p className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary-light font-bold mt-1.5 uppercase">
            STUDENT PORTFOLIO
          </p>

          <div className="w-full space-y-3.5 mt-6 border-t border-gray-100 dark:border-white/5 pt-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-primary-light" />
              <span className="truncate block max-w-[200px]">{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-primary-light" />
              <span>{user.phone || '+91 98765 43210'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-primary-light" />
              <span>Dundigal, Hyderabad</span>
            </div>
          </div>

          <div className="w-full border-t border-gray-100 dark:border-white/5 pt-5 mt-5 text-left space-y-2.5">
            <div className="flex justify-between text-xs font-bold">
              <span>Profile Strength</span>
              <span className="text-primary-light">{user.profile_strength}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${user.profile_strength}%` }} />
            </div>
          </div>
        </div>

        {/* Right Columns timelines & skills */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary */}
          {user.summary && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Professional Summary</h4>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-semibold">{user.summary}</p>
            </div>
          )}

          {/* Skills board */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Active Technology Matrix</h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.skills?.length === 0 ? (
                <span className="text-xs text-gray-400">No technology skill tags listed yet.</span>
              ) : (
                user.skills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary-light border border-primary/20 text-[10px] font-bold">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Timelines Experiences */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-6">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Building size={16} className="text-primary-light" /> Professional Work Timeline
            </h4>
            
            <div className="relative border-l border-gray-200 dark:border-white/10 pl-6 space-y-6 ml-2 text-xs">
              {user.experience?.length === 0 ? (
                <div className="text-gray-400">No professional timelines listed. Upload a resume to populate.</div>
              ) : (
                user.experience?.map((e, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Node pointer */}
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-primary border-4 border-white dark:border-darkCard" />
                    
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 font-bold">
                        <span className="text-gray-900 dark:text-white">{e.role}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-400 shrink-0 font-medium">
                          {e.duration}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">{e.company}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed font-semibold">
                        {e.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Timelines Academics */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-sm space-y-6">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={18} className="text-primary-light" /> Academic Graduation Timeline
            </h4>
            
            <div className="relative border-l border-gray-200 dark:border-white/10 pl-6 space-y-6 ml-2 text-xs">
              {user.education?.length === 0 ? (
                <div className="text-gray-400">No graduation records listed.</div>
              ) : (
                user.education?.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-secondary border-4 border-white dark:border-darkCard" />
                    
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 font-bold">
                        <span className="text-gray-900 dark:text-white">{edu.degree}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-400 shrink-0 font-medium">
                          Grad: {edu.year}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold">{edu.school}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile drawer Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold text-xs"
            >
              ✕ CLOSE
            </button>

            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Modify Portfolio Profile</h3>
              <p className="text-[10px] text-gray-400">Update summary narratives or manual technologies catalog tags.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-gray-400">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400">CANDIDATE NAME</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400">PROFESSIONAL SUMMARY STATEMENT</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400">ADD DIRECT TECHNOLOGY TAGS</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AWS Cloud"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:border-primary focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                
                {/* Visual edit tags list */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100 dark:border-white/5 mt-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 flex items-center gap-1.5 text-[10px]">
                      {s}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(s)} 
                        className="text-danger hover:scale-110 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-grow py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-grow py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition flex items-center justify-center gap-1 shadow-lg shadow-primary/20"
                >
                  {saving ? 'Saving...' : 'Save Portfolio Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
