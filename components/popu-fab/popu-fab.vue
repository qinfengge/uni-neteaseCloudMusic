<template>
	<view>
		<uni-fab :pattern="pattern" :content="content" @fabClick="fabClick" @trigger="trigger"></uni-fab>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pattern: {
					backgroundImage: this.$store.state.musicPic,
					display: this.$store.state.fabDisplay,
				},

				content: [{
						iconPath: '',
					},
					{
						iconPath: '../../static/fab/上一首.png',
					},
					{
						iconPath: '',
					},
					{
						iconPath: '../../static/fab/下一首.png',
					}
				],

				music: {
					musicContent: ''
				}
			}
		},

		methods: {
			//刷新悬浮窗图片
			fresh() {
				this.$set(this.pattern, "backgroundImage", this.$store.state.musicPic)
				this.$set(this.music, "musicContent", this.$store.state.music)

			},
			//设置悬浮窗的播放状态
			fabClick() {
				this.changeLike()
				this.changeStatus()
			},
			
			changeLike(){
				this.$set(this.content[0], 'iconPath', this.$store.state.isLiked ? '../../static/fab/喜欢红.png' :
					'../../static/fab/喜欢.png')
			},
			
			changeStatus(){
				this.$set(this.content[2], 'iconPath', this.music.musicContent.paused ? '../../static/fab/播放.png' :
					'../../static/fab/暂停.png')
			},

			//根据不同的下标调用不同的方法
			trigger(e) {
				switch (e.index) {
					case 0:
						this.$store.state.doLike(this.$store.state.songId)
						setTimeout(() => {
						  this.changeLike()
						}, 2000);
						break;
					case 1:
						if (this.$store.state.preDeathMusic == false) {
							console.log(this.$store.state.preDeathMusic)
							this.$store.state.preMusic()
						} else {
							uni.showToast({
								title: '无版权或需要VIP',
								icon: 'error',
								duration: 2000
							});
						}
						break;
					case 2:
						if (this.music.musicContent.paused) {
							this.music.musicContent.play()
							this.fabClick()
						} else {
							this.music.musicContent.pause()
							this.fabClick()
						}
						break;
				 case 3:
						if (this.$store.state.nextDeathMusic == false) {
							this.$store.state.nextMusic()
						}
				  break;
				}
			},
		}

	}
</script>
