const calculateStorageUsed = async function (userId) {
  return await bucket.getFiles(
    { prefix: join("users", userId) },
    async (error, files) => {
      let readonly = { totalStorageUsed: 0 };

      if (error) {
        console.log(error);
      } else {
        files.forEach(async (file) => {
          readonly.totalStorageUsed += parseInt(file.metadata.size);
        });
      }
      await db.doc(`readonly/${userId}`).update(readonly);
    }
  );
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function isEmpty(obj) {
  return (
    obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
  );
}

async function getUIDFromRequest(req) {
  let decodedToken = await admin
    .auth()
    .verifyIdToken(req.get("authorization").replace("Bearer ", ""));
  return decodedToken.uid;
}
