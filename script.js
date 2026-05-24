// Sign up
function signup() {
  const user = document.getElementById("signup-username").value;
  const pass = document.getElementById("signup-password").value;
  if (user && pass) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[user]) {
      document.getElementById("signup-error").innerText = "Username already exists!";
    } else {
      users[user] = { password: pass, inventory: [] };
      localStorage.setItem("users", JSON.stringify(users));
      alert("Account created! Please login.");
      showLogin();
    }
  } else {
    document.getElementById("signup-error").innerText = "Enter username and password!";
  }
}

// Show login/signup
function showLogin() {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}
function showSignup() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}

// Login
let currentUser = null;
function login() {
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[user] && users[user].password === pass) {
    currentUser = user;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("signup-container").style.display = "none";
    document.body.style.alignItems = "stretch"; // stop centering
    document.getElementById("dashboard").style.display = "flex";
    loadInventory();
    loadUsers();
  } else {
    document.getElementById("login-error").innerText = "Invalid credentials!";
  }
}

// Logout
function logout() {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("login-container").style.display = "block";
  document.body.style.alignItems = "center"; // re-center login form
}

// Generate unique ID
function generateId() {
  return 'P' + Math.floor(Math.random() * 1000000);
}

// Add item
function addItem() {
  const name = document.getElementById("itemName").value;
  const qty = parseInt(document.getElementById("itemQty").value);
  const category = document.getElementById("itemCategory").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const supplier = document.getElementById("itemSupplier").value;

  if (name && qty && category && price && supplier && currentUser) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    const id = generateId();
    users[currentUser].inventory.push({ id, name, category, qty, price, supplier });
    localStorage.setItem("users", JSON.stringify(users));
    loadInventory();
    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemCategory").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemSupplier").value = "";
  }
}

// Load inventory
function loadInventory() {
  const tableBody = document.querySelector("#inventoryTable tbody");
  tableBody.innerHTML = "";
  let users = JSON.parse(localStorage.getItem("users")) || {};
  let inventory = users[currentUser]?.inventory || [];
  inventory.forEach((item, index) => {
    let row = `<tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
      <td>${item.supplier}</td>
      <td>
        <button onclick="adjustQty(${index}, 'add')">Add</button>
        <button onclick="adjustQty(${index}, 'reduce')">Reduce</button>
        <button onclick="deleteItem(${index})">Delete</button>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

// Adjust quantity manually
function adjustQty(index, action) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  let inventory = users[currentUser].inventory;
  let amount = prompt(`Enter amount to ${action}:`, "1");
  if (amount !== null) {
    amount = parseInt(amount);
    if (!isNaN(amount) && amount > 0) {
      if (action === "add") {
        inventory[index].qty += amount;
      } else if (action === "reduce") {
        if (inventory[index].qty >= amount) {
          inventory[index].qty -= amount;
        } else {
          alert("Not enough stock!");
        }
      }
      localStorage.setItem("users", JSON.stringify(users));
      loadInventory();
    } else {
      alert("Invalid amount!");
    }
  }
}

// Delete item
function deleteItem(index) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  users[currentUser].inventory.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadInventory();
}

// Load users into sidebar
function loadUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  let users = JSON.parse(localStorage.getItem("users")) || {};
  Object.keys(users).forEach(u => {
    let li = document.createElement("li");
    li.innerHTML = `${u} 
      <button onclick="removeUser('${u}')" style="margin-left:10px; font-size:12px; background:#dc3545; color:white; border:none; border-radius:4px; padding:2px 6px; cursor:pointer;">
        Delete
      </button>`;
    userList.appendChild(li);
  });
}

// Remove user
function removeUser(username) {
  if (confirm(`Are you sure you want to delete user "${username}"?`)) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    delete users[username];
    localStorage.setItem("users", JSON.stringify(users));
    if (currentUser === username) {
      logout();
    } else {
      loadUsers();
    }
  }
}

// Sidebar navigation
function showSection(section) {
  if (section === "inventory") {
    document.getElementById("inventory-section").style.display = "block";
  }
}
