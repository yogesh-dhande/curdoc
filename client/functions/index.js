const admin = require('firebase-admin');
const functions = require('firebase-functions');
require('dotenv').config();
const app = require('express')();
const cors = require('cors');
app.use(cors());
const {
    log
} = require('./util/util');
const {
    createUser
} = require('./helper/firestore');

admin.initializeApp();

const db = admin.firestore();

exports.addUserWhenCreatedInFirebaseAuth = functions.auth.user()
    .onCreate(async (user) => {
        const msg = 'a new user was registered, hence adding user to user collection - ' + JSON.stringify(user);
        log(msg);

        return createUser(db, user);
    });
