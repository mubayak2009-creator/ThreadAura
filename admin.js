// ===== ADMIN PROTECTION =====
const isAdmin = localStorage.getItem("isAdmin") === "true";

if (!isAdmin) {
    alert("Access denied. Admins only.");
}

// ===== LOAD PRODUCTS =====
let products = JSON.parse(localStorage.getItem("products")) || [];

// ===== DISPLAY PRODUCTS =====
function displayProducts() {
    const container = document.getElementById("admin-products");
    container.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <img src="${product.image}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
            <p class="stars">
                ${"★".repeat(Math.floor(product.rating))}
                ${"☆".repeat(5 - Math.floor(product.rating))}
            </p>
            <div class="card-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // DELETE
        div.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Delete this product?")) {
                products = products.filter(p => p.id !== product.id);
                saveProducts();
            }
        });

        // EDIT
        div.querySelector(".edit-btn").addEventListener("click", () => {
            document.getElementById("product-id").value = product.id;
            document.getElementById("title").value = product.title;
            document.getElementById("price").value = product.price;
            document.getElementById("rating").value = product.rating;
            document.getElementById("image").value = product.image;

            document.getElementById("form-title").textContent = "Edit Product";
            document.getElementById("submit-btn").textContent = "Update Product";
            document.getElementById("cancel-edit").style.display = "inline-block";
        });

        container.appendChild(div);
    });
}

// ===== SAVE PRODUCTS =====
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// ===== FORM SUBMIT =====
document.getElementById("product-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("product-id").value;
    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const rating = parseFloat(document.getElementById("rating").value);
    const image = document.getElementById("image").value.trim();

    if (!title || !price || !rating || !image) {
        alert("Please fill all fields");
        return;
    }

    if (id) {
        products = products.map(p =>
            p.id == id ? { id: p.id, title, price, rating, image } : p
        );
    } else {
        products.push({
            id: Date.now(),
            title,
            price,
            rating,
            image
        });
    }

    resetForm();
    saveProducts();
});

// ===== RESET FORM =====
function resetForm() {
    document.getElementById("product-form").reset();
    document.getElementById("product-id").value = "";
    document.getElementById("form-title").textContent = "Add New Product";
    document.getElementById("submit-btn").textContent = "Add Product";
    document.getElementById("cancel-edit").style.display = "none";
}

document.getElementById("cancel-edit").addEventListener("click", resetForm);

// ===== INIT =====
displayProducts();
