
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
        //$.ajax({
        //    'url':i8_session.ajaxWfHost+'webajax/form/getPaymentExtSource',
        //    'type':'get',
        //    'datatype':'json',
        //    'async':false,
        //    'success':function(data){
        var data = {
            "Total": 0,
            "ReturnObject": [
                {
                    "ExtType": "OccurDate",
                    "Name": "日期",
                    "DataType": "datepicker",
                    "Category": "",
                    "HasItem": false,
                    "SortIndex": 1,
                    "Items": null
                },
                {
                    "ExtType": "City",
                    "Name": "城市/区域",
                    "DataType": "dropdown",
                    "Category": "",
                    "HasItem": true,
                    "SortIndex": 2,
                    "Items": null
                },
                {
                    "ExtType": "BizPhase",
                    "Name": "业务阶段",
                    "DataType": "dropdown",
                    "Category": "",
                    "HasItem": true,
                    "SortIndex": 3,
                    "Items": null
                },
                {
                    "ExtType": "Project",
                    "Name": "客户/项目",
                    "DataType": "dropdown",
                    "Category": "",
                    "HasItem": true,
                    "SortIndex": 4,
                    "Items": null
                },
                {
                    "ExtType": "BizType",
                    "Name": "业务类型/产品线",
                    "DataType": "dropdown",
                    "Category": "",
                    "HasItem": true,
                    "SortIndex": 5,
                    "Items": null
                }
            ],
            "Result": true,
            "Code": 0,
            "Description": null
        };
                fnInitExtHtml(data,existData);
            //}
        //});
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
            _headHtml += '<th class="paymentapply-header-extdata">'+_dataSource[i].colText+'</th>';
            _rowHtml += fnGenereateRowDetailHtml(_dataSource[i],i);
            if(i%2==0){
                _rowDataArr.push(_rowHtml);
            }else{
                _rowDataArr[_rowDataArr.length-1] = _rowDataArr[_rowDataArr.length-1]+_rowHtml;
            }
        }
        _data.headData = _headHtml;
        if(_rowDataArr.length>1) {
            _data.rowData = '<tr class="operatrow operatrow-extdata">'+ _rowDataArr.join('</tr><tr class="operatrow operatrow-extdata ">')+'</tr>';
        }else if(_rowDataArr.length ==1){
            _data.rowData = '<tr class="operatrow operatrow-extdata">'+_rowDataArr.join('')+'</tr>';
        }
        return _data;
    }
    //拼接表头
    var setHeadRow=function(_gridConfig,_extConfig){//setHeadRow
        var _headRow='';
        _.each(_gridConfig,function(value,key){
            var isHide=value["showhead"]  ? '' : 'paymentapply-hide' ;
            if(value['colName']!='remark'){
                _headRow+='<th colName="'+value['colName']+'" class="paymentapply-header-'+value['colName']+' '+isHide+'">'+value['colText']+'</th>'
            }
        })
        _.each(_extConfig,function(value,key){
            _headRow+='<th colName="'+value['colName']+'" class="paymentapply-header-'+value['colName']+'"></th>'
        })
        _headRow+='<th colName="remark" class="paymentapply-header-remark">备注</th><th class="paymentapply-header-operate">操作</th>';
        return _headRow;
    }
    //合并扩展字段和
    var getConcatConfig=function(_gridConfig,_extConfig){
        var _concatConfig=[];
        _.each(_gridConfig,function(value){
            _concatConfig.push(value);
        })
        _.each(_extConfig,function(value){
            _concatConfig.push(value);
        })
        return _concatConfig;
    };
    var onlyRenderHtmlWithoutTd=function(item,_colFieldClass,_colDetailClass,_colClass){
        var _result='';
        if(item.colName=='currency'){
            return '<span class="currencytxt">人民币</span>'
        }
        switch (item.ControlType){
            case 0:
                _result = '<input ismustinput="'+(item.mustInput?1:0)+'" class="'+_colDetailClass+' '+_colClass+'" type="text"  colName="'+item.colName+'" />';
                break;
            case 2:
                _result = '<textarea ismustinput="'+(item.mustInput?1:0)+'" class="'+_colDetailClass+' '+_colClass+'" type="text"  colName="'+item.colName+'"></textarea>';
                break;
            case 3:
                _result = '<select ismustinput="'+(item.mustInput?1:0)+'" class="'+_colDetailClass+' '+_colClass+'" colName="'+item.colName+'" ><option>请选择</option></select>';
                break;
            case 8:
                _result = '<input ismustinput="'+(item.mustInput?1:0)+'" class="wDate '+_colClass+'" colName="'+item.colName+'"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd DD\'})" type="text">';
                break;
        }
        return _result;
    }
    var renderHtmlByControlType=function(item,_concatConfig){
        var _resultHtml='';
        var _RelationHtml='';
        var _colTitleClass=item.isExt ? 'budget-extend-title'  : 'control-operation-title' ;
        var _colFieldClass=item.isExt ? 'budget-extend-field' : 'control-operation-data' ;
        var _colDetailClass=item.isExt ? 'budget-extend-detail' : '' ;
        var _colClass='paymentapply-item-'+item.colName+'';
        if(item.RelationColName){
            _RelationHtml+=renderHtmlByControlType(_.find(_concatConfig,function(value){return value.colName==item.RelationColName}))
        }
        if(item.isRelation){
            _resultHtml=onlyRenderHtmlWithoutTd(item,_colFieldClass,_colDetailClass,_colClass);
        }else{
            _resultHtml = '<td class="'+_colTitleClass+'">'+item.colText+'：</td><td class="'+_colFieldClass+'">'+onlyRenderHtmlWithoutTd(item,_colFieldClass,_colDetailClass,_colClass)+''+_RelationHtml+'</td>';
        }
        return _resultHtml;
    }
    //拼接编辑内容区域
    var setEditCont=function(_concatConfig){
        var _resultHtml='';
        var _index=0;
        var _lastConfig=[];//放到最后
        _.each(_concatConfig,function(item){
            if(item.islast){
                _lastConfig.push(item);
            }else if(item.showedit && !item.isRelation){
                if(_index%2==0){
                    _resultHtml+='<tr class="operatrow">';
                }
                _resultHtml+=renderHtmlByControlType(item,_concatConfig);
                if(_index%2==1){
                    _resultHtml+='</tr>';
                }
                _index++;
            }
        })
        _.each(_lastConfig,function(item){
            if(item.showedit && !item.isRelation){
                if(_index%2==0){
                    _resultHtml+='<tr class="operatrow">';
                }
                _resultHtml+=renderHtmlByControlType(item,_concatConfig);
                if(_index%2==1){
                    _resultHtml+='</tr>';
                }
                _index++;
            }
        })
        if(_index%2==1){
            _resultHtml+='<td colspan="2" class="operation-save"><a href="javascript:void (0)" class="paymentapply-addnewrow addnewrow">增加</a></td></tr>';
        }else{
            _resultHtml+='<tr><td colspan="4" class="operation-save"><a href="javascript:void (0)" class="paymentapply-addnewrow addnewrow">增加</a></td></tr>';
        }
        return _resultHtml;

    }

    var control_prototype = {
        ctype: 'paymentapplication',
        ipos: '0px -772px',
        name: '费用申请控件（预算费控）',
        getInitHtml:function(option){
            //console.log(this.extDataSource);
            console.log('getInitHtml');
            var _option = option || {};
            var _tagName = _option.tagName || '';
            var _config = _option.config || {};
            var _fieldConfig = _config.FieldConfig || {};
            var _extConfig = _fieldConfig.ExtConfig || {};
            var _gridConfig=_fieldConfig.GridConfig || {};
            var _concatConfig =getConcatConfig(_gridConfig,_extConfig);
            var _controlVersion = _option.controlVersion || 1;
            var _dataHtml = fnGenereateRowData(_extConfig);
            var htmlContent = '<div class="control-paymentapply-container2">\
             <div class="control-paymentapply-header">\
            <div class="fw_left control-paymentapply-left"><span class="control-paymentapply-title">费用用途：</span>&nbsp;&nbsp;<input class="control-paymentapply-uses" /><span class="control-paymentapply-title">年份：</span>&nbsp;&nbsp;<select class="control-paymentapply-year"></select><span class="control-paymentapply-title m-l25">月份：</span>&nbsp;&nbsp;<select class="control-paymentapply-month">\
            <option value="0" style="display:none">全年</option><option value="1">1月</option><option value="2">2月</option><option value="3">3月</option><option value="4">4月</option><option value="5">5月</option><option value="6">6月</option><option value="7">7月</option><option value="8">8月</option><option value="9">9月</option><option value="10">10月</option><option value="11">11月</option><option value="12">12月</option></select></div>\
            </div>\
            <div class="fw_clear"></div>\
            <div class="control-paymentapply-body control-body">\
            <div class="control-body-content">\
            <table class="control-detail">\
            <thead><tr>'+setHeadRow(_gridConfig,_extConfig)+'</tr></thead>\
            <tbody class="control-paymentapply-list">\
            </tbody>\
            <tbody class="control-paymentapply-total">\
            <tr><td colspan="3"></td><td class="paymentapply-row-amount" colspan="10"><span class="paymentapply-total-title">合计：</span><span class="paymentapply-sum-total-amount">0</span><span class="paymentapply-current-currency"></span> <span type="hidden" calc_class="paymentapply-total-amount" tagname="listSUMcol_6_amount_'+_tagName+'"  tagtitle="合计金额"  class="control_summary_total_amount" ></span></td></tr>\
            </tbody>\
            </table>\
            </div>\
            <table  class="control-operate"><tbody>'+setEditCont(_concatConfig)+'</tbody>\
            </table>\
            </div>\
            </div>';
            //<td colspan="2" class="paymentapply-operation-save"><a href="javascript:void (0)" class="paymentapply-addnewrow">增加</a></td>\
            return htmlContent;
        },
        propertyHtml: function () {
//            console.log('propertyHtml')
//            alert('propertyHtml')
            // return   require('../../template/payment/property-budgetComponent.tpl');
            //return '';// require('../template/property-budgetComponent.tpl');
        },
        opened: function () {
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            //getExtDataSource();(取消扩展字段)
            // $("#ck_procNode").after('<input type="checkbox" id="ck_startuservisible" />');
            //  $("label[for='ck_procNode']").after('<label for="ck_procNode" >预算发起人可见</label>');
        },
        updateBoxShowed: function (ctrl) {
            console.log('updateBoxShowed');
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            var _original_config = $.parseJSON($.trim($("pre", ctrl).html()));
            var _fieldConfig = _original_config.FieldConfig || {};
            //getExtDataSource(_fieldConfig.ExtConfig||[]);(取消扩展字段)
        },
        filled: function (ctrl) {
            if (($(".control-paymentapply-container2").length!=0)){
                alert('该表单已使用了费用申请组件!');
                ctrl.remove();

            }else{
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
                    "showedit":true,
                    "mustInput" :_isMustInput ,
                    "iscolsum" : false,
                    "isparam" : false,
                    "iscolchinese" : false,
                    "formula" : null,
                    "isSumFormula" : false,
                    "valuetype" : "unlimited",
                    "dataSource" : "",
                    "ControlType" : controlEnum.controlEnum[_controlType],
                    "DataType" : 1,
                    "isExt":true
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
                FieldType: 1004,//数据应用假期组件 //预算34 收入 35
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
                    "GridConfig" : [
                        {
                            "colName" : "rowIndex",
                            "colText" : "行号",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "showhead": true,
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
                            "colName" : "uses",
                            "colText" : "费用用途",
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
                            "colName" : "year",
                            "colText" : "年份",
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
                            "showhead": true,
                            "showedit":true,
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
                            "valueColName":"costCenterId"
                        },
                        {
                            "colName" : "paymentName",
                            "colText" : "收支项",
                            "colType" : "Dropdown",
                            "colWidth" : "auto",
                            "showhead": true,
                            "showedit":true,
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
                            "valueColName":"budgetId"
                        },
                        {
                            "colName" : "amount",
                            "colText" : "申请金额",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "showhead": true,
                            "showedit":true,
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 0,
                            "DataType" : 1,
                            "RelationColName":"currency"//关联字段渲染的时候直接渲染的一个容器
                        },
                        {
                            "colName" : "currency",
                            "colText" : "货币类型",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "showedit":true,
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 0,
                            "isRelation":true//关联字段渲染的时候直接渲染的一个容器（不另外起一个td）
                        },
                        {
                            "colName" : "standardAmount",
                            "colText" : "合计金额",
                            "colType" : "sumcalctor",
                            "colWidth" : "auto",
                            "mustInput" : true,
                            "iscolsum" : false,
                            "isparam" : true,
                            "issum":true,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "number",
                            "dataSource" : "",
                            "ControlType" : 2,
                            "DataType" : 1
                        },
                        {
                            "colName" : "alreadyoccupied",
                            "colText" : "已占用",
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
                            "colName" : "approvaling",
                            "colText" : "审批中",
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
                            "colName" : "budgetyear",
                            "colText" : "预算",
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
                            "colName" : "costCenterFolio",
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
                            "colName" : "centerAdminId",
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
                        },{
                            "colName" : "month",
                            "colText" : "月份",
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
                        },{
                            "colName" : "remark",
                            "colText" : "备注",
                            "colType" : "simpleTextBox",
                            "colWidth" : "auto",
                            "showedit":true,
                            "mustInput" : false,
                            "iscolsum" : false,
                            "isparam" : false,
                            "iscolchinese" : false,
                            "formula" : null,
                            "isSumFormula" : false,
                            "valuetype" : "unlimited",
                            "dataSource" : "",
                            "ControlType" : 0,
                            "DataType" : 0,
                            "islast":true
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