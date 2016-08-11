/**
 * Created by Ling on 2014/11/13.
 * 串签环节JS   按汇报关系
 */
define(function(require,exports) {
    var i8ui = require("../../common/i8ui");
    var act_common = require("./common");
    //标签切换
    $(".app_SequenceReport_Menu input[type='radio']").live("click", function () {
        var showid = $(this).val();
        $("div.app_SequenceReport_List").hide();
        $("#" + showid).show();
        switch (showid.toString()) {
            case "rd_Report"://汇报关系
                $("#rd_Report #ddl_SequenceReportRole").get(0).selectedIndex = 0;
                act_common.wf_bindRole($("#rd_Report #ddl_SequenceReportRole").val(), $("#rd_Report #ddl_SequenceReportRoleNodes"), 1); //绑定子级角色
                $("#rd_Report #dll_SequenceReportLevelBegin").get(0).selectedIndex = 0;
                $("#rd_Report #dll_SequenceReportLevelEnd").get(0).selectedIndex = 0;
                break;
            case "rd_Role"://职级
                $("#rd_Role #ddl_SequenceReportRole").get(0).selectedIndex = 0;
                act_common.wf_bindRole($("#rd_Role #ddl_SequenceReportRole").val(), $("#rd_Role #ddl_SequenceReportRoleNodes"), 1); //绑定子级角色
                //绑定审批到的角色
                act_common.wf_bindRole(1, $("#rd_Role #dll_SequenceReportLevelBegin"), 1);
                $("#rd_Role #dll_SequenceReportLevelBegin").get(0).selectedIndex = 0;
                act_common.wf_bindRole(1, $("#rd_Role #dll_SequenceReportLevelEnd"), 1);
                $("#rd_Role #dll_SequenceReportLevelEnd").get(0).selectedIndex = 0;
                break;
            case "rd_Group"://汇报关系和职级组合
                $("#rd_Group #ddl_SequenceReportRole").get(0).selectedIndex = 0;
                act_common.wf_bindRole($("#rd_Group #ddl_SequenceReportRole").val(), $("#rd_Group #ddl_SequenceReportRoleNodes"), 1); //绑定子级角色
                //绑定审批到的角色
                $("#rd_Group #dll_SequenceReportLevelBegin").get(0).selectedIndex = 0;
                act_common.wf_bindRole(1, $("#rd_Group #dll_SequenceReportLevelEnd"), 1);
                $("#rd_Group #dll_SequenceReportLevelEnd").get(0).selectedIndex = 0;
                break;
        }
    });
    //角色级联事件
    $("#ddl_SequenceReportRole").live("change",function(){
        var type = $(this).attr("type");
        //填充内容
        act_common.wf_bindRole($("#" + type + " #ddl_SequenceReportRole").val(), $("#" + type + " #ddl_SequenceReportRoleNodes"), 1);
    })
    $("#txt_todotime").live("blur",function() {
        if(!/^\+?(0|[1-9][0-9]*)$/g.test($(this).val()))
            $(this).val(0);
        else
            $("#cb_todotime").attr("checked","checked");
    })
    $("#txt_skiptime").live("blur",function() {
        if(!/^\+?(0|[1-9][0-9]*)$/g.test($(this).val()))
            $(this).val(0);
        else
            $("#cb_skiptime").attr("checked","checked");
    })
    //提交方法
    $("#btn_SequenceReportSubmit").live("click",function(){
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
        if ($("#rd_Group #ddl_SequenceReportRoleNodes").get(0).selectedIndex == 0 || ($("#rd_Group #dll_SequenceReportLevelBegin").get(0).selectedIndex == 0 && $("#rd_Group #dll_SequenceReportLevelEnd").get(0).selectedIndex == 0)) {
            i8ui.alert({title:"请配置完整环节信息!"});
            return false;
        }
        var todoTime = 0;//到期提醒时间
        if($("#cb_todotime").attr("checked") == "checked")
            todoTime = $("#txt_todotime").val();
	    var skipTime = 0;//到期提醒时间
        if($("#cb_skiptime").attr("checked") == "checked")
            skipTime = $("#txt_skiptime").val();
        var IsErrorCompatible = false;//审批容错
        if($("#cb_errorCompatible").attr("checked") == "checked")
            IsErrorCompatible = true;
        //封装数据
        var roleExpression = $("#rd_Group #ddl_SequenceReportRole").val();
        var approver = $("#rd_Group #ddl_SequenceReportRoleNodes").val() + "|";
        approver += $("#rd_Group #dll_SequenceReportLevelBegin").val() + "|" + $("#rd_Group #dll_SequenceReportLevelEnd").val();
        act_common.wf_addActity(wf_graph.getSelectionCell().id, txt_sequenceTitle.val(), 1, 0, approver, roleExpression, "",todoTime,skipTime,IsErrorCompatible);
        var cell = wf_graph.getSelectionCell(); //获取当前的cell
        cell.setAttribute("value", $.trim(txt_sequenceTitle.val())); //赋值
        wf_graph.refresh(); //刷新图形显示更新
        //wf_wnd.setVisible(false); //隐藏窗口
        //关闭层
        $(this).parents("div[class='ct-ly']").next().remove();
        $(this).parents("div[class='ct-ly']").remove();
    })
    //赋值方法
    function giveAct(listOrderNum) {
        $("#rd_Group #dll_SequenceReportLevelBegin").get(0).selectedIndex = 0;
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ProcActity = act_common.wf_ProcActityArray;
            var ApproverRoleType = wf_ProcActity[listOrderNum].RoleExpression;
            var Approver = wf_ProcActity[listOrderNum].Approver;
            $("#rd_Report").hide();
            $("#rd_Group").show();
            $("#rd_Role").hide();
            //赋值
            $("#rd_Group #ddl_SequenceReportRole").val(ApproverRoleType);
            act_common.wf_bindRole(ApproverRoleType, $("#rd_Group #ddl_SequenceReportRoleNodes"), 1); //绑定子级角色
            $("#rd_Group #dll_SequenceReportLevelBegin").get(0).selectedIndex = 0;
            act_common.wf_bindRole(1, $("#rd_Group #dll_SequenceReportLevelEnd"), 1);
            $("#rd_Group #dll_SequenceReportLevelEnd").get(0).selectedIndex = 0;

            $("#rd_Group #ddl_SequenceReportRoleNodes").val(Approver.split('|')[0]); //给定选定值
            $("#rd_Group #dll_SequenceReportLevelBegin").val(Approver.split('|')[1]);
            $("#rd_Group #dll_SequenceReportLevelEnd").val(Approver.split('|')[2]);
            //到期催办
            var todoTime = wf_ProcActity[listOrderNum].ToDoTime;
            if(todoTime >0) {
                $("#cb_todotime").attr("checked","checked");
                $("#txt_todotime").val(todoTime);
            }
	        //审批跳过
            var skipTime = wf_ProcActity[listOrderNum].SkipTime;
            if(skipTime >0) {
                $("#cb_skiptime").attr("checked","checked");
                $("#txt_skiptime").val(skipTime);
            }
            //审批容错
            var config = wf_ProcActity[listOrderNum].Config;
            if(config != null) {
                for(var key in config){
                    if(key == "EmptyLevelCancel" && config[key])
                        $("#cb_errorCompatible").attr("checked","checked");
                }
            }
        }
        else {
            $("#rd_Group #ddl_SequenceReportRole").val(3);//默认为流程角色
            act_common.wf_bindRole($("#rd_Group #ddl_SequenceReportRole").val(), $("#rd_Group #ddl_SequenceReportRoleNodes"), 1); //绑定子级角色
            $("#rd_Group #ddl_SequenceReportRoleNodes").val("SysOriginatorID");//默认为发起人

            act_common.wf_bindRole(1, $("#rd_Group #dll_SequenceReportLevelEnd"), 1);
            $("#rd_Group #dll_SequenceReportLevelEnd").get(0).selectedIndex = 0;
        }
    }
    exports.giveAct = giveAct;//赋值
});