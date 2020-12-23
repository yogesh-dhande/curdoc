import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";
import router from "./router.js";

// const fb = require("./firebaseConfig.js");

Vue.use(Vuex);

const starterCode = `
import numpy as np

from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider
from bokeh.plotting import ColumnDataSource, figure
from bokeh.io import curdoc

x = np.linspace(0, 10, 500)
y = np.sin(x)

source = ColumnDataSource(data=dict(x=x, y=y))

plot = figure(y_range=(-10, 10), plot_width=400, plot_height=400)

plot.line('x', 'y', source=source, line_width=3, line_alpha=0.6)

amp_slider = Slider(start=0.1, end=10, value=1, step=.1, title="Amplitude")
freq_slider = Slider(start=0.1, end=10, value=1, step=.1, title="Frequency")
phase_slider = Slider(start=0, end=6.4, value=0, step=.1, title="Phase")
offset_slider = Slider(start=-5, end=5, value=0, step=.1, title="Offset")

callback = CustomJS(args=dict(source=source, amp=amp_slider, freq=freq_slider, phase=phase_slider, offset=offset_slider),
                    code="""
    const data = source.data;
    const A = amp.value;
    const k = freq.value;
    const phi = phase.value;
    const B = offset.value;
    const x = data['x']
    const y = data['y']
    for (var i = 0; i < x.length; i++) {
        y[i] = B + A*Math.sin(k*x[i]+phi);
    }
    source.change.emit();
""")

amp_slider.js_on_change('value', callback)
freq_slider.js_on_change('value', callback)
phase_slider.js_on_change('value', callback)
offset_slider.js_on_change('value', callback)

layout = row(
    column(amp_slider, freq_slider, phase_slider, offset_slider),
    plot
)

curdoc().add_root(layout)
`

const initialState = {
  session: null,
  code: "",
  appScript: null,
  project: {
    id: null,
    name: null,
    user: null
  },
  user: {
    name: null,
    projects: {}
  },  // for identification of code or project to load
  projectName: null,  // for identification of code or project to load
  currentUser: {
    name: "guest",
    projects: {}
  },  // currently authenticated user
  userProfile: {},
}

export function treeFromBlobList(blobList) {
  let result = [];
  let level = {result};

  blobList.forEach(blob => {
    let path = blob.filePath
    path.split('/').reduce((r, name) => {
      if(!r[name]) {
        r[name] = {result: []};
        r.result.push({name, children: r[name].result})
      }
      
      return r[name];
    }, level)
  })

  return result
}

const store = new Vuex.Store({
    state: initialState,
    getters: {
      projects(state) {
        return state.projects
      }
    },
    actions: {
      setCurrentUser({commit}, userName) {
        console.log(`${process.env.VUE_APP_BACKEND_URL}/users/${userName}`)
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${userName}`)
        .then(
          res => {
            commit("setCurrentUser", res.data)
          }
        )
      },
      setUser({commit}, userName) {
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${userName}`)
        .then(
          res => {
            console.log(res.data)
            commit("setUser", res.data)
          }
        )
      },
      updateCode({commit, state}, code) {
        commit("updateCode", code)
        console.log(`getting script for ${state.userName} - ${state.projectName}`)
        axios.post(`${process.env.VUE_APP_BACKEND_URL}/code`, {
          userName: state.currentUser.name,
          projectName: state.projectName,
          code: state.code,
        })
      },
      createProject({commit, state}, projectName) {
        console.log(`creating project ${projectName}`)
        commit("updateprojectName", projectName)
        commit("setuserName", state.currentUser.name)
        commit("updateCode", starterCode);
        router.push(`${state.currentUser.name}/${state.projectName}/code`)
        axios.post(`${process.env.SERVER_URL}/projects`, {
          userName: state.currentUser.name,
          projectName: state.projectName,
          code: starterCode
        }).then(res => console.log(res.data))
      },
      getCodeForProject({ commit }, payload) {
        commit("updateprojectName", payload.projectName)
        commit("setuserName", payload.userName)
        console.log(`getting code for ${payload.userName} - ${payload.projectName}`)

        axios.get(`${process.env.VUE_APP_BACKEND_URL}/code`, { params: payload } ).then((res) => {
          commit("updateCode", res.data.code);
          console.log(res.data)
        });
      },
      getScriptForProject({ commit }, payload) {
        commit("updateprojectName", payload.projectName)
        commit("setuserName", payload.userName)
        console.log(`getting script for ${payload.userName} - ${payload.projectName}`)
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/script`, { params: payload } ).then((res) => {
          console.log(res.data)
          commit("updateAppScript", res.data.script);
        });
      },
      clearData({commit}) {
        commit("clearData")
      },
    },
    mutations: {
      setCurrentUser(state, val) {
        state.currentUser = val;
      },
      setUser(state, val) {
        state.user = val;
      },
      loadProject(state, payload) {
        state.project.id = payload.id
        state.project.user = payload.userName
        state.project.name = payload.projectName
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
