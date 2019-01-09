import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { Point, Stroke, Blackboard } from '../index';

export interface State {
    blackboard: Blackboard;
    currentStrokes: Stroke[];
    undoStrokes: Stroke[];
    truncateStrokes: Stroke[];
}

const initState: State = {
    blackboard: {processId: '', strokes: []},
    currentStrokes: [],
    undoStrokes: [],
    truncateStrokes: [],
};

// getters
const getters = {
    blackboard: (state: State) => state.blackboard,
    currentStrokes: (state: State) => state.currentStrokes,
    undoStrokes: (state: State) => state.undoStrokes,
    truncateStrokes: (state: State) => state.truncateStrokes,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.DRAW_STROKE](state: State, payload: Stroke) {
        state.currentStrokes.push(payload);
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.REDO_STROKE](state: State) {
        if (state.undoStrokes.length > 0) {
            let stroke: Stroke = state.undoStrokes.pop() as Stroke;
            state.currentStrokes.push(stroke);
        }
    },
    [types.UNDO_STROKE](state: State) {
        if (state.truncateStrokes.length !== 0) {
            state.currentStrokes = state.truncateStrokes;
            state.truncateStrokes = [];
            return;
        }
        if (state.currentStrokes.length > 0) {
            let stroke: Stroke = state.currentStrokes.pop() as Stroke;
            state.undoStrokes.push(stroke);
        }
    },
    [types.TRUNCATE](state: State) {
        state.truncateStrokes = state.currentStrokes;
        state.currentStrokes = [];
        state.undoStrokes = [];
    }
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
