import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeResume, setActiveResume] = useState(null);

  // Initial user loading
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async (accessToken = token) => {
    try {
      const res = await fetch(`${API_BASE}/profile/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsOfflineMode(false);
        fetchNotifications(accessToken);
        fetchResume(accessToken);
      } else {
        // Token invalid
        logout();
      }
    } catch (e) {
      console.warn("Backend offline, entering High-Fidelity Mock Sandbox Mode.");
      setIsOfflineMode(true);
      // Seed robust mock user data
      setUser({
        id: 1,
        email: 'portfolio.student@iare.edu.in',
        full_name: 'Sathwik Kumar',
        summary: 'Ambitious Software Engineering student at IARE. Experienced in building full-stack products using React, Python, and automated pipelines.',
        skills: ['React.js', 'FastAPI', 'Python', 'Tailwind CSS', 'SQL', 'n8n Workflows'],
        experience: [
          {
            role: 'Full Stack Engineering Intern',
            company: 'CloudVentures',
            duration: 'June 2025 - Aug 2025',
            description: 'Designed high-speed dashboards and automated notification systems saving 10hrs/week in manual recruiter operations.'
          }
        ],
        education: [
          {
            degree: 'B.Tech in Computer Science',
            school: 'Institute of Aeronautical Research (IARE)',
            year: '2027'
          }
        ],
        projects: [
          {
            name: 'AI Resume Screen Engine',
            description: 'A platform screening ATS compatibility scoring using local-side heuristics.'
          }
        ],
        achievements: ['Won IARE Hackathon 2025', 'AWS Certified Developer'],
        profile_strength: 78.0
      });
      
      // Mock notifications
      setNotifications([
        { id: 1, message: 'Welcome to the platform sandbox mode! Upload a resume to see parsers in action.', is_read: false, created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (accessToken = token) => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/notifications`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {}
  };

  const fetchResume = async (accessToken = token) => {
    try {
      const res = await fetch(`${API_BASE}/resumes/my-resume`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveResume(data);
      }
    } catch (e) {}
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        await fetchProfile(data.access_token);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.detail || 'Authentication failed' };
      }
    } catch (e) {
      // Mock login validation
      if (email && password) {
        localStorage.setItem('token', 'mock_token_123');
        setToken('mock_token_123');
        setIsOfflineMode(true);
        await fetchProfile('mock_token_123');
        return { success: true };
      }
      return { success: false, error: 'Network error or bad parameters.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      if (res.ok) {
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.detail || 'Registration failed' };
      }
    } catch (e) {
      // Mock registration
      localStorage.setItem('token', 'mock_token_123');
      setToken('mock_token_123');
      setIsOfflineMode(true);
      await fetchProfile('mock_token_123');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setActiveResume(null);
    setNotifications([]);
  };

  // Helper utility to fetch operations safely
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      setUser,
      loading,
      login,
      register,
      logout,
      isOfflineMode,
      notifications,
      setNotifications,
      activeResume,
      setActiveResume,
      fetchProfile,
      apiFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
