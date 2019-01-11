import * as types from '../mutation-types';
const initState = {
    color: '#759FD2',
    thick: 5,
    tool: 'pen',
    clear: false,
};
// getters
const getters = {
    thick: (state) => state.thick,
    color: (state) => state.color,
    tool: (state) => state.tool,
    clear: (state) => state.clear,
};
// actions
const actions = {};
// mutations
const mutations = {
    [types.SET_COLOR](state, payload) {
        state.color = payload;
    },
    [types.SET_THICKNESS](state, payload) {
        state.thick = payload;
    },
    [types.SET_TOOL](state, payload) {
        state.tool = payload;
    },
    [types.SET_CLEAR](state, payload) {
        state.clear = payload;
    },
};
export default {
    state: initState,
    getters,
    actions,
    mutations,
};
//# sourceMappingURL=canvas.js.map