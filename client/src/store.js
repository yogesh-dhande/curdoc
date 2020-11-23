import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

const fb = require("./firebaseConfig.js");

Vue.use(Vuex);

export function buildStore(user) {
  let store = new Vuex.Store({
    state: {
      session: null,
      projectId: null,
      code: "",
      appScript: null,
      user: user || 'guest',
      userProfile: {},
    },
    getters: {
    },
    actions: {
      updateCode({commit}, code) {
        commit("updateCode", code)
      },
      getCodeForProject({ commit, state }, projectId) {
        if (state.projectId != projectId) {
          commit("updateProjectId", projectId);
          axios.get(`http://localhost:8000/code/${projectId}`).then((res) => {
            commit("updateCode", res.data.code);
          });
        }
      },
      getScriptForProject({ commit, state }, projectId) {
        if (state.projectId != projectId) {
          commit("updateProjectId", projectId);
          axios.get(`http://localhost:8000/script/${projectId}`).then((res) => {
            commit("updateAppScript", res.data.script);
          });
        } else {
          // must overwrite remote with local code first to get new script
          axios
            .post(`http://localhost:8000/code/${projectId}`, {
              code: state.code,
            })
            .then((res) => {
              commit("updateAppScript", res.data.script);
            });
        }
      },
      fetchUserProfile({ commit, state }) {
        fb.usersCollection
          .doc(state.user.uid)
          .get()
          .then((res) => {
            commit("setUserProfile", res.data());
          })
          .catch((err) => {
            console.log(err);
          });
      },
      updateProfile({ state }, data) {
        let name = data.name;
        let title = data.title;

        fb.usersCollection
          .doc(state.user.uid)
          .update({ name, title })
          .then(() => {
            // eslint-disable-line no-unused-vars
            // update all posts by user to reflect new name
            fb.postsCollection
              .where("userId", "==", state.user.uid)
              .get()
              .then((docs) => {
                docs.forEach((doc) => {
                  fb.postsCollection.doc(doc.id).update({
                    userName: name,
                  });
                });
              });
            // update all comments by user to reflect new name
            fb.commentsCollection
              .where("userId", "==", state.user.uid)
              .get()
              .then((docs) => {
                docs.forEach((doc) => {
                  fb.commentsCollection.doc(doc.id).update({
                    userName: name,
                  });
                });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    mutations: {
      setCurrentUser(state, val) {
        state.user = val;
      },
      setUserProfile(state, val) {
        state.userProfile = val;
      },
      updateCode(state, val) {
        state.code = val;
      },
      updateAppScript(state, val) {
        state.appScript = val;
      },
      updateProjectId(state, val) {
        state.projectId = val;
      },
    },
  });

  return store;
}
