
import React from 'react';
import type { CartItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon } from './IconComponents';

interface CheckoutPageProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onPlaceOrder: () => void;
  onBackToMenu: () => void;
}

const CheckoutItem: React.FC<{ item: CartItem; onUpdate: (id: number, q: number) => void }> = ({ item, onUpdate }) => (
    <div className="flex items-center justify-between p-4 bg-cyber-surface/50 rounded-lg border border-cyber-border mb-4">
        <div className="flex items-center">
            <img src={item.item.image} alt={item.item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
            <div>
                <h4 className="font-bold text-lg text-cyber-primary">{item.item.name}</h4>
                <p className="text-sm text-gray-400">{item.restaurant}</p>
                <p className="text-md font-bold text-cyber-accent">${(item.item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
        <div className="flex items-center space-x-3">
            <button onClick={() => onUpdate(item.item.id, item.quantity - 1)} className="p-1 rounded-full bg-cyber-secondary/50 hover:bg-cyber-secondary transition-colors"><MinusIcon className="w-4 h-4" /></button>
            <span className="font-orbitron text-lg w-8 text-center">{item.quantity}</span>
            <button onClick={() => onUpdate(item.item.id, item.quantity + 1)} className="p-1 rounded-full bg-cyber-primary/50 hover:bg-cyber-primary transition-colors"><PlusIcon className="w-4 h-4" /></button>
            <button onClick={() => onUpdate(item.item.id, 0)} className="p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors ml-2"><TrashIcon className="w-5 h-5" /></button>
        </div>
    </div>
);


const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onUpdateQuantity, onPlaceOrder, onBackToMenu }) => {
  const total = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-orbitron font-bold text-cyber-primary mb-8" style={{ textShadow: '0 0 8px #00f6ff' }}>
        Order Summary
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-16 px-8 bg-cyber-surface border border-cyber-border rounded-lg">
          <p className="text-xl text-gray-400 mb-6">Your cart is an empty void.</p>
          <button onClick={onBackToMenu} className="px-8 py-3 bg-gradient-to-r from-cyber-secondary to-purple-600 text-white font-bold rounded-md hover:shadow-glow-secondary transition-all transform hover:scale-105">
            Find Some Fuel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {cart.map(cartItem => (
                    <CheckoutItem key={cartItem.item.id} item={cartItem} onUpdate={onUpdateQuantity} />
                ))}
            </div>
            <div className="lg:col-span-1">
                <div className="p-6 bg-cyber-surface rounded-lg border border-cyber-border sticky top-24">
                    <h3 className="text-2xl font-orbitron text-cyber-secondary mb-4">Total</h3>
                    <div className="flex justify-between items-center text-3xl font-bold font-orbitron text-cyber-accent mb-6">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={onPlaceOrder}
                        className="w-full py-4 bg-gradient-to-r from-cyber-primary to-cyan-400 text-black font-orbitron uppercase tracking-widest rounded-md hover:shadow-glow-primary transition-all transform hover:scale-105"
                    >
                        Place Order
                    </button>
                    <button onClick={onBackToMenu} className="w-full text-center mt-4 text-cyber-primary/70 hover:text-cyber-primary transition-colors">
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
