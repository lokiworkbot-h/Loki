const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const scoreEl = document.getElementById("score");
const tasksContainer = document.getElementById("tasksContainer");

auth.onAuthStateChanged(async user=>{
  if(!user) location.href="index.html";

  userEmail.innerText = user.email;

  const userDoc = await db.collection("users").doc(user.uid).get();
  scoreEl.innerText = userDoc.data().score;

  const tasksSnap = await db.collection("tasks").where("active","==",true).get();
  tasksSnap.forEach(task=>{
    const btn = document.createElement("button");
    btn.className="taskBtn";
    btn.innerText = task.data().title;

    // بررسی اینکه کاربر امروز کلیک کرده یا نه
    const today = new Date().toISOString().slice(0,10);
    db.collection("taskLogs")
      .doc(user.uid+"_"+task.id+"_"+today)
      .get().then(log=>{
        if(log.exists) btn.disabled=true;
      });

    btn.onclick = async ()=>{
      const todayDoc = db.collection("taskLogs").doc(user.uid+"_"+task.id+"_"+today);
      const doc = await todayDoc.get();
      if(doc.exists) return;

      // ثبت امتیاز و IP از Cloud Function
      await fetch(`https://us-central1-YOUR_PROJECT.cloudfunctions.net/addScore`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({uid:user.uid, taskId:task.id})
      });

      btn.disabled=true;
      // به‌روزرسانی امتیاز زنده
      const newUserDoc = await db.collection("users").doc(user.uid).get();
      scoreEl.innerText = newUserDoc.data().score;
    };

    tasksContainer.appendChild(btn);
  });
});

logoutBtn.onclick = ()=>{
  auth.signOut();
  location.href="index.html";
};