<template>
	<view class="detail">
		<view class="fixbg" :style="{'background-image': 'url('+ songDetail.al.picUrl +')'}">
		</view>
		<view v-if="isController">
			<music-head :title="songDetail.name" :icon="true" color="white"></music-head>
			<view class="container" v-show="!isLoading">
				<scroll-view scroll-y="true">
					<view class="detail-play" @tap="handleToPlay">
						<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate}"></image>
						<text class="iconfont" :class="iconPlay"></text>
						<view></view>
					</view>
					<view class="detail-lyric" @tap="handleToController">
						<view class="detail-lyric-wrap"
							:style="{ transform : 'translateY('+ - (lyricIndex - 1) * 80 + 'rpx)'}">
							<view id="lyric" class="detail-lyric-item" :class="{active : lyricIndex == index}"
								v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
						</view>
					</view>
					<view class="detail-like">
						<view class="detail-like-head" v-if="songSimi!=''">
							喜欢这首歌的人也在听
						</view>
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index"
							@tap="handleToSimi(item.id)">
							<view class="detail-like-img">
								<image :src="item.album.picUrl"></image>
							</view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag>60 && item.privilege.flag<70"
										src="../../static/dujia.png"></image>
									<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png"></image>
									{{item.album.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
					<view class="detail-comment">
						<view class="detail-comment-head" v-if="songComment!=''">
							精彩评论
						</view>
						<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
							<view class="detail-comment-img">
								<image :src="item.user.avatarUrl"></image>
							</view>
							<view class="detail-comment-content">
								<view class="detail-comment-title">
									<view class="detail-comment-name">
										<view>{{item.user.nickname}}</view>
										<view>{{item.time | formatTime}}</view>
									</view>
									<view class="detail-comment-like">{{item.likedCount | formatCount}} <text
											class="iconfont iconlike"></text></view>
								</view>
								<view class="detail-comment-text">
									{{item.content}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-else class="detail-controller">
			<video v-if="songDetail.mv!=0" id="v1" autoplay loop muted src="@/static/11.mp4"></video>
			<video v-if="songDetail.id==441491828" id="v1" autoplay loop muted src="@/static/22.mp4"></video>
			<view class="detail-volume">
				<view class="detail-volume-icon" @tap="handleToMute">
					<svg v-if="!isMute" class="icon" aria-hidden="true">
						<use xlink:href="#icon-yinliang"></use>
					</svg>
					<svg v-else class="icon" aria-hidden="true">
						<use xlink:href="#icon-jingyin"></use>
					</svg>
				</view>
				<dc-slider @changing="changingV" @changed="changedV" :max="max" :min="min" :step="1" :disabled="false"
					:value="volume" :activeColor="activeColor"></dc-slider>
			</view>
			<view class="detail-ly">
				<view class="detail-lyric" @tap="handleToController" style="line-height: 5rpx; color: #C0C0C0;">
					<view class="detail-lyric-wrap"
						:style="{ transform : 'translateY('+ - (lyricIndex - 1) * 80 + 'rpx)'}">
						<view class="detail-lyric-item" :class="{active : lyricIndex == index}"
							v-for="(item,index) in songLyric" :key="index">
							{{item.lyric}}
						</view>
					</view>
				</view>
			</view>
			<view class="detail-progress">
				<view>{{currentTime}}</view>
				<view>
					<dc-slider @changing="changing" @changed="changed" :max="max" :min="min" :step="1" :disabled="false"
						:value="progressVal" :activeColor="activeColor"></dc-slider>
				</view>
				<!-- 歌曲总时长 当不足一分钟 songTimeM会等于1-->
				<view>0{{songTimeM==1 ? 0 : songTimeM }}:{{songTimeS}}</view>
			</view>
			<view class="detail-play-controller">
				<view class="like" @tap="handleToLike(songDetail.id)">
					<svg v-if="!isLike" class="icon" aria-hidden="true">
						<use xlink:href="#icon-xihuan"></use>
					</svg>
					<svg v-else class="icon" aria-hidden="true">
						<use xlink:href="#icon-xihuan1"></use>
					</svg>
				</view>
				<view class="shang">
					<svg class="icon" aria-hidden="true" @tap="handleToPreSong">
						<use xlink:href="#icon-shangyishou"></use>
					</svg>
				</view>
				<view class="bofang" @tap="handleToDetailController">
					<svg v-if="isDetailPlay" class="icon" aria-hidden="true">
						<use xlink:href="#icon-yuanxingbofang"></use>
					</svg>

					<svg v-else class="icon" aria-hidden="true">
						<use xlink:href="#icon-bofangqi3"></use>
					</svg>
				</view>
				<view class="xia">
					<svg class="icon" aria-hidden="true" @tap="handleToNextSong">
						<use xlink:href="#icon-xiayishou"></use>
					</svg>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import '@/common/iconfont.css';
	import '@/static/iconfont/iconfont.js'
	import musicHead from '../../components/musicHead/musicHead.vue';
	import dcSlider from '@/components/ly-drag-slider/dc-slider.vue';
	import {
		songDetail,
		songLyric,
		songSimi,
		songComment,
		songUrl,
		getMVUrl,
		likeMusic,
		likeMusicItems,
		getUserPlayList,
		removeMusic
	} from '../../common/api.js'
	export default {
		components: {
			musicHead,
			dcSlider
		},
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [],
				songComment: [],
				songLyric: [],
				lyricIndex: 0,
				iconPlay: 'iconpause',
				isPlayRotate: true,
				isLoading: true,
				songTime: 0,
				isController: true,
				currentTime: '0',
				songTimeM: '',
				songTimeS: '',
				max: 100,
				min: 0,
				progressVal: 0,
				volume: 20,
				isMute: false,
				activeColor: '#00E3AB',
				isDetailPlay: true,
				mvSrc: '',
				uid: '',
				isLike: false,
				favoritePlayListId: ''
			}
		},
		methods: {
			getMusic(songId) {
				this.$store.commit('NEXT_ID', songId)
				this.$store.commit('PRE_ID', songId)
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), likeMusicItems(
					this.uid), songUrl(
					songId)]).then((res) => {
					if (res[0][1].data.code == '200') {
						this.songDetail = res[0][1].data.songs[0]
					}
					if (res[1][1].data.code == '200') {
						this.songSimi = res[1][1].data.songs
					}
					if (res[2][1].data.code == '200') {
						this.songComment = res[2][1].data.hotComments
					}
					if (res[3][1].data.code == '200') {
						if (res[3][1].data.uncollected) {
							this.songLyric = ''
						} else {
							let lyric = res[3][1].data.lrc.lyric;
							let re = /\[([^\]]+)\]([^\[]+)/g;
							// console.log(lyric.match(re))
							var result = [];
							lyric.replace(re, ($0, $1, $2) => {
								result.push({
									"time": this.formatTimeToSec($1),
									"lyric": $2
								});
							});
							// console.log(result)
							this.songLyric = result
						}

					}
					if (res[4][1].data.code == '200') {
						let likedSongs = res[4][1].data.ids
						// console.log(likedSongs)
						for (var i = 0; i < likedSongs.length; i++) {
							if (this.songDetail.id == likedSongs[i]) {
								this.isLike = true
								this.$store.commit('SETISLIKED', true)
								// console.log(this.isLike)
								break
							} else {
								this.isLike = false
								this.$store.commit('SETISLIKED', false)
							}
						}
					}
					if (res[5][1].data.code == '200') {
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.singer = this.songDetail.ar[0].name;
						this.bgAudioManager.volume = 0.2;
						this.bgAudioManager.coverImgUrl = this.songDetail.al.picUrl;
						// #endif
						// #ifdef H5
						this.bgAudioManager = uni.createInnerAudioContext();
						this.bgAudioManager.autoplay = true;
						this.bgAudioManager.volume = 0.2;
						// console.log(Object.values(this.bgAudioManager)[4])
						this.iconPlay = 'iconbofang1';
						this.isPlayRotate = false
						// #endif
						// #ifdef APP
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.singer = this.songDetail.ar[0].name;
						this.bgAudioManager.volume = 0.2;
						this.bgAudioManager.coverImgUrl = this.songDetail.al.picUrl;
						// #endif
						console.log(res[5][1].data.data[0].url)
						this.bgAudioManager.src = res[5][1].data.data[0].url
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = 'iconpause';
							this.isDetailPlay = true
							this.isPlayRotate = true
							this.listenLyricIndex()

						});
						this.bgAudioManager.onTimeUpdate(() => {
							let ct = this.bgAudioManager.currentTime
							this.currentTime = Number(ct).toFixed(0)
							// console.log(this.currentTime)
							this.progressVal = (Number(this.currentTime / this.songTime)) * 100
							// console.log(this.progressVal)
						})
						this.bgAudioManager.onPause(() => {
							this.iconPlay = 'iconbofang1';
							this.isDetailPlay = false
							this.isPlayRotate = false
							this.cancelLyricIndex()
						});
						this.bgAudioManager.onEnded(() => {
							this.getMusic(this.$store.state.nextId)
							
						});
						// #ifdef H5
						this.bgAudioManager.onCanplay(() => {
							this.songTime = this.bgAudioManager.duration
							// console.log(this.songTime)
							this.songTimeM = Number(this.songTime / 60).toFixed(0)
							// console.log(this.songTimeM)
							this.songTimeS = Number(this.songTime % 60).toFixed(0)
							// console.log(this.songTimeS)
						})
						// #endif
						
						this.$store.commit('SETMUSICPIC', this.songDetail.al.picUrl)
						this.$store.commit('SETFABDISPLAY', true)
						this.$store.commit('SETMUSIC', this.bgAudioManager)
						this.$store.commit('SETFABKEY')
						this.$store.commit('SETPREMUSIC', this.handleToPreSong)
						this.$store.commit('SETNEXTMUSIC', this.handleToNextSong)
						this.$store.commit('SETDOLIKE', this.handleToLike)
						this.$store.commit('SETSONGID', songId)
					}
					this.isLoading = false
				});
			},
			formatTimeToSec(value) {
				let arr = value.split(":");
				return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
			},
			handleToPlay() {
				if (this.bgAudioManager.paused) {
					this.bgAudioManager.play()
				} else {
					this.bgAudioManager.pause()
				}
			},
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					this.lyricIndex = 0
					for (var i = 0; i < this.songLyric.length; i++) {
						if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							this.lyricIndex = this.songLyric.length - 1
							this.iconPlay = 'iconbofang1';
							this.isPlayRotate = false
							break
						}
						if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager
							.currentTime < this.songLyric[i + 1].time) {
							this.lyricIndex = i
						}
					}
				}, 500)
			},
			cancelLyricIndex() {
				clearInterval(this.timer)
			},
			handleToSimi(songId) {
				// this.getMusic(songId)
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId,
				});
			},
			handleToController() {
				this.listenLyricIndex()
				console.log(this.isLike)
				if (this.isController) {
					this.isController = false
					if (this.songDetail.mv != 0) {
						getMVUrl(this.songDetail.mv).then(res => {
							if (res[1].data.code == '200') {
								this.mvSrc = res[1].data.url
							}
						})
					}
				} else {
					this.isController = true
				}
			},
			changing(e) {
				this.currentTime = ((Number(this.songTime * e.progress)) / 100).toFixed(0)
				// console.log(this.currentTime)
				this.bgAudioManager.seek(this.currentTime)
			},
			changed(e) {
				this.currentTime = ((Number(this.songTime * e.progress)) / 100).toFixed(0)
				// console.log(this.currentTime)
				this.bgAudioManager.seek(this.currentTime)
			},
			changingV(e) {
				this.volume = e.progress
				this.bgAudioManager.volume = (this.volume / 100)
			},
			changedV(e) {
				this.volume = e.progress
				this.bgAudioManager.volume = (this.volume / 100)
			},
			handleToPreSong() {
				if(this.$store.state.music != ''){
					this.$store.state.music.destroy()
				}
				this.getMusic(this.$store.state.preId)
			},
			handleToNextSong() {
				if(this.$store.state.music != ''){
					this.$store.state.music.destroy()
				}
				this.getMusic(this.$store.state.nextId)
			},
			handleToMute() {
				if (!this.isMute) {
					this.bgAudioManager.volume = 0
					this.volume = 0
					this.isMute = true
				} else {
					this.bgAudioManager.volume = 0.2
					this.volume = 20
					this.isMute = false
				}
			},
			handleToDetailController() {
				// console.log(this.bgAudioManager.pause())
				if (this.isDetailPlay) {
					this.bgAudioManager.pause()
				} else {
					// this.isDetailPlay = true
					this.bgAudioManager.play()
				}
			},
			handleToLike(songId) {
				if (!this.isLike || !this.$store.state.isLiked) {
					likeMusic(songId).then(res => {
						if (res[1].data.code == '200') {
							uni.showToast({
								title: '已添加到最爱!',
								icon: 'success',
								duration: 1000
							});
							this.isLike = true
							this.$store.commit('SETISLIKED', true)
							// this.favoritePlayListId = res[1].data.playlistId
							console.log(this.music.musicContent.paused)
						}
					})
				} else {
					removeMusic(this.favoritePlayListId, songId).then(res => {
						if (res[1].data.status == '200') {
							uni.showToast({
								title: '已取消最爱!',
								icon: 'success',
								duration: 1000
							});
							this.isLike = false
							this.$store.commit('SETISLIKED', false)
						}
					})
				}
			},
			
			isDeathMusic(){
				songUrl(this.$store.state.preId).then(res =>{
					if(res[1].data.data[0].url == null || ''){
						this.$store.commit('SETPREDEATHMUSIC', true)
					}
				});
				
				songUrl(this.$store.state.nextId).then(res =>{
					if(res[1].data.data[0].url == null || ''){
						this.$store.commit('SETNEXTDEATHMUSIC', true)
					}
				});
			}
		},
		onLoad(options) {
			if(this.$store.state.music != ''){
				this.$store.state.music.destroy()
			}
			uni.getStorage({
				key: 'uid',
				success: (res) => {
					this.uid = res.data
				}
			})
			getUserPlayList(this.uid).then(res => {
				if (res[1].data.code == '200') {
					this.favoritePlayListId = res[1].data.playlist[0].id
				}
			})
			// console.log(options.songId)
			this.getMusic(options.songId)
			
			// console.log(this.$store.state.uid)
		},
		mounted() {
			this.isDeathMusic()
		},
		onUnload() {
			this.cancelLyricIndex()
			// // #ifdef H5
			// this.bgAudioManager.destroy()
			// // #endif
		},
		onHide() {
			this.cancelLyricIndex()
			// // #ifdef H5
			// this.bgAudioManager.destroy()
			// // #endif
		},
		// watch: {
		// 	$route(to, from) {
		// 		if(to.path == '/pages/detail/detail'){
		// 			this.bgAudioManager.destroy()
		// 		}
		// 	}
		// }

	}
</script>
<style scoped>
	.icon {
		/* z-index: 999; */
		width: 3em;
		height: 3em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 200rpx auto 0 auto;
		position: relative;
	}

	.detail-play image {
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		animation: 10s linear move infinite;
		animation-play-state: paused;
	}

	.detail-play .detail-play-run {
		animation-play-state: running;
	}

	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-play text {
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: white;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}

	.detail-play view {
		width: 230rpx;
		height: 360rpx;
		background: url(~@/static/needle.png);
		position: absolute;
		left: 100rpx;
		right: 0;
		top: -200rpx;
		margin: auto;
		background-size: cover;
	}

	.detail-lyric {
		font-size: 32rpx;
		line-height: 80rpx;
		height: 240rpx;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		color: #6f6e93;
		font-weight: 400;
	}

	.detail-lyric-wrap {
		transition: .5s;
	}

	.detail-lyric-item {
		height: 80rpx;
	}

	.detail-lyric-item.active {
		color: #007AFF;
	}

	.detail-like {
		margin: 0 30rpx;
	}

	.detail-like-head {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-like-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-like-img image {
		width: 100%;
		height: 100%;
	}

	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.detail-like-song {
		flex: 1;
		color: white;
	}

	.detail-like-song view:nth-child(1) {
		font-size: 30rpx;
		margin-bottom: 15rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
	}

	.detail-like-song image {
		width: 25rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}

	.detail-like-item text {
		font-size: 50rpx;
	}

	.detail-comment {
		margin: 0 30rpx;
	}

	.detail-comment-head {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		margin-bottom: 30rpx;
		display: flex;
	}

	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-img {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%;
	}

	.detail-comment-content {
		flex: 1;
		color: #cbcacf;
	}

	.detail-comment-like {
		font-size: 28rpx;
	}

	.detail-comment-name {}

	.detail-comment-name view:nth-child(1) {
		font-size: 25rpx;
	}

	.detail-comment-name view:nth-child(2) {
		font-size: 20rpx;
	}

	.detail-comment-text {
		font-size: 30rpx;
		line-height: 40rpx;
		color: white;
		margin-top: 20rpx;
		border-bottom: 1px #e0e0e0 solid;
		padding-bottom: 40rpx;
	}

	.detail-controller {
		width: 100%;
		height: 100%;
	}

	.detail-controller video {
		position: fixed;
		right: 0px;
		bottom: 0px;
		min-width: 100%;
		min-height: 100%;
		height: auto;
		width: auto;
		/*加滤镜*/
		/*filter: blur(15px); //背景模糊设置 */
		/*-webkit-filter: grayscale(100%);*/
		/*filter:grayscale(100%); //背景灰度设置*/
		z-index: 1;
		transform: scale(1.22);
	}

	.detail-ly {
		height: 80vh;
		position: relative;
		z-index: 99;
		margin-bottom: 50rpx;

	}

	.detail-ly view:nth-child(1) {
		height: 120vh;
		position: relative;
		bottom: 40vh;
		z-index: 99;
	}

	.detail-progress {
		width: 100%;
		font-size: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 100rpx;
	}

	.detail-progress view:nth-child(1) {
		z-index: 99;
		color: white;
	}

	.detail-progress view:nth-child(2) {
		width: 80%;
	}

	.detail-progress view:nth-child(3) {
		z-index: 99;
		color: white;
	}

	.detail-play-controller {
		margin-top: 20rpx;
		width: 80%;
		display: flex;
		justify-content: space-between;
		position: absolute;
		left: 50rpx;
		;
		align-items: center;
	}

	.shang {
		z-index: 99;
	}

	.bofang {
		z-index: 99;
	}

	.xia {
		z-index: 99;
	}

	.like {
		z-index: 99;
		font-size: 25rpx;
		color: white;
	}

	.detail-volume {
		z-index: 199;
		width: 80%;
		display: flex;
		position: relative;
		top: 75rpx;
		justify-content: space-between;
		margin-left: 60rpx;
		align-items: center;
	}

	.detail-volume-icon {
		z-index: 99;
		font-size: 15rpx;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
		margin-right: 30rpx;
	}
</style>
