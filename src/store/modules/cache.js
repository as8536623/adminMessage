const cache = {
    state: {
        cachedViews: []
    },
    mutations: {
        SET_CACHE_VIEW: (state, view) => {
            if (Array.isArray(view)) {
                state.cachedViews = view;
            } else {
                state.cachedViews = [...state.cachedViews, view];
            }
        },
        CLEAR_CACHE_VIEW: (state) => {
            state.cachedViews = [];
        }
    },
    actions: {
        setCacheView({commit}, view) {
            commit('SET_CACHE_VIEW', view);
        },
        clearCacheView({commit}) {
            commit('CLEAR_CACHE_VIEW');
        }
    }
};

export default cache;
