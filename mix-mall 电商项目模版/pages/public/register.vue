<template>
  <view class="login_container">
    <!-- 版心 -->
    <view class="container">
      <view class="login-welcome-title">
        注册
      </view>
      <view class="login-welcome-desc">
        注册账号 购买精选好物~
      </view>
      <view class="form">
        <view class="item">
			
          <view class="label">
            手机号
          </view>
          <view class="input_container">
            <input 
				maxlength="11"
				type="number"
                class="input"
                v-model="form.phone"
                placeholder="请输入手机号"
				@focus="hFocus('phone')"
                placeholder-class="placeholder" />
			<!-- 手机号错误提示 -->
			<view class="input_tip" v-if="formMessage.phone" >
				{{formMessage.phone}}
			</view>	
          </view>
        </view>
        <view class="item" style="margin-top: 40rpx;">
			<view class="label">
            密码
			</view>
			<view class="input_container">
				<input 
					type="password"
					maxlength="13"
					class="input"
					v-model="form.password"
					@focus="hFocus('password')"
					placeholder="请输入新密码"
					placeholder-class="placeholder" 
				/>
				<!-- 密码格式错误提示 -->
				<view class="input_tip" v-if="formMessage.password" >
					{{formMessage.password}}
				</view>	
			</view>
			<view class="input_container">
				<input 
					type="password"
					maxlength="13"
					class="input"
					v-model="form.rePassword"
					@focus="hFocus('rePassword')"
					placeholder="请再次输入密码"
					placeholder-class="placeholder" 
				/>
				<!-- 密码格式错误提示 -->
				<view class="input_tip" v-if="formMessage.rePassword" >
					{{formMessage.rePassword}}
				</view>	
			</view>
        </view>
		<view class="item">
			<view class="label">
			  验证码
			</view>
			<view class="input_container">
			  <input type="number"
			         class="input"
			         v-model="form.authCode"
			         placeholder="请输入验证码"
			         placeholder-class="placeholder" />
			  <view class="code_box">
			    <view v-if="getCodeStatus==1"
			          class="getCode"
			          @tap="hTapGetCode">
			      发送验证码
			    </view>
			    <view v-if="getCodeStatus==2"
			          class="stayCode">
			      {{stepNum}} S
			    </view>
			    <view v-if="getCodeStatus==3"
			          class="getCode"
			          @tap="hTapGetCode">
			      重新发送
			    </view>
			  </view>
			</view>
		</view>
      </view>
      <view class="button_box">
        <view 
			class="button"
            :class="submitBTNStatus? 'active':''"
			@tap="hTapBTN" 
		>
          提交
        </view>
      </view>

    </view>
	<!-- 去注册 -->
	<view class="goRegister">
		已有账号
		<view class="registerBTN" @tap="hTapGoRegister" >
			去登陆
		</view>
	</view>
  </view>
</template>

<script>
	import {getAuthCode} from '../../api/authCode.js'
	import {register} from '../../api/register'	
	export default{
		computed:{
			submitBTNStatus() {
				if(!this.form.phone||!this.form.password||!this.form.rePassword){
					return false
				}
				return true
			}
		},
		data () {
		  return {
		    form: {
		      phone: '',
		      password: '',
			  // 二次确认密码
		      rePassword: '',
			  authCode:'',
		    },
			  // 表单错误提示信息
			  formMessage:{
			  	phone: '',
			  	password: '',
			  	// 二次确认密码
			  	rePassword: '',
			  	authCode:'',
			  },
			flag:true,
			stepNum: 60,
			getCodeTimer: '',
		    pwdType: 'password',
			getCodeStatus: 1,
			key: '',
		  };
		},
		onLoad(options) {
			this.key=options.key
		},
		methods:{
			hTapGoRegister() {
				uni.redirectTo({url:'/pages/public/login'})
			},
			hFocus(type) {
				this.formMessage[type] = ''
			},
			
			// 获取验证码
			hTapGetCode () {
				
				if(this.form.phone == null || this.form.phone == undefined || this.form.phone == ''){
					this.$api.msg("请输入手机号")
					//this.formMessage.rePassword = '请输入手机号'
					return;
				}
				if (this.flag) {
					this.flag = false;
					getAuthCode(this.form.phone).then(res => {
						this.flag = true;
						if(res.code != 200) {
							this.$api.msg("网络异常，发送失败")
							//this.formMessage.rePassword = '网络异常，发送失败'
							return;
						} else {
							clearInterval(this.getCodeTimer)
							this.getCodeStatus = 2
							this.getCodeTimer = setInterval(() => {
								--this.stepNum
								if (this.stepNum <= 0) {
									this.getCodeStatus = 3
									this.stepNum = 60
									clearInterval(this.getCodeTimer)
								}
							}, 1000)
						}
					})
				}

			},
			
			// 点击提交按钮
			hTapBTN() {
				if(!this.submitBTNStatus)return 
				// 进行表单校验
				const formReg = {
					phone:{
						reg:/^1[3456789]\d{9}$/,
						tip:'请输入正确的11位手机号'
					},
					password:{
						reg:/[a-zA-Z0-9-*/+.~!@#$%^&*()]{5,13}/,
						tip:'密码长度5-13'
					},
					rePassword:{
						reg:/[a-zA-Z0-9-*/+.~!@#$%^&*()]{5,13}/,
						tip:'密码长度5-13'
					}
				}
				let formCheck = true
				for(const key in this.form){
					if (key == 'username' || key == 'authCode') {
						continue;
					}
					const regRes = formReg[key].reg.test(this.form[key])
					if(!regRes) {
						formCheck = false
						this.formMessage[key] = formReg[key].tip
					}
				}
				if(this.form.password!=this.form.rePassword){
					// 两次密码不相等
					formCheck = false
					this.$api.msg("两次新密码输入不一致，请重新输入")
					//this.formMessage.rePassword = '两次新密码输入不一致，请重新输入'
				}
				if(!formCheck){return console.log('校验失败')}
				if(this.form.authCode == null || this.form.authCode == undefined || this.form.authCode == ''){
					formCheck = false
					this.$api.msg("请输入验证码")
					//this.formMessage.rePassword = '请输入验证码'
				}
				if(this.flag && formCheck){
					this.flag = false;
					uni.showLoading({title: '正在加载中...'})
					const sendData = {
						'username': this.form.phone,
						'telephone': this.form.phone,
						'authCode': this.form.authCode,
						'password': this.form.password,
						'key': this.key
					}
					register(sendData).then(res => {
						this.flag = true;
						if(res.code != 200) {
							uni.hideLoading();
							this.$api.msg(res.message)
							//this.formMessage.rePassword = '网络异常，发送失败'
							return;
						} else {
							uni.hideLoading();
							this.hTapGoRegister();
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss">
.login_container {
  line-height: 1;
}
.login-welcome-title {
  font-family: PingFang-SC-Medium;
  font-size: 48rpx;
  font-weight: bold;
  font-stretch: normal;
  line-height: 43rpx;
  letter-spacing: 1rpx;
  color: #313131;
}
.container {
  padding: 0 60rpx;
  .login-welcome-title {
    margin: 250rpx 0 22rpx;
  }
  .login-welcome-desc {
    font-family: PingFang-SC-Medium;
    font-size: 24rpx;
    letter-spacing: 1rpx;
    color: #999999;
  }
  .form {
    margin-top: 95rpx;
    .item {
      display: block;
      &:last-child {
        margin-top: 55rpx;
      }
    }
    .label {
      font-family: PingFang-SC-Medium;
      font-size: 36rpx;
      color: #313131;
    }
    .input_container {
      position: relative;
      display: block;
      margin-top: 15rpx;
      border-bottom: 1rpx solid #e5e5e5;
	  .input-wrap {
		 position: relative;
	  }
	  .input_tip{
	  	line-height: 1;
	  	font-size: 36rpx;
	  	color: #f56c6c;
	    height:50rpx;
	  }
      .input {
        display: block;
        height: 77rpx;
        width: 100%;
        line-height: 77rpx;
        border: 0;
        outline: 0;
        margin: 0;
        padding: 0;
      }
      .placeholder {
        line-height: 77rpx;
        font-family: PingFang-SC-Medium;
        font-size: 28rpx;
        color: #bbbbbb;
      }
    }
  }
  .button_box {
    padding-top: 117rpx;
    position: relative;
    .forget_password {
      position: absolute;
      right: 0;
      top: 0;
      font-family: PingFang-SC-Medium;
      font-size: 24rpx;
      line-height: 43rpx;
      padding: 35rpx 0 0 30rpx;
      color: #db2929;
    }
    .button {
      height: 91rpx;
      line-height: 91rpx;
      background-color: #db2929;
      border-radius: 45rpx;
      opacity: 0.2;
      font-family: PingFang-SC-Medium;
      font-size: 36rpx;
      color: #ffffff;
      text-align: center;
    }
    .active {
      opacity: 1;
    }
  }
}
.goRegister {
	margin-top: 183rpx;
	text-align: center;
	font-family: PingFang-SC-Medium;
	font-size: 24rpx;
	height: 60rpx;
	line-height: 60rpx;
	color: #bbbbbb;
	.registerBTN {
		height: 60rpx;
		padding-left: 15rpx;
		display: inline-block;
		color: #db2929;
	}
}
      .code_box {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0rpx;

        // 获取验证码
        .getCode {
          width: 146rpx;
          height: 48rpx;
          border-radius: 24rpx;
          border: solid 1rpx #db2929;
          font-family: PingFang-SC-Medium;
          font-size: 22rpx;
          line-height: 46rpx;
          color: #db2929;
          text-align: center;
          box-sizing: border-box;
        }
        // 倒计时
        .stayCode {
          width: 132rpx;
          height: 48rpx;
          border-radius: 24rpx;
          border: solid 1rpx #bbbbbb;
          font-family: PingFang-SC-Medium;
          font-size: 22rpx;
          line-height: 46rpx;
          color: #bbbbbb;
          text-align: center;
        }
      }
</style>
