define(function (require) {
    var convertPY = require('../workflow_pinyin.js');
    var dataCache=require('../sourceCache');
    var controlsObj = require('../control-enum.js');
    var controlEnum = controlsObj.controlEnum;
    var controlDict = controlsObj.controlDict;
    var control_prototype = {
        ctype: 'customFormNew', ipos: '0px -245px', name: '自定义明细表',
        autoindex:false,
        propertyHtml: function () {
            return require('../template/property-customFormNew.tpl');
        },
        //打开窗口的设置
        opened: function () {

            $("#slt_selectrownum").val("0");//初始化行数
            $("#slt_selectcolnum").val("3");//
            $("#ck_procNode").prop({ disabled: true });
            //$("label[for='ck_procNode']").hide();
            customListBoxEventNew();
            bindSetWidthEvent();
        },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            //console.log(config);
            //var lname = $(".ctrl_customgridlistDIVNew", ctrl).attr("listname");
            //var lids = $(".ctrl_customgridlistDIVNew", ctrl).attr("id");
            //var sourceid = $(".ctrl_customgridlistDIVNew", ctrl).attr("csourceid");
            if (typeof config == 'object') {
                if ($("#" + config.FieldConfig.customGridName, ctrl).find("table").length == 0 && typeof config.FieldConfig.GridConfig == 'object') {
                    //$("#" + config.FieldConfig.customGridName, ctrl).DataGridNew($.extend(config.FieldConfig.GridConfig, { mode: 'edit', bindDataSource: window["DATARESOURCE"] }));
                    $("#" + config.FieldConfig.customGridName, ctrl).DataGridNew(config.FieldConfig.GridConfig, {'isSetWidth':!!config.IsSetWidth, mode: 'edit', bindDataSource: window["DATARESOURCE"], tagName:convertPY.ConvertPinyin(config.FieldName),autoIndex:$('#ck_rowindex').is(':checked') });
                }
               // var _fieldConfig = config.FieldConfig;
                setWidthStatus(config.IsSetWidth);
            }

        },
        inputs: function () {
            this.autoIndex = $('#ck_rowindex').is(':checked')||false;
            this.isSetWidth = $('.customDesignForm-set-width').prop('checked');
        },
        ckInputs: function () {
            //if ($("#slt_selectgridtemplate").val() == "0") {
            //    alert('请选择表格列表！')
            //    return false;
            //}
            var colvalues = $("#customDesignFormListNew .ccnnrow .txt_colnamevalue");
            if (colvalues.length > 0) {
                var go = true;
                colvalues.each(function (e) {
                    var _curColumnName = $.trim($(this).val());
                    if (_curColumnName.length == 0) {
                        alert('第' + (e + 1) + '列名未填写完整！');
                        go = false;
                        return false;
                    } else if (_curColumnName.length > 20) {
                        alert('第' + (e + 1) + '列名长度超出20字符限制');
                        go = false;
                        return false;
                    }
                })
                if (!go) {
                    return false;
                }
            }

            if($('.customDesignForm-set-width').prop('checked')) {
                var colwidth = $("#customDesignFormListNew .ccnnrow .span-col-width");
                if (colwidth.length > 0) {
                    var go = true;
                    colwidth.each(function (e) {
                        var _colwidthValue = $.trim($(this).val());
                        if (_colwidthValue.length == 0) {
                            alert('第' + (e + 1) + '列未填写宽度！');
                            go = false;
                            return false;
                        }
                    })
                    if (!go) {
                        return false;
                    }
                }
            }

            var colVType = $("#customDesignFormListNew .ccnnrow .cncolvtype_txtType");
            if (colVType.length > 0) {
                var go = true;
                colVType.each(function (e) {
                    if ($(this).val() == "0") {
                        alert("第" + (e + 1) + "列" + $(this).prev().text().replace(/[:|：]/g, "") + '未选择!');
                        go = false;
                        return false;
                    }
                })
                if (!go) {
                    return false;
                }
            }
            return true;
        },
        //配置信息获取
        cformat: function () {
            /*var paramCode = "";
            window["customListNew"] = customConfigSetNew();
            if (window["customListNew"]) {
                paramCode = $.JSONString(customConfigSetNew()); *//*保存配置信息*//*
            }*/
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="0"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><div class="ctrl_customgridlistDIVNew" id="customgridlistDIVNew' + Math.random().toString().replace(".", "") + '" csourceid="' + this.sourceid + '" listname="' + this.title + '" isparam="' + this.isparam + '" mustinput="' + this.mustinput + '"><pre>' + paramCode + '</pre></div></div></div>');
            var ctrl_tpl = require('../template/control-customFormNew.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 10,//列表控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 3,
                IsProcDataField: false,
                IsSetWidth:this.isSetWidth,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    customGridName: 'customGrid' + Math.random().toString().replace(".", ""),
                    GridConfig: customConfigSetNew(),
                    Tags:[{key:'IsSetWidth',value:(!!this.isSetWidth?1:0)}],
                    autoIndex:this.autoIndex
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);

        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName); 
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                $("#txt_ctrlTitleName", updateBox).data(_original_config);
               $('#ck_rowindex',updateBox).prop('checked',(_original_config.FieldConfig||{}).autoIndex);
            }
            return updateBox;
        },
        /*修改框弹出后触发函数*/
        updateBoxShowed: function (ctrl) {
            //console.log($("#txt_ctrlTitleName").data());
            var ctrl_config = $("#txt_ctrlTitleName").data();
            var initRowNum = ctrl_config.FieldConfig.GridConfig.length;
            customListBoxEventNew(initRowNum);
            var paramdata = $("#slt_selectcolnum").data();
            //$("label[for='ck_procNode']").hide();
            $("#ck_procNode").prop({"disabled":true});//.hide();
            //var columnsData = ctrl_config.FieldConfig.GridConfig.columns;// paramdata.columns;
            var columnsData = ctrl_config.FieldConfig.GridConfig;
            $('.customDesignForm-set-width').prop('checked',ctrl_config.IsSetWidth);
            $("#customDesignFormListNew .ccnnrow").each(function (e) {
                //修改时添加公式
                if (columnsData[e].formula) {
                    $(this).find("input").eq(0).attr("formula", columnsData[e].formula);
                }

                $(".txt_colnamevalue", this).val(columnsData[e].colText);
                $(".ck_ismustinput", this).prop({ "checked": columnsData[e].mustInput });
                var _colType = columnsData[e].colType;
                $(".cflc_type", this).val(_colType);
                if (columnsData[e].iscolsum) {
                    $(".property-sum", this).show();
                    $(".property-sum", this).find("input").prop({ "checked": columnsData[e].iscolsum });
                    $(".property-param", this).show();
                }
                var _colWidth =   columnsData[e].colWidth;

                if(!!_colWidth){
                    $(".span-col-width",this).val(_colWidth == 'auto'?'0':_colWidth);
                }


                if (columnsData[e].isparam) {
                    $(".property-param", this).show();
                    $(".property-param", this).find("input").prop({ "checked": columnsData[e].isparam });
                }
                //if (columnsdata[e].iscolsum || columnsdata[e].isparam) {
                //    $(".span_sumparam_ck", this).show();
                //    $(".ck_col_issumcol", this).prop({ "checked": columnsdata[e].iscolsum });
                //    $(".ck_paramsumcol", this).prop({ "checked": columnsdata[e].isparam });
                //}
                switch (_colType) {
                    case "DatePicker":
                        $(".cncolvtype_txtType", this).empty().html('<option value="yyyy-MM-dd">年-月-日</option><option value="yyyy-MM-dd HH">年-月-日 时:00:00</option><option value="yyyy-MM-dd HH:mm">年-月-日 时:分:00</option><option value="yyyy-MM-dd HH:mm:ss">年-月-日 时:分:秒</option>');
                        $(".cncolValueType span", this).text("时间类型：");
                        break;
                    case "RadioButton":
                    case "Checkbox":
                    case "Dropdown":
                    case "Subsetoption":
                        var _this=this;
                        dataCache.getMainSource(function(datasource){
                            var optionCode = '<option value="0">选择数据源</option>';
                            _.each(datasource,function(item){
                                optionCode += '<option value="' + item.ID + '"' + (item.ID == columnsData[e].dataSource ? ' selected="selected"' : "") + '>' + item.Name + '</option>';
                            })
                            $(".cncolvtype_txtType", _this).empty().html(optionCode);
                            $(".cncolValueType span", _this).text(" 数 据 源：");
                        });
                       /* var datasource = window["DATARESOURCE"];
                        var optionCode = '<option value="0">选择数据源</option>';
                        if (datasource.length > 0) {
                            for (var i = 0; i < datasource.length; i++) {
                                optionCode += '<option value="' + datasource[i].sourceid + '"' + (datasource[i].sourceid == columnsData[e].dataSource ? ' selected="selected"' : "") + '>' + datasource[i].sourceName + '</option>';
                            }
                        }
                        $(".cncolvtype_txtType", this).empty().html(optionCode);
                        $(".cncolValueType span", this).text(" 数 据 源：");     */
                        break;
                    case "UserKey":
                        $(".cncolvtype_txtType", this).empty().html('<option value="single">单人</option><option value="multi">多人</option>');
                        $(".cncolValueType span", this).text("选人类型：");
                        break;
                    case "OrgKey":
                        $(".cncolvtype_txtType", this).empty().html('<option value="single">单部门</option><option value="multi">多部门</option>');
                        $(".cncolValueType span", this).text("选人类型：");
                        break;
                    case "AutoCalculate":
                        $(".cncolValueType", this).empty().html(' <span>&nbsp;&nbsp;&nbsp;计算方式：</span><a class="btnAutoCalculateSet" href="#">点击设置</a>　');
                        $(".span_mustinput_ck", this).hide();
                        $(".cncolvtype_txtType", this).hide();
                        $(".property-sum", this).show();
                        $(".ck_sum_set", this).hide();
                        break;
                    case "AutoIndex":
//                        $(".cncolValueType", this).replaceWith(
//                            $('<div class="cncolValueType">　<span>文本类型：</span></div>').append(
//                                $('<select class="cncolvtype_txtType"><option value="autoindex">数字</option></select>'))
//                        );
                        $(".cncolvtype_txtType", this).empty().html('<option value="autoindex">自动序号</option>').trigger('change');
                        $(".property-sum", this).hide();
                        $(".property-param", this).hide();
                        $(".cncolset", this).hide();
                        break;
                }
                if (columnsData[e].dataSource.length < 10)//如果非绑定数据源
                    $(".cncolvtype_txtType", this).val(columnsData[e].valuetype);
                //bug7980
                switch (columnsData[e].valuetype) {
                    case "number":
                        $(".property-sum", this).show();
                        $(".ck_sum_set", this).hide();
                        break;
                }
            })
            bindSetWidthEvent();
           // var _fieldConfig = ctrl_config.FieldConfig ||{};
            if(typeof (ctrl_config) == 'object') {
                setWidthStatus(ctrl_config.IsSetWidth);
            }
        }
    };

    //设置计算公式
    $(".btnAutoCalculateSet").live("click", function () {
        var thecell = $(this).parent().siblings(".cncolName").find(".txt_colnamevalue");
        var formula = thecell.attr("formula");//获取公式

        //获取计算单元格
        var options = "<option class='nooption'>--无--</option>";
        var searchArea = $(this).parent().parent().siblings();
        $(" .cncolName .txt_colnamevalue", searchArea).each(function (e) {
            if ($(this).val() != "" && $(this).parents(".ccnnrow").find(".cncolvtype_txtType").val() == "number") {
                options += '<option autocal-id=' + $(this).attr('autocal-id') + '>' + $(this).val() + '</option>';
            }
        });
        var html_box = '<span class="app_wf_autocal_operator" style="padding:40px; display:block;">'
                    + '     <select class="app_wf_autocal_operator_1">' + options + '</select>'
                    + '     <select class="app_wf_autocal_operator_o" style="width:50px;"><option value="+">加</option><option value="-">减</option><option value="*">乘</option><option value="/">除</option></select>'
                    + '     <select class="app_wf_autocal_operator_2">' + options + '</select>'
                    + '     <span class="app_wf_autocal_console" style="margin-top:10px;display:block;border:#ccc 1px solid;padding:15px;"></span>'                    
                    + '</span>';
        var showBox = $.MsgBox({
            title: '设置该字段的计算方式',
            content: html_box,
            confirmClick: function () {
                btn_confirm();
            }
        });
        showBox.show();
        var sel_1 = $(".app_wf_autocal_operator_1");
        var sel_2 = $(".app_wf_autocal_operator_2");
        var sel_o = $(".app_wf_autocal_operator_o");
        //计算内容显示
        $(".app_wf_autocal_console").html(thecell.val() + " = " + sel_1.val() + " " + sel_o.val() + " " + sel_2.val());
        $(".app_wf_autocal_operator").change(function () {
            $(".app_wf_autocal_console").html(thecell.val() + " = " + sel_1.val() + " " + sel_o.val() + " " + sel_2.val());
        });
        //显示已有计算公式
        if (formula) {
            var formulaarr = formula.split(";");
            var onecol = formulaarr[0];
            var twocol = formulaarr[1];
            var threecol = formulaarr[2];
            $(".app_wf_autocal_console").html(thecell.val() + " = " + sel_1.find("option[autocal-id='" + onecol + "']").val() + " " + twocol + " " + sel_2.find("option[autocal-id='" + threecol + "']").val());
            $("option", sel_1).each(function () {
                if (onecol == $(this).attr("autocal-id")) {
                    $(this).attr("selected", true);
                }
            });
            $("option", sel_o).each(function () {
                if (twocol == $(this).val()) {
                    $(this).attr("selected", true);
                }
            });
            $("option", sel_2).each(function () {
                if (threecol == $(this).attr("autocal-id")) {
                    $(this).attr("selected", true);
                }
            });
        }

        //ok
        var btn_confirm = function () {
            thecell.attr("formula", sel_1.find(":selected").attr("autocal-id") + ";" + sel_o.val() + ";" + sel_2.find(":selected").attr("autocal-id"));
            //相应数字列变为必填bug7978
            var col1 = sel_1.find(":selected").attr("autocal-id") - 1;
            var col2 = sel_2.find(":selected").attr("autocal-id") - 1;
            $("#customDesignFormListNew .ccnnrow").eq(col1).find(".ck_ismustinput").prop("checked", true);
            $("#customDesignFormListNew .ccnnrow").eq(col2).find(".ck_ismustinput").prop("checked", true);
            showBox.closeBox();
        };        
    });

    /*【新明细表】弹出框后DOM操作*/
    function customListBoxEventNew(initRowNum) {
        //样式对齐bug7974
        $(".boxrow .brtt").eq(0).removeClass("brtt");
        $(".boxrow div").eq(0).css({ "width": "60px;", "float": "left" });

        //var colLength = "";
        //if ($("#slt_selectcolnum").data().columns && $("#slt_selectcolnum").data().columns.length) {
        //    colLength = parseInt($("#slt_selectcolnum").data().columns.length);
        //} else {
        //    colLength = parseInt($("#slt_selectcolnum").val());
        //}
        var initRowNum = initRowNum;
        if (!initRowNum) {
            initRowNum = 3;
        }
        dataCache.getMainSource(function(datalist){
            for (var i = 0; i < initRowNum ; i++) {
                CustomFormListNew($("#customDesignFormListNew"), $("#CDFL_FormPreview"), i + 1,datalist);
            }
        });

        //$("#slt_selectcolnum").change(function () {
        //    var exitc = $("#customDesignFormListNew .ccnnrow").length;
        //    var setc = parseInt($("#slt_selectcolnum").val());
        //    if (exitc > setc) {
        //        var tag = 1;
        //        $("#customDesignFormListNew .ccnnrow").each(function (e) {
        //            if (tag > setc) {
        //                $(this).remove();
        //            }
        //            tag++;
        //        })
        //    } else {
        //        for (var i = exitc + 1; i < setc + 1; i++) {
        //            CustomFormListNew($("#customDesignFormListNew"), $("#CDFL_FormPreview"), i);
        //        }
        //    }
        //    var boxframe = $("#customDesignFormListNew").parents(".fdMsgBox");
        //    boxframe.css({ left: $(window).width() / 2 - boxframe.width() / 2, top: $(window).height() / 2 - boxframe.height() / 2 });
        //});

        /*自定表设计预览*/
        $("#a_privewDsignFlist").click(function () {
            var submit = new submitInter('customForm');
            if (submit.ckform()) {
                var _LSconfig = customConfigSet();
                $("#CDFL_FormPreview").empty().DataGrid($.extend(_LSconfig, { mode: 'edit', bindDataSource: window["DATARESOURCE"] }));
                $("#CDFL_FormPreview .btnsave").unbind("click");
                var boxframe = $("#customDesignFormListNew").parents(".fdMsgBox"); /*重置框位置*/
                boxframe.css({ left: $(window).width() / 2 - boxframe.width() / 2, top: $(window).height() / 2 - boxframe.height() / 2 });
            }
        });
        //新明细控件预览
        $("#a_privewDsignFlistNew").click(function () {/*自定表设计预览*/
            var submit = new submitInter('customForm');
            if (submit.ckform()) {
                var _LSconfig = customConfigSetNew();
                $("#CDFL_FormPreview").empty().DataGridNew($.extend(_LSconfig, { mode: 'edit', bindDataSource: window["DATARESOURCE"] }));
                $("#CDFL_FormPreview .btnsave").unbind("click");
                var boxframe = $("#customDesignFormListNew").parents(".fdMsgBox"); /*重置框位置*/
                boxframe.css({ left: $(window).width() / 2 - boxframe.width() / 2, top: $(window).height() / 2 - boxframe.height() / 2 });
                //bug7973
                $("#CDFL_FormPreview ul.editulcontainer").attr("style", "width:690px;");
                $("#CDFL_FormPreview ul.editulcontainer li").attr("style", "width:330px;");
                $("#CDFL_FormPreview ul.editulcontainer li .div_fieldtxt").attr("style", "width:120px;");
            }
        })
        //明细表添加一列
        $("#a_customFormAddOne").click(function () {
            var index = $("#customDesignFormListNew .ccnnrow").size() + 1;
            dataCache.getMainSource(function(datalist){
                CustomFormListNew($("#customDesignFormListNew"), $("#CDFL_FormPreview"), index,datalist);
            });
            var boxframe = $("#customDesignFormListNew").parents(".fdMsgBox");
            var _width = window.screen.width,_height = window.screen.height;
            boxframe.css({ left: _width / 2 - boxframe.width() / 2, top: _height/ 2 - boxframe.height() / 2 });
            setWidthStatus(getWidthStatus());
            //boxframe.css({ left: $(window).width() / 2 - boxframe.width() / 2, top: $(window).height() / 2 - boxframe.height() / 2 });
        });
        /*点击合计，出现流程参数*/
        $(".ck_col_issumcol").live("click", function () {
            if (!$(this).prop("checked")) {
                $(this).parents(".property-sum").siblings("span.property-param").hide();
            } else {
                $(this).parents(".property-sum").siblings("span.property-param").show();
            }            
        })
    }
    var unicodeToDDD = function (c) {
        switch (c) {
            case '、':
                return "&#12289;";
                break;
            case "【":
                return "&#12304;";
                break;
            case "】":
                return "&#12305;";
                break;
            case "(":
                return "&#40;";
                break;
            case ")":
                return "&#41;";
                break;
            case "\\":
                return "&#92;";
                break;
            default:
                return "";
                break;

        }
    }
    /*列表配置生成*/
    function customConfigSetNew() {
        if ($("#customDesignFormListNew").length > 0) {
            var _column = [];
            var _isSummary = false;
            var _colNameLib = "";
            $("#customDesignFormListNew .ccnnrow").each(function (e) {
                var _colName = "col_" + (e + 1) + "_rd_" + Math.random().toString().replace(".", "");//unicode:\u3001（、）   \u3010(【)   \u3011(】)  \u28(()  \u29())  \u2f(/)
                var _colText = $(".txt_colnamevalue", this).val().replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, function (w) { return unicodeToDDD(w); });
                _colNameLib += _colText + "|";
                var _colType = $(".cflc_type", this).val();
                var _colWidth = '0';
                var _dataSource = '';
                if (_colType == "Dropdown" || _colType == "RadioButton" || _colType == "Checkbox" || _colType == "Subsetoption") {
                    _dataSource = $(".cncolvtype_txtType", this).val();
                }
                var _mustinput = $(".ck_ismustinput", this).prop("checked");
                var _iscolsum = $(".ck_col_issumcol", this).prop("checked");//合计
                 _colWidth =  parseFloat($('.span-col-width',this).val(),10) ||0;
                if (!_isSummary && _iscolsum) {
                    _isSummary = true;
                }
                var _iscolchinese = false;
                if (_iscolsum) {
                    _iscolchinese = $(".ck_col_ischinese", this).prop("checked");//大写
                }

                var _isparam = $(".ck_paramsumcol", this).prop("checked");
                var _valuetype = $(".cncolvtype_txtType", this).val();
                if (!_valuetype || _colType == "Dropdown" || _colType == "RadioButton" || _colType == "Checkbox" || _colType == "Subsetoption") {
                    _valuetype = "";
                }
                //datatype
                var _dataType = 0;
                if (_colType == "DatePicker") {
                    _dataType = 5;
                } else if (_colType == "Text" && _valuetype == "number") {
                    _dataType = 1;
                }
                
                //获取公式
                var _formula = $(".txt_colnamevalue", this).attr("formula");
                if (!_formula) {
                    _formula = "";
                }
                //合计是否为多列计算
                var _isSumFormula = $(".txt_colnamevalue", this).attr("is-sum-formula");
                if (!_isSumFormula) {
                    _isSumFormula = false;
                }
                //合计计算公式
                var _formulaSum = $(".txt_colnamevalue", this).attr("formula-sum");
                if (!_formulaSum) {
                    _formulaSum = "";
                }
                if(_colType ==  "AutoIndex"){

                }
                var _controlType = 0; //controlEnum[_colType.toLowerCase()];
                _controlType = controlEnum[(_colType||'').toLowerCase()] || 0;
                //_column.push({ 'colName': _colName, 'colText': _colText, 'colType': _colType, 'colWidth': _colWidth, 'mustInput': _mustinput, 'iscolsum': _iscolsum, 'iscolchinese': _iscolchinese, 'isparam': _isparam, 'valuetype': _valuetype, 'dataSource': _dataSource, 'formula': _formula, 'isSumFormula': _isSumFormula, 'formulaSum': _formulaSum });
                _column.push({ 'colName':"col_"+(e+1)+"_"+ convertPY.ConvertPinyin(_colText), 'colText': _colText, 'colType': _colType, 'colWidth': _colWidth, 'mustInput': _mustinput, 'iscolsum': _iscolsum, 'iscolchinese': _iscolchinese, 'isparam': _isparam, 'valuetype': _valuetype, 'dataSource': _dataSource, 'formula': _formula, 'isSumFormula': _isSumFormula, 'DataType': _dataType,'ControlType':_controlType });
                //_column.push({ 'ColName': _colName, 'ColText': _colText, 'ColType': _colType, 'ColWidth': _colWidth, 'MustInput': _mustinput, 'IsColSum': _iscolsum, 'iscolchinese': _iscolchinese, 'IsParam': _isparam, 'ValueType': _valuetype, 'DataSource': _dataSource, 'formula': _formula, 'isSumFormula': _isSumFormula, 'formulaSum': _formulaSum,'DataType':_dataType });
            });
            /*var pystring= convertPY.ConvertPinyin(_colNameLib);
            $.ajax({
                'url': fw_globalConfig.root + 'Handler/workflow/MyWorkflowProcess.ashx?r=mcp', data: { filesStr: _colNameLib }, dataType: 'json', type: 'post', async: false, success: function (response) {
                    if (response.Result) {
                        function getTransStr(_key) {
                            var dic_data = response.ReturnObject;
                            for (var i = 0; i < dic_data.length; i++) {
                                if (typeof dic_data[i] == "object") {
                                    if (dic_data[i].key == _key) {
                                        return dic_data[i].value;
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < _column.length; i++) {
                            var pinColName = getTransStr(_column[i].colText);
                            if (pinColName) {
                                _column[i].colName = "col_" + (i + 1) + "_" + pinColName;
                            }
                        }
                    }
                }
            });*/

            //列数
            //var initRowNum = $(".txt_colnamevalue").length;// $("#slt_selectrownum").val();

            //var _LSconfig = { columns: _column, isSummary: _isSummary, sumaryCfg: { 'text': '总计:', 'calculateCol': 'purPrice' }, intRowNum: intRowNum };
            //var _LSconfig = { columns: _column, isSummary: _isSummary, initRowNum: initRowNum };
            var _LSconfig = _column;
            return _LSconfig;
        }
    }
    //【新明细表】
    function CustomFormListNew(f, p, c,datasource) {
        //var datasource = window["DATARESOURCE"] ||[];
        var optionCode = "";
        if (datasource.length > 0) {
            for (var i = 0; i < datasource.length; i++) {
                optionCode += '<option value="' + datasource[i].ID + '">' + datasource[i].Name + '</option>';
            }
        }
        var addrow = function (index) {
            var colRow = $('<div class="ccnnrow"></div>');
            var temp_id = Math.random().toString().replace(".", "");
            var colset = $('<div class="cncolset">'
                         + '    <span class="span_mustinput_ck" style="margin-left:10px;">'
                         + '        <input type="checkbox" class="ck_ismustinput" id="ck_mustinput_' + temp_id + '"/><label for="ck_mustinput_' + temp_id + '">必填</label>'
                         + '    </span>'
        + '    <span class="span_param_width" style="margin-left:10px;">'
        + '     列宽(%): &nbsp;<input type="text" class="span-col-width" >'
        + '    </span>'
                         + '    <span class="span_sumparam_ck property-sum" style="display:none;">'
                         + '        <input type="checkbox" class="ck_col_issumcol" id="ck_sum_' + temp_id + '"/><label for="ck_sum_' + temp_id + '">合计<!--<a class="ck_sum_set"  href="javascript:void(0);">设置</a>--></label>'
                         + '     </span>'
                         + '    <span class="span_sumparam_ck property-param" style="display:none">'
                         + '        <input type="checkbox" style="display:none;" class="ck_col_ischinese" id="ck_cn_' + temp_id + '"/>'
                         + '        <label style="display:none;" for="ck_cn_' + temp_id + '">大写</label>'
                         + '        <input type="checkbox" class="ck_paramsumcol" id="ck_param_' + temp_id + '"/>'
                         + '        <label for="ck_param_' + temp_id + '">环节参数</label>'
                         + '    </span>'
                         + '</div>');
            f.append(colRow.append(
                /*添加名称*/
                $('<div class="cncolName"><span class="cncolNameText">第' + index + '列　名称：</span><input type="text" autocal-id="' + index + '" class="txt_colnamevalue" /></div>')
            ).append(
                /*添加类型*/
                //<option value="AutoIndex">自动序号</option>
                $('<div class="cncolType">　<span>类型：</span></div>').append(
                    $('<select class="cflc_type"><option value="Text">单行文本框</option><option value="DatePicker">选时间控件</option><option value="Dropdown">下拉菜单</option><option value="UserKey">选人控件</option><option value="OrgKey">选部门控件</option><option value="Subsetoption">级联菜单</option><option value="RadioButton">单选按钮</option><option value="Checkbox">多选按钮</option><option value="AutoCalculate">自动计算</option><option value="AutoIndex">自动序号</option></select>')
                    .change(function () {
                        $(".span_sumparam_ck", colRow).hide();
                        $('.span_mustinput_ck', colRow).show();
                        $(".cncolset", colRow).show();
                        $(".span_sumparam_ck input", colRow).prop({ "checked": false });
                        switch ($(this).val()) {
                            case "Text":
                                $(".cncolValueType", colRow).replaceWith($('<div class="cncolValueType">　<span>文本类型：</span></div>').append(
                                $('<select class="cncolvtype_txtType"><option value="unlimited">不限</option><option value="email">邮箱</option><option value="phone">手机</option><option value="number">数字</option><option value="numberchar">数字与字母</option></select>')
                                .change(function () {
                                    if ($(this).val() == "number") {
                                        $(".property-sum", colRow).show();
                                        $(".ck_sum_set", colRow).show();
                                        numSumSet();
                                    } else {
                                        $(".span_sumparam_ck", colRow).hide();
                                        $(".span_sumparam_ck input", colRow).prop({ "checked": false });
                                    }
                                })
                                ));
                                break;
                            case "DatePicker":
                                $(".cncolValueType", colRow).replaceWith(
                                        $('<div class="cncolValueType">　<span>时间类型：</span></div>').append(
                                        $('<select class="cncolvtype_txtType"><option value="yyyy-MM-dd">年-月-日</option><option value="yyyy-MM-dd HH">年-月-日 时:00:00</option><option value="yyyy-MM-dd HH:mm">年-月-日 时:分:00</option><option value="yyyy-MM-dd HH:mm:ss">年-月-日 时:分:秒</option></select>'))
                                    );
                                break;
                            case "Dropdown":
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span> 数 据 源：</span></div>').append(
                                            $('<select class="cncolvtype_txtType"><option value="0">选择数据源</option>' + optionCode + '</select>')
                                        )
                                    );
                                break;
                            case "UserKey":
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span>选人类型：</span></div>').append(
                                            $('<select class="cncolvtype_txtType"><option value="single">单人</option><option value="multi">多人</option></select>'))
                                    );
                                break;
                            case "OrgKey":
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span>选部门类型：</span></div>').append(
                                            $('<select class="cncolvtype_txtType"><option value="single">单部门</option><option value="multi">多部门</option></select>'))
                                    );
                                break;
                            case "RadioButton":
                                $(".cncolValueType", colRow).replaceWith(
                                        $('<div class="cncolValueType">　<span> 数 据 源：</span></div>').append(
                                            $('<select class="cncolvtype_txtType"><option value="0">选择数据源</option>' + optionCode + '</select>')
                                        )
                                    );
                                break;
                            case "Checkbox":
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span> 数 据 源：</span></div>').append(
                                        $('<select class="cncolvtype_txtType"><option value="0">选择数据源</option>' + optionCode + '</select>')
                                    )
                                    );
                                break;
                            case "Subsetoption":
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span> 数 据 源：</span></div>').append(
                                        $('<select class="cncolvtype_txtType"><option value="0">选择数据源</option>' + optionCode + '</select>')
                                    )
                                );
                                break;
                            case "AutoCalculate":
                                $(".property-sum", colRow).show();
                                $(".property-param", colRow).hide();
                                $(".ck_sum_set", colRow).hide();
                                $(".span_mustinput_ck", colRow).hide();
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span>计算方式：</span></div>').append(
                                        $('<a class="btnAutoCalculateSet" style="margin-right:10px;" href="#">点击设置</a>')
                                    )
                                );
                                break;
                            case "AutoIndex":
                                $(".property-sum", colRow).hide();
                                $(".property-param", colRow).hide();
                                $(".cncolValueType", colRow).replaceWith(
                                    $('<div class="cncolValueType">　<span>文本类型：</span></div>').append(
                                        $('<select class="cncolvtype_txtType"><option value="autoindex">自动序号</option></select>'))
                                );
                                $(".cncolset", colRow).hide();
                                break;
                        }
                    })
                )
            ).append(
                /*默认添加值类型*/
                $('<div class="cncolValueType">　<span>文本类型：</span></div>').append(
                    $('<select class="cncolvtype_txtType"><option value="unlimited">不限</option><option value="email">邮箱</option><option value="phone">手机</option><option value="number">数字</option><option value="numberchar">数字与字母</option></select>')
                    .change(function () {
                        if ($(this).val() == "number") {
                            $(".property-sum", colRow).show();
                            numSumSet();
                        } else {
                            $(".span_sumparam_ck", colRow).hide();
                            $(".span_sumparam_ck input", colRow).prop({ "checked": false });
                        }
                    })
                )
            ).append(
            colset
                /*添加必填*/
            //var temp_id = Math.random().toString().replace(".", "");
            //var colset = $('<div class="cncolset">'
            //             + '    <span class="span_mustinput_ck" style="margin-left:10px;">'
            //             + '        <input type="checkbox" class="ck_ismustinput" id="ck_mustinput_' + temp_id + '"/><label for="ck_mi_' + temp_id + '">必填</label>'
            //             + '    </span>'
            //             + '    <span class="span_sumparam_ck" style="display:none;">'
            //             + '        <input type="checkbox" class="ck_col_issumcol" id="ck_sum_' + temp_id + '"/><label for="ck_sum_' + temp_id + '">合计<!--<a class="ck_sum_set"  href="javascript:void(0);">设置</a>--></label>'
            //             + '     </span>'
            //             + '    <span class="span_sumparam_ck" style="display:none">'
            //             + '        <input type="checkbox" style="display:none;" class="ck_col_ischinese" id="ck_cn_' + temp_id + '"/>'
            //             + '        <label style="display:none;" for="ck_cn_' + temp_id + '">大写</label>'
            //             + '        <input type="checkbox" class="ck_paramsumcol" id="ck_param_' + temp_id + '"/>'
            //             + '        <label for="ck_param_' + temp_id + '">环节参数</label>'
            //             + '    </span>'
            //             + '</div>');
            ).append(
                /*添加删除*/
                $('<div><a href="#" class="a_customFormDelOne">删除</a></div>')
                .click(function () {
                    $(this).parent().remove();
                    updateColIndex();
                })
            ));
        }
        addrow(c);
        updateColIndex();

        //清空运算标记
        $(".cncolvtype_txtType").live("change", function () {
            var colinput = $(this).parents(".ccnnrow").find(".txt_colnamevalue");
            colinput.removeAttr("formula-sum");
            colinput.removeAttr("is-sum-formula");
            colinput.removeAttr("formula");
        });
        $(".cflc_type").live("change", function () {
            var colinput = $(this).parents(".ccnnrow").find(".txt_colnamevalue");
            colinput.removeAttr("formula-sum");
            colinput.removeAttr("is-sum-formula");
            colinput.removeAttr("formula");
        });
    }
    //合计方法
    function numSumSet() {
        $(".ck_sum_set").click(function () {

            var thecell = $(this).parent().parent().parent().siblings(".cncolName").find(".txt_colnamevalue");

            //获取计算单元格
            //var options = "<option class='nooption'>--无--</option>";
            var options = "";
            var searchArea = $(this).parents("#customDesignFormListNew");

            $(".cncolValueType .cncolvtype_txtType", searchArea).each(function (e) {
                var oval = $(this).parent().siblings(".cncolName").find(".txt_colnamevalue").val();
                var ovalid = $(this).parent().siblings(".cncolName").find(".txt_colnamevalue").attr("autocal-id");
                if ($(this).val() == "number") {
                    options += '<option autocal-id="' + ovalid + '" value="' + oval + '">' + oval + '</option>';
                }
            });
            if (options == "") {
                options = "<option>--无--</option>";
            }
            //弹出框
            var boxhavesum = fw_oshow_box.createNew2();
            boxhavesum.fshow_box({
                title: "合计设置",
                shtml_id: "js_twohave_sum", //弹出层的容器ID，唯一性，如果html上已经存在该ID 则会出现问题，
                dialogtype: 0,      //显示模式 0模态，1非模态      
                scontent: '<span class="app_wf_autocal_sum" style="padding:40px; display:block;">'
                        + '     <label><input class="sum_set_single" type="radio" name="sumradio" checked="true"/>单列合计</label>       <label><input class="sum_set_many" type="radio" name="sumradio"/>多列计算</label>'
                        + '     <div class="sum_set_many_container" style="display:none;">'
                        + '         <select class="app_wf_autocal_sum_1">' + options + '</select>'
                        + '         <select class="app_wf_autocal_sum_o" style="width:50px;"><option value="+">加</option><option value="-">减</option><option value="*">乘</option><option value="/">除</option></select>'
                        + '         <select class="app_wf_autocal_sum_2">' + options + '</select>'
                        + '         <span class="app_wf_autocal_console" style="margin-top:10px;display:block;border:#ccc 1px solid;padding:15px;"></span>'
                        + '     </div>'
                        + '     <div class="optionbuttons" style="margin-top:10px;"><input type="button" class="app_wf_autocal_sum_ok" value="确定">　 <a class="app_wf_autocal_operator_close" href="javascript:void(0)">关闭</a></div>'
                        + '</span>'
                        ,
                data: {},
                success: function (data) {  //绑定的回调函数

                    //单列、多列切换
                    $(".sum_set_single").click(function () {
                        $(".sum_set_many_container").hide();
                    });
                    $(".sum_set_many").click(function () {
                        $(".sum_set_many_container").show();
                    });
                    //显示单列合计或多列计算
                    if (thecell.attr("is-sum-formula") && thecell.attr("is-sum-formula") != "false") {
                        $(".sum_set_many").click();
                    } else {
                        $(".sum_set_single").click();
                    }
                    //
                    var sel_1 = $(".app_wf_autocal_sum_1");
                    var sel_2 = $(".app_wf_autocal_sum_2");
                    var sel_o = $(".app_wf_autocal_sum_o");
                    //计算内容显示
                    $(".app_wf_autocal_console").html(thecell.val() + " = " + sel_1.val() + " " + sel_o.val() + " " + sel_2.val());
                    $(".sum_set_many_container select").change(function () {
                        $(".app_wf_autocal_console").html(thecell.val() + " = " + sel_1.val() + " " + sel_o.val() + " " + sel_2.val());
                    });
                    //ok
                    $(".app_wf_autocal_sum_ok").click(function () {
                        var checkedr = $(".app_wf_autocal_sum input[type=radio]:checked").attr("class");
                        if (checkedr == "sum_set_single") {
                            thecell.attr("is-sum-formula", "false");
                        } else {
                            thecell.attr("formula-sum", sel_1.find(":selected").attr("autocal-id") + ";" + sel_o.val() + ";" + sel_2.find(":selected").attr("autocal-id"));
                            thecell.attr("is-sum-formula", "true");
                        }

                        boxhavesum.closed();
                    });
                    //close
                    $(".app_wf_autocal_operator_close").click(function () {
                        boxhavesum.closed();
                    });
                }
            });

        });
    }
    //【新明细表】更新列序号、合计字段下拉
    function updateColIndex() {
        //更新合计字段下拉重置
        $("#slt_sum_col option").remove();
        //更新序列
        $("#customDesignFormListNew .ccnnrow .cncolName .cncolNameText").each(function (i) {
            i = i + 1;
            $(this).text("第" + i + "列　名称：");
            $("#slt_sum_col").append("<option value='" + i + "'>" + i + "</option>");
        });
    }

    function bindSetWidthEvent(){
        $(document).off('click','.customDesignForm-set-width').on('click','.customDesignForm-set-width',function(){
            var _$me = $(this);
            if(_$me.prop('checked')){
                $('.span_param_width').show();
            }else{
                $('.span_param_width').hide();
            }
        })
        //验证申请费用是否有效
        $(document).off('keyup','.span-col-width').on('keyup','.span-col-width',function(){
            var _$me = $(this);
            _$me.val(_$me.val().replace(/[^0-9.-]/g, ''));

        })
    }

    function getWidthStatus(){
       return  $('.customDesignForm-set-width').prop('checked');
    }
    function setWidthStatus(flag){
        var _flag = !!flag;
        var _$me = $('.customDesignForm-set-width');
        _$me.prop('checked',_flag);
        if(_flag){
            $('.span_param_width').show();
        }else{
            $('.span_param_width').hide();
        }
    }
    return control_prototype;
})













