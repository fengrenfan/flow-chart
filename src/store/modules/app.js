/*
 * @Author: feng
 * @Date: 2021-01-15 14:33:55
 * @LastEditTime: 2021-01-20 16:40:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-flow-chart\src\store\modules\app.js
 */
const state = {
  data: {
    nodes: [],
    edges: []
  }
};
const mutations = {
  nodesAdd(state, payload) {
    state.data.nodes.push(payload);
  },
  nodesDel(state, payload) {
    if (payload) {
      state.data.nodes.forEach((e, index) => {
        if (e.id === payload) {
          state.data.nodes.splice(index, 1);
        }
      });
    }
  },
  edgesAdd(state, payload) {
    state.data.edges.push(payload);
  },
  editBuisid(state, payload) {
    state.data.busiid = payload;
  },
  edgesDel(state, payload) {
    if (payload) {
      state.data.edges.forEach((e, index) => {
        if (e.id === payload) {
          state.data.edges.splice(index, 1);
        }
        if (e.target == payload) {
          state.data.edges.splice(index, 1);
        } else if (e.source == payload) {
          state.data.edges.splice(index, 1);
        }
      });
    }
  },
  dataPush(state, payload) {
    if (payload) {
      state.data = payload;
    }
  },
  dataClear(state, payload) {
    if (payload) {
      state.data = {
        nodes: [],
        edges: []
      };
    }
  }
};
const getters = {
  data: state => {
    return state.data;
  }
};
const actions = {
  _nodesADD(context, payload) {
    context.commit("nodesAdd", payload);
  },
  _edgesADD(context, payload) {
    context.commit("edgesAdd", payload);
  },
  _editBUISID(context, payload) {
    context.commit("editBuisid", payload);
  },
  _edgesDEL(context, payload) {
    context.commit("edgesDel", payload);
  },
  _nodesDEL(context, payload) {
    context.commit("nodesDel", payload);
  },
  _dataPUSH(context, payload) {
    context.commit("dataPush", payload);
  },
  _dataCLEAR(context, payload) {
    context.commit("dataClear", payload);
  }
};

export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
};
