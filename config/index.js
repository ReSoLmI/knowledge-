// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
const IP = `172.19.40.11`;
// const IP = `192.168.10.54`;
// const IP = `172.19.20.83`;



module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/knowledge-service': {
        // target: `http://${IP}:8080/auth/knowledge2fd/knowledge2.0fd/`,
        // target: `http://${IP}:8080/auth/knowledge2.0-service/knowledge2.0/`,
        target: `http://${IP}:8080/knowledge/`,
        // target: 'http://192.168.10.41:8321/knowledge/',
        changeOrigin: true,
        pathRewrite: {
          '^/knowledge-service': ''
        }
      },
      '/questionnaire-service': {
        /*target: 'http://192.168.10.180:8080/auth/knowledge-service/knowledge/',*/
        target: `http://${IP}:8080/auth/questionnaire-service/questionnaire/`,
        //target: 'http://192.168.10.54:8080/auth/knowledge-service/knowledge/',
        //target: 'http://192.168.10.41:8321/knowledge/',
        pathRewrite: {
          '^/questionnaire-service': ''
        }
      },
      '/catalogue-service': {
        //target: 'http://192.168.10.41:8320/catalogue/',
        //target: 'http://192.168.10.180:8320/catalogue/',
        target: `http://${IP}:8080/auth/catalogue-service/catalogue/`,
        pathRewrite: {
          '^/catalogue-service': ''
        }
      },
      '/user-service': {
        //target: 'http://192.168.10.41:8320/catalogue/',
        //target: 'http://192.168.10.180:8320/catalogue/',
        target: `http://${IP}:8080/auth/`,
        pathRewrite: {
          '^/user-service': ''
        }
      },
      '/upload-service': {
        target: `http://${IP}:8031/base`,
        pathRewrite: {
          '^/upload-service': ''
        }
      },
      '/enr': {
        //target: 'http://192.168.10.180:8322/enr/',
        target: `http://${IP}:8080/auth/enr2.0-service/enr2.0/`,
        pathRewrite: {
          '^/enr': ''
        }
      },
      '/sys-service': {
        target: `http://${IP}:8080/auth/sys-service/sys`,
        //target: 'http://192.168.10.54:8080/auth/knowledge-service/knowledge/',
        pathRewrite: {
          '^/sys-service': ''
        }
      },
      '/system-setting-service/': {
        target: `http://${IP}:8080/auth/system-setting-service/system-setting/`,
        pathRewrite: {
          '^/system-setting-service': ''
        }
      }
    },
    cssSourceMap: false
  }
}
