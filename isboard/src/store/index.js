import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user from './modules/user';
import canvas from './modules/canvas';
import blackboard from './modules/blackboard';
import animation from './modules/animation';
Vue.use(Vuex);
export default new Vuex.Store({
    actions,
    getters,
    mutations,
    modules: {
        user,
        canvas,
        blackboard,
        animation,
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
    constructor(type, x, y, count) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.count = count;
    }
}
Animation.prototype.toString = function () {
    return '{' +
        'type: ' + this.type + '; ' +
        'x: ' + this.x + '; ' +
        'y: ' + this.y + '; ' +
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
//# sourceMappingURL=index.js.map