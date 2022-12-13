import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		topListIds: [],
		nextId: '',
		preId: '',
		cookie: '',
		uid: '',
		//悬浮球背景图片，专辑图片
		musicPic: '',
		//悬浮球显示，默认不显示，播放音乐时显示
		fabDisplay: 'none',
		//播放音乐的对象
		music: '',
		//当前播放音乐的ID
		songId: '',
		//使用绑定key的方式重新渲染组件
		fabKey: 0,
		//上一首
		preMusic: '',
		//下一首
		nextMusic: '',
		//上一首是否返回歌曲URL为空
		preDeathMusic: false,
		nextDeathMusic: false,
		//歌曲是否加入最爱
		isLiked: false,
		doLike: ''
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
		},
		
		
		SETMUSICPIC(state, payload){
			state.musicPic = payload
		},
		
		SETFABDISPLAY(state, payload){
			if(payload == true){
				state.fabDisplay = "inline"
			}
		},
		
		SETMUSIC(state, payload){
			state.music = payload
		},
		
		SETSONGID(state, payload){
			state.songId = payload
		},
		
		SETFABKEY(state){
			state.fabKey = state.fabKey + 1
		},
		
		SETPREMUSIC(state, payload){
			state.preMusic = payload
		},
		
		SETNEXTMUSIC(state, payload){
			state.nextMusic = payload
		},
		
		SETPREDEATHMUSIC(state, paload){
			state.preDeathMusic = paload
		},
		
		SETNEXTDEATHMUSIC(state, paload){
			state.nextDeathMusic = paload
		},
		
		SETISLIKED(state, payload){
			state.isLiked = payload
		},
		
		SETDOLIKE(state, payload){
			state.doLike = payload
		}
	}
})
