const admin = require("firebase-admin");
const functions = require("firebase-functions");
require("dotenv").config();

admin.initializeApp();

const db = admin.firestore();
const usersCollection = db.collection("users");

exports.addUserWhenCreatedInFirebaseAuth = functions.auth
  .user()
  .onCreate(async (user) => {
    usersCollection
      .doc(user.uid)
      .set({
        id: user.uid,
        email: user.email,
        name: "",
      })
      .then(() => {
        console.log("Written to users collection user: " + user.email);
        return null;
      })
      .catch((error) => {
        console.log("Error adding user to user collection" + error);
      });
  });

exports.updateUserWhenNewProjectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate((snap, context) => {
    const { projectId } = context.params;
    const user = snap.get("user");
    return db
      .doc(`users/${user.id}`)
      .update(`projects.${projectId}`, {
        name: snap.get("name"),
        id: projectId,
      })
      .then(() => {
        console.log("Written to users collection user: " + user.id);
        return null;
      })
      .catch((error) => {
        console.log("Error adding user to user collection" + error);
      });
  });
