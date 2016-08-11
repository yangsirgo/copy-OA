/**
 * Created by Ling on 2014/11/13.
 * 串签环节JS  按指定角色
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("../common");
    var i8selector = require("default/javascripts/plugins/i8selector/fw_selector");
    //添加专项角色
    $("#a_roleAddSimple").live("click", function () {
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
        i8ui.confirm({title:_scontent,btnDom: $('#a_roleAddSimple'),cname:''},function(divDom){
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
    //提交方法
    $("#btn_SequenceRoleSubmitSimple").live("click",function(){
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
        var roleExpression = 2;//默认为专项角色
        var approver = $("#ddl_Role").val();
        //封装数据
        act_common.wf_addActity(wf_graph.getSelectionCell().id, txt_sequenceTitle.val(), 1, 0, approver, roleExpression, "");
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
        act_common.wf_bindRole(2, $("#ddl_Role")); //绑定子级角色
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ProcActity = act_common.wf_ProcActityArray;
            $("#ddl_Role").val(wf_ProcActity[listOrderNum].Approver);
        }
    }
    exports.giveAct = giveAct;//赋值方法
});