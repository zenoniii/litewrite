var Backbone = require('backbone')

var Router = Backbone.Router.extend({
  initialize: function (options) {
    this.litewrite = options.litewrite
  },

  routes: {
    // use ! for urls to not conflict with remotestorage's #access_token parameter
    '!:url': 'open',
    '*404': 'openFirst'
  },

  openFirst: function () {
    this.litewrite.open()
  },

  open: function (url) {
    var match = url.match(/^\((.+?)\)/)
    if (!match) return this.openFirst()
    var id = match[1]
    if (!id) return this.openFirst()
    this.litewrite.open(id)
  }

})

module.exports = Router
