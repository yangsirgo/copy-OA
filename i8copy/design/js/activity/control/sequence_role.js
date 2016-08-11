/**
 * Created by Ling on 2014/11/13.
 * 串签环节JS  按指定角色
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("./common");
    var i8selector = require("default/javascripts/plugins/i8selector/fw_selector");
    //专项角色及流程角色选择方法
    $("#rdo_specialRole,#rdo_processRole,#rdo_RankRole").live("click",function() {
        switch ($(this).attr("id")) {
            case "rdo_specialRole": //专项角色
                $("#td_RoleDirections").html("请根据专项角色选择");
                $("#a_roleAdd").show();
                break;
            case "rdo_processRole": //流程角色
                $("#td_RoleDirections").html("请根据流程表单中的相关角色选择");
                $("#a_roleAdd").hide();
                break;
            case "rdo_RankRole": //职级角色
                $("#td_RoleDirections").html("请根据职级选择");
                $("#a_roleAdd").hide();
                break;
        }
        act_common.wf_bindRole($(this).attr("value"), $("#ddl_Role")); //绑定角色
    })
    //添加专项角色
    $("#a_roleAdd").live("click", function () {
        var _scontent = '<div style="width:260px;" id="show_addRole_dialog">' +
            '<div style="overflow: hidden;line-height:30px;">' +
            '<div class="fw_left">角色名称：</div>' +
            '<div class="fw_left" style="width: 180px;text-align: left;">' +
            '<input id="RoleName" class="app_addnew_input_name" style="width:165px;height:25px;" type="text" />' +
            '</div>' +
            '</div>' +
            '<div style="overflow: hidden;line-height:30px;">' +
            '<div class="fw_left">人　　员：</div>' +
            '<div class="fw_left" style="width: 180px;">' +
            '<input id="UserName" style="width:160px;" type="text"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var select = null;
        i8ui.confirm({title:_scontent,btnDom: $('#a_roleAdd'),cname:''},function(divDom){
            var RoleName = $.trim($("#show_addRole_dialog #RoleName").val() || '');
            if (RoleName == "") {
                i8ui.alert({title:"请输入角色名称!"});
                return false;
            }
            var UserName = select.selectedData();
            if (UserName == "") {
                i8ui.alert({title:"请选择人员!"});
                return false;
            }
            $.post(i8_session.ajaxWfHost+ 'webajax/design/activity/addspecialrole',{roleName:RoleName,UserName:UserName},function(data){
                if(data.Result&&data.Code == 0){
                    //刷新类别列表
                    act_common.wf_bindRole(2, $("#ddl_Role"),undefined,true);
                    divDom.close();
                }
                else
                    i8ui.alert({title:"已存在相同的角色!"});
            },'json');
        });
        select = i8selector.KSNSelector({ model: 1, element: "#UserName", width: "163", searchType: { "org": false, "user": true, "grp": false } });
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
    $("#btn_SequenceRoleSubmit").live("click",function(){
        var txt_sequenceTitle = $("#txt_sequenceRoleTitle");
        var _txtTitleValue = $.trim(txt_sequenceTitle.val() || '');
        if ($.trim(txt_sequenceTitle.val()) == "") {
            i8ui.alert({title:"请输入环节名称!"});
            return false;
        }
        if ($("#ddl_Role").get(0).selectedIndex == 0) {
            i8ui.alert({title:"请选择角色!"});
            return false;
        }
        white_list.lastIndex = 0;
        if (!white_list.test(_txtTitleValue)) {
            i8ui.alert({title:"环节名称中包含非法字符!"});
            return false;
        }
        //封装数据
        var roleExpression = "";
        if (document.getElementById("rdo_specialRole").checked)
            roleExpression = $("#rdo_specialRole").val();
        if (document.getElementById("rdo_processRole").checked)
            roleExpression = $("#rdo_processRole").val();
        if (document.getElementById("rdo_RankRole").checked)
            roleExpression = $("#rdo_RankRole").val();
        var approver = $("#ddl_Role").val();

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
        act_common.wf_addActity(wf_graph.getSelectionCell().id, txt_sequenceTitle.val(), 1, 0, approver, roleExpression, "",todoTime,skipTime,IsErrorCompatible);
        var cell = wf_graph.getSelectionCell(); //获取当前的cell
        cell.setAttribute("value", $.trim(txt_sequenceTitle.val())); //赋值
        wf_graph.refresh(); //刷新图形显示更新
        //wf_wnd.setVisible(false); //隐藏窗口
        //关闭层
        $(this).parents("div[class='ct-ly']").next().remove();
        $(this).parents("div[class='ct-ly']").remove();
    });
    //赋值方法
    function giveAct(listOrderNum) {
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ProcActity = act_common.wf_ProcActityArray;
            var type = wf_ProcActity[listOrderNum].RoleExpression;
            type = type * 1;
            switch (type) {
                case 2:
                    $("#rdo_specialRole").attr("checked", true);
                    $("#a_roleAdd").show();
                    $("#td_RoleDirections").html("请根据专项角色选择");
                    act_common.wf_bindRole($("#rdo_specialRole").val(), $("#ddl_Role")); //绑定子级角色
                    break;
                case 3:
                    $("#rdo_processRole").attr("checked", true);
                    $("#a_roleAdd").hide();
                    $("#td_RoleDirections").html("请根据流程角色或流程表单中相关人员选择");
                    act_common.wf_bindRole($("#rdo_processRole").val(), $("#ddl_Role")); //绑定子级角色
                    break;
                case 1:
                    $("#rdo_RankRole").attr("checked", true);
                    $("#td_RoleDirections").html("请根据职级选择");
                    $("#a_roleAdd").hide();
                    act_common.wf_bindRole($("#rdo_RankRole").val(), $("#ddl_Role")); //绑定子级角色
                    break;
            }
            $("#ddl_Role").get(0).value = wf_ProcActity[listOrderNum].Approver;
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
            $("#rdo_specialRole").attr("checked", true);
            $("#td_RoleDirections").val("请根据专项角色选择");
            act_common.wf_bindRole($("#rdo_specialRole").val(), $("#ddl_Role")); //绑定子级角色
        }
    }
    exports.giveAct = giveAct;//赋值方法
});