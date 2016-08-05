define(function (require) {
    var control_prototype = {
        ctype: 'separator', ipos: "0px -450px", name: '分隔线',
        propertyHtml: function () {
            return require('../template/property-separator.tpl');
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
        inputs: function () {
            this.lineHeight = $("#slt_sprtheight").val();
            this.lineColor = $("#slt_sprtColor").val();
        },
        ckInputs: function () { return true; },
        cformat: function () {
            var ctrl_tpl = require('../template/control-separator.tpl');
            var render = template(ctrl_tpl);
            var config = {
                ctype: arguments[0],
                FieldType: 15,//分割线控件
                FieldID: "separator" + "_" + Math.random().toString().replace(".", ""),
                FieldName: "分割线控件",
                DefaultValue: '',
                DataType: 6,
                IsProcDataField: false,
                IsBindData: false,
                IsRequire: false,
                IsPrint: this.isPrint,
                DataSource: '',
                FieldConfig: {
                    lineheight: this.lineHeight,
                    linecolor: this.lineColor,
                },
                SortIndex: 0,
                isvisible: (this.mustinput ? "visible" : "hidden")
            };
            config.str_config = $.JSONString(config);
            return render(config);
        },
        getUpdateBox: function (_ctype, _ctrlobj, builder) {
            var updateBox = $((new builder(_ctype)).toBoxString());
            var contentbox = $(".sprtline", _ctrlobj);
            $("#slt_sprtheight", updateBox).val(contentbox.attr("lineheight"));
            $("#slt_sprtColor", updateBox).val(contentbox.attr("linecolor"));
            return updateBox;
        }
    };
    return control_prototype;
})



