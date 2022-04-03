const admin = require("firebase-admin");

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);

let domain = `https://${adminConfig.projectId}web.app`;
let serviceAccount = require("./../serviceKey.staging.json");
let sandboxUrls;

if (process.env.FUNCTIONS_EMULATOR) {
  // dev
  domain = "http://localhost:8080";
  sandboxUrls = [`${domain}/sandbox1/project`, `${domain}/sandbox2/project`];
} else {
  // prod
  // TODO: change domain to custom domain
  domain = "https://curdoc.dev";
  serviceAccount = require("./../serviceKey.prod.json");
}

adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

exports.admin = admin;
exports.db = admin.firestore();
exports.bucket = admin.storage().bucket();
exports.auth = admin.auth();

exports.cors = require("cors")({ origin: [domain] });
exports.sandboxUrls = sandboxUrls;
