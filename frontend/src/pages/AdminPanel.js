import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { mockPlans, mockFeatures, mockFAQs } from '../mock';
import { ArrowLeft, LogOut, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState(mockPlans);
  const [features, setFeatures] = useState(mockFeatures);
  const [faqs, setFaqs] = useState(mockFAQs);
  const [siteContent, setSiteContent] = useState({
    heroTitle: 'Build Your Dream',
    heroSubtitle: 'Minecraft World',
    heroDescription: 'Lightning-fast servers with 99.9% uptime. Start in 60 seconds with enterprise-grade DDoS protection.'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSavePlans = () => {
    // Save to localStorage for demo
    localStorage.setItem('customPlans', JSON.stringify(plans));
    toast({
      title: 'Plans updated',
      description: 'Server plans have been saved successfully',
    });
  };

  const handleSaveSiteContent = () => {
    localStorage.setItem('siteContent', JSON.stringify(siteContent));
    toast({
      title: 'Content updated',
      description: 'Website content has been saved successfully',
    });
  };

  const handleSaveFeatures = () => {
    localStorage.setItem('features', JSON.stringify(features));
    toast({
      title: 'Features updated',
      description: 'Features have been saved successfully',
    });
  };

  const handleSaveFAQs = () => {
    localStorage.setItem('faqs', JSON.stringify(faqs));
    toast({
      title: 'FAQs updated',
      description: 'FAQs have been saved successfully',
    });
  };

  const updatePlan = (id, field, value) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateFeature = (index, field, value) => {
    setFeatures(features.map((f, i) => i === index ? { ...f, [field]: value } : f));
  };

  const updateFAQ = (id, field, value) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const addFAQ = () => {
    const newId = String(faqs.length + 1);
    setFaqs([...faqs, { id: newId, question: 'New Question', answer: 'New Answer' }]);
  };

  const deleteFAQ = (id) => {
    setFaqs(faqs.filter(f => f.id !== id));
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
                MCHosting Admin
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/users')}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600">
                  <AvatarFallback className="text-white">{user?.avatar}</AvatarFallback>
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
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-300">Customize your website content and server plans</p>
        </div>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="bg-slate-900/50 border border-purple-500/20 p-1">
            <TabsTrigger 
              value="plans" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              Server Plans
            </TabsTrigger>
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              Site Content
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="faqs" 
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              FAQs
            </TabsTrigger>
          </TabsList>

          {/* Server Plans Tab */}
          <TabsContent value="plans" className="mt-6">
            <div className="space-y-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name} Plan</CardTitle>
                    <CardDescription className="text-slate-400">Edit plan details and pricing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${plan.id}`} className="text-slate-300">Plan Name</Label>
                        <Input
                          id={`name-${plan.id}`}
                          value={plan.name}
                          onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`price-${plan.id}`} className="text-slate-300">Price ($/month)</Label>
                        <Input
                          id={`price-${plan.id}`}
                          type="number"
                          step="0.01"
                          value={plan.price}
                          onChange={(e) => updatePlan(plan.id, 'price', parseFloat(e.target.value))}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ram-${plan.id}`} className="text-slate-300">RAM</Label>
                        <Input
                          id={`ram-${plan.id}`}
                          value={plan.ram}
                          onChange={(e) => updatePlan(plan.id, 'ram', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`storage-${plan.id}`} className="text-slate-300">Storage</Label>
                        <Input
                          id={`storage-${plan.id}`}
                          value={plan.storage}
                          onChange={(e) => updatePlan(plan.id, 'storage', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`slots-${plan.id}`} className="text-slate-300">Player Slots</Label>
                        <Input
                          id={`slots-${plan.id}`}
                          value={plan.slots}
                          onChange={(e) => updatePlan(plan.id, 'slots', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cpu-${plan.id}`} className="text-slate-300">CPU</Label>
                        <Input
                          id={`cpu-${plan.id}`}
                          value={plan.cpu}
                          onChange={(e) => updatePlan(plan.id, 'cpu', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <Label htmlFor={`description-${plan.id}`} className="text-slate-300">Description</Label>
                        <Input
                          id={`description-${plan.id}`}
                          value={plan.description}
                          onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                onClick={handleSavePlans}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="mr-2" size={16} />
                Save All Plans
              </Button>
            </div>
          </TabsContent>

          {/* Site Content Tab */}
          <TabsContent value="content" className="mt-6">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Hero Section Content</CardTitle>
                <CardDescription className="text-slate-400">Edit the main landing page hero content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle" className="text-slate-300">Hero Title (Line 1)</Label>
                  <Input
                    id="heroTitle"
                    value={siteContent.heroTitle}
                    onChange={(e) => setSiteContent({...siteContent, heroTitle: e.target.value})}
                    className="bg-slate-900 border-purple-500/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="heroSubtitle" className="text-slate-300">Hero Title (Line 2)</Label>
                  <Input
                    id="heroSubtitle"
                    value={siteContent.heroSubtitle}
                    onChange={(e) => setSiteContent({...siteContent, heroSubtitle: e.target.value})}
                    className="bg-slate-900 border-purple-500/20 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="heroDescription" className="text-slate-300">Hero Description</Label>
                  <Textarea
                    id="heroDescription"
                    value={siteContent.heroDescription}
                    onChange={(e) => setSiteContent({...siteContent, heroDescription: e.target.value})}
                    className="bg-slate-900 border-purple-500/20 text-white mt-2"
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={handleSaveSiteContent}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="mr-2" size={16} />
                  Save Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="mt-6">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`feature-title-${index}`} className="text-slate-300">Title</Label>
                        <Input
                          id={`feature-title-${index}`}
                          value={feature.title}
                          onChange={(e) => updateFeature(index, 'title', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`feature-icon-${index}`} className="text-slate-300">Icon</Label>
                        <Input
                          id={`feature-icon-${index}`}
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`feature-desc-${index}`} className="text-slate-300">Description</Label>
                        <Textarea
                          id={`feature-desc-${index}`}
                          value={feature.description}
                          onChange={(e) => updateFeature(index, 'description', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                onClick={handleSaveFeatures}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="mr-2" size={16} />
                Save Features
              </Button>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs" className="mt-6">
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor={`faq-q-${faq.id}`} className="text-slate-300">Question</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFAQ(faq.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <Input
                          id={`faq-q-${faq.id}`}
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`faq-a-${faq.id}`} className="text-slate-300">Answer</Label>
                        <Textarea
                          id={`faq-a-${faq.id}`}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          className="bg-slate-900 border-purple-500/20 text-white mt-2"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-4">
                <Button 
                  onClick={addFAQ}
                  variant="outline"
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                >
                  <Plus className="mr-2" size={16} />
                  Add FAQ
                </Button>
                <Button 
                  onClick={handleSaveFAQs}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="mr-2" size={16} />
                  Save FAQs
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};