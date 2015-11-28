const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 8000

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.config')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true
  }))

  app.use(webpackHotMiddleware(compiler))
} else {
  app.get('/litewrite.js', function (req, res) {
    res.sendFile(path.join(__dirname, '../litewrite.js'))
  })
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../index.html'))
})
app.use('/img', express.static(path.join(__dirname, '../img')))
app.use('/style', express.static(path.join(__dirname, '../style')))

if (require.main === module) {
  app.listen(port, function (error) {
    if (error) {
      console.error(error)
    } else {
      console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
  })
}

module.exports = app
