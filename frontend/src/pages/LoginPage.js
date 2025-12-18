import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { mockUser, mockAdmin } from '../mock';
import { ArrowLeft } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = (isAdmin = false) => {
    // Mock Google OAuth login
    const user = isAdmin ? mockAdmin : mockUser;
    login(user);
    navigate(isAdmin ? '/admin' : '/dashboard');
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
            <Button 
              onClick={() => handleGoogleLogin(false)}
              className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-500/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900/50 px-2 text-slate-400">Demo Mode</span>
              </div>
            </div>

            <Button 
              onClick={() => handleGoogleLogin(true)}
              variant="outline"
              className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              Sign in as Admin (Demo)
            </Button>

            <p className="text-xs text-slate-400 text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};