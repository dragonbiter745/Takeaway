
import React from 'react';
import { ShoppingCartIcon, LogOutIcon, HistoryIcon } from './IconComponents';

interface HeaderProps {
  userName: string;
  cartCount: number;
  onCheckout: () => void;
  onShowHistory: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, cartCount, onCheckout, onShowHistory, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cyber-surface/80 backdrop-blur-lg border-b border-cyber-border shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-cyber-primary tracking-widest uppercase" style={{ textShadow: '0 0 5px #00f6ff' }}>
          CyberEats
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="hidden md:block text-gray-300">Welcome, {userName}</span>
          <button 
            onClick={onCheckout}
            className="relative p-2 rounded-full hover:bg-cyber-primary/20 transition-colors duration-300 group"
            aria-label="Open cart"
          >
            <ShoppingCartIcon className="w-6 h-6 text-cyber-primary group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyber-secondary text-xs font-bold shadow-glow-secondary">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={onShowHistory}
            className="p-2 rounded-full hover:bg-cyber-accent/20 transition-colors duration-300 group"
            aria-label="View order history"
          >
            <HistoryIcon className="w-6 h-6 text-cyber-accent group-hover:scale-110 transition-transform"/>
          </button>
           <button 
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-cyber-secondary/20 transition-colors duration-300 group"
            aria-label="Logout"
          >
            <LogOutIcon className="w-6 h-6 text-cyber-secondary group-hover:scale-110 transition-transform"/>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
