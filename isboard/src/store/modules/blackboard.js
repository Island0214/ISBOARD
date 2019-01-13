import * as types from '../mutation-types';
const initState = {
    blackboards: [],
    blackboard: { id: '', thumbnail: '', strokes: [] },
    currentStrokes: [],
    undoStrokes: [],
    truncateStrokes: [],
};
// getters
const getters = {
    blackboards: (state) => state.blackboards,
    blackboard: (state) => state.blackboard,
    currentStrokes: (state) => state.currentStrokes,
    undoStrokes: (state) => state.undoStrokes,
    truncateStrokes: (state) => state.truncateStrokes,
};
// actions
const actions = {};
// mutations
const mutations = {
    [types.DRAW_STROKE](state, payload) {
        state.currentStrokes.push(payload);
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.REDO_STROKE](state) {
        if (state.undoStrokes.length > 0) {
            const stroke = state.undoStrokes.pop();
            state.currentStrokes.push(stroke);
        }
    },
    [types.UNDO_STROKE](state) {
        if (state.truncateStrokes.length !== 0) {
            state.currentStrokes = state.truncateStrokes;
            state.truncateStrokes = [];
            return;
        }
        if (state.currentStrokes.length > 0) {
            const stroke = state.currentStrokes.pop();
            state.undoStrokes.push(stroke);
        }
    },
    [types.TRUNCATE](state) {
        state.truncateStrokes = state.currentStrokes;
        state.currentStrokes = [];
        state.undoStrokes = [];
    },
    [types.SAVE_CANVAS](state, canavs) {
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
    [types.CLEAR_CANVAS](state) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CLEAR_CANVAS](state) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CLEAR_BLACKBOARDS](state) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
        state.blackboards = [];
        state.blackboard = { id: '', thumbnail: '', strokes: [] };
    },
};
export default {
    state: initState,
    getters,
    actions,
    mutations,
};
//# sourceMappingURL=blackboard.js.map