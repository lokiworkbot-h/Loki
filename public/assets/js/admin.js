const usersContainer = document.getElementById("usersContainer");
const logoutBtn = document.getElementById("logoutBtn");
const taskTitle = document.getElementById("taskTitle");
const taskLink = document.getElementById("taskLink");
const taskReward = document.getElementById("taskReward");
const createTaskBtn = document.getElementById("createTaskBtn");

auth.onAuthStateChanged(async user=>{
  if(!user) location.href="index.html";

  const snap = await db.collection("users").doc(user.uid).get();
  if(snap.data().role !== "admin"){
    alert("دسترسی ندارید");
    location.href="dashboard.html";
    return;
  }

  // نمایش کاربران
  const usersSnap = await db.collection("users").get();
  usersSnap.forEach(u=>{
    const div = document.createElement("div");
    div.className = "userCard";
    div.innerText = `${u.data().email} | امتیاز: ${u.data().score} | IP: ${u.data().lastIP || "N/A"}`;
    usersContainer.appendChild(div);
  });
});

logoutBtn.onclick = ()=>{
  auth.signOut();
  location.href="index.html";
}

// ایجاد تسک
createTaskBtn.onclick = async ()=>{
  const title = taskTitle.value.trim();
  const link = taskLink.value.trim();
  const reward = parseInt(taskReward.value);

  if(!title || !link || isNaN(reward)){
    alert("لطفا تمام فیلدها را پر کنید");
    return;
  }

  await db.collection("tasks").add({
    title,
    link,
    reward,
    active:true
  });

  alert("تسک ایجاد شد");
  taskTitle.value = "";
  taskLink.value = "";
  taskReward.value = "";
};