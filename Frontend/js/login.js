// ─── TAB SWITCHING (your original code, untouched) ───────────────────────────
const signBtn = document.getElementById("signBtn");
const regBtn  = document.getElementById("regBtn");
const signin  = document.getElementById("signin");
const register = document.getElementById("register");

signBtn.onclick = () => {
  signBtn.classList.add("active");
  regBtn.classList.remove("active");
  signin.style.display = "block";
  register.style.display = "none";
};

regBtn.onclick = () => {
  regBtn.classList.add("active");
  signBtn.classList.remove("active");
  signin.style.display = "none";
  register.style.display = "block";
};

// ─── CONTACT SWITCH (your original code, untouched) ──────────────────────────
const emailBtn     = document.getElementById("emailBtn");
const phoneBtn     = document.getElementById("phoneBtn");
const contactInput = document.getElementById("contactInput");

emailBtn.onclick = () => {
  emailBtn.classList.add("active");
  phoneBtn.classList.remove("active");
  contactInput.placeholder = "username@gmail.com";
  contactInput.type = "email";
};

phoneBtn.onclick = () => {
  phoneBtn.classList.add("active");
  emailBtn.classList.remove("active");
  contactInput.placeholder = "10-digit mobile number";
  contactInput.type = "tel";
};

// ─── BACKEND URL ─────────────────────────────────────────────────────────────
const API = "http://localhost:3000/api";

// ─── SIGN IN ─────────────────────────────────────────────────────────────────
async function signIn() {
  const inputs           = document.querySelectorAll("#signin input");
  const admission_number = inputs[0].value.trim();
  const password         = inputs[1].value.trim();

  if (!admission_number || !password) {
    alert("Please enter Admission Number and Password");
    return;
  }

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ admission_number, password })
    });

    const data = await res.json();

    if (res.ok && data.success && data.token) {
      // Save login info for use on other pages
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Your original welcome popup + redirect
      const popup = document.getElementById("welcomePopup");
      popup.classList.add("show");

      setTimeout(() => {
        window.location.href = data.user.role === "admin"
          ? "admin.html"   // change to your actual admin page name
          : "home.html";   // your existing redirect target
      }, 1700);

    } else {
      alert(data.message || "Invalid admission number or password");
    }

  } catch (err) {
    alert("Cannot connect to server. Make sure the backend is running.");
  }
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
async function validateRegister() {
  const inputs = document.querySelectorAll("#register input");

  const first_name       = inputs[0].value.trim();
  const last_name        = inputs[1].value.trim();
  const admission_number = inputs[2].value.trim();
  const password         = inputs[3].value.trim();
  const confirm_password = inputs[4].value.trim();
  const contact          = contactInput.value.trim();

  // Your original empty-check logic
  let empty = false;
  inputs.forEach(input => { if (input.value.trim() === "") empty = true; });
  if (empty) return;

  // Extra checks
  if (password !== confirm_password) {
    alert("Passwords do not match!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  const isEmail = contactInput.type === "email";

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        first_name,
        last_name,
        admission_number,
        password,
        email: isEmail ? contact : null,
        phone: !isEmail ? contact : null
      })
    });

    const data = await res.json();

    if (res.ok) {
      // Your original toast + tab switch logic, untouched
      const toast = document.getElementById("qpToast");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);

      signBtn.classList.add("active");
      regBtn.classList.remove("active");
      signin.style.display = "block";
      register.style.display = "none";

    } else {
      alert(data.message || "Registration failed. Try a different admission number.");
    }

  } catch (err) {
    alert("Cannot connect to server. Make sure the backend is running.");
  }
}
