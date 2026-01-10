const API = "http://localhost:5000/api/users";

function register() {
  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  }).then(() => {
    alert("Registered successfully");
    window.location.href = "login.html";
  });
}

function login() {
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(user => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Login successful");
    window.location.href = "index.html";
  })
  .catch(() => alert("Invalid login"));
}
