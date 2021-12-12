import { get, post } from "axios";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
// eslint-disable-next-line import/order
import { join } from "path";
import { starterBokehCode } from "./demo";

export const state = () => ({
  authUserId: null,
  showFeedbackModal: false,
  token: null,
  currentUser: {},
  isEmailVerified: false,
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
        text: starterBokehCode,
      },
    ],
  },
  codeChanged: false,
  appScript: null,
});

export const getters = {
  canEdit(state) {
    try {
      // Allow editing demo projects
      if (state.project && state.project.demo) return true;
      // Guests cannot edit any projects besides demo projects
      else if (!state.currentUser.id) {
        return false;
      }
      // Logged in users can edit their own projects
      return state.currentUser.id === state.project.user.id;
    } catch (error) {
      console.log(error);
    }
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
  onAuthStateChangedAction({ commit, dispatch }, { authUser }) {
    commit("SET_AUTH_STATE", authUser || {});

    if (!authUser) {
      // remove state
      commit("SET_USER", {});
      commit("SET_TOKEN", null);
      commit("SET_EMAIL_VERIFIED", false);
    } else {
      authUser.getIdToken(/* forceRefresh */ true).then((token) => {
        commit("SET_TOKEN", token);
        commit("SET_EMAIL_VERIFIED", authUser.emailVerified);
        if (!authUser.emailVerified) {
          this.$firebase.sendVerificationEmail(authUser);
        }

        onSnapshot(doc(this.$firebase.db, "users", authUser.uid), (snap) => {
          commit("SET_USER", snap.data() || {});
        });

        onSnapshot(doc(this.$firebase.db, "readonly", authUser.uid), (snap) => {
          commit("SET_READONLY_DATA", snap.data() || {});
        });
      });
    }
  },

  async createProject({ state }, slug) {
    const projectRef = doc(collection(this.$firebase.db, "projects"));

    const relativePath = "main.py";
    const blob = {
      relativePath,
      fullPath: `${state.currentUser.id}/projects/${projectRef.id}/${relativePath}`,
    };

    await uploadString(
      ref(this.$firebase.storage, join("users", blob.fullPath)),
      starterBokehCode
    );

    const project = {
      id: projectRef.id,
      slug,
      created: serverTimestamp(),
      blob: [blob],
      user: {
        id: state.currentUser.id,
        name: state.currentUser.name,
      },
    };

    await setDoc(projectRef, project);
    this.$splitbee.track("createProject", project);
    this.$router.push(`${project.user.name}/projects/${project.slug}/code`);
  },

  async setProject({ commit }, payload) {
    console.log(
      `getting project for ${payload.userName}/projects/${payload.projectSlug}`
    );

    const querySnapshot = await getDocs(
      query(
        collection(this.$firebase.db, "projects"),
        where("user.name", "==", payload.userName),
        where("slug", "==", payload.projectSlug)
      )
    );

    if (!querySnapshot.empty) {
      const project = querySnapshot.docs[0].data();

      for (const blob of project.blob) {
        const url = await getDownloadURL(
          ref(this.$firebase.storage, join("users", blob.fullPath))
        );
        const res = await get(url);

        blob.text = res.data;
      }

      commit("SET_PROJECT", project);
    }
  },

  async setAppScript({ state, commit }, query) {
    console.log("getting app script");
    try {
      const res = await post(`${this.$config.functionsUrl}/getAppScript`, {
        project: state.project,
        new: state.codeChanged,
        query,
      });

      commit("SET_APP_SCRIPT", res.data);
      this.$splitbee.track("getAppScript");

      if (
        state.codeChanged &&
        state.project.user &&
        state.project.user.name !== "guest"
      ) {
        console.log("uploading code");
        state.project.blob.map((blob) =>
          uploadString(
            ref(this.$firebase.storage, join("users", blob.fullPath)),
            blob.text
          )
        );
      }
    } catch (error) {
      if (error.response) {
        commit("SET_APP_SCRIPT", error.response.data.message);
        this.$splitbee.track("Error", {
          errors: [error.response.data.message],
        });
      }
    }
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
  SET_CODE_CHANGED(state, codeChanged) {
    state.codeChanged = codeChanged;
  },
};
