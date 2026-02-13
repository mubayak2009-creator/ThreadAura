function loadCheckout() {
    const itemsContainer = document.getElementById("checkout-items");
    const totalEl = document.getElementById("checkout-total");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    itemsContainer.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsContainer.innerHTML += `
            <p>${item.title} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</p>
        `;
    });

    totalEl.textContent = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
    loadCheckout();

    const paymentSelect = document.getElementById("payment-method");
    const momoFields = document.getElementById("momo-fields");
    const momoNetwork = document.getElementById("momo-network");

    paymentSelect.addEventListener("change", () => {
        if (paymentSelect.value === "MTN" || paymentSelect.value === "Vodafone") {
            momoFields.style.display = "block";
            momoNetwork.value = paymentSelect.value;
        } else {
            momoFields.style.display = "none";
        }
    });

    document.getElementById("checkout-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const total = document.getElementById("checkout-total").textContent;

        const orderData = {
            name: e.target.name.value,
            email: e.target.email.value,
            address: e.target.address.value,
            payment: e.target.payment.value,
            momoNetwork: document.getElementById("momo-network").value,
            momoNumber: document.getElementById("momo-number").value,
            momoName: document.getElementById("momo-name").value,
            cart,
            total
        };

        const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
});
