import {Commit} from 'vuex';
import * as types from '../mutation-types';
import {FoldingFeature} from '../index';

export interface State {
    selectedFeature?: FoldingFeature;
}

const initState: State = {
    selectedFeature: undefined,
};

// getters
const getters = {
    selectedFeature: (state: State) => state.selectedFeature,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.SET_FOLDING_FEATURE](state: State, foldingFeature: FoldingFeature) {
        state.selectedFeature = foldingFeature;
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
