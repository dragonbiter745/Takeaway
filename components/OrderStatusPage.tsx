import React, { useState, useEffect } from 'react';
import type { Order } from '../types';

interface OrderStatusPageProps {
  order: Order;
  onNewOrder: () => void;
}

const statusSteps = ['Pending', 'Preparing', 'Ready for Pickup'];

const OrderStatusPage: React.FC<OrderStatusPageProps> = ({ order, onNewOrder }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  
  useEffect(() => {
    if(currentStatus === 'Ready for Pickup') return;

    // FIX: Use ReturnType<typeof setTimeout> for timer IDs to be environment-agnostic (browser vs. Node). This resolves the 'Cannot find namespace NodeJS' error.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const preparingTimer = setTimeout(() => {
      setCurrentStatus('Preparing');
    }, 5000); // 5 seconds to Preparing

    const readyTimer = setTimeout(() => {
      setCurrentStatus('Ready for Pickup');
      if(Notification.permission === "granted"){
        new Notification("Your CyberEats order is ready!", {
          body: `Order #${order.id.split('-')[1]} is ready for pickup.`
        });
      }
    }, 12000); // 12 seconds to Ready

    timers.push(preparingTimer, readyTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const currentStepIndex = statusSteps.indexOf(currentStatus);

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-orbitron font-bold text-cyber-primary mb-4" style={{ textShadow: '0 0 8px #00f6ff' }}>
        Order Status
      </h2>
      <p className="text-gray-400 mb-8">Tracking Order: <span className="font-mono text-cyber-accent">{order.id}</span></p>

      <div className="p-8 bg-cyber-surface border border-cyber-border rounded-lg shadow-lg">
        {currentStatus === 'Ready for Pickup' && (
             <div className="p-4 mb-8 text-center bg-cyber-accent/20 border-2 border-cyber-accent rounded-lg animate-pulse">
                <h3 className="text-2xl font-orbitron text-cyber-accent font-bold">PING! Your Order is Ready!</h3>
                <p>Please proceed to the pickup point.</p>
            </div>
        )}
      
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-cyber-border -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-cyber-primary transition-all duration-500"
            style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>
          {statusSteps.map((step, index) => (
            <div key={step} className="z-10 text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto border-2 transition-all duration-500 ${
                  index <= currentStepIndex ? 'bg-cyber-primary border-cyber-primary text-black' : 'bg-cyber-surface border-cyber-border text-gray-400'
                }`}
              >
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <p className={`mt-2 text-sm font-bold transition-colors duration-500 ${index <= currentStepIndex ? 'text-cyber-primary' : 'text-gray-500'}`}>
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="text-left mt-10 p-4 bg-cyber-bg rounded-md">
            <h4 className="font-bold text-lg text-cyber-secondary mb-2">Order Details:</h4>
            <ul className="text-gray-300">
                {order.items.map(i => (
                    <li key={i.item.id} className="flex justify-between">
                        <span>{i.quantity}x {i.item.name}</span>
                        <span>${(i.item.price * i.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
             <hr className="my-2 border-cyber-border" />
            <div className="flex justify-between font-bold text-xl text-cyber-accent">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
            </div>
        </div>
      </div>
       <button 
        onClick={onNewOrder} 
        className="mt-12 px-8 py-3 bg-gradient-to-r from-cyber-secondary to-purple-600 text-white font-bold rounded-md hover:shadow-glow-secondary transition-all transform hover:scale-105"
      >
        Start New Order
      </button>
    </div>
  );
};

export default OrderStatusPage;