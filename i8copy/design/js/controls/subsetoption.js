/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    var dataCache=require('../sourceCache');
    var control_prototype = {
        ctype: 'subsetoption', ipos: '0px -532px', name: '级联菜单',
        propertyHtml: function () {
            return require('../template/property-subsetoption.tpl');
        },
        opened: function () {
            dataCache.getMainSource(function(datasource){
                var optionCode = "";
                if (datasource.length > 0) {
                    for (var i = 0; i < datasource.length; i++) {
                        optionCode += '<option value="' + datasource[i].ID + '">' + datasource[i].Name + '</option>';
                    }
                    $("#slt_selectdatasource").append(optionCode);
                }
            });
        },
        inputs: function () {
            this.sourceType = $("#slt_selectdatasource option:checked").text();
            this.sourceValue = $("#slt_selectdatasource").val();
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../template/control-subsetoption.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 13,//级联控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 0,
                IsProcDataField: this.isparam,
                IsBindData: this.sourceType.length > 10,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: this.sourceValue,
                FieldConfig: {},
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            var itemSource = [];
            config.str_config = $.JSONString(config);
            config.sourcelist = itemSource;
            return render(config);
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
                    if (datasource.length > 0) {
                        for (var i = 0; i < datasource.length; i++) {
                            optionCode += '<option value="' + datasource[i].ID + '">' + datasource[i].Name + '</option>';
                        }
                        $("#slt_selectdatasource",updateBox).append(optionCode);
                    }
                });
                /*var datasource = window["DATARESOURCE"];
                 var optionCode = "";
                 if (datasource.length > 0) {
                 for (var i = 0; i < datasource.length; i++) {
                 optionCode += '<option value="' + datasource[i].sourceid + '"' + (datasource[i].sourceid == _original_config.DataSource ? ' selected="selected" ' : '') + '>' + datasource[i].sourceName + '</option>';
                 }
                 $("#slt_selectdatasource", updateBox).append(optionCode);
                 }*/
                if (_original_config.DataSource.length > 10) {
                    $("#slt_selectdatasource option", updateBox).each(function () {
                        if ($(this).attr("value") == _original_config.DataSource) {
                            $(this).prop({ "selected": true });
                        } else {
                            //$(this).removeAttr("selected");//fix bug7512
                        }
                    });
                }
            }

            return updateBox;
        },
        filled: function (obj) {
            if (typeof obj == 'object') {
                var subsetObj = obj.find(".ctrl_subsetoptions");
                var config = $.parseJSON($.trim(obj.find("pre").html()));
                dataCache.getSourceByID(config.DataSource,function(datalist){
                    var level_1_code='<option value="0" text="--请选择--">--请选择--</option>';
                    _.each(datalist,function(item1){
                        level_1_code += '<option value="' + item1.ID + '" text="' + item1.Value + '">' + item1.Value + '</option>';
                    })
                    $(".ctrl_mainoptions",obj).html(level_1_code);
                    $(".ctrl_mainoptions",obj).change(function(){
                        var parentID = $.trim($(this).val());
                        var objItems= _.findWhere(datalist,{ID:parentID});
                        var suboptHtml='<option value="0" text="--请选择--">--请选择--</option>'
                        _.each(objItems.subItems,function(item){
                            suboptHtml += '<option value="' + item.ID + '" text="' + item.Value + '">' + item.Value + '</option>';
                        });
                        subsetObj.html(suboptHtml);
                    });
                });
            }
        }
    };
    return control_prototype;
});