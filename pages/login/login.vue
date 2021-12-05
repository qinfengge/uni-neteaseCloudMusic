<template>
	<view class="login">
		<view class="login-logo">
			<image src="../../static/163logo.png"></image>
		</view>
		<view class="login-item">
			<van-button type="default" block @click="toPhone" class="login-phone">手机号登陆</van-button>
			<!-- #ifndef MP-WEIXIN -->
			<van-button type="default" block @click="toQr" class="login-qr">扫码登陆</van-button>
			<!-- #endif -->
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toPhone(){
				uni.navigateTo({
					url: '/pages/login/phLogin',
				});
			},
			toQr(){
				uni.navigateTo({
					url: '/pages/login/qrLogin',
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.login{
	width: 100%;
	height: 100%;
	position: fixed;
	background-color:#DB2C1F;
	
}
.login-logo{
	margin-top: 60%;
	
}
.login-logo image{
	width: 150rpx;
	height: 150rpx;
	display: block;
	margin: auto;
}
.login-item{
	margin-top: 200rpx;
	
}
/deep/ .login-item {
	.van-button{
		width: 560rpx;
		height: 92rpx;
		border-radius: 96rpx;
	}
}
/deep/ .login-qr{
	.van-button{
		background: #db2c1f;
		color: #fff;
		margin-top: 36rpx;
		font-size: 32rpx;
	}
}
/deep/ .login-phone{
	.van-button{
		background: #fff;
		color: #ff3a3a;
		font-size: 32rpx;
	}
}
</style>
