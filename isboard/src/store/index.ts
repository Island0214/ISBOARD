import Vue from 'vue';
import Vuex, {Commit, Dispatch} from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user, {State as UserState} from './modules/user';
import canvas, {State as CanvasState} from './modules/canvas';
import blackboard, {State as BlackboardState} from './modules/blackboard';
import animation, {State as AnimationState} from './modules/animation';
import folding, {State as FoldingState} from './modules/folding';
import feature, {State as FeatureState} from './modules/feature';
import * as features from '../base/features'
import * as featureTypes from '../base/feature-types'
import * as featureConditions from '../base/feature-conditions'

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
        feature,
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
    feature: FeatureState;
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

Stroke.prototype.toString = function () {
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
    constructor(type: string, width: number, height: number, points: Point[]) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.points = points;
        this.nodes = [];
    }
}


export interface FoldingFeature {
    foldingType: string;
    feature: string;
    condition: string;
    type: string;
    param1: string;
    param2: string;
    param3: string;
    result: number;
}

export class FoldingFeature implements FoldingFeature {
    constructor(foldingType:string, feature: string, condition: string, type: string, param1: string, param2: string, param3: string = '') {
        this.foldingType = foldingType;
        this.feature = feature;
        this.condition = condition;
        this.type = type;
        this.param1 = param1;
        this.param2 = param2;
        this.param3 = param3;
        this.result = 90;
    }
}

FoldingFeature.prototype.toString = function () {
    let type;
    switch (this.type) {
        case featureTypes.ANGLE:
            type = '∠';
            break;
        case featureTypes.TRIANGLE:
            type = '△';
            break;
        case featureTypes.ECHELON:
            type = '梯形';
            break;
    }
    switch (this.feature) {
        case features.ANGLE_EQUALITY:
            return '∠' + this.param1 + ' = ∠' + this.param2;
        case features.BORDER_EQUALITY:
            return this.param1 + ' = ' + this.param2;
        case features.ANGLE_PLUS:
            return '∠' + this.param1 + ' + ∠' + this.param2 + ' = ' + this.result + '°';
        case features.ANGLE_MINUS:
            return '∠' + this.param1 + ' - ∠' + this.param2 + ' = ' + this.result + '°';
        case features.CONGRUENCE:
            return type + this.param1 + ' ≌ ' + type + this.param2;
        case features.SIMILARITY:
            return type + this.param1 + ' ∽ ' + type + this.param2;
        case features.TWO_ANGLE_PLUS:
            return '2' + type + this.param1 + ' + 2' + type + this.param2 + ' + ' + type + this.param3 + ' = ' +  2 * this.result + '°';
        case features.TWO_ANGLE_MINUS:
            return '2' + type + this.param1 + ' + 2' + type + this.param2 + ' - ' + type + this.param3 + ' = ' +  2 * this.result + '°';
    }
    return '';
};

export interface Border {
    name: string;
    length: number;
    lengthModel: number;
}

export class Border implements Border {
    name: string;
    length: number;
    lengthModel: number;

    constructor(node1: Node, node2: Node) {
        this.name = node1.name + node2.name;
        const x = Math.abs(node1.point.x - node2.point.x);
        const y = Math.abs(node1.point.y - node2.point.y);
        this.length = Math.pow(x * x + y * y, 0.5);
        this.lengthModel = Math.pow(x * x + y * y, 0.5);
    }
}