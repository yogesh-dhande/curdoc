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
    name: null,
    user: {},
    blob: [
      {
        relativePath: "main.py"
      }
    ]
  },
  appScript: null
});

export const getters = {
  canEdit(state) {
    if (!state.currentUser.id) {
      return false;
    }
    return state.currentUser.id == state.project.user.id;
  },
  userProjectUrls(state) {
    if (!state.currentUser.projects) {
      return [];
    }
    return Object.values(state.currentUser.projects).map(project => {
      return project.url;
    });
  },
  userTags(state) {
    if (!state.currentUser.posts) {
      return [];
    }
    let tagList = Object.values(state.currentUser.posts).map(post => {
      return post.tags;
    });

    return [...new Set([].concat.apply([], tagList))];
  },
  loggedIn(state) {
    return state.authUserId;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { res }) {
    if (res && res.locals && res.locals.user) {
      const {
        allClaims: claims,
        idToken: token,
        ...authUser
      } = res.locals.user;
      commit("SET_AUTH_STATE", authUser);
    }
  },

  async onAuthStateChangedAction({ commit }, { authUser }) {
    commit("SET_AUTH_STATE", authUser ? authUser : {});

    if (!authUser) {
      // remove state
      commit("SET_USER", {});
      commit("SET_TOKEN", null);
    } else {
      authUser.getIdToken(/* forceRefresh */ true).then(token => {
        this.$fire.analytics.setUserId(authUser.uid);
        commit("SET_TOKEN", token);
        commit("SET_EMAIL_VERIFIED", authUser.emailVerified);

        this.$usersCollection.doc(authUser.uid).onSnapshot(snap => {
          commit("SET_USER", snap.data() || {});
        });

        this.$readonlyCollection.doc(authUser.uid).onSnapshot(snap => {
          commit("SET_READONLY_DATA", snap.data() || {});
        });
      });
    }
  },

  async createProject({ state }, url) {
    let projectRef = this.$projectsCollection.doc();

    let relativePath = "main.py";
    let blob = {
      relativePath: relativePath,
      fullPath: `${state.currentUser.id}/projects/${projectRef.id}/${relativePath}`
    };

    await this.$storageRef.child(blob.fullPath).putString(starterCode);

    let project = {
      id: projectRef.id,
      url: url,
      created: this.$fireModule.firestore.FieldValue.serverTimestamp(),
      blob: [blob],
      user: {
        id: state.currentUser.id,
        name: state.currentUser.name
      }
    };

    await projectRef.set(project);
    console.log(project);
    this.$router.push(`${project.user.name}/projects/${project.url}/code`);
  },

  async setProject({ commit }, payload) {
    console.log(
      `getting project for ${payload.userName}/projects/${payload.projectUrl}`
    );

    let querySnapshot = await this.$projectsCollection
      .where("user.name", "==", payload.userName)
      .where("url", "==", payload.projectUrl)
      .get();

    if (!querySnapshot.empty) {
      const project = querySnapshot.docs[0].data();
      project.blob.forEach(async blob => {
        // let url = await this.$storageRef.child(blob.fullPath).getDownloadURL();
        // let res = await axios.get(url);
        // console.log(res.data);
        blob.text = starterCode;
      });
      commit("SET_PROJECT", project);
      console.log(project);
    }
  },

  async setAppScript({ state, commit }, payload) {
    console.log("getting app script");
    // payload.project = state.project;
    // let res = await axios.get(`${process.env.VUE_APP_BACKEND_URL}/script`, {
    //   params: payload,
    // });
    // commit("SET_APP_SCRIPT", res.data);
  }
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
  }
};
