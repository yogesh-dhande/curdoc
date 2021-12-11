const functions = require("firebase-functions");
const { db, admin } = require("./app");

exports.updateUserWhenNewProjectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(async (snap, context) => {
    let { projectId } = context.params;
    let userId = snap.get("user.id");
    let data = snap.data();
    try {
      await db.doc(`users/${userId}`).update(`projects.${projectId}`, {
        slug: data.slug,
        id: data.id,
      });
      console.log(`Created project ${projectId} for user ${userId}`);
    } catch (error) {
      console.log(
        `Error creating project ${projectId} for user ${userId}: ${error}`
      );
    }
    return null;
  });

exports.updateUserWhenProjectUpdated = functions.firestore
  .document("projects/{projectId}")
  .onUpdate(async (change, context) => {
    let { projectId } = context.params;
    let data = change.after.data();
    try {
      let snap = await db.doc(`projects/${projectId}`).get();
      let userId = snap.get("user.id");
      let patch = {
        slug: data.slug,
      };

      await db.doc(`users/${userId}`).update(`projects.${projectId}`, patch);
      console.log(`Updated project ${projectId} for the user ${userId}`);
    } catch (error) {
      console.log(
        `Error updating post ${projectId} for user ${userId}: ${error}`
      );
    }
    return null;
  });

exports.handleProjectDeleted = functions.firestore
  .document("projects/{projectId}")
  .onDelete(async (snap, context) => {
    let { projectId } = context.params;
    let data = snap.data();
    let userId = data.user.id;
    try {
      await db
        .doc(`users/${userId}`)
        .update(`projects.${postId}`, admin.firestore.FieldValue.delete());

      let storageUrl = join("users", userId, "projects", projectId);
      await bucket.deleteFiles({
        prefix: storageUrl,
      });

      console.log(`Removed project ${projectId} for user ${userId}`);
    } catch (error) {
      console.log(
        `Error removing project ${projectId} for user ${userId}: ${error}`
      );
    }
    null;
  });

exports.updateProjectsWhenUserUpdated = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    let { userId } = context.params;
    let data = change.after.data();
    let patch = {};
    try {
      if (data.displayName !== change.before.data().displayName) {
        patch["user.displayName"] = data.displayName;
      }
      if (data.thumbnailUrl !== change.before.data().thumbnailUrl) {
        patch["user.thumbnailUrl"] = data.thumbnailUrl;
      }
      if (!isEmpty(patch)) {
        let querySnapshot = await db
          .collection("projects")
          .where("user.id", "==", userId)
          .get();
        querySnapshot.forEach((doc) => {
          db.doc(`projects/${doc.id}`).update(patch);
          console.log(`Updated project ${doc.id} for the user ${userId}`);
        });
      }
    } catch (error) {
      console.log(`Error updating projects for user ${userId}: ${error}`);
    }
    return null;
  });
