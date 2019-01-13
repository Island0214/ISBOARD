import * as types from '../mutation-types';
import * as blackboardApi from '../../api/blackboard';
const initState = {
    blackboards: [],
    blackboard: { id: '', strokes: [], thumbnail: '', createdAt: 0 },
    tarBlackboard: { id: '', strokes: [], thumbnail: '', createdAt: 0 },
    currentStrokes: [],
    undoStrokes: [],
    truncateStrokes: [],
    saveCurrentCanvasStatus: false,
};
// getters
const getters = {
    blackboards: (state) => state.blackboards,
    blackboard: (state) => state.blackboard,
    tarBlackboard: (state) => state.tarBlackboard,
    currentStrokes: (state) => state.currentStrokes,
    undoStrokes: (state) => state.undoStrokes,
    truncateStrokes: (state) => state.truncateStrokes,
    saveCurrentCanvasStatus: (state) => state.saveCurrentCanvasStatus,
};
// actions
const actions = {
    createBlackboardAction(context, payload) {
        blackboardApi.createBlackboard((response) => {
            if (response.status === 1) {
                const data = response.data;
                let newBlackboard = {
                    id: data.id,
                    thumbnail: '',
                    strokes: [],
                    createdAt: data.createdAt,
                };
                context.state.blackboards.splice(0, 0, newBlackboard);
                context.state.blackboard = newBlackboard;
                context.commit(types.CLEAR_CANVAS);
                payload.onSuccess();
            }
            else {
                payload.onError(response.msg);
            }
        }, {
            user: payload.user,
        });
    },
    findBlackboardByUserAction(context, payload) {
        blackboardApi.findBlackboardByUser((response) => {
            if (response.status === 1) {
                context.state.blackboards = response.data;
                if (response.data.length > 0) {
                    context.state.blackboard = response.data[0];
                }
            }
            else {
                payload.onError(response.msg);
            }
        }, {
            user: payload.user,
        });
    },
    saveBlackboardAction(context, payload) {
        context.state.blackboard.strokes = [];
        for (const stroke of context.state.currentStrokes) {
            context.state.blackboard.strokes.push(stroke);
        }
        context.state.blackboard.thumbnail = payload.canvas;
        console.log(context.state.blackboards);
        // blackboardApi.findBlackboardByUser(
        //     (response: any) => {
        //         if (response.status === 1) {
        //             context.state.blackboards = response.data;
        //             if (response.data.length > 0) {
        //                 context.state.blackboard = response.data[0];
        //             }
        //         } else {
        //             payload.onError(response.msg)
        //         }
        //     }, {
        //         user: payload.user,
        //     });
    }
};
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
    [types.CLEAR_CANVAS](state) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CHANGE_CANVAS](state, blackboard) {
        state.blackboard = blackboard;
        state.currentStrokes = [];
        for (const stroke of blackboard.strokes) {
            state.currentStrokes.push(stroke);
        }
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.SET_SAVE_CURRENT_CANVAS](state, payload) {
        console.log(payload);
        state.saveCurrentCanvasStatus = payload.status;
        if (payload.status) {
            state.tarBlackboard = payload.tarBlackboard;
        }
    },
    [types.CLEAR_BLACKBOARDS](state) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
        state.blackboards = [];
        state.blackboard = { id: '', strokes: [], thumbnail: '', createdAt: 0 };
    },
    [types.SET_STROKES](state, strokes) {
        state.currentStrokes = strokes;
    },
};
export default {
    state: initState,
    getters,
    actions,
    mutations,
};
//# sourceMappingURL=blackboard.js.map