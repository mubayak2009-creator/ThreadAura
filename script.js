// ===== LOAD PRODUCTS FROM LOCALSTORAGE OR DEFAULT =====
let products = JSON.parse(localStorage.getItem("products")) || [
    {id: 1, title: "Smartphone", price: 299, rating: 4.5, image: "https://via.placeholder.com/300"},
    {id: 2, title: "Laptop", price: 899, rating: 4.7, image: "https://via.placeholder.com/300"},
    {id: 3, title: "Headphones", price: 99, rating: 4.2, image: "https://via.placeholder.com/300"},
];

// ===== CART LOGIC =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    document.querySelectorAll("#cart-count").forEach(span => {
        span.textContent = cart.length;
    });
}

// Add to cart
function addToCart(productId) {
    productId = Number(productId); // ✅ FIX

    const product = products.find(p => p.id === productId);

    if (!product) {
        alert("Product not found!");
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.title} added to cart!`);
}


// ===== DISPLAY PRODUCTS =====
function displayProducts(containerId, productList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    productList.forEach(product => {
        const stars =
            "★".repeat(Math.floor(product.rating)) +
            "☆".repeat(5 - Math.floor(product.rating));

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <p class="stars">${stars}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;


        const addBtn = card.querySelector(".add-to-cart-btn");
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            addToCart(Number(product.id)); 
        });

        card.addEventListener("click", () => {
            localStorage.setItem("productId", product.id);
            window.location.href = "product.html";
        });

        container.appendChild(card);
    });
}


// ===== SEARCH & SORT =====
function setupFilters() {
    const searchInput = document.getElementById("search");
    const sortSelect = document.getElementById("sort");
    if(searchInput) {
        searchInput.addEventListener("input", ()=>{
            const filtered = products.filter(p => p.title.toLowerCase().includes(searchInput.value.toLowerCase()));
            displayProducts("products-list", filtered);
        });
    }
    if(sortSelect) {
        sortSelect.addEventListener("change", ()=>{
            let sorted = [...products];
            if(sortSelect.value === "price-asc") sorted.sort((a,b)=>a.price-b.price);
            if(sortSelect.value === "price-desc") sorted.sort((a,b)=>b.price-a.price);
            if(sortSelect.value === "rating-desc") sorted.sort((a,b)=>b.rating-a.rating);
            displayProducts("products-list", sorted);
        });
    }
}

// ===== DISPLAY CART =====
function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    if(!cartContainer) return;
    cartContainer.innerHTML = "";
    if(cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("cart-summary").style.display = "none";
        return;
    }
    document.getElementById("cart-summary").style.display = "block";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>Price: $${item.price}</p>
                <input type="number" min="1" value="${item.quantity}" class="quantity-input">
                <button class="remove-btn">Remove</button>
            </div>
        `;
        div.querySelector(".quantity-input").addEventListener("change", (e)=>{
            item.quantity = parseInt(e.target.value);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
        div.querySelector(".remove-btn").addEventListener("click", ()=>{
            cart = cart.filter(c => c.id !== item.id);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartCount();
        });
        cartContainer.appendChild(div);
    });
    document.getElementById("total-price").textContent = total.toFixed(2);

    const checkoutBtn = document.getElementById("checkout-btn");
    if(checkoutBtn){
        checkoutBtn.addEventListener("click", ()=>{
            const name = prompt("Enter your name:");
            const email = prompt("Enter your email:");
            const address = prompt("Enter your address:");
            const payment = prompt("Enter payment method:");
            if(name && email && address && payment){
                alert("Checkout successful!");
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart();
                updateCartCount();
            } else {
                alert("All fields are required.");
            }
        });
    }
}

// ===== DISPLAY PRODUCT DETAILS =====
function displayProductDetails() {
    const container = document.getElementById("product-details");
    if (!container) return;

    const productId = Number(localStorage.getItem("productId"));

    // ✅ Load products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];

    const product = products.find(p => Number(p.id) === productId);

    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    const stars =
        "★".repeat(Math.floor(product.rating || 0)) +
        "☆".repeat(5 - Math.floor(product.rating || 0));

    container.innerHTML = `
        <div class="product-details-container">
            <img src="${product.image}" alt="${product.title}">
            <div class="product-info">
                <h2>${product.title}</h2>
                <p class="price">$${Number(product.price).toFixed(2)}</p>
                <p class="stars">${stars}</p>
                <p>${product.description || "No description available."}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}


// ===== INIT =====
window.addEventListener("DOMContentLoaded", () => {

    // ✅ Load products from localStorage
    window.products = JSON.parse(localStorage.getItem("products")) || [];

    // ✅ Load cart
    window.cart = JSON.parse(localStorage.getItem("cart")) || [];

    updateCartCount();

    // ✅ Featured products (latest 4)
    if (document.getElementById("featured-products")) {
        const featuredProducts = [...products].slice(-4).reverse();
        displayProducts("featured-products", featuredProducts);
    }

    // ✅ Products page
    if (document.getElementById("products-list")) {
        displayProducts("products-list", products);
        setupFilters();
    }

    // ✅ Cart page
    displayCart();

    // ✅ Product details page
    displayProductDetails();
});

