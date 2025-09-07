
import React from 'react';
import type { FoodItem } from '../types';

interface MenuItemProps {
  item: FoodItem;
  onAddToCart: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-cyber-surface border border-cyber-border transition-all duration-300 hover:border-cyber-primary hover:shadow-glow-primary transform hover:-translate-y-2">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="p-4">
        <h3 className="text-xl font-orbitron font-bold text-cyber-primary truncate">{item.name}</h3>
        <p className="text-gray-400 mt-1 h-10 text-sm overflow-hidden">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-cyber-accent">${item.price.toFixed(2)}</p>
          <button
            onClick={onAddToCart}
            className="px-4 py-2 border-2 border-cyber-accent text-cyber-accent font-bold rounded-md hover:bg-cyber-accent hover:text-black transition-all duration-300 transform group-hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
