const { defineConfig } = require("@vue/cli-service");
// 引入webpack-aliyun-oss
const WebpackAliyunOss = require("webpack-aliyun-oss-plugin");
const OssConfig = require("./oss.config");

const baseConfig = {
  lintOnSave: false, //关闭ESlint校验
  transpileDependencies: true,
};

const prodConfig = {
  outputDir: "dist", // 输出文件目录
  assetsDir: "static", // 配置js、css静态资源二级目录的位置
  publicPath: "https://aat-admin.oss-cn-shenzhen.aliyuncs.com/",
  configureWebpack: (config) => {
    let extraPlugins = [];
    const webpackAliyunOssPlugin = new WebpackAliyunOss({
      from: "./dist/**", // 上传哪个文件或文件夹  可以是字符串或数组
      dist: "", // 上传到oss哪个目录下，默认为oss根目录。可作为路径前缀使用。
      region: OssConfig.region,
      ak: OssConfig.accessKeyId,
      sk: OssConfig.accessKeySecret,
      bucket: OssConfig.bucket,
      // putACL: 'public-read', // **webpack-ali-oss-upload 新增参数 设置oss上传文件读写权限**
      // test: true, //测试看上传路径是否正确, 打开后只会显示上传路径
      setOssPath: (filePath) => {
        // some operations to filePath
        let index = filePath.lastIndexOf("dist");
        let Path = filePath.substring(index + 4, filePath.length);
        return Path.replace(/\\/g, "/");
      },
      setHeaders: (filePath) => {
        // some operations to filePath
        // return false to use default header
        return {
          "Cache-Control": "max-age=31536000",
        };
      },
    });
    extraPlugins.push(webpackAliyunOssPlugin);
    config.plugins = [...config.plugins, ...extraPlugins];
  },
};

const ENV = process.env.NODE_ENV;
config = {};
if (ENV == "production") {
  config = { ...baseConfig, ...prodConfig };
} else {
  config = { ...baseConfig };
}

module.exports = defineConfig(config);
