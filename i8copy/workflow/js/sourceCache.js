/**
 * Created by kusion on 2014/11/27.
 */
define(function(require,exports){
    window['mainSourceList']=[];
    window['sourceLib']={};
    exports.getMainSource=function(callback){
        if(window['mainSourceList'].length==0){
            $.get(i8_session.ajaxWfHost+'webajax/form/getdatasourcelist', {r:Math.random().toString()}, function (response) {
                if (response.Result) {
                    window["mainSourceList"] = response.ReturnObject;
                    callback(window["mainSourceList"]);
                }
            }, "json");
        }else{
            callback(window["mainSourceList"]);
        }
    };
    exports.setMainSource=function(newData){
        window['mainSourceList']=newData;
    };
    exports.updateMainSourceItem=function(item){
        if(_.isObject(item)){
            var exits=_.where(window["mainSourceList"],{ID:item.ID});
            if(exits.length==0){
                window["mainSourceList"].push(item);
            }
        }
    };
    exports.updateSourceByID=function(id,callback){
        $.get(i8_session.ajaxWfHost+"webajax/form/getsubnodelist?"+Math.random(),{mitemid:id},function(data){
            if(data.Result){
                window["sourceLib"][id]=data.ReturnObject.Items;//更新
                if(callback) {
                    callback({result: true, msg: 'update success!'});
                }
            }
        },"json");
    };
    exports.getSourceByID=function(id,callback){
        if(window["sourceLib"][id]){
               callback(window["sourceLib"][id]);
        }else{
            $.get(i8_session.ajaxWfHost+"webajax/form/getsubnodelist",{mitemid:id},function(data){
                if(data.Result){
                    window["sourceLib"][id]=data.ReturnObject.Items;//更新
                    callback(window["sourceLib"][id]);
                }
            },"json");
        }
    };
    exports.GetRunProcDataSourceAndLine = function(dataSourceID,callback){
        $.ajax({
            'url': i8_session.ajaxWfHost + 'webajax/design/activity/GetRunProcDataSourceAndLine',
            'data':    {'datasourceid': dataSourceID},
            'async':   true,
            'success': function (data) {
                var _retObj = data.ReturnObject;
                if (_retObj.item2) {
                   if($.isFunction(callback)){
                       callback(_retObj.item2);
                   }
                }
            }
        });
    }
    exports.setSourceByID=function(id,newData){
        window["sourceLib"][id]=newData;
    }
})