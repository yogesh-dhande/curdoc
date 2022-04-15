import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  // eslint-disable-next-line no-unused-vars
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  setLogLevel,
  updateDoc,
} from "firebase/firestore";

const fs = require("fs");

const FIREBASE_PROJECT_ID = "demo-project-1234";

/** @type RulesTestEnvironment */
let testEnv;

const uid = "testuser";
const username = "testname";
const projectId = "testProjectId";
const validProject = {
  id: projectId,
  slug: "testSlug",
  user: {
    id: uid,
    name: username,
  },
};

beforeAll(async () => {
  setLogLevel("error");
  testEnv = await initializeTestEnvironment({
    projectId: FIREBASE_PROJECT_ID,
    firestore: {
      rules: fs.readFileSync("firestore.rules", "utf8"),
    },
  });
  return testEnv;
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  testEnv.withSecurityRulesDisabled(
    async (context) =>
      await setDoc(doc(context.firestore(), `users/${uid}`), {
        id: uid,
        name: username,
      })
  );
});

afterEach(async () => {});

afterAll(async () => {
  // Delete all the FirebaseApp instances created during testing
  // Note: this does not affect or clear any data
  await testEnv.cleanup();
});

test("Guests can not read other users data", async () => {
  const guest = testEnv.unauthenticatedContext();
  await assertFails(getDoc(doc(guest.firestore(), `users/${uid}`)));
});

test("users cannot create a user doc", async () => {
  const userId = "newUser";
  const user = testEnv.authenticatedContext(userId);
  const data = { key: "value", id: userId };
  await assertFails(setDoc(doc(user.firestore(), `users/${userId}`), data));
});

test("users cannot delete a user doc", async () => {
  const user = testEnv.authenticatedContext(uid);
  const data = { key: "value", id: uid };
  await assertFails(deleteDoc(doc(user.firestore(), `users/${uid}`), data));
});

test("users can only update their own doc", async () => {
  const user = testEnv.authenticatedContext(uid);
  await assertFails(
    updateDoc(
      doc(testEnv.unauthenticatedContext().firestore(), `users/${uid}`),
      { key: "value" }
    )
  );

  await assertFails(
    updateDoc(
      doc(
        testEnv.authenticatedContext("otherUser").firestore(),
        `users/${uid}`
      ),
      { key: "value" }
    )
  );

  await assertSucceeds(
    updateDoc(doc(user.firestore(), `users/${uid}`), { key: "value2" })
  );
});

test("users can only update their own doc", async () => {
  await assertFails(
    updateDoc(
      doc(testEnv.unauthenticatedContext().firestore(), `users/${uid}`),
      { key: "value" }
    )
  );

  await assertFails(
    updateDoc(
      doc(
        testEnv.authenticatedContext("otherUser").firestore(),
        `users/${uid}`
      ),
      { key: "value" }
    )
  );
  const user = testEnv.authenticatedContext(uid);

  await assertSucceeds(
    updateDoc(doc(user.firestore(), `users/${uid}`), { key: "value2" })
  );
});

test("anyone can read projects", async () => {
  const guest = testEnv.unauthenticatedContext();
  await assertSucceeds(getDoc(doc(guest.firestore(), `projects/${projectId}`)));
});

test("users can only create projects with valid data", async () => {
  await assertFails(
    setDoc(
      doc(
        testEnv.authenticatedContext(uid).firestore(),
        `projects/${projectId}`
      ),
      {
        id: projectId,
      }
    )
  );

  await assertSucceeds(
    setDoc(
      doc(
        testEnv.authenticatedContext(uid).firestore(),
        `projects/${projectId}`
      ),
      validProject
    )
  );
});

test("only authenticated users can create projects", async () => {
  await assertFails(
    setDoc(
      doc(
        testEnv.unauthenticatedContext().firestore(),
        `projects/${projectId}`
      ),
      validProject
    )
  );

  await assertSucceeds(
    setDoc(
      doc(
        testEnv.authenticatedContext(uid).firestore(),
        `projects/${projectId}`
      ),
      validProject
    )
  );
});

test("users can only delete their own projects", async () => {
  testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(
      doc(context.firestore(), `projects/${projectId}`),
      validProject
    );
  });

  await assertFails(
    deleteDoc(
      doc(testEnv.unauthenticatedContext().firestore(), `projects/${projectId}`)
    )
  );

  await assertSucceeds(
    deleteDoc(
      doc(
        testEnv.authenticatedContext(uid).firestore(),
        `projects/${projectId}`
      )
    )
  );
});
