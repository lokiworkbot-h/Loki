const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Cloud Function برای اضافه کردن امتیاز و ثبت IP
exports.addScore = functions.https.onRequest(async (req, res) => {
  try {
    const { uid, taskId } = req.body;

    // گرفتن IP کاربر
    const ip = req.headers['fastly-client-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const today = new Date().toISOString().slice(0, 10);
    const logRef = db.collection("taskLogs").doc(uid + "_" + taskId + "_" + today);
    const logDoc = await logRef.get();

    if (logDoc.exists) return res.status(400).send("Already clicked today");

    const taskSnap = await db.collection("tasks").doc(taskId).get();
    const task = taskSnap.data();

    await logRef.set({
      uid,
      taskId,
      date: today,
      ip
    });

    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      score: admin.firestore.FieldValue.increment(task.reward),
      lastIP: ip
    });

    res.send("Score added");
  } catch (e) {
    res.status(500).send(e.message);
  }
});