/**
 * Created by Ling on 2014/11/13.
 * 上级审批JS   按汇报关系
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("default/javascripts/design/activity/control/common");
    //提交方法
    $("#btn_SequenceReportSubmitSimple").live("click",function(){
        var txt_sequenceTitle = $("#txt_sequenceReportTitle");
        var _txt_sequenceTitleValue = $.trim(txt_sequenceTitle.val() || '');
        if ($.trim(txt_sequenceTitle.val()) == "") {
            i8ui.alert({title:"请输入环节名称!"});
            return false;
        }
        white_list.lastIndex = 0;
        if (!white_list.test(_txt_sequenceTitleValue)) {
            i8ui.alert({title:"环节名称中包含非法字符!"});
            return false;
        }
        if ($("#dll_SequenceReportLevelBeginSimple").get(0).selectedIndex == 0) {
            i8ui.alert({title:"请配置完整环节信息!"});
            return false;
        }
        //封装数据
        var approver = "SysOriginatorID" + "|" + $("#dll_SequenceReportLevelBeginSimple").val() + "|-1";//默认为流程发起人
        var roleExpression = 3;//流程角色
        act_common.wf_addActity(wf_graph.getSelectionCell().id, txt_sequenceTitle.val(), 1, 0, approver,roleExpression, "");
        var cell = wf_graph.getSelectionCell(); //获取当前的cell
        cell.setAttribute("value", $.trim(txt_sequenceTitle.val())); //赋值
        wf_graph.refresh(); //刷新图形显示更新
        //关闭层
        $(this).parents("div[class='ct-ly']").next().remove();
        $(this).parents("div[class='ct-ly']").remove();
    })
    //赋值方法
    function giveAct(listOrderNum) {
        $("#dll_SequenceReportLevelBeginSimple").get(0).selectedIndex = 0;
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ProcActity = act_common.wf_ProcActityArray;
            var Approver = wf_ProcActity[listOrderNum].Approver;
            //赋值
            $("#dll_SequenceReportLevelBeginSimple").val(Approver.split('|')[1]);
        }
    }
    exports.giveAct = giveAct;//赋值
});