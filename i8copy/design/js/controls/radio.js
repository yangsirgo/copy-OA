/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    //var white_list = /^[\u4e00-\u9fa5_a-zA-Z0-9\s]+$/ig;
    // var white_list = /^[（），。‘“！'"=@#%_\!\$\^\*\(\)\+\|\-\\\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
    var utilModel = require('../util.js');
    //白名单
    var white_list = utilModel.workflowWhiteList;
    var dataCache=require('../sourceCache');
    var control_prototype = {
        ctype: 'radio', ipos: '0px -204px', name: '单选框控件',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">数据源：</span></div><div class="brbx"><select id="slt_selectdatasource"><option value="0">自定义数据</option></select> <a id="a_link_newdatasource" style="display:none;">新增数据源</a></div></div><div class="boxrow customItemsettingsdiv"><div class="brtt"><span class="span_bfieldTxt">选项设置：</span></div><div class="brbx"><textarea class="areaselectitemset" id="txt_mutiselectitemset" rows="5" cols="5">选项1\n选项2\n选择3</textarea></div></div>'],
        propertyHtml: function () {
            return require('../template/property-radio.tpl');
        },
        opened: function () {
            dataCache.getMainSource(function(datasource){
                var optionCode = "";
                _.each(datasource,function(item){
                    optionCode += '<option value="' + item.ID + '">' + item.Name + '</option>';
                });
                $("#txt_singleselectitemset").val("选项1\n选项2\n选项3");
                $("#slt_selectdatasource").append(optionCode).change(function () {
                    var selValue = $(this).val();
                    if (selValue == "0") {
                        $(".customItemsettingsdiv").show();
                    } else {
                        $(".customItemsettingsdiv").hide();
                    }
                });
            });
            /*var datasource = window["DATARESOURCE"];
             var optionCode = "";
             if (datasource.length > 0) {
             for (var i = 0; i < datasource.length; i++) {
             optionCode += '<option value="' + datasource[i].sourceid + '">' + datasource[i].sourceName + '</option>';
             }
             }
             $("#txt_singleselectitemset").val("选项1\n选项2\n选项3");
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
        },
        inputs: function () {
            this.sourceType = $("#slt_selectdatasource option:checked").text();
            this.sourceValue = $("#slt_selectdatasource").val();
        },
        ckInputs: function () {
            var _itemsValue = $.trim($("#txt_singleselectitemset").val() || '');
            white_list.lastIndex = 0;
            if (!white_list.test(_itemsValue) && _itemsValue.length>0) {
                alert('选项设置中包含非法字符！');
                return false;
            }
            return true;
        },
        cformat: function () {
            var sourceType = $("#slt_selectdatasource").val();
            var ctrl_tpl = require('../template/control-radio.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 4,//单选按钮
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
                    customItems: [],
                    radioGroupName:"rdm_gp" + Math.random().toString().replace(".", "")
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            var itemSource = [];//, dataSourcels = window["DATARESOURCE"];
            //var sourceName = $("#slt_selectdatasource option:selected").text();
            if (sourceType == "0") {
                var _items = $("#txt_singleselectitemset").val();
                //var _xssFilter = require('../../../fw_xss_attack.js');
                //var _filterStr = _items.scriptTags(_items);
                _items = _items.replace(/<[^>]*>/gi, '');
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
            } /*else {
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
        },
        filled:function(ctrl){
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            if(config.DataSource.length==36){
                dataCache.getSourceByID(config.DataSource,function(data){
                    var optionCode = "",op_name="rd_"+ _.uniqueId("id_");
                    _.each(data,function(item){
                        optionCode +='<input type="radio" id="rd_item_'+item.ID+'" name="'+op_name+'"/><label for="rd_item_'+item.ID+'">'+item.Text+'</label>';// '<option value="' + item.ID + '">' + item.Text + '</option>';
                    })
                    ctrl.find(".ctrl_radioboxoptions").append(optionCode);
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
                if(_original_config.DataSource.length!=36){
                    $(".customItemsettingsdiv", updateBox).show();
                    var originaltxt = "";
                    var originalItems = _original_config.FieldConfig.customItems;
                    if (originalItems.length > 0) {
                        for (var i = 0; i < originalItems.length; i++) {
                            originaltxt += originalItems[i].text + "\n";
                        }
                    }
                    $("#txt_singleselectitemset", updateBox).text(originaltxt.substring(0, originaltxt.lastIndexOf('\n')));
                }
            }
            return updateBox;
        }, updateBoxShowed:function(ctrl){
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            //if(config.DataSource.length==36) {
            dataCache.getMainSource(function(datasource){
                var optionCode = "";
                _.each(datasource,function(item){
                    optionCode += '<option value="' + item.ID + '">' + item.Name + '</option>';
                });
                //$("#txt_singleselectitemset").val("选项1\n选项2\n选项3");
                $("#slt_selectdatasource").append(optionCode).change(function () {
                    var selValue = $(this).val();
                    if (selValue == "0") {
                        $("#txt_singleselectitemset").val("选项1\n选项2\n选项3");
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
            //}
        }
    };
    return control_prototype;
})


