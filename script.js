
let cart = [];

function increaseQty(btn, name, price){
  const qtySpan = btn.parentElement.querySelector(".qty");
  let qty = Number(qtySpan.textContent);

  qty++;
  qtySpan.textContent = qty;

  updateCart(name, price, qty);
  showToast(name + " added to cart");
}

function decreaseQty(btn, name, price){
  const qtySpan = btn.parentElement.querySelector(".qty");
  let qty = Number(qtySpan.textContent);

  if(qty > 0){
    qty--;
    qtySpan.textContent = qty;
  }

  updateCart(name, price, qty);
}

function updateCart(name, price, qty){

  cart = cart.filter(item => item.name !== name);

  
  if(qty > 0){
    cart.push({
      name: name,
      price: price,
      quantity: qty
    });
  }

  displayCart();
}


function displayCart(){
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  if (!cartItems || !totalEl) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} (x${item.quantity}) - ₹${itemTotal}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(li);
  });

  totalEl.textContent = total;
}


function removeFromCart(index){
  const removedItem = cart[index];
  cart.splice(index, 1);


  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const title = card.querySelector("h4").textContent;
    if(title === removedItem.name){
      card.querySelector(".qty").textContent = 0;
    }
  });

  displayCart();
}


function placeOrder(){
  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const summary = document.getElementById("order-summary");
  summary.classList.add("show");

  const summaryList = document.getElementById("summary-items");
  const summaryTotal = document.getElementById("summary-total");

  summaryList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>₹${itemTotal}</span>
    `;
    summaryList.appendChild(li);
  });

  summaryTotal.textContent = total;
}

async function confirmOrder(){
  const total = Number(document.getElementById("summary-total").textContent);

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total: total })
    });

    if(res.ok){
      console.log("Order sent to backend");

      const orderSummary = document.getElementById("order-summary");
      if(orderSummary){
        orderSummary.classList.remove("show");
      }

      cart = [];
      displayCart();
      document.querySelectorAll(".qty").forEach(q => q.textContent = 0);

      showToast("🎉 Order Confirmed! Thank you for shopping with Smart Cart.");
      createConfetti();

      if(typeof displayPastOrders === "function") displayPastOrders();

    } else {
      alert("Error saving order");
    }

  } catch(error){
    console.error("Error saving order:", error);
    alert("Cannot connect to backend");
  }
}


function createConfetti(){
  for(let i=0;i<80;i++){
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random()*100 + "vw";
    confetti.style.background = "hsl(" + Math.random()*360 + ",100%,50%)";
    document.body.appendChild(confetti);
    setTimeout(()=> confetti.remove(), 3000);
  }
}

function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(()=> toast.classList.remove("show"), 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const placeBtn = document.getElementById("place-order-btn");
  if(placeBtn) placeBtn.addEventListener("click", placeOrder);

  const confirmBtn = document.getElementById("confirm-order-btn");
  if(confirmBtn) confirmBtn.addEventListener("click", confirmOrder);
});

async function displayPastOrders() {
  const ordersList = document.getElementById("orders-list");
  if(!ordersList) return;

  try {
    const res = await fetch("http://localhost:5000/orders");
    const orders = await res.json();

    ordersList.innerHTML = "";

    if(orders.length === 0){
      ordersList.innerHTML = "<li>No past orders yet</li>";
      return;
    }

    orders.forEach(order => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${new Date(order.date).toLocaleString()}</strong><br>
        Total: ₹${order.total.toFixed(1)}<br>
        Items: ${order.items.map(i => i.name + " x" + i.quantity).join(", ")}
      `;
      ordersList.appendChild(li);
    });

  } catch(error){
    console.error("Error fetching orders:", error);
    ordersList.innerHTML = "<li>Error loading orders</li>";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const myOrdersBtn = document.getElementById("my-orders-btn");
  const ordersModal = document.getElementById("orders-modal");
  const closeOrdersBtn = document.getElementById("close-orders-btn");

  if(myOrdersBtn && ordersModal){
    myOrdersBtn.addEventListener("click", () => {
      ordersModal.classList.add("show");
      displayPastOrders();
    });
  }

  if(closeOrdersBtn && ordersModal){
    closeOrdersBtn.addEventListener("click", () => {
      ordersModal.classList.remove("show");
    });
  }
});

function register(){
    let user = document.getElementById("newUser").value.trim();
    let pass = document.getElementById("newPass").value.trim();

    if(user === "" || pass === ""){
        document.getElementById("msg").innerText = "Fill all fields";
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    document.getElementById("msg").innerText = "Registered Successfully!";

    setTimeout(()=>{
        window.location.href = "login.html";
    },150);
}


function login(){
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value.trim();

    let savedUser = localStorage.getItem("user");
    let savedPass = localStorage.getItem("pass");

    if(user === savedUser && pass === savedPass){
        localStorage.setItem("loggedin","true");
        window.location.href = "index.html";
    }
    else{
        document.getElementById("error").innerText = "Invalid Credentials";
    }
}


function logout(){
    localStorage.removeItem("loggedin");
    alert("Logged out successfully");
    window.location.href = "login.html";
}
function change(){
  var s = document.getElementById("hey");
  console.log(s.textContent = "karpagamma");
  
}