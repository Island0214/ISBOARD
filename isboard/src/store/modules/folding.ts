import {Commit} from 'vuex';
import * as types from '../mutation-types';
// import {UserLoginPayload, User} from '../index';
// import * as userApi from '../../api/user';
import * as rectTypes from '../../base/rectangle-folding'
import * as questions from '../../base/question-type'
import {FoldingRectangle, Point, Node} from "../index";

export interface State {
    selectedFoldingType: string;
    selectedQuestionType: string;
    foldingRectangles: FoldingRectangle[];
    selectedFoldingRectangle: FoldingRectangle;
}

const initState: State = {
    selectedFoldingType: '',
    selectedQuestionType: '',
    foldingRectangles: [{
        type: rectTypes.TYPE_A, thumbnail: '', height: 300, width: 400, points: [{x: 350, y: 150}], nodes: []
    }, {
        type: rectTypes.TYPE_B, thumbnail: '', height: 300, width: 400, points: [{x: 350, y: 150}], nodes: []
    }, {
        type: rectTypes.TYPE_C, thumbnail: '', height: 300, width: 400, points: [], nodes: []
    }, {
        type: rectTypes.TYPE_D, thumbnail: '', height: 300, width: 400, points: [{x: 500, y: 150}], nodes: []
    }, {
        type: rectTypes.TYPE_E, thumbnail: '', height: 300, width: 400, points: [], nodes: []
    },],
    selectedFoldingRectangle: {type: '', thumbnail: '', height: 0, width: 0, points: [], nodes: []},
};

// getters
const getters = {
    selectedFoldingType: (state: State) => state.selectedFoldingType,
    selectedQuestionType: (state: State) => state.selectedQuestionType,
    foldingRectangles: (state: State) => state.foldingRectangles,
    selectedFoldingRectangle: (state: State) => state.selectedFoldingRectangle,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.SET_FOLDING_TYPE](state: State, type: string) {
        state.selectedFoldingType = type;
        for (let i = 0; i < state.foldingRectangles.length; i++) {
            if (state.foldingRectangles[i].type === type) {
                state.selectedFoldingRectangle = state.foldingRectangles[i];
                break;
            }
        }
    },
    [types.SET_QUESTION_TYPE](state: State, type: string) {
        state.selectedQuestionType = type;
        if (type === questions.FOLDING) {
            state.selectedFoldingType = rectTypes.TYPE_A;
            for (let i = 0; i < state.foldingRectangles.length; i++) {
                if (state.foldingRectangles[i].type === rectTypes.TYPE_A) {
                    state.selectedFoldingRectangle = state.foldingRectangles[i];
                    break;
                }
            }
        } else if (type === questions.UNFOLDING) {
            // todo
        }
    },
    [types.SET_FOLDING_RECT_THUMBNAILS](state: State, thumbnails: string[]) {
        for (let i = 0; i < state.foldingRectangles.length; i++) {
            state.foldingRectangles[i].thumbnail = thumbnails[i];
        }
    },
    [types.SET_NODES](state: State, nodes: Node[]) {
        state.selectedFoldingRectangle.nodes = nodes;
    },
    [types.UPDATE_SELECTED_FOLDING](state: State, param: {points: Point[], type: string}) {
        for (let i = 0; i < state.foldingRectangles.length; i++) {
            if (state.foldingRectangles[i].type === param.type) {
                state.foldingRectangles[i].points = [];
                for (let j = 0; j < param.points.length; j++) {
                    state.foldingRectangles[i].points.push(new Point(param.points[j].x, param.points[j].y));
                }
                break;
            }
            if (state.selectedFoldingRectangle.type === param.type) {
                state.selectedFoldingRectangle.points = [];
                for (let j = 0; j < param.points.length; j++) {
                    state.selectedFoldingRectangle.points.push(new Point(param.points[j].x, param.points[j].y));
                }
            }
        }
    },
    [types.UPDATE_RECTANGLE_SIZE](state: State, size: Point) {
        state.selectedFoldingRectangle.width = size.x;
        state.selectedFoldingRectangle.height = size.y;
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
