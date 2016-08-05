
/**
 * Created by chent696 on 4/28/2015.
 */

define(function (require) {
    var gridConfig =  [
        {
            "colName" : "rowIndex",
            "colText" : "行号",
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
            "colName" : "usage",
            "colText" : "费用用途",
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
            "colName" : "costCenter",
            "colText" : "核算中心",
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
            "ControlType" : 3,
            "DataType" : 0
        },
        {
            "colName" : "itemName",
            "colText" : "收支项",
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
            "ControlType" : 3,
            "DataType" : 0
        },
        {
            "colName" : "feetime",
            "colText" : "月份",
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
            "ControlType" : 0,
            "DataType" : 1
        },
        {
            "colName" : "foreignAmount",
            "colText" : "金额",
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
            "ControlType" : 0,
            "DataType" : 1
        },
    {
        "colName" : "foreignCurrency",
        "colText" : "货币类型",
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
        "ControlType" : 0,
        "DataType" : 1
    },
        {
            "colName" : "occupation",
            "colText" : "本期发生",
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
            "DataType" : 1,
            "IsStartHidden":1
        },
        {
            "colName" : "ongoing",
            "colText" : "审批中",
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
            "DataType" : 0,
            "IsStartHidden":1
        }
        ,
        {
            "colName" : "budget",
            "colText" : "本期预算",
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
            "DataType" : 1,
            "IsStartHidden":1
        },
        {
            "colName" : "remark",
            "colText" : "备注",
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
            "ControlType" : 1,
            "DataType" : 0
        },

        {
            "colName" : "year",
            "colText" : "年份",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        },
    {
        "colName" : "ApplicationId",
        "colText" : "费用申请Id ",
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
        "ControlType" : 1,
        "DataType" : 0,
        "isHidden":1
    },

    {
        "colName" : "standardCurrency",
        "colText" : "本币币种",
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
        "ControlType" : 1,
        "DataType" : 0,
        "isHidden":1
    },
    {
        "colName" : "standardAmount",
        "colText" : "合计金额",
        "colType" : "sumcalctor",
        "colWidth" : "auto",
        "mustInput" : false,
        "iscolsum" : false,
        "isparam" : true,
        "issum":true,
        "iscolchinese" : false,
        "formula" : null,
        "isSumFormula" : false,
        "valuetype" : "unlimited",
        "dataSource" : "",
        "ControlType" : 2,
        "DataType" : 1,
        "isHidden":1,
        "isTotalAmount":1
    },
    {
        "colName" : "exchangeRate",
        "colText" : "汇率",
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
        "ControlType" : 1,
        "DataType" : 0,
        "isHidden":1
    },
    {
            "colName" : "CenterId",
            "colText" : "核算中心id",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        },
{
    "colName" : "CostCenterFolio",
    "colText" : "核算中心编号 ",
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
    "ControlType" : 1,
    "DataType" : 0,
    "isHidden":1
}
    ,{
            "colName" : "ItemId",
            "colText" : "收支项id",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        }
        ,{
            "colName" : "ItemFolio",
            "colText" : "收支项编号",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        },
        {
            "colName" : "totalAmount",
            "colText" : "申请总额",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        } ,{
            "colName" : "summaryAmount",
            "colText" : "已核销总额",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        },
        {
            "colName" : "ongoingAmount",
            "colText" : "核销审批中",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1
        }, {
            "colName" : "centerAdminId",
            "colText" : "核算中心负责人",
            "colType" : "userkey",
            "colWidth" : "auto",
            "mustInput" : false,
            "iscolsum" : false,
            "isparam" :true ,
            "iscolchinese" : false,
            "formula" : null,
            "isSumFormula" : false,
            "valuetype" : "unlimited",
            "dataSource" : "",
            "ControlType" : 2,
            "DataType" : 0,
            "isHidden":1
        },{
            "colName" : "standardCode",
            "colText" : "本币代号",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1,
            "isTotalAmount":1
        },
        {
            "colName" : "foreignCode",
            "colText" : "货币代号",
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
            "ControlType" : 1,
            "DataType" : 0,
            "isHidden":1,
            "isTotalAmount":1
        }
    ];

    //listSUMcol_14_standardAmount_
    var fnGetTotalAmountTagNamePrefix = function(){
        for(var i=0;i<gridConfig.length;i++){
            if(!!gridConfig[i].isTotalAmount){
                return 'listSUMcol_' + i + '_'+ gridConfig[i].colName+'_';
            }
        }
        return '';
    }

    var controlEnum = require('../../control-enum.js');
    //var htmlTemplate = '<div class="brbx_fixWidth"><label><input type="checkbox" {ischeck} name="{colName}" text="{colText}" coltype="{colType}" >{colText}</label></div>';
    var htmlTemplate = '<tr class="brbx-extdatasource-container"><td><div class="brbx_fixWidth"><label><input class="brbx-extdatasource-field" type="checkbox" {ischeck} name="{colName}" text="{colText}" coltype="{colType}" ><span class="brbx_property_span">{colText}</span></label></div></td><td><label><input type="checkbox"  {ismustcheck} class="brbx-extdatasource-mustinput" /> <span class="brbx_property_span">必填</span></label></td></tr>';


    //生成扩展字段数据
    var fnGenereateRowData = function(datasource){
        var _data = {headData:'',rowData:''};
        var _dataSource = datasource || [];
        var _headHtml = '',_rowHtml = '';
        var _rowDataArr = [];
        var _rowHtml = '';
        for(var i=0;i<_dataSource.length;i++){
            //if(i%2==0){
            _rowHtml = '';
            //}
            _headHtml += '<th class="payment-header-extdata">'+_dataSource[i].colText+'</th>';
            if(i%2==0){
                _rowDataArr.push(_rowHtml);
            }else{
                _rowDataArr[_rowDataArr.length-1] = _rowDataArr[_rowDataArr.length-1]+_rowHtml;
            }
        }
        _data.headData = _headHtml;
        if(_rowDataArr.length>1) {
            _data.rowData = '<tr class="operatrow operatrow-extdata ">'+ _rowDataArr.join('</tr><tr class="operatrow operatrow-extdata ">')+'</tr>';
        }else if(_rowDataArr.length ==1){
            _data.rowData = '<tr class="operatrow operatrow-extdata">'+_rowDataArr.join('')+'</tr>';
        }
        return _data;
    }

    //生成表头数据
    var fnGetDataHeader = function(){
        var _header = '';
        for(var i=0;i<gridConfig.length;i++){
            _header += '<th class="control-paymentverify-'+gridConfig[i].colName+(gridConfig[i].isHidden == 1?' control-payment-hide':' ' +(gridConfig[i].IsStartHidden==1?'control-payment-start-hide':' '))+ '">'+gridConfig[i].colText+'</th>';
        }
        _header += '<th>操作</th>';
        return _header;
    }

    var control_prototype = {
        ctype: 'paymentverification',
        ipos: '0px -772px',
        name: '费用核销控件（预算费控）',
        getInitHtml:function(option){

            //console.log(this.extDataSource);

            var _option = option || {};

            var _tagName = _option.tagName || '';
            var _config = _option.config || {};
            var _fieldConfig = _config.FieldConfig || {};
            var _extConfig = _fieldConfig.ExtConfig || {};
            var _controlVersion = _option.controlVersion || 1;
            var _dataHtml = fnGenereateRowData(_extConfig);
            //<div class="fw_left control-paymentverify-left"><span class="control-paymentverify-title">费用收入明细</span>&nbsp;&nbsp;<span class="control-paymentverify-titletips">基本结算货币：</span><span class="control-paymentverify-currency"></span></div>\
            //<thead><tr><th class="payment-header-rowindex">行号</th><th class="payment-header-center">核算中心</th><th class="payment-header-bizdate">发生期间</th><th class="payment-header-name">收支项</th><th class="payment-header-currency">币种</th><th class="payment-header-amount">申请金额</th><th class="payment-header-hide">基本结算货币</th><th class="payment-header-occupation payment-header-createuser-hide">本期发生</th><th class="payment-header-budget payment-header-createuser-hide">本期预算</th><th class="payment-header-remark">说明</th><th class="payment-header-hide">核算中心id</th><th class="payment-header-hide">成本中心编号</th><th class="payment-header-hide">收支项id</th><th  class="payment-header-hide">科目预算编号</th><th class="payment-header-hide">货币编号</th><th class="payment-header-hide">汇率</th><th class="payment-header-hide">核算中心负责人</th>'+_dataHtml.headData+'<th class="payment-header-operate">操作</th></tr></thead>\
            var htmlContent = '<div class="control-paymentverify-container">\
                <div class="control-paymentverify-header">\
            <table>\
           <tr><td class="control-payment-header-title">费用用途：</td><td class="control-payment-header-field"><select type="text" class="payment-paymentverify-main-usage"></select></td><td class="control-payment-header-title" colspan="2"><input class="control-paymentverify-additem" type="button" value="添加"/>&nbsp;&nbsp;</td></tr>\
            </table>\
            </div>\
            <div class="fw_clear"></div>\
            <div class="control-paymentverify-body">\
            <div class="control-paymentverify-body-content">\
            <table class="control-paymentverify-detail control-paymentverify-income">\
            <thead class="control-paymentverify-data-header"><tr>'+fnGetDataHeader()+'</tr></thead>\
            <tbody class="control-paymentverify-list">\
            </tbody>\
            <tbody class="control-paymentverify-total">\
            <tr><td colspan="4"></td><td class="payment-row-amount" colspan="10"><span class="payment-total-title">合计：</span><span class="payment-sum-total-amount">0</span><span class="payment-current-currency"></span> <span type="hidden" calc_class="payment-total-amount" tagname="'+fnGetTotalAmountTagNamePrefix()+_tagName+'"  tagtitle="合计金额"  class="control_summary_total_amount" ></span></td></tr>\
            </tbody>\
            </table>\
            </div>\
            </div>';
            //<td colspan="2" class="payment-operation-save"><a href="javascript:void (0)" class="payment-addnewrow">增加</a></td>\
            return htmlContent;
        },
        propertyHtml: function () {
            return   '';
            //return '';// require('../template/property-budgetComponent.tpl');
        },
        opened: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();

            // $("#ck_procNode").after('<input type="checkbox" id="ck_startuservisible" />');
            //  $("label[for='ck_procNode']").after('<label for="ck_procNode" >预算发起人可见</label>');
        },
        updateBoxShowed: function (ctrl) {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            var _original_config = $.parseJSON($.trim($("pre", ctrl).html()));
            var _fieldConfig = _original_config.FieldConfig || {};

        },
        filled: function (ctrl) {
            var incomeCount = $("#fd_designArea div.ctrlbox[ctype='paymentIncome']").length;
            var paymentCount = $("#fd_designArea div.ctrlbox[ctype='paymentPay']").length;
            if ((incomeCount + paymentCount)>1) {
                alert('该表单已使用了预算组件!');
                ctrl.remove();
            } else {
                var config = $.parseJSON($.trim($("pre", ctrl).html()));
                var VCTMode=1;
                var Tags=(config.FieldConfig.Tags||[]);
                if(Tags.length>0)
                {
                    for(var t=0;t<Tags.length;t++){
                        if(Tags[t].key=="Mode")
                        {
                            VCTMode =parseInt(Tags[t].value) ;
                        }
                    }
                }

                //this.mustinput,VCTMode,
                var htmlContent = this.getInitHtml({'tagName':config.FieldID,'config':config});
                $(".ctrltxt", ctrl).append(htmlContent);
            }
        },
        inputs: function () {
            this.VCTMode = $("#vct_mode").val();
            this.extDataSource = [];
            var _extDataSource = [];
            var _$container = $('.budget-extent-datasource');
            _$container.find('.brbx-extdatasource-container').each(function(){

                var _$this = $(this);
                var _$checkbox = _$this.find('.brbx-extdatasource-field');
                if(!_$checkbox.prop('checked')){
                    return true;//control-paymentverify-occupation
                }
                var _isMustInput = _$this.find('.brbx-extdatasource-mustinput').prop('checked');
                var _$me = _$checkbox;
                var _controlType = _$me.attr('coltype');
                _extDataSource.push({
                    //coltype
                    "colName" :_$me.attr('name'),
                    "colText" : _$me.attr('text'),
                    "colType" : _controlType,
                    "colWidth" : "auto",
                    "mustInput" :_isMustInput ,
                    "iscolsum" : false,
                    "isparam" : false,
                    "iscolchinese" : false,
                    "formula" : null,
                    "isSumFormula" : false,
                    "valuetype" : "unlimited",
                    "dataSource" : "",
                    "ControlType" : controlEnum.controlEnum[_controlType],
                    "DataType" : 1
                });
            });

            this.extDataSource = _extDataSource;
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../../template/payment/control-budgetComponent.tpl');
            var  _extDataSource =   this.extDataSource || [];

            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 1005,//数据应用假期组件 //预算34 收入 35
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
                    //  startUserVisible:this.startUserVisible,
                    Tags:[{key:'controlVersion',value:'1'},{"key":"startUserVisible",value:this.startUserVisible?1:0}],
                    "ExtConfig":_extDataSource,
                    "GridConfig" :gridConfig
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

                var VCTMode=1;
                var controlVersion = 1;

                var _fieldConfig = _original_config.FieldConfig || {};
                var Tags=(_original_config.FieldConfig.Tags||[]);


                if(Tags.length>0)
                {
                    for(var t=0;t<Tags.length;t++){

                        if(Tags[t].key=='controlVersion'){
                            controlVersion = parseInt(Tags[t].controlVersion);
                        }
                    }

                }
            }
            return updateBox;
        }
    };
    return control_prototype;
})