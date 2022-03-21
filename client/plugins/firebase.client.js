import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

export default ({ store, env }, inject) => {
  const firebaseConfig = {
    apiKey: env.NUXT_ENV_FIREBASE_CONFIG_API_KEY,
    authDomain: env.NUXT_ENV_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: env.NUXT_ENV_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: env.NUXT_ENV_STORAGE_BUCKET,
    messagingSenderId: env.NUXT_ENV_MESSAGING_SENDER_ID,
    appId: env.NUXT_ENV_ID,
    measurementId: env.NUXT_ENV_MEASUREMENT_ID,
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
  const functions = getFunctions(firebaseApp);

  if (env.useFirebaseEmulators) {
    connectAuthEmulator(auth, "http://localhost:10000");
    connectFunctionsEmulator(functions, "localhost", 10001);
    connectFirestoreEmulator(db, "localhost", 10002);
    connectStorageEmulator(storage, "localhost", 10005);
  }

  const sendVerificationEmail = (authUser) => {
    sendEmailVerification(authUser, {
      url: `${env.baseUrl}dashboard`,
    });
  };

  const firebase = {
    db,
    storage,
    auth,
    sendVerificationEmail,
  };
  inject("firebase", firebase);

  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(async (user) => {
      await store.dispatch("onAuthStateChangedAction", { authUser: user });
      return resolve();
    });
  });
};
