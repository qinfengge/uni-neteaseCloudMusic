<template>
	<view class="detail">
		<view class="fixbg" :style="{'background-image': 'url('+ songDetail.al.picUrl +')'}"></view>
		<music-head :title="songDetail.name" :icon="true" color="white"></music-head>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate}"></image>
					<text class="iconfont" :class="iconPlay"></text>
					<view></view>
				</view>
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY('+ - (lyricIndex - 1) * 80 + 'rpx)'}">
						<view class="detail-lyric-item" :class="{active : lyricIndex == index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
					</view>
				</view>
				<view class="detail-like">
					<view class="detail-like-head" v-if="songSimi!=''">
						喜欢这首歌的人也在听
					</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl"></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag>60 && item.privilege.flag<70" src="../../static/dujia.png"></image>
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
								<view class="detail-comment-like">{{item.likedCount | formatCount}} <text class="iconfont iconlike"></text></view>
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
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue';
	import {songDetail, songLyric, songSimi, songComment, songUrl} from '../../common/api.js' 
	export default {
		components: {
			musicHead
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
				isLoading : true
			}
		},
		methods: {
			getMusic(songId){
				this.$store.commit('NEXT_ID',songId)
				Promise.all([ songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(songId) ]).then((res) =>{
					if(res[0][1].data.code == '200'){
						this.songDetail = res[0][1].data.songs[0]
					}
					if(res[1][1].data.code == '200'){
						this.songSimi = res[1][1].data.songs
					}
					if(res[2][1].data.code == '200'){
						this.songComment = res[2][1].data.hotComments
					}
					if(res[3][1].data.code == '200'){
						if(res[3][1].data.uncollected){
							this.songLyric = ''
						}else{
							let lyric = res[3][1].data.lrc.lyric;
							let re = /\[([^\]]+)\]([^\[]+)/g;
							// console.log(lyric.match(re))
							var result = [];
							lyric.replace(re, ($0, $1, $2) =>{
								result.push({"time" : this.formatTimeToSec($1) , "lyric" : $2 });
							});
							// console.log(result)
							this.songLyric = result
						}
						
					}
					if(res[4][1].data.code == '200'){
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						this.bgAudioManager.singer = this.songDetail.ar[0].name;
						this.bgAudioManager.coverImgUrl = this.songDetail.al.picUrl;
						
						// #endif
						
						// #ifdef H5
						this.bgAudioManager = uni.createInnerAudioContext();
						this.bgAudioManager.autoplay = true;
						// console.log(Object.values(this.bgAudioManager)[4])
						this.iconPlay = 'iconbofang1';
						this.isPlayRotate = false
						// #endif
						console.log(res[4][1].data.data[0].url)
						this.bgAudioManager.src = res[4][1].data.data[0].url || ''
						this.listenLyricIndex()
						this.bgAudioManager.onPlay(() =>{
							this.iconPlay = 'iconpause';
							this.isPlayRotate = true
							this.listenLyricIndex()
						});
						this.bgAudioManager.onPause(() =>{
							this.iconPlay = 'iconbofang1';
							this.isPlayRotate = false
							this.cancelLyricIndex()
						});
						this.bgAudioManager.onEnded(() =>{
							this.getMusic(this.$store.state.nextId)
						})
					}
					this.isLoading = false
				});
			},
			formatTimeToSec(value){
				let arr = value.split(":");
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1);
			},
			handleToPlay(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()
				}else{
					this.bgAudioManager.pause()
				}
			},
			listenLyricIndex(){
				clearInterval(this.timer);
				this.timer = setInterval(() =>{
						for(var i = 0;i<this.songLyric.length;i++){
							if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time){
								this.lyricIndex = this.songLyric.length-1
								this.iconPlay = 'iconbofang1';
								this.isPlayRotate = false
								break
							}
							if(this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time ){
								this.lyricIndex = i
							}
						}
				},500)
			},
			cancelLyricIndex(){
				clearInterval(this.timer)
			},
			handleToSimi(songId){
				this.getMusic(songId)
			}
		},
		onLoad(options) {
			// console.log(options.songId)
			this.getMusic(options.songId)
		},
		onUnload(){
			this.cancelLyricIndex()
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			this.cancelLyricIndex()
			// // #ifdef H5
			// this.bgAudioManager.destroy()
			// // #endif
		}
	}
</script>

<style scoped >
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
	.detail-play .detail-play-run{
		animation-play-state: running;
	}
	@keyframes move{
		from{transform: rotate(0deg);}
		to{transform: rotate(360deg);}
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
		color: white;
	}
	.detail-like{
		margin: 0 30rpx;
	}
	.detail-like-head{
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}
	.detail-like-img{
		width: 80rpx;
		height: 80rpx;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}
	.detail-like-img image{
		width: 100%;
		height: 100%;
	}
	.detail-like-item{
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}
	.detail-like-song{
		flex: 1;
		color: white;
	}
	.detail-like-song view:nth-child(1){
		font-size: 30rpx;
		margin-bottom: 15rpx;
	}
	.detail-like-song view:nth-child(2){
		font-size: 22rpx;
	}
	.detail-like-song image{
		width: 25rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.detail-like-item text{
		font-size: 50rpx;
	}
	.detail-comment{
		margin: 0 30rpx;
	}
	.detail-comment-head{
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}
	.detail-comment-item{
		margin-bottom: 30rpx;
		display: flex;
	}
	.detail-comment-title{
		display: flex;
		justify-content: space-between;
	}
	.detail-comment-img{
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}
	.detail-comment-img image{
		width: 100%;
		height: 100%;
	}
	.detail-comment-content{
		flex: 1;
		color: #cbcacf;
	}
	.detail-comment-like{
		font-size: 28rpx;
	}
	.detail-comment-name{
		
	}
	.detail-comment-name view:nth-child(1){
		font-size: 25rpx;
	}
	.detail-comment-name view:nth-child(2){
		font-size: 20rpx;
	}
	.detail-comment-text{
		font-size: 30rpx;
		line-height: 40rpx;
		color: white;
		margin-top: 20rpx;
		border-bottom: 1px #e0e0e0 solid;
		padding-bottom: 40rpx;
	}
</style>
