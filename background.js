function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}



chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id,{"message":"clicked_browser_action"});

    });
});



chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse){
        if (request.message==="take_screenshot"){
            chrome.tabs.captureVisibleTab({"format":"png"},function(dataURL){
                let image = dataURL;
                let blobimage = dataURLtoBlob(image);
                console.log(image);
                let formdata = new FormData();
                formdata.append('file',blobimage,'ExtensionImage.png');
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('POST','SERVER_NAME');
                xhr.withCredentials = true;
                xhr.onload = function () {
                    if (this.status === 200)
                    {
                        let urlf = URL.createObjectURL(this.response);
                        chrome.downloads.download({
                            
                            url:urlf,
                            filename: 'just_checking.png'
                        });
                    }
                    else
                        console.error(xhr);
                };
                xhr.send(formdata);
            });
            

        }
    }
);