import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "./router.js"

const fb = require("./firebaseConfig.js");

Vue.use(Vuex);

const initialState = {
  session: null,
  code: "",
  appScript: null,
  userName: null,  // for identification of code or project to load
  projectName: null,  // for identification of code or project to load
  currentUser: "guest",  // currently authenticated user
  userProfile: {},
}

const store = new Vuex.Store({
    state: initialState,
    getters: {
    },
    actions: {
      updateCode({commit, state}, code) {
        commit("updateCode", code)
        console.log(`getting script for ${state.userName} - ${state.projectName}`)
        axios.post('http://localhost:8000/code', {
          userName: state.currentUser,
          projectName: state.projectName,
          code: state.code,
        })
      },
      createProject({commit, state}, projectName) {
        commit("updateprojectName", projectName)
        console.log(`creating project ${projectName}`)
        commit("setuserName", state.currentUser)
        axios.post('http://localhost:8000/projects', {
          userName: state.currentUser,
          projectName: state.projectName,
          authUser: state.currentUser,
        }).then( res => {
          console.log(res.data)
          commit("updateCode", res.data.code);
          router.push(`${state.currentUser}/${state.projectName}/code`)
        })
      },
      getCodeForProject({ commit }, payload) {
        commit("updateprojectName", payload.projectName)
        commit("setuserName", payload.userName)
        console.log(`getting code for ${payload.userName} - ${payload.projectName}`)
        axios.get('http://localhost:8000/code', { params: payload } ).then((res) => {
          commit("updateCode", res.data.code);
          console.log(res.data.code)
        });
      },
      getScriptForProject({ commit }, payload) {
        commit("updateprojectName", payload.projectName)
        commit("setuserName", payload.userName)
        console.log(`getting script for ${payload.userName} - ${payload.projectName}`)
        axios.get('http://localhost:8000/script', { params: payload } ).then((res) => {
          console.log(res.data)
          commit("updateAppScript", res.data.script);
        });
      },
      clearData({commit}) {
        commit("clearData")
      },
      fetchUserProfile({ commit, state }) {
        fb.usersCollection
          .doc(state.currentUser)
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
          .doc(state.currentUser)
          .update({ name, title })
          .then(() => {
            // eslint-disable-line no-unused-vars
            // update all posts by user to reflect new name
            fb.postsCollection
              .where("userName", "==", state.currentUser)
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
              .where("userName", "==", state.userName)
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
        state.currentUser = val;
      },
      setuserName(state, val) {
        state.userName = val
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
      updateprojectName(state, val) {
        state.projectName = val;
      },
      clearData(state) {
        // Object.assign(state, initialState)
        state.currentUser = 'guest'
        state.code = ""
        state.appScript = null
        state.projectName = null
        state.userName = null
      }
    },
  })

export default store
