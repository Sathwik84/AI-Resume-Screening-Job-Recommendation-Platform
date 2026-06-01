import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  Gauge, 
  Briefcase, 
  Sparkles, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Compass
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Resume Upload', icon: FileUp },
    { id: 'ats', label: 'ATS Analysis', icon: Gauge },
    { id: 'tailor-assistant', label: 'Smart Resume Tailor', icon: Award },
    { id: 'jobs', label: 'Job Recommendations', icon: Briefcase },
    { id: 'ai-tools', label: 'Career AI Tools', icon: Sparkles },
    { id: 'n8n-visuals', label: 'n8n Workflows', icon: Compass },
    { id: 'profile', label: 'Profile Hub', icon: User },
  ];

  return (
    <aside 
      className={`fixed md:sticky top-[73px] bottom-0 left-0 z-30 transition-all duration-300 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-darkBg flex flex-col justify-between py-6 ${sidebarOpen ? 'w-64' : 'w-16 md:w-20'} h-[calc(100vh-73px)]`}
    >
      <div className="flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
              title={!sidebarOpen ? item.label : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="truncate transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-3 flex justify-end">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-white hidden md:block transition"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}
