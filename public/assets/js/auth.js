// عناصر
const registerBox = document.getElementById("registerBox");
const loginBox = document.getElementById("loginBox");
const regPhone = document.getElementById("regPhone");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("registerBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// UI
function showRegister(){
  registerBox.style.display="block";
  loginBox.style.display="none";
  loginError.style.display="none";
}
function showLogin(){
  registerBox.style.display="none";
  loginBox.style.display="block";
  loginError.style.display="none";
}

// ثبت‌نام
registerBtn.addEventListener("click", async ()=>{
  const phone = regPhone.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();

  if(!phone || !email || password.length < 6){
    alert("لطفا تمام فیلدها را صحیح وارد کنید");
    return;
  }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email,password);

    await cred.user.sendEmailVerification();

    await db.collection("users").doc(cred.user.uid).set({
      phone,
      email,
      score: 0,
      role: "user",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("ایمیل تایید ارسال شد. لطفا آن را فعال کنید");
    auth.signOut();
    showLogin();

  }catch(err){
    alert(err.message);
  }
});

// ورود
loginBtn.addEventListener("click", async ()=>{
  try{
    const cred = await auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value);

    if(!cred.user.emailVerified){
      alert("ابتدا ایمیل خود را فعال کنید");
      await auth.signOut();
      return;
    }

    location.href="dashboard.html";

  }catch(err){
    loginError.style.display="block";
    loginBtn.classList.add("shake");
    setTimeout(()=>loginBtn.classList.remove("shake"),300);
  }
});
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// بررسی وضعیت کاربر
onAuthStateChanged(auth, (user) => {
  const dashboard = document.getElementById("dashboard");
  const formInputs = [ "email", "password", "loginBtn", "signupBtn", "alreadyBtn" ];

  if (user) {
    // کاربر لاگین هست
    dashboard.style.display = "block";
    document.getElementById("userEmail").textContent = user.email;

    // مخفی کردن فرم‌ها
    formInputs.forEach(id => document.getElementById(id).style.display = "none");
  } else {
    // کاربر لاگین نیست
    dashboard.style.display = "none";
    formInputs.forEach(id => document.getElementById(id).style.display = "inline-block");
  }
});

// خروج
document.getElementById("logoutBtn").onclick = async () => {
  await signOut(auth);
  alert("شما خارج شدید");
};
