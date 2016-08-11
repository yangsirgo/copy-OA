/**
 * Created by Ling on 2014/11/13.
 * 连接环节方法JS
 */
define(function(require,exports) {

    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("./common");
    var i8selector = require("default/javascripts/plugins/i8selector/fw_selector");
   // require('/default/javascripts/common/underscore-min-cmd');
    //删除条件
    $("#complexTable img,#simpleTable img").live("click",function(){
        if (document.getElementById("rdo_complex").checked == true) {
            var trObj = $(this).parents("#complexTable tr");
            //获取当前删除的索引
            var index = $("#complexTable tr").index(trObj);
            $(trObj).remove();
            $("#complexTable tr:gt(" + (index - 1) + ")").each(function (i) {
                $(this).find("td:eq(0)").html("条件" + (index + i) + "：");
            })
        }
        else{
            var trObj = $(this).parents("#simpleTable tr");
            $(trObj).remove();
        }
    })
    //增加条件
    $("#a_addLineCondition").live("click",function(){
        if (document.getElementById("rdo_complex").checked == true)
            addLineCondition(1);
        else
            addLineCondition(0);
    })
    //增加条件 type:0 标准版 1：多层级
    function addLineCondition(type) {
        //添加角色元素及值
        var tr = $("<tr></tr>");
        if(type == 0) {
            var td = $("<td align=\"right\"></td>");
            var select_logicOperator = $("<select></select>");
            select_logicOperator.append("<option value=\"&&\">并且</option><option value=\"||\">或者</option>");
            td.append(select_logicOperator);
            td.append("&nbsp;");
        }
        if(type == 1){
            var td = $("<td style=\"width:70px\" align=\"right\"></td>");
            td.append("条件"+ $("#complexTable tr").length+"：");
        }
        var td_content_firstVar = $("<td></td>");
        td_content_firstVar.append($("<select model=\"form\"></select>"));
        var td_content_operator = $("<td style=\"padding-left: 3px;\"></td>");
        var select_operator = $("<select style=\"width:92px;\"></select>");
        select_operator.append("<option value=\"=\" code=\"=\">等于</option>");
        select_operator.append("<option value=\"!=\" code=\"!=\">不等于</option>");
        select_operator.append("<option value=\">\" code=\">\">大于</option>");
        select_operator.append("<option value=\">=\" code=\">=\">大于等于</option>");
        select_operator.append("<option value=\"<\" code=\"<\">小于</option>");
        select_operator.append("<option value=\"<=\" code=\"<=\">小于等于</option>");
        select_operator.append("<option value=\"@*\" code=\"fn_exist\">包含</option>");
        select_operator.append("<option value=\"^*\" code=\"fn_nexist\">不包含</option>");
        td_content_operator.append(select_operator);
        var td_content_secondVar = $("<td style=\"padding-left: 3px;\"></td>");
        td_content_secondVar.append("<input type=\"text\" placeholder=\"变量匹配值\" style=\"width:158px;\"/>");
        var td_content_del = $("<td style=\"vertical-align: inherit;padding-left: 3px;\"></td>");
        td_content_del.append("<img src='"+i8_session.resWfHost+"default/images/design/graph/delete.png' />");

        tr.append(td);
        tr.append(td_content_firstVar);
        tr.append(td_content_operator);
        tr.append(td_content_secondVar);
        tr.append(td_content_del);
        if(type == 0) {
            $("#simpleTable").append(tr);
            //绑定字段
            var count = $("#simpleTable tr").length - 1;
            var thisTr = $("#simpleTable tr:eq("+count+")").find("select:eq(1)");
            act_common.wf_bindFormData($(thisTr)); //绑定表单字段
        }
        else {
            $("#complexTable").append(tr);
            //绑定字段
            var count = $("#complexTable tr").length - 1;
            var thisTr = $("#complexTable tr:eq("+count+")").find("select:eq(0)");
            act_common.wf_bindFormData($(thisTr)); //绑定表单字段
        }
    }
    //表单字段操作事件
    $(".wf_show_table_line select[model='form']").live("change",function(){
        var _this = $(this);
        var _select = _this.parent().next().find("select"); //操作符对象
        var _inputObj = _this.parent().next().next();//匹配值对象
        if (_this.val() == "SysOriginatorDept")//选择的是申请人所在部门,则后面的输入框替换成选人控件
        {
            var id = Guid.NewGuid().ToString();
            $(_inputObj).html("<input id='" + id + "' type='text'>");
            var select = i8selector.KSNSelector({ model: 2, element: "#" + id + "", width: "152", searchType: { "org": true, "user": false, "grp": false } });
        }
        else if (_this.val() == "SysOriginatorLevel")//选择的是申请人职级，则后面的输入框替换成下拉列表
        {
            $(_inputObj).html("<select style=\"width:158px;\"></select>");
            act_common.wf_bindRole(1, $(_inputObj).find("select")); //绑定角色
        }
        else
            $(_inputObj).html("<input type=\"text\" placeholder=\"变量匹配值\" style=\"width:158px;\"/>");


        var cttype = $(_this).find("option:checked").attr("cttype") * 1;//控件类型
        var datafieldid = $(_this).find("option:checked").attr("datafieldid");//数据id
        var model = $(_this).find("option:checked").attr("SType");//选择类型，1：单选2：多选
        set_selectContent(_this.val(), _select,model); //动态填充逻辑操作符的下拉列表内容
        switch (cttype) {
            case 0://文本框
                break;
            case 3://下拉菜单
            case 20://假期控件
            case 21://假期控件
            case 22://假期控件
                GetDataSource(datafieldid, _inputObj, cttype);
                break;
            case 4://单选按钮
                GetDataSource(datafieldid, _inputObj, cttype);
                break;
            case 5://多选框
                GetDataSource(datafieldid, _inputObj, cttype);
                break;
            case 6://选人控件
                var id = Guid.NewGuid().ToString();
                $(_inputObj).html("<input id='" + id + "' type='text'>");
                var select = i8selector.KSNSelector({ model: model, element: "#" + id + "", width: "152", searchType: { "org": false, "user": true, "grp": false } });
                break;
            case 7://选部门控件
                var id = Guid.NewGuid().ToString();
                $(_inputObj).html("<input id='" + id + "' type='text'>");
                var select = i8selector.KSNSelector({ model: model, element: "#" + id + "", width: "152", searchType: { "org": true, "user": false, "grp": false } });
                break;
            case 11://金额控件
                break;
            case 13://级联控件
                GetDataSource(datafieldid, _inputObj, cttype);
                break;
        }
    })
    //获取数据源
    function GetDataSource(datafieldid, _inputObj, type,_inpputVal) {
        $.get(i8_session.ajaxWfHost+ 'webajax/design/activity/getdatafielddatasource',{dataFieldID:datafieldid},function(json){
            if (json.Result) {
                var jsonData = json.ReturnObject;
                var html = "";
                if (type == 13) {//级联菜单
                    html = $("<select model=\"cascade\"></select>");
                    $(html).append("<option>请选择</option>");
                    for (var i = 0; i < jsonData.length; i++)
                        $(html).append("<option value=\"" + jsonData[i].Item1 + "\">" + jsonData[i].Item3 + "</option>");
                } else {
                    html = $("<select></select>");
                    $(html).append("<option>请选择</option>");
                    for (var i = 0; i < jsonData.length; i++)
                        $(html).append("<option value=\"" + decodeURI(jsonData[i].Item2) + "\">" + jsonData[i].Item3 + "</option>");
                }
                $(_inputObj).html(html);
                if (type == 13) //级联菜单
                    $(_inputObj).append("<select><option>请选择</option></select>");
                if(_inpputVal != undefined){//赋值
                    $(_inputObj).find("select:eq(0)").val(_inpputVal);
                    if($(_inputObj).find("select:eq(0)").val() == "请选择"){
	            	var option1Val = $(_inputObj).find("select:eq(0)").find("option:eq(1)").val();
			$(_inputObj).find("select:eq(0)").val(option1Val);
	            }
		}
            }
            else
                i8ui.alert({title:"获取数据源失败,请联系管理员!"});

        });
    }
    //获取数据源子项(级联菜单)
    $("#simpleTable  tr td select[model='cascade'],#complexTable tr td select[model='cascade']").live("change",function(){
        var subObj = $(this).next();//子项下拉元素
        if ($(this).get(0).selectedIndex == 0)
            $(subObj).html("<option>请选择</option>");
        else {
            var datafieldid = $(this).val();//选择
            $.get(i8_session.ajaxWfHost+ 'webajax/design/activity/getdatafielddatasourceitems',{dataFieldID:datafieldid},function(json){
                if (json.Result) {
                    var jsonData = json.ReturnObject;
                    $(subObj).html("<option>请选择</option>");
                    for (var i in jsonData)
                        $(subObj).append("<option value=\"" + i + "\">" + jsonData[i] + "</option>");
                    }
                else
                    i8ui.alert({title:"获取数据源失败,请联系管理员!"});
            });
        }
    })
    //动态填充逻辑操作符的下拉列表内容
    function set_selectContent(type, ObjID,selectModel) {
        //获取选择的条件类型
        var SelOptions = $(ObjID).parent("td").prev().find("select").find("option:checked");
        var datatype = $(SelOptions).attr("datatype") * 1;//数据类型
        var cttype = $(SelOptions).attr("cttype") * 1;//控件类型
        $(ObjID).empty();
        if(datatype == 0&& (cttype == 0 || cttype ==1)){
            $(ObjID).append("<option value=\"=\" code=\"=\">等于</option>");
            $(ObjID).append("<option value=\"!=\" code=\"!=\">不等于</option>");
            $(ObjID).append("<option value=\"@*\" code=\"fn_exist\">包含</option>");
            $(ObjID).append("<option value=\"^*\" code=\"fn_nexist\">不包含</option>");
        }
        else if (type == "SysOriginatorDept" || (cttype==3 && datatype==0) || (cttype > 3 && cttype <= 7) || cttype == 13 || (cttype >= 20 && cttype <= 22)) {//选择的是申请人所在部门,则后面的输入框替换成选人控件
            $(ObjID).append("<option value=\"=\" code=\"=\">等于</option>");
            $(ObjID).append("<option value=\"!=\" code=\"!=\">不等于</option>");
            if (cttype != 4 && selectModel != 1 && type != "SysOriginatorDept" && cttype != 7) {
                $(ObjID).append("<option value=\"@*\" code=\"fn_exist\">包含</option>");
                $(ObjID).append("<option value=\"^*\" code=\"fn_nexist\">不包含</option>");
            }
            if(type == "SysOriginatorDept" || cttype == 7) {
                $(ObjID).append("<option value=\"fn_org\" code=\"fn_org\">包含</option>");
                $(ObjID).append("<option value=\"fn_orgtree\" code=\"fn_orgtree\">包含子部门</option>");
            }
        }
        else if (type == "SysOriginatorLevel" || datatype == 5 || datatype == 1 || cttype == 11) {
            $(ObjID).append("<option value=\"=\" code=\"=\">等于</option>");
            $(ObjID).append("<option value=\"!=\" code=\"!=\">不等于</option>");
            $(ObjID).append("<option value=\">\" code=\">\">大于</option>");
            $(ObjID).append("<option value=\">=\" code=\">=\">大于等于</option>");
            $(ObjID).append("<option value=\"<\" code=\"<\">小于</option>");
            $(ObjID).append("<option value=\"<=\" code=\"<=\">小于等于</option>");
        }
        else {
            $(ObjID).append("<option value=\"=\" code=\"=\">等于</option>");
            $(ObjID).append("<option value=\"!=\" code=\"!=\">不等于</option>");
            $(ObjID).append("<option value=\">\" code=\">\">大于</option>");
            $(ObjID).append("<option value=\">=\" code=\">=\">大于等于</option>");
            $(ObjID).append("<option value=\"<\" code=\"<\">小于</option>");
            $(ObjID).append("<option value=\"<=\" code=\"<=\">小于等于</option>");
            $(ObjID).append("<option value=\"@*\" code=\"fn_exist\">包含</option>");
            $(ObjID).append("<option value=\"^*\" code=\"fn_nexist\">不包含</option>");
        }
    }
    //单条件
    $("#rdo_simple").live("click",function(){
        $("#simpleTable").show();
        $("#complexTable").hide();
        $("#complexTrTxt").hide();
        $("#complexTrIntro").hide();
        act_common.wf_bindFormData($("#simpleTable tr:eq(1) td:eq(1)").find("select")); //绑定表单字段-简单表达式
    });
    //多条件设计
    $("#rdo_complex").live("click",function(){
        $("#simpleTable").hide();
        $("#complexTable").show();
        $("#complexTrTxt").show();
        $("#complexTrIntro").show();
        act_common.wf_bindFormData($("#complexTable tr:eq(1) td:eq(1)").find("select")); //绑定表单字段-简单表达式
    });
    //表单提交按钮
    $("#span_submit").live("click",function(){
        var lineName = $("#lineName"); //节点名称
        if (lineName.val() == "") {
            i8ui.alert({title:"节点名不能为空!"});
            return false;
        }
        white_list.lastIndex = 0;
        if (!white_list.test($.trim(lineName.val())) && $.trim(lineName.val()).length > 0) {
            i8ui.alert({title:"节点名称中包含非法字符!"});
            return false;
        }
        var lineType = "";
        //单条件设计
        if (document.getElementById("rdo_simple").checked == true)
            lineType = "simpleTable";
        else
            lineType = "complexTable";
        var firstVar = $("#"+lineType+" tr:eq(1) td:eq(1)").find("select"); //多条件-表单字段
        var cttype = $(firstVar).find("option:checked").attr("cttype");//表单字段类型
        var operator = $("#"+lineType+" tr:eq(1) td:eq(2)").find("select"); //多条件-操作符
        var secondVar = $("#"+lineType+" tr:eq(1) td:eq(3)").find("input").length == 0 ? $("#"+lineType+" tr:eq(1) td:eq(3)").find("select"):$("#"+lineType+" tr:eq(1) td:eq(3)").find("input");//匹配值

        if (firstVar.val() == "系统变量" || firstVar.val() == "表单变量") {
            i8ui.alert({title:"请选择变量中的具体值!"});
            return false;
        }
        if (!Verified_secondVar(firstVar, secondVar, cttype)) {
            i8ui.alert({title:"匹配值不能为空或包含特殊字符!"});
            return false;
        }
        //多条件表示式
        var isExist = true;
        if ($("#"+lineType+" tr").length > 2) {//大于1代表添加的是多个条件的表达式
            $("#"+lineType+" tr").each(function(i){
                if(i >=2) {
                    var firstObj = $(this).find("td:eq(1)").find("select");//多条件-表单字段
                    if (firstObj.val() == "系统变量" || firstObj.val() == "表单变量") {
                        i8ui.alert({title: "请选择变量中的具体值!"});
                        firstObj.focus();
                        isExist = false;
                        return;
                    }
                    var datafieldType = $(firstObj).find("option:checked").attr("cttype");//表单字段类型
                    var secondObj = $(this).find("td:eq(3)").find("input").length == 0 ? $(this).find("td:eq(3)").find("select"):$(this).find("td:eq(3)").find("input");//匹配值
                    if (!Verified_secondVar(firstObj, secondObj, datafieldType)) {//查询是否匹配值为空
                        i8ui.alert({title: "匹配值不能为空或包含特殊字符!"});
                        secondObj.focus();
                        isExist = false;
                        return false;
                    }
                    var mathType = matchType(firstObj, secondObj);
                    if (mathType != "") {//验证输入的值与选择的类型是否匹配
                        i8ui.alert({title: mathType});
                        secondObj.focus();
                        isExist = false;
                        return false;
                    }
                }
            })
        }

        if(!isExist){return false;}
        var mathType = matchType(firstVar, secondVar);
        if (mathType != "") {//验证输入的值与选择的类型是否匹配
            i8ui.alert({title:mathType});
            return false;
        }
        //判断规则设置--多层级使用
        if(document.getElementById("rdo_complex").checked == true) {
            if ($("#complexTable tr").length > 2) {
                if ($.trim($("#txt_complexRule").val()) == "") {
                    i8ui.alert({title: "请输入规则设置！"});
                    return false;
                }
                var txtRule = $("#txt_complexRule").val();
                $("#complexTable tr").each(function (i) {
                    if (i > 0) {
                        if (txtRule.indexOf("'" + i + "'") < 0) {
                            i8ui.alert({title: "规则错误,不存在条件" + i + "的规则设置！"});
                            isExist = false;
                        }
                        else {
                            var ruleIndex = txtRule.indexOf("'" + i + "'");
                            if (ruleIndex != txtRule.length - 1) {//判断是否是最后一个元素
                                var nextElement = txtRule.substring(ruleIndex + 3, ruleIndex + 7);
                                //判断当前条件后面的表达式是否为运算符
                                if (nextElement.indexOf('||') < 0 && nextElement.indexOf('&&') < 0 && nextElement.indexOf(')') < 0 && nextElement != "") {
                                    i8ui.alert({title: "规则格式错误！"});
                                    isExist = false;
                                }
                            }
                        }
                    }
                })
                if (!isExist) {
                    return false;
                }
                //判断规则是否完整
                if ((txtRule.split('(').length - 1) != (txtRule.split(')').length - 1)) {
                    i8ui.alert({title: "规则格式错误！"});
                    return false;
                }
            }
        }
        //判断条件的选择
        var Expression = ""; //值内容
        var ExpressionCode = ""; //值代码
        var ExpressionRule = ""; //值规则
        var vartype = firstVar.find("option:selected").attr("datatype"); //获取当前值的类型

        var lineval = ""; //填充表达式值
        var linevalCode = ""; //填充表达式代码
        lineval = firstVar.val() + "," + operator.val();
        //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
        if(operator.val() == "@*" || operator.val() == "^*" || operator.val() == "fn_org" || operator.val() == "fn_orgtree")
            linevalCode = operator.find("option:selected").attr("code") + "(" + firstVar.find("option:selected").attr("code");
        else
            linevalCode = firstVar.find("option:selected").attr("code") + " " + operator.find("option:selected").attr("code") + " ";
        if (vartype == 0 || vartype == 4 || vartype == 5) {//为string类型//Time类型//Date类型，则加上单引号
            if (secondVar.val().substring(0, 1) == "'" && secondVar.val().substring(secondVar.val().length - 1, secondVar.val().length) == "'") {
                lineval += "," + Get_secondVar(firstVar, secondVar, cttype);
                //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                if(operator.val() == "@*" || operator.val() == "^*" || operator.val() == "fn_org" || operator.val() == "fn_orgtree")
                    linevalCode += "," + Get_secondVar(firstVar, secondVar, cttype) + ")";
                else
                    linevalCode += Get_secondVar(firstVar, secondVar, cttype);
            }
            else {
                lineval += ",'" + Get_secondVar(firstVar, secondVar, cttype) + "'";
                //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                if(operator.val() == "@*" || operator.val() == "^*" || operator.val() == "fn_org" || operator.val() == "fn_orgtree")
                    linevalCode += ",'" + Get_secondVar(firstVar, secondVar, cttype) + "')";
                else
                    linevalCode += "'" + Get_secondVar(firstVar, secondVar, cttype) + "'";
            }
        }
        else {
            lineval += "," + Get_secondVar(firstVar, secondVar, cttype);
            //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
            if(operator.val() == "@*" || operator.val() == "^*" || operator.val() == "fn_org" || operator.val() == "fn_orgtree")
                linevalCode += "," + Get_secondVar(firstVar, secondVar, cttype) + ")";
            else
                linevalCode += Get_secondVar(firstVar, secondVar, cttype);
        }
        //多条件表示式
        $("#"+lineType+" tr").each(function(i) {
            if (i > 1) {
                var logicOperatorObj = $(this).find("td:eq(0)").find("select");//多条件-条件逻辑
                var firstObj = $(this).find("td:eq(1)").find("select");//多条件-表单字段
                var datafieldType = $(firstObj).find("option:checked").attr("datatype");//表单字段类型
                var operatorObj = $(this).find("td:eq(2)").find("select");//多条件-表单字段
                var secondObj = $(this).find("td:eq(3)").find("input").length == 0 ? $(this).find("td:eq(3)").find("select"):$(this).find("td:eq(3)").find("input");//匹配值
                if (document.getElementById("rdo_simple").checked == true) {//标准版
                    lineval += "、" + $(logicOperatorObj).val() + "," + $(firstObj).val() + "," + $(operatorObj).val();
                    linevalCode += " " + $(logicOperatorObj).val() + " ";
                }
                else{
                    lineval += "、" + $(firstObj).val() + "," + $(operatorObj).val();
                    linevalCode += "、";
                }
                //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                if($(operatorObj).val() == "@*" || $(operatorObj).val() == "^*" || $(operatorObj).val() == "fn_org" || $(operatorObj).val() == "fn_orgtree")
                    linevalCode +=  $(operatorObj).find("option:selected").attr("code")+"("+$(firstObj).find("option:selected").attr("code");
                else
                    linevalCode +=  $(firstObj).find("option:selected").attr("code") + " " + $(operatorObj).find("option:selected").attr("code") + " ";
                cttype = $(firstObj).find("option:checked").attr("cttype");//表单字段类型
                if (datafieldType == 0 || datafieldType == 4 || datafieldType == 5) {//为string类型//Time类型//Date类型，则加上单引号
                    var secondVari = Get_secondVar(firstObj, secondObj, cttype);
                    if (secondVari.substring(0, 1) == "'" && secondVari.substring(0, secondVari.length - 1) == "'") {
                        lineval += "," + secondVari;
                        //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                        if($(operatorObj).val() == "@*" || $(operatorObj).val() == "^*" || $(operatorObj).val() == "fn_org" || $(operatorObj).val() == "fn_orgtree")
                            linevalCode += "," + secondVari +")";
                        else
                            linevalCode += secondVari;
                    }
                    else {
                        lineval += ",'" + secondVari + "'";
                        //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                        if($(operatorObj).val() == "@*" || $(operatorObj).val() == "^*" || $(operatorObj).val() == "fn_org" || $(operatorObj).val() == "fn_orgtree")
                            linevalCode += ",'" + secondVari + "')";
                        else
                            linevalCode += "'" + secondVari + "'";
                    }
                }
                else {
                    lineval += "," + Get_secondVar(firstObj, secondObj, cttype);
                    //包含与不包含 存储方式,例：fn_exist([SysOriginatorDept],'a316917f-bd20-406a-974e-f80c1693b8d5')
                    if($(operatorObj).val() == "@*" || $(operatorObj).val() == "^*" || $(operatorObj).val() == "fn_org" || $(operatorObj).val() == "fn_orgtree")
                        linevalCode += "," + Get_secondVar(firstObj, secondObj, cttype) +")";
                    else
                        linevalCode += Get_secondVar(firstObj, secondObj, cttype);Element
                }
            }
        });
        Expression = lineval;
        ExpressionCode = linevalCode;
        ExpressionRule = $("#txt_complexRule").val();
        if(document.getElementById("rdo_complex").checked == true) {
            if ($("#complexTable tr").length > 2) {//组装数据
                var rule = ExpressionRule;
                $("#complexTable tr").each(function (i) {
                    if (i > 0) {
                        var code = ExpressionCode.split('、')[i - 1];
                        rule = rule.replace(eval("/'" + i + "'/g"), code);
                    }
                })
                ExpressionCode = rule;
            }
        }
        var ConditionType = document.getElementById("rdo_complex").checked == true ?1:0;
        //封装数据
        act_common.wf_addLine(wf_graph.getSelectionCell().id,lineName.val(),1,wf_graph.getSelectionCell().source["id"],wf_graph.getSelectionCell().target["id"],ConditionType,Expression,ExpressionCode,ExpressionRule);
        wf_graph.getSelectionCell().value = lineName.val(); //赋值条件名称
        wf_graph.refresh(); //刷新图形显示更新
        //wf_wnd.setVisible(false); //隐藏窗口
        //关闭层
        $(this).parents("div[class='ct-ly']").next().remove();
        $(this).parents("div[class='ct-ly']").remove();
    });

    //匹配类型值
    function matchType(firstVar, secondVar) {
        var result = "";
        //获取要显示表达式的值
        var vartype = $(firstVar).find("option:selected").attr("datatype"); //获取当前值的类型
        switch (vartype) {
            case "0": //string类型
                break;
            case "1": //数字整形
                var numberchar_reg = /^(\-?)[0-9]+(\.[0-9]+)?$/g;
                if (!numberchar_reg.test($(secondVar).val()))
                    result = "当前类型只能输入数字整形!";
                break;
            case "2": //Json字符串
                break;
            case "3": //Array
                break;
            case "4": //Time
                if (!act_common.wf_isTime($(secondVar).val()))
                    result = "当前类型只能输入时间格式(如：13:04:05)!";
                break;
            case "5": //Date
                if (!act_common.wf_strDateTime($(secondVar).val()))
                    result = "当前类型只能输入日期格式(如：2008-07-22)!";
                break;
        }
        return result;
    }
    //验证匹配值的是否写值  firstVar:表单字段  secondVar：匹配值
    function Verified_secondVar(firstVar, secondVar, cttype) {
        var result = true;
        if (firstVar.val() == "SysOriginatorDept" || cttype == 6 || cttype == 7)//选择的是申请人所在部门,则后面的输入框替换成选人控件
        {
            if (secondVar.prev().attr("data-uid") == undefined)
                result = false;
        }
        else if (firstVar.val() == "SysOriginatorLevel")//选择的是申请人职级，则后面的输入框替换成下拉列表
        {
            if ($("option:selected", secondVar).index() == 0)
                result = false;
        }
        else {
            if (cttype == 13) {//级联菜单
                var selectSub = $(secondVar).next();//获取二级菜单
                if ($(selectSub).get(0).selectedIndex == 0)
                    result = false;
            } else {
                var containSpecial = RegExp(/[(\,)(\、)]+/);
                if (secondVar.val() == "" || containSpecial.test(secondVar.val()))
                    result = false;
            }
        }
        return result;
    }
    //获取匹配值的写入值 firstVar:表单字段  secondVar：匹配值
    function Get_secondVar(firstVar, secondVar, cttype) {
        var data_uid = "";
        if (firstVar.val() == "SysOriginatorDept" || cttype == 6 || cttype == 7)//选择的是申请人所在部门,则后面的输入框替换成选人控件
        {
            var uidlength = secondVar.parent().find("span");
            //获取匹配值的父元素，然后获取该元素下有多少个span值，则代表选择了多少个部门
            for (var i = 0; i < uidlength.length; i++)
                data_uid += $(uidlength[i]).attr("data-uid") + ",";
            data_uid = data_uid.substring(0, data_uid.length - 1);
        }
        else if (firstVar.val() == "SysOriginatorLevel")//选择的是申请人职级，则后面的输入框替换成下拉列表
            data_uid = secondVar.val();
        else {
            if (cttype == 13) {//级联菜单
                var selectSub = $(secondVar).next();//获取二级菜单
                data_uid = $(selectSub).val();
            } else
                data_uid = secondVar.val();
        }
        return data_uid;
    }

    //赋值表达式匹配值
    function set_sercondVar(firstVar, expression, secondVarObj) {
        var secondVar = ""; //表达式值
        if (expression.length > 3) {//表达用到了选人控件而且选择的是多个部门，里面包含逗号，所以分隔多了
            if (expression[0] != "&&" && expression[0] != "||") {
                for (var i = 2; i < expression.length; i++)
                    secondVar += expression[i] + ",";
            }
            else {
                for (var i = 3; i < expression.length; i++)
                    secondVar += expression[i] + ",";
            }
            secondVar = secondVar.substring(0, secondVar.length - 1);
        }
        else
            secondVar = expression[2];

        var _select = secondVarObj.parent().prev().find("select");//操作符项
        var firstVarObj = secondVarObj.parents("tr").find("td:eq(1) select").find("option:checked");
        var cttype = $(firstVarObj).attr("cttype");//表单字段项字段类型
        var datafieldid = $(firstVarObj).attr("datafieldid");//字段数据源ID


        if (secondVar.substring(0, 1) == "'" && secondVar.substring(secondVar.length - 1, secondVar.length) == "'")
            secondVar = secondVar.substring(1, secondVar.length - 1);
        if (firstVar == "SysOriginatorDept" || cttype == 6 || cttype == 7)//选择的是申请人所在部门,则后面的输入框替换成选人控件  赋值
        {
            var setType = "org";
            var isOrg = true;
            var isUser = false;
            if (cttype == 6) {
                setType = "user";
                isOrg = false;
                isUser = true;
            }
            var setData = "";
            if (secondVar.indexOf(",") > 0) {
                for (var i = 0; i < secondVar.split(",").length; i++) {
                    //if(!isNaN(secondVar.split(",")[i]))
                        setData += "{ \"type\": \"" + setType + "\", \"id\": \"" + secondVar.split(",")[i] + "\",\"ureadonly\":false},";
                }
                setData = "[" + setData.substring(0, setData.length - 1) + "]";
            }
            else{
                //if(!isNaN(secondVar))
                    setData = "[{ \"type\": \"" + setType + "\", \"id\": \"" + secondVar + "\",\"ureadonly\":false}]";
            }
            var id= Guid.NewGuid().ToString();
            $(secondVarObj).attr("id",id);
            var lineOrg = i8selector.KSNSelector({ model: 2, element: "#" + id, width: "152", searchType: { "org": isOrg, "user": isUser, "grp": false } });
            lineOrg.setAllselectedData($.parseJSON(setData));
        }
        else if (firstVar == "SysOriginatorLevel")//选择的是申请人职级，则后面的输入框替换成下拉列表
        {
            var select = $("<select style=\"width:158px;\"></select>");
            $(secondVarObj.parent()).html(select);
            act_common.wf_bindRole(1, select); //绑定角色
            $(select).val(secondVar);
        }
        else {
            if (cttype == 3 || cttype == 4 || cttype == 5) {//字段类型
                GetDataSource(datafieldid, secondVarObj.parent(), cttype,secondVar);
                //$(secondVarObj).val(secondVar);
            }
            else if (cttype == 13) {//级联菜单赋值
                $.get(i8_session.ajaxWfHost+ 'webajax/design/activity/getdatafielddatasourceparent',{dataFieldID:secondVar},function(json){
                        if (json.Result) {
                            var jsonData = json.ReturnObject;
                            var valObj = secondVarObj.parent();
                            $.ajaxSettings.async = false;
                            //填充一级类别
                            GetDataSource(datafieldid,valObj , cttype,jsonData);
                            $.get(i8_session.ajaxWfHost+ 'webajax/design/activity/getdatafielddatasourceitems',{dataFieldID:jsonData},function(json){
                                    if (json.Result) {
                                        //填充二级类别
                                        var subObj = $(valObj).find("select:eq(1)");
                                        var jsonData = json.ReturnObject;
                                        $(subObj).html("<option>请选择</option>");
                                        for (var i in jsonData)
                                            $(subObj).append("<option value=\"" + i + "\">" + jsonData[i] + "</option>");
                                        //赋值
                                        $(subObj).val(secondVar);
                                    }
                                    else
                                        i8ui.alert({title:"获取数据源失败,请联系管理员!"});
                            });
                            $.ajaxSettings.async = true;
                        }
                        else
                            i8ui.alert({title:"获取数据源失败,请联系管理员!"});
                });
            }
            else
                secondVarObj.val(secondVar);
        }
        set_selectContent(firstVar, _select); ////动态填充逻辑操作符的下拉列表内容
    }
    //赋值方法
    function giveLine(listOrderNum){
        //初始化内容
        $("#rdo_simple").attr("checked", true); //条件选项
        $("#simpleTable").show(); //初始时显示简单条件
        $("#complexTable").hide();
        $("#complexTrTxt").hide();
        $("#complexTrIntro").hide();
        if (listOrderNum != -1) {//不等于代表存储过该对象，进行赋值
            var wf_ArrayLine = act_common.wf_ArrayLineArray;
            if (wf_ArrayLine[listOrderNum].ConditionType == 1) {//多层级
                //初始化内容
                $("#rdo_complex").attr("checked", true); //条件选项
                $("#simpleTable").hide(); //初始时显示简单条件
                $("#complexTable").show();
                $("#complexTrTxt").show();
                $("#complexTrIntro").show();
            }
            if (wf_ArrayLine[listOrderNum].Expression.indexOf('、') > 0) {//代表配置的多个条件
                var expression = wf_ArrayLine[listOrderNum].Expression.split('、');
                for (var i = 0; i < expression.length; i++) {
                    if(i > 0)
                        addLineCondition(wf_ArrayLine[listOrderNum].ConditionType); //添加条件
                    var trObj = $("#simpleTable tr").eq(i+1);//当前行
                    if(wf_ArrayLine[listOrderNum].ConditionType == 1)
                        trObj = $("#complexTable tr").eq(i+1);//当前行
                    var firstObj =$(trObj).find("td:eq(1)").find("select");//表单字段
                    var operatorObj =$(trObj).find("td:eq(2)").find("select");//操作符
                    var secondObj =$(trObj).find("td:eq(3)").find("input").length==0 ? $(trObj).find("td:eq(3)").find("select"):$(trObj).find("td:eq(3)").find("input");//匹配值
                    act_common.wf_bindFormData(firstObj); //绑定表单字
                    if (i == 0 || wf_ArrayLine[listOrderNum].ConditionType == 1) {//默认值
                        $(firstObj).val(expression[i].split(',')[0]); //表单字段
                        set_sercondVar(expression[i].split(',')[0], expression[i].split(','), secondObj); //匹配值
                        var operatorVal = expression[i].split(',')[1];
                        //兼容老数据2.0版本
                        if (expression[i].split(',')[0] == "SysOriginatorDept"){
                            if(operatorVal == "@*")
                                operatorVal = "fn_org";
                        }
                        $(operatorObj).val(operatorVal); //操作符
                    }
                    else {//标准版配置
                        var logicOperatorObj =$(trObj).find("td:eq(0)").find("select");//逻辑操作符
                        $(logicOperatorObj).val(expression[i].split(',')[0]); //逻辑操作符
                        $(firstObj).val(expression[i].split(',')[1]); //表单字段
                        set_sercondVar(expression[i].split(',')[1], expression[i].split(','), secondObj); //匹配值
                        var operatorVal = expression[i].split(',')[2];
                        //兼容老数据2.0版本
                        if (expression[i].split(',')[1] == "SysOriginatorDept"){
                            if(operatorVal == "@*")
                                operatorVal = "fn_org";
                        }
                        $(operatorObj).val(operatorVal); //操作符
                    }
                }
                if(wf_ArrayLine[listOrderNum].ConditionType == 1)//多层级
                    $("#txt_complexRule").val(wf_ArrayLine[listOrderNum].ExpressionRule);
            }
            else {
                var expression = wf_ArrayLine[listOrderNum].Expression.split(',');
                var firstObj =$("#simpleTable tr:eq(1) td:eq(1)").find("select");//表单字段
                var operatorObj =$("#simpleTable tr:eq(1) td:eq(2)").find("select");//操作符
                var secondObj =$("#simpleTable tr:eq(1) td:eq(3)").find("input").length == 0 ? $("#simpleTable tr:eq(1) td:eq(3)").find("select"):$("#simpleTable tr:eq(1) td:eq(3)").find("input");//匹配值
                act_common.wf_bindFormData(firstObj); //绑定表单字
                $(firstObj).val(expression[0]); //表单字段
                set_sercondVar(expression[0], expression, secondObj); //匹配值
                $(operatorObj).val(expression[1]); //操作符
            }
        }
        else {
            var firstObj =$("#simpleTable tr:eq(1) td:eq(1)").find("select");//表单字段
            act_common.wf_bindFormData(firstObj); //绑定表单字段-简单表达式
            $(firstObj).get(0).selectedIndex = 0; //初始表单字段
        }
    }

    exports.giveLine = giveLine;//赋值方法
});