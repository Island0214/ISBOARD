import Vue from 'vue';
import Vuex, { Commit, Dispatch } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user, { State as UserState } from './modules/user';
import canvas, { State as CanvasState } from './modules/canvas';
import blackboard, { State as BlackboardState } from './modules/blackboard';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    mutations,
    modules: {
        user,
        canvas,
        blackboard,
    },
});

export interface ActionContextBasic {
    commit: Commit;
    dispatch: Dispatch;
}

export interface State {
    user: UserState;
    canvas: CanvasState;
    blackboard: BlackboardState;
}

export interface UserLoginPayload {
    username: string;
    password: string;
    remember: boolean;
}

export interface User {
    id: string;
    username: string;
}

export interface Point {
    x: number;
    y: number;
}

export class Point implements Point {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

Point.prototype.toString = function () {
    return '{' +
        'x: ' + this.x + '; ' +
        'y: ' + this.y + '; ' +
        '}';
};

export interface Stroke {
    type: string;
    points: Point[];
    solid: boolean;
    color: string;
    thickness: number;
}

export class Stroke implements Stroke {
    constructor(type: string, points: Point[], color: string, thickness: number, solid: boolean = false) {
        this.type = type;
        this.points = points;
        this.color = color;
        this.thickness = thickness;
        this.solid = solid;
    }
}

Stroke.prototype.toString = function() {
    return '{' +
        'type: ' + this.type + '; ' +
        'points: ' + this.points.toString() + '; ' +
        'solid: ' + this.solid + '; ' +
        'color: ' + this.color + '; ' +
        'thickness: ' + this.thickness + '; ' +
        '}';
};

export interface Blackboard {
    id: string;
    thumbnail: string;
    strokes: Stroke[];
}
