import React, { useState, useEffect, useContext, createContext, useMemo, useRef } from 'react';
import { 
  ShoppingCart, Search, User, Menu, X, Check, AlertCircle, 
  ChevronRight, Star, Heart, Trash2, LogOut, Package, CreditCard, 
  Truck, Filter, LayoutDashboard, Settings, Bell, RefreshCw, Home,
  Sparkles, MessageSquare, Send, Loader, MessageCircleWarning, HelpCircle,
  UploadCloud, FileText, ChevronDown, ChevronUp, Calendar, Download, Database, Save, RotateCcw
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  signOut, onAuthStateChanged, updateProfile, signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, query, where, getDocs, 
  doc, updateDoc, setDoc, deleteDoc, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';

// --- Configuration & Constants ---
const TEST_DELAY_MS = 600; // Simulated network latency for realism

// OPTION 2: Mock/Offline Mode Config (Use this if you don't have Firebase)
const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'quality-shop-demo';

// --- Gemini API Integration ---
// Replace with your actual key if you have one, or leave empty to see graceful degradation
const apiKey = ""; 

const callGemini = async (prompt: string, systemContext: string = '') => {
  try {
    const fullPrompt = systemContext ? `${systemContext}\n\nUser Query: ${prompt}` : prompt;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
  }
};

// --- Types ---
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
};

type CartItem = Product & { quantity: number };

type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'customer';
};

type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: any;
  shippingAddress: any;
};

// --- Mock Data & Seeding ---
const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Noise-Canceling Headphones', price: 299.99, category: 'Electronics', rating: 4.8, reviews: 124, stock: 45, image: '🎧', description: 'Industry leading noise cancellation.' },
  { id: 'p2', name: 'Ergonomic Office Chair', price: 189.50, category: 'Furniture', rating: 4.5, reviews: 89, stock: 12, image: '🪑', description: 'Comfort for long work hours.' },
  { id: 'p3', name: 'Organic Green Tea Bundle', price: 24.99, category: 'Groceries', rating: 4.9, reviews: 340, stock: 200, image: '🍵', description: 'Sourced directly from Japan.' },
  { id: 'p4', name: '4K Ultra HD Monitor', price: 450.00, category: 'Electronics', rating: 4.6, reviews: 56, stock: 8, image: '🖥️', description: 'Crystal clear display for professionals.' },
  { id: 'p5', name: 'Running Shoes - Speedster', price: 120.00, category: 'Apparel', rating: 4.3, reviews: 210, stock: 50, image: '👟', description: 'Lightweight design for marathon runners.' },
  { id: 'p6', name: 'Smart Fitness Watch', price: 199.99, category: 'Electronics', rating: 4.1, reviews: 78, stock: 30, image: '⌚', description: 'Track your health metrics 24/7.' },
  { id: 'p7', name: 'Minimalist Wooden Desk', price: 350.00, category: 'Furniture', rating: 4.7, reviews: 45, stock: 5, image: '🪵', description: 'Solid oak construction.' },
  { id: 'p8', name: 'Gourmet Coffee Beans', price: 18.99, category: 'Groceries', rating: 4.8, reviews: 560, stock: 150, image: '☕', description: 'Dark roast, arabica beans.' },
  // 20 Added Products
  { id: 'p9', name: 'Wireless Mechanical Keyboard', price: 129.99, category: 'Electronics', rating: 4.7, reviews: 88, stock: 25, image: '⌨️', description: 'Tactile switches for typing bliss.' },
  { id: 'p10', name: 'Yoga Mat - Non Slip', price: 35.00, category: 'Sports', rating: 4.4, reviews: 150, stock: 100, image: '🧘', description: 'Eco-friendly material.' },
  { id: 'p11', name: 'Stainless Steel Water Bottle', price: 25.00, category: 'Sports', rating: 4.9, reviews: 500, stock: 300, image: '💧', description: 'Keeps water cold for 24 hours.' },
  { id: 'p12', name: 'Bluetooth Speaker Mini', price: 45.99, category: 'Electronics', rating: 4.2, reviews: 65, stock: 40, image: '🔊', description: 'Powerful sound in a small package.' },
  { id: 'p13', name: 'Leather Wallet', price: 55.00, category: 'Apparel', rating: 4.6, reviews: 90, stock: 60, image: '👛', description: 'Genuine leather, classic design.' },
  { id: 'p14', name: 'Sunglasses - Aviator', price: 89.00, category: 'Apparel', rating: 4.5, reviews: 110, stock: 20, image: '🕶️', description: 'Polarized lenses for UV protection.' },
  { id: 'p15', name: 'Ceramic Plant Pot', price: 22.50, category: 'Home', rating: 4.8, reviews: 45, stock: 15, image: '🪴', description: 'Minimalist design for indoor plants.' },
  { id: 'p16', name: 'LED Desk Lamp', price: 39.99, category: 'Home', rating: 4.3, reviews: 70, stock: 55, image: '💡', description: 'Adjustable brightness and color temp.' },
  { id: 'p17', name: 'Digital Camera', price: 550.00, category: 'Electronics', rating: 4.7, reviews: 30, stock: 10, image: '📷', description: 'Capture life in high resolution.' },
  { id: 'p18', name: 'Backpack - Travel', price: 75.00, category: 'Apparel', rating: 4.6, reviews: 200, stock: 80, image: '🎒', description: 'Fits 15 inch laptop comfortably.' },
  { id: 'p19', name: 'Gaming Mouse', price: 65.00, category: 'Electronics', rating: 4.8, reviews: 150, stock: 45, image: '🖱️', description: 'High DPI precision sensor.' },
  { id: 'p20', name: 'Electric Toothbrush', price: 85.00, category: 'Health', rating: 4.5, reviews: 300, stock: 90, image: '🪥', description: 'Sonic technology for cleaner teeth.' },
  { id: 'p21', name: 'Tennis Racket', price: 110.00, category: 'Sports', rating: 4.4, reviews: 40, stock: 25, image: '🎾', description: 'Lightweight carbon fiber frame.' },
  { id: 'p22', name: 'Cookware Set', price: 199.00, category: 'Home', rating: 4.7, reviews: 85, stock: 15, image: '🍳', description: 'Non-stick coating, 10 pieces.' },
  { id: 'p23', name: 'Smart Thermostat', price: 149.00, category: 'Electronics', rating: 4.6, reviews: 120, stock: 35, image: '🌡️', description: 'Save energy with smart scheduling.' },
  { id: 'p24', name: 'Throw Pillow', price: 25.00, category: 'Home', rating: 4.3, reviews: 60, stock: 50, image: '🛋️', description: 'Soft velvet finish.' },
  { id: 'p25', name: 'Action Figure', price: 30.00, category: 'Toys', rating: 4.9, reviews: 400, stock: 10, image: '🦸', description: 'Limited edition collectible.' },
  { id: 'p26', name: 'Board Game - Strategy', price: 45.00, category: 'Toys', rating: 4.8, reviews: 250, stock: 60, image: '🎲', description: 'Fun for the whole family.' },
  { id: 'p27', name: 'Protein Powder', price: 55.00, category: 'Health', rating: 4.5, reviews: 500, stock: 120, image: '💪', description: 'Whey protein isolate, chocolate.' },
  { id: 'p28', name: 'Vitamin C Serum', price: 35.00, category: 'Health', rating: 4.6, reviews: 180, stock: 75, image: '🧴', description: 'Brightens skin tone.' },
];

// --- Contexts ---
const AuthContext = createContext<{
  user: UserProfile | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
}>({ user: null, loading: true, login: async () => {}, register: async () => {}, logout: async () => {} });

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  applyCoupon: (code: string) => boolean;
  coupon: string | null;
  discount: number;
}>({ cart: [], addToCart: () => {}, removeFromCart: () => {}, updateQuantity: () => {}, clearCart: () => {}, cartTotal: 0, itemCount: 0, applyCoupon: () => false, coupon: null, discount: 0 });

const ToastContext = createContext<{
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}>({ showToast: () => {} });

// --- Components ---

// 1. Toast Notification System
const ToastContainer = ({ toasts }: { toasts: any[] }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          data-test-id={`toast-${toast.type}`}
          className={`flex items-center p-4 rounded shadow-lg min-w-[300px] animate-slideIn pointer-events-auto ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {toast.type === 'success' && <Check size={18} className="mr-2" />}
          {toast.type === 'error' && <AlertCircle size={18} className="mr-2" />}
          {toast.type === 'info' && <Bell size={18} className="mr-2" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

// --- Test Data Manager ---
const TestDataManager = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { showToast } = useContext(ToastContext);

  const handleExport = () => {
    // 1. Collect Data: Grab all local storage keys that start with "mock_"
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mock_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          console.warn(`Skipping invalid JSON for key: ${key}`);
        }
      }
    }

    // 2. Create File
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 3. Trigger Download
    const a = document.createElement('a');
    a.href = url;
    a.download = `qualityshop_test_data_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Test data exported successfully', 'success');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Validation: Ensure it looks like our data schema
        const keys = Object.keys(data);
        if (keys.length === 0) {
          showToast('File appears empty or invalid', 'error');
          return;
        }

        // Restore Data
        keys.forEach(key => {
          if (key.startsWith('mock_')) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });

        showToast(`Successfully imported ${keys.length} data keys. Reloading...`, 'success');
        setTimeout(() => window.location.reload(), 1500); // Reload to reflect changes
      } catch (err) {
        console.error(err);
        showToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all mock orders, users, and returns.')) {
      // Clear only our app's keys to avoid messing with other playground apps
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mock_')) keysToRemove.push(key);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      showToast('Test data cleared. Reloading...', 'info');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-test-id="test-data-modal">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-slideUp">
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><Database size={18} className="text-amber-400"/> Test Data Manager</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white" data-test-id="close-test-modal"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
              <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Save size={16}/> Export State</h4>
              <p className="text-xs text-indigo-700 mb-3">Save current orders, users, and app state to a JSON file.</p>
              <button onClick={handleExport} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium transition-colors" data-test-id="export-data-btn">
                Download JSON
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2"><UploadCloud size={16}/> Import State</h4>
              <p className="text-xs text-emerald-700 mb-3">Restore app state from a previously exported JSON file.</p>
              <label className="block w-full cursor-pointer bg-white border border-emerald-300 text-emerald-700 py-2 rounded text-center text-sm font-medium hover:bg-emerald-50 transition-colors">
                Select File...
                <input type="file" accept=".json" className="hidden" onChange={handleImport} data-test-id="import-data-input"/>
              </label>
            </div>

            <div className="border-t pt-4">
              <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded text-sm transition-colors" data-test-id="reset-data-btn">
                <RotateCcw size={16}/> Reset All Test Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AI Components ---
const ShoppingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I\'m your AI Shopping Assistant. Ask me about our products or for gift ideas! ✨' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const productContext = `You are a helpful sales assistant for QualityShop. 
    Here is our product catalog: ${JSON.stringify(MOCK_PRODUCTS.slice(0, 10).map(p => ({name: p.name, price: p.price, category: p.category})))} (and more). 
    
    Rules:
    1. Only recommend products from the catalog.
    2. Be concise and friendly.`;

    const response = await callGemini(userMsg, productContext);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
        data-test-id="ai-chat-fab"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-40 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-slideUp"
          style={{ height: '500px', maxHeight: '80vh' }}
          data-test-id="ai-chat-window"
        >
          <div className="bg-slate-900 text-white p-4 flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} />
            <h3 className="font-bold">Gemini Assistant</h3>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} data-test-id={`chat-msg-${idx}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-slate-500 text-sm p-3">Thinking...</div>}
          </div>
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask..."
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-test-id="ai-chat-input"
              />
              <button onClick={handleSend} disabled={loading || !input.trim()} className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 disabled:opacity-50" data-test-id="ai-chat-send">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 2. Navigation Bar
const Navbar = ({ setView, view }: { setView: (v: string) => void, view: string }) => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')} data-test-id="nav-home-logo">
              <Package className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold tracking-tight">QualityShop<span className="text-indigo-400">.SUT</span></span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setView('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'home' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`} data-test-id="nav-products">Products</button>
                {user && <button onClick={() => setView('orders')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'orders' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`} data-test-id="nav-orders">Orders</button>}
                {user && <button onClick={() => setView('profile')} className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`} data-test-id="nav-profile">Profile</button>}
                {user?.role === 'admin' && <button onClick={() => setView('admin')} className="px-3 py-2 rounded-md text-sm font-medium text-amber-400 hover:text-amber-300" data-test-id="nav-admin">Admin</button>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsTestModalOpen(true)}
                className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-colors"
                title="Test Data Manager"
                data-test-id="test-data-btn"
              >
                <Database size={20} />
              </button>

              <div className="relative cursor-pointer p-2 hover:bg-slate-800 rounded-full" onClick={() => setView('cart')} data-test-id="cart-icon">
                <ShoppingCart className="h-6 w-6 text-slate-300" />
                {itemCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full" data-test-id="cart-count">{itemCount}</span>}
              </div>

              {user ? (
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-slate-300 hidden md:block" data-test-id="user-greeting">Hi, {user.displayName}</span>
                  <button onClick={() => logout()} className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full" data-test-id="nav-logout" title="Logout"><LogOut className="h-5 w-5" /></button>
                </div>
              ) : (
                <button onClick={() => setView('login')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" data-test-id="nav-login">Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <TestDataManager isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />
    </>
  );
};

// 3. Pagination Component
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }: any) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex gap-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded border ${currentPage === number ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
              data-test-id={`pagination-page-${number}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// 4. Product Catalog with Pagination
const ProductList = ({ setView, setCurrentProduct }: { setView: any, setCurrentProduct: any }) => {
  const { addToCart } = useContext(CartContext);
  const [filterCat, setFilterCat] = useState('All');
  const [priceRange, setPriceRange] = useState(1000);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('relevant');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCat = filterCat === 'All' || p.category === filterCat;
    const matchesPrice = p.price <= priceRange;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesPrice && matchesSearch;
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Get current posts
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const categories = ['All', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-test-id="product-list-page">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Filter size={18}/> Filters</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Keyword..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  data-test-id="search-input"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`cat-${cat}`} 
                      name="category" 
                      checked={filterCat === cat}
                      onChange={() => { setFilterCat(cat); setCurrentPage(1); }}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      data-test-id={`filter-category-${cat}`}
                    />
                    <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-slate-600 cursor-pointer">{cat}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price: ${priceRange}</label>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
                data-test-id="filter-price-slider"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Products ({filteredProducts.length})</h2>
            <select 
              className="border border-slate-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-test-id="sort-dropdown"
            >
              <option value="relevant">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {currentProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm" data-test-id="no-results-message">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-test-id="product-grid">
                {currentProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group" data-test-id={`product-card-${product.id}`}>
                    <div 
                      className="h-48 bg-slate-50 flex items-center justify-center text-6xl cursor-pointer group-hover:bg-indigo-50 transition-colors"
                      onClick={() => { setCurrentProduct(product); setView('detail'); }}
                      data-test-id={`product-image-${product.id}`}
                    >
                      {product.image}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="text-lg font-semibold text-slate-900 truncate cursor-pointer hover:text-indigo-600"
                          onClick={() => { setCurrentProduct(product); setView('detail'); }}
                          data-test-id={`product-title-${product.id}`}
                        >
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 ml-2">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-slate-900" data-test-id={`product-price-${product.id}`}>${product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors"
                          data-test-id={`add-to-cart-${product.id}`}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination itemsPerPage={itemsPerPage} totalItems={filteredProducts.length} paginate={paginate} currentPage={currentPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Returns View (File Uploads & Date Pickers)
const ReturnsView = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('damaged');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4" data-test-id="returns-page">
      <h2 className="text-2xl font-bold mb-6">File Return / Exchange</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order ID</label>
            <input type="text" className="w-full border p-2 rounded" value={orderId} onChange={(e) => setOrderId(e.target.value)} data-test-id="return-order-id" placeholder="e.g. #ORD-1234" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Purchase</label>
            <div className="relative">
              <input type="date" className="w-full border p-2 rounded pl-10" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} data-test-id="return-date-picker" />
              <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <select className="w-full border p-2 rounded" value={reason} onChange={(e) => setReason(e.target.value)} data-test-id="return-reason">
              <option value="damaged">Item Damaged</option>
              <option value="wrong">Wrong Item Sent</option>
              <option value="changed_mind">Changed Mind</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Proof (Image)</label>
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              data-test-id="file-upload-dropzone"
            >
              <input type="file" accept="image/*" className="hidden" id="file-upload" onChange={handleFileChange} data-test-id="file-upload-input" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-32 object-contain mb-2" data-test-id="file-preview-image" />
                ) : (
                  <UploadCloud className="h-12 w-12 text-slate-400 mb-2" />
                )}
                <span className="text-sm text-slate-600">{selectedFile ? selectedFile.name : "Drag & drop or click to upload"}</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" data-test-id="submit-return-btn">Submit Request</button>
        </div>
      </div>
    </div>
  );
};

// 6. Profile View (Tabs & Accordions)
const ProfileView = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-test-id="profile-page">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('details')}
          data-test-id="tab-details"
        >
          Account Details
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'returns' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('returns')}
          data-test-id="tab-returns"
        >
          Returns Center
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'settings' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('settings')}
          data-test-id="tab-settings"
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[400px]">
        {activeTab === 'details' && (
          <div className="p-6 animate-fadeIn" data-test-id="content-details">
            <h3 className="font-bold text-lg mb-4">Personal Information</h3>
            <div className="grid gap-4 max-w-md">
              <div>
                <label className="block text-sm text-slate-500">Full Name</label>
                <input type="text" value={user?.displayName || ''} readOnly className="w-full border p-2 rounded bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm text-slate-500">Email</label>
                <input type="text" value={user?.email || ''} readOnly className="w-full border p-2 rounded bg-slate-50" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'returns' && <ReturnsView />}

        {activeTab === 'settings' && (
          <div className="p-6 animate-fadeIn" data-test-id="content-settings">
            <h3 className="font-bold text-lg mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Accordion 1 */}
              <div className="border border-slate-200 rounded">
                <button 
                  className="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100"
                  onClick={() => toggleAccordion('notif')}
                  data-test-id="accordion-notif-header"
                >
                  <span className="font-medium">Email Notifications</span>
                  {openAccordion === 'notif' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {openAccordion === 'notif' && (
                  <div className="p-4 border-t border-slate-200" data-test-id="accordion-notif-content">
                     <div className="space-y-2">
                       <label className="flex items-center gap-2">
                         <input type="checkbox" defaultChecked data-test-id="check-order-updates"/> Order Updates
                       </label>
                       <label className="flex items-center gap-2">
                         <input type="checkbox" data-test-id="check-promos"/> Promotions
                       </label>
                     </div>
                  </div>
                )}
              </div>
              
              {/* Accordion 2 */}
              <div className="border border-slate-200 rounded">
                <button 
                  className="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100"
                  onClick={() => toggleAccordion('privacy')}
                  data-test-id="accordion-privacy-header"
                >
                  <span className="font-medium">Privacy & Data</span>
                  {openAccordion === 'privacy' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {openAccordion === 'privacy' && (
                  <div className="p-4 border-t border-slate-200" data-test-id="accordion-privacy-content">
                     <p className="text-sm text-slate-600 mb-2">Manage how your data is used.</p>
                     <button className="text-red-600 text-sm hover:underline">Delete My Account</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartView = ({ setView }: { setView: any }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, applyCoupon, coupon, discount } = useContext(CartContext);
  const [couponInput, setCouponInput] = useState('');
  const [error, setError] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      setCouponInput('');
      setError('');
    } else {
      setError('Invalid coupon code');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <button 
          onClick={() => setView('home')}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          data-test-id="continue-shopping-btn"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-test-id="cart-view">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4" data-test-id={`cart-item-${item.id}`}>
              <div className="h-20 w-20 bg-slate-100 rounded flex items-center justify-center text-3xl">
                {item.image}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                <p className="text-slate-500 text-sm">{item.category}</p>
                <div className="text-indigo-600 font-medium mt-1">${item.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                  data-test-id={`qty-minus-${item.id}`}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium" data-test-id={`qty-val-${item.id}`}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                  data-test-id={`qty-plus-${item.id}`}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2"
                data-test-id={`remove-${item.id}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span data-test-id="cart-subtotal">${cartTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
               <div className="flex justify-between text-green-600">
               <span>Discount ({coupon})</span>
               <span data-test-id="cart-discount">-${discount.toFixed(2)}</span>
             </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg text-slate-900">
              <span>Total</span>
              <span data-test-id="cart-total">${(cartTotal - discount).toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Coupon Code"
                className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                data-test-id="coupon-input"
              />
              <button 
                onClick={handleApplyCoupon}
                className="bg-slate-800 text-white px-3 py-2 rounded text-sm hover:bg-slate-700"
                data-test-id="coupon-btn"
              >
                Apply
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1" data-test-id="coupon-error">{error}</p>}
            {coupon && <p className="text-green-600 text-xs mt-1" data-test-id="coupon-success">Coupon applied!</p>}
          </div>

          <button 
            onClick={() => setView('checkout')}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            data-test-id="checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckoutView = ({ setView }: { setView: any }) => {
  const { cart, cartTotal, discount, clearCart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  const [shipping, setShipping] = useState({
    fullName: user?.displayName || '', address: '', city: '', zip: '', country: 'US'
  });
  
  const [payment, setPayment] = useState({
    cardNum: '', expiry: '', cvv: '', name: ''
  });

  if (cart.length === 0) return <div className="p-10 text-center">Cart is empty. Redirecting... {setTimeout(() => setView('home'), 1000) && ''}</div>;

  const validateStep1 = () => shipping.fullName && shipping.address && shipping.city && shipping.zip;
  const validateStep2 = () => payment.cardNum.length >= 16 && payment.cvv.length === 3;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));

    try {
      if (user) {
        // Handle Mock Users (save to localStorage)
        if (user.uid.startsWith('mock-')) {
           console.log("Mock user order placed in memory");
           const mockOrder = {
             id: 'ord-' + Date.now(),
             userId: user.uid,
             items: cart,
             total: cartTotal - discount,
             status: 'pending',
             date: new Date().toISOString(), // Use string for local storage
             shippingAddress: shipping
           };
           
           // Fetch existing mock orders
           const existing = localStorage.getItem(`mock_orders_${user.uid}`);
           const orders = existing ? JSON.parse(existing) : [];
           orders.push(mockOrder);
           localStorage.setItem(`mock_orders_${user.uid}`, JSON.stringify(orders));
        } else {
           // Handle Real Users (save to Firestore)
           await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'orders'), {
             items: cart,
             total: cartTotal - discount,
             status: 'pending',
             date: serverTimestamp(),
             shippingAddress: shipping
           });
        }
      }
      showToast('Order placed successfully!', 'success');
      clearCart();
      setView('order-success');
    } catch (e) {
      console.error(e);
      showToast('Failed to place order. Try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-test-id="checkout-page">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-10 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex flex-col items-center bg-white px-2`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`} data-test-id={`step-indicator-${i}`}>
              {i}
            </div>
            <span className="text-xs mt-1 text-slate-500 font-medium">
              {i === 1 ? 'Shipping' : i === 2 ? 'Payment' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 min-h-[400px]">
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" className="w-full border p-2 rounded" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} data-test-id="shipping-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input type="text" className="w-full border p-2 rounded" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} data-test-id="shipping-address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input type="text" className="w-full border p-2 rounded" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} data-test-id="shipping-city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                  <input type="text" className="w-full border p-2 rounded" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} data-test-id="shipping-zip" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!validateStep1()}
                onClick={() => setStep(2)}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-test-id="step1-next-btn"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            <div className="bg-slate-50 p-4 rounded mb-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-slate-500" />
                <span className="font-medium">Credit or Debit Card</span>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  maxLength={16}
                  className="w-full border p-2 rounded" 
                  value={payment.cardNum} 
                  onChange={e => setPayment({...payment, cardNum: e.target.value.replace(/\D/g,'')})} 
                  data-test-id="payment-card-num" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full border p-2 rounded" 
                    value={payment.expiry} 
                    onChange={e => setPayment({...payment, expiry: e.target.value})} 
                    data-test-id="payment-expiry" 
                  />
                  <input 
                    type="password" 
                    placeholder="CVV" 
                    maxLength={3}
                    className="w-full border p-2 rounded" 
                    value={payment.cvv} 
                    onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/g,'')})} 
                    data-test-id="payment-cvv" 
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-slate-600 hover:text-slate-900" data-test-id="step2-back-btn">Back</button>
              <button 
                disabled={!validateStep2()}
                onClick={() => setStep(3)}
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                data-test-id="step2-next-btn"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">Review Order</h2>
            <div className="space-y-4 mb-6 text-sm text-slate-600">
              <div className="bg-slate-50 p-3 rounded" data-test-id="review-shipping">
                <p className="font-bold text-slate-800">Shipping To:</p>
                <p>{shipping.fullName}</p>
                <p>{shipping.address}, {shipping.city} {shipping.zip}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded" data-test-id="review-items">
                <p className="font-bold text-slate-800 mb-2">Items:</p>
                {cart.map(i => (
                  <div key={i.id} className="flex justify-between mb-1">
                    <span>{i.quantity}x {i.name}</span>
                    <span>${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
                <span>Total</span>
                <span data-test-id="review-total">${(cartTotal - discount).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="text-slate-600 hover:text-slate-900" data-test-id="step3-back-btn">Back</button>
              <button 
                onClick={handlePlaceOrder}
                disabled={processing}
                className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                data-test-id="place-order-btn"
              >
                {processing ? <RefreshCw className="animate-spin h-4 w-4"/> : <Check className="h-4 w-4"/>}
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthView = ({ mode, setView }: { mode: 'login' | 'register', setView: any }) => {
  const { login, register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      setView('home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200" data-test-id={`${mode}-form`}>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {mode === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm flex items-center gap-2" data-test-id="auth-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                data-test-id="input-name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              data-test-id="input-email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              minLength={6}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              data-test-id="input-password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            data-test-id="auth-submit-btn"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          {mode === 'login' ? (
            <p>Don't have an account? <span onClick={() => setView('register')} className="text-indigo-600 font-medium cursor-pointer hover:underline" data-test-id="link-to-register">Register here</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setView('login')} className="text-indigo-600 font-medium cursor-pointer hover:underline" data-test-id="link-to-login">Login here</span></p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500">
          <p className="font-bold mb-1">Demo Credentials:</p>
          <p>User: user@test.com / password123</p>
          <p>Admin: admin@test.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Logic ---

function App() {
  const [view, setView] = useState('home'); // Simple routing state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);
  
  // AI State
  const [aiInsight, setAiInsight] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Clear AI insight when changing products
  useEffect(() => {
    setAiInsight('');
  }, [currentProduct]);

  const generateProductInsight = async () => {
    if (!currentProduct) return;
    setAiLoading(true);
    const prompt = `Generate a 2-sentence summary of why customers love the "${currentProduct.name}". 
    The product has a rating of ${currentProduct.rating} stars. 
    Mention its key feature: "${currentProduct.description}". 
    Start with "Customers love this because..."`;
    
    const text = await callGemini(prompt);
    setAiInsight(text);
    setAiLoading(false);
  };

  // Auth Effect
  useEffect(() => {
    const initAuth = async () => {
      // If we have a custom token provided by the environment, use it
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        // In a real scenario we'd use signInWithCustomToken here, but for this demo 
        // we'll rely on anonymous if token fails or just anonymous generally for guests
        // For the sake of the SUT demo, we want clear user states, so we'll listen to auth state
      } else {
        // Optional: Sign in anonymously to ensure DB access if rules require auth
        // await signInAnonymously(auth);
      }
    };
    initAuth();

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch custom role if stored in DB, otherwise guess based on email for demo
        const role = u.email?.includes('admin') ? 'admin' : 'customer';
        setUser({ uid: u.uid, email: u.email, displayName: u.displayName, role });
      } else if (!user) {
        // Don't clear mock user if auth state changes to null (unless explicit logout)
        // But for simplicity in this hybrid mode, real auth always takes precedence.
        // If we are in mock mode, setUser was called manually.
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Auth Actions
  const authActions = useMemo(() => ({
    user,
    loading: authLoading,
    login: async (e: string, p: string) => {
      await new Promise(r => setTimeout(r, TEST_DELAY_MS)); // Artificial delay
      try {
        await signInWithEmailAndPassword(auth, e, p);
        showToast('Logged in successfully', 'success');
      } catch (err: any) {
        // --- MOCK MODE FIX ---
        // Catch ANY error (invalid key, network error, etc.) and fallback to mock user
        console.warn("Backend auth failed, switching to Mock Mode:", err.code);
        
        const mockRole = e.includes('admin') ? 'admin' : 'customer';
        const mockName = e.split('@')[0];
        // Generate a simple mock ID
        const uid = 'mock-' + e.replace(/[^a-zA-Z0-9]/g, '');
        
        setUser({ uid, email: e, displayName: mockName, role: mockRole });
        showToast('Mock Login Active (Offline Mode)', 'info');
      }
    },
    register: async (e: string, p: string, n: string) => {
      await new Promise(r => setTimeout(r, TEST_DELAY_MS));
      try {
        const cred = await createUserWithEmailAndPassword(auth, e, p);
        await updateProfile(cred.user, { displayName: n });
        showToast('Account created', 'success');
      } catch (err: any) {
        // --- MOCK MODE FIX ---
        // Catch ANY error and fallback to mock user
        console.warn("Backend registration failed, switching to Mock Mode:", err.code);
        
        const uid = 'mock-' + e.replace(/[^a-zA-Z0-9]/g, '');
        setUser({ uid, email: e, displayName: n, role: 'customer' });
        showToast('Mock Registration Active (Offline Mode)', 'info');
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
      } catch (e) {
        // Ignore errors on mock logout
      }
      setUser(null);
      setView('home');
      showToast('Logged out', 'info');
    }
  }), [user, authLoading]);

  // Cart Logic
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const cartActions = useMemo(() => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return {
      cart,
      itemCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      cartTotal: total,
      discount,
      coupon,
      addToCart: (p: Product) => {
        setCart(prev => {
          const exists = prev.find(i => i.id === p.id);
          if (exists) return prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
          return [...prev, { ...p, quantity: 1 }];
        });
        showToast(`Added ${p.name} to cart`, 'success');
      },
      removeFromCart: (id: string) => setCart(prev => prev.filter(i => i.id !== id)),
      updateQuantity: (id: string, delta: number) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
      },
      clearCart: () => { setCart([]); setCoupon(null); setDiscount(0); },
      applyCoupon: (code: string) => {
        if (code === 'TEST20') {
          setCoupon('TEST20');
          setDiscount(total * 0.2);
          return true;
        }
        return false;
      }
    };
  }, [cart, coupon, discount]);

  // View Routing
  const renderView = () => {
    if (authLoading) return <div className="flex h-screen items-center justify-center"><RefreshCw className="animate-spin text-indigo-600"/></div>;

    switch (view) {
      case 'home': return <ProductList setView={setView} setCurrentProduct={setCurrentProduct} />;
      case 'cart': return <CartView setView={setView} />;
      case 'checkout': return <CheckoutView setView={setView} />;
      case 'login': return <AuthView mode="login" setView={setView} />;
      case 'register': return <AuthView mode="register" setView={setView} />;
      case 'profile': return <ProfileView user={user} />;
      case 'detail': 
        return currentProduct ? (
          <div className="max-w-7xl mx-auto px-4 py-10" data-test-id="product-detail-page">
            <button onClick={() => setView('home')} className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 gap-1" data-test-id="back-to-products">
              <ChevronRight className="rotate-180" size={16}/> Back to Products
            </button>
            <div className="flex flex-col md:flex-row gap-10 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
              <div className="w-full md:w-1/2 h-96 bg-slate-50 flex items-center justify-center text-9xl rounded-lg" data-test-id="main-product-image">
                {currentProduct.image}
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-slate-900" data-test-id="product-title">{currentProduct.name}</h1>
                  <button className="p-2 text-slate-400 hover:text-red-500" data-test-id="wishlist-btn"><Heart /></button>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex text-amber-400"><Star fill="currentColor" size={20}/> <span className="text-slate-700 font-bold ml-1">{currentProduct.rating}</span></div>
                   <span className="text-slate-400">|</span>
                   <span className="text-indigo-600">{currentProduct.reviews} reviews</span>
                </div>
                <p className="text-slate-600 text-lg">{currentProduct.description}</p>
                
                {/* AI Insight Section */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      <Sparkles size={16} className="text-indigo-600" /> AI Insights
                    </h3>
                    {!aiInsight && (
                      <button 
                        onClick={generateProductInsight}
                        disabled={aiLoading}
                        className="text-xs bg-white text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-1"
                        data-test-id="generate-insight-btn"
                      >
                         {aiLoading ? <Loader size={12} className="animate-spin"/> : <Sparkles size={12}/>} 
                         Summarize Reviews
                      </button>
                    )}
                  </div>
                  
                  {aiLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-2 bg-indigo-200 rounded w-3/4"></div>
                      <div className="h-2 bg-indigo-200 rounded w-1/2"></div>
                    </div>
                  ) : aiInsight ? (
                    <p className="text-sm text-indigo-800 italic" data-test-id="ai-insight-text">
                      "{aiInsight}"
                    </p>
                  ) : (
                    <p className="text-xs text-indigo-400">
                      Tap the button to generate a summary of what customers are saying about this product using Gemini AI.
                    </p>
                  )}
                </div>

                <div className="text-3xl font-bold text-slate-900 py-4" data-test-id="product-price">${currentProduct.price.toFixed(2)}</div>
                
                <div className="flex gap-4 pt-4 border-t">
                  <button 
                    onClick={() => cartActions.addToCart(currentProduct)}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-lg font-bold hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                    data-test-id="add-to-cart-btn"
                  >
                    <ShoppingCart /> Add to Cart
                  </button>
                </div>
                <div className="text-sm text-green-600 flex items-center gap-2 pt-2">
                  <Check size={16} /> In Stock ({currentProduct.stock} units)
                </div>
              </div>
            </div>
          </div>
        ) : <ProductList setView={setView} setCurrentProduct={setCurrentProduct} />;
      case 'order-success':
        return (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn" data-test-id="order-success-page">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 mb-8">Thank you for your purchase. Your order is being processed.</p>
            <div className="flex gap-4">
              <button onClick={() => setView('orders')} className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50" data-test-id="view-orders-btn">View Orders</button>
              <button onClick={() => setView('home')} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" data-test-id="continue-shopping-btn">Continue Shopping</button>
            </div>
          </div>
        );
      case 'orders':
        return <OrdersView user={user} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <div className="p-10 text-center text-red-500">Access Denied</div>;
      default: return <ProductList setView={setView} setCurrentProduct={setCurrentProduct} />;
    }
  };

  return (
    <AuthContext.Provider value={authActions}>
      <CartContext.Provider value={cartActions}>
        <ToastContext.Provider value={{ showToast }}>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
            <Navbar setView={setView} view={view} />
            <main className="pb-20">
              {renderView()}
            </main>
            <ToastContainer toasts={toasts} />
            <ShoppingAssistant />
            
            <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="mb-2">© 2025 QualityShop SUT. Built for Automation Testing.</p>
                <p className="text-sm">Use <code className="text-amber-400">data-test-id</code> attributes for all selectors.</p>
              </div>
            </footer>
          </div>
        </ToastContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

// 7. Orders View
const OrdersView = ({ user }: { user: UserProfile | null }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [complaintOrder, setComplaintOrder] = useState<string | null>(null);

  useEffect(() => {
    // FIX: Handle case where user is not logged in or session lost (e.g. refresh on mock user)
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true); // Ensure loading starts
      
      // Mock user handling: fetch from localStorage
      if (user.uid.startsWith('mock-')) {
          const stored = localStorage.getItem(`mock_orders_${user.uid}`);
          if (stored) {
             setOrders(JSON.parse(stored).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          } else {
             setOrders([]);
          }
          setLoading(false);
          return;
      }

      try {
        const q = query(collection(db, 'artifacts', appId, 'users', user.uid, 'orders'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (err) {
        console.warn("Could not fetch orders (likely permission or mock user):", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={32} />
      <p className="text-slate-500">Loading your orders...</p>
    </div>
  );

  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="h-8 w-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Please Log In</h2>
      <p className="text-slate-500 mb-6">You need to be logged in to view your order history.</p>
    </div>
  );

  const downloadInvoice = (orderId: string) => {
    // Mock PDF Download
    const element = document.createElement("a");
    const file = new Blob([`Invoice for Order #${orderId}\nTotal: $${orders.find(o => o.id === orderId)?.total}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Invoice_${orderId}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-test-id="orders-history-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1" data-test-id="general-support-btn">
           <HelpCircle size={16}/> General Support
        </button>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200" data-test-id="empty-orders-state">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No orders found.</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm" data-test-id={`order-card-${order.id}`}>
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <div>
                <p className="font-bold text-sm text-slate-500">ORDER ID</p>
                <p className="font-mono text-slate-800">#{order.id.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-slate-500">STATUS</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize" data-test-id={`order-status-${order.id}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <div className="flex items-center gap-2">
                 <span>Total</span>
                 <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => downloadInvoice(order.id)}
                   className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium px-3 py-1 rounded hover:bg-indigo-50 transition-colors"
                   data-test-id={`download-invoice-${order.id}`}
                 >
                   <Download size={14}/> Invoice
                 </button>
                 <button 
                   onClick={() => setComplaintOrder(order.id)}
                   className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                   data-test-id={`report-issue-${order.id}`}
                 >
                   <MessageCircleWarning size={14}/> Report Issue
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complaint Modal */}
      {complaintOrder && (
        <ComplaintModal 
          orderId={complaintOrder} 
          onClose={() => setComplaintOrder(null)} 
        />
      )}
    </div>
  );
};

// 8. Admin Dashboard (Basic)
const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });

  useEffect(() => {
    // Calculate dynamic stats from localStorage for mock users
    let totalRev = 0;
    let totalOrd = 0;
    let uniqueUsers = new Set();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mock_orders_')) {
        const uid = key.replace('mock_orders_', '');
        uniqueUsers.add(uid);
        try {
          const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
          totalOrd += userOrders.length;
          totalRev += userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        } catch (e) { console.error(e); }
      }
    }

    setStats({
      revenue: totalRev,
      orders: totalOrd,
      users: uniqueUsers.size > 0 ? uniqueUsers.size : 1203 // Default fallback
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" data-test-id="admin-dashboard">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><LayoutDashboard/> Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200" data-test-id="stat-card-revenue">
          <h3 className="text-slate-500 text-sm font-bold uppercase">Total Revenue</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">${stats.revenue.toFixed(2)}</p>
          <span className="text-green-500 text-sm">Real-time (Mock DB)</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200" data-test-id="stat-card-orders">
          <h3 className="text-slate-500 text-sm font-bold uppercase">Active Orders</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200" data-test-id="stat-card-users">
          <h3 className="text-slate-500 text-sm font-bold uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.users}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50">
          <h3 className="font-bold text-slate-700">Recent System Events</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50">
            <tr>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-4">New Order Placed</td>
              <td className="px-6 py-4">user@test.com</td>
              <td className="px-6 py-4 text-green-600">Success</td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-4">Login Attempt</td>
              <td className="px-6 py-4">admin@test.com</td>
              <td className="px-6 py-4 text-green-600">Success</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Failed Payment</td>
              <td className="px-6 py-4">guest_882</td>
              <td className="px-6 py-4 text-red-600">Failed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;