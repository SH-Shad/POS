let cart = JSON.parse(localStorage.getItem('cart')) || {};

async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        console.error("Could not load products: ", error);
    }
}

function displayProducts(products) {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.innerHTML = `
            ${product.name} - $${product.price.toFixed(2)}
            <button onclick="addToCart(${JSON.stringify(product)})">Add to Cart</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function addToCart(product) {
    if (!cart[product.id]) {
        cart[product.id] = { ...product, quantity: 0 };
    }
    cart[product.id].quantity++;
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
    // Generate a simple receipt
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

window.onload = function() {
    fetchProducts(); // Fetch products on page load
    updateCartDisplay();
};