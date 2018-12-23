import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { UserLoginPayload } from '../index';

export interface State {
    color: string;
    thick: number;
    tool: string;
    clear: boolean;
}

const initState: State = {
    color: '#759FD2',
    thick: 5,
    tool: 'pen',
    clear: false,
};

// getters
const getters = {
    thick: (state: State) => state.thick,
    color: (state: State) => state.color,
    tool: (state: State) => state.tool,
    clear: (state: State) => state.clear,
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
