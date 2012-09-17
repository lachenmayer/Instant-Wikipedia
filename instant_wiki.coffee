existingBoxes = {}
class InstantWikiBox
  generateId = (link) ->
    cached = localStorage[link]
    return localStorage[link] if cached?
    name = link.replace(/^.*\/wiki\//, '')
    validName = name.replace(/[^A-Za-z][^-A-Za-z0-9_]*/g, '')
    id = "iw-" + Math.random().toString().substring(2, 10)
    localStorage[link] = id
    return id

  constructor: (@link) ->
    @id = generateId @link
    if existingBoxes[@id]?
      return existingBoxes[@id]
    $('#bodyContent').append('<div id=' + @id + ' class=instantwiki></div>')
    @selector = $ '#' + @id
    existingBoxes[@id] = this

  getPageSummary: () ->
    @selector.load(@link + '#bodyContent p:first:not(:has(#coordinates))')

  show: (x, y) ->
    if @selector.html().length == 0
      @getPageSummary()
      @selector.stop(true, true)
        .fadeIn()
        .css {
          "left": x
          "top": y + 20
        }

  hide: () ->
    @selector.stop(true, true)
      .fadeOut()

show = (e) ->
  iw = new InstantWikiBox e.currentTarget.href
  iw.show e.clientX, e.clientY

hide = (e) ->
  iw = new InstantWikiBox e.currentTarget.href
  iw.hide()

$ ->
  $.each $("#bodyContent a[href^='/wiki']"), (i, link) ->
    $(link).removeAttr 'title'
    $(link).hover show, hide