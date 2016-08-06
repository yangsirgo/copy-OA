/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    var bindEvent = function (container) {
        container.find("#slt_moneyType").change(function () {
            if ($(this).val() == '美元') {
                $(this).parents('.boxrow').prev().hide();
            } else {
                $(this).parents('.boxrow').prev().show();
            }
        })
    }
    var control_prototype = {
        ctype: 'moneyTextBox',
        ipos: '0px -490px',
        name: '金额控件',
        propertyHtml: function () {
            return require('../template/property-moneyTextBox.tpl');
        },
        opened: function () {
            bindEvent($(document));
        },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            // require('/resource/default/common/js/workflow/changeCNAMoney.js');
            var toChineseHtml = "";
            if (config.FieldConfig.toChinese && config.FieldConfig.moneyType == '人民币') {
                toChineseHtml = "<span  class='span_ChineseNum'><span>&nbsp;大写：</span><span class='ChinesNum'></span></div>";
            }
            var moneyTypeHtml = ""
            moneyTypeHtml = "&nbsp;<span class='span_money' moneyType='" + config.FieldConfig.moneyType + "'>(&nbsp;" + config.FieldConfig.moneyType + "&nbsp;)</span>&nbsp;&nbsp;&nbsp;&nbsp;";
            $(".ctrltxt", ctrl).append(moneyTypeHtml + toChineseHtml);
        },
        inputs: function () {
            if ($("#toChinese").attr("checked") == "checked") {
                this.toChinese = true;
            } else {
                this.toChinese = false;
            }
            this.moneyType = $("#slt_moneyType").val();
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../template/control-moneyTextBox.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 11,//金额控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 1,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    toChinese: this.toChinese,
                    moneyType: this.moneyType
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
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                if (_original_config.FieldConfig.toChinese) {
                    $("#toChinese", updateBox).prop({ checked: true });
                }
                $("#slt_moneyType option[value=" + _original_config.FieldConfig.moneyType + "]", updateBox).prop({ selected: true });
                //美元时隐藏显示大写选项
                if(_original_config.FieldConfig.moneyType == '美元')
                {
                    $("#toChinese", updateBox).parents('.boxrow').hide();
                }
            }
            bindEvent(updateBox);
            return updateBox;
        }
    };
    return control_prototype;
})