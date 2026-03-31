// --- Product Data ---
const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics",
    description: "Industry-leading noise cancellation technology ensures a premium audio experience. Features a 30-hour battery life and fast charging."
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    price: 129.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Accessories",
    description: "A sleek, minimalist watch featuring a genuine leather strap and scratch-resistant sapphire crystal glass."
  },
  {
    id: 3,
    name: "Smart Fitness Tracker",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=500&q=80",
    category: "Electronics",
    description: "Track your health and fitness goals. Includes heart rate monitoring, sleep tracking, and a water-resistant design."
  },
  {
    id: 4,
    name: "Classic Denim Jacket",
    price: 79.00,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80",
    category: "Clothing",
    description: "A timeless denim jacket that pairs perfectly with any casual outfit. Made with 100% durable cotton."
  },
  {
    id: 5,
    name: "Polarized Sunglasses",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
    category: "Accessories",
    description: "Protect your eyes with style. These polarized sunglasses reduce glare and provide 100% UV protection."
  },
  {
    id: 6,
    name: "Ergonomic Office Chair",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
    category: "Furniture",
    description: "Designed for all-day comfort. Features adjustable lumbar support, breathable mesh, and sleek modern styling."
  },
  {
    id: 7,
    name: "Premium Coffee Beans (1kg)",
    price: 24.50,
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80",
    category: "Groceries",
    description: "Ethically sourced, single-origin coffee beans with notes of dark chocolate and cherry."
  },
  {
    id: 8,
    name: "Canvas Backpack",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    category: "Accessories",
    description: "A durable and spacious canvas backpack, perfect for daily commutes or weekend getaways."
  }
];

// --- Theme Management ---
function initTheme() {
  const toggleSwitch = document.querySelector('.theme-switch input');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (toggleSwitch && currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', function(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }    
    });
  }
}

// --- Mobile Menu ---
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// --- Cart Management ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  
  // Optional: show a small toast or notification
  alert(`${product.name} has been added to the cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartCount();
      renderCart();
    }
  }
}

// --- Page Renderers ---

// 1. Render Products (Home & Shop pages)
function renderProductGrid(items, containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const displayItems = limit ? items.slice(0, limit) : items;

  if (displayItems.length === 0) {
    container.innerHTML = '<div class="empty-state">No products found.</div>';
    return;
  }

  displayItems.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-container">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <span class="product-price">$${product.price.toFixed(2)}</span>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 2. Setup Shop Page Filters
function initShopFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  if (!searchInput || !categoryFilter) return;

  function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(p => {
      const matchQuery = p.name.toLowerCase().includes(query);
      const matchCategory = category === 'All' ? true : p.category === category;
      return matchQuery && matchCategory;
    });

    renderProductGrid(filtered, 'shop-products');
  }

  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
}

// 3. Render Single Product Details
function renderProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  const container = document.getElementById('product-details-container');

  if (!container || !productId) return;

  const product = products.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = '<div class="empty-state">Product not found.</div>';
    return;
  }

  container.innerHTML = `
    <div class="details-img-container">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="details-info">
      <h1>${product.name}</h1>
      <span class="details-price">$${product.price.toFixed(2)}</span>
      <p class="details-description">${product.description}</p>
      <div>
        <span style="display:inline-block; margin-bottom: 1rem; padding: 0.25rem 0.5rem; background: var(--border-color); border-radius: 4px; font-size: 0.85rem;">
          Category: ${product.category}
        </span>
      </div>
      <button class="btn btn-primary" onclick="addToCart(${product.id})" style="width: fit-content; padding: 1rem 2rem;">
        Add to Cart
      </button>
    </div>
  `;
}

// 4. Render Cart
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-price');
  
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = '<tr><td colspan="5" class="empty-state">Your cart is empty. <br> <a href="products.html" class="btn btn-outline mt-1">Shop Now</a></td></tr>';
    totalEl.textContent = '$0.00';
    return;
  }

  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}">
          <span>${item.name}</span>
        </div>
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <input type="text" class="qty-input" value="${item.quantity}" readonly>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger" onclick="removeFromCart(${item.id})" style="padding: 0.5rem;">Remove</button>
      </td>
    `;
    container.appendChild(tr);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// 5. Setup Checkout Form
function initCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Dummy checkout success
    alert("Thank you for your order! This was a dummy checkout.");
    cart = [];
    saveCart();
    window.location.href = 'index.html';
  });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  updateCartCount();

  // Route determining based on containers presents
  if (document.getElementById('featured-products')) {
    renderProductGrid(products, 'featured-products', 4);
  }

  if (document.getElementById('shop-products')) {
    renderProductGrid(products, 'shop-products');
    initShopFilters();
  }

  if (document.getElementById('product-details-container')) {
    renderProductDetails();
  }

  if (document.getElementById('cart-items-container')) {
    renderCart();
  }

  if (document.getElementById('checkout-form')) {
    initCheckout();
  }
});
