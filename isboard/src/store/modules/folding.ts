import {Commit} from 'vuex';
import * as types from '../mutation-types';
// import {UserLoginPayload, User} from '../index';
// import * as userApi from '../../api/user';
import * as rectTypes from '../../base/rectangle-folding'
import * as questions from '../../base/question-type'

export interface State {
    selectedFoldingType: string;
    selectedQuestionType: string;
}

const initState: State = {
    selectedFoldingType: '',
    selectedQuestionType: '',
};

// getters
const getters = {
    selectedFoldingType: (state: State) => state.selectedFoldingType,
    selectedQuestionType: (state: State) => state.selectedQuestionType,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.SET_FOLDING_TYPE](state: State, type: string) {
        console.log(type)
        state.selectedFoldingType = type;
    },
    [types.SET_QUESTION_TYPE](state: State, type: string) {
        // console.log(type)
        state.selectedQuestionType = type;
        if (type === questions.FOLDING) {
            state.selectedFoldingType = rectTypes.TYPE_A;
        } else if (type === questions.UNFOLDING) {
            // todo
        }
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
