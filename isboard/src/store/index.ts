import Vue from 'vue';
import Vuex, { Commit, Dispatch } from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user, { State as UserState } from './modules/user';
import canvas, { State as CanvasState } from './modules/canvas';
import blackboard, { State as BlackboardState } from './modules/blackboard';
import animation, { State as AnimationState } from './modules/animation';
import folding, { State as FoldingState } from './modules/folding';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    mutations,
    modules: {
        user,
        canvas,
        // blackboard,
        animation,
        folding,
    },
});

export interface ActionContextBasic {
    commit: Commit;
    dispatch: Dispatch;
}

export interface State {
    user: UserState;
    canvas: CanvasState;
    // blackboard: BlackboardState;
    animation: AnimationState;
    folding: FoldingState;
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

export interface Animation {
    type: string;
    x: number;
    y: number;
    speed: number;
    count: number;
}

export class Animation implements Animation {
    constructor(type: string, x: number, y: number, speed: number, count: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.count = count;
    }
}

Animation.prototype.toString = function () {
    return '{' +
        'type: ' + this.type + '; ' +
        'x: ' + this.x + '; ' +
        'y: ' + this.y + '; ' +
        'speed: ' + this.speed + '; ' +
        'count: ' + this.count + '; ' +
        '}';
};

export interface Stroke {
    type: string;
    points: Point[];
    solid: boolean;
    color: string;
    thickness: number;
    animation?: Animation;
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
    createdAt: number;
}

export class Blackboard implements Blackboard {
    constructor() {
        this.id = '';
        this.thumbnail = '';
        this.strokes = [];
        this.createdAt = 0;
    }
}

export interface Node {
    name: string;
    point: Point;
}

export class Node implements Node {
    constructor(name: string, point: Point) {
        this.name = name;
        this.point = point;
    }
}

export interface FoldingRectangle {
    type: string;
    thumbnail: string;
    width: number;
    height: number;
    points: Point[];
    nodes: Node[];
}

export class FoldingRectangle implements FoldingRectangle {
    constructor(type: string, width: number, height :number, points: Point[]) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.points = points;
        this.nodes = [];
    }
}

