import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { Point, Stroke, Blackboard } from '../index';

export interface State {
    blackboard: Blackboard;
    currentStrokes: Stroke[];
    undoStrokes: Stroke[];
}

const initState: State = {
    blackboard: {processId: '', strokes: []},
    currentStrokes: [],
    undoStrokes: [],
};

// getters
const getters = {
    blackboard: (state: State) => state.blackboard,
    currentStrokes: (state: State) => state.currentStrokes,
    undoStrokes: (state: State) => state.undoStrokes,
};

// actions
const actions = {
};

// mutations
const mutations = {
    [types.DRAW_STROKE](state: State, payload: Stroke) {
        state.currentStrokes.push(payload);
        state.undoStrokes = [];
        console.log(state.currentStrokes);
    },
    [types.REDO_STROKE](state: State) {
        if (state.undoStrokes.length > 0) {
            let stroke: Stroke = state.undoStrokes.pop() as Stroke;
            state.currentStrokes.push(stroke);
        }
        // state.currentStrokes.pop();
        // state.undoStrokes = [];
    },
    [types.UNDO_STROKE](state: State) {
        if (state.currentStrokes.length > 0) {
            let stroke: Stroke = state.currentStrokes.pop() as Stroke;
            state.undoStrokes.push(stroke);
        }
        console.log(state.currentStrokes);
        console.log(state.undoStrokes);

    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
