define(function (require) {
    var controlObj = require('../control-enum.js');
    var controlEnum = controlObj.controlEnum,
        controlDict = controlObj.controlDict;

    var control_prototype = {
        ctype: 'UserInfoComponent',
        ipos: '0px -613px',
        name: '员工信息控件',
        propertyHtml: function () {
            return require('../template/property-userInfoComponent.tpl');
        },
        opened:function(){
            //$("#ck_procNode").prop({ disabled: true });
        },
        filled: function (ctrl) {
            var config = $.parseJSON($.trim($("pre", ctrl).text()));
            var checkboxs = [];
            for (var i = 0; i < config.FieldConfig.Items.length; i++){
                checkboxs.push(config.FieldConfig.Items[i]["key"]);
            }
            var str_htmlContent = $.fn.personInfo.initHtml(checkboxs, config.IsProcDataField, config.IsRequire);
            if(!!config.IsDelegate){
                var _$vacationSummaryComponent = $('.control-vacation-container').parents('.ctrlbox');
               // var _$cancelVacationComponent = $('div[ctype=cancelVacationComponent]');
                if(_$vacationSummaryComponent.length>0) {
                    if(_$vacationSummaryComponent.attr('ctype') == 'VacationSummaryComponent' || _$vacationSummaryComponent.attr('ctype') == 'cancelVacationComponent' ) {
                        alert('请假和销假无法代理发起，请先去掉员工信息中的代理设置！');
                        ctrl.remove();
                    }
                }
            }
            $(".ctrltxt", ctrl).append(str_htmlContent);
        },
        inputs: function () {
            var arr = [];
            $(".brbx div input:checked").each(function (i) {
                var obj = {};
                obj.key = $(this).attr("name");
                obj.value = $(this).next().text();
                arr.push(obj);
            });
            this.showCheckboxes = arr;
            this.isDelegate = $('.brbx_delegate').find('input').is(':checked');
            this.isSubparam =  this.isparam;//$("#ck_procNode").prop('checked');
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var _procDataFieldConfig = [];

            var ctrl_tpl = require('../template/control-userInfoComponent.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 12,//人员基础信息显示控件
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: '',
                DataType: 0,
                IsProcDataField: false,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                IsDelegate: this.isDelegate,
                IsSubparam:this.isparam,
                FieldConfig: {
                    Items: this.showCheckboxes,
                    objExt: this.isDelegate?1:0
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")

            };
//            if(!!this.isparam){
//                var _positionId = '';
//                var _retObj = _.find( window["mainSourceList"],function(item){ return item.Type == 2});
//                _positionId = _retObj.ID;
                //增加人员信息
//                _procDataFieldConfig.push({
//                    ctype: controlDict.orgselector,
//                    FieldType: controlEnum.orgselector,//人员基础信息显示控件
//                    FieldID: this.fieldID()+'_departmentofcreator',
//                    FieldName: '发起人所在部门',
//                    DefaultValue: '',
//                    DataType: 0,
//                    IsProcDataField: this.isparam,
//                    IsBindData: false,
//                    IsRequire: this.mustinput,
//                    DataSource: '',
//
//                    SortIndex: 0,
//                    isvisible: (this.mustinput ? "visible" : "hidden")
//                });
                //增加部门信息
//                _procDataFieldConfig.push({
//                    ctype:controlDict.selectoption,
//                    FieldType: controlEnum.selectoption,//人员基础信息显示控件
//                    FieldID:  this.fieldID()+'_levelofcreator',
//                    FieldName: '职级',
//                    DefaultValue: '',
//                    FieldConfig:{
//                        sType:"1",
//                        parentField:this.fieldID(),
//                        calcField:this.fieldID()+'_levelofcreator'
//                    },
//                    DataType:1,
//                    IsProcDataField: this.isparam,
//                    IsBindData: false,
//                    IsRequire: this.mustinput,
//                    DataSource: _positionId,
//                    SortIndex: 0,
//                    isvisible: (this.mustinput ? "visible" : "hidden")
//                });
//            }
//
//            if(!!this.isDelegate){
//                _procDataFieldConfig.push({  ctype:controlDict.userkey,
//                    FieldType: controlEnum.userkey,//人员基础信息显示控件
//                    FieldID:  this.fieldID()+'_creator',
//                    FieldName: '代理人',
//                    DefaultValue: '',
//                    DataType: 0,
//                    IsProcDataField: true,
//                    IsBindData: false,
//                    IsRequire: this.mustinput,
//                    DataSource: '',
//                    FieldConfig:{
//                        sType:"1",
//                        parentField:this.fieldID(),
//                        calcField:this.fieldID()+'_levelofcreator'
//                    },
//                    SortIndex: 0,
//                    isvisible: (this.mustinput ? "visible" : "hidden")});
//
//            }
//            config.ProcDataFieldConfig = _procDataFieldConfig;
            config.str_config = $.JSONString(config);
            return render(config);
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            var checkeds = _original_config.FieldConfig;
            checkeds = checkeds["Items"];
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsSubparam });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });
                $('input[name="delegate"]',updateBox).prop({checked:_original_config.IsDelegate});
               // $("#ck_procNode",updateBox).prop({ checked: _original_config });
                if (checkeds && checkeds.length > 0) {
                    for (var i = 0; i < checkeds.length; i++) {
                        $("input[type=checkbox][name=" + checkeds[i]["key"] + "]", updateBox).prop("checked", true);
                    }
                }
            }
            return updateBox;
        }
    };
    return control_prototype;
})