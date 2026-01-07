import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const dashboard = document.getElementById("dashboard");
  const userEmail = document.getElementById("userEmail");

  const authElements = [
    "email",
    "password",
    "loginBtn",
    "signupBtn",
    "alreadyBtn"
  ];

  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user);

    if (user) {
      dashboard.style.display = "block";
      userEmail.textContent = user.email;

      authElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });

    } else {
      dashboard.style.display = "none";

      authElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "inline-block";
      });
    }
  });

  document.getElementById("logoutBtn").onclick = async () => {
    await signOut(auth);
    alert("خارج شدید");
  };

});
