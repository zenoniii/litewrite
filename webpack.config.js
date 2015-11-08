var webpack = require('webpack')

var config = {
  entry: [
    './src/main'
  ],
  output: {
    path: __dirname,
    filename: 'litewrite.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(xmlhttprequest|./lang)$"))
  ],
  module: {
    loaders: [
      {
        test: [/\.txt$/, /\.html$/],
        loader: 'raw'
      }
    ]
  },
  resolve: {
    alias: {
      backbone: __dirname + '/lib/backbone',
      underscore: __dirname + '/lib/underscore',
      jquery: __dirname + '/lib/jquery',
      remotestorage: __dirname + '/lib/remotestorage',
      autosize: __dirname + '/lib/jquery.autosize',
      localstorage: __dirname + '/lib/backbone.localstorage',
      'remotestorage-documents': __dirname + '/lib/remotestorage-documents',
      'rs-adapter': __dirname + '/lib/backbone.remoteStorage-documents',
      snap: __dirname + '/lib/snap',
      moment: __dirname + '/lib/moment'

    }
  },
  cssnext: {
    browsers: 'last 2 versions'
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  )
} else {
  config.devtool = 'cheap-module-eval-source-map'
  config.entry.unshift('webpack-hot-middleware/client')
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
