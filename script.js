var ev = document.createEvent("MouseEvents");
ev.initEvent("click",true,true);
document.elementFromPoint(200,200).dispatchEvent(ev);