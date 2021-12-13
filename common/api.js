import {
	baseUrl
} from './config.js';
// import 'weapp-cookie'
let time = Date.now()
let cookie = ''

export function getCookie() {
	uni.getStorage({
		key: 'cookie',
		success: (res) => {
			cookie = res.data
		}
	})

}

export function topList() {
	let listIds = ['19723756', '3779629', '2884035', '3778678'];
	return new Promise(function(reslove, reject) {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list;
				result.length = 4;
				for (var i = 0; i < listIds.length; i++) {
					result[i].listId = listIds[i];
				}
				reslove(result);
			},
			fail: () => {},
			complete: () => {}
		});
	});
}

export function list(listId) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

export function pdLogin(phone, password) {
	return new Promise(function(reslove, reject) {
		uni.request({
			url: `${baseUrl}/login/cellphone?phone=${phone}&password=${password}&timestamp=${time}`,
			method: 'POST',
			withCredentials: true,
			success: res => {
				reslove(res);
				// // #ifdef MP-WEIXIN
				// if (res.data.code == '200') {
				// 	cookie = res.data.cookie
				// }
				// // #endif
			},
		});
	});
}

// 获取歌曲信息
export function songDetail(songId) {
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取相似歌曲
export function songSimi(songId) {
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取歌曲评论
export function songComment(songId) {
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取歌词
export function songLyric(songId) {
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取歌曲URL地址
export function songUrl(songId) {
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取热搜榜
export function searchHot() {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取搜索结果
export function searchKey(searchKey) {
	return uni.request({
		url: `${baseUrl}/search?keywords=${searchKey}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取搜索建议
export function searchSuggest(searchKey) {
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${searchKey}&type=mobile`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取首页banner type=1 是安卓
export function getBanner() {
	return uni.request({
		url: `${baseUrl}/banner?type=1`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取验证码
export function getSmsCode(phone) {
	return uni.request({
		url: `${baseUrl}/captcha/sent?phone=${phone}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 通过验证码登录
export function smsLogin(phone,smsCode) {
	return uni.request({
		url: `${baseUrl}/login/cellphone?phone=${phone}&captcha=${smsCode}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取账号详情
export function getUser() {
	getCookie()
	return uni.request({
		url: `${baseUrl}/user/account?timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取用户歌单
export function getUserPlayList(uid) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/user/playlist?uid=${uid}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取用户云盘信息
export function getUserCloud() {
	getCookie()
	return uni.request({
		url: `${baseUrl}/user/cloud?timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取云盘歌曲URL
export function getCloudUrl(id) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/user/cloud/detail?id=${id}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 获取MV歌曲URL
export function getMVUrl(id) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/mv/url?id=${id}&r=720&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 检查歌曲是否可用
export function checkMusic(id) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/check/music?id=${id}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 喜欢歌曲
export function likeMusic(id) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/like?id=${id}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 喜欢的歌曲列表
export function likeMusicItems(uid) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/likelist?uid=${uid}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}

// 从歌单删除歌曲
export function removeMusic(pid,songId) {
	getCookie()
	return uni.request({
		url: `${baseUrl}/playlist/tracks?op=del&pid=${pid}&tracks=${songId}&timestamp=${time}&cookie=${cookie}`,
		withCredentials: true,
		method: 'GET'
	});
}