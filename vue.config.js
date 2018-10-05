const path = require('path')

const publicCopyIgnore = ['db.sql', '.DS_Store']
const publicDir = path.resolve(__dirname, './api')
const outputDir = path.resolve(__dirname, './dist/api')

module.exports = {
  chainWebpack: config => {
    config.plugin('copy')
      .use(require('copy-webpack-plugin'), [
        [{
          from: publicDir,
          to: outputDir,
          toType: 'dir',
          ignore: publicCopyIgnore
        }]
      ])
  }
}
