import { Commit } from 'vuex';
import * as types from '../mutation-types';

interface User {
    username: string;
    password: string;
}

export interface State {
    user: User;
}

const initState: State = {
    user: {username: '', password: ''},
};

// getters
const getters = {
};

// actions
const actions = {
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
