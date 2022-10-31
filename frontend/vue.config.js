const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,   //关闭ESlint校验
  transpileDependencies: true
})
