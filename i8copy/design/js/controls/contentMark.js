define(function (require) {
    
    var control_prototype = {
        ctype: 'contentMark',
        ipos: '0px -368px',
        name: '文本描述控件',
        propertyHtml: function () {
            return require('../template/property-contentMark.tpl');
        },
        filled: function (ctrl) {},
        inputs: function () {
            function trim(str) {
                return str.replace(/\n/g, "<br/>");
            }
            this.FontSize = $("#cm_fontSize").val();
            this.FontColor = $("#cm_FontColor").val();
            this.Content = trim($("#cm_content").val());
            this.selIndex = $("#cm_FontColor option:selected").attr("sel_index");
        },
        opened: function () {
            $(".fdMsgBox .boxbody .boxrow").get(0).style.display = 'none';
            $("#ck_procNode").hide();
            $("label[for='ck_procNode']").hide();
            $("#ck_mustchecked").hide();
            $("label[for='ck_mustchecked']").hide();
        },
        updateBoxShowed: function () {
            $(".fdMsgBox .boxbody .boxrow").get(0).style.display = 'none';
            $("label[for='ck_procNode']").hide();
            $("#ck_procNode").hide();
            $("#ck_mustchecked").hide();
            $("label[for='ck_mustchecked']").hide();
        },
        ckInputs: function () {
            if ($.trim($("#cm_content").val()).length == 0) {
                alert('文本未填写!');
                return false;
            }
            return true;
        },
        cformat: function () {
            var ctrl_tpl = require('../template/control-contentMark.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 14,//文本说明控件
                FieldID: "contentMark" + "_" + Math.random().toString().replace(".", ""),
                FieldName: "文本描述",
                DefaultValue: '',
                DataType: 6,
                IsProcDataField: false,
                IsBindData: false,
                IsRequire: false,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    selIndex: this.selIndex,
                    FontColor: this.FontColor,
                    FontSize: this.FontSize,
                    Content: this.Content
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            function trim(str) {
                return str.replace(/\n/g, "<br/>");
            }
            var updateBox = $((new builder(_ctype)).toBoxString());
            var _original_config = $.parseJSON(trim($("pre", _ctrlobj).html()));
            if (typeof _original_config == 'object') {
                $("#cm_fontSize option[value=" + _original_config.FieldConfig.FontSize + "]", updateBox).prop({ selected: true });
                $("#cm_FontColor option[sel_index=" + _original_config.FieldConfig.selIndex + "]", updateBox).prop({ selected: true });
                var content = _original_config.FieldConfig.Content;
                content = content.replace(/&lt;br\/&gt;/g, "\n");//转换行
                $("#cm_content", updateBox).val(content);
            }
            return updateBox;
        }
    };
    return control_prototype;
})