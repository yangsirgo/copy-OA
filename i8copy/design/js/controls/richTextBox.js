/**
 * Created by ryf on 2016/8/4.
 */
/**
 * Created by kusion on 2014/12/3.
 */
define(function (require) {
    require('../jwysiwyg/jquery.wysiwyg');
    var utilModel = require('../util.js');
    //白名单
    var white_list = utilModel.workflowWhiteList;
    var control_prototype = {
        ctype: 'richTextBox',
        ipos: '0px -40px',
        name: '富文本框',
        propertyHtml: function () {
            return require('../template/property-richTextBox.tpl');
        },
        inputs: function () {
            this.minLength = $.trim($("#txt_minLength").val());
            this.maxLength = $.trim($("#txt_maxLength").val());
            if (!this.minLength) {
                this.minLength = 0;
            }
            if (!this.maxLength) {
                this.maxLength = 3000;
            }
            this.defaultvalue = $.trim($("#txt_defaulttxt").val());
        },
        ckInputs: function () {
            var _defaultValue = $.trim($("#txt_defaulttxt").val());
            if (_defaultValue.length > 0) {
                white_list.lastIndex = 0;
                if (!white_list.test(_defaultValue)) {
                    alert('默认值不符合规则！');
                    return false;
                }
            }
            return true;
        },
        cformat: function () {
            var ctrl_tpl = require('../template/control-richTextBox.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 9,//富文本框
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: this.defaultvalue,
                DataType: 0,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    maxLength: this.maxLength,
                    minLength: this.minLength,
                    txtValueType: 0
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
        },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            var richBox=$(".txt-richbox",ctrl);
            richBox.wysiwyg({
                controls:{insertImage:{visible: false},
                    unLink:{visible: false},
                    createLink:{visible: false},
                    insertTable:{visible: false},
                    code:{visible:false}
                }
            });

        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#txt_defaulttxt", updateBox).val(_original_config.DefaultValue);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
            }
            return updateBox;
        }
    };
    return control_prototype;
});