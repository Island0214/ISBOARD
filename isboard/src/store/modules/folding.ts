import {Commit} from 'vuex';
import * as types from '../mutation-types';
// import {UserLoginPayload, User} from '../index';
// import * as userApi from '../../api/user';
import * as rectTypes from '../../base/rectangle-folding'
import * as questions from '../../base/question-type'
import {FoldingRectangle, Point} from "../index";

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
        type: rectTypes.TYPE_A, thumbnail: '', height: 300, width: 500, points: [{x: 350, y: 150}]
    }, {
        type: rectTypes.TYPE_B, thumbnail: '', height: 300, width: 500, points: [{x: 400, y: 150}]
    },{
        type: rectTypes.TYPE_C, thumbnail: '', height: 300, width: 500, points: [{x: 450, y: 150}]
    },],
    selectedFoldingRectangle: {type: '', thumbnail: '', height: 0, width: 0, points: []},
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
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
