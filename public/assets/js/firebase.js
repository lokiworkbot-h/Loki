// جایگزین کن با مقادیر پروژه خودت
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const db = firebase.firestore();
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function testFirestore() {
  await addDoc(collection(db, "users"), {
    name: "Reza",
    test: true,
    createdAt: Date.now()
  });
}

testFirestore();
