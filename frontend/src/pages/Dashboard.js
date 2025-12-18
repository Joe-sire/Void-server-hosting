import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from '../context/AuthContext';
import { mockServers, mockConsoleLogs } from '../mock';
import { Play, Square, RotateCw, Server, LogOut, Settings, Terminal, Activity } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const [servers, setServers] = useState(mockServers);
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [consoleLogs, setConsoleLogs] = useState(mockConsoleLogs);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleServerAction = (serverId, action) => {
    setServers(servers.map(s => {
      if (s.id === serverId) {
        let newStatus = s.status;
        if (action === 'start') newStatus = 'running';
        if (action === 'stop') newStatus = 'stopped';
        if (action === 'restart') newStatus = 'restarting';
        return { ...s, status: newStatus };
      }
      return s;
    }));

    toast({
      title: `Server ${action}ed`,
      description: `Successfully ${action}ed the server`,
    });

    // Update selected server if it's the one being modified
    if (selectedServer.id === serverId) {
      setSelectedServer({ ...selectedServer, status: action === 'start' ? 'running' : action === 'stop' ? 'stopped' : 'restarting' });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-red-500';
      case 'restarting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'running': return 'Running';
      case 'stopped': return 'Stopped';
      case 'restarting': return 'Restarting';
      default: return 'Unknown';
    }
  };

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
                MCHosting
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin')}
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                  <Settings className="mr-2" size={16} />
                  Admin Panel
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600">
                  <AvatarFallback className="text-white">{user?.avatar}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Your Servers</h1>
          <p className="text-slate-300">Manage and monitor your Minecraft servers</p>
        </div>

        {/* Server List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {servers.map((server) => (
            <Card 
              key={server.id} 
              className={`bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all cursor-pointer ${
                selectedServer.id === server.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedServer(server)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Server size={20} />
                      {server.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {server.plan} Plan
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(server.status)} text-white border-0`}>
                    {getStatusText(server.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Players:</span>
                    <span className="font-medium">{server.players}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Uptime:</span>
                    <span className="font-medium text-green-400">{server.uptime}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Version:</span>
                    <span className="font-medium">{server.version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Server Details */}
        {selectedServer && (
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">{selectedServer.name}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    {selectedServer.ip}:{selectedServer.port}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleServerAction(selectedServer.id, 'start')}
                    disabled={selectedServer.status === 'running'}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play size={16} className="mr-1" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleServerAction(selectedServer.id, 'stop')}
                    disabled={selectedServer.status === 'stopped'}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Square size={16} className="mr-1" />
                    Stop
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleServerAction(selectedServer.id, 'restart')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <RotateCw size={16} className="mr-1" />
                    Restart
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-slate-800/50 border-purple-500/20">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">
                    <Activity size={16} className="mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="console" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">
                    <Terminal size={16} className="mr-2" />
                    Console
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Server Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <Badge className={`${getStatusColor(selectedServer.status)} text-white border-0`}>
                            {getStatusText(selectedServer.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">IP Address:</span>
                          <span className="text-white font-mono">{selectedServer.ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Port:</span>
                          <span className="text-white font-mono">{selectedServer.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Version:</span>
                          <span className="text-white">{selectedServer.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Created:</span>
                          <span className="text-white">{selectedServer.created}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4">Performance</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">CPU Usage</span>
                            <span className="text-white">45%</span>
                          </div>
                          <Progress value={45} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" style={{width: '45%'}} />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">RAM Usage</span>
                            <span className="text-white">2.1GB / 4GB</span>
                          </div>
                          <Progress value={52} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" style={{width: '52%'}} />
                          </Progress>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Storage</span>
                            <span className="text-white">6.5GB / 25GB</span>
                          </div>
                          <Progress value={26} className="h-2 bg-slate-700">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" style={{width: '26%'}} />
                          </Progress>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="console" className="mt-6">
                  <div className="bg-slate-950 border border-purple-500/20 rounded-lg p-4">
                    <ScrollArea className="h-80">
                      <div className="font-mono text-sm space-y-1">
                        {consoleLogs.map((log, index) => (
                          <div key={index} className="text-green-400">
                            {log}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter command..." 
                        className="flex-1 bg-slate-900 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Button 
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => {
                          toast({
                            title: 'Command sent',
                            description: 'Command executed successfully',
                          });
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-4">Server Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-slate-400 block mb-2">Server Name</label>
                          <input 
                            type="text" 
                            defaultValue={selectedServer.name}
                            className="w-full bg-slate-900 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 block mb-2">Max Players</label>
                          <input 
                            type="number" 
                            defaultValue="50"
                            className="w-full bg-slate-900 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 block mb-2">Game Mode</label>
                          <select className="w-full bg-slate-900 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Survival</option>
                            <option>Creative</option>
                            <option>Adventure</option>
                            <option>Spectator</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 block mb-2">Difficulty</label>
                          <select className="w-full bg-slate-900 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>Peaceful</option>
                            <option>Easy</option>
                            <option>Normal</option>
                            <option>Hard</option>
                          </select>
                        </div>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            toast({
                              title: 'Settings saved',
                              description: 'Server settings updated successfully',
                            });
                          }}
                        >
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};