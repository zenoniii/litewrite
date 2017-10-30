var _ = require('underscore')
var Backbone = require('backbone')
var utils = require('../utils')
var lang = require('../translations')
var autosize = require('autosize')

var EditorView = Backbone.View.extend({
  el: '#editor',

  initialize: function (options) {
    _.bindAll(this, 'render', 'focus', 'blur', 'desktopFocus', 'handleCharEncodings', 'setCursor', 'insertTab')

    this.model.on('change:id', this.render)
    this.model.on('change:content', this.handleCharEncodings)
    this.model.on('update', this.render)

    autosize(this.$el)
    this.setPlaceholder()
    this.render()
  },

  // only re-render when content changed
  render: function () {
    var content = this.model.get('content')
    if (content === this.$el.val()) return
    this.$el.val(content || '')
    autosize.update(this.$el)
    var pos = this.model.get('cursorPos')
    if (pos) this.setCursor(pos)
  },

  focus: function () {
    if (utils.isDesktop) return this.$el.focus()
    // doesn't seem to work for textarea on iOS at all. maybe it works on other platforms.
    setTimeout(_.bind(this.$el.focus, this.$el), 500)
  },

  desktopFocus: function () {
    if (utils.isDesktop) this.focus()
  },

  blur: function () {
    this.$el.blur()
  },

  events: {
    'input': 'updateOpenDoc'
  },

  updateOpenDoc: function () {
    this.model.set({
      content: this.$el.val(),
      cursorPos: this.$el.prop('selectionStart')
    })
    this.trigger('typing')
  },

  // Set CSS class for certain languages to adjust styling.
  // For char classes see http://kourge.net/projects/regexp-unicode-block
  handleCharEncodings: function (doc) {
    var c = doc.get('content')
    var isCyrillic = !!c.match('[\u0400-\u04FF\u0500-\u052F]')
    this.$el.toggleClass('cyrillic', isCyrillic)

    // Arabic, Hebrew, Syriac & Thaana
    var isRTL = !!c.match('[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u0700-\u074F\u0780-\u07BF]')
    console.log(isRTL)
    this.$el.toggleClass('rtl', isRTL)
  },

  setPlaceholder: function () {
    this.$el.attr('placeholder', lang.emptyDoc)
  },

  setCursor: function (pos) {
    this.$el
      .prop('selectionStart', pos)
      .prop('selectionEnd', pos)
  },

  insertTab: function () {
    var pos = this.$el.prop('selectionStart')
    var v = this.$el.val()
    this.$el.val(v.substring(0, pos) + '  ' + v.substring(pos, v.length))
    this.setCursor(pos)
    this.updateOpenDoc()
  }

})

module.exports = EditorView
