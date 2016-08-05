/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {

    var control_prototype = {
        ctype: 'orgSelector',
        ipos: '0px -410px',
        name: '选部门控件',
        propertyHtml: function () {
            return require('../template/property-orgSelector.tpl');
        },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            var _curId = config.FieldConfig.selectorID;
            var _model = config.FieldConfig.sType;
            var ksnSelectUser = require("../fw_selector");
            ksnSelectUser.KSNSelector({ model: _model, element: "#" + _curId, searchType: { "org": true, "user": false, "grp": false } ,width:"none"});
        },
        inputs: function () {
            this.sType = $("#ksn_type_2").is(":checked") ? 2 : 1;
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../template/control-orgSelector.tpl');
            var render = template(ctrl_tpl);
            var MultiSelect = (this.sType == 2) ? true : false;
            var config = {
                ctype: arguments[0],
                FieldType: 7,//选部门控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 0,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    MultiSelect: MultiSelect,
                    sType: this.sType,
                    selectorID: 'ksn_ctrl_' + Math.random().toString().replace(".", "")
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
                $("#ksn_type_" + _original_config.FieldConfig.sType, updateBox).prop({ checked: true });
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
            }
            return updateBox;
        }
    };
    return control_prototype;
})