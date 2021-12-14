import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		topListIds: [],
		nextId: '',
		preId: '',
		cookie: '',
		uid: ''
	},
	mutations: {
		INIT_TOPLISTIDS(state, payload) {
			state.topListIds = payload
		},
		SETUID(state, payload) {
			state.uid = payload
		},
		NEXT_ID(state, payload) {
			for (var i = 0; i < state.topListIds.length; i++) {
				if (state.topListIds[0].resourceType) {
					if (state.topListIds[state.topListIds.length - 1].resourceId == payload) {
						state.nextId = state.topListIds[0].resourceId
					} else if (state.topListIds[i].resourceId == payload) {
						state.nextId = state.topListIds[i + 1].resourceId
					}
				} else {
					if (state.topListIds[state.topListIds.length - 1].id == payload) {
						state.nextId = state.topListIds[0].id
					} else if (state.topListIds[i].id == payload) {
						state.nextId = state.topListIds[i + 1].id
					}
				}


			}
		},

		PRE_ID(state, payload) {
			for (var i = 0; i < state.topListIds.length; i++) {
				if (state.topListIds[0].resourceType) {
					if (state.topListIds[0].resourceId == payload) {
						state.preId = state.topListIds[0].resourceId
					} else if (state.topListIds[i].resourceId == payload) {
						state.preId = state.topListIds[i - 1].resourceId
					}
				} else {
					if (state.topListIds[0].id == payload) {
						state.preId = state.topListIds[0].id
					} else if (state.topListIds[i].id == payload) {
						state.preId = state.topListIds[i - 1].id
					}
				}
			}
		}
	}
})
