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
    /*��������*/
    /*�ύ��������*/
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
            /*0�����ɵ�����ȣ�1���ɵ������*/
            if (!contains(this, e.relatedTarget || e.fromElement) && !((e.relatedTarget || e.fromElement) === this)) {
                var _title = '';//$(this).hasClass('cb_col_1')?'��խ':'����';
                $(this).append('<div class="options' + _rowType + '"><a class="a_btn_update" title="�޸�"></a><a class="a_btn_delete" title="ɾ��"></a>' + (_rowType == "1" ? '<a class="a_btn_ajustwidth" title="' + _title + '"></a>' : '') + '</div>');
                $(".a_btn_update", this).click(function () {
                    if (_ctype == "customForm") {
                        _ctype = "customFormNew";
                    }
                    var box = control_Lib[_ctype].getUpdateBox(_ctype, _this, builderCtrlDlgBox);
                    $(this).parents(".fdctrl").find(".ctitletxt").addClass("ctrl-is-edit");
                    /*��ǵ�ǰ�ؼ�Ϊ���ڱ༭*/
                    $('.ctrl-editing').removeClass('ctrl-editing');
                    $(this).parents(".fdctrl").find(".ctrlbox").addClass("ctrl-editing");
                    showUpdateDialogBox({title: _title + "�޸�", content: box, updateCtrl: _this, ctype: _ctype});
                });
                var _topthis = this;
                $(".a_btn_delete", this).click(function () {

                    var box = $.MsgBox({
                        title: "ȷ��ɾ��",
                        content: "<p  style=\"font-size:14px;padding-bottom: 10px;\">��ȷ��ɾ����" + _title + "�ؼ���</p>",
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
                                        alert('��Ǹ�����ֶ��Ѳ�����������ƣ��޷�ɾ����');
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
                        $(_this).removeClass("cb_col_1").addClass("cb_col_2").find('.a_btn_ajustwidth').attr('title', '����');
                    } else if ($(_this).is(".cb_col_2")) {
                        $(_this).removeClass("cb_col_2").addClass("cb_col_1").find('.a_btn_ajustwidth').attr('title', '��խ');
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

    /*��װ�޸ĵ�����*/
    function showUpdateDialogBox(setting) {
        setting = $.extend({title: "�޸�", content: null, updateCtrl: null, ctype: ""}, setting);
        var box = $.MsgBox({
            title: setting.title + "����",
            content: setting.content,
            isdrag: true,
            showBtns: true,
            confirmClick: function () {
                if (control_Lib[setting.ctype]) {
                    // $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                    var submit = new submitInter(setting.ctype);
                    if (submit.ckform()) {
                        $(setting.updateCtrl).html(submit.ctrlObj());
                        /*����ִ�пؼ�filled�������������ؼ���*/
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
                    /*��ǵ�ǰ�ؼ�Ϊ���ڱ༭*/
                    //return true;
                }
                else {
                    return false;
                }
            }
        });
        box.show();
        /*�޸Ŀ򵯳���*/
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

    /*�ύ�����װ*/
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
            //���ƴ��ת��ʧ�ܣ���������⴦��
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
    /*�ؼ�ת��*/
    var newCtrlObj = function (_ctype) {
        var oRow = control_Lib[_ctype];
        var prinput = new oRow.inputs();
        comInputs.call(prinput);
        return oRow.cformat.call(prinput, _ctype);
    }
    /*������֤*/
    var confirmSubmit = function (ct) {
        var _ctype = ct;
        var goNext = true;
        var ctrlName = $.trim($("#txt_ctrlTitleName").val());
        if ("|contentMark|separator".indexOf(ct) == -1) {/*�ų����ݱ�ע�ؼ����ֶ�ͷ��֤*/
            if (ctrlName.length == 0) {
                alert('�ֶ����Ʋ���Ϊ��!');
                goNext = false;
                return false;
            }
            if (!isNaN(ctrlName.substring(0, 1))) {
                alert('�ֶ������������ֿ�ͷ��');
                goNext = false;
                return false;
            }
            var _white_list = util.workflowWhiteList;
            // var _white_list = /^[\u4e00-\u9fa5_a-zA-Z0-9@,\s]+$/ig;
            //var _validateResult = util.workflowInputVerify(ctrlName);
            _white_list.lastIndex = 0;
            if (!_white_list.test(ctrlName)) {
                //alert(_validateResult.tips);
                alert('�ֶ����ư����Ƿ��ַ���');
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
                alert('�ؼ����Ѵ��ڣ�');
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

    /*�ؼ��б��Զ��ӹ�����*/
    var controlsAutoScoll = function () {
        var _c_top = $("#fdclist").offset().top - $(document).scrollTop();
        var _c_c_height = $(window).height() - _c_top;
        var _c_height = $("#fdclist").height();
        if (_c_height > _c_c_height) {
            $("#fdclist").height(_c_c_height);
            //$("#fdclist").jkScrollBar({ pattern: 'jkscroll-simple' });
        }
    }

    //����ie8���治���ֱ������������
    /*�б�ؼ�*/
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

    /*����������*/
    var showMaskLayer = function () {
        var layerID = "div_canvas" + Math.random().toString().replace(".", "");
        var bodyHeight = document.body.scrollHeight - 40;
        var bgLayer = $('<div class="fd_bgcanvas" id="' + layerID + '"></div>')
        $("body").append(bgLayer);
        return layerID;
    };

    /*����ʼ��*/
    exports.initFormDesigner = function (_setting) {
        var ACTION = util.getUrlParam('action');
        var FROM_ID = util.getUrlParam('id');
        var FROM_NAME = util.getUrlParam('name');
        var BASE_INFOID = util.getUrlParam('baseinfoid');
        //��ӡȫ�ֿ���
        if(!orProcBaseInfo.Config || !orProcBaseInfo.Config.isUsePrintSet){
            $('body').append('<style>#ck_needprint,#ck_needprint_label{display:none!important;}</style>')
        }
        //var i8ui_lib=require('../../common/')
        $("#txt_span_formName").text(decodeURIComponent(FROM_NAME));
        //loadDataResource(true);
        var setting = $.extend({
            targetID: null, //����Ԫ�ض���ID�����������������
            DesignedOkay: function () {
            }, //���������ʼ����ɻص�
            originCtrl: null, //�ؼ����������ID
            formName: "--"//��������
        }, _setting);
        setting.formName = $("#txt_name").val(); //����
        //if ($(".fd_bgcanvas").length == 0) {
        var layerid = showMaskLayer(); //�����㣬�����ص�����ID
        var extralCName = [];//
        _.each(extra_ctrl, function (data) {
            ds_config[data.ctype] = data.cpath;
            extralCName.push(data.ctype.toLowerCase());
        });

        dep_ctrls = _.values(ds_config);
        /*��̬�������ؿؼ�����*/
        require.async(dep_ctrls, function () {//�첽����ָ���ؼ�
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
                        if (DataBase[item].ctype != "dataForm")/*�ų��̶���ϸ�б�*/
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
            /*���ؿؼ�*/
            //}
            var ctrlDataLoadInit = $('<div class="controlInitLayer"></div><div class="ctrl-loadingTxt">���ڳ�ʼ��...</div>');
            $("#fdclist_boxer").append(ctrlDataLoadInit);
            for (var i = 0; i < arguments.length; i++) {
                control_Lib[arguments[i].ctype] = arguments[i];
            }
            //�����Ϊ�༭״̬
            //if(ACTION=="edit") {
            $.get('../json/getformbyprocbaseid.json', {baseInfoID: BASE_INFOID}, function (response) {
                if (response.Result && response.ReturnObject) {
                    var ctrlHtml = response.ReturnObject.MetaData;
                    FROM_ID = response.ReturnObject.ID;
                    ctrlHtml = ctrlHtml.replace(/ctype="separator" style="[\s\w:;]+"/ig, 'ctype="separator"');
                    /*��ԭ�ָ���������ʽɾ����*/
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
                            /*����ԭctrl-name,���������û�ԭ�����ؼ�<pre>��Ϣ*/
                            var ctrlbox = $(this).find(".ctrlbox");
                            ctrlbox.find("pre").remove();
                            var ctrl_name = ctrlbox.attr("ctrl-name");
                            if (ctrl_name) {
                                var configJson = totalConfig[ctrl_name];
                                var ctrl_config = $.JSONString(configJson);
                                if(configJson.ctype == 'customFormNew' && (configJson.FieldConfig||{}).autoIndex){
                                    $('<th class="datalist-notsubmit">���</th>').insertBefore($(this).find('th').eq(0));
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
                ctrlDataLoadInit.remove();//��������Դ
                //�ؼ���/����Դ֮��Tab�л�
                $(".fdfb_menu .fdfb_menu_item").bind("click", function () {
                    if (!$(this).hasClass("curtmenuitem")) {
                        $(".fdfb_menu .fdfb_menu_item").removeClass("curtmenuitem");
                        if ($(this).attr("tag") == "ctrl") {
                            $("#fdclist_boxer").show();
                            $("#cRec_boxer").hide();
                            //var link = $.DataSourceInit();
                            //link.reloadDataSource();/*���¼�������Դ*/

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
            /*��ʼ�����ؼ����϶����Ҳ�*/
            /*����Ʊ���*/
            $("#btn_savedesigndata").click(function () {
                submitData($("#fd_designArea"));
            });
            $("#btn_revertwindow").click(function () {
                if (window.parent.formCancel) {
                    window.parent.formCancel();
                }
            });
        });

        /*��ʼ�����ؼ����϶����Ҳ�*/
        function initLeftControlMTRightPanel() {
            util.i8loadjs(i8_session.resWfHost + 'default/javascripts/common/jquery-ui-custom.min.js', function () {
                $("#fdclist div.ctoolitem").mouseover(function (e) {
                    $(this).addClass("lihover");
                }).mouseout(function () {
                    $(this).removeClass("lihover");
                });
                //�ؼ��۵�Ч��
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
                }); //����ק�ƶ�
                $("#fd_designArea").sortable({
                    placeholder: "ui-place-highlight",
                    item: ".ctoolitem",
                    change: function (event, ui) {
                    },
                    stop: function (event, ui) {
                        if (ui.item[0].className.indexOf("ctoolitem") > -1) {
                            var resetObj = ui.item.removeClass("ctoolitem").addClass("fdctrl").empty().hide();
                            /*������ק����*/
                            var _ctype = resetObj.attr("ctype");
                            var box = $.MsgBox({
                                title: control_Lib[_ctype].name + "����",
                                content: (new builderCtrlDlgBox(_ctype)).toBoxString(), //render({'prototypes':control_Lib[_ctype].box[0]}),// control_Lib[_ctype].box.,
                                isdrag: true,
                                showBtns: true,
                                confirmClick: function () {
                                    var submit = new submitInter(_ctype);
                                    if (submit.ckform()) {
                                        var c = resetObj.append(submit.ctrlObj()).show().addClass("cb_col_" + submit.crowType());
                                        ctrlSetting(c);
                                        /*����ִ�пؼ�filled�������������ؼ���*/
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
                                    /*�Ƴ�ԭ��ק����*/
                                }
                            });
                            box.show();
                            /*�򿪴��ں�ִ��*/
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

        /*���ݱ���*/
        function submitData(formData) {
            //�Ƴ�����Ҫ�ύ�ı�ͷ
            formData.find('.datalist-notsubmit').remove();
            var fieldData = "";
            $(".fdctrl .ctitletxt", formData).each(function () {
                fieldData += encodeURIComponent($.trim($(this).text())) + "|";
            });
            if (fieldData.length < 1) {
                alert('����δ���');
                return;
            }

            var saveboxhave = dlgBox.showNoTitle({
                cont: '<div style="padding:10px;height:35px;"><div style="float:left"><img src="' + i8_session.resWfHost + 'default/images/o_loading.gif" alt="���Ժ�..."/></div><div style="float:left;line-height:35px;">�����ڱ���...</div></div>',
                nomask: true
            });
            var _controlData = [],_engineParams=[];
            /*�洢������*/
            /*ƴװjavascript�����ļ�*/
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
                    //���ö���Ĳ���
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
                        alert('��������')
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

                    //�������������̲���
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
                                    FieldName: "�ϼƽ��",//inputBox.attr("tagtitle"),
                                    DefaultValue: '',
                                    DataType: 1,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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
                                    DataType: 0,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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
                            //������Ա��Ϣ
                            _controlData.push({"fieldName": thisConfig.FieldID+'_departmentofcreator', "totalConfig":{
                                ctype: controlDict.orgselector,
                                FieldType: controlEnum.orgselector,//��Ա������Ϣ��ʾ�ؼ�
                                FieldID: thisConfig.FieldID+'_departmentofcreator',
                                FieldName: '���������ڲ���',
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
                            //���Ӳ�����Ϣ
                            _controlData.push({"fieldName": thisConfig.FieldID+'_levelofcreator', "totalConfig":{
                                ctype:controlDict.selectoption,
                                FieldType: controlEnum.selectoption,//��Ա������Ϣ��ʾ�ؼ�
                                FieldID:  thisConfig.FieldID+'_levelofcreator',
                                FieldName: 'ְ��',
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
                                FieldType: controlEnum.userkey,//��Ա������Ϣ��ʾ�ؼ�
                                FieldID:  thisConfig.FieldID+'_creator',
                                FieldName: '������',
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
                            FieldName:"ת����ְ��" ,
                            DefaultValue: '',
                            DataType: 1,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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
                            FieldName: 'ת����',//inputBox.attr("tagtitle"),
                            DefaultValue: '',
                            DataType: 0,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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

                    if (paramJson[thisConfig.ctype]) {//����Ǳ��ؼ�����ȥ�����ؼ��еĺϼ��ֶ�
                        /*�ϼ��ֶΣ�����ƴ����*/
                        $("input.grid_col_total_inputvalue,.paymentsummary_total_inputvalue,.vacationsummary_total_inputvalue,.control_summary_total_amount", $(this)).each(function (e) {
                            var inputBox = $(this);
                            var _tagName = inputBox.attr('tagname');
                            _tagName = _tagName.replace('__', '_'); //���������� ���»����滻
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
                            //�������input ��ť����Ĭ�����̲������� true
                            if(!inputBox.is('input')){
                                isparam = true;
                            }



                            var config = {
                                ctype: 'SumCalctor',
                                FieldType: 16,
                                FieldID: inputBox.attr("tagname"),
                                FieldName: inputBox.attr("tagtitle"),
                                DefaultValue: '',
                                DataType: 1,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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
//                                    FieldName: '�������ĸ�����',//inputBox.attr("tagtitle"),
//                                    DefaultValue: '',
//                                    DataType: 0,//DataTypeΪ1����ʾ��ֵ����Ϊ������������
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
            _newDataForm.find("pre").remove(); //���ԭ������ʱ�����config��Ϣ
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
                            alert('�ʲ�������黹�ؼ������ܴ�������ȡ����Ա��Ϣ�ؼ����������ã�');
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
                    var js_wf_BaseInfoID = response.ReturnObject; //����ID
                    //designedOkayAction(formData.clone());
                    saveboxhave.close();
                    alert('����ɹ���');
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