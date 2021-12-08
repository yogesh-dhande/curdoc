import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_MESSAGING_SENDER_ID,
  appId: process.env.NUXT_ENV_ID,
  measurementId: process.env.NUXT_ENV_MEASUREMENT_ID,
};

let firebaseApp;
const apps = getApps();
if (!apps.length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = apps[0];
}

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export default ({ store }, inject) => {
  console.log("setting listener on auth changed");

  const firebase = {
    db,
    storage,
    auth,
  };
  inject("firebase", firebase);

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      console.log("calling on auth changed");
      await store.dispatch("onAuthStateChangedAction", { authUser: user });
      return resolve();
    });
  });
};
