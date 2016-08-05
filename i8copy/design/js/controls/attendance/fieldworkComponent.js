/**
 * Created by chentao on 11/24/15.
 */
define(function (require) {

    var fnGetHtml = function(){
        var _html = '<div class="control-fieldwork-container">\
             <div class="control-fieldwork-body">\
               <table class="control-fieldwork-detail">\
               <thead><tr><th class="control-fieldwork-hide">UserId</th><th>序号</th><th>开始时间</th><th>结束时间</th><th>事由</th><th>操作</th></tr></thead>\
               <tbody class="control-fieldwork-data"></tbody>\
               </table>\
               <div class="control-fieldwork-control">\
               <table class="control-fieldwork-operation">\
                <tr><td class="control-fieldwork-title">开始时间</td><td class="control-fieldwork-content"><input type="text" id="fieldwork_startdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td><td class="control-fieldwork-title">结束时间</td><td class="control-fieldwork-content"><input type="text" id="fieldwork_enddate"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})"  /></td></tr>\
                <tr><td class="control-fieldwork-title">事由</td><td colspan="3" ><input class="field-fieldwork-remark" type="text"  /></td></tr>\
                <tr><td></td><td colspan="3" class="fieldwork-container"><a class="field-fieldwork-savebtn workflow-datagrid-addnewrow" href="javascript:void 0">添加</a></td></tr>\
                </table>\
               </div>\
             </div>\
            </div>';

        return _html;
    }

    var control_prototype = {
        ctype: 'fieldwork',
        ipos: '0px -655px',
        name: '外勤控件（考勤应用）',
        propertyHtml: function () {
            return "";
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
                alert('流程中只允许存在一个外勤控件!');
                ctrl.remove();
            }
            var htmlContent = fnGetHtml({'tagName':''});
            $(".ctrltxt", ctrl).append(htmlContent)
        },
        inputs: function () {

        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../../template/attendance/control-fieldwork.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 41,//数据应用假期组件
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
                            "colName" : "BeginTime",
                            "colText" : "开始日期",
                            "colType" : "DatePicker",
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
                            "colName" : "EndTime",
                            "colText" : "结束日期",
                            "colType" : "DatePicker",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 8,
                            "DataType" : 5
                        },
                        {
                            "colName" : "Remark",
                            "colText" : "事由",
                            "colType" : "DatePicker",
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