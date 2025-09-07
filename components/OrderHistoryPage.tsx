
import React from 'react';
import type { Order } from '../types';

interface OrderHistoryPageProps {
  orders: Order[];
  onBackToMenu: () => void;
}

const OrderHistoryCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-cyber-surface p-6 rounded-lg border border-cyber-border transition-all hover:border-cyber-secondary/50 hover:shadow-glow-secondary/20">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-400">Order ID</p>
        <p className="font-mono text-cyber-accent text-lg">{order.id}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Date</p>
        <p className="text-gray-300">{order.timestamp.toLocaleString()}</p>
      </div>
    </div>
    
    <div className="my-4">
      <ul className="space-y-1 text-gray-300">
        {order.items.map(i => (
          <li key={i.item.id} className="flex justify-between text-sm">
            <span>{i.quantity}x {i.item.name} <span className="text-gray-500">({i.restaurant})</span></span>
            <span>${(i.item.price * i.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <hr className="my-3 border-cyber-border/50" />
    
    <div className="flex justify-between items-center font-bold text-xl">
      <span className="text-cyber-primary">Total:</span>
      <span className="text-cyber-accent">${order.total.toFixed(2)}</span>
    </div>
  </div>
);

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ orders, onBackToMenu }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-orbitron font-bold text-cyber-primary mb-8" style={{ textShadow: '0 0 8px #00f6ff' }}>
        Order Archives
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 px-8 bg-cyber-surface border border-cyber-border rounded-lg">
          <p className="text-xl text-gray-400 mb-6">No echoes of past orders found.</p>
          <button onClick={onBackToMenu} className="px-8 py-3 bg-gradient-to-r from-cyber-secondary to-purple-600 text-white font-bold rounded-md hover:shadow-glow-secondary transition-all transform hover:scale-105">
            Return to Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
          <div className="text-center pt-6">
             <button onClick={onBackToMenu} className="w-full max-w-xs text-center mt-4 text-cyber-primary/70 hover:text-cyber-primary transition-colors">
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
