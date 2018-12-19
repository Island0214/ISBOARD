import Vue from 'vue';
import Vuex, { Commit, Dispatch } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user, { State as UserState } from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    mutations,
    modules: {
        user,
    },
});

export interface ActionContextBasic {
    commit: Commit;
    dispatch: Dispatch;
}

export interface State {
    user: UserState;
}

export interface UserLoginPayload {
    username: string;
    password: string;
    remember: boolean;
}
