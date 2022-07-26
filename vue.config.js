const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 隐藏打包后F12可以看到源代码
  productionSourceMap: false,
  devServer: {
    // 项目启动端口之后会变成3000
    // port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/', // 目标接口域名
        secure: false, // false为http访问，true为https访问
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': ''
        }
      },
      '/activiti': {
        target: 'http://localhost:8083/', // 目标接口域名
        secure: false, // false为http访问，true为https访问
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/activiti': ''
        }
      }
    }
  }
})
