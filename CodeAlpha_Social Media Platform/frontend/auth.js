const API = "http://localhost:5000";
const msg = document.getElementById("msg");

// REGISTER USER
async function register() {
  msg.innerText = "";

  const username = regUsername.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim(); // make sure you have <input id="regPassword">

  if (!username || !email || !password) {
    msg.innerText = "All fields are required";
    msg.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API}/api/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.error || "Registration failed";
      msg.style.color = "red";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "dashboard.html";

  } catch (err) {
    msg.innerText = "Server error. Try again later.";
    msg.style.color = "red";
  }
}

// LOGIN USER
async function login() {
  msg.innerText = "";

  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  if (!username || !password) {
    msg.innerText = "Username and Password are required";
    msg.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.error || "Login failed";
      msg.style.color = "red";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "dashboard.html";

  } catch (err) {
    msg.innerText = "Server error. Try again later.";
    msg.style.color = "red";
  }
}
