// --- 1. MOCK DATA ---
        const MOCK_PRODUCTS = [
            { id: 'p1', name: 'Premium Noise-Canceling Headphones', price: 299.99, category: 'Electronics', rating: 4.8, reviews: 124, stock: 45, image: '🎧', description: 'Industry leading noise cancellation.' },
            { id: 'p2', name: 'Ergonomic Office Chair', price: 189.50, category: 'Furniture', rating: 4.5, reviews: 89, stock: 12, image: '🪑', description: 'Comfort for long work hours.' },
            { id: 'p3', name: 'Organic Green Tea Bundle', price: 24.99, category: 'Groceries', rating: 4.9, reviews: 340, stock: 200, image: '🍵', description: 'Sourced directly from Japan.' },
            { id: 'p4', name: '4K Ultra HD Monitor', price: 450.00, category: 'Electronics', rating: 4.6, reviews: 56, stock: 8, image: '🖥️', description: 'Crystal clear display for professionals.' },
            { id: 'p5', name: 'Running Shoes - Speedster', price: 120.00, category: 'Apparel', rating: 4.3, reviews: 210, stock: 50, image: '👟', description: 'Lightweight design for marathon runners.' },
            { id: 'p6', name: 'Smart Fitness Watch', price: 199.99, category: 'Electronics', rating: 4.1, reviews: 78, stock: 30, image: '⌚', description: 'Track your health metrics 24/7.' },
            { id: 'p7', name: 'Minimalist Wooden Desk', price: 350.00, category: 'Furniture', rating: 4.7, reviews: 45, stock: 5, image: '🪵', description: 'Solid oak construction.' },
            { id: 'p8', name: 'Gourmet Coffee Beans', price: 18.99, category: 'Groceries', rating: 4.8, reviews: 560, stock: 150, image: '☕', description: 'Dark roast, arabica beans.' },
            { id: 'p9', name: 'Wireless Mechanical Keyboard', price: 129.99, category: 'Electronics', rating: 4.7, reviews: 88, stock: 25, image: '⌨️', description: 'Tactile switches for typing bliss.' },
            { id: 'p10', name: 'Yoga Mat - Non Slip', price: 35.00, category: 'Sports', rating: 4.4, reviews: 150, stock: 100, image: '🧘', description: 'Eco-friendly material.' },
            { id: 'p11', name: 'Stainless Steel Water Bottle', price: 25.00, category: 'Sports', rating: 4.9, reviews: 500, stock: 300, image: '💧', description: 'Keeps water cold for 24 hours.' },
            { id: 'p12', name: 'Bluetooth Speaker Mini', price: 45.99, category: 'Electronics', rating: 4.2, reviews: 65, stock: 40, image: '🔊', description: 'Powerful sound in a small package.' },
            { id: 'p13', name: 'Leather Wallet', price: 55.00, category: 'Apparel', rating: 4.6, reviews: 90, stock: 60, image: '👛', description: 'Genuine leather, classic design.' },
            { id: 'p14', name: 'Sunglasses - Aviator', price: 89.00, category: 'Apparel', rating: 4.5, reviews: 110, stock: 20, image: '🕶️', description: 'Polarized lenses for UV protection.' },
            { id: 'p15', name: 'Ceramic Plant Pot', price: 22.50, category: 'Home', rating: 4.8, reviews: 45, stock: 15, image: '🪴', description: 'Minimalist design for indoor plants.' }
        ];

        // --- 2. STATE MANAGEMENT ---
        const State = {
            user: null, 
            cart: [], 
            view: 'home', 
            currentProduct: null,
            filters: { category: 'All', price: 1000, search: '' },
            pagination: { page: 1, itemsPerPage: 9 },
            checkoutStep: 1,
            profileTab: 'details',
            openAccordion: null,
            chatOpen: false,
            chatMessages: [{role: 'ai', text: 'Hi! I\'m your AI Shopping Assistant. Ask me about our products! ✨'}],
            returns: { file: null, preview: null, date: '', reason: 'damaged', orderId: '' }
        };

        // --- 3. ACTIONS ---
        const Actions = {
            updateUI: () => {
                renderNavbar();
                renderMainContent();
                renderAIAssistant();
                lucide.createIcons();
            },
            setView: (view, product = null) => {
                State.view = view;
                if (product) State.currentProduct = product;
                Actions.updateUI();
                window.scrollTo(0, 0);
            },
            addToCart: (product) => {
                const existing = State.cart.find(i => i.id === product.id);
                if (existing) existing.quantity++;
                else State.cart.push({ ...product, quantity: 1 });
                showToast(`Added ${product.name} to cart`, 'success');
                Actions.updateUI();
            },
            removeFromCart: (id) => {
                State.cart = State.cart.filter(i => i.id !== id);
                Actions.updateUI();
            },
            updateQuantity: (id, delta) => {
                const item = State.cart.find(i => i.id === id);
                if (item) {
                    item.quantity = Math.max(1, item.quantity + delta);
                    Actions.updateUI();
                }
            },
            loginMock: (email) => {
                const uid = 'mock-' + email.replace(/[^a-zA-Z0-9]/g, '');
                const name = email.split('@')[0];
                const role = email.includes('admin') ? 'admin' : 'customer';
                State.user = { uid, email, displayName: name, role };
                State.view = 'home';
                showToast(`Welcome back, ${name}! (Mock Mode)`, 'success');
                Actions.updateUI();
            },
            logout: () => {
                State.user = null;
                State.view = 'home';
                State.cart = [];
                showToast('Logged out', 'info');
                Actions.updateUI();
            },
            setFilter: (key, value) => {
                State.filters[key] = value;
                State.pagination.page = 1;
                Actions.updateUI();
            },
            setPage: (num) => {
                State.pagination.page = num;
                Actions.updateUI();
            },
            setProfileTab: (tab) => {
                State.profileTab = tab;
                Actions.updateUI();
            },
            toggleAccordion: (id) => {
                State.openAccordion = State.openAccordion === id ? null : id;
                Actions.updateUI();
            },
            toggleChat: () => {
                State.chatOpen = !State.chatOpen;
                Actions.updateUI();
            },
            sendChatMessage: async () => {
                const input = document.getElementById('chat-input');
                const text = input.value.trim();
                if(!text) return;
                
                State.chatMessages.push({role: 'user', text});
                input.value = '';
                Actions.updateUI();

                // Mock AI Response
                setTimeout(() => {
                    const responses = [
                        "That's a great choice! We have 3 in stock.",
                        "I recommend the Noise-Canceling Headphones for deep work.",
                        "The ergonomic chair is rated 4.5 stars by 89 users.",
                        "Shipping is free for orders over $50!"
                    ];
                    const random = responses[Math.floor(Math.random() * responses.length)];
                    State.chatMessages.push({role: 'ai', text: random});
                    Actions.updateUI();
                }, 1000);
            },
            handleFileUpload: (input) => {
                if (input.files && input.files[0]) {
                    const file = input.files[0];
                    State.returns.file = file;
                    State.returns.preview = URL.createObjectURL(file);
                    Actions.updateUI();
                }
            },
            submitReturn: () => {
                showToast('Return request submitted successfully!', 'success');
                State.returns = { file: null, preview: null, date: '', reason: 'damaged', orderId: '' };
                Actions.updateUI();
            },
            downloadInvoice: (orderId) => {
                const element = document.createElement("a");
                const file = new Blob([`INVOICE #${orderId}\nDate: ${new Date().toISOString()}\nStatus: Paid`], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `Invoice_${orderId}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            },
            openComplaintModal: (orderId) => {
                renderComplaintModal(orderId);
            },
            openTestDataManager: () => {
                renderTestDataManager();
            }
        };

        // --- 4. RENDERERS ---

        function renderNavbar() {
            const itemCount = State.cart.reduce((acc, item) => acc + item.quantity, 0);
            const userHtml = State.user 
                ? `<div class="flex items-center gap-3 ml-2">
                     <span class="text-sm text-slate-300 hidden md:block" data-test-id="user-greeting">Hi, ${State.user.displayName}</span>
                     <button onclick="Actions.logout()" class="p-2 text-slate-300 hover:text-white" data-test-id="nav-logout"><i data-lucide="log-out"></i></button>
                   </div>`
                : `<button onclick="Actions.setView('login')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium" data-test-id="nav-login">Login</button>`;

            document.getElementById('navbar').innerHTML = `
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div class="flex items-center cursor-pointer" onclick="Actions.setView('home')" data-test-id="nav-home-logo">
                        <i data-lucide="package" class="h-8 w-8 text-indigo-400"></i>
                        <span class="ml-2 text-xl font-bold tracking-tight text-voilet">QualityShop<span class="text-indigo-400">.SUT</span></span>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <button onclick="Actions.setView('home')" class="px-3 py-2 rounded-md text-sm font-medium ${State.view === 'home' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}" data-test-id="nav-products">Products</button>
                            ${State.user ? `<button onclick="Actions.setView('orders')" class="px-3 py-2 rounded-md text-sm font-medium ${State.view === 'orders' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}" data-test-id="nav-orders">Orders</button>` : ''}
                            ${State.user ? `<button onclick="Actions.setView('profile')" class="px-3 py-2 rounded-md text-sm font-medium ${State.view === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}" data-test-id="nav-profile">Profile</button>` : ''}
                            ${State.user && State.user.role === 'admin' ? `<button onclick="Actions.setView('admin')" class="px-3 py-2 rounded-md text-sm font-medium text-amber-400 hover:text-amber-300" data-test-id="nav-admin">Admin</button>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-4 text-black">
                        <button onclick="Actions.openTestDataManager()" class="p-2 text-slate-300 hover:text-amber-400" title="Test Data" data-test-id="test-data-btn"><i data-lucide="database"></i></button>
                        <div class="relative cursor-pointer p-2 hover:bg-slate-800 rounded-full" onclick="Actions.setView('cart')" data-test-id="cart-icon">
                            <i data-lucide="shopping-cart"></i>
                            ${itemCount > 0 ? `<span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full" data-test-id="cart-count">${itemCount}</span>` : ''}
                        </div>
                        ${userHtml}
                    </div>
                </div>
            `;
        }

        function renderMainContent() {
            const app = document.getElementById('app');
            app.innerHTML = '';
            switch (State.view) {
                case 'home': renderProductList(app); break;
                case 'login': renderLogin(app); break;
                case 'cart': renderCart(app); break;
                case 'checkout': renderCheckout(app); break;
                case 'detail': renderProductDetail(app); break;
                case 'profile': renderProfile(app); break;
                case 'admin': renderAdmin(app); break;
                case 'orders': renderOrders(app); break;
                default: renderProductList(app);
            }
        }

        // --- View Implementations ---

        function renderProductList(container) {
            const filtered = MOCK_PRODUCTS.filter(p => {
                const matchCat = State.filters.category === 'All' || p.category === State.filters.category;
                const matchPrice = p.price <= State.filters.price;
                const matchSearch = p.name.toLowerCase().includes(State.filters.search.toLowerCase());
                return matchCat && matchPrice && matchSearch;
            });

            const idxLast = State.pagination.page * State.pagination.itemsPerPage;
            const idxFirst = idxLast - State.pagination.itemsPerPage;
            const currentItems = filtered.slice(idxFirst, idxLast);
            const totalPages = Math.ceil(filtered.length / State.pagination.itemsPerPage);
            const categories = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

            container.innerHTML = `
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-test-id="product-list-page">
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="w-full md:w-64 space-y-6">
                            <div class="bg-white p-4 rounded-lg shadow border border-slate-200">
                                <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2"><i data-lucide="filter" size="18"></i> Filters</h3>
                                <div class="mb-4">
                                    <input type="text" placeholder="Keyword..." class="w-full border p-2 rounded" oninput="Actions.setFilter('search', this.value)" value="${State.filters.search}" data-test-id="search-input">
                                </div>
                                <div class="mb-4 space-y-2">
                                    <label class="font-medium">Category</label>
                                    ${categories.map(cat => `
                                        <div class="flex items-center">
                                            <input type="radio" name="cat" ${State.filters.category === cat ? 'checked' : ''} onchange="Actions.setFilter('category', '${cat}')" data-test-id="filter-category-${cat}">
                                            <span class="ml-2 text-sm">${cat}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="mb-4">
                                    <label class="block text-sm font-medium mb-1">Max Price: $${State.filters.price}</label>
                                    <input type="range" min="0" max="1000" value="${State.filters.price}" class="w-full" oninput="Actions.setFilter('price', this.value)" data-test-id="filter-price-slider">
                                </div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold mb-6">Products (${filtered.length})</h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-test-id="product-grid">
                                ${currentItems.map(p => `
                                    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group" data-test-id="product-card-${p.id}">
                                        <div class="h-48 bg-slate-50 flex items-center justify-center text-6xl cursor-pointer group-hover:bg-indigo-50" onclick="openProductDetail('${p.id}')" data-test-id="product-image-${p.id}">${p.image}</div>
                                        <div class="p-4">
                                            <h3 class="font-bold text-lg truncate cursor-pointer hover:text-indigo-600" onclick="openProductDetail('${p.id}')" data-test-id="product-title-${p.id}">${p.name}</h3>
                                            <div class="flex justify-between items-center mt-4">
                                                <span class="text-xl font-bold" data-test-id="product-price-${p.id}">$${p.price.toFixed(2)}</span>
                                                <button onclick="addToCartWrapper('${p.id}')" class="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700" data-test-id="add-to-cart-${p.id}"><i data-lucide="shopping-cart" size="18"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="flex justify-center gap-2 mt-8">
                                ${Array.from({length: totalPages}, (_, i) => i + 1).map(num => `
                                    <button onclick="Actions.setPage(${num})" class="px-4 py-2 border rounded ${State.pagination.page === num ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-slate-50'}" data-test-id="pagination-page-${num}">${num}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderProfile(container) {
            if (!State.user) return Actions.setView('login');
            
            const activeClass = "border-b-2 border-indigo-600 text-indigo-600";
            const inactiveClass = "text-slate-500 hover:text-slate-700";

            container.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 py-8" data-test-id="profile-page">
                    <h1 class="text-2xl font-bold mb-6">My Profile</h1>
                    <div class="flex border-b border-slate-200 mb-6">
                        <button onclick="Actions.setProfileTab('details')" class="px-4 py-2 font-medium text-sm ${State.profileTab === 'details' ? activeClass : inactiveClass}" data-test-id="tab-details">Account Details</button>
                        <button onclick="Actions.setProfileTab('returns')" class="px-4 py-2 font-medium text-sm ${State.profileTab === 'returns' ? activeClass : inactiveClass}" data-test-id="tab-returns">Returns Center</button>
                        <button onclick="Actions.setProfileTab('settings')" class="px-4 py-2 font-medium text-sm ${State.profileTab === 'settings' ? activeClass : inactiveClass}" data-test-id="tab-settings">Settings</button>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[400px]">
                        ${State.profileTab === 'details' ? `
                            <div class="p-6 animate-fadeIn" data-test-id="content-details">
                                <h3 class="font-bold text-lg mb-4">Personal Information</h3>
                                <div class="grid gap-4 max-w-md">
                                    <div><label class="block text-sm text-slate-500">Full Name</label><input type="text" value="${State.user.displayName}" readOnly class="w-full border p-2 rounded bg-slate-50"></div>
                                    <div><label class="block text-sm text-slate-500">Email</label><input type="text" value="${State.user.email}" readOnly class="w-full border p-2 rounded bg-slate-50"></div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${State.profileTab === 'returns' ? `
                            <div class="p-6 animate-fadeIn" data-test-id="content-returns">
                                <h2 class="text-xl font-bold mb-4">File Return / Exchange</h2>
                                <div class="grid gap-6 max-w-lg">
                                    <div><label class="block text-sm font-medium mb-1">Order ID</label><input type="text" class="w-full border p-2 rounded" placeholder="#ORD-1234" data-test-id="return-order-id"></div>
                                    <div><label class="block text-sm font-medium mb-1">Date</label><input type="date" class="w-full border p-2 rounded" data-test-id="return-date-picker"></div>
                                    <div>
                                        <label class="block text-sm font-medium mb-1">Reason</label>
                                        <select class="w-full border p-2 rounded" data-test-id="return-reason"><option>Damaged</option><option>Wrong Item</option></select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium mb-1">Upload Proof</label>
                                        <div class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50 relative">
                                            <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="Actions.handleFileUpload(this)" data-test-id="file-upload-input">
                                            ${State.returns.preview ? `<img src="${State.returns.preview}" class="h-32 mx-auto object-contain">` : `<div class="flex flex-col items-center text-slate-400"><i data-lucide="upload-cloud" class="h-10 w-10 mb-2"></i><span>Click or drag image</span></div>`}
                                        </div>
                                    </div>
                                    <button onclick="Actions.submitReturn()" class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" data-test-id="submit-return-btn">Submit Request</button>
                                </div>
                            </div>
                        ` : ''}

                        ${State.profileTab === 'settings' ? `
                            <div class="p-6 animate-fadeIn" data-test-id="content-settings">
                                <h3 class="font-bold text-lg mb-4">Preferences</h3>
                                <div class="space-y-4">
                                    <div class="border border-slate-200 rounded">
                                        <button onclick="Actions.toggleAccordion('notif')" class="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100">
                                            <span class="font-medium">Email Notifications</span>
                                            <i data-lucide="${State.openAccordion === 'notif' ? 'chevron-up' : 'chevron-down'}"></i>
                                        </button>
                                        ${State.openAccordion === 'notif' ? `<div class="p-4 border-t border-slate-200"><label class="flex gap-2"><input type="checkbox" checked> Order Updates</label></div>` : ''}
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        function renderOrders(container) {
            if (!State.user) return Actions.setView('login');
            
            // Mock Orders Logic
            const key = `mock_orders_${State.user.uid}`;
            const orders = JSON.parse(localStorage.getItem(key) || '[]');

            container.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 py-8" data-test-id="orders-history-page">
                    <h1 class="text-2xl font-bold mb-6">My Orders</h1>
                    <div class="space-y-4">
                        ${orders.length === 0 ? `<p class="text-slate-500">No orders found.</p>` : orders.map(order => `
                            <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm" data-test-id="order-card-${order.id}">
                                <div class="flex justify-between items-center mb-4 pb-4 border-b">
                                    <div><p class="font-bold text-sm text-slate-500">ORDER ID</p><p class="font-mono text-slate-800">#${order.id}</p></div>
                                    <div class="text-right"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span></div>
                                </div>
                                <div class="flex justify-between font-bold pt-2">
                                    <span>Total: $${order.total.toFixed(2)}</span>
                                    <div class="flex gap-2">
                                        <button onclick="Actions.downloadInvoice('${order.id}')" class="text-indigo-600 text-sm hover:underline flex items-center gap-1" data-test-id="download-invoice-${order.id}"><i data-lucide="download" size="14"></i> Invoice</button>
                                        <button onclick="Actions.openComplaintModal('${order.id}')" class="text-red-600 text-sm hover:underline flex items-center gap-1" data-test-id="report-issue-${order.id}"><i data-lucide="message-circle-warning" size="14"></i> Report Issue</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function renderCart(container) {
            if (State.cart.length === 0) return container.innerHTML = `<div class="text-center py-20"><h2 class="text-2xl font-bold mb-4">Cart is Empty</h2><button onclick="Actions.setView('home')" class="bg-indigo-600 text-white px-6 py-2 rounded">Go Shopping</button></div>`;
            const subtotal = State.cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            container.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 py-8" data-test-id="cart-view">
                    <h1 class="text-2xl font-bold mb-8">Shopping Cart</h1>
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="flex-1 space-y-4">
                            ${State.cart.map(item => `
                                <div class="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4" data-test-id="cart-item-${item.id}">
                                    <div class="h-20 w-20 bg-slate-100 rounded flex items-center justify-center text-3xl">${item.image}</div>
                                    <div class="flex-1"><h3 class="font-semibold">${item.name}</h3><div class="text-indigo-600 font-medium">$${item.price.toFixed(2)}</div></div>
                                    <div class="flex items-center gap-2">
                                        <button onclick="Actions.updateQuantity('${item.id}', -1)" class="p-1 bg-slate-100 rounded">-</button><span class="w-8 text-center font-medium">${item.quantity}</span><button onclick="Actions.updateQuantity('${item.id}', 1)" class="p-1 bg-slate-100 rounded">+</button>
                                    </div>
                                    <button onclick="Actions.removeFromCart('${item.id}')" class="text-red-500 p-2"><i data-lucide="trash-2"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="w-full lg:w-80 bg-white p-6 rounded-lg shadow-sm border h-fit">
                            <div class="flex justify-between font-bold text-lg mb-4"><span>Total</span><span data-test-id="cart-total">$${subtotal.toFixed(2)}</span></div>
                            <button onclick="Actions.setView('checkout')" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700" data-test-id="checkout-btn">Checkout</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderLogin(container) {
            container.innerHTML = `
                <div class="min-h-[80vh] flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md border" data-test-id="login-form">
                        <h2 class="text-2xl font-bold mb-6 text-center">Login (Mock Mode)</h2>
                        <form onsubmit="handleLogin(event)" class="space-y-4">
                            <div><label class="block text-sm font-medium mb-1">Email</label><input type="email" id="login-email" required class="w-full border p-2 rounded" data-test-id="input-email" value="user@test.com"></div>
                            <div><label class="block text-sm font-medium mb-1">Password</label><input type="password" required class="w-full border p-2 rounded" data-test-id="input-password" value="password123"></div>
                            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700" data-test-id="auth-submit-btn">Sign In</button>
                        </form>
                    </div>
                </div>
            `;
        }

        function renderCheckout(container) {
            if (State.cart.length === 0) { Actions.setView('home'); return; }
            const total = State.cart.reduce((a,i)=>a+i.price*i.quantity,0);
            container.innerHTML = `
                <div class="max-w-2xl mx-auto py-8 px-4" data-test-id="checkout-page">
                    <h2 class="text-xl font-bold mb-4">Review Order</h2>
                    <div class="bg-slate-50 p-4 rounded mb-4 border">
                        ${State.cart.map(i => `<div class="flex justify-between"><span>${i.quantity}x ${i.name}</span><span>$${(i.price*i.quantity).toFixed(2)}</span></div>`).join('')}
                        <div class="border-t mt-2 pt-2 flex justify-between font-bold"><span>Total</span><span data-test-id="review-total">$${total.toFixed(2)}</span></div>
                    </div>
                    <button onclick="completeOrder()" class="w-full bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700" data-test-id="place-order-btn">Place Order</button>
                </div>
            `;
        }

        function renderProductDetail(container) {
            const p = State.currentProduct;
            container.innerHTML = `
                <div class="max-w-7xl mx-auto px-4 py-10" data-test-id="product-detail-page">
                    <button onclick="Actions.setView('home')" class="mb-4 text-slate-500 hover:text-indigo-600">&larr; Back</button>
                    <div class="flex flex-col md:flex-row gap-10 bg-white p-8 rounded-lg shadow-sm border">
                        <div class="w-full md:w-1/2 h-96 bg-slate-50 flex items-center justify-center text-9xl">${p.image}</div>
                        <div class="w-full md:w-1/2 space-y-4">
                            <h1 class="text-3xl font-bold" data-test-id="product-title">${p.name}</h1>
                            <p class="text-slate-600">${p.description}</p>
                            <div class="text-3xl font-bold" data-test-id="product-price">$${p.price.toFixed(2)}</div>
                            <button onclick="addToCartWrapper('${p.id}')" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700" data-test-id="add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderAdmin(container) {
            container.innerHTML = `
                <div class="max-w-6xl mx-auto px-4 py-8" data-test-id="admin-dashboard">
                    <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white p-6 rounded shadow border"><h3 class="text-slate-500 font-bold text-sm">Revenue</h3><p class="text-3xl font-bold text-slate-900 mt-2">$12,450</p></div>
                        <div class="bg-white p-6 rounded shadow border"><h3 class="text-slate-500 font-bold text-sm">Active Orders</h3><p class="text-3xl font-bold text-slate-900 mt-2">24</p></div>
                    </div>
                </div>
            `;
        }

        function renderAIAssistant() {
            const container = document.getElementById('ai-assistant');
            if(!State.chatOpen) {
                container.innerHTML = `<button onclick="Actions.toggleChat()" class="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg" data-test-id="ai-chat-fab"><i data-lucide="message-square"></i></button>`;
            } else {
                container.innerHTML = `
                    <div class="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style="height: 400px;" data-test-id="ai-chat-window">
                        <div class="bg-slate-900 text-white p-4 flex justify-between items-center"><span class="font-bold flex gap-2"><i data-lucide="sparkles" class="text-amber-400"></i> AI Assistant</span><button onclick="Actions.toggleChat()"><i data-lucide="x"></i></button></div>
                        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            ${State.chatMessages.map(msg => `<div class="flex ${msg.role==='user'?'justify-end':'justify-start'}"><div class="p-2 rounded-lg text-sm max-w-[85%] ${msg.role==='user'?'bg-indigo-600 text-white':'bg-white border'}">${msg.text}</div></div>`).join('')}
                        </div>
                        <div class="p-3 bg-white border-t flex gap-2"><input id="chat-input" type="text" class="flex-1 border rounded-full px-3 py-1 text-sm" placeholder="Ask..."><button onclick="Actions.sendChatMessage()" class="p-2 bg-indigo-100 rounded-full text-indigo-600"><i data-lucide="send" size="16"></i></button></div>
                    </div>
                    <button onclick="Actions.toggleChat()" class="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-lg"><i data-lucide="x"></i></button>
                `;
            }
        }

        function renderComplaintModal(orderId) {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-test-id="complaint-modal">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 class="font-bold text-lg mb-4">Report Issue: Order #${orderId}</h3>
                        <textarea class="w-full border p-2 rounded mb-4" rows="3" placeholder="Describe the issue..." data-test-id="complaint-text"></textarea>
                        <div class="flex justify-end gap-2">
                            <button onclick="document.getElementById('modal-container').innerHTML=''" class="px-4 py-2 text-slate-600">Cancel</button>
                            <button onclick="showToast('Complaint Submitted', 'success'); document.getElementById('modal-container').innerHTML=''" class="px-4 py-2 bg-red-600 text-white rounded" data-test-id="submit-complaint-btn">Submit</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderTestDataManager() {
            const modal = document.getElementById('modal-container');
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-test-id="test-data-modal">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 class="font-bold text-lg mb-4 flex items-center gap-2"><i data-lucide="database"></i> Test Data Manager</h3>
                        <div class="space-y-3">
                            <button onclick="exportData()" class="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 py-2 rounded font-medium" data-test-id="export-data-btn">Download JSON</button>
                            <div class="relative">
                                <button class="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 rounded font-medium">Import JSON</button>
                                <input type="file" accept=".json" class="absolute inset-0 opacity-0 cursor-pointer" onchange="importData(this)" data-test-id="import-data-input">
                            </div>
                            <button onclick="resetData()" class="w-full text-red-600 hover:bg-red-50 py-2 rounded" data-test-id="reset-data-btn">Reset All Data</button>
                        </div>
                        <button onclick="document.getElementById('modal-container').innerHTML=''" class="mt-4 w-full text-slate-500">Close</button>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }

        // --- 5. HELPERS ---
        function openProductDetail(id) { Actions.setView('detail', MOCK_PRODUCTS.find(p => p.id === id)); }
        function addToCartWrapper(id) { Actions.addToCart(MOCK_PRODUCTS.find(x => x.id === id)); }
        function handleLogin(e) { e.preventDefault(); setTimeout(() => Actions.loginMock(document.getElementById('login-email').value), 600); }
        function completeOrder() {
            setTimeout(() => {
                const total = State.cart.reduce((a,i)=>a+i.price*i.quantity,0);
                if(State.user) {
                    const key = `mock_orders_${State.user.uid}`;
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push({ id: Date.now(), total, date: new Date().toISOString() });
                    localStorage.setItem(key, JSON.stringify(existing));
                }
                State.cart = [];
                Actions.setView('home');
                showToast('Order Placed! (Mock)', 'success');
            }, 1000);
        }
        function showToast(msg, type) {
            const container = document.getElementById('toast-container');
            const el = document.createElement('div');
            el.className = `toast ${type === 'success' ? 'bg-green-600' : 'bg-blue-600'} text-white p-4 rounded shadow-lg animate-slideUp`;
            el.textContent = msg;
            container.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
        
        // Data Manager Logic
        function exportData() {
            const data = {};
            for(let i=0; i<localStorage.length; i++) {
                const key = localStorage.key(i);
                if(key.startsWith('mock_')) data[key] = JSON.parse(localStorage.getItem(key));
            }
            const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'test_data.json'; a.click();
        }
        function importData(input) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
                location.reload();
            };
            reader.readAsText(input.files[0]);
        }
        function resetData() {
            Object.keys(localStorage).forEach(k => { if(k.startsWith('mock_')) localStorage.removeItem(k); });
            location.reload();
        }

        window.onload = Actions.updateUI;
        // Expose global for HTML onclicks
        window.Actions = Actions;
        window.openProductDetail = openProductDetail;
        window.addToCartWrapper = addToCartWrapper;
        window.handleLogin = handleLogin;
        window.completeOrder = completeOrder;
        window.showToast = showToast;
        window.exportData = exportData;
        window.importData = importData;
        window.resetData = resetData;