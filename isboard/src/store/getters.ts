import { GetterTree, Getter } from 'vuex';
import { State } from './index';

const user: Getter<State, any> = (state: State) => {
    return state.user;
};

const getterTree: GetterTree<State, any> = {
    user,
};

export default getterTree;
