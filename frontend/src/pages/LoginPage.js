import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const GOOGLE_CLIENT_ID = '963419862546-1c85b8aaqvf37fd6mh49b4u05l0ao44m.apps.googleusercontent.com';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Google Sign-In with One Tap (no redirect needed!)
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
        }
      );
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      console.log('Google Sign-In successful, verifying token...');
      
      // Send token to backend for verification
      const result = await axios.post(
        `${BACKEND_URL}/api/auth/google/verify`,
        { token: response.credential },
        { withCredentials: true }
      );

      const { user, session_token } = result.data;
      
      // Store session token
      if (session_token) {
        localStorage.setItem('session_token', session_token);
      }

      // Login user
      login(user);

      // Navigate to dashboard
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    // Trigger Google Sign-In
    window.google.accounts.id.prompt();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4 text-slate-300 hover:text-purple-400"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Button>
        
        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_craftpanel-4/artifacts/s0hao41h_Website%20Logo.png" 
                alt="Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In Button */}
            <div id="google-signin-button" className="w-full flex justify-center"></div>

            <p className="text-xs text-slate-400 text-center mt-4">
              Sign in with your Google account to access your dashboard
            </p>

            <p className="text-xs text-slate-400 text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};