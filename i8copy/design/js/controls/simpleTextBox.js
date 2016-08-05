define(function (require) {
    var utilModel = require('../util.js');
    //白名单
    var white_list = utilModel.workflowWhiteList;
    //var regArr = [//,var email_reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/g;]
    var email_reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/g;
    var cellphone_reg = /^1[3|4|5|6|8][0-9]\d{8}$/g;
    var tel_reg = /^(0[0-9]{2,4}\-)?\d{6,8}$/g;
    var number_reg = /^(\-?)[0-9]+(\.[0-9]+)?$/g;
    var bindChangeEvent = function (contaienr) {
        contaienr.find("#slt_txtValueType").change(function () {
            if ($(this).val() == "5" || $(this).val() == "0") {
                $(".setting_maxminnum").show();
            } else {
                $(".setting_maxminnum").hide();
            }
        });

    }
    var control_prototype = {
        ctype: 'simpleTextBox',
        ipos: "0px 2px",
        name: '单行文本框',
        //box: ['<div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">文本类型：</span></div><div class="brbx"><select style="width:160px" id="slt_txtValueType" class="txtboxcs"><option value="0">不限</option><option value="1">邮箱</option><option value="2">手机</option><option value="3">电话</option><option value="4">数字</option><option value="5">英文和数字</option></select></div></div><div class="boxrow setting_maxminnum"><div class="brtt"><span class="span_bfieldTxt">最大字符数：</span></div><div class="brbx"><input type="text" class="txtboxcs" id="txt_maxLength" value="50"/></div></div><div class="boxrow setting_maxminnum"><div class="brtt"><span class="span_bfieldTxt">最小字符数：</span></div><div class="brbx"><input type="text" class="txtboxcs" id="txt_minLength" value="0"/></div></div><div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">默认值：</span></div><div class="brbx"><input type="text" id="txt_defaulttxt" class="txtboxcs" value=""/></div></div>'],
        propertyHtml: function () {
            return require('../template/property-simpleTextBox.tpl');
        },
        opened: function () {
            bindChangeEvent($(document));
        },
        inputs: function () {
            this.minLength = $.trim($("#txt_minLength").val())||'0';
            this.maxLength = $.trim($("#txt_maxLength").val())||'50';
            this.VT = $("#slt_txtValueType").val();
            this.defaultvalue = $.trim($("#txt_defaulttxt").val() || '');//.replace(/<[^>]*>/gi, '');
        },
        ckInputs: function () {
            var vType = $("#slt_txtValueType").val();
            if (vType == "0" || vType == "5") {
                var minlen =parseInt($.trim($("#txt_minLength").val()));
                var maxlen =parseInt($.trim($("#txt_maxLength").val()));
                if (!(minlen > -1 && maxlen > 0)) {
                    alert('请正确输入最大与最小值！');
                    return false;
                }
                if (maxlen > 255 || minlen > 255) {
                    alert('字符长度不能超过255');
                    return false;
                }
                if (minlen >= maxlen) {
                    alert('最小值不能大于或等于最大值！');
                    return false;
                }

            }

            var _defaultValue = $.trim($("#txt_defaulttxt").val() || '');
            var _verifyReg = null;
            switch (vType) {
                case  "0":
                    _verifyReg = white_list;
                    break;
                case "1":
                    _verifyReg = email_reg;
                    break;
                case "2":
                    _verifyReg = cellphone_reg;

                    break;
                case "3":
                    _verifyReg = tel_reg;
                    break;
                case "4":
                    _verifyReg = number_reg;
                    break;
                case "5":
                    var numberAndCharater_reg = new RegExp("^[\\w\\s]{" + minlen + "," + maxlen + "}$");
                    _verifyReg = numberAndCharater_reg;
                    break;
            }
            if(!_verifyReg )
            {
                return true;
            }
            _verifyReg.lastIndex = 0;
            if (!_verifyReg.test(_defaultValue) && _defaultValue.length>0) {
                alert('默认值不符合规则！');
                return false;
            }

            return true;
        },
        cformat: function () {
            var ctrl_tpl = require('../template/control-simpleTextBox.tpl');
            var render = template(ctrl_tpl);
            var DataType = (this.VT == 4) ? 1 : 0;
            var config = {
                ctype: arguments[0],
                FieldType: 0,//文本框
                FieldID: this.fieldID(),
                FieldName: this.title,
                DefaultValue: (this.defaultvalue||''),
                DataType: DataType,
                IsProcDataField: this.isparam,
                IsBindData: false,
                IsRequire: this.mustinput,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    txtValueType: this.VT,
                    maxLength: this.maxLength,
                    minLength: this.minLength
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
            //return $('<div class="ctrlbox" ctype="' + arguments[0] + '" rowtype="1"><div class="ctrltitle"><span class="span_mustinputtag" style="visibility:' + (this.mustinput ? "visible" : "hidden") + '">*</span><span class="ctitletxt">' + this.title + '</span>：</div><div class="ctrltxt"><input type="text" class="tbox_simgle" maxlength="' + this.maxLength + '" minlength="' + this.minLength + '" isparam="' + this.isparam + '" valuetype="' + this.VT + '" mustinput="' + this.mustinput + '" value="' + this.defaultvalue + '"/></div></div>');
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON($.trim($("pre", _ctrlobj).text()));
            if (typeof _original_config == 'object') {
                $("#txt_ctrlTitleName", updateBox).val(_original_config.FieldName);
                $("#slt_txtValueType", updateBox).val(_original_config.FieldConfig.txtValueType);

                $("#txt_maxLength", updateBox).val(_original_config.FieldConfig.maxLength);
                $("#txt_minLength", updateBox).val(_original_config.FieldConfig.minLength);
                if (_original_config.FieldConfig.txtValueType == 0 || _original_config.FieldConfig.txtValueType == 5)
                {
                    $('.setting_maxminnum', updateBox).show();
                } else {
                    $('.setting_maxminnum', updateBox).hide();
                }
                $("#txt_defaulttxt", updateBox).val(_original_config.DefaultValue);
                $("#ck_procNode", updateBox).prop({ checked: _original_config.IsProcDataField });
                $("#ck_mustchecked", updateBox).prop({ checked: _original_config.IsRequire });

                bindChangeEvent(updateBox);
            }
            //var _title = $(".ctitletxt", _ctrlobj).text();
            //var inputbox = $(".tbox_simgle", _ctrlobj);
            //var _txtType = inputbox.attr("valuetype");
            //var _maxlth = inputbox.attr("maxlength");
            //var _minlth = inputbox.attr("minlength");
            //var _default = inputbox.val();
            //var _mustinput = inputbox.attr("mustinput");
            //var _isparam = inputbox.attr("isparam");
            //$("#txt_ctrlTitleName", updateBox).val(_title);
            //$("#slt_txtValueType", updateBox).val(_txtType);
            //$("#txt_maxLength", updateBox).val(_maxlth);
            //$("#txt_minLength", updateBox).val(_minlth);
            //$("#txt_defaulttxt", updateBox).val(_default);
            //$("#ck_procNode", updateBox).prop({ checked: _isparam == "true" });
            //$("#ck_mustchecked", updateBox).prop({ checked: _mustinput == "true" });
            return updateBox;
        }
        //,
        //updateCtrlBox: function (_ctype, _ctrlobj, comInputs) {
        //    var prinput = new this.inputs();
        //    comInputs.call(prinput);
        //    var newObjHtml = this.cformat(_ctype);
        //    var ncobj = $(".ctrlbox", _ctrlobj).empty();
        //    var iHtml = $(newObjHtml).html();
        //    ncobj.html(iHtml);
        //    //$(_ctrlobj).empty().html($(newObjHtml).html());
        //    //var prinput = new this.inputs();      
        //    //comInputs.call(prinput);
        //    //var inputbox = $(".tbox_simgle", _ctrlobj);
        //    //var _new_config = $(".tbox_simgle", _ctrlobj);
        //    //$(".ctitletxt", _ctrlobj).text(prinput.title);
        //    //inputbox.attr("valuetype", prinput.VT);
        //    //inputbox.attr("maxlength", prinput.maxLength);
        //    //inputbox.attr("minlength", prinput.minLength);
        //    //inputbox.val(prinput.defaultvalue);
        //    //inputbox.attr("mustinput", prinput.mustinput);
        //    //if (prinput.mustinput) {
        //    //    $(".span_mustinputtag", _ctrlobj).css("visibility", "visible");
        //    //} else {
        //    //    $(".span_mustinputtag", _ctrlobj).css("visibility", "hidden");
        //    //}
        //    //inputbox.attr("isparam", prinput.isparam);
        //}
    };

    return control_prototype;
});