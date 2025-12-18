// Mock data for frontend-only implementation

export const mockPlans = [
  {
    id: '1',
    name: 'Starter',
    description: 'Perfect for small communities',
    price: 5.99,
    ram: '2GB',
    storage: '10GB SSD',
    slots: '10 Players',
    cpu: '1 vCore',
    backups: 'Daily',
    support: 'Email',
    featured: false
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Best for growing servers',
    price: 14.99,
    ram: '4GB',
    storage: '25GB SSD',
    slots: '50 Players',
    cpu: '2 vCores',
    backups: 'Twice Daily',
    support: '24/7 Priority',
    featured: true
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Maximum performance',
    price: 29.99,
    ram: '8GB',
    storage: '50GB NVMe',
    slots: 'Unlimited',
    cpu: '4 vCores',
    backups: 'Hourly',
    support: '24/7 Premium',
    featured: false
  }
];

export const mockFeatures = [
  {
    icon: 'Zap',
    title: 'Instant Setup',
    description: 'Your server is ready in under 60 seconds. No waiting, just gaming.'
  },
  {
    icon: 'Shield',
    title: 'DDoS Protection',
    description: 'Enterprise-grade protection keeps your server online 24/7.'
  },
  {
    icon: 'Database',
    title: 'SSD Storage',
    description: 'Lightning-fast NVMe SSDs for the best performance.'
  },
  {
    icon: 'Globe',
    title: 'Global Network',
    description: 'Low-latency servers in multiple locations worldwide.'
  },
  {
    icon: 'Clock',
    title: 'Automatic Backups',
    description: 'Your world is safe with automated daily backups.'
  },
  {
    icon: 'Headphones',
    title: '24/7 Support',
    description: 'Expert support team ready to help anytime you need.'
  }
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Alex Turner',
    role: 'Server Owner',
    content: 'Best hosting service I\'ve used. The control panel is intuitive and my server runs flawlessly!',
    rating: 5,
    avatar: 'AT'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Community Manager',
    content: 'Amazing uptime and support. Worth every penny for our 100+ player community.',
    rating: 5,
    avatar: 'SC'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Network Admin',
    content: 'The performance is incredible. Zero lag even with complex modpacks running.',
    rating: 5,
    avatar: 'MJ'
  }
];

export const mockFAQs = [
  {
    id: '1',
    question: 'How quickly can I get my server started?',
    answer: 'Your Minecraft server will be ready in less than 60 seconds after purchase. Just select your plan, and you\'re good to go!'
  },
  {
    id: '2',
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately.'
  },
  {
    id: '3',
    question: 'Do you support modded servers?',
    answer: 'Yes! We support all major mod loaders including Forge, Fabric, and Paper. You have full FTP access to customize your server.'
  },
  {
    id: '4',
    question: 'What about backups?',
    answer: 'All plans include automatic backups. Higher tier plans get more frequent backups. You can also create manual backups anytime.'
  },
  {
    id: '5',
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 7-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.'
  }
];

export const mockServers = [
  {
    id: 'server-1',
    name: 'Survival World',
    status: 'running',
    plan: 'Professional',
    players: '12/50',
    uptime: '99.9%',
    ip: 'mc.yourserver.com',
    port: '25565',
    version: '1.20.1',
    created: '2024-01-15'
  },
  {
    id: 'server-2',
    name: 'Creative Build',
    status: 'stopped',
    plan: 'Starter',
    players: '0/10',
    uptime: '98.5%',
    ip: 'creative.yourserver.com',
    port: '25566',
    version: '1.19.4',
    created: '2024-02-20'
  }
];

export const mockConsoleLogs = [
  '[12:00:01] [Server thread/INFO]: Starting minecraft server version 1.20.1',
  '[12:00:02] [Server thread/INFO]: Loading properties',
  '[12:00:03] [Server thread/INFO]: Preparing level "world"',
  '[12:00:05] [Server thread/INFO]: Done (2.5s)! For help, type "help"',
  '[12:00:15] [User Authenticator #1/INFO]: UUID of player Steve is 069a79f4-44e9-4726-a5be-fca90e38aaf5',
  '[12:00:15] [Server thread/INFO]: Steve joined the game'
];

export const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  avatar: 'JD'
};

export const mockAdmin = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  avatar: 'AU'
};