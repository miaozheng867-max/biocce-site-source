/**
 * BIOCCE Products Data Manager
 * All product data comes from data/products.json
 */

const BIOCCE_DATA_URL = '/data/products.json';

let productsCache = null;

// Load all products
async function loadProducts() {
    if (productsCache) return productsCache;
    try {
        const res = await fetch(BIOCCE_DATA_URL + '?t=' + Date.now());
        productsCache = await res.json();
        return productsCache;
    } catch (e) {
        console.error('Failed to load products:', e);
        return [];
    }
}

// Get product by ID
async function getProduct(id) {
    const products = await loadProducts();
    return products.find(p => p.id === id) || null;
}

// Get products by category
async function getProductsByCategory(category) {
    const products = await loadProducts();
    return products.filter(p => p.category === category);
}

// Get featured products
async function getFeaturedProducts() {
    const products = await loadProducts();
    return products.filter(p => p.featured);
}

// Render product card HTML
function renderProductCard(product) {
    const img = product.images && product.images[0] ? product.images[0] : 'images/placeholder.svg';
    const priceHtml = product.price ? `<div class="product-price">${product.price}</div>` : '';
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-card-image">
                <img src="${img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-card-body">
                <h3 class="product-card-title">${product.name}</h3>
                <div class="product-card-model">Model: ${product.model}</div>
                <p class="product-card-desc">${product.description.substring(0, 120)}...</p>
                ${priceHtml}
                <a href="/product.html?id=${product.id}" class="btn btn-primary btn-sm">View Details</a>
            </div>
        </div>
    `;
}

// Render spec table
function renderSpecs(specs) {
    if (!specs || specs.length === 0) return '';
    let html = '<table class="spec-table"><tbody>';
    specs.forEach(s => {
        html += `<tr><td class="spec-label">${s.label}</td><td class="spec-value">${s.value}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
}
