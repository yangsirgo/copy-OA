/**
 * Created by Ling on 2014/11/13.
 */
define(function(require,exports) {
    var act_common = require("./common");
    var i8ui = require("default/javascripts/common/i8ui.js");
    if (typeof JSON == 'undefined')
        require('../json2.js');
    //提交
    function submitData(accountID,baseinfoID,xml) {
        var JsonAct = JSON.stringify(act_common.wf_ProcActityArray);
        var JsonLine = JSON.stringify(act_common.wf_ArrayLineArray);
        //提交数据
        var sendData = {BaseInfoID:parent.js_wf_BaseInfoID,Act:encodeURIComponent(JsonAct),Line:encodeURIComponent(JsonLine),xml:encodeURIComponent(xml)};
        $("#btn_save").unbind("click");
        if (parent.js_wf_Status == "edit") {//修改操作
            $.post(i8_session.ajaxWfHost+ 'webajax/design/activity/editactitydesign',sendData,function(json){
                var message = "";
                if (json.Result) {
                    var resultData = json.ReturnObject;
                    message = "保存成功！";
                    parent.js_wf_BaseInfoID = resultData.Item1; //新的BaseinfoID
                    parent.diagramMetaData = resultData.Item2; //xml
                    parent.location.hash=parent.js_wf_BaseInfoID;
                }
                else
                    message = "流程保存失败！";
                //返回
                i8ui.alert({title:message,noMask:false,cbk:function (){
                    //重绘设计器信息
                    var dev=require("../../design/dev");
                    dev.Load_ActDesigner();
                    window.parent.desginBox.close();
                },type:2});
            },'json');
        }
        else {//新增操作
            $.post(i8_session.ajaxWfHost+ 'webajax/design/activity/addactitydesign',sendData,function(json){
                var message = "";
                if (!json.Result)
                    message = "流程创建失败！";
                else {
                    var resultData = json.ReturnObject;
                    message = "保存成功！"
                     parent.js_wf_Status = "edit";
                    parent.diagramMetaData = resultData;
                    $("#js_edit_designer", window.parent.document).html("编辑");
                }
                //返回
                i8ui.alert({title:message,noMask:false,cbk:function () {
                    //重绘设计器信息
                    var dev=require("../../design/dev");
                    dev.Load_ActDesigner();
                    window.parent.desginBox.close();
                },type:2});
            },'json');
        }
    }
    exports.submitData = submitData;//提交
});