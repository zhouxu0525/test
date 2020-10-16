<template>
  <view class="forget_container">
    <!-- 版心 -->
    <view class="container">
      <view class="form">
        <view class="item">
          <view class="label">
            手机号
          </view>
          <view class="input_container">
            <input type="number"
                   class="input"
				    maxlength="11"
                   v-model="form.phone"
                   placeholder="请输入注册账号的手机号"
                   placeholder-class="placeholder"
				   @focus="hFocus('phone')"
					/>
			<!-- <view class="input_tip" v-if="formMessage.phone"> -->
			<view class="input_tip" v-if="formMessage.phone">
				{{formMessage.phone}}
			</view>
          </view>
		  <view class="input_container">
		    <input type="password"
		           class="input"
				   maxlength="13"
		           v-model="form.password"
		           placeholder="请输入新密码"
				    @focus="hFocus('password')"
		           placeholder-class="placeholder" />
			<view class="input_tip" v-if="formMessage.password" >
				{{formMessage.password}}
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
                   v-model="form.code"
                   placeholder="请输入验证码"
                   placeholder-class="placeholder" />
            <view class="code_box">
              <view 
				v-if="getCodeStatus==1"
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
        <view class="button" :class="submitBTNStatus? 'active' : '' " @tap="hTapBTN" >
          重置密码
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		computed:{
			// 控制表单提交按钮的显示状态
			submitBTNStatus() {
				const form= {...this.form}
				for(const key in form){
					if(!form[key]){return false}
				}
				return true
			}
		},
		data () {
			return {
				form:{
					phone:'',
					password:'',
					code:''
				},
				formMessage:{
					phone:'',
					password:'',
				},
				pwdType: 'password',
				// 是否免密登陆
				isWithoutCode: false,
				getCodeStatus: 1,
				stepNum: 60,
				getCodeTimer: ''
			}
		},
		methods:{
			// 获取验证码
			hTapGetCode () {
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
			},
			hFocus(type) {
				this.formMessage[type] = ''
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
					}
				}
				let formCheck = true
				for(const key in this.form){
					if(key!='code'){
						const regRes = formReg[key].reg.test(this.form[key])
						if(!regRes) {
							formCheck = false
							this.formMessage[key] = formReg[key].tip
						}
					}
				}
				if(!formCheck){return login('校验失败')}
			}
		}
	}
</script>

<style lang="scss">
.container {
  padding: 0 60rpx;
  .login-welcome-title {
    margin: 93rpx 0 22rpx;
  }
  .login-welcome-desc {
    font-family: PingFang-SC-Medium;
    font-size: 24rpx;
    letter-spacing: 1rpx;
    color: #999999;
  }
  .form {
    margin-top: 211rpx;
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
      .icon_box {
        position: absolute;
        top: 50%;
        right: 30rpx;
        transform: translateY(-50%);
        .pwdicon {
          width: 32rpx;
          height: 32rpx;
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
</style>
