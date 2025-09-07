
import React from 'react';
import type { CartItem, Restaurant } from '../types';
import MenuItem from './MenuItem';

interface MenuPageProps {
  menuData: Restaurant[];
  onAddToCart: (item: CartItem['item'], restaurant: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ menuData, onAddToCart }) => {
  return (
    <div className="space-y-12">
      {menuData.map((restaurant) => (
        <section key={restaurant.id} aria-labelledby={`restaurant-heading-${restaurant.id}`}>
          <div className="mb-6">
            <h2 id={`restaurant-heading-${restaurant.id}`} className="text-3xl md:text-4xl font-orbitron font-bold text-cyber-secondary tracking-wide" style={{ textShadow: '0 0 8px #ff00ff' }}>
              {restaurant.name}
            </h2>
            <p className="text-cyber-primary/80 mt-1">{restaurant.cuisine}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurant.items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onAddToCart={() => onAddToCart(item, restaurant.name)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuPage;
