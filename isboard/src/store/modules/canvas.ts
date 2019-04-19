import * as types from '../mutation-types';

export interface State {
    color: string;
    thick: number;
    tool: string;
    clear: boolean;
    canvasWidth: number;
    canvasHeight: number;
}

const initState: State = {
    color: '#666666',
    thick: 5,
    tool: 'pen',
    clear: false,
    canvasWidth: 800,
    canvasHeight: 600,
};

// getters
const getters = {
    thick: (state: State) => state.thick,
    color: (state: State) => state.color,
    tool: (state: State) => state.tool,
    clear: (state: State) => state.clear,
    canvasWidth: (state: State) => state.canvasWidth,
    canvasHeight: (state: State) => state.canvasHeight,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.SET_COLOR](state: State, payload: string) {
        state.color = payload;
    },
    [types.SET_THICKNESS](state: State, payload: number) {
        state.thick = payload;
    },
    [types.SET_TOOL](state: State, payload: string) {
        state.tool = payload;
    },
    [types.SET_CLEAR](state: State, payload: boolean) {
        state.clear = payload;
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
