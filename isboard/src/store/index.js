import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import user from './modules/user';
import canvas from './modules/canvas';
import blackboard from './modules/blackboard';
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
//# sourceMappingURL=index.js.map