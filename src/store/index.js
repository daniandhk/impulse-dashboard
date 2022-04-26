import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import modules from '@/state/modules'

const state = {
	displayLoader: false,
	loggedUser: localStorage.getItem('loggedUser') || null,
	roleUser: localStorage.getItem('roleUser') || null,
	appLanguage: localStorage.getItem("appLanguage") || process.env.VUE_APP_I18N_LOCALE || 'id'
}

export default new Vuex.Store({
	state,
	actions,
	getters,
	mutations,
	modules
})