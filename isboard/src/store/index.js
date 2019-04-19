import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user from './modules/user';
import canvas from './modules/canvas';
import animation from './modules/animation';
import folding from './modules/folding';
import feature from './modules/feature';
import * as features from '../base/features';
import * as featureTypes from '../base/feature-types';
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
export class Point {
    constructor(x, y) {
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
export class Animation {
    constructor(type, x, y, speed, count) {
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
export class Stroke {
    constructor(type, points, color, thickness, solid = false) {
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
export class Blackboard {
    constructor() {
        this.id = '';
        this.thumbnail = '';
        this.strokes = [];
        this.createdAt = 0;
    }
}
export class Node {
    constructor(name, point) {
        this.name = name;
        this.point = point;
    }
}
export class FoldingRectangle {
    constructor(type, width, height, points) {
        this.type = type;
        this.width = width;
        this.height = height;
        this.points = points;
        this.nodes = [];
    }
}
export class FoldingFeature {
    constructor(foldingType, feature, condition, type, param1, param2, param3 = '') {
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
            return '2' + type + this.param1 + ' + 2' + type + this.param2 + ' + ' + type + this.param3 + ' = ' + 2 * this.result + '°';
        case features.TWO_ANGLE_MINUS:
            return '2' + type + this.param1 + ' + 2' + type + this.param2 + ' - ' + type + this.param3 + ' = ' + 2 * this.result + '°';
    }
    return '';
};
export class Border {
    constructor(node1, node2) {
        this.name = node1.name + node2.name;
        const x = Math.abs(node1.point.x - node2.point.x);
        const y = Math.abs(node1.point.y - node2.point.y);
        this.length = Math.pow(x * x + y * y, 0.5);
        this.lengthModel = Math.pow(x * x + y * y, 0.5);
    }
}
//# sourceMappingURL=index.js.map