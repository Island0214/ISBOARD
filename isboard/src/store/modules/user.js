const initState = {
    logUser: '',
};
// getters
const getters = {
    logUser: (state) => state.logUser,
};
// actions
const actions = {
    logInAction(context, user) {
        console.log(user);
    },
};
// mutations
const mutations = {};
export default {
    state: initState,
    getters,
    actions,
    mutations,
};
//# sourceMappingURL=user.js.map