<template>
	<view class="my">
		<scroll-view scroll-y="true">
			<uni-card class="my-card" :isFull="true"
				:style="{'background-image': 'url('+ userAccount.backgroundUrl +')'}">
			</uni-card>
			<view class="user">
				<image class="my-card-user"
					:src="userAccount.avatarUrl"></image>
			</view>
			<uni-card>
			    <text @tap="handleToUserCloud">云盘</text>
			</uni-card>
			<uni-card>
				<view class="my-playList">
					<view class="my-playList-item" v-for="(item,index) in userPlayList" :key="index" @tap="handleToPlayListDetail(item.id)">
						<image :src="item.coverImgUrl"></image>
						<text class="my-playList-item-name">{{item.name}}</text>
						<text style="font-size: 20rpx; width: 100rpx;">{{item.trackCount}}首</text>
					</view>
				</view>
			</uni-card>
		</scroll-view>
	</view>
</template>

<script>
	import {
		getUser,getUserPlayList,getUserCloud
	} from '../../common/api.js'
	export default {
		data() {
			return {
				uid: '',
				userAccount: [],
				userPlayList: [],
			}
		},
		methods: {
			handleToPlayListDetail(id){
				uni.navigateTo({
					url: '/pages/list/list?listId=' + id,
				});
			},
			handleToUserCloud(){
				uni.navigateTo({
					url: '/pages/cloud/cloud',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onLoad() {
			getUser().then(res => {
				console.log(res[1].data.code)
				if(res[1].data.code == '200'){
					this.userAccount = res[1].data.profile
					getUserPlayList(this.userAccount.userId).then(res =>{
						if(res[1].data.code == '200'){
							this.userPlayList = res[1].data.playlist
						}
					})
				}
			})
		}
	}
</script>

<style scoped>
	.my-card {
		height: 400rpx;
		/* position: fixed; */
		background-size: cover;
		background-position: center 0;
	}

	.my-card-user {
		width: 175rpx;
		height: 175rpx;
		border-radius: 50%;
		border: 5px solid white;
		position: relative;
		bottom: 100rpx;
		/* left: 20rpx; */
	}
	.my-playList-item image{
		width: 120rpx;
		height: 100rpx;
		border-radius: 20rpx;
	}
	.my-playList-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}
	.my-playList-item-name {
		font-size: 30rpx;
		/* width: 70vw; */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 20rpx;
		width: 60vw;
	}
</style>
