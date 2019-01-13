import { Commit } from 'vuex';
import * as types from '../mutation-types';
import { Point, Stroke, Blackboard } from '../index';
import * as blackboardApi from '../../api/blackboard';

export interface State {
    blackboards: Blackboard[];
    blackboard: Blackboard;
    tarBlackboard: Blackboard;
    currentStrokes: Stroke[];
    undoStrokes: Stroke[];
    truncateStrokes: Stroke[];
    saveCurrentCanvasStatus: boolean;
}

const initState: State = {
    blackboards: [],
    blackboard: {id: '', strokes: [], thumbnail: '', createdAt: 0},
    tarBlackboard: {id: '', strokes: [], thumbnail: '', createdAt: 0},
    currentStrokes: [],
    undoStrokes: [],
    truncateStrokes: [],
    saveCurrentCanvasStatus: false,
};

// getters
const getters = {
    blackboards: (state: State) => state.blackboards,
    blackboard: (state: State) => state.blackboard,
    tarBlackboard: (state: State) => state.tarBlackboard,
    currentStrokes: (state: State) => state.currentStrokes,
    undoStrokes: (state: State) => state.undoStrokes,
    truncateStrokes: (state: State) => state.truncateStrokes,
    saveCurrentCanvasStatus: (state: State) => state.saveCurrentCanvasStatus,
};

// actions
const actions = {
    createBlackboardAction(context: { commit: Commit; state: State }, payload: { user: string, onSuccess: Function, onError: Function }) {
        blackboardApi.createBlackboard(
            (response: any) => {
                if (response.status === 1) {
                    const data = response.data;
                    let newBlackboard: Blackboard = {
                        id: data.id,
                        thumbnail: '',
                        strokes: [],
                        createdAt: data.createdAt,
                    };
                    context.state.blackboards.splice(0, 0, newBlackboard);
                    context.state.blackboard = newBlackboard;
                    if (context.state.blackboards.length > 1) {
                        context.commit(types.CLEAR_CANVAS);
                    }
                    payload.onSuccess();
                } else {
                    payload.onError(response.msg)
                }
        }, {
                user: payload.user,
            });
    },
    findBlackboardByUserAction(context: { commit: Commit; state: State }, payload: { user: string, onError: Function }) {
        blackboardApi.findBlackboardByUser(
            (response: any) => {
                if (response.status === 1) {
                    context.state.blackboards = response.data;
                    if (response.data.length > 0) {
                        context.state.blackboard = response.data[0];
                    }
                } else {
                    payload.onError(response.msg)
                }
            }, {
                user: payload.user,
            });
    },
    saveBlackboardAction(context: { commit: Commit; state: State }, payload: { user: string, canvas: string, onError: Function }) {
        context.state.blackboard.strokes = [];
        for (const stroke of context.state.currentStrokes) {
            context.state.blackboard.strokes.push(stroke);
        }
        context.state.blackboard.thumbnail = payload.canvas;
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
    },
    removeBlackboardAction(context: { commit: Commit; state: State }, payload: { user: string, blackboardID: string, onSuccess:Function, onError: Function }) {
        // context.state.blackboards.splice();
        blackboardApi.removeBlackboard(
            (response: any) => {
                if (response.status === 1) {
                    for (let i = 0; i < context.state.blackboards.length; i++) {
                        const blackboard = context.state.blackboards[i];
                        if (blackboard.id === payload.blackboardID) {
                            context.state.blackboards.splice(i, 1);
                            if (payload.blackboardID === context.state.blackboard.id) {
                                if (i === context.state.blackboards.length) {
                                    if (context.state.blackboards.length === 0) {
                                        context.state.blackboard = {id: '', strokes: [], thumbnail: '', createdAt: 0};
                                    } else {
                                        context.state.blackboard = context.state.blackboards[i - 1];
                                    }
                                } else {
                                    context.state.blackboard = context.state.blackboards[i];
                                }
                                context.state.currentStrokes = context.state.blackboard.strokes;
                                context.state.undoStrokes = [];
                                context.state.truncateStrokes = [];
                            }
                            break;
                        }
                    }
                    payload.onSuccess();
                } else {
                    payload.onError(response.msg)
                }
            }, {
                user: payload.user,
                id: payload.blackboardID
            });
    }
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
    [types.CLEAR_CANVAS](state: State) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.CHANGE_CANVAS](state: State, blackboard:Blackboard) {
        state.blackboard = blackboard;
        state.currentStrokes = [];
        for (const stroke of blackboard.strokes) {
            state.currentStrokes.push(stroke);
        }
        state.undoStrokes = [];
        state.truncateStrokes = [];
    },
    [types.SET_SAVE_CURRENT_CANVAS](state: State, payload: {status: boolean, tarBlackboard: Blackboard}) {
        state.saveCurrentCanvasStatus = payload.status;
        if (payload.status) {
            state.tarBlackboard = payload.tarBlackboard;
        }
    },
    [types.CLEAR_BLACKBOARDS](state: State) {
        state.currentStrokes = [];
        state.undoStrokes = [];
        state.truncateStrokes = [];
        state.blackboards = [];
        state.blackboard = {id: '', strokes: [], thumbnail: '', createdAt: 0};
    },
    [types.SET_STROKES](state: State, strokes: Stroke[]) {
        state.currentStrokes = strokes;
    },
};

export default {
    state: initState,
    getters,
    actions,
    mutations,
};
