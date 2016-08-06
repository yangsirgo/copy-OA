/**
 * Created by ryf on 2016/8/4.
 */
/**
 * Created by kusion on 2014/11/27.
 */
define(function(require,exports){
    window['mainSourceList']=[];
    window['sourceLib']={};
    exports.getMainSource=function(callback){
        if(window['mainSourceList'].length==0){
            //$.get('../json/getdatasourcelist.json', {},function (response) {
                if (true) {
                    window["mainSourceList"] = [
                        {
                            "Name": "人员职级[系统]",
                            "Status": 1,
                            "SortIndex": 0,
                            "Type": 2,
                            "Items": null,
                            "ProcCount": 0,
                            "ID": "713e0725-6c2b-43e1-845f-db4a653ddba6",
                            "LastUpdateTime": "2016-08-01 10:19:17",
                            "CreateTime": "2016-08-01 10:19:17",
                            "AccountID": "3a1b83cb-cca7-41c1-852c-e5fceb78df4e"
                        },
                        {
                            "Name": "交通工具",
                            "Status": 1,
                            "SortIndex": 0,
                            "Type": 0,
                            "Items": null,
                            "ProcCount": 0,
                            "ID": "56b40745-e75b-4462-9e4f-fdf1cccffabf",
                            "LastUpdateTime": "2016-08-01 10:19:14",
                            "CreateTime": "2016-08-01 10:19:14",
                            "AccountID": "3a1b83cb-cca7-41c1-852c-e5fceb78df4e"
                        }
                    ];
                    callback(window["mainSourceList"]);
                }
            //}, "json");
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