// Menu Data
// Menu Data
const menuProducts = [
    {
        id: 1,
        name: "Rendang Daging",
        description: "Rendang daging sapi dengan bumbu rempah khas Minang yang kaya rasa",
        price: 35000,
        category: "daging",
        rating: 5,
        popular: true,
        image: "images/RENDANG.jpg"  // Correct path for images
    },
    {
        id: 2,
        name: "Ayam Pop",
        description: "Ayam kampung goreng khas Padang dengan bumbu kuning yang gurih",
        price: 28000,
        category: "ayam",
        rating: 4.8,
        popular: true,
        image: "images/AYAM_POP.jpg" // Correct path for images
    },
    // Add more menu items here...
];

// Load menu dynamically
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();
    initializeAnimations();
    setupNavigation();
});

// Product Loading Functions
function loadProducts() {
    showLoading();
    
    setTimeout(() => {
        const productsToShow = menuProducts.slice(0, currentDisplayedProducts);
        renderProducts(productsToShow);
        updateLoadMoreButton();
        hideLoading();
    }, 500);
}

function renderProducts(products) {
    productsGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
        
        // Add staggered animation
        setTimeout(() => {
            productCard.classList.add('fade-in-up');
        }, index * 100);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                ${generateStars(product.rating)} (${product.rating})
            </div>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i>
                Tambah ke Keranjang
            </button>
        </div>
    `;
    return card;
}


function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function loadMoreProducts() {
    currentDisplayedProducts += 6;
    loadProducts();
}

function updateLoadMoreButton() {
    if (currentDisplayedProducts >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.innerHTML = `
            <i class="fas fa-plus"></i>
            Lihat ${Math.min(6, filteredProducts.length - currentDisplayedProducts)} Menu Lainnya
        `;
    }
}

// Cart Functions
function addToCart(productId) {
    const product = menuProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${product.name} ditambahkan ke keranjang!`);
    
    // Add cart animation
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            renderCartItems();
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: Rp ${formatPrice(totalPrice)}`;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #718096;">Keranjang belanja kosong</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">Rp ${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; background: #feb2b2;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function openCart() {
    renderCartItems();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification('Pesanan berhasil! Kami akan menghubungi Anda segera.', 'success');
        cart = [];
        updateCartUI();
        closeCart();
    }, 2000);
}

// Search and Filter Functions
function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        searchInput.focus();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceRange = priceFilter.value;
    const category = categoryFilter.value;
    
    filteredProducts = menuProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        const matchesPrice = !priceRange || checkPriceRange(product.price, priceRange);
        const matchesCategory = !category || product.category === category;
        
        return matchesSearch && matchesPrice && matchesCategory;
    });
    
    currentDisplayedProducts = 6;
    loadProducts();
}

function checkPriceRange(price, range) {
    const [min, max] = range.split('-').map(Number);
    if (max) {
        return price >= min && price <= max;
    } else {
        return price >= min;
    }
}

// Navigation Functions
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Utility Functions
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading() {
    loadingSpinner.classList.add('show');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements for animation
    document.querySelectorAll('.section-header, .about-item, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
        if (cartModal.classList.contains('active')) {
            closeCart();
        }
    }
});

// Click outside to close modals
document.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        toggleSearch();
    }
    if (e.target === cartModal) {
        closeCart();
    }
});

// Mobile menu toggle (for future implementation)
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Performance optimization: Debounce search
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterProducts, 300);
});

// Add loading state to buttons
function addButtonLoading(button, originalText) {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
    }, 1000);
}

// Enhanced cart functionality
function clearCart() {
    cart = [];
    updateCartUI();
    renderCartItems();
    showNotification('Keranjang dikosongkan!');
}

// Add to favorites (for future implementation)
let favorites = [];

function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Dihapus dari favorit');
    } else {
        favorites.push(productId);
        showNotification('Ditambahkan ke favorit');
    }
}

// Quick view functionality (for future implementation)
function quickView(productId) {
    const product = menuProducts.find(p => p.id === productId);
    // Implementation for quick view modal
    console.log('Quick view for:', product.name);
}

// Social sharing (for future implementation)
function shareProduct(productId) {
    const product = menuProducts.find(p => p.id === productId);
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: product.description,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        showNotification('Link berhasil disalin!');
    }
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Implementation for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track product views
function trackProductView(productId) {
    trackEvent('product_view', { product_id: productId });
}

// Track add to cart events
function trackAddToCart(productId) {
    trackEvent('add_to_cart', { product_id: productId });
}