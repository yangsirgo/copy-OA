/**
 * Created by zhaozhu on 12/03/15.
 */
define(function (require) {

    var fnGetHtml = function(){
        var _html = '\
<div class="control-fullmember-container">\
    <div id="fullMemberConfig"></div>\
    <div class="control-fullmember-body">\
        <table class="control-fullmember-detail">\
            <tr>\
                <td class="fullmember-tr-label">转正人员</td>\
                <td>\
                    <span id="fullmember_userId" class="fullmember_info hidden" data-path="UserId"></span>\
                    <span id="fullmember_user_text" class="content-display fullmember_info" data-path="UserName"></span>\
                    <input id="fullmember_user" class="content-input" type="text" />\
                </td> \
                <td class="fullmember-tr-label">工号</td>\
                <td>\
                    <span class="fullmember_info" data-path="EmployeeId"></span>\
                </td>\
            </tr>\
            <tr>\
                <td class="fullmember-tr-label">性别</td>\
                <td>\
                    <span class="fullmember_info" data-path="Basic.Gender"></span>\
                </td>\
                <td class="fullmember-tr-label">入职日期</td>\
                <td>\
                    <span class="fullmember_info" data-path="Position.JoinedDate"></span>\
                </td>\
            </tr>\
            <tr>\
                <td class="fullmember-tr-label">出生日期</td>\
                <td>\
                    <span class="fullmember_info" data-path="Basic.DateOfBirth"></span>\
                </td>\
                <td class="fullmember-tr-label">当前职位</td>\
                <td>\
                    <span class="fullmember_info" data-path="Position.Position"></span>\
                </td>\
            </tr>\
            <tr>\
                <td class="fullmember-tr-label">当前职级</td>\
                <td>\
                    <span class="fullmember_info" data-path="ClassName"></span>\
                    <span class="fullmember_info position_rank" data-path="ClassScore" style="display:none;"></span>\
                </td>\
                <td class="fullmember-tr-label">毕业学校</td>\
                <td>\
                    <span class="fullmember_info" data-path="Educations"></span>\
                </td>\
            </tr>\
            <tr>\
                <td class="fullmember-tr-label">最高学历</td>\
                <td>\
                    <span class="fullmember_info" data-path="Basic.Education"></span>\
                </td>\
                <td class="fullmember-tr-label">计划转正日期</td>\
                <td>\
                    <span class="fullmember_info" data-path="Position.PlanToPositiveTime"></span>\
                </td>\
            </tr>\
            <tr>\
                <td class="fullmember-tr-label">实际转正日期</td>\
                <td>\
                    <span id="fullmember_date_text" class="content-display fullmember_info" data-path="Position.ActualObtainmentOfTime"></span>\
                    <input id="fullmember_date" type="text" class="content-input wfd_ctrl_datepiker" style="width: 180px;" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})">\
                </td>\
                <td class="fullmember-tr-label filedetails">档案详情</td>\
                <td colspan="3" class="filedetails">\
                    <a id="fullmember_hyperlink" href="" target="_blank">查看档案详情</a>\
                </td>\
            </tr>\
        </table>\
    </div>\
</div>';
        return _html;
    }
    var showDetailStart=true;
    var showDetailApprove=true;
    var control_prototype = {
        ctype: 'fullmember',
        ipos: '0px -727px',
        name: '转正控件（人事档案）',
        propertyHtml: function () {

            return '';
        },
        opened: function () {
           // $("#ck_procNode");
            //$("label[for='ck_procNode']");
            $('[for="ck_procNode"]').after('<input type="checkbox" checked="checked" id="ck_showDetailStart"><label for="ck_showDetailStart">发起时能查看档案详情</label>\
                      <input type="checkbox" checked="checked" id="ck_showDetailApprove"><label for="ck_showDetailApprove">审批时能查看档案详情</label>');
        },
        updateBoxShowed: function () {
           // $("#ck_procNode");
           // $("label[for='ck_procNode']");
            $('[for="ck_procNode"]').after('<input type="checkbox" id="ck_showDetailStart"><label for="ck_showDetailStart">发起时能查看档案详情</label>\
                      <input type="checkbox" id="ck_showDetailApprove"><label for="ck_showDetailApprove">审批时能查看档案详情</label>');
            if($('#fullMemberConfig').length!=0){
                var fullMemberConfig=$('#fullMemberConfig').attr('data');
                fullMemberConfig=JSON.parse(fullMemberConfig);
                showDetailStart=fullMemberConfig.showDetailStart;
                showDetailApprove=fullMemberConfig.showDetailApprove
            }
            if(showDetailStart){
                $('#ck_showDetailStart').prop('checked','checked')
            }
            if(showDetailApprove){
                $('#ck_showDetailApprove').prop('checked','checked')
            }
        },
        filled: function (ctrl) {
            var count = $('.control-fullmember-detail').length;
            if (count > 0) {
                alert('流程中只允许存在一个转正控件!');
                ctrl.remove();
            }
            var htmlContent = fnGetHtml();
            $(".ctrltxt", ctrl).append(htmlContent);
            $('#fullMemberConfig').attr('data',JSON.stringify({showDetailStart:showDetailStart,showDetailApprove:showDetailApprove}));
        },
        inputs: function () {
            this.subparam = this.isparam;
            showDetailStart= this.showDetailStart=$('#ck_showDetailStart').prop('checked') ? true :false;
            showDetailApprove=this.showDetailApprove=$('#ck_showDetailApprove').prop('checked') ? true :false;
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../../template/personnelfile/control-fullmember.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 42,//
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 3,
                IsProcDataField: false,
                subparam:this.isparam,
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
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.subparam });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
            }
            return updateBox;
        }
    };
    return control_prototype;
})