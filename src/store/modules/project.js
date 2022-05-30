const project = {
    state: {
        selectedIds: []
    },
    mutations: {
        SET_SELECTED_IDS: (state, ids) => {
            state.selectedIds = ids;
        }
    },
    actions: {
        setSelectIds({commit}, ids) {
            commit('SET_SELECTED_IDS', ids);
        }
    }
};

export default project;
