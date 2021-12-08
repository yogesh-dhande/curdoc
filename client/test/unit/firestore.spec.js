const fs = require("fs");
const http = require("http");
const firebase = require("@firebase/rules-unit-testing");

const PROJECT_ID = "databrowser-ykd";
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

const uid = "testuser";
const username = "testname";
const projectId = "testProjectId";
const validProject = {
  id: projectId,
  slug: "testSlug",
  created: firebase.firestore.FieldValue.serverTimestamp(),
  user: {
    id: uid,
    name: username,
  },
};

function getAuthedFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

async function getFiresoreWithProject(auth) {
  // Set up: user doc needs to exist first
  const db = await getAuthedFirestore(auth);

  await db.collection("users").doc(uid).set(validProject.user);

  await db.collection("projects").doc(projectId).set(validProject);

  return db;
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

beforeAll(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync("firestore.rules", "utf8");
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

afterAll(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await Promise.all(firebase.apps().map((app) => app.delete()));

  // Write the coverage report to a file
  const coverageFile = "firestore-coverage.html";
  const fstream = fs.createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    http.get(COVERAGE_URL, (res) => {
      res.pipe(fstream, { end: true });

      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

test("anyone can read projects", async () => {
  const db = getAuthedFirestore();
  await firebase.assertSucceeds(db.collection("projects").doc("anyDoc").get());
});

test("Users can not read other users data", async () => {
  const db = getAuthedFirestore();
  await firebase.assertFails(db.collection("users").doc("anyDoc").get());
});

test("only authenticated users can write to their own doc", async () => {
  const data = { key: "value" };

  await firebase.assertFails(
    getAuthedFirestore().collection("users").doc("testuser").set(data)
  );

  await firebase.assertFails(
    getAuthedFirestore({ uid: "testuser" })
      .collection("users")
      .doc("testuser2")
      .set(data)
  );
  await firebase.assertSucceeds(
    getAuthedFirestore({ uid: "testuser" })
      .collection("users")
      .doc("testuser")
      .set(data)
  );
});

test("only authenticated users can create projects", async () => {
  const invalidPost = { key: "value" };

  await getAuthedFirestore({ uid })
    .collection("users")
    .doc(uid)
    .set(validProject.user);

  await firebase.assertFails(
    getAuthedFirestore().collection("projects").doc(projectId).set(validProject)
  );

  await firebase.assertFails(
    getAuthedFirestore({ uid })
      .collection("projects")
      .doc(projectId)
      .set(invalidPost)
  );

  await firebase.assertSucceeds(
    getAuthedFirestore({ uid })
      .collection("projects")
      .doc(projectId)
      .set(validProject)
  );

  await firebase.assertSucceeds(
    getAuthedFirestore({ uid, email_verified: true })
      .collection("projects")
      .doc(projectId)
      .set(validProject)
  );
});

test("users can can only delete their own projects", async () => {
  getFiresoreWithProject({ uid, email_verified: true });

  await firebase.assertFails(
    getAuthedFirestore().collection("projects").doc(projectId).delete()
  );

  await firebase.assertFails(
    getAuthedFirestore({ uid: "testuser2", email_verified: true })
      .collection("projects")
      .doc(projectId)
      .delete()
  );

  await firebase.assertSucceeds(
    getAuthedFirestore({ uid }).collection("projects").doc(projectId).delete()
  );
});
