
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
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const savedUserJSON = localStorage.getItem('cyberEatsUser');
      if (savedUserJSON) {
        try {
          const savedUser: User = JSON.parse(savedUserJSON);
          setUser(savedUser);
          // Fetch history silently for the saved user
          await fetchOrderHistory(savedUser.id, false);
          setCurrentPage(Page.Menu);
        } catch (error) {
          console.error("Failed to parse saved user data, clearing.", error);
          localStorage.removeItem('cyberEatsUser');
        }
      }
      setIsInitializing(false);
    };

    checkLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderHistory = async (userId: number, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch order history');
      const historyData = await response.json();
      const parsedHistory = historyData.map((order: any) => ({
        ...order,
        timestamp: new Date(order.timestamp),
        pickupTime: new Date(order.pickupTime),
      }));
      setOrderHistory(parsedHistory);
    } catch (error) {
      console.error("Failed to load order history from API", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleLogin = useCallback(async (loggedInUser: Omit<User, 'id'>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loggedInUser),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const userWithId: User = await response.json();
      setUser(userWithId);
      localStorage.setItem('cyberEatsUser', JSON.stringify(userWithId));
      await fetchOrderHistory(userWithId.id);
      setCurrentPage(Page.Menu);
    } catch (error) {
      console.error('Login error:', error);
      // Here you could set an error state to show in the UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('cyberEatsUser');
    setUser(null);
    setCart([]);
    setOrder(null);
    setOrderHistory([]);
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

  const handlePlaceOrder = useCallback(async () => {
    if (!user || cart.length === 0) return;
    setIsLoading(true);

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
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, order: newOrder }),
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        
        setOrderHistory(prevHistory => [newOrder, ...prevHistory]);
        setOrder(newOrder);
        setCart([]);
        setCurrentPage(Page.OrderStatus);

    } catch (error) {
        console.error("Failed to save order via API", error);
    } finally {
        setIsLoading(false);
    }
  }, [user, cart]);

  const handleStartNewOrder = useCallback(() => {
    setOrder(null);
    setCurrentPage(Page.Menu);
  }, []);

  const handleShowHistory = useCallback(() => {
    if (user) {
        // Re-fetch history every time to ensure it's up to date
        fetchOrderHistory(user.id); 
        setCurrentPage(Page.OrderHistory);
    }
  }, [user]);

  const renderPage = () => {
    if (isInitializing) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyber-primary"></div>
        </div>
      );
    }
    
    switch (currentPage) {
      case Page.Login:
        return <LoginPage onLogin={handleLogin} isLoading={isLoading}/>;
      case Page.Menu:
        return <MenuPage menuData={foodItemsByRestaurant} onAddToCart={handleAddToCart} />;
      case Page.Checkout:
        return <CheckoutPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onPlaceOrder={handlePlaceOrder} onBackToMenu={() => setCurrentPage(Page.Menu)} />;
      case Page.OrderStatus:
        return order && <OrderStatusPage order={order} onNewOrder={handleStartNewOrder} />;
      case Page.OrderHistory:
        return <OrderHistoryPage orders={orderHistory} onBackToMenu={() => setCurrentPage(Page.Menu)} />;
      default:
        return <LoginPage onLogin={handleLogin} isLoading={isLoading} />;
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
