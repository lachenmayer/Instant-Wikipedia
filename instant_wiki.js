$(document).ready(function(){

  var showInstantWiki = function(e, selector) {
    $("#instantwiki").load(e.currentTarget.href + selector)
                     .fadeIn()
                     .css({
                        "top": e.clientY + 20,
                        "left": e.clientX
                     });
  }

  var mouseIn = function(e) {
    // we need to check for info-boxes, as there could be 
    // <p>'s embedded in them -- we could use the ">" (direct child)
    // CSS selector, but that has proven to be unreliable
    $("<div>").load(e.currentTarget.href + "#bodyContent .infobox",
    function() {

      // handles nasty stuff like the little co-ordinates shown in
      // the top-right corner of the page (e.g. /wiki/NASA)
      var firstP = "p:first:not(:has(small))";

      if ($(this).children().length) {
        showInstantWiki(e, "#bodyContent .infobox ~ " + firstP);
      } else {
        showInstantWiki(e, "#bodyContent " + firstP);
      }
    });
    console.log("in");
  }

  var mouseOut = function() {
    $("#instantwiki").fadeOut(function() {
      $(this).empty();
    });
    console.log("out");
  }

  $("#bodyContent").append("<div id=instantwiki></div>");

  $("#bodyContent a[href^='/wiki/']").removeAttr("title")
                                     .hover(mouseIn, mouseOut);

});
