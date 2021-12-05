<template>
	<view>
		<form @submit="submit" class="form">
			<view class="form-phone">
				<!-- <input class="form-phone-input" placeholder="输入手机号" name="phone" /> -->
				<uni-easyinput prefixIcon="phone" class="form-phone-input" placeholderStyle="font-size:32rpx"
					:value="phone" :inputBorder="false" name="phone" v-model="phone" placeholder="输入手机号">
				</uni-easyinput>
			</view>
			<view class="form-password">
				<!-- <input class="form-password-input" placeholder="输入密码" name="password" /> -->
				<uni-easyinput prefixIcon="locked" type="password" placeholderStyle="font-size:32rpx"
					class="form-password-input" :inputBorder="false" name="password" v-model="password"
					placeholder="请输入密码"></uni-easyinput>
			</view>
			<view class="form-button">
				<!-- <van-button type="default" class="form-submit">登录</van-button> -->
				<button form-type="submit" class="form-submit">登录</button>
			</view>
		</form>
		<view class="LoginTools">
			<text @tap="handleToSms">使用验证码登录</text>
		</view>
	</view>
</template>

<script>
	import {
		pdLogin
	} from '../../common/api.js'
	export default {
		data() {
			return {
				phone: '',
				password: ''
			}
		},
		methods: {
			// blur1(reg_mobile) {
			// 	console.log("blur事件被执行了", reg_mobile)
			// 	// blur事件被执行了

			// 	if (reg_mobile === ''||reg_mobile === 'undefined') {
			// 		callback1(new Error('手机号不可为空'));
			// 	} else {
			// 		if (reg_mobile !== '') {
			// 			var reg = /^1[3456789]\d{9}$/;
			// 			if (!reg.test(reg_mobile)) {
			// 				callback(new Error('请输入有效的手机号码'));
			// 			}
			// 		}
			// 		// callback();
			// 	}

			// 	function callback1(Error) {
			// 		console.log("name", Error);
			// 		uni.showModal({
			// 			title: '手机号码不能为空',
			// 		});

			// 	}

			// 	function callback(Error) {
			// 		console.log("name", Error);
			// 		uni.showModal({
			// 			title: '请输入有效的手机号码',
			// 		});

			// 	}

			// },
			submit: function(e) {
				// let phone = e.detail.value.phone
				// let password = e.detail.value.password

				let phone = this.phone
				let password = this.password

				console.log(phone, password)
				if (phone == '' || phone == null) {
					uni.showModal({
						title: '手机号码不能为空',
					});
				} else if (password == '') {
					uni.showModal({
						title: '请输入密码',
					});
				} else if (phone != null) {
					var reg = /^1[3456789]\d{9}$/;
					if (!reg.test(phone)) {
						uni.showModal({
							title: '请输入有效的手机号码',
						});
					} else {
						console.log('form发生了submit事件，携带数据为：' + JSON.stringify(phone, password))
						pdLogin(phone, password).then(res => {
							if (res.data.code == 200) {
								uni.setStorage({
									key: 'cookie',
									data: res.data.cookie,
									success() {
										
										uni.switchTab({
											url:'../index/index'
										})
									}
								})
							}else{
								alert(res.data.msg)
							}
							// // #ifdef H5
							// let cookie = res.data.cookie;
							// console.log(cookie)
							// var cookies = cookie.split(';;')
							// for(var i=0;i<cookies.length;i++){
							// 	document.cookie = cookies[i]
							// }

							// // #endif
						})
					}
				}
			},
			handleToSms() {
				uni.navigateTo({
					url: '/pages/login/smsLogin',
					success: res => {},
					fail: () => {},
					complete: () => {}
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

	// .form-phone-input{
	// 	position: relative;
	// }
	// .phone-icon{
	// 	width: 24rpx;
	// 	height: 36rpx;
	// 	position: absolute;
	// 	top: 30rpx;
	// 	left: 120rpx;
	// }
	.LoginTools text {
		color: rgba(0,0,0,0.4);
		font-size: 28rpx;
		margin-left: 80rpx;
	}
</style>
