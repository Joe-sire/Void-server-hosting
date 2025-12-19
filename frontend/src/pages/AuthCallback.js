import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          console.error('No session_id found in URL');
          console.log('Current URL:', window.location.href);
          console.log('Hash:', location.hash);
          navigate('/login');
          return;
        }

        console.log('Processing session_id:', sessionId);

        // Exchange session_id for user data
        const response = await authAPI.createSession(sessionId);
        const { user, session_token } = response;
        
        console.log('Session created successfully, user:', user);

        // Store session_token in localStorage as fallback
        if (session_token) {
          localStorage.setItem('session_token', session_token);
        }

        // Login user (stores in context and localStorage)
        login(user);

        // Small delay to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate to dashboard with user data
        navigate('/dashboard', { state: { user }, replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        console.error('Error details:', error.response?.data || error.message);
        navigate('/login');
      }
    };

    processSession();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};
