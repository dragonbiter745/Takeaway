
import React, { useState } from 'react';
import type { User } from '../types';
import { UserIcon, LockIcon } from './IconComponents';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && emailOrPhone.trim()) {
      onLogin({ name, emailOrPhone });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-cyber-surface rounded-lg border border-cyber-border shadow-2xl shadow-cyber-primary/10">
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-black text-cyber-primary tracking-wider" style={{ textShadow: '0 0 8px #00f6ff' }}>
            CyberEats
          </h1>
          <p className="mt-2 text-gray-400">Your portal to the future of flavor.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-primary/50" />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full pl-10 pr-3 py-3 bg-cyber-bg border border-cyber-border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-cyber-primary transition-all duration-300"
              placeholder="Enter your callsign (Name)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-primary/50" />
            <input
              id="credential"
              name="credential"
              type="text"
              autoComplete="email"
              required
              className="w-full pl-10 pr-3 py-3 bg-cyber-bg border border-cyber-border rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-cyber-primary transition-all duration-300"
              placeholder="Access Key (Email or Phone)"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-cyber-primary font-orbitron uppercase tracking-widest hover:bg-white hover:shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg focus:ring-cyber-primary transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
