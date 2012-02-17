// TODO: http://en.wikipedia.org/wiki/Glacis (has small...)
// TODO: http://en.wikipedia.org/wiki/Snow (infobox)
// TODO: don't show on Wikimedia links
// TODO: off screen

var visible = false;

var cacheContent = function(e) {
  var content = $("#instantwiki").html();
  if (content != "") {
    localStorage[e.currentTarget.href] = content;
  }
}

var show = function(e) {
  var instantWiki = $("#instantwiki");
  var cached = localStorage[e.currentTarget.href];
  if (cached != undefined && cached != "") {
    instantWiki.html(cached);
    console.log("cached");
  } else {
    // we need to check for info-boxes, as there could be 
    // <p>'s embedded in them -- we could use the ">" (direct child)
    // CSS selector, but that has proven to be unreliable
    $("<div>").load(e.currentTarget.href + "#bodyContent .infobox",
    function() {
      var selector = "#bodyContent ";
      var firstP = "p:first:not(:has(small))";

      if ($(this).children().length) {
        selector += ".infobox ~ " + firstP;
      } else {
        selector += firstP;
      }

      instantWiki.load(e.currentTarget.href + selector, cacheContent(e))
    });
  }
  instantWiki.fadeIn()
             .css({
               "top": e.clientY + 20,
               "left": e.clientX
             });
  visible = true;
  console.log("in");
}

var hide = function() {
  if (visible) {
    $("#instantwiki").fadeOut(function() {
      $(this).empty();
    });
    console.log("out");
    visible = false;
  }
}

$(document).ready(function() {
  $("#bodyContent").append("<div id=instantwiki></div>");
  $("#bodyContent a[href^='/wiki/']").removeAttr("title") // remove tooltip
                                     .hover(show, hide);
  $(document).scroll(hide);
});

