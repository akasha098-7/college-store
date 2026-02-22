const signBtn=document.getElementById("signBtn");
const regBtn=document.getElementById("regBtn");
const signin=document.getElementById("signin");
const register=document.getElementById("register");

signBtn.onclick=()=>{
  signBtn.classList.add("active");
  regBtn.classList.remove("active");
  signin.style.display="block";
  register.style.display="none";
};

regBtn.onclick=()=>{
  regBtn.classList.add("active");
  signBtn.classList.remove("active");
  signin.style.display="none";
  register.style.display="block";
};

/* CONTACT SWITCH */
const emailBtn=document.getElementById("emailBtn");
const phoneBtn=document.getElementById("phoneBtn");
const contactInput=document.getElementById("contactInput");

emailBtn.onclick=()=>{
  emailBtn.classList.add("active");
  phoneBtn.classList.remove("active");
  contactInput.placeholder="username@gmail.com";
};

phoneBtn.onclick=()=>{
  phoneBtn.classList.add("active");
  emailBtn.classList.remove("active");
  contactInput.placeholder="10-digit mobile number";
};

function validateRegister(){
  alert("Enter valid details");
}

async function signIn() {
    // 1. Grab the inputs from the HTML
    const inputs = document.querySelectorAll('#signin input');
    const admission_no = inputs[0].value;
    const password = inputs[1].value;

    if (!admission_no || !password) {
        alert("Please fill in all fields");
        return;
    }

    try {
        // 2. Send the data to your Node.js server
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admission_no, password })
        });

        const data = await response.json();

        // 3. Handle the response
        if (data.success) {
            alert("Welcome to QuickPick!");
            window.location.href = "index.html"; // Send them to the store page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server is not responding. Make sure Backend is running!");
    }
}
