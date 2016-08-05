/**
 * Created by ryf on 2016/8/4.
 */
define(function (require, exports) {
    require('./base-plugin.js');
    var dataCache = require('./sourceCache');
    var util = require('./util.js');
    var ds_config = require('./designer-config.js');
    var dlgBox = require('./i8ui.js');
    var controlsObj = require('./control-enum.js');
    var controlEnum = controlsObj.controlEnum;
    var controlDict = controlsObj.controlDict;
    // require('../../common/underscore-min-cmd');
    var dep_ctrls = [], control_Lib = {};
    window['sourceLib'] = {};
    /*公共方法*/
    /*提交对象设置*/
    var contains = function (parentNode, childNode) {
        if (parentNode.contains) {
            return parentNode != childNode && parentNode.contains(childNode);
        } else {
            return !!(parentNode.compareDocumentPosition(childNode) & 16);
        }
    };

    function ctrlSetting(_ctrl) {
        _ctrl.mouseover(function (e) {
            e = e || window.event;
            var _this = this;
            var _title = $(".titlewords", this).text();
            var _ctype = $(_this).attr("ctype");
            var _rowType = $(".ctrlbox", _this).attr("rowtype") || "0";
            /*0：不可调整宽度；1：可调整宽度*/
            if (!contains(this, e.relatedTarget || e.fromElement) && !((e.relatedTarget || e.fromElement) === this)) {
                var _title = '';//$(this).hasClass('cb_col_1')?'调窄':'调宽';
                $(this).append('<div class="options' + _rowType + '"><a class="a_btn_update" title="修改"></a><a class="a_btn_delete" title="删除"></a>' + (_rowType == "1" ? '<a class="a_btn_ajustwidth" title="' + _title + '"></a>' : '') + '</div>');
                $(".a_btn_update", this).click(function () {
                    if (_ctype == "customForm") {
                        _ctype = "customFormNew";
                    }
                    var box = control_Lib[_ctype].getUpdateBox(_ctype, _this, builderCtrlDlgBox);
                    $(this).parents(".fdctrl").find(".ctitletxt").addClass("ctrl-is-edit");
                    /*标记当前控件为正在编辑*/
                    $('.ctrl-editing').removeClass('ctrl-editing');
                    $(this).parents(".fdctrl").find(".ctrlbox").addClass("ctrl-editing");
                    showUpdateDialogBox({title: _title + "修改", content: box, updateCtrl: _this, ctype: _ctype});
                });
                var _topthis = this;
                $(".a_btn_delete", this).click(function () {

                    var box = $.MsgBox({
                        title: "确定删除",
                        content: "<p  style=\"font-size:14px;padding-bottom: 10px;\">您确定删除该" + _title + "控件？</p>",
                        isdrag: true,
                        showBtns: true,
                        confirmClick: function () {
                            var _baseid = util.urlParamToJson(window.location.href)['baseinfoid'];
                            $.ajax({
                                'url':i8_session.ajaxWfHost+ 'webajax/design/activity/GetProcLineByFieldID',
                                'data':{'procbaseid':_baseid,'fieldid':$(_topthis).find('.ctrlbox').attr('ctrl-name')||''},
                                'async':false,
                                'success':function(data){
                                    var _retObj = data.ReturnObject;
                                    if(!_retObj){
                                        $(_this).effect("fold", {
                                            to: {
                                                height: $(_this).height(),
                                                width: $(_this).width()
                                            }
                                        }, 100, function () {
                                            $(_this).remove();
                                        });
                                        //box.close();
                                        //return true;
                                    }else{
                                        //$(_this).remove();
                                        alert('抱歉，此字段已参与审批链设计，无法删除！');
                                    }
                                }
                            });
                            //box.close();
                            return true;
                        }
                    });
                    box.show();
                })
                $(".a_btn_ajustwidth", this).click(function () {
                    if ($(_this).is(".cb_col_1")) {
                        $(_this).removeClass("cb_col_1").addClass("cb_col_2").find('.a_btn_ajustwidth').attr('title', '调宽');
                    } else if ($(_this).is(".cb_col_2")) {
                        $(_this).removeClass("cb_col_2").addClass("cb_col_1").find('.a_btn_ajustwidth').attr('title', '调窄');
                    }
                })
            }
        }).mouseout(function (e) {
            e = e || window.event;
            if (!contains(this, e.relatedTarget || e.toElement) && !((e.relatedTarget || e.toElement) === this)) {
                $(".options1,.options0", this).remove();
            }
        });
        _ctrl.on('mouseover mouseout', '.a_btn_update,.a_btn_delete,.a_btn_ajustwidth', function () {
            return false;
        });

        return _ctrl;
    }

    /*封装修改弹出框*/
    function showUpdateDialogBox(setting) {
        setting = $.extend({title: "修改", content: null, updateCtrl: null, ctype: ""}, setting);
        var box = $.MsgBox({
            title: setting.title + "设置",
            content: setting.content,
            isdrag: true,
            showBtns: true,
            confirmClick: function () {
                if (control_Lib[setting.ctype]) {
                    // $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                    var submit = new submitInter(setting.ctype);
                    if (submit.ckform()) {
                        $(setting.updateCtrl).html(submit.ctrlObj());
                        /*单独执行控件filled方法【对已填充控件】*/
                        var control = control_Lib[setting.ctype];
                        if (control.filled) {
                            if (typeof control.filled == "function") {
                                control.filled($(setting.updateCtrl));
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                    $(".ctitletxt").removeClass("ctrl-is-edit");
                    /*标记当前控件为正在编辑*/
                    //return true;
                }
                else {
                    return false;
                }
            }
        });
        box.show();
        /*修改框弹出来*/
        if (control_Lib[setting.ctype].updateBoxShowed) {
            control_Lib[setting.ctype].updateBoxShowed(setting.updateCtrl);
        }

        var _original_config = $.parseJSON($.trim($("pre", setting.updateCtrl).text()));
        if (typeof _original_config == 'object') {
            $("#ck_needprint").prop({ checked: _original_config.IsPrint });
        }
//        console.log(_original_config)
//        console.log($("#ck_mustchecked"))
    }

    /*提交对象封装*/
    var comInputs = function () {
        var convertPY = require('./workflow_pinyin.js');
        this.title = $.trim($("#txt_ctrlTitleName").val());
        this.mustinput = $("#ck_mustchecked").is(":checked") || false;
        this.isparam = $("#ck_procNode").is(":checked") || false;
        this.isPrint = $("#ck_needprint").is(":checked") || false;
        this.crowType = 1; // $("#rd_totalRow").is(":checked") ? 1 : 2;
        this.startUserVisible = $('#ck_startuservisible').is(':checked')||false;
        this.autoIndex = $('#ck_rowindex').is(':checked')||false;
        this.fieldID = function () {
            //var fieldData = this.title;
            var pyName = convertPY.ConvertPinyin(this.title);
            //如果拼音转换失败，则进行特殊处理
            if(!pyName){
                pyName = 'ct-'+(+new Date());
            }
            $("#fd_designArea .ctrlbox").each(function () {
                if (!$(this).hasClass("ctrl-editing")) {
                    if ($(this).attr("ctrl-name") == pyName) {
                        pyName = pyName + _.uniqueId("_");
                    }
                }
            });
            return pyName;
        }
    }
    /*控件转换*/
    var newCtrlObj = function (_ctype) {
        var oRow = control_Lib[_ctype];
        var prinput = new oRow.inputs();
        comInputs.call(prinput);
        return oRow.cformat.call(prinput, _ctype);
    }
    /*公共验证*/
    var confirmSubmit = function (ct) {
        var _ctype = ct;
        var goNext = true;
        var ctrlName = $.trim($("#txt_ctrlTitleName").val());
        if ("|contentMark|separator".indexOf(ct) == -1) {/*排除内容备注控件的字段头验证*/
            if (ctrlName.length == 0) {
                alert('字段名称不能为空!');
                goNext = false;
                return false;
            }
            if (!isNaN(ctrlName.substring(0, 1))) {
                alert('字段名不能以数字开头！');
                goNext = false;
                return false;
            }
            var _white_list = util.workflowWhiteList;
            // var _white_list = /^[\u4e00-\u9fa5_a-zA-Z0-9@,\s]+$/ig;
            //var _validateResult = util.workflowInputVerify(ctrlName);
            _white_list.lastIndex = 0;
            if (!_white_list.test(ctrlName)) {
                //alert(_validateResult.tips);
                alert('字段名称包含非法字符！');
                goNext = false;
                return false;
            }
        }
        if (!control_Lib[ct].ckInputs()) {
            goNext = false;
            return false;
        }

        $("#fd_designArea .ctitletxt").each(function () {
            if ($.trim($(this).text()) == $.trim($("#txt_ctrlTitleName").val()) && !$(this).is(".ctrl-is-edit")) {
                alert('控件名已存在！');
                goNext = false;
                return false;
            }
        });
        return goNext;
    };

    function submitInter(_ctype) {
        this.ckform = function () {
            return confirmSubmit(_ctype);
        };
        this.ctrlObj = function () {
            return newCtrlObj(_ctype);
        };
        this.crowType = function () {
            var u_ips = new comInputs();
            return u_ips.crowType;
        };
    }

    function builderCtrlDlgBox(_ctype) {
        this.boxtpl = require('./template/form-dialogBox.tpl');
        this.ctype = _ctype;
        this.toBoxString = function () {
            var ctrlRows = control_Lib[this.ctype].propertyHtml();
            var dialogRender = template(this.boxtpl);
            return dialogRender({'prototypes': ctrlRows, _ctype: _ctype})
        }
    }

    /*控件列表自动加滚动条*/
    var controlsAutoScoll = function () {
        var _c_top = $("#fdclist").offset().top - $(document).scrollTop();
        var _c_c_height = $(window).height() - _c_top;
        var _c_height = $("#fdclist").height();
        if (_c_height > _c_c_height) {
            $("#fdclist").height(_c_c_height);
            //$("#fdclist").jkScrollBar({ pattern: 'jkscroll-simple' });
        }
    }

    //修正ie8下面不出现表单设计器的问题
    /*列表控件*/
    function ToolItem(setting) {
        this.CTYPE = setting.ctype || "";
        this.IPOS = setting.ipos || "0px 0px";
        this.NAME = setting.name || "ControlName";
        this.STYLE = setting.style || "";
    }

    ToolItem.prototype = {
        toObject: function () {
            var template = $('<div class="ctoolitem"><i></i><span></span></div>');
            $(template).attr("ctype", this.CTYPE);
            $(template).attr("style", this.STYLE);
            $("i", template).css({"background-position": this.IPOS});
            $("span", template).text(this.NAME);
            return template;
        }
    }

    /*创建弹出层*/
    var showMaskLayer = function () {
        var layerID = "div_canvas" + Math.random().toString().replace(".", "");
        var bodyHeight = document.body.scrollHeight - 40;
        var bgLayer = $('<div class="fd_bgcanvas" id="' + layerID + '"></div>')
        $("body").append(bgLayer);
        return layerID;
    };

    /*表单初始化*/
    exports.initFormDesigner = function (_setting) {
        var ACTION = util.getUrlParam('action');
        var FROM_ID = util.getUrlParam('id');
        var FROM_NAME = util.getUrlParam('name');
        var BASE_INFOID = util.getUrlParam('baseinfoid');
        //打印全局控制
        if(!orProcBaseInfo.Config || !orProcBaseInfo.Config.isUsePrintSet){
            $('body').append('<style>#ck_needprint,#ck_needprint_label{display:none!important;}</style>')
        }
        //var i8ui_lib=require('../../common/')
        $("#txt_span_formName").text(decodeURIComponent(FROM_NAME));
        //loadDataResource(true);
        var setting = $.extend({
            targetID: null, //单击元素对象ID，用来触发表单设计器
            DesignedOkay: function () {
            }, //表单设计器初始化完成回调
            originCtrl: null, //控件所存放容器ID
            formName: "--"//单个表单名
        }, _setting);
        setting.formName = $("#txt_name").val(); //表单名
        //if ($(".fd_bgcanvas").length == 0) {
        var layerid = showMaskLayer(); //弹出层，并返回弹出层ID
        var extralCName = [];//
        _.each(extra_ctrl, function (data) {
            ds_config[data.ctype] = data.cpath;
            extralCName.push(data.ctype.toLowerCase());
        });

        dep_ctrls = _.values(ds_config);
        /*动态社区加载控件结束*/
        require.async(dep_ctrls, function () {//异步加载指定控件
            var toolItemHtml = "", extCtrlHtml = "";
            var DataBase = arguments;
            for (var item = 0; item < DataBase.length; item++) {
                if (_.isObject(DataBase[item])) {
                    if (_.contains(extralCName, DataBase[item].ctype.toLowerCase())) {
                        extCtrlHtml += (new ToolItem({
                            ctype: DataBase[item].ctype,
                            ipos: DataBase[item].ipos,
                            name: DataBase[item].name,
                            style: DataBase[item].style
                        })).toObject()[0].outerHTML;
                    } else {
                        if (DataBase[item].ctype != "dataForm")/*排除固定明细列表*/
                            toolItemHtml += (new ToolItem({
                                ctype: DataBase[item].ctype,
                                ipos: DataBase[item].ipos,
                                name: DataBase[item].name,
                                style: DataBase[item].style
                            })).toObject()[0].outerHTML;
                    }
                }
            }
            //$("#fdclist").html(toolItemHtml);
            $("#fdclist-base-controls").html(toolItemHtml);
            $("#fdclist-ext-controls").html(extCtrlHtml);
            $('.datasource-loading').hide();
            var $windowParent=$(window.parent);
            var windowParentH=$windowParent.height();
            var _maxH=windowParentH-90> 500 ? windowParentH-90 :500;
            $('.fdfb_left').css('max-height',_maxH).mCustomScrollbar({
                theme: "minimal-dark" ,
                axis:"yx",
                autoExpandScrollbar:true,
                advanced:{
                    autoExpandHorizontalScroll:true,
                    autoScrollOnFocus:true
                }
            });
            /*加载控件*/
            //}
            var ctrlDataLoadInit = $('<div class="controlInitLayer"></div><div class="ctrl-loadingTxt">正在初始化...</div>');
            $("#fdclist_boxer").append(ctrlDataLoadInit);
            for (var i = 0; i < arguments.length; i++) {
                control_Lib[arguments[i].ctype] = arguments[i];
            }
            //设计器为编辑状态
            //if(ACTION=="edit") {
            $.get('../json/getformbyprocbaseid.json', {baseInfoID: BASE_INFOID}, function (response) {
                if (response.Result && response.ReturnObject) {
                    var ctrlHtml = response.ReturnObject.MetaData;
                    FROM_ID = response.ReturnObject.ID;
                    ctrlHtml = ctrlHtml.replace(/ctype="separator" style="[\s\w:;]+"/ig, 'ctype="separator"');
                    /*将原分隔线内联样式删除掉*/
                    document.getElementById("fd_designArea").innerHTML = ctrlHtml;
                    var config_script = document.getElementById("formconfigscript").innerHTML;
                    if (config_script) {
                        eval(config_script);
                        var totalConfig = {};
                        if (window.form_config) {
                            for (var i = 0; i < window.form_config.length; i++) {
                                if (!totalConfig[window.form_config[i].fieldName]) {
                                    var ctrl_config = window.form_config[i].totalConfig;
                                    ctrl_config.FieldConfig = $.parseJSON(ctrl_config.FieldConfig);
                                    totalConfig[window.form_config[i].fieldName] = ctrl_config;
                                }
                            }
                        }
                        $("#fd_designArea").find(".fdctrl").each(function () {
                            ctrlSetting($(this));
                            /*根据原ctrl-name,来读总配置还原单个控件<pre>信息*/
                            var ctrlbox = $(this).find(".ctrlbox");
                            ctrlbox.find("pre").remove();
                            var ctrl_name = ctrlbox.attr("ctrl-name");
                            if (ctrl_name) {
                                var configJson = totalConfig[ctrl_name];
                                var ctrl_config = $.JSONString(configJson);
                                if(configJson.ctype == 'customFormNew' && (configJson.FieldConfig||{}).autoIndex){
                                    $('<th class="datalist-notsubmit">序号</th>').insertBefore($(this).find('th').eq(0));
                                    $('<td class="datalist-notsubmit"></td>').insertBefore($(this).find('.gridSummaryRow').find('td').eq(0));
                                }
                                ctrlbox.append("<pre>" + ctrl_config + "</pre>");
                            }
                        });
                    }
                } else {
                    if (!_.isNull(response.Description) || !_.isEmpty(response.Description)) {
                        alert(response.Description);
                    }
                    document.getElementById("fd_designArea").innerHTML = "";
                }
            }, "json")
            //}else{
            //document.getElementById("fd_designArea").innerHTML="";
            //}

            dataCache.getMainSource(function () {
                ctrlDataLoadInit.remove();//加载数据源
                //控件库/数据源之间Tab切换
                $(".fdfb_menu .fdfb_menu_item").bind("click", function () {
                    if (!$(this).hasClass("curtmenuitem")) {
                        $(".fdfb_menu .fdfb_menu_item").removeClass("curtmenuitem");
                        if ($(this).attr("tag") == "ctrl") {
                            $("#fdclist_boxer").show();
                            $("#cRec_boxer").hide();
                            //var link = $.DataSourceInit();
                            //link.reloadDataSource();/*重新加载数据源*/

                        } else if ($(this).attr("tag") == "dsrc") {
                            $("#fdclist_boxer").hide();
                            $("#cRec_boxer").show();
                            //$('#fdcdls_mtype').mCustomScrollbar({ theme: "dark-3" });//$('#fdcdls_mtype').jkScrollBar({ pattern: 'jkscroll-simple' });
                            require('./designer-datasource.js');
                        }
                        $(this).addClass("curtmenuitem");
                    }
                });
            })

            initLeftControlMTRightPanel();
            /*初始化左侧控件可拖动至右侧*/
            /*表单设计保存*/
            $("#btn_savedesigndata").click(function () {
                submitData($("#fd_designArea"));
            });
            $("#btn_revertwindow").click(function () {
                if (window.parent.formCancel) {
                    window.parent.formCancel();
                }
            });
        });

        /*初始化左侧控件可拖动至右侧*/
        function initLeftControlMTRightPanel() {
            util.i8loadjs(i8_session.resWfHost + 'default/javascripts/common/jquery-ui-custom.min.js', function () {
                $("#fdclist div.ctoolitem").mouseover(function (e) {
                    $(this).addClass("lihover");
                }).mouseout(function () {
                    $(this).removeClass("lihover");
                });
                //控件折叠效果
                $("#fdclist div.control-headline").click(function () {
                    var faBox = $(this).parents("div.controls-box");
                    if (faBox.attr("ext") == "true") {
                        $(this).removeClass("headhover");
                        faBox.attr("ext", "false").find("div.control-body").toggle(200);
                        faBox.siblings("div.controls-box").each(function () {
                            if ($(this).attr("ext") == "true") {
                                $(this).attr("ext", "false").find("div.control-headline").removeClass("headhover");
                                $(this).find("div.control-body").toggle(200);
                            }
                        })
                    } else {
                        $(this).addClass("headhover");
                        faBox.attr("ext", "true").find("div.control-body").toggle(200);
                        faBox.siblings("div.controls-box").each(function () {
                            if ($(this).attr("ext") == "true") {
                                $(this).attr("ext", "false").find("div.control-headline").removeClass("headhover");
                                $(this).find("div.control-body").toggle(200);
                            }
                        })
                    }
                });
                $("#fdclist div.ctoolitem").draggable({
                    revert: 'invalid',
                    opacity: 0.7,
                    helper: 'clone',
                    cursor: 'move',
                    scope: 'drop',
                    connectToSortable: $("#fd_designArea")
                }); //可拖拽移动
                $("#fd_designArea").sortable({
                    placeholder: "ui-place-highlight",
                    item: ".ctoolitem",
                    change: function (event, ui) {
                    },
                    stop: function (event, ui) {
                        if (ui.item[0].className.indexOf("ctoolitem") > -1) {
                            var resetObj = ui.item.removeClass("ctoolitem").addClass("fdctrl").empty().hide();
                            /*重置拖拽对象*/
                            var _ctype = resetObj.attr("ctype");
                            var box = $.MsgBox({
                                title: control_Lib[_ctype].name + "设置",
                                content: (new builderCtrlDlgBox(_ctype)).toBoxString(), //render({'prototypes':control_Lib[_ctype].box[0]}),// control_Lib[_ctype].box.,
                                isdrag: true,
                                showBtns: true,
                                confirmClick: function () {
                                    var submit = new submitInter(_ctype);
                                    if (submit.ckform()) {
                                        var c = resetObj.append(submit.ctrlObj()).show().addClass("cb_col_" + submit.crowType());
                                        ctrlSetting(c);
                                        /*单独执行控件filled方法【对已填充控件】*/
                                        var control = control_Lib[_ctype];
                                        if (control.filled) {
                                            if (typeof control.filled == "function") {
                                                control.filled(c);
                                            }
                                        }
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                },
                                cancelClick: function () {
                                    resetObj.remove();
                                    /*移除原拖拽对象*/
                                }
                            });
                            box.show();
                            /*打开窗口后执行*/
                            if (control_Lib[_ctype].hasOwnProperty("opened")) {
                                control_Lib[_ctype].opened();
                            }
                            $("#txt_ctrlTitleName").focus();
                        }
                    }
                });
            });
        }

        function getDefaultValue(control, config) {

            var _$me = $(control),
                _config = config || {},
                _ctype = (_config.ctype || '').toLowerCase(),
                _retValue = '';
            switch (_ctype) {

                case "simpletextbox":
                    _retValue = _$me.find('input').val();
                    break;

                case "mutitextbox":
                    _retValue =  _$me.find('textarea').val();
                    break;

                default:
                    _retValue = '';
                    break;
            }

            return _retValue;
        }

        /*数据保存*/
        function submitData(formData) {
            //移除不需要提交的表头
            formData.find('.datalist-notsubmit').remove();
            var fieldData = "";
            $(".fdctrl .ctitletxt", formData).each(function () {
                fieldData += encodeURIComponent($.trim($(this).text())) + "|";
            });
            if (fieldData.length < 1) {
                alert('表单还未设计');
                return;
            }

            var saveboxhave = dlgBox.showNoTitle({
                cont: '<div style="padding:10px;height:35px;"><div style="float:left"><img src="' + i8_session.resWfHost + 'default/images/o_loading.gif" alt="请稍后..."/></div><div style="float:left;line-height:35px;">　正在保存...</div></div>',
                nomask: true
            });
            var _controlData = [],_engineParams=[];
            /*存储总配置*/
            /*拼装javascript数据文件*/
            $(".fdctrl", formData).each(function (e) {
                if ($(this)[0].style.display == "none") {
                    return;
                }
                var thisConfig = $.parseJSON($(this).find("pre").html());
                if (thisConfig) {

                    var _defaultValue = getDefaultValue(this, thisConfig);
                    thisConfig.DefaultValue = (!!_defaultValue?_defaultValue:'');
                    thisConfig['SortIndex'] = e;
                    var _fieldConfig =  thisConfig.FieldConfig,_thisFieldConfig = null;
                    thisConfig.FieldConfig = $.JSONString(thisConfig.FieldConfig).toString();

                    thisConfig.FieldConfig = thisConfig.FieldConfig.replace(/\"/g, "\\\"");
                    //设置额外的参数
                    var saveFieldid = thisConfig.FieldID.replace(/\-/g, "");
//                    if($.isArray(thisConfig.ProcDataFieldConfig)){
//                        _.each(thisConfig.ProcDataFieldConfig,function(item){
//                            if(!$.isEmptyObject(item.FieldConfig)){
//                                item.FieldConfig = $.JSONString(item.FieldConfig).toString().replace(/\"/g, "\\\"");
//                            }
//                            _controlData.push({"fieldName": item.FieldID, "totalConfig":item });//\\($.JSONString(item).toString()).replace(/\"/g, "\\\"")
//                        });
//                       //  thisConfig.ProcDataFieldConfig =  $.JSONString(thisConfig.ProcDataFieldConfig).toString().replace(/\"/g, "\\\"");
//                        delete thisConfig.ProcDataFieldConfig;
//                    }
                    _controlData.push({"fieldName": saveFieldid, "totalConfig": thisConfig});
                    try {
                        _thisFieldConfig = $.parseJSON(thisConfig.FieldConfig.replace(/\\/g,""));
                    }catch(ex){
                        alert('配置有误')
                    }
                    if(_thisFieldConfig) {
                        var proc_params = _thisFieldConfig.ProcessParam;
                        if (proc_params) {
                            _.each(proc_params, function (item) {
                                _engineParams.push(item);//_engineParams.push({"fieldName": item.FieldID, "totalConfig": item});
                            })
                        } else if (thisConfig.IsProcDataField) {
                            _engineParams.push(thisConfig);//_engineParams.push({"fieldName": thisConfig.FieldID, "totalConfig": thisConfig});
                        }
                    }
                    //"paymentProjectVerification":true,"paymentProjectApplication":true,"paymentVerification":true,"paymentApplication":true
                    var paramJson = {"fullmember":true,"paymentPay":true,"paymentIncome":true,"customFormNew":true,"OverTimeComponent":true,"VacationSummaryComponent":true,"cancelVacationComponent":true};
                    var paymentJson = {"paymentverification":true,"paymentapplication":true,"paymentprojectapplication":true,"paymentprojectverification":true};
                    var hasParamInTable = {"overtimecomponent":true,"vacationsummarycomponent":true,"cancelvacationcomponent":true,"userinfocomponent":true,"paymentincome":true,"paymentpay":true,"paymentverification":true,"paymentapplication":true,"paymentprojectapplication":true,"paymentprojectverification":true};

                    //如果表格中有流程参数
                    if(hasParamInTable[(thisConfig.ctype||"").toLowerCase()]){
                        // var _fieldConfig =((thisConfig||{}).FieldConfig);
//                        if(!$.isPlainObject(_fieldConfig)){
//                            _fieldConfig = $.parseJSON(_fieldConfig);
//                        }
                        var _configArr = _fieldConfig.GridConfig||[];
                        for(var i=0;i<_configArr.length;i++){
                            if(paymentJson[(thisConfig.ctype||"").toLowerCase()] && _configArr[i].issum && _configArr[i].isparam){
                                var config = {
                                    ctype: _configArr[i].colType,
                                    FieldType:controlEnum.sumcalctor,
                                    FieldID: 'listSUM'+_configArr[i].colName+'_'+ thisConfig.FieldID,//inputBox.attr("tagname"),
                                    FieldName: "合计金额",//inputBox.attr("tagtitle"),
                                    DefaultValue: '',
                                    DataType: 1,//DataType为1，表示该值类型为整型数字类型
                                    IsProcDataField: true,
                                    IsBindData: false,
                                    IsRequire: false,
                                    //IsSubParam:true,
                                    DataSource: '',
                                    // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
                                    FieldConfig: ('{"sType":"1","parentField":"' + thisConfig.FieldID + '","calcField": "' + _configArr[i].colName + '" ,"calcIndex":"' + i + '"}').replace(/"/g, "\\\""),
                                    SortIndex: _controlData.length,
                                    isvisible: "hidden"
                                };
                                _controlData.push({"fieldName": 'listSUM'+_configArr[i].colName+'_'+ thisConfig.FieldID, "totalConfig": config});
                            }
                            else if(_configArr[i].isparam){
                                var config = {
                                    ctype: _configArr[i].colType,
                                    FieldType:controlEnum[ _configArr[i].colType.toLowerCase()],
                                    FieldID: thisConfig.FieldID+'_col_'+i+'_'+_configArr[i].colName,//inputBox.attr("tagname"),
                                    FieldName: _configArr[i].colText,//inputBox.attr("tagtitle"),
                                    DefaultValue: '',
                                    DataType: 0,//DataType为1，表示该值类型为整型数字类型
                                    IsProcDataField: true,
                                    IsBindData: false,
                                    IsRequire: false,
                                    //IsSubParam:true,
                                    DataSource: '',
                                    // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
                                    FieldConfig: ('{"sType":"1","parentField":"' + thisConfig.FieldID + '","calcField": "' + _configArr[i].colName + '" ,"calcIndex":"' + i + '"}').replace(/"/g, "\\\""),
                                    SortIndex: _controlData.length,
                                    isvisible: "hidden"
                                };
                                _controlData.push({"fieldName": thisConfig.FieldID+'_col_'+i+'_'+_configArr[i].colName, "totalConfig": config});
                            }
                        }
                    }
                    if((thisConfig.ctype ||'').toLowerCase() == "userinfocomponent"){
                        if(!!thisConfig.IsSubparam){
                            var _positionId = '';
                            var _retObj = _.find( window["mainSourceList"],function(item){ return item.Type == 2});
                            _positionId = (_retObj||{}).ID ||'';
                            //增加人员信息
                            _controlData.push({"fieldName": thisConfig.FieldID+'_departmentofcreator', "totalConfig":{
                                ctype: controlDict.orgselector,
                                FieldType: controlEnum.orgselector,//人员基础信息显示控件
                                FieldID: thisConfig.FieldID+'_departmentofcreator',
                                FieldName: '发起人所在部门',
                                DefaultValue: '',
                                DataType: 0,
                                IsProcDataField:true ,
                                IsBindData: false,
                                IsRequire:false ,
                                DataSource: '',
                                FieldConfig:('{"sType":"1", "parentField":"'+thisConfig.FieldID+'","calcField":"'+thisConfig.FieldID+'_departmentofcreator"}').replace(/"/g, "\\\""),
                                SortIndex: 0,
                                isvisible: ( "hidden")
                            }});
                            //增加部门信息
                            _controlData.push({"fieldName": thisConfig.FieldID+'_levelofcreator', "totalConfig":{
                                ctype:controlDict.selectoption,
                                FieldType: controlEnum.selectoption,//人员基础信息显示控件
                                FieldID:  thisConfig.FieldID+'_levelofcreator',
                                FieldName: '职级',
                                DefaultValue: '',
                                FieldConfig:('{"sType":"1", "parentField":"'+thisConfig.FieldID+'","calcField":"'+thisConfig.FieldID+'_levelofcreator"}').replace(/"/g, "\\\""),
                                DataType:1,
                                IsProcDataField: true,
                                IsBindData: false,
                                IsRequire: false,
                                DataSource: _positionId,
                                SortIndex: 0,
                                isvisible: ("hidden")
                            }});
                        }
//
                        if(!!thisConfig.IsDelegate){
                            _controlData.push({"fieldName": thisConfig.FieldID+'_creator', "totalConfig":{  ctype:controlDict.userkey,
                                FieldType: controlEnum.userkey,//人员基础信息显示控件
                                FieldID:  thisConfig.FieldID+'_creator',
                                FieldName: '代理人',
                                DefaultValue: '',
                                DataType: 0,
                                IsProcDataField: true,
                                IsBindData: false,
                                IsRequire: false ,
                                DataSource: '',
                                FieldConfig:('{"sType":"1", "parentField":"'+thisConfig.FieldID+'","calcField":"'+thisConfig.FieldID+'_creator"}').replace(/"/g, "\\\""),
                                SortIndex: 0,
                                isvisible: ( "hidden")}});

                        }

                    }
                    else if(thisConfig.ctype == 'fullmember' && !!thisConfig.subparam){
                        var _positionId = '';
                        var _retObj = _.find( window["mainSourceList"],function(item){ return item.Type == 2});
                        _positionId = _retObj.ID;
                        var config = {
                            ctype: 'selectoption',
                            FieldType: 3,
                            FieldID: thisConfig.FieldID+'_position',
                            FieldName:"转正人职级" ,
                            DefaultValue: '',
                            DataType: 1,//DataType为1，表示该值类型为整型数字类型
                            IsProcDataField: true,
                            IsBindData: false,
                            IsRequire: false,
                            IsSubParam:true,
                            BelongTo:'fullmember',
                            DataSource: _positionId,
                            ParentField:thisConfig.FieldID,
                            // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
                            FieldConfig: ('{"parentField":"' + thisConfig.FieldID + '","calcField": "' + 'position' + '" ,"calcIndex":"' + (0) + '"}').replace(/"/g, "\\\""),
                            SortIndex: _controlData.length,
                            isvisible: "hidden"
                        };
                        _controlData.push({"fieldName": thisConfig.FieldID+'_position', "totalConfig": config});
                        var config = {
                            ctype: 'userkey',
                            FieldType: 6,
                            FieldID: thisConfig.FieldID+'_userinfo',//inputBox.attr("tagname"),
                            FieldName: '转正人',//inputBox.attr("tagtitle"),
                            DefaultValue: '',
                            DataType: 0,//DataType为1，表示该值类型为整型数字类型
                            IsProcDataField: true,
                            IsBindData: false,
                            IsRequire: false,
                            IsSubParam:true,
                            BelongTo:'fullmember',
                            DataSource: '',
                            ParentField:thisConfig.FieldID,
                            // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
                            FieldConfig: ('{"sType":"1","parentField":"' + thisConfig.FieldID + '","calcField": "' + 'userinfo' + '" ,"calcIndex":"' + (1) + '"}').replace(/"/g, "\\\""),
                            SortIndex: _controlData.length,
                            isvisible: "hidden"
                        };
                        _controlData.push({"fieldName": thisConfig.FieldID+'_userinfo', "totalConfig": config});

                    }

                    if (paramJson[thisConfig.ctype]) {//如果是表格控件，则去遍历控件中的合计字段
                        /*合计字段，重新拼对象*/
                        $("input.grid_col_total_inputvalue,.paymentsummary_total_inputvalue,.vacationsummary_total_inputvalue,.control_summary_total_amount", $(this)).each(function (e) {
                            var inputBox = $(this);
                            var _tagName = inputBox.attr('tagname');
                            _tagName = _tagName.replace('__', '_'); //处理老数据 将下划线替换
                            var _colInfo = _tagName.replace('listSUM', '');
                            var _lastIndex = _colInfo.lastIndexOf('_');
                            var _colName = _colInfo.substr(0, _lastIndex);
                            var _tableName = _colInfo.substr(_lastIndex + 1);
                            var _nameArr = _colName.split('_');

                            var _colIndex = 0;
                            if (_nameArr.length > 1) {
                                _colIndex = _nameArr[1];
                            }

                            var isparam =  inputBox.attr("isparam") === "true" ? true : false;
                            //如果不是input 按钮，则默认流程参数就是 true
                            if(!inputBox.is('input')){
                                isparam = true;
                            }



                            var config = {
                                ctype: 'SumCalctor',
                                FieldType: 16,
                                FieldID: inputBox.attr("tagname"),
                                FieldName: inputBox.attr("tagtitle"),
                                DefaultValue: '',
                                DataType: 1,//DataType为1，表示该值类型为整型数字类型
                                IsProcDataField: isparam,
                                IsBindData: false,
                                IsRequire: false,
                                DataSource: '',
                                //IsSubParam:true,
                                // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
                                FieldConfig: ('{"parentField":"' + _tableName + '","calcField": "' + _colName + '" ,"calcIndex":"' + (_colIndex) + '"}').replace(/"/g, "\\\""),
                                SortIndex: _controlData.length,
                                isvisible: "hidden"
                            };
                            _controlData.push({"fieldName": inputBox.attr("tagname"), "totalConfig": config});

//                            if(paymentJson[thisConfig.ctype]){
//                                var config = {
//                                    ctype: 'userkey',
//                                    FieldType: 6,
//                                    FieldID: _tableName+'_col_16_costcenterPrincipal',//inputBox.attr("tagname"),
//                                    FieldName: '核算中心负责人',//inputBox.attr("tagtitle"),
//                                    DefaultValue: '',
//                                    DataType: 0,//DataType为1，表示该值类型为整型数字类型
//                                    IsProcDataField: true,
//                                    IsBindData: false,
//                                    IsRequire: false,
//                                    DataSource: '',
//                                    IsSubParam:true,
//                                    // FieldConfig: '{parentField:"'+_tableName+'",calcField:"'+_colName+'",calcIndex:"'+_colIndex+'"}',
//                                    FieldConfig: ('{"sType":"1","parentField":"' + _tableName + '","calcField": "' + _colName + '" ,"calcIndex":"' + (16) + '"}').replace(/"/g, "\\\""),
//                                    SortIndex: _controlData.length,
//                                    isvisible: "hidden"
//                                };
//                                _controlData.push({"fieldName": _tableName+'_col_16_costcenterPrincipal', "totalConfig": config});
//
//                            }

                        });
                    }

                }
            });
            var totalConfig = '<script type="text/javascript" id="formconfigscript">window.form_config=' + $.JSONString(_controlData) + ';window.form_params=' +  $.JSONString(_engineParams) + ';window.form_version="3.0.1";</script>';
            var _newDataForm = formData.clone();
            _newDataForm.find("pre").remove(); //清空原控制临时保存的config信息
            var _saveFormData = _newDataForm.html().replace(/<script(.|\n)*\/script>\s*/ig, "") + totalConfig;
            try{
                var controls = _.pluck(_controlData,"totalConfig");
                var usrCtrlExits = _.findWhere(controls,{"ctype":"UserInfoComponent"});
                if(usrCtrlExits.FieldConfig){
                    var userInfoConfig = $.parseJSON(usrCtrlExits.FieldConfig.replace(/\\/g,""));
                    if(userInfoConfig.objExt==1){
                        var asts = _.filter(controls,function(ctrl){
                            return ctrl.ctype == "assetsReceived"||ctrl.ctype == "assetsReturned";
                        })
                        if(asts.length>0){
                            saveboxhave.close();
                            alert('资产领用与归还控件，不能代理发起！请取消人员信息控件代理发起设置！');
                            return;
                        }
                    }
                }
            }catch(ex){

            }
            $.post(i8_session.ajaxWfHost + 'webajax/form/saveforms', {
                fData: encodeURIComponent(_saveFormData),
                baseInfoID: BASE_INFOID,
                formid: FROM_ID
            }, function (response) {
                if (response.Result) {
                    var js_wf_BaseInfoID = response.ReturnObject; //更新ID
                    //designedOkayAction(formData.clone());
                    saveboxhave.close();
                    alert('保存成功！');
                    window.parent.location.hash=js_wf_BaseInfoID;
                    if (window.parent.formSaveCompleted) {
                        window.parent.formSaveCompleted({
                            result: true,
                            data: formData.clone(),
                            newBaseInfoID: js_wf_BaseInfoID
                        });
                    }
                } else {
                    if (window.parent.formSaveCompleted) {
                        window.parent.formSaveCompleted({result: false, data: formData.clone()});
                    }
                }
            }, "json");
        }
    };


});