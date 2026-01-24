'use client';

import React, { useState, JSX } from 'react';
import { Mail, CheckCircle, Sparkles, Zap, Target, TrendingUp, Bell } from 'lucide-react';
import type { WaitlistStatus, Feature, ValueProposition } from '@/types';

const features: Feature[] = [
  {
    id: 'audit',
    icon: Target,
    title: 'AI Visibility Audit',
    description: 'Starting at $297',
    price: '$297',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start Package',
    description: '$750 one-time',
    price: '$750',
    iconColor: 'text-yellow-400'
  },
  {
    id: 'transformation',
    icon: TrendingUp,
    title: 'Full Transformation',
    description: '$2,497/month',
    price: '$2,497/mo',
    iconColor: 'text-green-400'
  }
];

const valueProps: ValueProposition[] = [
  {
    id: 'tracking',
    icon: CheckCircle,
    title: 'AI Citation Tracking',
    description: 'Monitor how often your brand appears in AI responses',
    bgColor: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400'
  },
  {
    id: 'gap-analysis',
    icon: Target,
    title: 'Competitor Gap Analysis',
    description: "See where competitors rank and you don't",
    bgColor: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    id: 'tools',
    icon: TrendingUp,
    title: 'AI Optimization Tools',
    description: '16+ specialized tools to boost AI visibility',
    bgColor: 'bg-green-500/20',
    iconColor: 'text-green-400'
  }
];

export function ComingSoon(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<WaitlistStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (): Promise<void> => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          timestamp: new Date().toISOString() 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error(data.message || 'Failed to join waitlist');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      console.error('Waitlist error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main content container - centered and minimalist */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-20">
        {/* Logo - centered with padding */}
        <div className="pt-12 pb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">GEOCoLab</h1>
          </div>
        </div>

        {/* Badge - centered with padding */}
        <div className="pb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Bell className="w-4 h-4 text-cyan-400 mr-2" />
            <span className="text-sm font-medium text-white">Launching January 2026</span>
          </div>
        </div>

        {/* Headline and Subheadline - centered with padding */}
        <div className="pb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Dominate AI-Powered
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Search Results
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            The first AI Generative Engine Optimization platform that ensures your profile and business appears when customers ask ChatGPT, Gemini, and other AI powered search and social engines.
          </p>
        </div>

        {/* Features - grid with padding */}
        <div className="pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <Icon className={`w-8 h-8 ${feature.iconColor} mx-auto mb-3`} />
                  <p className="text-white font-medium mb-1">{feature.title}</p>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email signup - centered with more padding */}
        <div className="pb-20">
          <div className="max-w-md mx-auto">
            {status === 'success' ? (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg p-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">You're on the list!</h3>
                <p className="text-gray-200">We'll notify you when we launch. Get ready for early access pricing!</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter your email"
                      aria-label="Email address"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    aria-label="Join waitlist"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="mt-3 text-sm text-red-400" role="alert">{errorMessage}</p>
                )}
                <p className="mt-4 text-sm text-gray-300">
                  Join <span className="font-bold text-cyan-400">500+</span> businesses waiting for launch
                </p>
              </>
            )}
          </div>
        </div>

        {/* Value props - grid with padding */}
        <div className="pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div 
                  key={prop.id}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                >
                  <div className={`w-10 h-10 ${prop.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${prop.iconColor}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{prop.title}</h3>
                  <p className="text-gray-300 text-sm">{prop.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social proof - with padding */}
        <div className="pb-16 border-t border-white/20 pt-8">
          <p className="text-gray-300 text-sm mb-4">Trusted by forward-thinking businesses</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
            <div className="w-24 h-8 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>

      {/* Footer - centered with padding */}
      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-gray-400">
        <p>© 2025 GEOCoLab. Part of the DNDHUB Ecosystem.</p>
      </footer>
    </div>
  );
}