import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

export default ({ app, store }, inject) => {
  const firebaseConfig = {
    apiKey: app.$config.apiKey,
    authDomain: app.$config.authDomain,
    projectId: app.$config.projectId,
    storageBucket: app.$config.storageBucket,
    messagingSenderId: app.$config.messagingSenderId,
    appId: app.$config.appId,
    measurementId: app.$config.measurementId,
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

  if (app.$config.useFirebaseEmulators) {
    connectAuthEmulator(auth, "http://localhost:10000");
    connectFunctionsEmulator(functions, "localhost", 10001);
    connectFirestoreEmulator(db, "localhost", 10002);
    connectStorageEmulator(storage, "localhost", 10005);
  }

  const sendVerificationEmail = (authUser) => {
    sendEmailVerification(authUser, {
      url: `${app.$config.baseUrl}/dashboard`,
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
      console.log("calling on auth changed");
      await store.dispatch("onAuthStateChangedAction", { authUser: user });
      return resolve();
    });
  });
};
