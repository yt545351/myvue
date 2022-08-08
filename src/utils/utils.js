import CryptoJS from 'crypto-js/crypto-js'

export const AES_ENCRYPT = (str) => {
  const key = CryptoJS.enc.Utf8.parse('aabbccddeeffgghh') // 秘钥
  const iv = CryptoJS.enc.Utf8.parse('aabbccddeeffgghh') // 偏移量
  const encrypted = CryptoJS.AES.encrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
// 获取打包环境配置(dev/prod)
export const getConfig = config => {
  const APIObj = config.API
  for (const i in APIObj) {
    APIObj[i] = APIObj[i].alias
  }
  return Object.freeze(config)
}

// 获取本地环境配置
export const getLocalConfig = () => {
  const config = {
    ENV: 'local',
    API: {
      API: '/api/',
      ACTIVITI: '/activiti/'
    }
  }
  return Object.freeze(config)
}
