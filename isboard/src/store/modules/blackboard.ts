import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { Point, Stroke, Blackboard } from '../index';

export interface State {
    blackboards: Blackboard[];
    blackboard: Blackboard;
    currentStrokes: Stroke[];
    undoStrokes: Stroke[];
    truncateStrokes: Stroke[];
}

const initState: State = {
    blackboards: [],
    blackboard: {id: '', thumbnail: '', strokes: []},
    currentStrokes: [],
    undoStrokes: [],
    truncateStrokes: [],
};

// getters
const getters = {
    blackboards: (state: State) => state.blackboards,
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
            const stroke: Stroke = state.undoStrokes.pop() as Stroke;
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
            const stroke: Stroke = state.currentStrokes.pop() as Stroke;
            state.undoStrokes.push(stroke);
        }
    },
    [types.TRUNCATE](state: State) {
        state.truncateStrokes = state.currentStrokes;
        state.currentStrokes = [];
        state.undoStrokes = [];
    },
    [types.SAVE_CANVAS](state: State, canavs: string) {
        state.blackboard.strokes = [];
        for (const stroke of state.currentStrokes) {
            state.blackboard.strokes.push(stroke);
        }
        state.blackboard.thumbnail = canavs;
        for (const blackboard of state.blackboards) {
            if (blackboard.id === state.blackboard.id) {
                blackboard.strokes = [];
                for (const stroke of blackboard.strokes) {
                    blackboard.strokes.push(stroke);
                }
                blackboard.thumbnail = canavs;
            }
        }
    },
    [types.CLEAR_CANVAS](state: State) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CLEAR_CANVAS](state: State) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CLEAR_BLACKBOARDS](state: State) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
        state.blackboards = [];
        state.blackboard = {id: '', thumbnail: '', strokes: []};
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
