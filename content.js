//Add Listener
chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse){
        if (request.message==="clicked_browser_action"){
            window.scroll(0,0);
            chrome.runtime.sendMessage({"message":"take_screenshot"});

        }
    }
);

