const ajax = {
    state: {
        ajaxIng: false
    },
    mutations: {
        SET_AJAX_ING: (state, ajaxIng) => {
            state.ajaxIng = ajaxIng;
        }
    },
    actions: {
        setAjaxIng({commit}, ajaxIng) {
            commit('SET_AJAX_ING', ajaxIng);
        }
    }
};

export default ajax;
