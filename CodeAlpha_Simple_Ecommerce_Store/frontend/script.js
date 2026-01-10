let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-info").innerText =
    "Welcome, " + user.username;
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
fetch("http://localhost:5000/api/products")
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById("products");
    data.forEach((p, index) => {
      div.innerHTML += `
        <div class="product">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>

          <div class="qty">
            <button onclick="decrease(${index})">−</button>
            <span id="qty-${index}">1</span>
            <button onclick="increase(${index})">+</button>
          </div>

          <button onclick='addToCart(${JSON.stringify(p)}, ${index})'>
            Add to Cart
          </button>
        </div>
      `;
    });
  });

function increase(index) {
  let span = document.getElementById(`qty-${index}`);
  span.innerText = parseInt(span.innerText) + 1;
}

function decrease(index) {
  let span = document.getElementById(`qty-${index}`);
  let value = parseInt(span.innerText);
  if (value > 1) span.innerText = value - 1;
}

function addToCart(product, index) {
  let qty = parseInt(document.getElementById(`qty-${index}`).innerText);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    ...product,
    quantity: qty
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
