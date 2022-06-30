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
