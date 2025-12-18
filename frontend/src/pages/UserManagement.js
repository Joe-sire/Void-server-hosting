import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { ArrowLeft, LogOut, Crown, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const UserManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        withCredentials: true
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await axios.put(
        `${BACKEND_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      
      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`,
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://customer-assets.emergentagent.com/job_craftpanel-4/artifacts/s0hao41h_Website%20Logo.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MCHosting Admin
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Admin Panel
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600">
                  <AvatarFallback className="text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="text-slate-300 hover:text-purple-400"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-300">Manage user roles and permissions</p>
        </div>

        <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
            <CardDescription className="text-slate-400">
              Click the role badge to toggle between User and Admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((u) => (
                <div 
                  key={u.user_id} 
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600">
                      <AvatarFallback className="text-white">
                        {u.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-sm text-slate-400">{u.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant={u.role === 'admin' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAdminRole(u.user_id, u.role)}
                      disabled={u.user_id === user?.user_id}
                      className={u.role === 'admin' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10'
                      }
                    >
                      {u.role === 'admin' ? (
                        <>
                          <Crown className="mr-2" size={14} />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="mr-2" size={14} />
                          User
                        </>
                      )}
                    </Button>
                    {u.user_id === user?.user_id && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-slate-800/30 border border-purple-500/20 rounded-lg">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Crown size={18} className="text-purple-400" />
            How to Grant Admin Access
          </h3>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>• Users must sign in with Google first before they appear in this list</li>
            <li>• Click the role badge to toggle between User and Admin roles</li>
            <li>• Admin users can access the Admin Panel and User Management</li>
            <li>• You cannot change your own role for security reasons</li>
          </ul>
        </div>
      </div>
    </div>
  );
};