// =============================
// 🔐 PUT YOUR PAYSTACK API HERE
// =============================
const PAYSTACK_PUBLIC_KEY = "pk_test_24c54b797ce3bac2726c38ad05851e526c547624";

// =============================
// LOAD CHECKOUT ITEMS
// =============================
function loadCheckout() {
    const itemsContainer = document.getElementById("checkout-items");
    const totalEl = document.getElementById("checkout-total");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    itemsContainer.innerHTML = "";

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemsContainer.innerHTML += `
            <p>${item.title} × ${item.quantity} - GHS ${(item.price * item.quantity).toFixed(2)}</p>
        `;
    });

    totalEl.textContent = total.toFixed(2);
}

// =============================
// PAYSTACK PAYMENT FUNCTION
// =============================
function payWithPaystack(email, total) {
    let handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY, // 👈 API USED HERE
        email: email,
        amount: total * 100, // convert to pesewas
        currency: "GHS",

        callback: function(response) {
            // ✅ Payment successful
            alert("Payment successful! Ref: " + response.reference);

            // Save reference
            localStorage.setItem("paymentRef", response.reference);

            // Clear cart
            localStorage.removeItem("cart");

            // Redirect
            window.location.href = "success.html";
        },

        onClose: function() {
            alert("Payment cancelled");
        }
    });

    handler.openIframe();
}

// =============================
// MAIN LOGIC
// =============================
document.addEventListener("DOMContentLoaded", () => {
    loadCheckout();

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const total = parseFloat(document.getElementById("checkout-total").textContent);

        if (!email || total <= 0) {
            alert("Invalid payment details");
            return;
        }

        // 🚀 CALL PAYSTACK
        payWithPaystack(email, total);
    });
});
