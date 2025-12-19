import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, access_code: accessCode },
        { withCredentials: true }
      );

      const { user, session_token } = response.data;

      // Store session token
      if (session_token) {
        localStorage.setItem('session_token', session_token);
      }

      // Login user
      login(user);

      // Navigate based on role
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or access code');
    } finally {
      setLoading(false);
    }
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
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-slate-900 border-purple-500/20 text-white focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="accessCode" className="text-slate-300">Access Code</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                  className="mt-2 bg-slate-900 border-purple-500/20 text-white focus:border-purple-500"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center p-2 bg-red-500/10 border border-red-500/20 rounded">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-4">
              Contact admin for your access code
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};