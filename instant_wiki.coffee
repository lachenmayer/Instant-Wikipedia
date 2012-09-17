# Constants

PADDING = 20
SPECIAL_PAGES = [
  /\/wiki\/Category:.*/
  /\/wiki\/Wikipedia:.*/
  /\/wiki\/Wikimedia:.*/
]


# Extensions

Number.prototype.limit = (max) ->
  return Math.min this, max

# The Meat

existingBoxes = {}

class InstantWikiBox
  
  constructor: (@link) ->
    @id = @generateId()
    if existingBoxes[@id]?
      return existingBoxes[@id]
    $('#bodyContent').append('<div id=' + @id + ' class=instantwiki></div>')
    @elem = $ '#' + @id
    existingBoxes[@id] = this
  
  generateId: () ->
    cached = localStorage[@link]
    return localStorage[@link] if cached?
    name = @link.replace(/^.*\/wiki\//, '')
    validName = name.replace(/[^A-Za-z][^-A-Za-z0-9_]*/g, '')
    id = "iw-" + Math.random().toString().substring(2, 10)
    localStorage[@link] = id
    return id

  getPageSummary: () ->
    box = this
    filter = ' #mw-content-text > p:first:not(:has(#coordinates))'
    @elem.load @link + filter, () ->
      box.show box.x, box.y if box.hovering

  setPosition: () ->
    @x = @x.limit $(window).width() - @elem.width() - 2*PADDING
    if @y > $(window).height() - @elem.height() - PADDING
      @y -= @elem.height() + 2*PADDING
    else
      @y += PADDING
    @elem.css {
      "left": @x
      "top": @y
    }

  show: (@x, @y) ->
    @hovering = true
    if @elem.html().length == 0
      @getPageSummary()
      return
    @setPosition()
    @elem.stop(true, true).fadeIn()

  hide: () ->
    @hovering = false
    @elem.stop(true, true).fadeOut()


show = (e) ->
  iw = new InstantWikiBox e.currentTarget.href
  iw.show e.clientX, e.clientY

hide = (e) ->
  iw = new InstantWikiBox e.currentTarget.href
  iw.hide()

isSpecialPage = (link) ->
  href = $(link).attr('href')
  for regex in SPECIAL_PAGES
    return true if href.match(regex)?

$ ->
  $.each $("#bodyContent a[href^='/wiki']"), (i, link) ->
    if !isSpecialPage link
      $(link).removeAttr 'title'
      $(link).hover show, hide
