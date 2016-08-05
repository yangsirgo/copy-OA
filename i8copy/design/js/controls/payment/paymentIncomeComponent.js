
/**
 * Created by chent696 on 4/28/2015.
 */

define(function (require) {
    var controlEnum = require('../../control-enum.js');
    //var htmlTemplate = '<div class="brbx_fixWidth"><label><input type="checkbox" {ischeck} name="{colName}" text="{colText}" coltype="{colType}" >{colText}</label></div>';
    var htmlTemplate = '<tr class="brbx-extdatasource-container"><td><div class="brbx_fixWidth"><label><input class="brbx-extdatasource-field" type="checkbox" {ischeck} name="{colName}" text="{colText}" coltype="{colType}" ><span class="brbx_property_span">{colText}</span></label></div></td><td><label><input type="checkbox"  {ismustcheck} class="brbx-extdatasource-mustinput" /> <span class="brbx_property_span">必填</span></label></td></tr>';
    var fnInitExtHtml = function(data,existData){
        var existDataArr = [];
        var existData = existData || [];
        var existDataJson = {};
        for(var m=0;m<existData.length;m++){
            existDataArr.push(existData[m].colName);
            existDataJson[existData[m].colName] = existData[m];
        }

        var _extData = ((data||{}).ReturnObject)||[];
        var _html = '',_repaceHtml = '',_colName = '';
        for(var i=0;i<_extData.length;i++){
            if($.inArray(_extData[i].ExtType,existDataArr) != -1) {
                _colName = _extData[i].ExtType;
                _repaceHtml= htmlTemplate.replace('{colName}', _extData[i].ExtType).replace(/{colText}/g, _extData[i].Name).replace('{colType}', _extData[i].DataType).replace('{ischeck}','checked="checked"');
                if(existDataJson[_colName].mustInput){
                   _repaceHtml = _repaceHtml.replace('{ismustcheck}','checked="checked" ');
               }
            }else{
                _repaceHtml= htmlTemplate.replace('{colName}', _extData[i].ExtType).replace(/{colText}/g, _extData[i].Name).replace('{colType}', _extData[i].DataType).replace('{ischeck}','');
            }
            _repaceHtml = _repaceHtml.replace('{ismustcheck}','');
            _html += _repaceHtml;
        }
        var _$dataSourceContainer = $('.budget-extent-datasource') ;
        _$dataSourceContainer.html('<table>'+_html+'</table>');

        $(document).off('click').on('click','.brbx-extdatasource-field',function(){
               var _$me = $(this);
               var _$tr = _$me.parents('tr');
               var _$mustinput = _$tr.find('.brbx-extdatasource-mustinput');
               if(!_$me.prop('checked')){
                   _$mustinput.prop('checked',false);
               }
            }
        )
    }

    var getExtDataSource = function(existData){

        //8_session.ajaxWfHost+'webajax/form/getdatasourcelist'
        $.ajax({
            'url':i8_session.ajaxWfHost+'webajax/form/getPaymentExtSource',
            'type':'get',
            'datatype':'json',
            'async':false,
            'success':function(data){
                fnInitExtHtml(data,existData);
            }
        });
    }

    //生成菜单数据
     var fnGenereateRowDetailHtml=function(sourceJson,index){
        var _html = '';
         var _colType = sourceJson["colType"];
         var _colNum = controlEnum.controlEnum[_colType];
         var _className = (index % 2 == 0)?'operatrow-extdata-left':'operatrow-extdata-right';
         switch(_colNum)
         {
             case 0:
               _html = '<td class="budget-extend-title">'+sourceJson.colText+'：</td><td class="budget-extend-field '+_className+'"><input ismustinput="'+(sourceJson.mustInput?1:0)+'" class="budget-extend-detail" type="text"  /></td>';
              break;
             case 3:
                 _html = '<td class="budget-extend-title">'+sourceJson.colText+'：</td><td class="budget-extend-field  '+_className+'"><select ismustinput="'+(sourceJson.mustInput?1:0)+'" class="budget-extend-detail" controlname="'+sourceJson.colName+'" ><option>请选择</option></select></td>';
                 break;
             case 8:
                 _html = '<td class="budget-extend-title">'+sourceJson.colText+'：</td><td class="budget-extend-field  '+_className+'"><input ismustinput="'+(sourceJson.mustInput?1:0)+'" class="wDate " onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd DD\'})" type="text"></td>';
                 break;
         }
         return _html;
     }

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
            _rowHtml += fnGenereateRowDetailHtml(_dataSource[i],i);
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


    var control_prototype = {
        ctype: 'paymentIncome',
        ipos: '0px -772px',
        name: '收入组件（预算费控）',
        getInitHtml:function(option){

            //console.log(this.extDataSource);

            var _option = option || {};

            var _tagName = _option.tagName || '';
            var _config = _option.config || {};
            var _fieldConfig = _config.FieldConfig || {};
            var _extConfig = _fieldConfig.ExtConfig || {};
            var _controlVersion = _option.controlVersion || 1;
            var _dataHtml = fnGenereateRowData(_extConfig);
            var htmlContent = '<div class="control-payment-container">\
                <div class="control-payment-header">\
            <div class="fw_left control-payment-left"><span class="control-payment-title">费用收入明细</span>&nbsp;&nbsp;<span class="control-payment-titletips">基本结算货币：</span><span class="control-payment-currency"></span></div>\
            </div>\
            <div class="fw_clear"></div>\
            <div class="control-payment-body">\
            <div class="control-payment-body-content">\
            <table class="control-payment-detail control-payment-income">\
            <thead><tr><th class="payment-header-rowindex">行号</th><th class="payment-header-center">核算中心</th><th class="payment-header-bizdate">发生期间</th><th class="payment-header-name">收支项</th><th class="payment-header-currency">币种</th><th class="payment-header-amount">申请金额</th><th class="payment-header-hide">基本结算货币</th><th class="payment-header-occupation payment-header-createuser-hide">本期发生</th><th class="payment-header-ongoing payment-header-createuser-hide">审批中</th><th class="payment-header-budget payment-header-createuser-hide">本期预算</th><th class="payment-header-remark">说明</th><th class="payment-header-hide">核算中心id</th><th class="payment-header-hide">成本中心编号</th><th class="payment-header-hide">收支项id</th><th  class="payment-header-hide">科目预算编号</th><th class="payment-header-hide">货币编号</th><th class="payment-header-hide">核算中心负责人</th><th class="payment-header-hide">汇率</th>'+_dataHtml.headData+'<th class="payment-header-operate">操作</th></tr></thead>\
            <tbody class="control-payment-list">\
            </tbody>\
            <tbody class="control-payment-total">\
            <tr><td colspan="4"></td><td class="payment-row-amount" colspan="10"><span class="payment-total-title">合计：</span><span class="payment-sum-total-amount">0</span><span class="payment-current-currency"></span></td></tr>\
            </tbody>\
            </table>\
            </div>\
            <table  class="control-payment-operate"><tbody>\
            <tr class="operatrow">\
            <td class="control-operation-payment-title">核算中心：</td>\
            <td class="control-operation-payment-data"><select class="payment-costcenter-select"></select></td>\
            <td class="control-operation-payment-title">收支项：</td>\
            <td class="control-operation-payment-data"><select class="payment-item-select"></select></td>\
            </tr>\
            <tr class="operatrow">\
            <td>申请金额：</td><td><input type="text"  class="payment-detail-amount" /><select class="payment-currency-select"><option>元</option></select></td><td >发生期间：</td><td class="payment-operation-bizdate">  <select class="control-payment-business-year"></select>年<select class="control-payment-business-month"></select>月 <span type="hidden" calc_class="payment-total-amount" tagname="listSUMcol_6_baseCurrency_'+_tagName+'"  tagtitle="合计金额"  class="paymentsummary_total_inputvalue" ></span></td>\
            </tr>\
                '+_dataHtml.rowData+'\
            <tr class="operatrow">\
            <td>说明：</td><td><input type="text" class="payment-detail-remark"  /></td><td colspan="2" class="payment-operation-save"><a href="javascript:void (0)" class="payment-addnewrow">增加</a></td>\
            </tr>\
            </tbody>\
            </table>\
            </div>\
            </div>';
            //<td colspan="2" class="payment-operation-save"><a href="javascript:void (0)" class="payment-addnewrow">增加</a></td>\
            return htmlContent;
        },
        propertyHtml: function () {
         return   require('../../template/payment/property-budgetComponent.tpl');
            //return '';// require('../template/property-budgetComponent.tpl');
        },
        opened: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            getExtDataSource();
           // $("#ck_procNode").after('<input type="checkbox" id="ck_startuservisible" />');
          //  $("label[for='ck_procNode']").after('<label for="ck_procNode" >预算发起人可见</label>');
        },
        updateBoxShowed: function (ctrl) {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            var _original_config = $.parseJSON($.trim($("pre", ctrl).html()));
            var _fieldConfig = _original_config.FieldConfig || {};
            getExtDataSource(_fieldConfig.ExtConfig||[]);
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
                    return true;
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
                FieldType: 35,//数据应用假期组件 //预算34 收入 35
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
                    //版本3，增加 ongoing 审批中
                    Tags:[{key:'controlVersion',value:'4'},{"key":"startUserVisible",value:this.startUserVisible?1:0}],
                    "ExtConfig":_extDataSource,
                    "GridConfig" : [
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
                            "colName" : "costCenter",
                            "colText" : "核算中心",
                            "colType" : "Dropdown",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 3,
                            "DataType" : 0,
                            "valueColName":"costCenterId",
                            "valueColIndex":8
                        },
                        {
                            "colName" : "bizDate",
                            "colText" : "发生期间",
                            "colType" : "DatePicker",
                            "colWidth" : "auto",
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 8,
                            "DataType" : 5
                        },
                        {
                            "colName" : "paymentName",
                            "colText" : "收支项",
                            "colType" : "Dropdown",
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
                            "DataType" : 0,
                            "valueColName":"budgetId",
                            "valueColIndex":10
                        },
                        {
                            "colName" : "currency",
                            "colText" : "货币类型",
                            "colType" : "Dropdown",
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
                            "DataType" : 0,
                            "valueColName":"currencyNumber",
                            "valueColIndex":12
                        },
                        {
                            "colName" : "amount",
                            "colText" : "申请金额",
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
                            "colName" : "col_6_baseCurrency",
                            "colText" : "本币金额",
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
                            "DataType" : 1
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
                            "DataType" : 1
                        },
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
                            "DataType" : 1
                        },
                        {
                            "colName" : "remark",
                            "colText" : "说明",
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
                            "colName" : "costCenterId",
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
                            "ControlType" : 2,
                            "DataType" : 0

                        },
                        {
                            "colName" : "costCenterName",
                            "colText" : "核算中心编号",
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
                            "colName" : "budgetId",
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
                            "ControlType" :2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "budgetNumber",
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
                            "ControlType" :  2,
                            "DataType" : 0
                        },
                        {
                            "colName" : "currencyNumber",
                            "colText" : "本币代码",
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
                            "colName" : "costcenterPrincipal",
                            "colText" : "核算中心负责人",
                            "colType" : "userkey",
                            "colWidth" : "auto",
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : true,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0
                        }
                        ,
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
                            "ControlType" : 2,
                            "DataType" : 0
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