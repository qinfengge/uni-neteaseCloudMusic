<template>
	<view class="index">
		<music-head title="网易云音乐" :icon="false"></music-head>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="banner">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration">
						<swiper-item v-for="(item,index) in banners" :key='index'>
							<view class="swiper-item"><a :href="item.url">
									<image :src="item.pic"></image>
								</a></view>
						</swiper-item>
					</swiper>
				</view>
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont iconsearch"></text>
					<input placeholder="搜索歌曲" />
				</view>
				<view v-if="isLoading">
					<m-for-skeleton :avatarSize="200" :row="3" :loading="isLoading" isarc="square"
						v-for="(item,key) in 4" :key="key" :titleStyle={} :title="false">
					</m-for-skeleton>
				</view>
				<view class="index-list" v-else>
					<!-- <view class="index-list-item">
						<view class="index-list-img">
							<image src="../../static/wangyiyunyinyue.png"></image>
							<text>每天更新</text>
						</view>
						<view class="index-list-text">
							<view>1. Love Story-Torly Swift</view>
							<view>2. 丑八怪-薛之谦</view>
						</view>
					</view> -->

					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.listId)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item,index) in item.tracks" :key="index">{{index + 1}}.{{item.first}} -
								{{item.second}}
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
	import {
		topList,
		getBanner
	} from '../../common/api.js'
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	export default {
		data() {
			return {
				topList: [],
				banners: [],
				isLoading: true,
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500
			}
		},
		components: {
			musicHead,
			mForSkeleton
		},
		onLoad() {
			// #ifdef H5
			if (!localStorage.getItem('cookie')) {
				uni.navigateTo({
					url: '/pages/login/login',
				});
			};
			// #endif
			// #ifdef MP-WEIXIN
			uni.getStorage({
				key: 'cookie',
				fail() {
					uni.navigateTo({
						url: '/pages/login/login',
					});
				}
			})
			// #endif
			topList().then(res => {
				if (res.length) {
					setTimeout(() => {
						this.topList = res;
						this.isLoading = false
					}, 300)
				}
			});
			getBanner().then(res => {

				if (res[1].data.code == '200') {
					this.banners = res[1].data.banners
				}
			})
		},
		methods: {
			handleToList(listId) {
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId,
				});
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
				});
			},
			// checkLogin(){
			// 	console.log(document.cookie)
			// 	if(document.cookie == null || document.cookie == ''){
			// 		uni.showToast({
			// 		    title: '请先的登录',
			// 			icon: 'error',
			// 		    duration: 2000
			// 		});
			// 		uni.navigateTo({
			// 			url: '/pages/login/login',
			// 			success: res => {},
			// 			fail: () => {},
			// 			complete: () => {}
			// 		});
			// 	}
			// },
		}
	}
</script>

<style scoped>
	.index {}

	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}

	.index-search text {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.index-search input {
		font-size: 26rpx;
		flex: 1;
	}

	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.index-list-img {
		width: 200rpx;
		height: 200rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 25rpx;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;
	}

	.index-list-text {
		width: 450rpx;
		font-size: 24rpx;
		line-height: 66rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.banner {
		width: 750rpx;
		height: 300rpx;
		position: relative;
		overflow: hidden;
		/* border: 1px dashed #000; */
	}

	.swiper-item image {
		position: absolute;
		top: 50%;
		left: 50%;
		display: block;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -50%);
	}
</style>
