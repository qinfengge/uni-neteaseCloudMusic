<template>
	<view class="list">
		<view class="fixbg" style="background-image: url('https://i.pinimg.com/564x/5d/37/d4/5d37d41712e23f63b6da902384d41f5e.jpg');"></view>
		<music-head title="云盘" :icon="true" color="white"></music-head>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true" >
				<view class="list-head">
					<view class="list-head-img">
						<image src="http://p2.music.126.net/Zpph-MwysxtjpqI7YIw1zg==/109951166674182447.jpg"></image>
					</view>
					<view class="list-head-text">
						<view>云盘</view>
						<view>
							<image src="http://p2.music.126.net/Zpph-MwysxtjpqI7YIw1zg==/109951166674182447.jpg"></image>
						</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="share" class="list-share">
					<text class="iconfont iconicon-"></text>分享给微信好友
				</button>
				<!-- #endif -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont iconbofang1"></text>
						<text>播放全部</text>
						<text>(共{{playlist.count}}首)</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playlist.data" :key="index" @tap="handleToDetail(item.simpleSong.id)">
						<view class="list-music-index">{{index+1}}</view>
						<view class="list-music-detail">
							<view>{{item.songName}}</view>
							<view>
								<image v-if="item.simpleSong.privilege.flag>60 && item.simpleSong.privilege.flag<70" src="../../static/dujia.png"></image>
								<image v-if="item.simpleSong.privilege.maxbr == 999000" src="../../static/sq.png"></image>
								<!-- {{item.ar[0].name}} -->
									{{item.artist}}
									
								 - {{item.artist}}
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
					
					<!-- <view class="list-music-item">
						<view class="list-music-index">1</view>
						<view class="list-music-detail">
							<view>与我无关</view>
							<view>
								<image src="../../static/dujia.png"></image>
								<image src="../../static/sq.png"></image>
								阿放 - 与我无关
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view> -->
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue';
	import {getUserCloud,getCookie,getCloudUrl} from '../../common/api.js'
	export default {
		components: {
			musicHead
		},
		data() {
			return {
				playlist : [],
				privileges: {
					
				},
				isLoading : true
			}
		},
		onLoad(options) {
			getUserCloud().then(res =>{
				// console.log(res[1].data.data[1].simpleSong)
				if(res[1].data.code == '200'){
					this.playlist = res[1].data
					this.isLoading = false
				}
			})
		},
		methods: {
			handleToDetail(songId){
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId,
				});
			}
		}
	}
</script>
s
<style scoped>
.list-head{
	display: flex;
	margin: 30rpx;
}
.list-head-img{
	width: 250rpx;
	height: 250rpx;
	border-radius: 30rpx;
	overflow: hidden;
	position: relative;
	margin-right: 40rpx;
}
.list-head-img  image{
	width: 100%;
	height: 100%;
}
.list-head-img text{
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	font-size: 25rpx;
	color: white;
}
.list-head-text{
	flex: 1;
	color: #f0f2f7;
}
.list-head-text view:nth-child(1){
	color: white;
	font-size: 35rpx;
}
.list-head-text view:nth-child(2){
	display: flex;
	margin: 20rpx 0;
	font-size: 25rpx;
	align-items: center;
}
.list-head-text view:nth-child(2) image{
	width: 50rpx;
	height: 50rpx;
	border-radius: 50%;
	margin-right: 14rpx;
}
.list-head-text view:nth-child(3){
	line-height: 38rpx;
	font-size: 18rpx;
}
.list-share{
	width: 320rpx;
	height: 75rpx;
	margin: 0 auto;
	background: rgba(0,0,0,0.4);
	border-radius: 32rpx;
	color: white;
	text-align: center;
	line-height: 76rpx;
	font-size: 28rpx;
}
.list-share text{
	margin-right: 16rpx;
}
.list-music{
	background-color: white;
	border-radius: 50rpx;
	margin-top: 40rpx;
	overflow: hidden;
}
.list-music-head{
	height: 50rpx;
	margin: 30rpx 0 70rpx 25rpx;
}
.list-music-head text:nth-child(1){
	height: 50rpx;
	font-size: 50rpx;
}
.list-music-head text:nth-child(2){
	font-size: 30rpx;
	margin-left: 15rpx;
}
.list-music-head text:nth-child(3){
	font-size: 22rpx;
	color: #b2b2b2;
	margin-left: 15rpx;
}
.list-music-item{
	display: flex;
	margin: 20rpx 30rpx 66rpx 20rpx;
	align-items: center;
	color: #959595;
	}
.list-music-index{
	width: 56rpx;
	font-size: 35rpx;
	line-height: 35rpx;
}
.list-music-detail{
	flex: 1;
	position: relative;
	left: 20rpx;
}
.list-music-detail view:nth-child(1){
	font-size: 30rpx;
	color: black;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.list-music-detail view:nth-child(2){
	/* display: flex; */
	font-size: 20rpx;
	align-items: center;
	width: 70vw;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.list-music-detail view:nth-child(2) image{
	width: 30rpx;
	height: 20rpx;
	margin-right: 10rpx;
	flex-shrink: 0;
}
.list-music-item text{
	font-size: 50rpx;
	color: #c7c7c7;
}
</style>
