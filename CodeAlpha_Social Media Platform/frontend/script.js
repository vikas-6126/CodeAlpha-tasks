const API_URL = "http://localhost:5000";

// ==========================
// CREATE USER
// ==========================
async function createUser() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;

  if (!username || !email) {
    alert("Username and Email are required");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email })
    });

    const data = await res.json();

    document.getElementById("userResult").innerText =
      `User Created\n\nUsername: ${data.username}\nUser ID: ${data._id}`;

  } catch (err) {
    document.getElementById("userResult").innerText =
      "Error creating user";
  }
}

// ==========================
// CREATE POST
// ==========================
async function createPost() {
  const content = document.getElementById("postContent").value;
  const userId = document.getElementById("postUserId").value;

  if (!content || !userId) {
    alert("Post content and User ID are required");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/posts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, user: userId })
    });

    const data = await res.json();

    document.getElementById("postResult").innerText =
      `Post Created\n\nContent: ${data.content}\nPost ID: ${data._id}`;

    getPosts();

  } catch (err) {
    document.getElementById("postResult").innerText =
      "Error creating post";
  }
}

// ==========================
// GET ALL POSTS
// ==========================
async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/api/posts`);
    const posts = await res.json();

    let html = "";

    posts.forEach(post => {
      html += `
        <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
          <p><strong>Username:</strong> ${post.user?.username}</p>
          <p><strong>User ID:</strong> ${post.user?._id}</p>
          <p><strong>Post ID:</strong> ${post._id}</p>
          <p><strong>Content:</strong> ${post.content}</p>
        </div>
      `;
    });

    document.getElementById("posts").innerHTML = html;

  } catch (err) {
    document.getElementById("posts").innerText =
      "Error loading posts";
  }
}
