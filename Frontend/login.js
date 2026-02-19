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

function signIn(){
  alert("Enter valid details");
}
