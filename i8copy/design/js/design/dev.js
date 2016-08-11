/**
 * Created by Ling on 2014/11/17.
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui.js");
    var i8selector = require("default/javascripts/plugins/i8selector/fw_selector");
    var app_guid = require("../activity/app_newguid");
    var util=require('../common/util.js');
    var adv2ProcSet = null;//流程高级开发配置
    var desginBox = null;
    var select1 = null; //选人控件-收文
    var select2 = null; //选人控件-发起限制
    var procSetID;
    window.quitWindow=function(){
        window.open('/logout',"_self");
    }

    var checkDef=$.Deferred();

    //专项角色弹出框
    var check_pop=$('<div/>');

    //获取专项角色数据
    var getRoleData=function(checkDef){
        $.ajax({
            url:i8_session.ajaxWfHost+'webajax/setting/getRoleData',
            type: 'get',
            data:{pageIndex:1,pageSize:100000},
            dataType: 'json',
            success: function (data) {
                if(!data.Result){
                    check_pop.html(data.Description);
                    return;
                }
                if(data.ReturnObject.Item2.length==0){
                    check_pop.html('暂无有专项角色！');
                    return;
                }
                var tpl=require('../template/design/specialrole-check-pop.tpl');
                var render = template(tpl);
                var html = render(data.ReturnObject);
                check_pop.html(html);
                checkDef.resolve();
            },error: function(e1,e2,e3){
                checkDef.resolve();
                check_pop.html('获取专项角色列表时请求超时，请检查网络！');
            }
        });
        return checkDef;
    }
    var getRoleDef=getRoleData(checkDef);
    $('#showspecialrole').on('click',function(){
        $('#receiptbyRole').trigger('click');
        var selectrole=$('#selectrole');
        var rolestring='';
        selectrole.find('.app-checkbox').each(function(){
            rolestring+='#'+$(this).attr('roleID');
        });
        var special_box=i8ui.showbox({
            title:'请选择专项角色',
            cont:check_pop.html()
        });
        $special_box=$(special_box);
        $special_box.find('.set-checked-box-list').mCustomScrollbar({//添加滚动条功能
            scrollButtons: {
                enable: true
            },
            theme: "dark-thin"
        });

        $special_box.find('.checked-item').each(function(){
            var _this=$(this).find('.app-checkbox');
            if(rolestring.search(_this.attr('roleID'))>0){
                _this.addClass('checked');
            }else{
                _this.removeClass('checked');
            }
        });
        $special_box.on('click','.app-checkbox,.checked-label',function(){
            $(this).parent().find('.app-checkbox').toggleClass('checked');
        });

        //关闭弹窗
        $special_box.on('click','.ct-cancel',function(){
            special_box.close();
        });

        //确认
        $special_box.on('click','.ct-confirm',function(){
            var selectrole_arr=[];
            $special_box.find('.app-checkbox.checked').each(function(){
                var _this=$(this);
                var roleID=_this.attr('roleID');
                var roleName=_this.attr('roleName');
                var userName=_this.attr('userName');
                selectrole_arr.push('<span>\
                    <span class="design-bg-icons3 app-checkbox checked no-float v--4" roleID="'+roleID+'" ></span>\
                    <label class="no-float app-checkbox-txt">'+roleName+'('+userName+')</label>\
                </span>');
            });
            selectrole.html(selectrole_arr.join(''));
            special_box.close();
        });
    })

    //第一步
    function init() {
        $("#ddl_OrgsType").setSelect({_default:true});//初始化
        $("#ddl_CategoryType").setSelect();//初始化
        SelectionControl(); //加载选人控件
        //判断是B用户还是C用户
        if($(".design-form-nav li:last").attr("class") != "fw_hidden")//有权限代表是C用户
            $("#btn_actDraft").hide();
        //上传到模板库按钮
        if(tamplatePowerAid != i8_session.aid.replace(/-/g,''))
            $("#btn_uploadTemplate").hide();
        //判断baseinfoID是否为空，不为空则代表修改操作。
        if (js_wf_BaseInfoID != "") {
            //$("#ddl_OrgsType").unbind("click");
            //根据baseinfoID获取流程基本信息
            $.get(i8_session.ajaxWfHost+ 'webajax/design/getdesignbaseinfo', {baseinfoid: js_wf_BaseInfoID}, function (json) {
                if (json.Result) {
                    var resultData = json.ReturnObject;
                    var procBaseInfo = resultData.Item1; //基本信息类
                    var procRecv = resultData.Item2; //收文类
                    var procAuth = resultData.Item3; //发起类
                    var procGuid = resultData.Item4; //说明类
                    var procCategory = resultData.Item5; //流程类别类
                    var procSet = resultData.Item6; //流程类别类
                    var procRule=resultData.Item7||{};//流程编号规则设置
                    if(procRule.FolioPrefix){ //存在规则
                        $('#ruleRadio').find('.app-radio[type=1]').trigger('click');
                        $('#folioPrefix').val(procRule.FolioPrefix);
                        $('#folioInit').val((Math.pow(10,procRule.FolioNumLength-1)+'').substr(1)+procRule.InitIndex);
                        $('#folioResetType').val(procRule.ResetRule);
                    }
                    procSetID=procSet.ID;
                    diagramMetaData = procBaseInfo.ProcDesignMetaData || ''; //设计器数据

                    //流程二次开发设置加载
                    if(procSet.ExtConfig){
                        adv2ProcSet = procSet.ExtConfig;
                    }
                    //流程状态
                    if (procBaseInfo.ProcStatus == 2) {
                        $("#btn_draft,#btn_actDraft").hide();
                    }
                    //更改所有连线环节的ID。改为GUID，兼容老数据。2014.4.19日后的新数据不存在此问题  容错
                    if (diagramMetaData != "" && diagramMetaData != null) {
                        var designerXml = $.parseXML(diagramMetaData);
                        var lineArray = $(designerXml).find("mxCell[source]");
                        for (var i = 0; i < lineArray.length; i++) {
                            if (!Guid.IsGuid($(lineArray[i]).attr("id"))) {//不为GUId则修改
                                $(lineArray[i]).attr("id", Guid.NewGuid().ToString());
                            }
                        }
                        //兼容解析
                        var userAgent = window.navigator.userAgent.toLowerCase();
                        $.browser.msie8 = $.browser.msie && /msie 8\.0/i.test(userAgent);
                        $.browser.msie7 = $.browser.msie && /msie 7\.0/i.test(userAgent);
                        if ($.browser.msie8 || $.browser.msie7) {
                            diagramMetaData = designerXml.xml;
                        } else {
                            diagramMetaData = (new XMLSerializer()).serializeToString(designerXml);
                        }
                    }
                    $("#span_design,#span_custom").removeClass("checked");
                    if (procBaseInfo.ProcType == 0)//自主设计流程
                        $("#span_design").addClass("checked");
                    if (procBaseInfo.ProcType == 3) {//自定义流程
                        $("#span_custom").addClass("checked");
                        $("#div_mxGraphView").html("<img src='"+i8_session.resWfHost+"default/images/design/ProcCustomView.png'>");
                    }
                    $("#txt_name").val(procSet.ProcName); //流程名称

                    $("#lbl_procTitle").text(util.stringCut(procSet.ProcName,60));

                    $("#txt_order").val(procSet.SortIndex);//流程排序
                    $("#ddl_OrgsType").setValue(procBaseInfo.OrgStructure); //组织架构
                    if (procCategory != null)
                        $("#ddl_CategoryType").setValue(procCategory.ID); //流程类别
                    if (procGuid != null)//环节说明
                        $("#txt_Actdirections").val(procGuid.ActDesc);
                    if (procRecv != "") {//收文人
                        var userData = "";
                        var roleData = "";
                        for (var i = 0; i < procRecv.length; i++) {
                            if (procRecv[i].RecvType == 0)//用户
                                userData += '"' + procRecv[i].Receiver + '",';
                            if (procRecv[i].RecvType == 1)//角色
                                roleData += procRecv[i].Receiver + ",";
                        }
                        if (userData != "") {
                            userData = '[' + userData.substring(0, userData.length - 1) + "]";
                            select1.loadData($.parseJSON(userData));
                            $('#receiptbyUser').trigger('click');
                        }else{
                            $.when(getRoleDef).done(function(){
                                var selectrole_arr=[];
                                for(var i = 0; i < procRecv.length; i++){
                                    var item=check_pop.find('span.app-checkbox[roleID="'+procRecv[i].Receiver+'"]');
                                    selectrole_arr.push('<span>\
                                    <span class="design-bg-icons3 app-checkbox checked no-float v--4" roleID="'+item.attr('roleID')+'" ></span>\
                                    <label class="no-float app-checkbox-txt">'+item.attr('roleName')+'('+item.attr('userName')+')</label>\
                                    </span>');
                                }

                                $('#selectrole').html(selectrole_arr.join(''));
                                $('#receiptbyRole').trigger('click');
                            });
                        }
                    }
                    if (procAuth != "") { //发起人
                        $("#app_process_range_desc,#app_process_range_all").removeClass("checked");
                        $("#app_process_range_desc").addClass("checked");
                        $(".app_process_design_limit_control").show();
                        var data = "";
                        for (var i = 0; i < procAuth.length; i++) {
                            switch (procAuth[i].AuthType) {
                                case 0:
                                    data += '{"type":"user","id":"' + procAuth[i].Authorize + '"},';
                                    break;
                                case 3:
                                    data += '{"type":"grp","id":"' + procAuth[i].Authorize + '"},';
                                    break;
                                case 4:
                                    data += '{"type":"org","id":"' + procAuth[i].Authorize + '"},';
                                    break;
                            }
                        }
                        if (data != "") {
                            data = '[' + data.substring(0, data.length - 1) + ']';
                            select2.setAllselectedData($.parseJSON(data));
                        }
                    }
                    //审批人过滤
                    if(procBaseInfo.IsSkip)
                        $("#span_skip").addClass("checked");
                    //附件设置
                    if(procBaseInfo.Config && procBaseInfo.Config.isRequireAttachment){
                        $("#span_require_attach").addClass("checked");
                    }
                    //打印设置
                    if(procBaseInfo.Config && procBaseInfo.Config.isUsePrintSet){
                        $("#span_fixed_print").trigger('click');
                        var printSet=procBaseInfo.Config.printFields || '';
                        printSet=printSet.split('&');
                        _.each(printSet,function(item){
                            $('[ekey='+item+']').addClass('checked');
                        })
                    }
                    //根据baseinfoID获取流程表单信息【编辑状态下加载】
                    $.get(i8_session.ajaxWfHost+ 'webajax/form/getformbyprocbaseid', { baseInfoID: js_wf_BaseInfoID }, function (response) {
                        if (response.Result) {
                            var dataobj = response.ReturnObject;
                            var app_process_design_edit=$('#app_process_design_edit');
                            var btn_edit_form=$('#btn_edit_form').addClass('design-bg-icons3 btn-edit-two').html('编辑');
                            var btn_copyform=$('#btn_copyform').addClass('design-bg-icons3 btn-edit-two').html('复制其他流程表单');
                            $('#edit_line').html(btn_edit_form);
                            $('#edit_line').append(btn_copyform);
                            if (dataobj) {
                                app_process_design_edit.html(dataobj.XsltMetaData).attr("formID", dataobj.ID)
                                    .css({ "position": "relative" }).append($('<div class="controloverlayer"></div>')
                                        .css({ "z-index": "8", "position": "absolute", "left": "0px", "top": "0px", "height": "10000px", "width": "100%" }));
                                //$('<div class="app-templete-line">\
                                //    <a id="btn_edit_form" class="design-bg-icons3 btn-edit-two" >编辑</a>\
                                //</div>').before(app_process_design_edit);
                            }
                            else{

                            }
                        }
                    }, "json");
                }
                else
                    alert("获取数据失败！");
            })
        }
        else {
            $(".design-form-title").hide();
            $("#js_edit_designer").html("通过设计器设计新审批链");
        }
        //控制设定发起人范围
        if ($("#app_process_range_all").hasClass("checked"))
            $(".app_process_design_limit_control").hide(); //$("#txt__KSN_LaunchLimit").attr("readonly", "readonly");
        else
            $(".app_process_design_limit_control").show(); //$("#txt__KSN_LaunchLimit").removeAttr("readonly");

        window.onbeforeunload = function (e) {

            e = e || window.event;
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = "退出后数据将不在保存，确定退出吗？";
            }
            // For Safari
            return '退出后数据将不在保存，确定退出吗？';
        };
//        window.onunload = function (e) {
//            alert("asd");
//        };
    };
    //加载选人控件
    function SelectionControl() {
        select1 = i8selector.KSNSelector({ model: 2, element: "#txt_KSN_Receipt", width: "398" });
        select2 = i8selector.KSNSelector({ model: 2, element: "#txt__KSN_LaunchLimit", width: "594", searchType: { "org": true, "user": true, "grp": true } });
    }
    $('#btn_edit_form_icon').on('click',function(){
        $('#btn_edit_form').trigger('click');
    });

    //流程编号规则设置切换  系统默认和自定义规则切换
    var ruleRadio=$('#ruleRadio').on('click','.app-radio,.app-radio-text',function(){
        ruleRadio.find('.app-radio').removeClass('checked');
        var type= $(this).parent().find('.app-radio').addClass('checked').attr('type');//0 系统 1自定义
        if(type==1){
            ruleRadio.find('.number-rule').show();
        }else{
            ruleRadio.find('.number-rule').hide();
        }
    });
    $('#folioInit').on('keyup',function(ev){
        var _this=$(this);
        _this.val(_this.val().replace(/[^0-9]/g,''));
    });
    //设定发起人切换
    $("#app_process_range_all,#app_process_range_desc").live("click",function(){
        $("#app_process_range_all,#app_process_range_desc").removeClass("checked");
        $(this).addClass("checked");
        //控制设定发起人范围
        if ($("#app_process_range_all").hasClass("checked")){
            select2.clearData();
            $(".app_process_design_limit_control").hide();
        }
        else
            $(".app_process_design_limit_control").show();
    })
    //固定收文人切换
    var design_radio_list= $('#design_radio_list')
    design_radio_list.on('click','.app-radio,.app-radio-text,.fw_ksntxtbox',function(){
        design_radio_list.find('.app-radio').removeClass('checked');
        design_radio_list.find('.radio-option-list').hide();
        var _radio_line=$(this).parents('.design-radio-line');
        _radio_line.find('.radio-option-list').show();
        _radio_line.find('.app-radio').addClass('checked');
    });
    //审批链设置
    $("#span_skip").live("click",function(){
        if($(this).hasClass("checked"))
            $(this).removeClass('checked');
        else
            $(this).addClass('checked');
    })
    //附件必填设置
    $("#span_require_attach").on('click',function(){
        $(this).toggleClass('checked')
    });
    //固定打印模板
    $("#span_fixed_print").on('click',function(){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')){
            $('#print_box').show();
        }else{
            $('#print_box').hide();
        }
    });
    $("#print_box").on('click','.app-checkbox',function(){
        $(this).toggleClass('checked');
    });
    //第一步，流程基础配置信息  》 下一步  提交
    $("#btn_BaseInfo").click(function () {
        var orgType = $("#ddl_OrgsType").getValue();
        var procName=$.trim($("#txt_name").val());
        if($.trim(orgType) == ""){
            i8ui.alert({title:"暂未设置组织架构！"});
            return false;
        }
        if (!procName) {
            i8ui.alert({title:"请输入流程名称！"});
            return false;
        }
        var categoryType = $.trim($("#ddl_CategoryType").getValue());
        if (!categoryType) {
            i8ui.alert({title:"请选择流程分类！"});
            return false;
        }
        var sortIndex = $.trim($("#txt_order").val());//排序
        if(!sortIndex) {
            i8ui.alert({title:"请输入流程排序！"});
            return false;
        }
        var numberchar_reg = /^(\-?)[0-9]+(\.[0-9]+)?$/g;
        if (!numberchar_reg.test(sortIndex)){
            i8ui.alert({title:"流程排序格式为数字整形！"});
            return false;
        }
        var receiptInfo = select1.selectedData(); //获取收文列表

        var role_arr=[];
        $('#selectrole').find('.app-checkbox').each(function(){
            role_arr.push($(this).attr('roleID'));
        });
        var receiptRoleList=role_arr.join(';');
        if($('#receiptbyUser').hasClass('checked')){
            receiptRoleList='';
        }else{
            receiptInfo='';
        }
        var launchInfo = ""; //发起人限制功能 格式{id,type;id,type}
        var launchData = select2.getAllselectedData(); //发起人限制列表
        var isSkip = $("#span_skip").hasClass("checked") ? true:false;
        var isRequireAttachment= $("#span_require_attach").hasClass("checked") ? true:false;
        var isUsePrintSet=$("#span_fixed_print").hasClass("checked") ? true:false;
        var printFields=[];
        if(isUsePrintSet){
            $('#print_box .app-checkbox.checked').each(function(index,item){
                printFields.push($(item).attr('ekey'))
            })
        }
        printFields=printFields.join('&');
        for (var i = 0; i < launchData.length; i++){
            launchInfo += launchData[i].id + "," + launchData[i].type + ";";
        }
        var jsonData = {
            procName:procName,
            categoryType:categoryType,
            orgType:orgType,
            actDirections:$("#txt_Actdirections").val(),
            receiptInfo:receiptInfo,
            receiptRoleList:receiptRoleList,
            launchInfo:launchInfo,
            baseID:js_wf_BaseInfoID,
            sortIndex:sortIndex,
            isSkip:isSkip,
            Config:{
                isRequireAttachment:isRequireAttachment,
                isUsePrintSet:isUsePrintSet,
                printFields:printFields
            }
        };
        var ruletype=ruleRadio.find('.app-radio.checked').attr('type');//0 系统 1自定义
        if(ruletype==1){
            jsonData.folioPrefix=$('#folioPrefix').val();//默认前缀
            jsonData.folioInit=parseInt($('#folioInit').val());//初始化编号
            jsonData.folioResetType=$('#folioResetType').val();//重置规则
            jsonData.folioLength=$('#folioInit').val().length-jsonData.folioInit.toString().length+1;
            if(!jsonData.folioPrefix){
                i8ui.alert({title:"请输入固定前缀！"});
                $('#folioPrefix').trigger('focus');
                return false;
            }
            if(!jsonData.folioInit){
                i8ui.alert({title:"请输入初始化编号！"});
                $('#folioInit').trigger('focus');
                return false;
            }
        }


        $.post(i8_session.ajaxWfHost+ 'webajax/design/addworkflowinfo',jsonData,function(result){
            if (result.Result){
                var data = result.ReturnObject||{};
                if(data.Item1&&data.Item2){
                    procSetID = data.Item1;
                    js_wf_BaseInfoID = data.Item2;
                }
                $(".design-form-nav a[showid='div_form']").click();
            }
            else{
                i8ui.alert({title:'保存失败，'+(result.Description||'请求超时！')});
            }

        });
    });
    //第二步，表单信息   下一步 提交
    $("#btn_Form").click(function () {
        $(".design-form-nav a[showid='div_act']").click();
    })
    //第三步 ，环节设计器 保存
    $("#btn_act").click(function () {
        if($(".design-form-nav li:last").attr("class") == "fw_hidden") {//隐藏为B方式
            $.get(i8_session.ajaxWfHost+ 'webajax/design/verifyProcCount',function(json){
                if(!json.Result)
                    i8ui.alert({title: "您已经超过流程上架数量限制，该流程已经保存为草稿状态！",type:1});
                else
                    SaveActPerOrDraft(1);
            });
        }
        else
            SaveActPerOrDraft(0);
    })
    //第三步 ，环节设计器 草稿
    $("#btn_actDraft").click(function () {
        SaveActPerOrDraft(0);
    })
    //第三步 保存环节信息
    function SaveActPerOrDraft(procStatus) {
        if ($("#span_custom").hasClass("checked"))//自定义审批链
        {
            //更改流程上架
            $.post(i8_session.ajaxWfHost+ 'webajax/design/updateprocstatus', {baseinfoid: js_wf_BaseInfoID, status: procStatus, type: 3}, function (json) {
                if (json.ReturnObject) {
                    if($(".design-form-nav li:last").attr("class") == "fw_hidden"){//隐藏为B方式
                        i8ui.alert({title: "保存成功!", noMask: false, cbk: function () {
                            window.onbeforeunload = null;
                            window.location.href = i8_session.wfbaseHost+'design/list';
                        },type:2});
                    }
                    else
                        $(".design-form-nav a[showid='div_auth']").click();
                }
            }, 'json');
        }
        //自主设计
        if ($("#span_design").hasClass("checked")) {
            $.get(i8_session.ajaxWfHost+ 'webajax/design/getbasenfo', {baseinfoid: js_wf_BaseInfoID}, function (resultBase) {
                if (resultBase.Result) {
                    var DesignerMetaData = resultBase.ReturnObject.ProcDesignMetaData; //XML数据内容
                    if (DesignerMetaData == "" || DesignerMetaData == null)
                        i8ui.alert({title: "请先设计环节审批链"});
                    else {
                        //更改流程上架
                        $.post(i8_session.ajaxWfHost+ 'webajax/design/updateprocstatus', {baseinfoid: js_wf_BaseInfoID, status: procStatus, type: 0}, function (json) {
                            if (json.ReturnObject) {
                                if($(".design-form-nav li:last").attr("class") == "fw_hidden") {//隐藏为B方式
                                    i8ui.alert({title: "保存成功!", noMask: false, cbk: function () {
                                        window.onbeforeunload = null;
                                        window.location.href =i8_session.wfbaseHost+'design/list';
                                    },type:2});
                                }
                                else
                                    $(".design-form-nav a[showid='div_auth']").click();
                            }
                        }, 'json');
                    }
                }
            })
        }
    }
    //第四步 ，保存权限 上架
    $("#btn_auth").live("click", function () {
//        $.get(i8_session.ajaxWfHost+ 'webajax/design/verifyProcCount',function(json){
//            if(!json.Result)
//                i8ui.alert({title: "您已经超过流程上架数量限制，该流程已经保存为草稿状态！",type:1});
//            else
                SavePerOrSaveDraft(1);
//        });
    })
    //第四步 ，保存 草稿
    $("#btn_draft").live("click", function () {
        SavePerOrSaveDraft(0);
    })
    //第四步保存上架流程
    function SavePerOrSaveDraft(proStatus) {
        var strValue = "";
        var strName = "";
        var selList = $(".app_process_setper_table select");
        for (var i = 0; i < selList.length; i++) {
            strValue += $(selList[i]).val() + ";";
            strName += $(selList[i]).attr("formName") + ";";
        }
        $.post(i8_session.ajaxWfHost+ "webajax/design/saveprocperandeditstatus",{baseinfoid:js_wf_BaseInfoID,strValue:strValue,strName:encodeURIComponent(strName),proStatus:proStatus},function(json){
            if (json.ReturnObject) {
                i8ui.alert({title: "保存成功!",noMask:false,cbk:function (){
                    window.onbeforeunload = null;
                    window.location.href = i8_session.wfbaseHost+'design/list';
                },type:2});
            }
            else
                i8ui.alert({title: "设置流程字段权限出错，请联系管理员！"});
        },'json');
    }
    //标签切换
    $(".design-form-nav a").click(function () {
        var opencurItem = function (item) {
            $(".design-form-nav a").removeClass("selected");
            $(item).attr("class","selected");
            $(".app-templete-body > div").hide();
            $("#" + $(item).attr("showid")).show();
        }
        if ($(this).attr("showid") == "div_baseinfo") {/*当点击第一步*/
            opencurItem(this);
        }
        if ($(this).attr("showid") == "div_form") {/*当点击第二步*/
            if (js_wf_Status == "" && js_wf_BaseInfoID == "")
                i8ui.alert({ title: "请预先配置流程基础信息！"});
            else {
                opencurItem(this);
                var designer=require('../plugins/i8formdesigner/i8designer');
                var form_name=$("#txt_name").val();

                if(util.getUrlParam("baseinfoid").length==36) {//如果url带baseinfoid参数，就是
                    designer({formname: $.trim(form_name), btnLink: '#btn_edit_form', action: 'edit', baseinfoid: js_wf_BaseInfoID,formSaveCompleted:function(data){
                        var btn_edit_form=$('#btn_edit_form').addClass('design-bg-icons3 btn-edit-two').html('编辑');
                        $('#edit_line').append(btn_edit_form);
                        document.getElementById("app_process_design_edit").innerHTML=data.data.html();
                        console.log(data);
                        js_wf_BaseInfoID=data.newBaseInfoID;
                        $("#app_process_design_edit").css({ "position": "relative" }).append($('<div class="controloverlayer"></div>').css({ "z-index": "8", "position": "absolute", "left": "0px", "top": "0px", "height": "10000px", "width": "100%" }));
                    }});
                }else{
                    designer({formname: $.trim(form_name), btnLink: '#btn_edit_form', action: 'new', baseinfoid: js_wf_BaseInfoID,formSaveCompleted:function(data){
                        var btn_edit_form=$('#btn_edit_form').addClass('design-bg-icons3 btn-edit-two').html('编辑');
                        $('#edit_line').append(btn_edit_form);
                        document.getElementById("app_process_design_edit").innerHTML=data.data.html();
                        console.log(data);
                        js_wf_BaseInfoID=data.newBaseInfoID;
                        $("#app_process_design_edit").css({ "position": "relative" }).append($('<div class="controloverlayer"></div>').css({ "z-index": "8", "position": "absolute", "left": "0px", "top": "0px", "height": "10000px", "width": "100%" }));
                    }});
                }
            }
        }
        if ($(this).attr("showid") == "div_act") {/*当点击第三步*/
            if (js_wf_BaseInfoID == "" || $("#app_process_design_edit .fdctrl").length == 0) {
                i8ui.alert({ title: "请预先配置好流程表单信息！"});
            } else {
                opencurItem(this);
                if (diagramMetaData != null && diagramMetaData != "" && $("#div_mxGraphView div").length == 1) {
                    Load_ActDesigner(); //加载环节设计器
                }
                IsActAddOrEdit();
            }
        }
        if ($(this).attr("showid") == "div_auth") {/*当点击第四步*/
            if (js_wf_BaseInfoID == "" || ($("#div_mxGraphView div").length == 1 && diagramMetaData == "")) {
                i8ui.alert({ title: "请预先配置流程审批环节信息！"});
            } else {
                opencurItem(this);
                GetProcessFieldList();
            }
        }
    });
    //流程审批连切换
    $("#div_mxGraphView .create-form2").live("click", function () {
        if ($("#span_design").hasClass("checked")) //自主设计
            showActDesigner();
        else
            i8ui.alert({ title: "当前为自定义审批链,无法设计！"});
    });
    //审批连切换样式
    $("#span_design,#span_custom").live("click",function(){
        $("#span_design,#span_custom").removeClass("checked");
        $(this).addClass("checked");
        if($(this).attr("id") == "span_custom") {//自定义
            $("#js_edit_designer").hide();
            $("#js_copydesigner").hide();
        }
        else {
            $("#js_edit_designer").show();
            $("#js_copydesigner").show();
        }
    })
    //设计器审批链按钮
    $("#span_design").click(function () { //自主设计
        Load_ActDesigner();
    })
    //自定义审批链
    $("#span_custom").click(function () {
        $("#div_mxGraphView").html("<img src='"+i8_session.resWfHost+"default/images/design/ProcCustomView.png' />");
    })
    //通过设计器设计修改审批连
    $(document).delegate("#js_edit_designer",'click',function () {
        if ($("#span_design").hasClass("checked")) //自主设计
            showActDesigner();
        else
            i8ui.alert({ title: "当前为自定义审批链,无法设计！"});
    });

    //弹出环节设计器
    function showActDesigner() {
        if($(window.desginBox).find("iframe").length == 0) {
            var width = $(window).width();
            var height = $(document).height();
            var _height = $(window).height();
            var _scontent = '<iframe src="design/activity/designer?r=' + new Date().getTime() + '" frameborder="0" style="width:' + width + 'px!important; height:' + height + 'px!important;"  scrolling=\"no\">';
            window.desginBox = i8ui.showNoTitle({cont: _scontent});
            $(desginBox).css({border: 'none', 'box-shadow': 'none', top: '0px'});
        }
    }
    //判断流程是新增还是修改状态
    function IsActAddOrEdit() {
        if (js_wf_Status == "") {//新增
            if (diagramMetaData == "")
                $("#js_edit_designer").html("通过设计器设计新审批链");
            else
                $("#js_edit_designer").html("编辑");
        }
        else //修改
            $("#js_edit_designer").html("编辑");
    }
    //加载环节设计器内容
    function Load_ActDesigner() {
        var diagramData = "";
        if(typeof(diagramMetaData) == 'undefined')
            diagramData = parent.diagramMetaData;
        else
            diagramData = diagramMetaData;
        if (diagramData != "" && diagramData != null) {
            if($("#div_mxGraphView").length == 0)
                $("#div_mxGraphView",window.parent.document).html("<iframe src=\"design/activity/view\" scrolling=\"no\" style=\"border:0\"></iframe>");
            else
                $("#div_mxGraphView").html("<iframe src=\"design/activity/view\" scrolling=\"no\" style=\"border:0\"></iframe>");
        }
        else {
            if($("#div_mxGraphView").length == 0)
                $("#div_mxGraphView",window.parent.document).html('<div class="create-form create-form2"><a >编辑创建新审批链</a></div>');
            else
                $("#div_mxGraphView").html('<div class="create-form create-form2"><a >编辑创建新审批链</a></div>');
        }

    }
    //添加流程分类
    $("#btnAddCategory").click(function () {
        window.onbeforeunload = null;
        var _scontent = '<div style="width:260px" id="show_addcategory_dialog">' +
            '<div class="oflow p-t10">' +
            '<div class="fw_left">类别名称：</div>' +
            '<div class="fw_left w-180" >' +
            '<input id="CategoryName" class="app_addnew_input_name inputh-36 w-160"   type="text" />' +
            '</div>' +
            '</div>' +
            '<div  class="oflow p-t10">' +
            '<div class="fw_left">排　　序：</div>' +
            '<div class="fw_left w-180" >' +
            '<input id="CategoryOrderBy" class="app_addnew_input_name inputh-36 w-160" type="text" />' +
            '</div>' +
            '</div>' +
            '</div>'
        i8ui.confirm({title: _scontent,btnDom:$(this),cname:''},function(divDom){
            var categoryName = $("#show_addcategory_dialog #CategoryName").val();
            var CategoryOrderBy = $("#show_addcategory_dialog #CategoryOrderBy").val();
            var CategoryOrderBynum = /^[0-9]*[1-9][0-9]*$/; //数字验证
            if (categoryName == null || categoryName == "") {
                i8ui.alert({title:"请输入类别名称!"});
                return false;
            }
            if (CategoryOrderBy == "" || !CategoryOrderBynum.test(CategoryOrderBy)) {
                i8ui.alert({title:"请输入整数!"});
                return false;
            }
            $.get(i8_session.ajaxWfHost+ 'webajax/design/addcategory', { categoryName: categoryName, categoryOrder: CategoryOrderBy }, function (json) {
                if (!json.Result) {
                    i8ui.alert({title:"添加失败,添加的类型已存在!"});
                } else {
                    $.get(i8_session.ajaxWfHost+ 'webajax/design/getcategory', function (resultCategory) {
                        if(resultCategory.Result){
                            var data =resultCategory.ReturnObject;
                            $("#ddl_CategoryType span:eq(0)").nextAll().remove();
                            var spanType = $("<span class=\"i8-sel-options\" style=\"top: 22px; display: none;\">");
                            for (var i = 0; i < data.length; i++)
                                spanType.append("<em value=\"" + data[i].ID + "\">" + data[i].CategoryName + "</em>");
                            $("#ddl_CategoryType").append(spanType);
                            //赋值
                            $("#ddl_CategoryType").setKey(categoryName);
                        }
                    });
                }
            });
            divDom.close();
        });
    });

    //第四步-加载流程字段权限
    function GetProcessFieldList() {
        $.get(i8_session.ajaxWfHost+ 'webajax/design/getprocessfield',{baseinfoid:js_wf_BaseInfoID},function(json){
            var resultData = json.ReturnObject;
            var datafieldList = resultData.Item2; //表单字段列表
            var activityList = resultData.Item3; //环节字段列表
            var authList = resultData.Item4; //表单环节字段配置列表
            var showhtml = '<tr class="app_process_setper_title">';
            showhtml += '<td class="app_process_setper_td" style="background-color:#f8f8f8;border-top-color:#bed0e8;!important;">';
            showhtml += '<span class="app_process_setper_actname">字段名</span>';
            showhtml += '</td>';
            showhtml += '<td class="app_process_setper_td_margin" style="background-color:#f8f8f8;border-top-color:#bed0e8;!important;"><span class="app_process_setper_actname">发起人</span></td>';
            for (var i = 0; i < activityList.length; i++)
                showhtml += '<td style="background-color:#f8f8f8;border-top-color:#bed0e8;!important;"><span class="app_process_setper_actname" title="' + activityList[i].ActivityName + '">' + activityList[i].ActivityName + '</span></td>';
            showhtml += '</tr>';
            for (var i = 0; i < datafieldList.length; i++) {
                showhtml += '<tr>';
                showhtml += '<td class="app_process_setper_td"><span class="app_process_setper_fieldname" title="' + datafieldList[i].FieldName + '">' + datafieldList[i].FieldName + '</span></td>';
                showhtml += '<td class="app_process_setper_td_margin">';
                showhtml += createSelectPer("," + datafieldList[i].FieldID + "", datafieldList[i].FieldName);
                showhtml += '</td>';
                for (var j = 0; j < activityList.length; j++) {
                    showhtml += '<td>';
                    showhtml += createSelectPer('' + activityList[j].ID + ',' + datafieldList[i].FieldID + '', datafieldList[i].FieldName);
                    showhtml += '</td>';
                }
                showhtml += '</tr>';
            }
            $(".app_process_setper_table").html(showhtml.toString());
            var selectList = $(".app_process_setper_table select");

            for (var i = 0; i < selectList.length; i++) {
                if ($(selectList[i]).val().indexOf(',,') > 0) {
                    selectList.get(i).selectedIndex = 1;
                    $(selectList[i]).css("color", "#00b9f0");
                }
                else {
                    $(selectList[i]).css("color", "#000000");
                    selectList.get(i).selectedIndex = 0;
                }
            }
            //给设置过的权限赋值
            for (var i = 0; i < authList.length; i++) {
                var actid = authList[i].ActivityID == "00000000-0000-0000-0000-000000000000" ? "," : authList[i].ActivityID + ",";
                var showValue = authList[i].AuthType + "," + actid + authList[i].FieldID;
                for (var j = 0; j < selectList.length; j++) {
                    var options = $(selectList[j]).find("option");
                    for (var k = 0; k < options.length; k++) {
                        if ($(options[k]).val() == showValue) {
                            if (authList[i].AuthType == 0)//隐藏
                                $(selectList[j]).css("color", "#8D848A");
                            if (authList[i].AuthType == 1)//查看
                                $(selectList[j]).css("color", "#000000");
                            if (authList[i].AuthType == 2)//编辑
                                $(selectList[j]).css("color", "#00b9f0");
                            $(selectList[j]).val(showValue);
                        }
                    }
                }
            }
        });
    }
    //第四步-创建权限列表
    function createSelectPer(objvalue, formName) {
        var selectList = '<select formName="' + formName + '"><option value="1,' + objvalue + '" style="color:#000000">查看</option><option value="2,' + objvalue + '" style="color:#00b9f0">编辑</option><option value="0,' + objvalue + '" style="color:#8D848A;">隐藏</option></select>';
        return selectList;
    }
    $(".app_process_setper_table select").live("change", function () {
        if ($(this).get(0).selectedIndex == 0)//查看
            $(this).css("color", "#000000");
        if($(this).get(0).selectedIndex == 1)//编辑
            $(this).css("color", "#00b9f0");
        if ($(this).get(0).selectedIndex == 2)//隐藏
            $(this).css("color", "#8D848A");
    })

    var uploaderTemplate=function(loadding){
        $.get(i8_session.ajaxWfHost + 'webajax/template_ajax/login', {options: {fun: 'ImportFromProcess', procSetID: procSetID}}, function (json) {
            if (json.Result == true) {//成功
                loadding.close();
                i8ui.alert({title: "上传成功！", type: 2});
            }
            else {
                loadding.close();
                i8ui.alert({title: "上传模板失败,"+json.Description});
            }
        })
    }

    //上传至模板库
    $("#btn_uploadTemplate").live("click",function(){
        i8ui.confirm({title:"确定要上传至模板库吗？"},function(divDom){
            //流程克隆
            var loadding = i8ui.showNoTitle({cont:'<div style="width:120px; height:80px;padding:10px;"><div style="text-align: center;"><img src="'+i8_session.resWfHost+'default/images/process/load-img1.gif"/></div><div style="font-size: 16px;font-weight: 600;text-align: center;">正在上传中...</div></div>'});

            $.get(i8_session.ajaxWfHost+ 'webajax/template_ajax/login',{options:{fun:'ImportFromProcessCheck',procSetID:procSetID}},function(json) {
                if($.type(json)=='object'&&json.Result){
                    uploaderTemplate(loadding);
                }else{
                    if(json&&json.Code=='12006'){
                        i8ui.confirm({title:"模板曾经导入过，是否需要覆盖？"},function(divDom){
                            uploaderTemplate(loadding);
                        },function(){
                            loadding.close();
                        })

                    }else{
                        i8ui.error('模板已发布，不能重新导入!');
                        loadding.close();
                    }
                }
            });
        });
    });
    var copyType = 1;
    //复制表单流程
    $("#btn_copyform").live("click",function() {
        copyType = 1;
        copyProc();
    });
    //复制表单流程
    $("#js_copydesigner").live("click",function() {
        copyType = 2;
        copyProc();
    });

    $("#proc-go-2-adv").click(function(){
        var advBox = i8ui.showbox({
            title:'流程高级开发设置',
            cont:document.getElementById("div_advanceDev").innerHTML,
            success:function(){
                if(adv2ProcSet){
                    $("#txt_css_uris").val(adv2ProcSet.IncludeResourceCss);
                    $("#txt_js_uris").val(adv2ProcSet.IncludeResourceJScript);
                    $(".radio-enableMS").removeClass("checked");
                    if(adv2ProcSet.EnableMobileCreate){
                        $("#radio-enableMS-1").addClass("checked");
                    }else{
                        $("#radio-enableMS-0").addClass("checked");
                    }
                }
                show2rdSetBox();
                    //选择事件
                $("#area-selector span.app-radio").live("click",function(){
                    $("#area-selector span.app-radio").removeClass("checked");
                    $(this).addClass("checked");
                });

            }

        });
        //保存第二次开发设置
        function show2rdSetBox() {
            $("#btn_save2devSet").click(function () {
                if (js_wf_BaseInfoID.length == 0) {
                    alert('请在填写完“基本信息”、“流程表单”、“流程审批链”三项内容之后，再做本项设置！')
                    return;
                }
                var css_uris = $.trim($("#txt_css_uris").val()),
                    js_uris = $.trim($("#txt_js_uris").val()),
                    enable_m = $("#radio-enableMS-0").hasClass("checked") ? false : true;
                if(css_uris.length>0){
                    css_uris+=';';css_uris = css_uris.replace(/;{2,}/g,";");
                    if(!/^(https?\:\/\/[^/]+\/[^;]+;)+$/g.test(css_uris)){
                        alert('style样式地址格式不对！');
                        return;
                    }
                }
                if(js_uris.length>0){
                    js_uris+=';';js_uris = js_uris.replace(/;{2,}/g,";");
                    if(!/^(https?\:\/\/[^/]+\/[^;]+;)+$/g.test(js_uris)){
                        alert('script脚本地址格式不对！');
                        return;
                    }
                }
                $.post(i8_session.ajaxWfHost + 'webajax/design/save3rdoption', {
                    'procBaseId': js_wf_BaseInfoID,
                    'jsuris': js_uris,
                    'cssuris': css_uris,
                    'enableMC': enable_m
                }, function (response) {
                    if(response.Result){
                        i8ui.alert({title: "设置成功！", type: 2});
                        adv2ProcSet.IncludeResourceCss = css_uris;
                        adv2ProcSet.IncludeResourceJScript = js_uris;
                        adv2ProcSet.EnableMobileCreate = enable_m;
                        advBox.close();
                    }else{
                        i8ui.alert({title: "设置失败，请刷新页面再试！"});
                    }
                }, "json")
            });
        }
    })
    //复制流程
    function copyProc(){
        //获取模板
        $.get(i8_session.resWfHost+ 'default/template/design/copyproc.tpl',function(tpl) {
            var loadding = i8ui.showNoTitle({cont:tpl});
            if(copyType==1)
                $("#div_title").html("复制其他流程表单  <span class=\"copy-fw-title-tip\">复制流程表单，将同步该流程的所有表单控件及其属性<span>");
            if(copyType==2)
                $("#div_title").html("复制其他流程审批链  <span class=\"copy-fw-title-tip\">复制流程审批链，将同步该流程的所有环节控件及其属性<span>");
            $.get(i8_session.ajaxWfHost+ 'webajax/design/getCopyProc',{type:copyType,procName:"",baseinfoID:js_wf_BaseInfoID},function(json){
                if(json.Result == true){//成功
                    var data = json.ReturnObject;
                    var prochtml="";
                    for(var i=0;i<data.length;i++){
                        var categoryName = data[i].Item1;
                        var List = data[i].Item2;
                        prochtml += " <div class=\"cate-body ft12\">";
                        prochtml += "<div class=\"cate-title\">"+categoryName+"</div>";
                        prochtml+="<ul>";
                        for(var j=0;j<List.length;j++){
                            prochtml+="<li title='"+List[j].Item2+"'><span class='app-radio' procID='"+List[j].Item1+"'></span>" + List[j].Item2 + "</li>";
                        }
                        prochtml+="</ul>";
                        prochtml += "<div class=\"clear\"></div>";
                        prochtml += "</div>";
                    }
                    $("#div_proclist").html(prochtml);
                    $('.copy-fw').mCustomScrollbar({
                        theme: "dark-thin"
                    });
                    loadding.position();
                }
            });
            //选择事件
            $("#div_proclist li").live("click",function(){
                $("#div_proclist li span").attr("class","app-radio");
                $(this).find("span").attr("class","app-radio checked");
            });
            //确定复制
            $("#span_copysubmit").live("click",function(){
                var proc = $("#div_proclist li span[class='app-radio checked']");
                if(proc.length == 0){
                    alert("请选择要复制的流程！");
                    return;
                }
                var copyID = $(proc).attr("procid");
                if(copyType==2) {//复制审批链
                    if ($("#span_design").hasClass("checked")) { //自主设计
                        copyBaseInfoID = copyID;
                        //获取要复制的审批链XML
                        $.get(i8_session.ajaxWfHost+ 'webajax/design/getProcBaseInfoByID', {procBaseID: copyBaseInfoID}, function (json) {
                            var procbaseinfo = json.ReturnObject;
                            diagramMetaData = procbaseinfo.ProcDesignMetaData;
                            loadding.close();
                            js_wf_Status = "edit";
                            showActDesigner();
                        })
                    }
                    else
                        i8ui.alert({ title: "当前为自定义审批链,无法设计！"});
                }
                else {
                    $.get(i8_session.ajaxWfHost+ 'webajax/design/copyPorc', {baseInfoID: js_wf_BaseInfoID, copyID: copyID}, function (json) {
                        if (json.Result == true) {//成功
                            loadding.close();
                            if (copyType == 1) {
                                i8ui.alert({title: "复制成功！", type: 2});
                                $("#app_process_design_edit").html(((json.ReturnObject||{}).Item2||{}).ReturnObject);
                                window.top.js_wf_BaseInfoID = (json.ReturnObject||{}).Item1;
                                $("#app_process_design_edit").append('<div class="controloverlayer" style="z-index: 8; position: absolute; left: 0px; top: 0px; height: 10000px; width: 100%;"></div>');
                            }
                        }
                        else {
                            loadding.close();
                            i8ui.alert({title: "复制失败,请联系管理员！"});
                        }
                    })
                }
            })
            //取消复制
            $("#span_copycancel").live("click",function(){
                $('.ct-close').trigger('click');
            })
            //搜索流程
            $("#div_copySubmit").live("click",function(){
                $("#div_proclist").html("<div class=\"list-loading\">正在加载..</div>");
                var procName = $("#div_copysearch input").val();
                $.get(i8_session.ajaxWfHost+ 'webajax/design/getCopyProc',{type:copyType,procName:procName,baseinfoID:js_wf_BaseInfoID},function(json){
                    if(json.Result == true){//成功
                        var data = json.ReturnObject;
                        var prochtml="";
                        for(var i=0;i<data.length;i++){
                            var categoryName = data[i].Item1;
                            var List = data[i].Item2;
                            prochtml += " <div class=\"cate-body ft12\">";
                            prochtml += "<div class=\"cate-title\">"+categoryName+"</div>";
                            prochtml+="<ul>";
                            for(var j=0;j<List.length;j++){
                                prochtml+="<li title='"+List[j].Item2+"'><span class='app-radio' procID='"+List[j].Item1+"'></span>" + List[j].Item2 + "</li>";
                            }
                            prochtml+="</ul>";
                            prochtml += "<div class=\"clear\"></div>";
                            prochtml += "</div>";
                        }
                        $("#div_proclist").html(prochtml)
                        $('.copy-fw').mCustomScrollbar({
                            theme: "dark-thin"
                        });
                        loadding.position();
                    }
                });
            })
        });
    }
    exports.init = init;
    exports.Load_ActDesigner = Load_ActDesigner;
});