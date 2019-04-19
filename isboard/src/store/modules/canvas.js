import * as types from '../mutation-types';
const initState = {
    color: '#666666',
    thick: 5,
    tool: 'pen',
    clear: false,
    canvasWidth: 800,
    canvasHeight: 600,
};
// getters
const getters = {
    thick: (state) => state.thick,
    color: (state) => state.color,
    tool: (state) => state.tool,
    clear: (state) => state.clear,
    canvasWidth: (state) => state.canvasWidth,
    canvasHeight: (state) => state.canvasHeight,
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