define(function(require,exports) {
    var getHashJson=function(hash){
        hash=hash||window.location.hash;
        var hashjson={}
        if(hash.length>0){
            hash=hash.substring(1);
            var hasharr=hash.split('&');
            if(hasharr.length>0){
                for(var i= 0,len=hasharr.length;i<len;i++){
                    var temparr=hasharr[i].split('=');
                    if(temparr.length==2){
                        hashjson[temparr[0]]=temparr[1];
                    }
                }
            }
        }
        return hashjson;
    }
    exports.getHashJson=getHashJson;
});