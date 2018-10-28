
(function(){

var selfScript = document.scripts[document.scripts.length - 1];
var href = window.location.href;

var logElem;
var logElemClassName = selfScript.getAttribute('data-class') || 'm-log';
var showlog = getBoolValue(selfScript.getAttribute('data-showlog'));
var match = href.match(/[?|&]showlog=([^&]+)/i);
if(match) showlog = getBoolValue(match[1]);

function getBoolValue(str){
    if(!str) return false;
    return str.toLowerCase() === 'true' || Number(str) === 1;
}

/**
 * 重写console.log方法，便于在移动端查看log日志。
 */
var console = window.console || {};
var oldLog = console.log;
var slice = [].slice;

console.log = function(){
    var args = slice.call(arguments);
    oldLog && oldLog.apply(console, args);
    if(!showlog) return;

    var msg = '';
    for(var i = 0, obj, len = args.length; i < len; i++){
        obj = args[i];

        if(typeof obj !== 'string' && typeof obj !== 'number'){
            try{
                obj = JSON.stringify(obj);
            }catch(e){ };
        }

        if(typeof obj === 'string'){
            obj = obj.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        if(i == 0) msg = obj;
        else msg += ' ' + obj;
    }

    var elem = logElem || (logElem = createLogElem());
    elem.innerHTML += '> ' + msg + '<br/>';
    elem.scrollTop = elem.scrollHeight - elem.clientHeight;
};

window.addEventListener('error', function(error){
    console.log(error.error.toString() + ' ' + error.filename + ' ' + error.lineno);
});

function createLogElem(){
    var elem = document.createElement('div');
    elem.className = logElemClassName;
    var css = '.' + logElemClassName + '{position:absolute;top:0;left:0;width:100%;max-height:105px;-webkit-box-sizing:border-box;box-sizing:border-box;font:12px Courier New;background-color:rgba(0,0,0,0.2);word-wrap:break-word;word-break:break-all;overflow-y:scroll;padding:5px;z-index:999999;}';
    css += '.' + logElemClassName + ':before{content:"﹀";position:fixed;top:0;right:0;height:20px;overflow:hidden;padding:8px 5px;-webkit-box-sizing:border-box;box-sizing:border-box;font:12px Arial;-webkit-transform-origin:50% 50%;}';
    css += '.' + logElemClassName + '.minimize{height:20px;}';
    css += '.' + logElemClassName + '.minimize:before{-webkit-transform:rotate(180deg);}';
    appendStyle(css);
    document.documentElement.appendChild(elem);

    //minimize
    elem.rect = elem.getBoundingClientRect();
    elem.minimize = false;
    elem.addEventListener('click', function(e){
        var x = e.pageX, y = e.pageY, rect = elem.rect;
        if(x >= rect.left + rect.width - 20 && 
           x <= rect.left + rect.width &&
           y >= rect.top && 
           y <= rect.top + 20){
            elem.minimize = !elem.minimize;
            elem.className = logElemClassName + (elem.minimize ? ' minimize' : '');
        }
    });

    return elem;
}

function appendStyle(css){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName("head")[0].appendChild(style);
    style.appendChild(document.createTextNode(css));
}

})();