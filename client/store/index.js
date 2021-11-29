import * as axios from "axios";
import { starterCode } from "./code";

export const state = () => ({
  authUserId: null,
  showFeedbackModal: false,
  token: null,
  currentUser: {},
  isEmailVerified: null,
  readonly: {},
  project: {
    id: null,
    url: null,
    user: {},
    blob: [
      {
        fullPath: "initialPath",
        relativePath: "app/main.py",
        text: "",
      },
    ],
  },
  appScript: null,
});

export const getters = {
  canEdit(state) {
    if (!state.currentUser.id) {
      return false;
    }
    return state.currentUser.id === state.project.user.id;
  },
  userProjectUrls(state) {
    if (!state.currentUser.projects) {
      return [];
    }
    return Object.values(state.currentUser.projects).map((project) => {
      return project.url;
    });
  },
  loggedIn(state) {
    return state.authUserId;
  },
};

export const actions = {
  nuxtServerInit({ commit }, { res }) {
    if (res && res.locals && res.locals.user) {
      const {
        allClaims: claims,
        idToken: token,
        ...authUser
      } = res.locals.user;
      commit("SET_AUTH_STATE", authUser);
    }
  },

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

  async createProject({ state }, url) {
    const projectRef = this.$projectsCollection.doc();

    const relativePath = "main.py";
    const blob = {
      relativePath,
      fullPath: `${state.currentUser.id}/projects/${projectRef.id}/${relativePath}`,
    };

    await this.$storageRef.child(blob.fullPath).putString(starterCode);

    const project = {
      id: projectRef.id,
      url,
      created: this.$fireModule.firestore.FieldValue.serverTimestamp(),
      blob: [blob],
      user: {
        id: state.currentUser.id,
        name: state.currentUser.name,
      },
    };

    await projectRef.set(project);
    console.log(project);
    this.$router.push(`${project.user.name}/projects/${project.url}/code`);
  },

  async setProject({ commit }, payload) {
    console.log(
      `getting project for ${payload.userName}/projects/${payload.projectUrl}`
    );

    const querySnapshot = await this.$projectsCollection
      .where("user.name", "==", payload.userName)
      .where("url", "==", payload.projectUrl)
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

  async setAppScript({ state, commit }) {
    console.log("getting app script");
    const res = await axios.post(
      `http://localhost:5000/project`,
      state.project
    );
    console.log(res.data);
    commit("SET_APP_SCRIPT", res.data);
  },

  updateCode({ state, commit, dispatch }, payload) {
    commit("UPDATE_CODE", payload); // not necessary?
    this.$storageRef.child(payload.blob.fullPath).putString(payload.text);
    dispatch("setAppScript", state.project);
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
    state.project = project;
  },
  SET_APP_SCRIPT(state, script) {
    state.appScript = script;
  },
  UPDATE_CODE(state, payload) {
    for (const blob of state.project.blob) {
      if (blob.fullPath === payload.blob.fullPath) {
        blob.text = payload.text;
      }
    }
  },
};