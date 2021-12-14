<template>
	<view class="qrLogin">
		<img id="qrImg" />
	</view>
</template>

<!-- <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.20.0-0/axios.min.js"></script> -->
<script>
	import axios from 'axios';
	import {
		baseUrl
	} from '../../common/config.js'
	import {
		getCookie
	} from '../../common/api.js'
	export default {
		data() {
			return {

			}
		},
		methods: {

		},
		onLoad() {
			async function checkStatus(key) {
				const res = await axios({
					url: `${baseUrl}/login/qr/check?key=${key}&timerstamp=${Date.now()}`,
					withCredentials: true, //关键
				})
				return res.data
			}
			async function getLoginStatus() {
				const res = await axios({
					url: `${baseUrl}/login/status?timerstamp=${Date.now()}`,
					withCredentials: true, //关键
				})
				// document.querySelector('#info').innerText = JSON.stringify(res.data, null, 2)
			}
			async function login() {
				let timer
				let timestamp = Date.now()
				getLoginStatus()
				const res = await axios({
					url: `${baseUrl}/login/qr/key?timerstamp=${Date.now()}`,
					withCredentials: true, //关键
				})
				const key = res.data.data.unikey
				const res2 = await axios({
					url: `${baseUrl}/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`,
					withCredentials: true, //关键
				})
				document.querySelector('#qrImg').src = res2.data.data.qrimg

				timer = setInterval(async () => {
					const statusRes = await checkStatus(key)
					if (statusRes.code === 800) {
						alert('二维码已过期,请重新获取')
						clearInterval(timer)
					}
					if (statusRes.code === 803) {
						// 这一步会返回cookie
						clearInterval(timer)
						alert('授权登录成功')
						await getLoginStatus()
						console.log(statusRes)
						// localStorage.setItem('cookie',JSON.stringify(statusRes.cookie))
						uni.setStorage({
							key: 'cookie',
							data: statusRes.cookie
						})
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
				}, 3000)
			}
			login()
		}
	}
</script>

<style>
	.info {
		white-space: pre;
	}

	.qrLogin {
		width: 100vw;
		height: calc(100vh - 70px);
		/* border: 1px dashed #000; */
		display: table-cell;
		/*主要是这个属性*/

		vertical-align: middle;

		text-align: center;
	}
</style>
