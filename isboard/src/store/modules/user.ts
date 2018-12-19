import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { UserLoginPayload } from '../index';

export interface State {
    logUser: string;
}

const initState: State = {
    logUser: '',
};

// getters
const getters = {
    logUser: (state: State) => state.logUser,
};

// actions
const actions = {
    logInAction(context: { commit: Commit; state: State }, user: UserLoginPayload) {
        console.log(user);
    },
};

// mutations
const mutations = {
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
