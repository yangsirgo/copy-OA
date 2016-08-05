/**
 * Created by ryf on 2016/8/4.
 */
define(function (require) {
    var control_prototype = {
        ctype: 'dateTime',
        ipos: '0px -286px',
        name: '日期控件',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">时间设定：</span></div><div class="brbx"><input type="radio" id="date_format_1" name="rd_date_format" checked="checked" value="yyyy-MM-dd"/><label for="date_format_1">年-月-日</label><br/><input type="radio" id="date_format_2" name="rd_date_format" value="yyyy-MM-dd HH"/><label for="date_format_2">年-月-日 小时:00:00</label><br/><input type="radio" id="date_format_3" name="rd_date_format" value="yyyy-MM-dd HH:mm"/><label for="date_format_3">年-月-日 小时:分钟:00</label><br/><input type="radio" id="date_format_4" name="rd_date_format" value="yyyy-MM-dd HH:mm:ss"/><label for="date_format_4">年-月-日 小时:分钟:秒</label></div></div><div class="boxrow" style="display:none"><div class="brtt"><span class="span_bfieldTxt">时间关系：</span></div><div class="brbx"><select id="ctr_dateRelation_1"><option>早于</option><option>晚于</option></select><select><option>审批时间</option></select><br/><select id="ctr_dateRelation_2"><option>早于</option><option>晚于</option></select><select><option>发起时间</option></select></div></div>'],
        propertyHtml: function () {
            return require('../template/property-dateTime.tpl');
        },
        inputs: function () {
            this.dateformate = $(":radio[name='rd_date_format']:checked").val();
        },
        opened:function(){
            $("#ck_procNode").prop({ disabled: true });
        },
        ckInputs: function () { return true; },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            $(".ctrltxt input", ctrl).attr("onFocus", "WdatePicker({dateFmt:'" + config.FieldConfig.DateFormatStr + "'})");
        },
        cformat: function () {
            var ctrl_tpl = require('../template/control-dateTime.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 8,//日历控件
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
                    //dateformate: this.dateformate
                    DateFormatStr: this.dateformate
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="1"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><input type="text" class="wfd_ctrl_datepiker" isparam="' + this.isparam + '" mustinput="' + this.mustinput + '" dateformat="' + this.dateformate + '" onFocus="WdatePicker({dateFmt:\'' + this.dateformate + '\'})" valuetype="50"/></div></div>');
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $(":radio[name='rd_date_format'][value='" + $.trim(_original_config.FieldConfig.DateFormatStr) + "']", updateBox).prop({ checked: true });
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                $("#ck_procNode",updateBox).prop({ disabled: true });
            }
            return updateBox;
        }
    };
    return control_prototype;
})