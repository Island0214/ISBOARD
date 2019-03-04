import {Commit} from 'vuex';
import * as types from '../mutation-types';
// import {UserLoginPayload, User} from '../index';
// import * as userApi from '../../api/user';
import * as animations from '../../base/animation-type'
import {Stroke} from "@/store";

export interface State {
    tempAnimationType: string;
}

const initState: State = {
    tempAnimationType: animations.NULL,
};

// getters
const getters = {
    tempAnimationType: (state: State) => state.tempAnimationType,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.SET_TEMP_ANIMATION](state: State, type: string) {
        state.tempAnimationType = type;
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
