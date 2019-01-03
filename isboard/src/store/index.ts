import Vue from 'vue';
import Vuex, { Commit, Dispatch } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user, { State as UserState } from './modules/user';
import canvas, { State as CanvasState } from './modules/canvas';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    mutations,
    modules: {
        user,
        canvas,
    },
});

export interface ActionContextBasic {
    commit: Commit;
    dispatch: Dispatch;
}

export interface State {
    user: UserState;
    canvas: CanvasState;
}

export interface UserLoginPayload {
    username: string;
    password: string;
    remember: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface Stroke {
    type: string;
    points: Point[];
}

export interface Blackboard {
    processId: string;
    strokes: Stroke[];
}
