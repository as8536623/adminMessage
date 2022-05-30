const temporary = {
    state: {
        temporaryId: ''
    },
    mutations: {
        SET_TEMPORARY_ID: (state, temporaryId) => {
            state.temporaryId = temporaryId;
        }
    },
    actions: {
        setTemporaryId({commit}, temporaryId) {
            commit('SET_TEMPORARY_ID', temporaryId);
        }
    }
};

export default temporary;
