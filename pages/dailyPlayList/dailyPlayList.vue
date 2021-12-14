<template>
	<view>
		<scroll-view scroll-y="true">
			<view class="index-grid">
				<uni-grid :column="3" :showBorder="false" :square="false" class="index-grid-tools"
					@change="handleToRecommend">
					<uni-grid-item v-for="(item,index) in playlist" :key="index" :index="item.id">
						<view class="grid-item">
							<view class="list-head-img">
								<image :src="item.picUrl"></image>
								<text class="iconfont iconyousanjiao">{{item.playcount | formatCount}}</text>
						</view>
						<text class="grid-text">{{item.name}}</text>
			</view>
			</uni-grid-item>
			</uni-grid>
	</view>
	</scroll-view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue';
	import {getCookie,recommendResource} from '../../common/api.js'
	export default {
		data() {
			return {
				playlist : {
					coverImgUrl : '' ,
					creator : {
						avatarUrl : '' ,
					}
				},
			}
		},
		methods: {
			handleToRecommend(e){
				console.log(e)
				uni.navigateTo({
					url: '/pages/list/list?listId=' + e.detail.index,
				});
			}
		},
		onLoad() {
			recommendResource().then(res =>{
				if(res[1].data.code == '200'){
					this.playlist = res[1].data.recommend
					console.log(this.playlist)
				}
			})
		}
	}
</script>

<style>
.list-head-img{
	width: 225rpx;
	height: 225rpx;
	border-radius: 30rpx;
	overflow: hidden;
	position: relative;
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
.grid-text{
	font-size: 15rpx;
}
</style>
