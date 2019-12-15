document.addEventListener('DOMContentLoaded',function() {
    var checkButton = document.getElementById('click');
    checkButton.addEventListener('click',function(){
        chrome.tabs.executeScript({
            file:'script.js'
        });

    });
});