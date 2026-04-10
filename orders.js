let cart = [];
let total = 0;

// ================= LOAD PRODUCTS =================
function loadProducts() {
    fetch("/getProducts")
        .then(res => res.json())
        .then(data => {
            let productDropdown = document.getElementById("product");
            productDropdown.innerHTML = "";

            data.forEach(product => {
                let option = document.createElement("option");
                option.value = product.product_id;
                option.text = `${product.name} - Rs ${product.price_per_unit}`;
                option.setAttribute("data-price", product.price_per_unit);
                productDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Product Load Error:", err));
}

// ================= ADD TO CART =================
function addToCart() {
    let productSelect = document.getElementById("product");
    let qty = document.getElementById("qty").value;

    if (!qty || qty <= 0) {
        alert("❌ Enter valid quantity");
        return;
    }

    let selectedOption = productSelect.options[productSelect.selectedIndex];

    let product = {
        product_id: productSelect.value,
        name: selectedOption.text,
        price: parseFloat(selectedOption.getAttribute("data-price")),
        qty: parseFloat(qty)
    };

    cart.push(product);
    total += product.price * product.qty;

    renderCart();

    // clear qty after adding
    document.getElementById("qty").value = "";
}

// ================= RENDER CART =================
function renderCart() {
    let cartList = document.getElementById("cart");
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        li.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>
                Rs ${item.price * item.qty}
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">❌</button>
            </span>
        `;

        cartList.appendChild(li);
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

// ================= REMOVE ITEM =================
function removeFromCart(index) {
    total -= cart[index].price * cart[index].qty;
    cart.splice(index, 1);
    renderCart();
}

// ================= PLACE ORDER =================
function placeOrder() {
    let customer = document.getElementById("customer").value;

    if (!customer) {
        alert("❌ Enter customer name");
        return;
    }

    if (cart.length === 0) {
        alert("❌ Cart is empty");
        return;
    }

    let order = {
        customer_name: customer,
        total: total,
        order_details: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.qty,
            total_price: item.price * item.qty
        }))
    };

    fetch("/insertOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(data => {
        alert("✅ Order placed successfully!");

        // reset everything
        cart = [];
        total = 0;
        document.getElementById("customer").value = "";

        renderCart();
        loadOrders();
    })
    .catch(err => console.error("Order Error:", err));
}

// ================= LOAD ORDERS =================
function loadOrders() {
    fetch("/getOrders")
        .then(res => res.json())
        .then(data => {
            let table = document.getElementById("orders");
            table.innerHTML = "";

            let orders = data.data || data;

            orders.forEach(order => {
                table.innerHTML += `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.customer_name}</td>
                        <td>Rs ${order.total}</td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Load Orders Error:", err));
}

// ================= AUTO LOAD =================
window.onload = function () {
    loadProducts();
    loadOrders(); // auto load orders
};