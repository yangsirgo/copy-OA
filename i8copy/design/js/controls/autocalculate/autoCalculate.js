/**
 * Created by Administrator on 2015/10/12.
 */
define(function (require) {

	var stack = function(){
		this.stackArr = [];
		this.push = function(item){
			this.stackArr.push(item);
		}
		this.pop = function(){
			if(this.stackArr.length>0) {
				return this.stackArr.pop();
			}
			return '';
		}
	}

	var fnBraceVerify = function(str){
		var flag = true;
		var data_stack = new stack();
		for(var i=0;i<str.length;i++){
			if(str[i] == '('){
				data_stack.push(str[i]);
			}else if(str[i] ==')'){
				if(data_stack.pop()!= '('){
					flag = false;
					break;
				}
			}
		}
		if(data_stack.stackArr.length>0){
			flag = false;
		}
		return flag;
	}
	/*
	 绑定事件
	 */
	var fnInitEvent = function(){
		$('#autocalculate_design_list').on('click','.autocalculate-delete-btn',function(){
			$(this).parents('li').remove();
		})
	};
	var autoCalJson = {};
	/*
		取可以计算的配置文件
	 */
    var fnGetAllCalculateConfig = function(){
	    var _$preConfig   = $('pre');
	    var calculateConfig = {};

	    _$preConfig.each(function () {
		    var _config = {};
		    try {
			    _config = $.parseJSON($(this).html());
		    }catch(e){
			    _config = {};
		    }
		    if ((_config.ctype == 'simpleTextBox' && (_config.FieldConfig ||{}).txtValueType == 4 ) || _config.ctype == 'moneyTextBox') { //|| _config.ctype == 'datediff'
			    calculateConfig[_config.FieldID] = _config.FieldName;
		    }
	    });
	    return calculateConfig;
    }
	/*
		取所有的配置文件
	 */
	var fnGetAllConfig = function(){
		var _$preConfig   = $('pre');
		var preConfigJson = {};
		var _html         = '';

		_$preConfig.each(function () {
			var _config                    = $.parseJSON($(this).html());
			preConfigJson[_config.FieldID] = _config;
		});
		return preConfigJson;
	}
	var control_prototype = {
		ctype:        'autocalculate',
		ipos:         '0px -727px',
		name:         '自动计算控件',
		propertyHtml: function () {
			return require('../../template/property-autocalculate.tpl');
		},

		opened:          function () {
			var _$preConfig   = $('pre');
			var preConfigJson = {};
			var _html         = '';
			$("#ck_mustchecked").hide();
			$('label[for="ck_mustchecked"]').hide();
			_$preConfig.each(function () {
				var _config                    = $.parseJSON($(this).html());
				preConfigJson[_config.FieldID] = _config;
				if ((_config.ctype == 'simpleTextBox' && (_config.FieldConfig ||{}).txtValueType == 4 ) || _config.ctype == 'moneyTextBox') { //|| _config.ctype == 'datediff'
					autoCalJson[_config.FieldID] = _config.FieldName;
					_html += '<li class="ui-draggable" fieldid="' + _config.FieldID + '">' + _config.FieldName + '</li>';
				}
			});
			autoCalJson = preConfigJson;
			$('#autocalculate_field_container').append('<ul class="">' + _html + '</ul>');


			$("#autocalculate_symbol_container div.ui-draggable").draggable({
				revert:            'invalid',
				opacity:           0.7,
				helper:            'clone',
				cursor:            'move',
				scope:             'drop',
				connectToSortable: $("#autocalculate_design_container"),
				stop:              function (event, ui) {
					//console.log($(this).html());
					var _templateHtml = '<li class="autocalculate-dragable-symbol" calvalue="[{symbol}]" caltext="[{symbol}]">{symboltext}<span class="autocalculate-delete-btn"></span></li>';
					$('#autocalculate_design_list').append(_templateHtml.replace(/\{symbol\}/g, $(this).attr('symbol')).replace(/\{symboltext\}/g, $(this).text()));
				}
			}); //可拖拽移动
			$("#autocalculate_field_container li.ui-draggable").draggable({
				revert:            'invalid',
				opacity:           0.7,
				helper:            'clone',
				cursor:            'move',
				scope:             'drop',
				connectToSortable: $("#autocalculate_design_container"),
				stop:              function (event, ui) {
					//console.log($(this).html());
					var _templateHtml = '<li class="autocalculate-dragable-field" caltext="{{fieldName}}"  calvalue="{fieldId}">{fieldName}<span class="autocalculate-delete-btn"></span></li>';
					$('#autocalculate_design_list').append(_templateHtml.replace(/\{fieldName\}/g, $(this).html()).replace('{fieldId}', '{' + $(this).attr('fieldid') + '}'));

				}
			});
			$(document).off('mouseover').on('mouseover','.ui-draggable',function(){
				$(this).addClass();
			}).off('mouseout').on('mouseout','.ui-draggable',function(){

			})
			$('#autocalculate_design_list').sortable({
				item: " li"
			});
			fnInitEvent();
		},
		updateBoxShowed: function () {
			$("#ck_mustchecked").hide();
			$('label[for="ck_mustchecked"]').hide();
			//$("#ck_procNode").hide();
			//$("label[for='ck_procNode']").hide();
			var _$preConfig   = $('pre');
			var preConfigJson = {};
			var _html         = '';
			_$preConfig.each(function () {
				var _config                    = $.parseJSON($(this).html());
				preConfigJson[_config.FieldID] = _config;
				if ((_config.ctype == 'simpleTextBox' && (_config.FieldConfig ||{}).txtValueType == 4 )|| _config.ctype == 'moneyTextBox') //|| _config.ctype == 'datediff'
					_html += '<li class="ui-draggable" fieldid="' + _config.FieldID + '">' + _config.FieldName + '</li>';
			});
			$('#autocalculate_field_container').append('<ul class="">' + _html + '</ul>');

			$("#autocalculate_symbol_container div.ui-draggable").draggable({
				revert:            'invalid',
				opacity:           0.7,
				helper:            'clone',
				cursor:            'move',
				scope:             'drop',
				connectToSortable: $("#autocalculate_design_container"),
				stop:              function (event, ui) {
					var _templateHtml = '<li class="autocalculate-dragable-symbol" calvalue="[{symbol}]" caltext="[{symbol}]">{symboltext}<span class="autocalculate-delete-btn"></span></li>';
					$('#autocalculate_design_list').append(_templateHtml.replace(/\{symbol\}/g, $(this).attr('symbol')).replace(/\{symboltext\}/g, $(this).text()));
				}
			}); //可拖拽移动
			$("#autocalculate_field_container li.ui-draggable").draggable({
				revert:            'invalid',
				opacity:           0.7,
				helper:            'clone',
				cursor:            'move',
				scope:             'drop',
				connectToSortable: $("#autocalculate_design_container"),
				stop:              function (event, ui) {
					var _templateHtml = '<li class="autocalculate-dragable-field" caltext="{{fieldName}}"  calvalue="{fieldId}">{fieldName}<span class="autocalculate-delete-btn"></span></li>';
					$('#autocalculate_design_list').append(_templateHtml.replace(/\{fieldName\}/g, $(this).html()).replace('{fieldId}', '{' + $(this).attr('fieldid') + '}'));
				}
			});
			$('#autocalculate_design_list').sortable({
				item: " li"
			});
			fnInitEvent();
		},
		filled:          function (ctrl) {
			//var config = $.parseJSON($.trim($("pre", ctrl).html()));
			//var ksnSelectUser = require('/resource/default/common/js/workflow/formdesigner/plugin/app_wfform_vacation_plugin.js');
			//var count = $("#fd_designArea div.ctrlbox[ctype='cancelVacationComponent']").length;
			var count = $('.control-vacation-detail').length;
			if (count > 0) {


			} else {
				var config = $.parseJSON($.trim($("pre", ctrl).text()));

				// var htmlContent = '<input type="text" readonly="readonly" class="autocalculate-component" />'; //$.fn.CancelVacationSummary.GetInitHtml(this.mustinput,VCTMode,{'tagName':config.FieldID});
				// $(".ctrltxt", ctrl).append(htmlContent);
			}
		},
		inputs:          function () {
			this.expression = '';
			this.expressionStr = '';
			var _expression = '',
			    _expressionStr = '';
			$('#autocalculate_design_list').find('li').each(function () {
				_expression += $(this).attr('calvalue');
				_expressionStr += $(this).attr('caltext');
			});
			this.expression = _expression;
			this.expressionStr = _expressionStr;
		},
		ckInputs:        function () {
			var _expression = '';
			var _firstValueType = '';
			var _config = fnGetAllConfig();
			var _calvaule = '';
			var _flag = true;
			$('#autocalculate_design_list').find('li').each(function (index) {
				_calvaule = $(this).attr('calvalue');
				_expression += _calvaule;
				if(_calvaule.indexOf('[')>-1){
					return true;
				}
				if(index == 0){
					_firstValueType = _config[_calvaule.slice(1,-1)].ctype;
				}
				else{
						if (_firstValueType != _config[_calvaule.slice(1, -1)].ctype) {
							if(_config[_calvaule.slice(1, -1)].ctype == "dateTime") {
							_flag = false;
							alert('时间控件只允许和时间控件进行计算！');
							return false;
						}
					}
				}
			});
			if(!_flag) {
				return _flag;
			}
			if(_firstValueType == "dateTime"){
				if(_expression.indexOf('+')>-1||_expression.indexOf('*')>-1 || _expression.indexOf('/')>-1){
					_flag = false;
					alert('日期控件只允许相减');
					return _flag;
				}
			}
			_flag = fnBraceVerify(_expression);
			if(!_flag){
				alert('规则设置不合理，括号不匹配！');
			}
			return _flag;
		},
		cformat:         function () {
			var ctrl_tpl = require('../../template/control-autocalculate.tpl');
			var render   = template(ctrl_tpl);
			var config   = {
				ctype:           arguments[0],
				FieldType:       50,//
				FieldID:         this.fieldID(),
				FieldName:       this.title,
				DefaultValue:    '',
				DataType:        3,
				IsProcDataField: this.isparam,
				IsBindData:      false,
				IsRequire:       this.mustinput,
                IsPrint: this.isPrint,
				DataSource:      '',
				FieldConfig:     {
					'expression':this.expression,
					'expressionStr':this.expressionStr,
					Tags: [
						{key: 'expression', value: this.expression},
						{key: 'expressionStr', value: this.expressionStr}
					]
				},
				SortIndex:       0,
				isvisible:       (this.mustinput ? "visible" : "hidden")
			};
			config.str_config = $.JSONString(config);
			return render(config);
		},
		getUpdateBox:    function (_ctype, _ctrlobj, builder) {
			var updateBox        = $((new builder(_ctype)).toBoxString());
			var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
			$("#ck_mustchecked").hide();
			$('label[for="ck_mustchecked"]').hide();
			autoCalJson = fnGetAllCalculateConfig();
			if (typeof _original_config == 'object') {
				$("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
				$("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
				var controlVersion = 1;
				var Tags           = (_original_config.FieldConfig.Tags || []);
				if (Tags.length > 0) {
					for (var t = 0; t < Tags.length; t++) {
						if (Tags[t].key == 'controlVersion') {
							controlVersion = parseInt(Tags[t].controlVersion);
						}
						if (Tags[t].key == 'expression') {
							var _$designList = $('#autocalculate_design_list',updateBox);
							var _tagValue= Tags[t].value;
							_tagValue = _tagValue.replace(/\{(.*?)\}/g,function(value,match) {
								return '<li class="autocalculate-dragable-field" caltext="{' + (autoCalJson[match]||'') + '}"  calvalue="'+value+'">' + (autoCalJson[match]||'') + '<span class="autocalculate-delete-btn"></span></li>';
							});
							_tagValue = _tagValue.replace(/\[(.*?)\]/g,function(value,match){
								return '<li class="autocalculate-dragable-symbol" caltext="'+value+'" calvalue="'+value+'">'+match+'<span class="autocalculate-delete-btn"></span></li>';
									  });
							_$designList.html(_tagValue);
						}
					}
				}
			}
			return updateBox;
		}
	};
	return control_prototype;
})