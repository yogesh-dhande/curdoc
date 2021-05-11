import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import router from "./router.js";

Vue.use(Vuex);

export function treeFromBlobList(blobList) {
  let result = [];
  let level = { result };

  blobList.forEach((blob) => {
    let path = blob.filePath;
    path.split("/").reduce((r, name) => {
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({ name, children: r[name].result });
      }

      return r[name];
    }, level);
  });

  return result;
}

const store = new Vuex.Store({
  state: {
    token: null,
    project: {
      id: null,
      name: null,
      user: {},
      blob: [
        {
          relative_path: "main.py",
          text: "",
        },
      ],
    },
    // whenever code or project  changes, state.appScript is changed
    // but not applied to the app until the router navigates to the AppPreview component.
    // Set to null when no pending changes
    appScript: null,
    currentUser: {},
    userProfile: {},
    loading: false,
    error: {
      response: {
        status: "404",
        data: {
          message: "Page Not Found",
        },
      },
    },
  },
  getters: {
    canEdit(state) {
      if (!state.currentUser.id) {
        return false;
      }
      return state.currentUser.id == state.project.user.id;
    },
  },
  actions: {
    async setAppScript({ commit }, payload) {
      console.log("getting app script");
      commit("setLoading", true);
      return await axios
        .get(`${process.env.VUE_APP_BACKEND_URL}/script`, {
          params: payload,
        })
        .then((res) => {
          console.log("setting state.appScript");
          commit("setAppScript", res.data);
        })
        .finally(() => {
          commit("setLoading", false);
        })
        .catch((error) => {
          commit("setError", error);
          router.replace("/error");
        });
    },
    updateCode({ commit, state, dispatch }, payload) {
      console.log(payload);
      commit("setAppScript", null);
      axios
        .put(`${process.env.VUE_APP_BACKEND_URL}/blob`, payload, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        })
        .then((res) => {
          commit("updateBlob", res.data);
          dispatch("setAppScript", {
            user_name: payload.project.user.name,
            project_name: payload.project.name,
          });
        })
        .catch((error) => commit("setError", error));
    },
    createProject({ commit, state }, projectName) {
      console.log(`creating project ${projectName}`);
      commit("setLoading", true);
      axios
        .post(`${process.env.VUE_APP_BACKEND_URL}/project`, {
          user: state.currentUser,
          name: projectName,
        })
        .then((res) => {
          console.log(res.data);
          commit("setProject", res.data);
          router.push(`${state.currentUser.name}/${projectName}/code`);
        })
        .finally(() => commit("setLoading", false))
        .catch((error) => {
          commit("setError", error);
          router.replace("/error");
        });
    },
    async setProject({ commit }, payload) {
      commit("setLoading", true);
      console.log(
        `getting project for ${payload.user_name} - ${payload.project_name}`
      );
      axios
        .get(`${process.env.VUE_APP_BACKEND_URL}/project`, {
          params: payload,
        })
        .then((res) => {
          commit("setProject", res.data);
          console.log(res.data);
        })
        .catch((error) => {
          commit("setError", error);
          router.replace("/error");
          console.log("set project error");
        })
        .finally(() => commit("setLoading", false));
    },
    clearData({ commit }) {
      commit("clearData");
    },
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    loadProject(state, payload) {
      state.project.id = payload.id;
      state.project.user = payload.userName;
      state.project.name = payload.projectName;
    },
    addProjectToCurrentUser(state, project) {
      Vue.set(state.currentUser.projects, project.id, project);
    },
    setProject(state, project) {
      state.project = project;
    },
    updateAppScript(state, val) {
      state.appScript = val;
    },
    updateprojectName(state, val) {
      state.projectName = val;
    },
    updateBlob(state, blob) {
      console.log(blob);
      let newBlob = state.project.blob.filter(
        (item) => item.relative_path == "main.py"
      );
      console.log(blob.relative_path);
      newBlob[0].text = blob.text;
    },
    clearData(state) {
      state.currentUser = {};
      state.appScript = null;
    },
    setLoading(state, val) {
      state.loading = val;
    },
    setError(state, val) {
      state.error = val;
    },
    setToken(state, val) {
      state.token = val;
    },
    setAppScript(state, script) {
      state.appScript = script;
    },
  },
});

export default store;
