import {Commit} from 'vuex';
import * as types from '../mutation-types';
import {UserLoginPayload, User} from '../index';
import * as userApi from '../../api/user';

export interface State {
    logUser: User;
    logStatus: boolean;
}

const initState: State = {
    logUser: {id: '', username: ''},
    logStatus: false,
};

// getters
const getters = {
    logUser: (state: State) => state.logUser,
    logStatus: (state: State) => state.logStatus,
};

// actions
const actions = {
    logInAction(context: { commit: Commit; state: State }, payload: { user: UserLoginPayload, onSuccess: Function, onError: Function }) {
        userApi.userLogin(
            (response: any) => {
                if (response.status === 1) {
                    const data = response.data;
                    context.state.logUser = {
                        id: data.id,
                        username: data.name,
                    };
                    if (payload.user.remember) {
                        sessionStorage.id = data.id;
                    }
                    context.state.logStatus = true;
                    payload.onSuccess()
                } else {
                    payload.onError(response.msg)
                }
            },
            payload.user
        )
    },
    registerAction(context: { commit: Commit; state: State }, payload: { user: UserLoginPayload, onSuccess: Function, onError: Function }) {
        userApi.userRegister(
            (response: any) => {
                if (response.status === 1) {
                    const data = response.data;
                    context.state.logUser = {
                        id: data.id,
                        username: data.name,
                    };
                    if (payload.user.remember) {
                        sessionStorage.id = data.id;
                    }
                    context.state.logStatus = true;
                    payload.onSuccess()
                } else {
                    payload.onError(response.msg)
                }
            },
            payload.user
        )
    },
    logOutAction(context: { commit: Commit; state: State }, callback: Function) {
        context.state.logStatus = false;
        callback(context.state.logUser.username);
        context.state.logUser = {id: '', username: ''};
        sessionStorage.removeItem('id');
    },
    autoLoginAction(context: { commit: Commit; state: State }, id: string) {
        userApi.findUserByID(
            (response: any) => {
                if (response.status === 1) {
                    const data = response.data;
                    context.state.logUser = {
                        id: data.id,
                        username: data.name,
                    };
                    context.state.logStatus = true;
                }
            }, {
                id: id
            }
        )
    }
};

// mutations
const mutations = {};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
