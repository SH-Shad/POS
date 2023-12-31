// script.js
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || {};

function fetchProducts() {
    fetch('https://raw.githubusercontent.com/SH-Shad/POS/main/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts();
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProducts(searchTerm = '') {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = '';
    products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase())).forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            ${product.name} - $${product.price.toFixed(2)}
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function searchProducts() {
    const searchTerm = document.getElementById("productSearch").value;
    displayProducts(searchTerm);
}

function addToCart(productId) {
    if (!cart[productId]) {
        cart[productId] = { ...products.find(p => p.id === productId), quantity: 0 };
    }
    cart[productId].quantity++;
    updateCartDisplay();
    saveCart();
}

function removeFromCart(productId) {
    if (cart[productId].quantity > 1) {
        cart[productId].quantity--;
    } else {
        delete cart[productId];
    }
    updateCartDisplay();
    saveCart();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = "";
    Object.values(cart).forEach(item => {
        const itemLi = document.createElement("li");
        itemLi.innerText = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
        const removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        removeButton.onclick = function() { removeFromCart(item.id); };
        itemLi.appendChild(removeButton);
        cartItems.appendChild(itemLi);
    });

    const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("total").innerText = total.toFixed(2);
}

function checkout() {
    const receipt = Object.values(cart).map(item => 
        `${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    alert(`Receipt:\n${receipt}\nTotal: $${document.getElementById("total").innerText}`);
    cart = {};
    updateCartDisplay();
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = fetchProducts;