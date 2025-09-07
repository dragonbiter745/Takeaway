
import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MenuPage from './components/MenuPage';
import CheckoutPage from './components/CheckoutPage';
import OrderStatusPage from './components/OrderStatusPage';
import Header from './components/Header';
import OrderHistoryPage from './components/OrderHistoryPage';
import { foodItemsByRestaurant } from './constants';
import type { CartItem, Order, User } from './types';
import { Page } from './types';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('cyberEatsOrderHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory).map((order: Order) => ({
          ...order,
          timestamp: new Date(order.timestamp),
          pickupTime: new Date(order.pickupTime),
        }));
        setOrderHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to load order history from localStorage", error);
    }
  }, []);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage(Page.Menu);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCart([]);
    setOrder(null);
    setCurrentPage(Page.Login);
  }, []);
  
  const handleAddToCart = useCallback((item: CartItem['item'], restaurant: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1, restaurant }];
      }
    });
  }, []);

  const handleUpdateQuantity = useCallback((itemId: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.item.id !== itemId);
      }
      return prevCart.map((item) =>
        item.item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (!user || cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const newOrder: Order = {
      id: `CYBER-${Date.now()}`,
      customerName: user.name,
      items: cart,
      status: 'Pending',
      timestamp: new Date(),
      pickupTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      total
    };
    
    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    try {
        localStorage.setItem('cyberEatsOrderHistory', JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save order to localStorage", error);
    }

    setOrder(newOrder);
    setCart([]);
    setCurrentPage(Page.OrderStatus);
  }, [user, cart, orderHistory]);

  const handleStartNewOrder = useCallback(() => {
    setOrder(null);
    setCurrentPage(Page.Menu);
  }, []);

  const handleShowHistory = useCallback(() => {
    setCurrentPage(Page.OrderHistory);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Login:
        return <LoginPage onLogin={handleLogin} />;
      case Page.Menu:
        return <MenuPage menuData={foodItemsByRestaurant} onAddToCart={handleAddToCart} />;
      case Page.Checkout:
        return <CheckoutPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onPlaceOrder={handlePlaceOrder} onBackToMenu={() => setCurrentPage(Page.Menu)} />;
      case Page.OrderStatus:
        return order && <OrderStatusPage order={order} onNewOrder={handleStartNewOrder} />;
      case Page.OrderHistory:
        return <OrderHistoryPage orders={orderHistory} onBackToMenu={() => setCurrentPage(Page.Menu)} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-cyber-bg min-h-screen font-poppins text-white antialiased">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(20,20,44,0.6),_rgba(10,10,26,0.9)),url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-50"></div>
      <div className="relative z-10">
        {currentPage !== Page.Login && user && (
          <Header 
            userName={user.name} 
            cartCount={cart.reduce((count, item) => count + item.quantity, 0)} 
            onCheckout={() => setCurrentPage(Page.Checkout)}
            onShowHistory={handleShowHistory}
            onLogout={handleLogout}
          />
        )}
        <main className="container mx-auto px-4 py-8 pt-24">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
