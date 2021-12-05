<template>
	<view class="search">
		<music-head title="搜索" :icon="true" :iconblack="true"></music-head>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input placeholder="搜索歌曲" v-model="searchKey" @confirm="handleToSearch(searchKey)" @input="handleToSuggest"/>
					<text v-show="searchType != 1" class="iconfont iconguanbi" @tap="handleToClose"></text>
				</view>
				<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head">
							<text style="font-size: 30rpx;">历史记录</text>
							<text class="iconfont iconlajitong" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleToHot(item)">{{item}}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head" style="font-size: 30rpx;">
							热搜榜
						</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index"
							@tap="handleToHot(item.searchWord)">
							<view class="search-hot-top">
								{{index+1}}
							</view>
							<view class="search-hot-word">
								<view>{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{item.content}}</view>
							</view>
							<text class="search-hot-count">{{item.score}}</text>
							</view>
				</view>
				</block>
				<block v-else-if="searchType  == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index"
							@tap="handleToMusic(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.artists[0].name}} - {{item.album.name}}</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head" @tap="handleToHot(searchKey)">
							搜索"{{searchKey}}"
						</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleToHot(item.keyword)">
							<text class="iconfont iconsearch"></text>
							{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musicHead from '../../components/musicHead/musicHead.vue';
	import {
		searchHot,
		searchKey,
		searchSuggest
	} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchKey: '',
				searchHistory: [],
				searchType: 1,
				searchList: [],
				searchSuggest: []
			}
		},
		components: {
			musicHead
		},
		methods: {
			handleToHot(key) {
				this.searchKey = key
				this.handleToSearch(key)
			},
			handleToSearch(key) {
				this.searchHistory.unshift(key)
				this.searchHistory = [...new Set(this.searchHistory)]
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				this.getSearchList(key)
			},
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: () => {
						this.searchHistory = []
					}
				})
			},
			getSearchList(key) {
				searchKey(key).then((res) => {
					if (res[1].data.code == '200') {
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			handleToClose() {
				this.searchKey = ''
				this.searchType = 1
			},
			handleToMusic(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId,
				});
			},
			handleToSuggest(ev){
				let value = ev.detail.value
				if(!value){
					this.searchType = 1
					return
				}
				searchSuggest(value).then((res) =>{
					if(res[1].data.code == '200'){
						this.searchSuggest = res[1].data.result.allMatch
						this.searchType = 3
					}
				})
			}
		},
		onLoad() {
			searchHot().then((res) => {
					if (res[1].data.code == '200') {
						this.searchHot = res[1].data.data
					}
				}),
				uni.getStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = res.data
					}
				})
		}
	}
</script>

<style scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 50rpx 30rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}

	.search-search text {
		margin: 0 25rpx;
	}

	.search-search input {
		font-size: 25rpx;
		flex: 1;
	}

	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 40rpx;
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background: #f7f7f7;
	}

	.search-hot {
		font-size: 26rpx;
		margin: 0 30rpx;
	}

	.search-hot-head {
		margin-bottom: 36rpx;
	}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 60rpx;
	}

	.search-hot-top {
		color: #Fb2222;
		width: 60rpx;
		margin-left: 10rpx;
		font-size: 30rpx;
	}

	.search-hot-word {
		flex: 1;
	}

	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: black;
	}

	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #878787;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}

	.search-hot-count {
		color: #878787;
	}

	.search-result {
		border-top: 2rpx #e4e4e4 solid;
		padding: 30rpx;
	}

	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx #e4e4e4 solid;
	}

	.search-result-item text {
		font-size: 50rpx;
	}

	.search-result-word {}

	.search-result-word view:nth-child(1) {
		font-size: 28rpx;
		color: #235790;
		margin-bottom: 12rpx;
	}

	.search-result-word view:nth-child(2) {
		font-size: 22rpx;
		color: #898989;
	}

	.search-suggest {
		border-bottom: 2rpx #e4e4e4 solid;
		padding: 30rpx;
		font-size: 25rpx;
	}

	.search-suggest-head {
		color: #4574a5;
		margin-bottom: 75rpx;
	}

	.search-suggest-item {
		color: #5d5d5d;
		margin-bottom: 75rpx;
	}

	.search-suggest-item text {
		color: #bdbdbd;
		margin-right: 30rpx;
	}
</style>
