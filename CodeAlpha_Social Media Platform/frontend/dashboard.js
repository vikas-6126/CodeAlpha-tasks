const API = "http://localhost:5000";
const user = JSON.parse(localStorage.getItem("user"));

if (!user) window.location.href = "auth.html";

// ELEMENTS
const userInfo = document.getElementById("userInfo");
const postsDiv = document.getElementById("posts");
const content = document.getElementById("content");
const usersDiv = document.getElementById("users");


userInfo.innerText = `Logged in as ${user.username}`;

// CREATE POST
async function createPost() {
  if (!content.value.trim()) {
    alert("Write something");
    return;
  }

  await fetch(`${API}/api/posts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: content.value,
      user: user._id
    })
  });

  content.value = "";
  loadPosts();
}

// DELETE POST
async function deletePost(id) {
  await fetch(`${API}/api/posts/delete/${id}`, {
    method: "DELETE"
  });

  loadPosts();
}

async function toggleLike(postId) {
  await fetch(`${API}/api/posts/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postId,
      userId: user._id
    })
  });

  loadPosts();
}


// LOAD POSTS
async function loadPosts() {
  try {
    const res = await fetch(`${API}/api/posts`);
    const posts = await res.json();

    postsDiv.innerHTML = "";

    if (!posts || posts.length === 0) {
      postsDiv.innerHTML = "<p>No posts yet</p>";
      return;
    }

    posts.forEach(p => {
      const likes = p.likes || [];
      const liked = likes.includes(user._id);

      postsDiv.innerHTML += `
        <div class="card">
          <b>${p.user?.username || "Unknown"}</b>
          <p>${p.content}</p>

          <button onclick="toggleLike('${p._id}')">
            ${liked ? "❤️" : "🤍"} ${likes.length}
          </button>

          ${
            p.user?._id === user._id
              ? `<button onclick="deletePost('${p._id}')">Delete</button>`
              : ""
          }

          <button onclick="toggleComment('${p._id}')">View comments</button>

          <div id="commentBox-${p._id}" class="comment-box" style="display:none">
            <div id="comments-${p._id}"></div>
            <input
              class="comment-input"
              id="commentInput-${p._id}"
              placeholder="Add a comment..."
              onkeydown="if(event.key==='Enter') addComment('${p._id}')"
            />
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Load posts error:", err);
  }

  async function loadUsers() {
  console.log("Loading users...");

  const res = await fetch(`${API}/api/users`);
  const users = await res.json();

  console.log("Users received:", users);

  usersDiv.innerHTML = "";

  users.forEach(u => {
    if (u._id === user._id) return;

    usersDiv.innerHTML += `
      <div class="card">
        <b>${u.username}</b>
        <button onclick="follow('${u._id}')">Follow</button>
        <button onclick="unfollow('${u._id}')">Unfollow</button>
      </div>
    `;
  });
}
  loadUsers();
}




function toggleComment(postId) {
  const box = document.getElementById(`commentBox-${postId}`);
  box.style.display = box.style.display === "none" ? "block" : "none";
  loadComments(postId);
}

async function addComment(postId) {
  const input = document.getElementById(`commentInput-${postId}`);

  if (!input.value.trim()) return;

  await fetch(`${API}/api/comments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: input.value,
      user: user._id,
      post: postId
    })
  });

  input.value = "";
  loadComments(postId);
}

async function loadComments(postId) {
  const res = await fetch(`${API}/api/comments/${postId}`);
  const comments = await res.json();

  const div = document.getElementById(`comments-${postId}`);
  div.innerHTML = "";

  comments.forEach(c => {
    div.innerHTML += `<p><b>${c.user.username}:</b> ${c.content}</p>`;
  });
}


// LOGOUT
window.logout = function () {
  localStorage.clear();
  window.location.href = "auth.html";
};

// LOAD ON START
loadPosts();

async function loadUsers() {
  const res = await fetch(`${API}/api/users`);
  const users = await res.json();

  usersDiv.innerHTML = "";

  users.forEach(u => {
    if (u._id === user._id) return;

    usersDiv.innerHTML += `
      <div class="card">
        <b>${u.username}</b>
        <button onclick="follow('${u._id}')">Follow</button>
        <button onclick="unfollow('${u._id}')">Unfollow</button>
      </div>
    `;
  });
}

window.follow = async function (id) {
  await fetch(`${API}/api/users/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });

  loadUsers();
};

window.unfollow = async function (id) {
  await fetch(`${API}/api/users/unfollow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });

  loadUsers();
};


async function follow(id) {
  await fetch(`${API}/api/users/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });
  alert("Followed");
}

async function unfollow(id) {
  await fetch(`${API}/api/users/unfollow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });
  alert("Unfollowed");
}
loadUsers();

async function loadComments(postId) {
  const res = await fetch(`${API}/api/comments/${postId}`);
  const comments = await res.json();

  const div = document.getElementById(`comments-${postId}`);
  div.innerHTML = "";

  comments.forEach(c => {
    div.innerHTML += `
      <div class="comment">
        <b>${c.user.username}</b> ${c.content}
      </div>
    `;
  });
}

// LOAD USERS
async function loadUsers() {
  const res = await fetch(`${API}/api/users`);
  const users = await res.json();

  usersDiv.innerHTML = "";

  users.forEach(u => {
    if (u._id === user._id) return;

    const isFollowing = u.followers.includes(user._id);

    usersDiv.innerHTML += `
      <div class="card">
        <b>
          <a href="profile.html?id=${u._id}">
            ${u.username}
          </a>
        </b>

        <p>Followers: ${u.followers.length}</p>

        <button 
          class="${isFollowing ? 'unfollow' : 'follow'}"
          onclick="${isFollowing ? `unfollow('${u._id}')` : `follow('${u._id}')`}"
        >
          ${isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    `;
  });
}


// FOLLOW
async function follow(id) {
  const res = await fetch(`${API}/api/users/follow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });

  const updatedUser = await res.json();
  localStorage.setItem("user", JSON.stringify(updatedUser));
  loadUsers();   // 🔥 reload users list
}


// UNFOLLOW
async function unfollow(id) {
  const res = await fetch(`${API}/api/users/unfollow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user._id,
      targetId: id
    })
  });

  const updatedUser = await res.json();
  localStorage.setItem("user", JSON.stringify(updatedUser));
  loadUsers();   // 🔥 reload users list
}


loadUsers();
loadPosts();