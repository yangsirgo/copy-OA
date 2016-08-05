/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    var utilModel = require('../util.js');
    //白名单
    var white_list = utilModel.workflowWhiteList;
    var control_prototype = {
        ctype: 'mutiTextBox',
        ipos: '0px -40px',
        name: '多行文本框',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">默认值：</span></div><div class="brbx"><input type="text" id="txt_defaulttxt" class="txtboxcs" value=""/></div></div>'],
        propertyHtml: function () {
            return require('../template/property-mutiTextBox.tpl');
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
            var ctrl_tpl = require('../template/control-mutiTextBox.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 1,//文本域
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: (this.defaultvalue||''),
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
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="0"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><textarea rows="5" cols="5" class="tbox_mutiLineBox" maxlength="' + this.maxLength + '" minlength="' + this.minLength + '" isparam="' + this.isparam + '" mustinput="' + this.mustinput + '" >' + this.defaultvalue + '</textarea></div></div>');
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
            //var updateBox = DataBase.getValueByType(_ctype, "box");
            //var updateBox = $((new builder(_ctype)).toBoxString());
            //var _title = $(".ctitletxt", _ctrlobj).text();
            //var inputbox = $(".tbox_mutiLineBox", _ctrlobj);
            //var _maxlth = inputbox.attr("maxlength");
            //var _minlth = inputbox.attr("minlength");
            //var _default = inputbox.val();
            //var _mustinput = inputbox.attr("mustinput");
            //var _isparam = inputbox.attr("isparam");
            //$("#txt_ctrlTitleName", updateBox).val(_title);
            //$("#txt_maxLength", updateBox).val(_maxlth);
            //$("#txt_minLength", updateBox).val(_minlth);
            //$("#txt_defaulttxt", updateBox).val(_default);
            //$("#ck_procNode", updateBox).prop({ checked: _isparam == "true" });
            //$("#ck_mustchecked", updateBox).prop({ checked: _mustinput == "true" });
            return updateBox;
        }
        //,
        //updateCtrlBox: function (_ctype, _ctrlobj, comInputs) {
        //    //var oRow = DataBase.getControlByType(_ctype);
        //    //var prinput = new oRow.inputs();
        //    //DataBase.comInputs.call(prinput);
        //    var prinput = new this.inputs();
        //    comInputs.call(prinput);
        //    var inputbox = $(".tbox_mutiLineBox", _ctrlobj)
        //    $(".ctitletxt", _ctrlobj).text(prinput.title);
        //    inputbox.attr("maxlength", prinput.maxLength);
        //    inputbox.attr("minlength", prinput.minLength);
        //    inputbox.val(prinput.defaultvalue);
        //    inputbox.attr("mustinput", prinput.mustinput);
        //    if (prinput.mustinput) {
        //        $(".span_mustinputtag", _ctrlobj).css("visibility", "visible");
        //    } else {
        //        $(".span_mustinputtag", _ctrlobj).css("visibility", "hidden");
        //    }
        //    inputbox.attr("isparam", prinput.isparam);
        //}
    };
    return control_prototype;
});