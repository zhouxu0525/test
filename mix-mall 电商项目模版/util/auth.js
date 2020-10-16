import { setStore, getStore, clearStore }from './storage.js'

export const TokenKey = 'Mall-Access-Token'

export function getUserInfo() {
  return getStore("Mall-UserInfo")
}
//获取token
export function getToken() {
  return getStore(TokenKey)
}
//获取token过期时间
export function getTokenExpire() {
  return getStore(TokenKey + '_expire')
}
// 本地存储 token 过期时间
export function setTokenExpire(maxAge) {
  let expire = 86400;
  //过期时间 单位 秒
   if (maxAge && !isNaN(parseInt(maxAge))) {
      expire = maxAge;
   }
  let timeout = parseInt(new Date().getTime() / 1000) + parseInt(expire)
  setStore(TokenKey+`_expire`, timeout)
}
// 本地存储 token 及过期时间
export function setToken(token, maxAge) {
  // 本地存储 token
  setStore(TokenKey, token)
  // 本地存储 token 过期时间
  setTokenExpire(maxAge);
}
//删除token及过期时间
export function removeToken() {
	clearStore(TokenKey)
	clearStore(TokenKey+`_expire`)
	return true 
}