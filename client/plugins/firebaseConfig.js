export default ({ app }, inject) => {
  inject("projectsCollection", app.$fire.firestore.collection("projects"));
  inject("usersCollection", app.$fire.firestore.collection("users"));
  inject("readonlyCollection", app.$fire.firestore.collection("readonly"));
  inject("feedbackCollection", app.$fire.firestore.collection("feedback"));

  const storageRef = app.$fire.storage.ref("users");
  inject("storageRef", storageRef);

  function uploadFile(formData, token) {
    const url = "/uploadFile";
    return app.$axios.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  inject("uploadFile", uploadFile);
};
