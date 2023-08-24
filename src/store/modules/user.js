import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken, setUserName } from "@/utils/auth";
import {
  setLocalStore,
  getLocalStore,
  removeLocalStore,
} from "@/utils/localstore";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    certificate_Id: getLocalStore("certificate_Id") || "",
    step: getLocalStore("step") || 0,
    loading: getLocalStore("loading") || 0,
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_CERTIFICATE_ID: (state, certificate_Id) => {
    state.certificate_Id = certificate_Id;
    setLocalStore("certificate_Id", certificate_Id);
  },
  REMOVE_CERTIFICATE_ID: (state, certificate_Id) => {
    state.certificate_Id = "";
    removeLocalStore("certificate_Id");
  },
  SET_STEP: (state, step) => {
    state.step = step;
    setLocalStore("step", step);
  },
  SET_LOADING: (state, loading) => {
    state.loading = loading;
    setLocalStore("loading", loading);
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { name, pwd } = userInfo;
    return new Promise((resolve, reject) => {
      login({ name: name.trim(), pwd: pwd })
        .then((response) => {
          const { result } = response;
          commit("SET_NAME", "admin");
          setUserName("admin");
          commit("SET_TOKEN", "token");
          setToken("token");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
