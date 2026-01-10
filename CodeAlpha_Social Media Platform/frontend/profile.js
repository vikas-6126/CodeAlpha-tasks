const API = "http://localhost:5000";

const loggedUser = JSON.parse(localStorage.getItem("user"));
if (!loggedUser) location.href = "auth.html";

// Get profile user ID from URL
const params = new URLSearchParams(window.location.search);
const profileId = params.get("id");

const usernameEl = document.getElementById("username");
const statsEl = document.getElementById("stats");
const postsDiv = document.getElementById("posts");
const followBtnDiv = document.getElementById("followBtn");

async function loadProfile() {
  const res = await fetch(`${API}/api/users/${profileId}`);
  const user = await res.json();

  usernameEl.innerText = user.username;
  statsEl.innerText = `Followers: ${user.followers.length} | Following: ${user.following.length}`;

  // Follow / Unfollow button
  if (profileId !== loggedUser._id) {
    const isFollowing = user.followers.includes(loggedUser._id);

    followBtnDiv.innerHTML = `
      <button onclick="${isFollowing ? `unfollow()` : `follow()`}">
        ${isFollowing ? "Unfollow" : "Follow"}
      </button>
    `;
  }

  loadUserPosts();
}

async function loadUserPosts() {
  const res = await fetch(`${API}/api/posts/user/${profileId}`);
  const posts = await res.json();

  postsDiv.innerHTML = "";

  if (posts.length === 0) {
    postsDiv.innerHTML = "<p>No posts yet</p>";
    return;
  }

  posts.forEach(p => {
    postsDiv.innerHTML += `
      <div class="card">
        <p>${p.content}</p>
      </div>
    `;
  });
}

window.follow = async function () {
  await fetch(`${API}/api/users/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: loggedUser._id,
      targetId: profileId
    })
  });

  loadProfile();
};

window.unfollow = async function () {
  await fetch(`${API}/api/users/unfollow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: loggedUser._id,
      targetId: profileId
    })
  });

  loadProfile();
};

function goBack() {
  window.history.back();
}

loadProfile();
