/**
 * Created by Administrator on 2015/10/20.
 */

define(function (require) {

    var fnGetHtml = function(){
        var _html = '<div class="control-punchforget-container">\
             <div class="control-punchforget-body">\
               <table class="control-punchforget-detail">\
               <thead><tr><th class="control-punchforget-hide">UserId</th><th class="control-punchforget-hide">ScheduleDate</th><th class="control-punchforget-hide">PeriodIndex</th><th class="control-punchforget-hide">PunchType</th><th>序号</th><th>日期</th><th>异常详情</th><th>处理详情</th><th>操作</th></tr></thead>\
               <tbody class="control-punchforget-data"></tbody>\
               </table>\
               <div class="control-punchforget-control">\
               <a href="javascript:void 0" class="punchforget-addnewrow process-td-control-btnadd">新增</a>\
               </div>\
             </div>\
            </div>';

        return _html;
    }

    var control_prototype = {
        ctype: 'punchForget',
        ipos: '0px -655px',
        name: '漏打卡控件（考勤应用）', //漏打卡控件
        propertyHtml: function () {
            return "";
           // return require('../template/property-punchForget.tpl');
        },
        opened: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
        },
        updateBoxShowed: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
        },
        filled: function (ctrl) {
            var count = $('.control-punch-detail').length;
            if (count > 0) {
                alert('流程中只允许存在一个漏打卡控件!');
                ctrl.remove();
            }
	    var htmlContent = fnGetHtml({'tagName':''});
                $(".ctrltxt", ctrl).append(htmlContent)
        },
        inputs: function () {

        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../../template/attendance/control-punchForget.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 40,//数据应用假期组件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 3,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    "GridConfig" : [
                        {
                            "colName" : "UserId",
                            "colText" : "用户id",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "ScheduleDate",
                            "colText" : "考勤日期",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "PeriodIndex",
                            "colText" : "时间段",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "PunchType",
                            "colText" : "打卡类型",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "rowIndex",
                            "colText" : "序号",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 1
                        },
                        {
                            "colName" : "punchDate",
                            "colText" : "日期",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 1
                        },
                        {
                            "colName" : "punchDetail",
                            "colText" : "异常详情",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 1
                        },
                        {
                            "colName" : "handleDetail",
                            "colText" : "处理详情",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 1
                        }

                    ]
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
            }
            return updateBox;
        }
    };
    return control_prototype;
})
