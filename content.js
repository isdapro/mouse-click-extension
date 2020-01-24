//Add Listener
chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse){
        if (request.message==="clicked_browser_action"){
            window.scroll(0,0);
            function printMousePos(event) {
                console.log(event.clientX);
                console.log(event.clientY);
              }
              
            document.addEventListener("click", printMousePos);
            chrome.runtime.sendMessage({"message":"take_screenshot"});

        }
        else if (request.message==="base_click"){
            let ev = document.createEvent("MouseEvents");
            let ev2 = document.createEvent("MouseEvents");
            let x = request.x;
            let y = request.y;
            ev.initMouseEvent("click",true,true,window,0,0,0,x,y,false,false,false,false,0,null);
            ev2.initMouseEvent("click",true,true,window,0,0,0,748,547,false,false,false,false,0,null);
            document.elementFromPoint(x,y).dispatchEvent(ev);
            document.activeElement.dispatchEvent(ev2)
            console.log("CLICKED");
            //setTimeout(function(){
               // document.activeElement.dispatchEvent(ev2)},
               // 500);
            sendResponse({complete:true});
            return true;
           // 
        }
    }
);

