import * as axios from "axios";
import { starterCode } from "./demo";

export const state = () => ({
  authUserId: null,
  showFeedbackModal: false,
  token: null,
  currentUser: {},
  isEmailVerified: null,
  readonly: {},
  project: {
    id: "",
    slug: "",
    user: {
      id: "",
      name: "",
    },
    blob: [
      {
        fullPath: "initialPath",
        relativePath: "app/main.py",
        text: starterCode,
      },
    ],
  },
  codeChanged: false,
  appScript: null,
});

export const getters = {
  canEdit(state) {
    if (!state.currentUser.id) {
      return false;
    }
    return state.currentUser.id === state.project.user.id;
  },
  userprojectSlugs(state) {
    if (!state.currentUser.projects) {
      return [];
    }
    return Object.values(state.currentUser.projects).map((project) => {
      return project.slug;
    });
  },
  loggedIn(state) {
    return state.authUserId;
  },
};

export const actions = {
  onAuthStateChangedAction({ commit }, { authUser }) {
    commit("SET_AUTH_STATE", authUser || {});

    if (!authUser) {
      // remove state
      commit("SET_USER", {});
      commit("SET_TOKEN", null);
    } else {
      authUser.getIdToken(/* forceRefresh */ true).then((token) => {
        this.$fire.analytics.setUserId(authUser.uid);
        commit("SET_TOKEN", token);
        commit("SET_EMAIL_VERIFIED", authUser.emailVerified);

        this.$usersCollection.doc(authUser.uid).onSnapshot((snap) => {
          commit("SET_USER", snap.data() || {});
        });

        this.$readonlyCollection.doc(authUser.uid).onSnapshot((snap) => {
          commit("SET_READONLY_DATA", snap.data() || {});
        });
      });
    }
  },

  async createProject({ state }, slug) {
    const projectRef = this.$projectsCollection.doc();

    const relativePath = "main.py";
    const blob = {
      relativePath,
      fullPath: `${state.currentUser.id}/projects/${projectRef.id}/${relativePath}`,
    };

    await this.$storageRef.child(blob.fullPath).putString(starterCode);

    const project = {
      id: projectRef.id,
      slug,
      created: this.$fireModule.firestore.FieldValue.serverTimestamp(),
      blob: [blob],
      user: {
        id: state.currentUser.id,
        name: state.currentUser.name,
      },
    };

    await projectRef.set(project);
    console.log(project);
    this.$router.push(`${project.user.name}/projects/${project.slug}/code`);
  },

  async setProject({ commit }, payload) {
    console.log(
      `getting project for ${payload.userName}/projects/${payload.projectSlug}`
    );

    const querySnapshot = await this.$projectsCollection
      .where("user.name", "==", payload.userName)
      .where("slug", "==", payload.projectSlug)
      .get();

    if (!querySnapshot.empty) {
      const project = querySnapshot.docs[0].data();

      for (const blob of project.blob) {
        const url = await this.$storageRef
          .child(blob.fullPath)
          .getDownloadURL();
        const res = await axios.get(url);

        blob.text = res.data;
      }

      commit("SET_PROJECT", project);
    }
  },

  async setAppScript({ state, commit }, query) {
    console.log("getting app script");
    try {
      const res = await axios.post(`http://localhost:5000/backend/project`, {
        project: state.project,
        new: state.codeChanged,
        query,
      });
      console.log(res.data);
      commit("SET_APP_SCRIPT", res.data);
    } catch (error) {
      console.log(error);
    }

    return Promise.all(
      state.project.blob.map((blob) =>
        this.$storageRef.child(blob.fullPath).putString(blob.text)
      )
    );
  },

  updateCode({ commit }, payload) {
    commit("UPDATE_CODE", payload);
  },
};

export const mutations = {
  SET_USER(state, val) {
    state.currentUser = val;
  },
  SET_AUTH_STATE(state, authUser) {
    state.authUserId = authUser.uid;
  },
  SET_TOKEN(state, val) {
    state.token = val;
  },
  SET_EMAIL_VERIFIED(state, val) {
    state.isEmailVerified = val;
  },
  SET_READONLY_DATA(state, data) {
    state.readonly = data;
  },
  SET_PROJECT(state, project) {
    console.log(`setting project`);
    state.project = project;
  },
  SET_APP_SCRIPT(state, script) {
    state.appScript = script;
    state.codeChanged = false;
  },
  UPDATE_CODE(state, payload) {
    for (const blob of state.project.blob) {
      if (blob.fullPath === payload.blob.fullPath) {
        blob.text = payload.text;
      }
    }
    state.codeChanged = true;
  },
};
