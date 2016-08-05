/**
 * Created by Administrator on 2015/8/5.
 */
define(function (require) {
    var control_prototype = {
        ctype: 'bankSlip',
        ipos: '0px -772px',
        name: '银行水单控件（i8金融）',
        getInitHtml: function (option) {

        },
        propertyHtml: function () {
            return '';//require('../../template/payment/property-bankSlipComponent.tpl');
        },
        inputs: function () {
           // this.dateformate = $(":radio[name='rd_date_format']:checked").val();
        },
        opened:function(){
            $("#ck_procNode").hide();//prop({ disabled: true });
            $('label[for="ck_procNode"]').hide();
        },
        ckInputs: function () { return true; },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).html()));
            //$(".ctrltxt input", ctrl).attr("onFocus", "WdatePicker({dateFmt:'" + config.FieldConfig.DateFormatStr + "'})");
        },
        cformat: function () {
            var ctrl_tpl = require('../../template/payment/control-bankSlipComponent.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 36,//日历控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 5,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {

                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="1"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><input type="text" class="wfd_ctrl_datepiker" isparam="' + this.isparam + '" mustinput="' + this.mustinput + '" dateformat="' + this.dateformate + '" onFocus="WdatePicker({dateFmt:\'' + this.dateformate + '\'})" valuetype="50"/></div></div>');
        },
        updateBoxShowed: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $(":radio[name='rd_date_format'][value='" + $.trim(_original_config.FieldConfig.DateFormatStr) + "']", updateBox).prop({ checked: true });
                //$("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });

            }
            return updateBox;
        }
    };
    return control_prototype;


});