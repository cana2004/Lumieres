const API_BASE = window.LUMIERES_API_URL || localStorage.getItem('lumieresApiUrl') || '';

async function api(path, options = {}) {
  if (!API_BASE) throw new Error('API not configured');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {'Content-Type':'application/json', ...(options.headers || {})},
    ...options
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

async function getProducts() {
  try { return await api('/api/products'); }
  catch (_) { return window.LUMIERES_PRODUCTS || []; }
}

async function getProduct(id) {
  try { return await api(`/api/products/${id}`); }
  catch (_) { return (window.LUMIERES_PRODUCTS || []).find(p => Number(p.id) === Number(id)); }
}

function money(value) { return `${Number(value).toLocaleString('sq-AL')}L`; }

function getCart() { return JSON.parse(localStorage.getItem('lumieresCart') || '[]'); }
function saveCart(cart) { localStorage.setItem('lumieresCart', JSON.stringify(cart)); updateCartBadge(); }
function addToCart(product, quantity = 1, scent = '') {
  const cart = getCart();
  const key = `${product.id}-${scent}`;
  const existing = cart.find(item => item.key === key);
  if (existing) existing.quantity += quantity;
  else cart.push({key, productId:product.id, name:product.name, price:product.price, image:product.image, scent, quantity});
  saveCart(cart);
  alert(`${product.name} u shtua në shportë.`);
}
function updateCartBadge() {
  const qty = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = qty);
}
function productCard(product) {
  return `<div class="pro" data-id="${product.id}">
    <img src="${product.image}" alt="${product.name}" class="product-open">
    <div class="des product-open"><span>${product.category}</span><h5>${product.name}</h5>
      <div class="star"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
      <h4>${money(product.price)}</h4></div>
    <button class="cart add-card-cart" aria-label="Add to cart"><i class="fas fa-shopping-cart"></i></button>
  </div>`;
}
async function renderProducts(containerId, filter = () => true) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const products = (await getProducts()).filter(filter);
  container.innerHTML = products.map(productCard).join('');
  container.querySelectorAll('.product-open').forEach(el => el.addEventListener('click', () => {
    location.href = `product.html?id=${el.closest('.pro').dataset.id}`;
  }));
  container.querySelectorAll('.add-card-cart').forEach(btn => btn.addEventListener('click', async e => {
    e.stopPropagation();
    const product = products.find(p => Number(p.id) === Number(btn.closest('.pro').dataset.id));
    addToCart(product, 1, product.scents?.[0] || '');
  }));
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
