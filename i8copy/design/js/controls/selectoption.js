/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    var utilModel = require('../util.js');
    var dataCache=require('../sourceCache');
    var white_list = utilModel.workflowWhiteList;// /^[\u4e00-\u9fa5_a-zA-Z0-9\s]+$/ig;
    var control_prototype = {
        ctype: 'selectoption', ipos: '0px -81px', name: '下拉菜单',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">数据源：</span></div><div class="brbx"><select id="slt_selectdatasource"><option value="0">自定义数据</option></select> <a id="a_link_newdatasource" style="display:none;">新增数据源</a></div></div><div class="boxrow customItemsettingsdiv"><div class="brtt"><span class="span_bfieldTxt">自定选项：</span></div><div class="brbx"><textarea class="areaselectitemset" id="txt_areaselectitemset" rows="5" cols="5">选项1\n选项2\n选项3</textarea></div></div>'],
        propertyHtml: function () {
            return require('../template/property-selectoption.tpl');
        },
        opened: function () {
            dataCache.getMainSource(function(data){
                //console.log(data);
                var datasource =data;// window["DATARESOURCE"];
                var optionCode = "";
                if (datasource.length > 0) {
                    for (var i = 0; i < datasource.length; i++) {
                        optionCode += '<option value="' + datasource[i].ID + '">' + datasource[i].Name + '</option>';
                    }
                }
                $("#txt_areaselectitemset").val("选项1\n选项2\n选项3");
                //$("#txt_areaselectitemset").select();
                $("#slt_selectdatasource").append(optionCode).change(function () {
                    var selValue = $(this).val();
                    if(!!selValue) {
                        dataCache.GetRunProcDataSourceAndLine(selValue, function (data) {
                            if (data.length > 0) {
                                if ($('.customitem-datasource-tips').length == 0) {
                                    $('.customItemsettingsdiv').after('<div class="customitem-datasource-tips" >提示：此字段已参与分支条件设计，为了不影响流程正常使用，请在修改数据源后及时更新相关流程设计！</div>');
                                }
                            } else {
                                $('.customitem-datasource-tips').remove();
                            }
                        })
                    }

                    if (selValue == "0") {
                        $(".customItemsettingsdiv").show();
                    } else {
                        $(".customItemsettingsdiv").hide();
                    }
                });
            })
        },
        inputs: function () {
            this.sourceType = $("#slt_selectdatasource option:checked").text();
            this.sourceValue = $("#slt_selectdatasource").val();
        },
        ckInputs: function () {
            var _inputValue = $.trim($("#txt_areaselectitemset").val()||'');
            if(_inputValue.length==0){
                return true;
            }
            white_list.lastIndex = 0;
            if(!white_list.test(_inputValue) && _inputValue.length>0){
                alert('自定义选项只允许输入中英文和数字');
                return false;
            }
            return true;
        },
        cformat: function () {
            var sourceType = $("#slt_selectdatasource").val();
            var ctrl_tpl = require('../template/control-selectoption.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 3,//下拉菜单
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 0,
                IsProcDataField: this.isparam,
                IsBindData: this.sourceType.length > 10,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: this.sourceValue,
                FieldConfig: {
                    customItems: []
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            var itemSource = [];//, dataSourcels = window["DATARESOURCE"];
            //var sourceName = $("#slt_selectdatasource option:selected").text();
            if (sourceType == "0") {
                var _items = $("#txt_areaselectitemset").val();
                if (_items.length > 0) {
                    var ary_item = _items.split('\n');
                    if (ary_item.length > 0) {
                        var bol = true;
                        for (var i = 0; i < ary_item.length; i++) {
                            if (ary_item[i].length > 50) {
                                bol = false;
                                break;
                            }
                            itemSource.push({ key: ary_item[i], value: ary_item[i], id: Math.random().toString(), text: ary_item[i] });
                        }
                        if (bol) {
                            config.FieldConfig.customItems = itemSource;
                        } else {
                            utilModel.i8alert({ str: "单个选项长度超过50，请重新输入！" });
                            return false;
                        }
                    }
                }
            }
            config.str_config = $.JSONString(config);
            config.sourcelist = itemSource;
            return render(config);
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="1"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><select style="width:237px" class="ctrl_selectoptions"  isparam="' + this.isparam + '" mustinput="' + this.mustinput + '"' + sourceidCode + '>' + itemsCode + '</select></div></div>');

        },
        filled:function(ctrl){
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            if(config.DataSource.length==36){
                dataCache.getSourceByID(config.DataSource,function(data){
                    var optionCode = "";
                    _.each(data,function(item){
                        optionCode += '<option value="' + item.ID + '">' + item.Text + '</option>';
                    })
                    ctrl.find(".ctrl_selectoptions").append(optionCode);
                })
            }
            //console.log(config);
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                //var datasource = window["DATARESOURCE"];
                dataCache.getMainSource(function(datasource){
                    var optionCode = "";
                    if (datasource.length > 0) {
                        for (var i = 0; i < datasource.length; i++) {
                            optionCode += '<option value="' + datasource[i].ID + '">' + datasource[i].Name + '</option>';
                        }
                        $("#slt_selectdatasource", updateBox).append(optionCode).change(function () {
                            var selValue = $(this).val();
                            if (selValue == "0") {
                                $(".customItemsettingsdiv").show();
                            } else {
                                $(".customItemsettingsdiv").hide();
                            }
                        });
                    }
                    if (_original_config.DataSource.length > 10 && _original_config.DataSource != '00000000-0000-0000-0000-000000000000') {
                        $(".customItemsettingsdiv", updateBox).hide();
                        $("#slt_selectdatasource option", updateBox).each(function () {
                            if ($(this).attr("value") == _original_config.DataSource) {
                                $(this).prop({ "selected": true });
                            } else {
                                //$(this).removeAttr("selected");//fix bug7512
                            }
                        });
                    } else {
                        $(".customItemsettingsdiv", updateBox).show();
                        var inputbox = $(".ctrl_selectoptions", _ctrlobj);
                        var originaltxt = "";
                        var originalItems = _original_config.FieldConfig.customItems;
                        if (!!originalItems) {
                            if (originalItems.length > 0) {
                                for (var i = 0; i < originalItems.length; i++) {
                                    originaltxt += decodeURIComponent(originalItems[i].text) + "\n";
                                }
                            }
                        } else {
                            originalItems = _original_config.FieldConfig.CustomItems;
                            if (originalItems.length > 0) {
                                for (var i = 0; i < originalItems.length; i++) {
                                    originaltxt += decodeURIComponent(originalItems[i].Value) + "\n";
                                }
                            }
                        }
                        $("#txt_areaselectitemset", updateBox).text(originaltxt.substring(0, originaltxt.lastIndexOf('\n')));
                    }
                });
            }
            return updateBox;
        }

    };
    return control_prototype;
});