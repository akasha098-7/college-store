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




function signIn() {
  const admission = document.querySelector("#signin input").value;

  if (admission.trim() === "") {
    alert("Please enter Admission Number");
    return;
  }

  const popup = document.getElementById("welcomePopup");
  popup.classList.add("show");

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1700);
}
function validateRegister(){

  const inputs = document.querySelectorAll("#register input");
  let empty = false;

  inputs.forEach(input => {
    if (input.value.trim() === "") empty = true;
  });

  if (empty){
    return;
  }

  // 🔥 Show themed toast
  const toast = document.getElementById("qpToast");
  toast.classList.add("show");

  // Hide after 2 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);

  // 🔥 Switch to Sign In
  signBtn.classList.add("active");
  regBtn.classList.remove("active");
  signin.style.display = "block";
  register.style.display = "none";
}
  

