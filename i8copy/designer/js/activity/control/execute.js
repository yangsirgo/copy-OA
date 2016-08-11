/**
 * Created by Ling on 2014/11/13.
 * 执行环节JS
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("./common");

    //角色级联事件
    $("#table_execute tr select:even").live("change",function(){
        //绑定角色
        act_common.wf_bindRole($(this).val(), $(this).next());
    })
    $("#txt_todotime").live("blur",function() {
        if(!/^\+?(0|[1-9][0-9]*)$/g.test($(this).val()))
            $(this).val(0);
        else
            $("#cb_todotime").attr("checked","checked");
    })
    //$("#txt_skiptime").live("blur",function() {
        //if(!/^\+?(0|[1-9][0-9]*)$/g.test($(this).val()))
            //$(this).val(0);
        //else
            //$("#cb_skiptime").attr("checked","checked");
    //})
    //提交方法
    $("#txt_ExecutionSubmit").live("click",function(){
        var txt_ExecutionTitle = $("#txt_ExecutionTitle"); //判断节点名称是否为空
        var _txt_ExecutionTitleValue = $.trim(txt_ExecutionTitle.val() || '');
        if (_txt_ExecutionTitleValue.length == 0) {
            i8ui.alert({title:"环节说明不能为空!"});
            return false;
        }
        white_list.lastIndex = 0;
        if (!white_list.test(_txt_ExecutionTitleValue)) {
            i8ui.alert({title:"环节说明只能为中英文字符和数字!"});
            return false;
        }
        var ApproverType = $(".wf_show_table tr[selectType='role'] select:first").val();
        var Approver = "";
        if ($(".wf_show_table tr[selectType='role'] select:last").find("option:selected").index() == 0) {
            i8ui.alert({title:"请选择一个执行人!"});
            return false;
        }
        Approver = $(".wf_show_table tr[selectType='role'] select:last").val(); //赋值
        var _txt_executionContent = $.trim($("#txt_ExecutionContent").val() || '');
        if (_txt_executionContent.length == 0 || _txt_executionContent == "请告知执行者需要执行什么操作，例如：”请盖章“") {
            i8ui.alert({title:"执行备注不能为空!"});
            return false;
        }
        if (_txt_executionContent.length > 100) {
            i8ui.alert({title:"执行备注超过100个字符的最大限制!"});
            return false;
        }
        var todoTime = 0;//到期提醒时间
        if($("#cb_todotime").attr("checked") == "checked")
            todoTime = $("#txt_todotime").val();
        var skipTime = 0;//到期提醒时间
        //封装数据
        act_common.wf_addActity(wf_graph.getSelectionCell().id, $.trim(txt_ExecutionTitle.val()), 4, 0, Approver, ApproverType, $("#txt_ExecutionContent").val(),todoTime,skipTime);
        var cell = wf_graph.getSelectionCell(); //获取当前的cell
        cell.setAttribute("value", $.trim(txt_ExecutionTitle.val())); //赋值
        wf_graph.refresh(); //刷新图形显示更新
        //关闭层
        $(this).parents("div[class='ct-ly']").next().remove();
        $(this).parents("div[class='ct-ly']").remove();
    });
    //赋值方法
    function giveAct(listOrderNum){
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ProcActity = act_common.wf_ProcActityArray;
            var ApproverRoleType = wf_ProcActity[listOrderNum].RoleExpression;
            var Approver = wf_ProcActity[listOrderNum].Approver;
            $("#txt_ExecutionContent").val(wf_ProcActity[listOrderNum].ApproverDesc);
            //赋值
            $(".wf_show_table tr[selectType='role'] select:first").val(ApproverRoleType);
            act_common.wf_bindRole(ApproverRoleType, $(".wf_show_table tr[selectType='role'] select:last")); //绑定子级角色
            $(".wf_show_table tr[selectType='role'] select:last").val(Approver); //给定选定值
            //到期催办
            var todoTime = wf_ProcActity[listOrderNum].ToDoTime;
            if(todoTime >0) {
                $("#cb_todotime").attr("checked","checked");
                $("#txt_todotime").val(todoTime);
            }
            //审批跳过
            //var skipTime = wf_ProcActity[listOrderNum].SkipTime;
            //if(skipTime >0) {
                //$("#cb_skiptime").attr("checked","checked");
                //$("#txt_skiptime").val(skipTime);
            //}
        }
        else {
            $(".wf_show_table tr[selectType='role'] select:first").get(0).selectedIndex = 0;
            $("#txt_ExecutionContent").css("color","#999999");
            $("#txt_ExecutionContent").val("请告知执行者需要执行什么操作，例如：”请盖章“");
            act_common.wf_bindRole($(".wf_show_table tr[selectType='role'] select:first").val(),$(".wf_show_table tr[selectType='role'] select:last")); //绑定子级角色
        }
    }
    $("#txt_ExecutionContent").live("focus",function(){
        if($(this).val() == "请告知执行者需要执行什么操作，例如：”请盖章“") {
            $("#txt_ExecutionContent").css("color","");
            $(this).val("");
        }
    })
    $("#txt_ExecutionContent").live("blur",function(){
        if($.trim($(this).val()) == "") {
            $("#txt_ExecutionContent").css("color","#999999");
            $(this).val("请告知执行者需要执行什么操作，例如：”请盖章“");
        }
    })
    exports.giveAct = giveAct;//赋值方法
});