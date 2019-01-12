import * as userApi from '../../api/user';
const initState = {
    logUser: { id: '', username: '' },
    logStatus: false,
};
// getters
const getters = {
    logUser: (state) => state.logUser,
    logStatus: (state) => state.logStatus,
};
// actions
const actions = {
    logInAction(context, payload) {
        userApi.userLogin((response) => {
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
                payload.onSuccess();
            }
            else {
                payload.onError(response.msg);
            }
        }, payload.user);
    },
    registerAction(context, payload) {
        userApi.userRegister((response) => {
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
                payload.onSuccess();
            }
            else {
                payload.onError(response.msg);
            }
        }, payload.user);
    },
    logOutAction(context, callback) {
        context.state.logStatus = false;
        callback(context.state.logUser.username);
        context.state.logUser = { id: '', username: '' };
        sessionStorage.removeItem('id');
    },
    autoLoginAction(context, id) {
        userApi.findUserByID((response) => {
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
        });
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
//# sourceMappingURL=user.js.map