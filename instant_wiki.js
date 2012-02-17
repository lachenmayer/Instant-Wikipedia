// TODO: http://en.wikipedia.org/wiki/Glacis (has small...)
// TODO: http://en.wikipedia.org/wiki/Snow (infobox)
// TODO: don't show on Wikimedia links
// TODO: off screen


$(document).ready(function() {
  $("#bodyContent").append("<div id=instantwiki></div>");
  var $instantWiki = $("#instantwiki");

  var cacheContent = function(e) {
    var content = $instantWiki.html();
    if (content != "") {
      localStorage[e.currentTarget.href] = content;
    }
  }

  var loadContent = function(e) {
    var cached = localStorage[e.currentTarget.href];
    if (cached != undefined && cached != "") {
      $instantWiki.html(cached);
    } else {
      // we need to check for info-boxes, as there could be 
      // <p>'s embedded in them -- we could use the ">" (direct child)
      // CSS selector, but that has proven to be unreliable
      $("<div>").load(e.currentTarget.href + "#bodyContent .infobox",
      function() {
        var selector = "#bodyContent ";
        var firstP = "p:first:not(:has(#coordinates))";

        if ($(this).children().length) {
          selector += ".infobox ~ " + firstP;
        } else {
          selector += firstP;
        }

        $instantWiki.load(e.currentTarget.href + selector, cacheContent(e))
      });
    }
  }

  var show = function(e) {
    loadContent(e);
    console.log($("#instantwiki"));
    console.log($instantWiki);
    $instantWiki.stop(true, true)
               .fadeIn()
               .css({
                 "top": e.clientY + 20,
                 "left": e.clientX
               });
    console.log("in");
  }

  var hide = function() {
    console.log("out");
    $instantWiki.stop(true, true)
               .fadeOut(function() {
                 $(this).empty().hide();
               });
  }

  $("#bodyContent a[href^='/wiki/']").removeAttr("title") // remove tooltip
                                     .hover(show, hide);
  $(document).scroll(hide);
});

