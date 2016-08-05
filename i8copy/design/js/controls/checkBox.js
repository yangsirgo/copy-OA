define(function (require) {
    var utilModel = require('../util.js');
    var dataCache=require('../sourceCache');
    var control_prototype = {
        ctype: 'checkBox', ipos: '0px -163px', name: '多选框控件',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">数据源：</span></div><div class="brbx"><select id="slt_selectdatasource"><option value="0">自定义数据</option></select> <a id="a_link_newdatasource" style="display:none;">新增数据源</a></div></div><div class="boxrow customItemsettingsdiv"><div class="brtt"><span class="span_bfieldTxt">选项设置：</span></div><div class="brbx"><textarea class="areaselectitemset" id="txt_mutiselectitemset" rows="5" cols="5">选项1\n选项2\n选择3</textarea></div></div>'],
        propertyHtml: function () {
            return require('../template/property-checkBox.tpl');
        },
        opened: function () {
/*            var datasource = window["DATARESOURCE"];
            var optionCode = "";
            if (datasource.length > 0) {
                for (var i = 0; i < datasource.length; i++) {
                    optionCode += '<option value="' + datasource[i].sourceid + '">' + datasource[i].sourceName + '</option>';
                }
            }
            $("#txt_mutiselectitemset").val("选项1\n选项2\n选项3");
            $("#slt_selectdatasource").append(optionCode).change(function () {
                var selValue = $(this).val();
                if (selValue == "0") {
                    $(".customItemsettingsdiv").show();
                } else {
                    $(".customItemsettingsdiv").hide();
                }
            });*/
            //$("#a_link_newdatasource").click(function () {
            //    $(".fdMsgBox .closetag").click();
            //    setTimeout(function () {
            //        $("#c_add_newdataType").click();
            //    }, 300);
            //})
            dataCache.getMainSource(function(datasource){
                var optionCode = "";
                _.each(datasource,function(item){
                    optionCode += '<option value="' + item.ID + '">' + item.Name + '</option>';
                });
                $("#txt_mutiselectitemset").val("选项1\n选项2\n选项3");
                $("#slt_selectdatasource").append(optionCode).change(function () {
                    var selValue = $(this).val();
                    if (selValue == "0") {
                        $(".customItemsettingsdiv").show();
                    } else {
                        $(".customItemsettingsdiv").hide();
                    }
                });
            });
        },
        inputs: function () {
            this.sourceType = $("#slt_selectdatasource option:checked").text();
            this.sourceValue = $("#slt_selectdatasource").val();
        },
        ckInputs: function () {
            var _itemsValue = $.trim($("#txt_mutiselectitemset").val() || '');

            
            if (_itemsValue.length > 0) {
                var _validateResult = utilModel.workflowInputVerify(_itemsValue);
                if (!_validateResult.result) {
                    alert(_validateResult.tips);
                    return false;
                }
                
            }
            return true;
        },
        cformat: function () {
            //var _items = $("#txt_mutiselectitemset").val();
            //var sourceidCode = '';
            //var sourceType = $("#slt_selectdatasource").val();
            //if (sourceType == "0") {
            //    if (_items.length > 0) {
            //        var ary_item = _items.split('\n');
            //        if (ary_item.length > 0) {
            //            _items = "";
            //            for (var i = 0; i < ary_item.length; i++) {
            //                var cid = 'ckb_item' + i + "_rdm" + Math.random().toString().replace(".", "");
            //                if ($.trim(ary_item[i]).length > 0) {
            //                    _items += '<input type="checkbox" id="' + cid + '"/><label for="' + cid + '">' + ary_item[i] + '</label>';
            //                }
            //            }
            //        }
            //    }
            //} else {
            //    var sourceName = $("#slt_selectdatasource option:selected").text();
            //    var datasource = window["DATARESOURCE"];
            //    _items = '';
            //    for (var i = 0; i < datasource.length; i++) {
            //        if (datasource[i].sourceName == sourceName) {
            //            var dlist = datasource[i].sourceList;
            //            dlist = dlist == null ? [] : dlist;
            //            for (var j = 0; j < dlist.length; j++) {
            //                var cid = 'ckb_item' + i + "_rdm" + Math.random().toString().replace(".", "");
            //                _items += '<input type="checkbox" id="' + cid + '"/><label for="' + cid + '">' + dlist[j].text + '</label>';
            //            }
            //            sourceidCode = ' sourceid="' + datasource[i].sourceid + '" sourcename="' + sourceName + '"';
            //        }
            //    }
            //}

            var sourceType = $("#slt_selectdatasource").val();
            var ctrl_tpl = require('../template/control-checkBox.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 5,//复选框
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 0,
                IsProcDataField: this.isparam,
                IsBindData: sourceType.length > 10,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: this.sourceValue,
                FieldConfig: {
                    customItems:[]
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            var itemSource = [], dataSourcels = window["DATARESOURCE"];
            var sourceName = $("#slt_selectdatasource option:selected").text();
            if (sourceType == "0") {
                var _items = $("#txt_mutiselectitemset").val();
                if (_items.length > 0) {
                    var ary_item = _items.split('\n');
                    if (ary_item.length > 0) {                        
                        for (var i = 0; i < ary_item.length; i++) {
                            var cid = i + "_rdm" + Math.random().toString().replace(".", "");
                            if ($.trim(ary_item[i]).length > 0) {
                                itemSource.push({ key: ary_item[i], value: ary_item[i], id: cid, text: ary_item[i] });
                            }
                        }
                        config.FieldConfig.customItems = itemSource;
                    }
                }
            }/* else {
                if (dataSourcels.length > 0) {
                    for (var i = 0; i < dataSourcels.length; i++) {
                        if (dataSourcels[i].name == sourceName) {
                            itemSource = dataSourcels[i].list;
                        }
                    }
                }
            }*/
            config.str_config = $.JSONString(config);
            config.sourcelist = itemSource;
            return render(config);
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="1"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><div class="ctrl_checkboxoptions"  isparam="' + this.isparam + '" mustinput="' + this.mustinput + '" ' + sourceidCode + '>' + _items + '</div></div></div>');
        },
        filled:function(ctrl){
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            if(config.DataSource.length==36){
                dataCache.getSourceByID(config.DataSource,function(data){
                    var optionCode = "";
                    _.each(data,function(item){
                        optionCode +='<input type="checkbox" id="crd_item_'+item.ID+'" /><label for="crd_item_'+item.ID+'">'+item.Text+'</label>';// '<option value="' + item.ID + '">' + item.Text + '</option>';
                    })
                    ctrl.find(".ctrl_checkboxoptions").append(optionCode);
                })
            }
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                    dataCache.getMainSource(function(datasource){
                        var optionCode = "";
                        _.each(datasource,function(item){
                            optionCode += '<option value="' + item.ID + '">' + item.Name + '</option>';
                        });
                        $("#txt_mutiselectitemset").val("选项1\n选项2\n选项3");
                        $("#slt_selectdatasource").append(optionCode).change(function () {
                            var selValue = $(this).val();
                            if (selValue == "0") {
                                $(".customItemsettingsdiv").show();
                            } else {
                                $(".customItemsettingsdiv").hide();
                            }
                        });
                    });
                if(_original_config.DataSource.length!=36){
                    $(".customItemsettingsdiv", updateBox).show();                    
                    var originaltxt = "";
                    var originalItems=_original_config.FieldConfig.customItems;
                    if (originalItems.length > 0) {
                        for (var i = 0; i < originalItems.length; i++) {
                            originaltxt += originalItems[i].text + "\n";
                        }
                    }                    
                    $("#txt_mutiselectitemset", updateBox).text(originaltxt.substring(0, originaltxt.lastIndexOf('\n')));
                }
            }
            return updateBox;
        },
        updateBoxShowed:function(ctrl){
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            //if(config.DataSource.length==36) {
                dataCache.getMainSource(function(datasource){
                    var optionCode = "";
                    _.each(datasource,function(item){
                        optionCode += '<option value="' + item.ID + '">' + item.Name + '</option>';
                    });
                    //
                    $("#slt_selectdatasource").append(optionCode).change(function () {
                        var selValue = $(this).val();
                        if (selValue == "0") {
                            $("#txt_mutiselectitemset").val("选项1\n选项2\n选项3");
                            $(".customItemsettingsdiv").show();
                        } else {
                            $(".customItemsettingsdiv").hide();
                        }
                    });
                    if (config.DataSource.length == 36) {
                        $(".customItemsettingsdiv").hide();
                        $("#slt_selectdatasource option").each(function () {
                            if ($(this).attr("value") == config.DataSource) {
                                $(this).prop({ "selected": true });
                            } else {
                                //$(this).removeAttr("selected");//fix bug7512
                            }
                        });
                    }
                });
           // }
        }
    };
    return control_prototype;
})



