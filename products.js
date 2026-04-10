function getProducts() {
    fetch('/getProducts')
    .then(res => res.json())
    .then(data => {
        let table = document.getElementById("table");
        table.innerHTML = "";

        data.forEach(p => {
            table.innerHTML += `
                <tr>
                    <td>${p.product_id}</td>
                    <td class="fw-semibold">${p.name}</td>
                    <td>
                        <span class="badge bg-info text-dark">
                            ${p.uom_name}
                        </span>
                    </td>
                    <td class="text-success fw-bold">
                        Rs ${p.price_per_unit}
                    </td>
                    <td>
                        <button onclick="deleteProduct(${p.product_id})" class="btn btn-danger btn-sm">
                            ❌ Delete
                        </button>
                    </td>
                    <td>
                        <button onclick="openUpdateForm(${p.product_id}, '${p.name}', ${p.uom_id}, ${p.price_per_unit})" class="btn btn-dark btn-sm">
                            ✏️ Update
                        </button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(err => console.error("Get Products Error:", err));
}


// ================= LOAD UOM =================
function getUOMs() {
    fetch('/getUOM')
    .then(res => res.json())
    .then(data => {
        let select = document.getElementById("uom");
        select.innerHTML = "";

        data.forEach(u => {
            let option = document.createElement("option");
            option.value = u.uom_id;
            option.text = u.uom_name;
            select.appendChild(option);
        });
    })
    .catch(err => console.error("UOM Error:", err));
}


// ================= ADD PRODUCT =================
function addProduct() {
    let name = document.getElementById("name").value.trim();
    let price = document.getElementById("price").value;
    let uom = document.getElementById("uom").value;

    if (!name || !price || !uom) {
        alert("❌ All fields required!");
        return;
    }

    fetch('/insertProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            price_per_unit: price,
            uom_id: uom
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("✅ Product Added Successfully");

        // clear fields
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";

        getProducts();
    })
    .catch(err => console.error("Insert Error:", err));
}


// ================= DELETE =================
function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    let formData = new FormData();
    formData.append("data", JSON.stringify({
        "product_id": productId
    }));

    fetch("http://127.0.0.1:5000/deleteProduct", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.status === "success") {
            getProducts();
        }
    })
    .catch(error => {
        alert("❌ Delete failed: " + error);
    });
}


// ================= OPEN UPDATE FORM =================
function openUpdateForm(id, name, uom, price) {
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("uom").value = uom;

    // create hidden field if not exists
    if (!document.getElementById("product_id")) {
        let input = document.createElement("input");
        input.type = "hidden";
        input.id = "product_id";
        document.body.appendChild(input);
    }

    document.getElementById("product_id").value = id;

    // change button dynamically
    let btn = document.querySelector("button[onclick='addProduct()']");
    if (btn) {
        btn.innerText = "Update Product";
        btn.classList.remove("btn-success");
        btn.classList.add("btn-warning");
        btn.setAttribute("onclick", "updateProduct()");
    }
}


// ================= UPDATE =================
function updateProduct() {
    let productId = document.getElementById("product_id").value;
    let name = document.getElementById("name").value;
    let uomId = document.getElementById("uom").value;
    let price = document.getElementById("price").value;

    if (!name || !price || !uomId) {
        alert("❌ All fields required!");
        return;
    }

    let formData = new FormData();
    formData.append("data", JSON.stringify({
        "product_id": productId,
        "name": name,
        "uom_id": uomId,
        "price_per_unit": price
    }));

    fetch("http://127.0.0.1:5000/updateProduct", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        if (data.status === "success") {
            getProducts();

            // reset form
            document.getElementById("name").value = "";
            document.getElementById("price").value = "";

            // reset button
            let btn = document.querySelector("button");
            btn.innerText = "Add Product";
            btn.classList.remove("btn-warning");
            btn.classList.add("btn-success");
            btn.setAttribute("onclick", "addProduct()");
        }
    })
    .catch(error => {
        alert("❌ Update failed: " + error);
    });
}


// ================= INIT =================
window.onload = function () {
    getUOMs();
    getProducts();
};