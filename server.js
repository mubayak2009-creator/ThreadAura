const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // serve your frontend

const PRODUCTS_FILE = path.join(__dirname, "products.json");
const ORDERS_FILE = path.join(__dirname, "orders.json");

// Helper to read JSON
function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
}

// Helper to write JSON
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// GET all products
app.get("/api/products", (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    res.json(products);
});

// GET single product
app.get("/api/products/:id", (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    const product = products.find(p => Number(p.id) === Number(req.params.id));
    if(!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
});

// POST new product (admin)
app.post("/api/products", (req, res) => {
    const products = readJSON(PRODUCTS_FILE);
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    writeJSON(PRODUCTS_FILE, products);
    res.json(newProduct);
});

// POST order (checkout)
app.post("/api/orders", (req, res) => {
    const orders = readJSON(ORDERS_FILE);
    const newOrder = { id: Date.now(), ...req.body, date: new Date() };
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    res.json({ message: "Order received", order: newOrder });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
