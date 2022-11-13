import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      currentUser: {},
      buttonPermList: [],
      pagePermList: []
    };
  },
  mutations: {
    setCurrentUser(state,currentUser) {
      state.currentUser = currentUser;
    },
    setButtonPermList(state,buttonPermList) {
      state.buttonPermList = buttonPermList;
    },
    setPagePermList(state,pagePermList) {
      state.pagePermList = pagePermList;
    },
  },
});

export default store;
