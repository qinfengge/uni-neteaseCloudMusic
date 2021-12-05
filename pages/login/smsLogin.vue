<template>
	<view>
		<form @submit="submit" class="form">
			<view class="form-phone">

				<uni-easyinput prefixIcon="phone" class="form-phone-input" placeholderStyle="font-size:32rpx"
					:value="phone" :inputBorder="false" name="phone" v-model="phone" placeholder="输入手机号">
				</uni-easyinput>
			</view>
			<view class="form-password">

				<uni-easyinput prefixIcon="locked" placeholderStyle="font-size:32rpx" class="form-password-input"
					:inputBorder="false" name="smsCode" v-model="smsCode" placeholder="请输入验证码"></uni-easyinput>
				<view class="getSms">
					<text v-show="!countDown" @tap="handleCheckSms">获取验证码</text>
					<uni-countdown v-show="countDown" :second="60" @timeup="handleToGetCode" :start="start">
					</uni-countdown>
				</view>
			</view>
			<view class="form-button">
				<!-- <van-button type="default" class="form-submit">登录</van-button> -->
				<button form-type="submit" class="form-submit">登录</button>
			</view>
			<view class="LoginTools">
				<text @tap="handleToPH">使用密码登录</text>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		getSmsCode,
		smsLogin,
		getCookie
	} from '../../common/api.js'
	export default {
		data() {
			return {
				phone: '',
				smsCode: '',
				countDown: false,
				start: false
			}
		},
		methods: {

			submit: function(e) {
				// let phone = e.detail.value.phone
				// let password = e.detail.value.password

				let phone = this.phone
				let smsCode = this.smsCode

				console.log(phone, smsCode)
				if (smsCode == '') {
					uni.showModal({
						title: '请输入验证码',
					});
				}else{
					console.log('form发生了submit事件，携带数据为：' + JSON.stringify(phone, smsCode))
					this.handleSmsLogin()
				}
			},
			handleCheckSms() {
				let phone = this.phone
				if (phone == '' || phone == null) {
					uni.showModal({
						title: '手机号码不能为空',
					});
				} else if (phone != null) {
					var reg = /^1[3456789]\d{9}$/;
					if (!reg.test(phone)) {
						uni.showModal({
							title: '请输入有效的手机号码',
						});
					} else {
						this.countDown = true
						this.start = true
						this.handleCreatSms()
					}
				}
			},
			handleCreatSms() {
				getSmsCode(this.phone).then(res => {
					if (res[1].data.code == '200') {
						uni.showToast({
							title: '验证码发送成功',
							icon: 'success',
							duration: 2000
						});
					}
				})
			},
			handleSmsLogin() {
				smsLogin(this.phone, this.smsCode).then(res => {
					console.log(res)
					if (res[1].data.code == '200') {
						uni.setStorage({
							key: 'cookie',
							data: res[1].data.cookie
						})
						getCookie()
						uni.switchTab({
							url:'/pages/index/index'
						})
					} else {
						alert(res[1].data.msg)
					}
				})
			},
			handleToGetCode() {
				this.countDown = false
				this.start = false
			},
			handleToPH() {
				uni.navigateTo({
					url: '/pages/login/phLogin',
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.form-submit {
		width: 80%;
		height: 80rpx;
		background: #ff3a3a;
		color: white;
		font-size: 32rpx;
		border-radius: 80rpx;
		margin: 40rpx 75rpx 40rpx 75rpx;
	}

	.form-password-input {
		width: 80%;
		height: 86rpx;
		background-color: rgba(145, 135, 135, 0.1);
		border-radius: 50rpx;
		margin: 40rpx 75rpx 40rpx 75rpx;
		align-items: center;

	}

	.form-phone-input {
		width: 80%;
		height: 86rpx;
		background-color: rgba(145, 135, 135, 0.1);
		border-radius: 50rpx;
		margin: 40rpx 75rpx 40rpx 75rpx;
		align-items: center;
	}

	.getSms {
		font-size: 26rpx;
		color: #ff3a3a;
		position: absolute;
		top: 150rpx;
		left: 480rpx;
	}
	.LoginTools text {
		color: rgba(0,0,0,0.4);
		font-size: 28rpx;
		margin-left: 80rpx;
	}
</style>
