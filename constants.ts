
import type { Restaurant } from './types';

export const foodItemsByRestaurant: Restaurant[] = [
  {
    id: 1,
    name: "Pixel Burger",
    cuisine: "Cyberpunk Burgers & Fries",
    items: [
      { id: 101, name: "Glitch Burger", description: "Wagyu beef, AI-optimized sauce, holographic cheese.", price: 15.99, image: "https://picsum.photos/seed/burger1/400/300" },
      { id: 102, name: "Data Dog", description: "Plasma-grilled sausage, quantum relish, nano-mustard.", price: 12.50, image: "https://picsum.photos/seed/hotdog1/400/300" },
      { id: 103, name: "Firewall Fries", description: "Crispy fries with a spicy, encrypted seasoning.", price: 6.99, image: "https://picsum.photos/seed/fries1/400/300" },
      { id: 104, name: "Coolant Shake", description: "A chillingly refreshing mint and chocolate shake.", price: 8.75, image: "https://picsum.photos/seed/shake1/400/300" },
    ]
  },
  {
    id: 2,
    name: "Neon Noodles",
    cuisine: "Futuristic Asian Fusion",
    items: [
      { id: 201, name: "Ramen Rider", description: "Pork belly in a rich tonkotsu broth that glows.", price: 18.00, image: "https://picsum.photos/seed/ramen1/400/300" },
      { id: 202, name: "Circuit Dumplings", description: "Pork and chive dumplings with a glowing chili oil.", price: 11.50, image: "https://picsum.photos/seed/dumplings1/400/300" },
      { id: 203, name: "Pad Thai-borg", description: "Classic pad thai with cybernetically enhanced shrimp.", price: 16.50, image: "https://picsum.photos/seed/padthai1/400/300" },
      { id: 204, name: "Synth-Tea", description: "Iced green tea infused with bioluminescent botanicals.", price: 5.99, image: "https://picsum.photos/seed/tea1/400/300" },
    ]
  },
  {
    id: 3,
    name: "Quantum Pizza",
    cuisine: "High-Tech Pizza",
    items: [
      { id: 301, name: "The Singularity", description: "A black-hole of flavor: squid ink dough, pepperoni, sausage.", price: 22.99, image: "https://picsum.photos/seed/pizza1/400/300" },
      { id: 302, name: "Matrix Margherita", description: "Classic margherita with a digital basil matrix.", price: 19.50, image: "https://picsum.photos/seed/pizza2/400/300" },
      { id: 303, name: "Photon Pepperoni", description: "Spicy pepperoni that tingles with energy.", price: 21.00, image: "https://picsum.photos/seed/pizza3/400/300" },
      { id: 304, name: "Gravity Knots", description: "Garlic knots that defy expectations.", price: 9.99, image: "https://picsum.photos/seed/knots1/400/300" },
    ]
  }
];
