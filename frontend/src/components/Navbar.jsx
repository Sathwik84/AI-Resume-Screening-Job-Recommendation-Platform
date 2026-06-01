import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, LogOut, Briefcase, User, Sparkles } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab }) {
  const { user, logout, notifications, setNotifications, isOfflineMode, apiFetch } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotif, setShowNotif] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      if (!isOfflineMode) {
        await apiFetch('/dashboard/notifications/read-all', { method: 'PUT' });
      }
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {}
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-white/5 bg-white/75 dark:bg-darkBg/75 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles size={20} className="animate-pulse-slow" />
        </div>
        <div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            ElevateResume
          </span>
          {isOfflineMode && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Demo Sandbox
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotif(!showNotif);
                if (!showNotif && unreadCount > 0) handleMarkAllRead();
              }}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full animate-ping" />
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-darkCard shadow-2xl p-4 z-50 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                  <span className="font-bold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 bg-primary/10 text-primary-light rounded-full font-medium">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto py-2 flex flex-col gap-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-lg text-xs leading-relaxed transition ${n.is_read ? 'text-gray-500' : 'bg-primary/5 text-gray-800 dark:text-gray-200 border-l-2 border-primary'}`}>
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Account Info */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-white/10">
            <div 
              onClick={() => setCurrentTab('profile')}
              className="w-8 h-8 rounded-lg bg-primary/10 text-primary-light flex items-center justify-center font-bold text-xs cursor-pointer border border-primary/20 hover:scale-105 transition"
            >
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold max-w-[120px] truncate">{user.full_name || 'User'}</p>
              <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{user.email}</p>
            </div>
            <button 
              onClick={logout}
              className="p-1.5 rounded-lg text-gray-400 hover:text-danger dark:hover:text-danger hover:bg-danger/10 transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setCurrentTab('login')}
            className="px-4 py-1.5 rounded-lg bg-primary text-white font-medium text-xs hover:bg-primary-light hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
