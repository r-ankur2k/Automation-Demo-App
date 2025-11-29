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
            { id: 'p15', name: 'Ceramic Plant Pot', price: 22.50, category: 'Home', rating: 4.8, reviews: 45, stock: 15, image: '🪴', description: 'Minimalist design for indoor plants.' },
            { id: 'p16', name: 'Electric Toothbrush', price: 79.99, category: 'Health', rating: 4.9, reviews: 250, stock: 50, image: '🪥', description: 'Removes 10x more plaque.' },
            { id: 'p17', name: 'Air Fryer', price: 129.99, category: 'Home', rating: 4.7, reviews: 180, stock: 30, image: '🍳', description: 'Crispy food with less oil.' },
            { id: 'p18', name: 'Scented Candle', price: 19.99, category: 'Home', rating: 4.6, reviews: 120, stock: 100, image: '🕯️', description: 'Relaxing lavender scent.' },
            { id: 'p19', name: 'Dumbbell Set', price: 49.99, category: 'Sports', rating: 4.8, reviews: 90, stock: 40, image: '🏋️', description: 'Adjustable weights for home gym.' },
            { id: 'p20', name: 'Digital Camera', price: 499.99, category: 'Electronics', rating: 4.5, reviews: 60, stock: 15, image: '📷', description: '24MP sensor for stunning photos.' },
            { id: 'p21', name: 'Hardcover Notebook', price: 12.99, category: 'Office', rating: 4.9, reviews: 300, stock: 200, image: '📓', description: '120 pages of high-quality paper.' },
            { id: 'p22', name: 'Blender', price: 89.99, category: 'Home', rating: 4.6, reviews: 150, stock: 25, image: '🥤', description: 'Perfect for smoothies and shakes.' },
            { id: 'p23', name: 'Gaming Mouse', price: 59.99, category: 'Electronics', rating: 4.7, reviews: 110, stock: 35, image: '🖱️', description: 'High-precision sensor for gaming.' },
            { id: 'p24', name: 'Backpack', price: 69.99, category: 'Apparel', rating: 4.8, reviews: 200, stock: 60, image: '🎒', description: 'Durable and spacious for daily use.' },
            { id: 'p25', name: 'Wall Clock', price: 39.99, category: 'Home', rating: 4.5, reviews: 80, stock: 50, image: '⏰', description: 'Modern design with silent movement.' },
            { id: 'p26', name: 'Desk Lamp', price: 29.99, category: 'Home', rating: 4.6, reviews: 100, stock: 70, image: '💡', description: 'Adjustable LED light for your workspace.' },
            { id: 'p27', name: 'Fountain Pen', price: 45.00, category: 'Office', rating: 4.9, reviews: 180, stock: 40, image: '✒️', description: 'A luxurious writing experience.' }
        ];

        // --- 2. STATE MANAGEMENT ---
        const State = {
            user: null, 
            wishlist: [],
            cart: [], 
            view: 'login', 
            currentProduct: null,
            filters: { category: 'All', price: 1000, search: '', sort: 'default' },
            selectedProducts: new Set(),
            checkoutData: { shipping: {}, coupon: null },
            compare: [],
            savedAddresses: [],
            paymentMethods: [],
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
            login: (email, password) => {
                const validUsers = {
                    "admin@test.com": "password123",
                    "user@test.com": "password123"
                };

                const errorElement = document.getElementById('login-error');

                if (validUsers[email] && validUsers[email] === password) {
                    if (errorElement) {
                        errorElement.innerHTML = '';
                    }
                    const uid = 'mock-' + email.replace(/[^a-zA-Z0-9]/g, '');
                    const name = email.split('@')[0];
                    const role = email.includes('admin') ? 'admin' : 'customer';
                    State.user = { uid, email, displayName: name, role };
                    State.view = 'home';
                    showToast(`Welcome back, ${name}!`, 'success');
                    Actions.updateUI();
                } else {
                    if (errorElement) {
                        errorElement.innerHTML = '<p class="text-red-500 text-sm mt-2">Invalid email or password</p>';
                    }
                }
            },
            logout: () => {
                State.user = null;
                State.view = 'home';
                State.cart = [];
                showToast('Logged out', 'info');
                Actions.updateUI();
            },
            setFilter: (key, value) => {
                if (key === 'price') {
                    const num = Number(value);
                    State.filters.price = Number.isFinite(num) ? num : State.filters.price;
                } else {
                    State.filters[key] = value;
                }
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
                const key = `mock_orders_${State.user.uid}`;
                const orders = JSON.parse(localStorage.getItem(key) || '[]');
                const order = orders.find(o => o.id === orderId);
                const itemsText = order.items.map(i => `${i.quantity}x ${i.name} - $${(i.price * i.quantity).toFixed(2)}`).join('\n');
                const invoiceText = `INVOICE #${orderId}\nDate: ${new Date(order.date).toLocaleDateString()}\nStatus: Paid\n\nItems:\n${itemsText}\n\nTotal: $${order.total.toFixed(2)}`;
                const element = document.createElement("a");
                const file = new Blob([invoiceText], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = `Invoice_${orderId}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            },
            openComplaintModal: (orderId) => {
                renderComplaintModal(orderId);
            },
            toggleProfileEdit: (isEditing) => {
                const nameInput = document.getElementById('profile-name');
                const editContainer = document.getElementById('profile-edit-container');
                if (isEditing) {
                    nameInput.readOnly = false;
                    nameInput.classList.remove('bg-slate-50');
                    editContainer.innerHTML = `<button onclick="Actions.toggleProfileEdit(false)" class="bg-green-600 text-white px-4 py-2 rounded">Save</button>`;
                } else {
                    State.user.displayName = nameInput.value;
                    nameInput.readOnly = true;
                    nameInput.classList.add('bg-slate-50');
                    editContainer.innerHTML = `<button onclick="Actions.toggleProfileEdit(true)" class="bg-indigo-600 text-white px-4 py-2 rounded">Edit</button>`;
                    Actions.updateUI();
                }
            },
            openTestDataManager: () => {
                renderTestDataManager();
            }
        };

        // Wishlist actions
        Actions.addToWishlist = (product) => {
            if (!State.wishlist.find(p => p.id === product.id)) {
                State.wishlist.push({ id: product.id, name: product.name, price: product.price });
                localStorage.setItem('mock_wishlist', JSON.stringify(State.wishlist));
                showToast('Added to wishlist', 'success');
            }
            Actions.updateUI();
        };
        Actions.removeFromWishlist = (id) => {
            State.wishlist = State.wishlist.filter(i => i.id !== id);
            localStorage.setItem('mock_wishlist', JSON.stringify(State.wishlist));
            Actions.updateUI();
        };
        Actions.openWishlist = () => { Actions.setView('wishlist'); };


        // --- New Actions for Forms / File Uploads / Reviews / Admin Import ---
        Actions.submitContact = (form) => {
            try {
                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                const msg = document.getElementById('contact-message').value;
                const input = document.getElementById('contact-file');
                let fileInfo = null;
                if (input && input.files && input.files[0]) {
                    const f = input.files[0];
                    fileInfo = { name: f.name, size: f.size, type: f.type };
                }
                // Persist contact in localStorage for test verification
                const contacts = JSON.parse(localStorage.getItem('mock_contacts') || '[]');
                contacts.push({ id: Date.now(), name, email, msg, file: fileInfo });
                localStorage.setItem('mock_contacts', JSON.stringify(contacts));
                showToast('Contact message submitted', 'success');
                document.getElementById('modal-container').innerHTML = '';
            } catch (err) {
                showToast('Failed to submit contact', 'error');
            }
        };

        Actions.submitReview = (productId) => {
            try {
                const rating = Number(document.getElementById('review-rating').value);
                const comment = document.getElementById('review-comment').value;
                const finput = document.getElementById('review-file');
                let fileInfo = null;
                if (finput && finput.files && finput.files[0]) {
                    const f = finput.files[0];
                    fileInfo = { name: f.name, size: f.size, type: f.type }; // keep lightweight
                }
                const reviewsKey = `mock_reviews_${productId}`;
                const list = JSON.parse(localStorage.getItem(reviewsKey) || '[]');
                list.push({ id: Date.now(), rating, comment, file: fileInfo });
                localStorage.setItem(reviewsKey, JSON.stringify(list));
                showToast('Review submitted', 'success');
                document.getElementById('modal-container').innerHTML = '';
            } catch (err) {
                showToast('Failed to submit review', 'error');
            }
        };

        Actions.uploadAvatar = (input) => {
            try {
                if (!input.files || !input.files[0]) return;
                const f = input.files[0];
                const url = URL.createObjectURL(f);
                if (!State.user) State.user = { uid: 'guest', displayName: 'Guest' };
                State.user.avatar = url;
                // Save avatar as data URL could be heavy; store in session for tests
                sessionStorage.setItem('mock_avatar', url);
                document.getElementById('avatar-preview').innerHTML = `<img src="${url}" class="h-16 w-16 rounded-full object-cover">`;
                showToast('Avatar uploaded (preview only)', 'success');
            } catch (err) {
                showToast('Avatar upload failed', 'error');
            }
        };

        Actions.importProducts = (input) => {
            try {
                if (!input.files || !input.files[0]) return showToast('No file selected', 'error');
                const f = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    const raw = e.target.result;
                    let parsed = [];
                    if (f.name.endsWith('.json')) {
                        parsed = JSON.parse(raw);
                    } else if (f.name.endsWith('.csv')) {
                        parsed = csvToJson(raw);
                    }
                    // Append minimal product objects
                    parsed.forEach((row, idx) => {
                        const id = `imp_${Date.now()}_${idx}`;
                        MOCK_PRODUCTS.push({ id, name: row.name || row.title || `Imported ${id}`, price: Number(row.price) || 9.99, category: row.category || 'Imported', rating: Number(row.rating) || 4.0, reviews: Number(row.reviews) || 0, stock: Number(row.stock) || 10, image: row.image || '📦', description: row.description || '' });
                    });
                    showToast(`Imported ${parsed.length} products`, 'success');
                    Actions.updateUI();
                };
                reader.readAsText(f);
            } catch (err) {
                showToast('Import failed: ' + err.message, 'error');
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
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16" style="color: #000 !important;">
                    <div class="flex items-center cursor-pointer" onclick="Actions.setView('home')" data-test-id="nav-home-logo">
                        <i data-lucide="package" class="h-8 w-8 text-black"></i>
                        <span class="ml-2 text-xl font-bold tracking-tight text-voilet">QualityShop<span class="text-indigo-400">.SUT</span></span>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            ${State.view !== 'login' ? `
                                <button onclick="Actions.setView('home')" style="${State.view === 'home' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-products">Products</button>
                                <button onclick="Actions.setView('compare')" style="${State.view === 'compare' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-compare">Compare (${State.compare.length})</button>
                                <button onclick="Actions.openWishlist()" style="${State.view === 'wishlist' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-wishlist">Wishlist (${State.wishlist.length})</button>
                                <button onclick="Actions.setView('contact')" style="${State.view === 'contact' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-contact">Contact</button>
                                ${State.user ? `<button onclick="Actions.setView('orders')" style="${State.view === 'orders' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-orders">Orders</button>` : ''}
                                ${State.user ? `<button onclick="Actions.setView('profile')" style="${State.view === 'profile' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-profile">Profile</button>` : ''}
                                ${State.user && State.user.role === 'admin' ? `<button onclick="Actions.setView('admin')" style="${State.view === 'admin' ? 'font-weight:700;background:#000;color:#fff;' : 'color:#000;'}" class="px-3 py-2 rounded-md text-sm font-medium" data-test-id="nav-admin">Admin</button>` : ''}
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-4 text-black">
                        <button onclick="Actions.openTestDataManager()" class="p-2 text-black hover:text-amber-400" title="Test Data" data-test-id="test-data-btn"><i data-lucide="database"></i><span class="sr-only">Test Data</span></button>
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
                case 'order-confirmation': renderOrderConfirmation(app); break;
                case 'detail': renderProductDetail(app); break;
                case 'profile': renderProfile(app); break;
                case 'contact': renderContact(app); break;
                case 'wishlist': renderWishlist(app); break;
                case 'compare': renderCompare(app); break;
                case 'admin': renderAdmin(app); break;
                case 'orders': renderOrders(app); break;
                default: renderProductList(app);
            }
        }

        // --- View Implementations ---

        function renderProductList(container) {
            // Compute sensible slider max from product data
            const maxPrice = Math.max(...MOCK_PRODUCTS.map(p => p.price));
            if (typeof State.filters.price === 'undefined' || State.filters.price > maxPrice) {
                State.filters.price = Math.ceil(maxPrice);
            }

            const filtered = MOCK_PRODUCTS.filter(p => {
                const matchCat = State.filters.category === 'All' || p.category === State.filters.category;
                const matchPrice = p.price <= State.filters.price;
                const search = State.filters.search.toLowerCase();
                const matchSearch = p.name.toLowerCase().includes(search) ||
                                    p.description.toLowerCase().includes(search) ||
                                    p.category.toLowerCase().includes(search);
                return matchCat && matchPrice && matchSearch;
            });

            if (State.filters.sort === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (State.filters.sort === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (State.filters.sort === 'rating-desc') {
                filtered.sort((a, b) => b.rating - a.rating);
            }

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
                                <div class="mb-4">
                                    <label class="font-medium">Sort by</label>
                                    <select class="w-full border p-2 rounded" onchange="Actions.setFilter('sort', this.value)" data-test-id="sort-select">
                                        <option value="default" ${State.filters.sort === 'default' ? 'selected' : ''}>Default</option>
                                        <option value="price-asc" ${State.filters.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                                        <option value="price-desc" ${State.filters.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                                        <option value="rating-desc" ${State.filters.sort === 'rating-desc' ? 'selected' : ''}>Rating: High to Low</option>
                                    </select>
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
                                    <label id="price-label" class="block text-sm font-medium mb-1">Max Price: $${Number(State.filters.price).toFixed(2)}</label>
                                    <input type="range" min="0" max="${Math.ceil(maxPrice)}" step="1" value="${State.filters.price}" class="w-full" onchange="Actions.setFilter('price', this.value)" oninput="document.getElementById('price-label').textContent = 'Max Price: $' + this.value" data-test-id="filter-price-slider">
                                </div>
                                <div class="mb-4">
                                    <button onclick="Actions.addSelectedToCart()" class="w-full bg-emerald-600 text-white py-2 rounded" data-test-id="add-selected-btn">Add Selected To Cart</button>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold mb-6">Products (${filtered.length})</h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-test-id="product-grid">
                                ${currentItems.map(p => `
                                    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative product-card" data-test-id="product-card-${p.id}">
                                        <div class="absolute top-2 left-2 z-10">
                                            <input type="checkbox" ${State.selectedProducts.has(p.id) ? 'checked' : ''} onchange="(function(elId,checked){ if(checked){ State.selectedProducts.add(elId); } else { State.selectedProducts.delete(elId); } Actions.updateUI(); })('${p.id}', this.checked)" data-test-id="select-product-${p.id}">
                                        </div>
                                        <div class="absolute top-2 right-2 z-10 flex gap-1">
                                            <button onclick="(function(id){ const found = State.wishlist.find(x=>x.id===id); if(found) { Actions.removeFromWishlist(id); } else { Actions.addToWishlist(MOCK_PRODUCTS.find(x=>x.id===id)); } })( '${p.id}' )" class="p-1 rounded bg-white border" data-test-id="wishlist-${p.id}">${State.wishlist.find(x=>x.id===p.id) ? '♥' : '♡'}</button>
                                            <button onclick="(function(id){ if(State.compare.includes(id)) { State.compare = State.compare.filter(x=>x!==id); } else { State.compare.push(id); } Actions.updateUI(); })('${p.id}')" class="p-1 rounded bg-white border" data-test-id="compare-${p.id}">${State.compare.includes(p.id) ? '✓' : '⇄'}</button>
                                        </div>
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
                                    <div><label class="block text-sm text-slate-500">Full Name</label><input type="text" id="profile-name" value="${State.user.displayName}" readOnly class="w-full border p-2 rounded bg-slate-50"></div>
                                    <div><label class="block text-sm text-slate-500">Email</label><input type="text" value="${State.user.email}" readOnly class="w-full border p-2 rounded bg-slate-50"></div>
                                    <div id="profile-edit-container">
                                        <button onclick="Actions.toggleProfileEdit(true)" class="bg-indigo-600 text-white px-4 py-2 rounded">Edit</button>
                                    </div>
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
                                    <div class="border border-slate-200 rounded p-4">
                                        <div class="mb-3"><label class="block text-sm font-medium mb-1">Profile Avatar</label>
                                            <div class="flex items-center gap-4">
                                                <div id="avatar-preview" class="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-2xl">${State.user && State.user.avatar ? `<img src="${State.user.avatar}" class="h-16 w-16 rounded-full object-cover">` : State.user ? State.user.displayName.charAt(0).toUpperCase() : 'U'}</div>
                                                <input type="file" accept="image/*" onchange="Actions.uploadAvatar(this)" data-test-id="profile-avatar-input">
                                            </div>
                                        </div>
                                        <div class="mt-4">
                                            <h4 class="font-semibold mb-2">Saved Addresses</h4>
                                            <div id="saved-addresses" class="space-y-2">
                                                ${State.savedAddresses.length === 0 ? '<div class="text-sm text-slate-500">No saved addresses</div>' : State.savedAddresses.map((a,idx) => `
                                                    <div class="p-2 border rounded flex justify-between items-center" data-test-id="saved-address-${idx}">
                                                        <div><div class="font-medium">${a.name}</div><div class="text-sm">${a.address}, ${a.city} ${a.postal}</div></div>
                                                        <div class="flex gap-2"><button onclick="(function(i){ State.savedAddresses.splice(i,1); localStorage.setItem('mock_addresses', JSON.stringify(State.savedAddresses)); Actions.updateUI(); })(${idx})" class="text-red-600" data-test-id="remove-address-${idx}">Remove</button></div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <div class="mt-3 grid grid-cols-1 gap-2">
                                                <input id="addr-name" placeholder="Full name" class="border p-2 rounded" data-test-id="addr-name">
                                                <input id="addr-line" placeholder="Address" class="border p-2 rounded" data-test-id="addr-line">
                                                <input id="addr-city" placeholder="City" class="border p-2 rounded" data-test-id="addr-city">
                                                <input id="addr-postal" placeholder="Postal" class="border p-2 rounded" data-test-id="addr-postal">
                                                <input id="addr-country" placeholder="Country" class="border p-2 rounded" data-test-id="addr-country">
                                                <div class="flex gap-2"><button onclick="(function(){ const a={ name:document.getElementById('addr-name').value, address:document.getElementById('addr-line').value, city:document.getElementById('addr-city').value, postal:document.getElementById('addr-postal').value, country:document.getElementById('addr-country').value }; State.savedAddresses.push(a); localStorage.setItem('mock_addresses', JSON.stringify(State.savedAddresses)); Actions.updateUI(); })()" class="px-3 py-2 bg-indigo-600 text-white rounded" data-test-id="save-address">Save Address</button><button onclick="document.getElementById('addr-name').value='';document.getElementById('addr-line').value='';document.getElementById('addr-city').value='';document.getElementById('addr-postal').value='';document.getElementById('addr-country').value='';" class="px-3 py-2 border rounded">Clear</button></div>
                                            </div>
                                        </div>
                                        <div class="mt-4">
                                            <h4 class="font-semibold mb-2">Payment Methods</h4>
                                            <div id="payment-methods" class="space-y-2">
                                                ${State.paymentMethods.length === 0 ? '<div class="text-sm text-slate-500">No saved cards</div>' : State.paymentMethods.map((c,idx)=>`<div class="p-2 border rounded flex justify-between items-center" data-test-id="card-${idx}"><div><div class="font-medium">**** **** **** ${c.last4}</div><div class="text-sm">${c.brand} • ${c.exp}</div></div><div><button onclick="(function(i){ State.paymentMethods.splice(i,1); localStorage.setItem('mock_cards', JSON.stringify(State.paymentMethods)); Actions.updateUI(); })(${idx})" class="text-red-600" data-test-id="remove-card-${idx}">Remove</button></div></div>`).join('')}
                                            </div>
                                            <div class="mt-3 grid grid-cols-1 gap-2">
                                                <input id="card-brand" placeholder="Brand (Visa)" class="border p-2 rounded" data-test-id="card-brand">
                                                <input id="card-last4" placeholder="Last 4 (1234)" class="border p-2 rounded" data-test-id="card-last4">
                                                <input id="card-exp-new" placeholder="MM/YY" class="border p-2 rounded" data-test-id="card-exp-new">
                                                <div class="flex gap-2"><button onclick="(function(){ const c={ brand:document.getElementById('card-brand').value, last4:document.getElementById('card-last4').value, exp:document.getElementById('card-exp-new').value }; State.paymentMethods.push(c); localStorage.setItem('mock_cards', JSON.stringify(State.paymentMethods)); Actions.updateUI(); })()" class="px-3 py-2 bg-indigo-600 text-white rounded" data-test-id="save-card">Save Card</button><button onclick="document.getElementById('card-brand').value='';document.getElementById('card-last4').value='';document.getElementById('card-exp-new').value='';" class="px-3 py-2 border rounded">Clear</button></div>
                                            </div>
                                        </div>
                                        <div class="mt-4">
                                            <button onclick="Actions.toggleAccordion('notif')" class="w-full px-4 py-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100">
                                                <span class="font-medium">Email Notifications</span>
                                                <i data-lucide="${State.openAccordion === 'notif' ? 'chevron-up' : 'chevron-down'}"></i>
                                            </button>
                                            ${State.openAccordion === 'notif' ? `<div class="p-4 border-t border-slate-200"><label class="flex gap-2"><input type="checkbox" checked> Order Updates</label></div>` : ''}
                                        </div>
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
                        ${orders.length === 0 ? `<p class="text-slate-500">No orders found.</p>` : orders.sort((a, b) => b.date.localeCompare(a.date)).map(order => `
                            <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm" data-test-id="order-card-${order.id}">
                                <div class="flex justify-between items-center mb-4 pb-4 border-b">
                                    <div><p class="font-bold text-sm text-slate-500">ORDER ID</p><p class="font-mono text-slate-800">#${order.id}</p></div>
                                    <div class="text-right"><p class="font-bold text-sm text-slate-500">DATE</p><p class="font-mono text-slate-800">${new Date(order.date).toLocaleDateString()}</p></div>
                                    <div class="text-right"><span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span></div>
                                </div>
                                <div class="flex justify-between font-bold pt-2">
                                    <span>Total: $${order.total.toFixed(2)}</span>
                                    <div class="flex gap-2">
                                        <button onclick="Actions.downloadInvoice('${order.id}')" class="text-indigo-600 text-sm hover:underline flex items-center gap-1" data-test-id="download-invoice-${order.id}"><i data-lucide="download" size="14"></i> Invoice</button>
                                        <button onclick="Actions.openComplaintModal('${order.id}')" class="text-red-600 text-sm hover:underline flex items-center gap-1" data-test-id="report-issue-${order.id}"><i data-lucide="message-circle-warning" size="14"></i> Report Issue</button>
                                        <button onclick="renderOrderTrackingModal('${order.id}')" class="text-blue-600 text-sm hover:underline flex items-center gap-1" data-test-id="track-order-${order.id}"><i data-lucide="truck" size="14"></i> Track Order</button>
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
                            <div class="flex gap-2">
                                <button onclick="Actions.setView('checkout')" class="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700" data-test-id="checkout-btn">Checkout</button>
                                <button onclick="Actions.exportCartCSV()" class="flex-1 border py-3 rounded" data-test-id="export-cart-csv">Export CSV</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderWishlist(container) {
            const list = JSON.parse(localStorage.getItem('mock_wishlist') || '[]');
            container.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 py-8" data-test-id="wishlist-page">
                    <h1 class="text-2xl font-bold mb-6">My Wishlist</h1>
                    ${list.length === 0 ? `<p class="text-slate-500">No items in wishlist.</p>` : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${list.map(i => `
                                <div class="bg-white p-4 rounded shadow-sm border" data-test-id="wishlist-item-${i.id}">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="font-semibold">${i.name}</h3>
                                            <div class="text-indigo-600 font-medium">$${i.price.toFixed(2)}</div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <button onclick="Actions.addToCart(MOCK_PRODUCTS.find(p=>p.id==='${i.id}'))" class="bg-indigo-600 text-white px-3 py-1 rounded" data-test-id="wishlist-add-${i.id}">Add to Cart</button>
                                            <button onclick="Actions.removeFromWishlist('${i.id}')" class="text-red-600" data-test-id="wishlist-remove-${i.id}">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
        }

        function renderCompare(container) {
            const ids = State.compare.slice(0,3);
            const products = ids.map(id => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean);
            container.innerHTML = `
                <div class="max-w-7xl mx-auto px-4 py-8" data-test-id="compare-page">
                    <h1 class="text-2xl font-bold mb-4">Compare Products</h1>
                    ${products.length === 0 ? `<p class="text-slate-500">No products selected for comparison.</p>` : `
                        <div class="grid grid-cols-${products.length} gap-4">
                            ${products.map(p => `
                                <div class="bg-white p-4 rounded border" data-test-id="compare-card-${p.id}">
                                    <div class="text-6xl mb-2">${p.image}</div>
                                    <div class="font-bold">${p.name}</div>
                                    <div class="text-indigo-600 font-semibold mt-2">$${p.price.toFixed(2)}</div>
                                    <div class="text-sm mt-2">${p.description}</div>
                                    <div class="mt-3 flex gap-2"><button onclick="addToCartWrapper('${p.id}')" class="px-3 py-1 bg-indigo-600 text-white rounded" data-test-id="compare-add-${p.id}">Add to Cart</button><button onclick="(function(id){ State.compare = State.compare.filter(x=>x!==id); Actions.updateUI(); })('${p.id}')" class="px-3 py-1 border rounded" data-test-id="compare-remove-${p.id}">Remove</button></div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
        }

        // Track Order feature removed

        // Add selected products to cart
        Actions.addSelectedToCart = () => {
            const ids = Array.from(State.selectedProducts);
            ids.forEach(id => {
                const p = MOCK_PRODUCTS.find(x => x.id === id);
                if (p) Actions.addToCart(p);
            });
            // clear selection
            State.selectedProducts = new Set();
            Actions.updateUI();
        };

        Actions.exportCartCSV = () => {
            const rows = [['id','name','price','quantity']];
            State.cart.forEach(i => rows.push([i.id, i.name.replace(/,/g,' '), i.price.toFixed(2), i.quantity]));
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `cart-${Date.now()}.csv`; a.click();
        };

        function renderLogin(container) {
            container.innerHTML = `
                <div class="min-h-[80vh] flex items-center justify-center">
                    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md border" data-test-id="login-form">
                        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
                        <form onsubmit="handleLogin(event)" class="space-y-4">
                            <div><label class="block text-sm font-medium mb-1">Email</label><input type="email" id="login-email" required class="w-full border p-2 rounded" data-test-id="input-email"></div>
                            <div><label class="block text-sm font-medium mb-1">Password</label><input type="password" id="login-password" required class="w-full border p-2 rounded" data-test-id="input-password"></div>
                            <div id="login-error"></div>
                            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700" data-test-id="auth-submit-btn">Sign In</button>
                        </form>
                        <div class="mt-6 bg-slate-50 p-4 rounded-lg border">
                            <h3 class="text-sm font-bold text-slate-600 mb-2">Test Credentials</h3>
                            <div class="text-xs text-slate-500 space-y-2">
                                <p><strong class="font-medium">Admin:</strong> admin@test.com / password123</p>
                                <p><strong class="font-medium">User:</strong> user@test.com / password123</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderContact(container) {
            container.innerHTML = `
                <div class="max-w-3xl mx-auto px-4 py-12" data-test-id="contact-page">
                    <h1 class="text-2xl font-bold mb-4">Contact Us</h1>
                    <p class="text-sm text-slate-600 mb-6">Use this form to submit a message. Attach a screenshot or file to practice uploads.</p>
                    <div class="bg-white p-6 rounded shadow border">
                        <form onsubmit="event.preventDefault(); Actions.submitContact();" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Name</label>
                                <input id="contact-name" class="w-full border p-2 rounded" type="text" required data-test-id="contact-name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Email</label>
                                <input id="contact-email" class="w-full border p-2 rounded" type="email" required data-test-id="contact-email">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Message</label>
                                <textarea id="contact-message" class="w-full border p-2 rounded" rows="4" required data-test-id="contact-message"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Attach File</label>
                                <input id="contact-file" type="file" accept="image/*,.pdf,.txt" data-test-id="contact-file">
                            </div>
                            <div class="flex gap-2">
                                <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded" data-test-id="contact-submit">Send Message</button>
                                <button type="button" onclick="document.getElementById('contact-name').value='';document.getElementById('contact-email').value='';document.getElementById('contact-message').value='';document.getElementById('contact-file').value='';" class="px-4 py-2 border rounded">Clear</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        function renderCheckout(container) {
            if (State.cart.length === 0) { Actions.setView('home'); return; }
            const total = State.cart.reduce((a,i)=>a+i.price*i.quantity,0);
            const couponCode = State.checkoutData.coupon || '';
            const couponMap = {
                'DISCOUNT10': 0.10,
                'SAVE15': 0.15,
                'PROMO20': 0.20,
                'HOLIDAY25': 0.25,
                'NEWUSER30': 0.30,
                'FLASH50': 0.50,
                'BIGSALE60': 0.35,
                'CLEARANCE70': 0.40,
                'FINAL80': 0.45,
                'LASTCHANCE90': 0.50
            };
            let discount = couponMap[couponCode] || 0;
            const finalTotal = (total * (1 - discount));
            container.innerHTML = `
                <div class="max-w-2xl mx-auto py-8 px-4" data-test-id="checkout-page">
                    <h2 class="text-xl font-bold mb-4">Review Order</h2>
                    <div class="bg-slate-50 p-4 rounded mb-4 border">
                        ${State.cart.map(i => `<div class="flex justify-between"><span>${i.quantity}x ${i.name}</span><span>$${(i.price*i.quantity).toFixed(2)}</span></div>`).join('')}
                        <div class="border-t mt-2 pt-2 flex justify-between font-bold"><span>Subtotal</span><span data-test-id="review-subtotal">$${total.toFixed(2)}</span></div>
                        <div class="mt-2 flex justify-between items-center"><span class="text-sm">Discount</span><span data-test-id="review-discount">${(discount*100).toFixed(0)}%</span></div>
                        <div class="mt-2 flex justify-between font-bold"><span>Total</span><span data-test-id="review-total">$${finalTotal.toFixed(2)}</span></div>
                    </div>

                    <div class="bg-white p-4 rounded mb-4 border" data-test-id="shipping-form">
                        <h3 class="font-bold mb-2">Shipping Address</h3>
                        <div class="grid grid-cols-1 gap-2">
                            <input id="ship-name" placeholder="Full name *" class="border p-2 rounded" data-test-id="ship-name" value="${State.checkoutData.shipping.name||''}">
                            <input id="ship-address" placeholder="Address *" class="border p-2 rounded" data-test-id="ship-address" value="${State.checkoutData.shipping.address||''}">
                            <input id="ship-city" placeholder="City *" class="border p-2 rounded" data-test-id="ship-city" value="${State.checkoutData.shipping.city||''}">
                            <input id="ship-postal" placeholder="Postal code *" class="border p-2 rounded" data-test-id="ship-postal" value="${State.checkoutData.shipping.postal||''}">
                            <input id="ship-country" placeholder="Country *" class="border p-2 rounded" data-test-id="ship-country" value="${State.checkoutData.shipping.country||''}">
                        </div>
                    </div>

                    <div class="bg-white p-4 rounded mb-4 border" data-test-id="coupon-form">
                        <h3 class="font-bold mb-2">Apply Coupon</h3>
                        <div class="flex gap-2">
                            <input id="coupon-code" placeholder="Enter coupon code" class="flex-1 border p-2 rounded" data-test-id="coupon-code" value="${State.checkoutData.coupon||''}">
                            <button onclick="Actions.applyCoupon(document.getElementById('coupon-code').value); Actions.updateUI();" class="px-3 py-2 bg-amber-500 text-white rounded" data-test-id="apply-coupon-btn">Apply</button>
                        </div>
                        <div id="coupon-feedback" class="text-sm text-slate-500 mt-2" data-test-id="coupon-feedback"></div>
                    </div>

                    <div class="bg-white p-4 rounded mb-4 border" data-test-id="payment-form">
                        <h3 class="font-bold mb-2">Payment (Mock)</h3>
                        <input id="card-number" placeholder="Card number *" class="w-full border p-2 rounded mb-2" data-test-id="card-number">
                        <div class="flex gap-2">
                            <input id="card-exp" placeholder="MM/YY *" class="border p-2 rounded flex-1" data-test-id="card-exp">
                            <input id="card-cvv" placeholder="CVV *" class="border p-2 rounded w-24" data-test-id="card-cvv">
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <button onclick="completeOrder()" class="flex-1 w-full bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700" data-test-id="place-order-btn">Place Order</button>
                        <button onclick="Actions.setView('cart')" class="flex-1 border px-6 py-2 rounded" data-test-id="back-to-cart">Back</button>
                    </div>
                </div>
            `;
        }

        function renderOrderConfirmation(container) {
            const orderId = State.lastOrderId || null;
            let order = null;
            if (orderId) {
                // try to find in user-specific orders first
                if (State.user) {
                    const key = `mock_orders_${State.user.uid}`;
                    const arr = JSON.parse(localStorage.getItem(key) || '[]');
                    order = arr.find(o => String(o.id) === String(orderId));
                }
                if (!order) {
                    const arr = JSON.parse(localStorage.getItem('mock_orders_guest') || '[]');
                    order = arr.find(o => String(o.id) === String(orderId));
                }
            }

            container.innerHTML = `
                <div class="max-w-3xl mx-auto px-4 py-12" data-test-id="order-confirmation-page">
                    <h1 class="text-2xl font-bold mb-4">Order Confirmation</h1>
                    ${order ? `
                        <div class="bg-white p-6 rounded shadow border">
                            <div class="text-lg font-bold mb-2">Thank you! Your order <span class="font-mono">${order.id}</span> has been received.</div>
                            <div class="text-sm text-slate-600 mb-4">Status: ${order.status}</div>
                            <div class="mb-4">
                                <h4 class="font-bold">Items</h4>
                                <ul class="list-disc pl-6">${order.items.map(i => `<li data-test-id="confirm-item-${i.id}">${i.quantity}x ${i.name} — $${(i.price*i.quantity).toFixed(2)}</li>`).join('')}</ul>
                            </div>
                            <div class="flex justify-between font-bold border-t pt-2"><span>Total</span><span data-test-id="confirm-total">$${order.total.toFixed(2)}</span></div>
                            <div class="mt-4 text-sm text-slate-600"><strong>Shipping:</strong> ${order.shipping.name || ''}, ${order.shipping.address || ''} ${order.shipping.city || ''} ${order.shipping.postal || ''} ${order.shipping.country || ''}</div>
                            <div class="mt-6 flex gap-2">
                                <button onclick="Actions.downloadInvoice('${order.id}')" class="px-4 py-2 bg-indigo-600 text-white rounded" data-test-id="download-invoice">Download Invoice</button>
                                <button onclick="Actions.setView('orders')" class="px-4 py-2 border rounded" data-test-id="view-orders">View Orders</button>
                                <button onclick="Actions.setView('home')" class="px-4 py-2 border rounded" data-test-id="continue-shopping">Continue Shopping</button>
                            </div>
                        </div>
                    ` : `
                        <div class="bg-white p-6 rounded shadow border">
                            <p class="text-slate-600">No recent order found.</p>
                            <div class="mt-4"><button onclick="Actions.setView('home')" class="px-4 py-2 border rounded">Back to Shopping</button></div>
                        </div>
                    `}
                </div>
            `;
        }

        function renderProductDetail(container) {
            const p = State.currentProduct;
            const relatedProducts = MOCK_PRODUCTS.filter(rp => rp.category === p.category && rp.id !== p.id).slice(0, 3);
            container.innerHTML = `
                <div class="max-w-7xl mx-auto px-4 py-10" data-test-id="product-detail-page">
                    <button onclick="Actions.setView('home')" class="mb-4 text-slate-500 hover:text-indigo-600">&larr; Back</button>
                    <div class="flex flex-col md:flex-row gap-10 bg-white p-8 rounded-lg shadow-sm border">
                        <div class="w-full md:w-1/2 h-96 bg-slate-50 flex items-center justify-center text-9xl">${p.image}</div>
                        <div class="w-full md:w-1/2 space-y-4">
                            <h1 class="text-3xl font-bold" data-test-id="product-title">${p.name}</h1>
                            <p class="text-slate-600">${p.description}</p>
                            <div class="text-3xl font-bold" data-test-id="product-price">$${p.price.toFixed(2)}</div>
                            <div class="flex gap-3">
                                <button onclick="addToCartWrapper('${p.id}')" class="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700" data-test-id="add-to-cart-btn">Add to Cart</button>
                                <button onclick="renderReviewModal('${p.id}')" class="flex-1 bg-amber-50 text-amber-700 py-3 rounded-lg font-bold hover:bg-amber-100" data-test-id="open-review-btn">Write Review</button>
                            </div>
                            <div class="flex gap-3 mt-4">
                                <a href="https://twitter.com/intent/tweet?url=${window.location.href}&text=Check%20out%20this%20product:%20${p.name}" target="_blank" class="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><i data-lucide="twitter"></i></a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}" target="_blank" class="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><i data-lucide="facebook"></i></a>
                                <a href="https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${p.image}&description=Check%20out%20this%20product:%20${p.name}" target="_blank" class="p-2 bg-gray-200 rounded-full hover:bg-gray-300"><i data-lucide="pinterest"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold mb-4">Related Products</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${relatedProducts.map(rp => `
                                <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative product-card" data-test-id="product-card-${rp.id}" onclick="openProductDetail('${rp.id}')">
                                    <div class="h-48 bg-slate-50 flex items-center justify-center text-6xl cursor-pointer group-hover:bg-indigo-50">${rp.image}</div>
                                    <div class="p-4">
                                        <h3 class="font-bold text-lg truncate cursor-pointer hover:text-indigo-600">${rp.name}</h3>
                                        <div class="flex justify-between items-center mt-4">
                                            <span class="text-xl font-bold">$${rp.price.toFixed(2)}</span>
                                            <button onclick="event.stopPropagation(); addToCartWrapper('${rp.id}')" class="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"><i data-lucide="shopping-cart" size="18"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        function renderReviewModal(productId) {
            const modal = document.getElementById('modal-container');
            const p = MOCK_PRODUCTS.find(x => x.id === productId);
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-test-id="review-modal">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 class="font-bold text-lg mb-2">Write a Review for ${p.name}</h3>
                        <div class="space-y-3">
                            <label class="block text-sm font-medium">Rating</label>
                            <select id="review-rating" class="w-full border p-2 rounded" data-test-id="review-rating">
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Good</option>
                                <option value="3">3 - Okay</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Terrible</option>
                            </select>
                            <label class="block text-sm font-medium">Comment</label>
                            <textarea id="review-comment" class="w-full border p-2 rounded" rows="3" data-test-id="review-comment"></textarea>
                            <label class="block text-sm font-medium">Attach Image</label>
                            <input type="file" id="review-file" accept="image/*" class="w-full" data-test-id="review-file">
                            <div class="flex gap-2">
                                <button onclick="Actions.submitReview('${productId}')" class="flex-1 bg-indigo-600 text-white py-2 rounded" data-test-id="submit-review-btn">Submit Review</button>
                                <button onclick="document.getElementById('modal-container').innerHTML=''" class="flex-1 border py-2 rounded">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function renderAdmin(container) {
            const mockSales = Array.from({length: 7}, (_, i) => ({ day: `Day ${i+1}`, revenue: Math.floor(Math.random() * 5000) + 1000 }));
            container.innerHTML = `
                <div class="max-w-6xl mx-auto px-4 py-8" data-test-id="admin-dashboard">
                    <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white p-6 rounded shadow border"><h3 class="text-slate-500 font-bold text-sm">Revenue</h3><p class="text-3xl font-bold text-slate-900 mt-2">$12,450</p></div>
                        <div class="bg-white p-6 rounded shadow border"><h3 class="text-slate-500 font-bold text-sm">Active Orders</h3><p class="text-3xl font-bold text-slate-900 mt-2">24</p></div>
                    </div>
                    <div class="bg-white p-6 rounded shadow border mb-8">
                        <h2 class="font-bold mb-3">Sales Analytics (Last 7 Days)</h2>
                        <div class="flex justify-between items-end h-64">
                            ${mockSales.map(sale => `
                                <div class="flex flex-col items-center">
                                    <div class="bg-blue-500" style="height: ${sale.revenue / 50}px; width: 30px;"></div>
                                    <p class="text-sm mt-2">${sale.day}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded shadow border">
                        <h2 class="font-bold mb-3">Bulk Import Products (JSON/CSV)</h2>
                        <div class="flex gap-2 items-center">
                            <input type="file" accept=".json,.csv" onchange="Actions.importProducts(this)" data-test-id="import-products-input">
                            <button onclick="document.querySelector('[data-test-id=import-products-input]').value=''" class="px-3 py-2 border rounded">Clear</button>
                        </div>
                        <div class="text-sm text-slate-500 mt-2">Imported products will be appended to in-memory catalog for testing.</div>
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
        function handleLogin(e) { 
            e.preventDefault(); 
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            setTimeout(() => Actions.login(email, password), 600); 
        }
        function saveCartToStorage() {
            try {
                localStorage.setItem('mock_cart', JSON.stringify(State.cart || []));
            } catch (e) {
                console.warn('Failed to save cart', e);
            }
        }

        function completeOrder() {
            const requiredFields = ['ship-name', 'ship-address', 'ship-city', 'ship-postal', 'ship-country', 'card-number', 'card-exp', 'card-cvv'];
            for (const field of requiredFields) {
                const element = document.getElementById(field);
                if (!element || !element.value) {
                    showToast('Please fill all required fields', 'error');
                    return;
                }
            }
            setTimeout(() => {
                const total = State.cart.reduce((a,i)=>a+i.price*i.quantity,0);
                // read shipping fields if present
                const ship = {
                    name: (document.getElementById('ship-name') || {}).value || State.checkoutData.shipping.name || '',
                    address: (document.getElementById('ship-address') || {}).value || State.checkoutData.shipping.address || '',
                    city: (document.getElementById('ship-city') || {}).value || State.checkoutData.shipping.city || '',
                    postal: (document.getElementById('ship-postal') || {}).value || State.checkoutData.shipping.postal || '',
                    country: (document.getElementById('ship-country') || {}).value || State.checkoutData.shipping.country || ''
                };
                // coupon
                const coupon = (document.getElementById('coupon-code') || {}).value || State.checkoutData.coupon || null;

                // Build order
                const orderId = `ORD-${Date.now()}`;
                const order = {
                    id: orderId,
                    items: State.cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                    total,
                    date: new Date().toISOString(),
                    shipping: ship,
                    coupon,
                    status: 'Processing'
                };

                if (State.user) {
                    const key = `mock_orders_${State.user.uid}`;
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push(order);
                    localStorage.setItem(key, JSON.stringify(existing));
                } else {
                    // store guest orders under a common key
                    const key = 'mock_orders_guest';
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push(order);
                    localStorage.setItem(key, JSON.stringify(existing));
                }

                // persist last order id for confirmation view
                State.lastOrderId = orderId;

                // clear cart and persist
                State.cart = [];
                saveCartToStorage();

                // show confirmation screen with order id
                Actions.setView('order-confirmation');
                showToast('Order Placed! (Mock)', 'success');
            }, 800);
        }

        /*
        * Applies a coupon to the cart.
        * @param {string} code - The coupon code to apply.
        */
        Actions.applyCoupon = (code) => {
            const c = (code || '').trim().toUpperCase();
            const couponMap = {
                'DISCOUNT10': 0.10,
                'SAVE15': 0.15,
                'PROMO20': 0.20,
                'HOLIDAY25': 0.25,
                'NEWUSER30': 0.30,
                'FLASH50': 0.50,
                'BIGSALE60': 0.35,
                'CLEARANCE70': 0.40,
                'FINAL80': 0.45,
                'LASTCHANCE90': 0.50
            };

            const fb = document.getElementById('coupon-feedback');

            if (couponMap[c]) {
                State.checkoutData.coupon = c;
                if (fb) fb.textContent = `Coupon applied: ${couponMap[c] * 100}% off`;
            } else {
                State.checkoutData.coupon = null;
                if (fb) fb.textContent = 'Invalid coupon';
            }
        };
        function showToast(msg, type) {
            const container = document.getElementById('toast-container');
            const el = document.createElement('div');
            el.className = `toast ${type === 'success' ? 'bg-green-600' : (type === 'error' ? 'bg-red-600' : 'bg-blue-600')} text-white p-4 rounded shadow-lg animate-slideUp`;
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

        // --- Small CSV parser for imports ---
        function csvToJson(raw) {
            const lines = raw.split(/\r?\n/).filter(Boolean);
            if (lines.length === 0) return [];
            const headers = lines[0].split(',').map(h => h.trim());
            const out = [];
            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].split(',').map(p => p.trim());
                const obj = {};
                headers.forEach((h, idx) => obj[h] = parts[idx] || '');
                out.push(obj);
            }
            return out;
        }

        // Inject hover/focus styles for cart icon (beige color + popout)
        function applyCartHoverStyle(){
            if(typeof document === 'undefined') return;
            if(document.getElementById('cart-hover-style')) return;
            const css = `
                /* Icon hover/focus: beige color and slight popout for cart and test-data */
                [data-test-id="cart-icon"], [data-test-id="test-data-btn"] { transition: box-shadow 150ms ease, transform 150ms ease; display: inline-block; }
                [data-test-id="cart-icon"] i, [data-test-id="cart-icon"] svg, [data-test-id="test-data-btn"] i, [data-test-id="test-data-btn"] svg { transition: transform 150ms ease, color 150ms ease; transform-origin: center; color: #000 !important; }
                [data-test-id="cart-icon"]:hover, [data-test-id="cart-icon"]:focus, [data-test-id="test-data-btn"]:hover, [data-test-id="test-data-btn"]:focus { box-shadow: 0 8px 20px rgba(237,217,176,0.12); border-radius: 9999px; }
                [data-test-id="cart-icon"]:hover i, [data-test-id="cart-icon"]:focus i, [data-test-id="cart-icon"]:hover svg, [data-test-id="cart-icon"]:focus svg,
                [data-test-id="test-data-btn"]:hover i, [data-test-id="test-data-btn"]:focus i, [data-test-id="test-data-btn"]:hover svg, [data-test-id="test-data-btn"]:focus svg { color: #EDD9B0 !important; transform: translateY(-4px) scale(1.08); }
            `;
            const style = document.createElement('style');
            style.id = 'cart-hover-style';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        function renderOrderTrackingModal(orderId) {
            const modal = document.getElementById('modal-container');
            const statuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
            const currentStatusIndex = Math.floor(Math.random() * statuses.length);
            modal.innerHTML = `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" data-test-id="order-tracking-modal">
                    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 class="font-bold text-lg mb-4">Track Order #${orderId}</h3>
                        <div class="flex justify-between items-center">
                            ${statuses.map((status, index) => `
                                <div class="flex flex-col items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-green-500' : 'bg-gray-300'}">
                                        <i data-lucide="check" class="text-white"></i>
                                    </div>
                                    <p class="text-sm mt-2">${status}</p>
                                </div>
                                ${index < statuses.length - 1 ? '<div class="flex-1 h-1 bg-gray-300"></div>' : ''}
                            `).join('')}
                        </div>
                        <div class="flex justify-end mt-4">
                            <button onclick="document.getElementById('modal-container').innerHTML=''" class="px-4 py-2 text-slate-600">Close</button>
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }

        window.onload = () => { 
            applyCartHoverStyle(); 
            try { State.wishlist = JSON.parse(localStorage.getItem('mock_wishlist') || '[]'); } catch(e) { State.wishlist = []; }
            try { State.cart = JSON.parse(localStorage.getItem('mock_cart') || '[]'); } catch(e) { State.cart = []; }
            try { State.savedAddresses = JSON.parse(localStorage.getItem('mock_addresses') || '[]'); } catch(e) { State.savedAddresses = []; }
            try { State.paymentMethods = JSON.parse(localStorage.getItem('mock_cards') || '[]'); } catch(e) { State.paymentMethods = []; }
            Actions.updateUI(); 
        };
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
        window.renderOrderTrackingModal = renderOrderTrackingModal;