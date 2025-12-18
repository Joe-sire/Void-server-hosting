import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Zap, Shield, Database, Globe, Clock, Headphones, Check, ArrowRight, Menu, X } from 'lucide-react';
import { mockTestimonials } from '../mock';
import { publicAPI } from '../services/api';

const iconMap = {
  Zap, Shield, Database, Globe, Clock, Headphones
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
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
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MCHosting
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-purple-400 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-300 hover:text-purple-400 transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-300 hover:text-purple-400 transition-colors">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-300 hover:text-purple-400 transition-colors">
                FAQ
              </button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                Sign In
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-4 pb-4">
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-purple-400 transition-colors text-left">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-slate-300 hover:text-purple-400 transition-colors text-left">
                Pricing
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-slate-300 hover:text-purple-400 transition-colors text-left">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-300 hover:text-purple-400 transition-colors text-left">
                FAQ
              </button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 w-full"
              >
                Sign In
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
            Premium Minecraft Server Hosting
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Build Your Dream
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Minecraft World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
            Lightning-fast servers with 99.9% uptime. Start in 60 seconds with enterprise-grade DDoS protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('pricing')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection('features')}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to run a successful Minecraft server
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <Card key={index} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all">
                    <Icon className="text-purple-400" size={24} />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan for your community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-slate-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/50 transition-all relative ${
                plan.featured ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-slate-300">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.ram} RAM</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.storage} Storage</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.slots}</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.cpu}</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.backups} Backups</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300">
                    <Check className="text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                    <span>{plan.support} Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.featured 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                      : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30'
                  }`}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Loved by Server Owners
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join thousands of satisfied customers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="bg-gradient-to-br from-purple-600 to-pink-600">
                    <AvatarFallback className="text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-white text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="text-slate-400">{testimonial.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to know
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {mockFAQs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-slate-900/50 border border-purple-500/20 rounded-lg px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-white hover:text-purple-400 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_craftpanel-4/artifacts/s0hao41h_Website%20Logo.png" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MCHosting
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Premium Minecraft server hosting with enterprise-grade performance.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-purple-400 transition-colors">Pricing</button></li>
                <li><button className="hover:text-purple-400 transition-colors">Documentation</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button className="hover:text-purple-400 transition-colors">About</button></li>
                <li><button className="hover:text-purple-400 transition-colors">Blog</button></li>
                <li><button className="hover:text-purple-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button className="hover:text-purple-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-purple-400 transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 MCHosting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};