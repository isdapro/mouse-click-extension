function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

async function sendMessagePromise(tabId,item)
{
  console.log(item);
  return new Promise((resolve,reject) => {
    chrome.tabs.sendMessage(tabId, item, response => {
      if (response.complete){
        resolve();
      }
      else {
        reject('Wrong');
      }
    });

  });
}


async function clickUnfollow(dataURL)
{
  let image = dataURL;
  let blobimage = dataURLtoBlob(image);
  let formdata = new FormData();
  formdata.append('file',blobimage,'InitialCapture.png');
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST','SERVER_NAME');
  xhr.withCredentials = true;
  xhr.onload = async function () {
    if (this.status===200)
    {
      let data = this.response;
      console.log(data);
      let x = data.x;
      let y = data.y;
      let n = x.length;

      for (let i=0;i<n;i++)
      {
        console.log(x[i]);
        setTimeout(async function() {
          chrome.tabs.query({active:true, currentWindow:true}, async function(tabs){
          var activeTab = tabs[0];
          await sendMessagePromise(activeTab.id,{"message":"base_click","x":x[i],"y":y[i]});


        });
      }, 500);
        
        
      }
    }
  };
  xhr.send(formdata);
}

function clickConfirmation()
{
  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function(tabid,info) {
      if (info.status === 'complete'){
        chrome.tabs.captureVisibleTab({"format":"png"},function(dataURL) {
          let image = dataURL;
          let blobimage = dataURLtoBlob(image);
          let formdata = new FormData();
          formdata.append('file',blobimage,'ConfirmationImage.png');
          let xhr = new XMLHttpRequest();
          xhr.responseType = 'json';
          xhr.open('POST','SERVER_NAME');
          xhr.withCredentials = true;
          xhr.onload = function () {
          if (this.status === 200)
            {
              let evconfirm = document.createEvent("MouseEvents");
              evconfirm.initEvent("click",true,true);
              document.elementFromPoint(this.response["x"],this.response["y"]).dispatchEvent(evconfirm);
            }
          };
  
  
          xhr.send(formdata);
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        });
      }
    });
  })

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
              clickUnfollow(dataURL);

            });


        }
    }
);
