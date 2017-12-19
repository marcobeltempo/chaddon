// content.js
chrome.runtime.onMessage.addListener(
    function getUrl (request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var firstHref = $("a[href^='http']").eq(0).attr("href");
  
        console.log('The URL is: ', firstHref);
        sendRespone= firstHref;
      }
    }
  );