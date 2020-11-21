import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
    apiKey: process.env.VUE_APP_FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_CONFIG_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_CONFIG_PROJECT_ID
};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

// firebase collections
const usersCollection = db.collection('users');

export {
    db,
    auth,
    usersCollection
}

