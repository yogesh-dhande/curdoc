import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

// firebase init goes here
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_CONFIG_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_CONFIG_PROJECT_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

// firebase collections
const usersCollection = db.collection("users");
const projectsCollection = db.collection("projects");

export { db, auth, usersCollection, projectsCollection };
