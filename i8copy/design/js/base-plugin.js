define(function (require) {
    var selector = require("./fw_selector");
    var dataCache=require('./sourceCache');
    var util = require('./util.js');
    var configInfo = {};
    var fnGetProcLineByFieldID = function(baseid,fieldid,callback){
        var _baseid = baseid,_fieldid = fieldid;
        //$.ajax({
        //    'url': i8_session.ajaxWfHost + 'webajax/design/activity/GetProcLineByFieldID',
        //    'data':    {'procbaseid': _baseid, 'fieldid':_fieldid},
        //    'async':   false,
        //    'success': function (data) {
        //        var _retObj = (data||{}).ReturnObject;
                if (!!false && $.isFunction(callback)) {
                    callback();
                    //alert('抱歉，此字段已参与审批链设计，无法删除环节参数！');
                    //$(this).prop('selected',true);
                }
            //}
        //});
    }
    /*removed content*/
    $.extend({
        "MsgBox": function (setting) {
            setting = $.extend({ title: "这里是标题",minWidth:350, content: null, isdrag: true, showBtns: true, btnconfirmtxt: "确定", confirmClick: function (data) { }, btncanceltxt: "关闭", cancelClick: function (data) { }, pos: { left: 0, top: 0} }, setting);
            var boxframe = $('<div class="fdMsgBox"><div class="contentbox"><div class="btitle"><span class="titlewords">' + setting.title + '</span><span class="closeico closetag" title="' + setting.btncanceltxt + '">×</span></div><div class="bcontent"></div>' + (setting.showBtns ? '<div class="optionbuttons"><input type="button" class="btnconfirm" value="' + setting.btnconfirmtxt + '"/>　 <a class="closetag" href="#">关闭</a></div>' : '') + '</div><div>');
            var close = function () {
                //$("body").css({ "overflow": "auto" });
                $(".fdMsgShadow").remove();
                boxframe.remove();
                $('html,body',window.parent.document).scrollTop(0);
            };
            var boxPosSet = function () {
                var _width = window.screen.width,_height = window.screen.height; //$(window).width()
                boxframe.css({ left: _width/ 2 - boxframe.width() / 2, top: _height / 2 - boxframe.height() / 2,minWidth:setting.minWidth });
                //boxframe.css({ left: $(window).width() / 2 - boxframe.width() / 2, top: $(window).height() / 2 - boxframe.height() / 2,minWidth:setting.minWidth });
            };
            return new function () {
                this.show = function () {
                    $(".bcontent", boxframe).append(setting.content);
                    $("body").append($('<div class="fdMsgShadow" style="height:' + document.body.scrollHeight + 'px"></div>')).append(boxframe);//.css({ "overflow": "hidden" });
                    boxPosSet();
                    $(".closetag", boxframe).click(function () { boxframe.effect("scale", { percent: 0 }, 100, function () { setting.cancelClick(); close();}); });
                    $(".btnconfirm", boxframe).click(function () {
                        if (setting.confirmClick()) close();
                    });
                    var _baseid = util.urlParamToJson(window.location.href)['baseinfoid'];
                    var _$editElement =  $(".ctrl-editing");
                    var _fieldid = _$editElement.attr('ctrl-name')||'';
                    var _ctype = _$editElement.attr('ctype');
                    var _paramCtype = {
                        'radio':true,
                        'selectoption':true,
                        'checkbox':true,
                        'subsetoption':true
                    }

                        $('#ck_procNode', boxframe).click(function () {
                            var _that = this;
                            if(!$(this).prop('checked')){
                               if($(this).attr('isparam') == '1') {
                                   alert('抱歉，此字段已参与审批链设计，无法删除环节参数！');
                                   $(this).prop('checked', true);
                               }
                            }
                            //var _baseid = util.urlParamToJson(window.location.href)['baseinfoid'];
                            // var _fieldid = $(".ctrl-editing").attr('ctrl-name')||'';
//                            if (!!_fieldid && !$(this).prop('selected')) {
//                                fnGetProcLineByFieldID(_baseid, _fieldid, function () {
//                                    alert('抱歉，此字段已参与审批链设计，无法删除环节参数！');
//                                    $(_that).prop('selected', true);
//                                })
//                            }
                        });

                        fnGetProcLineByFieldID(_baseid, _fieldid, function () {
                            if(_paramCtype[_ctype]) {
                                var _tips = '提示：此字段已参与分支条件设计，为了不影响流程正常使用，<br/>&nbsp;请在修改数据源后及时更新相关流程设计！';
                                $('.bcontent', boxframe).find('.boxrow').last().before('<div class="boxrow boxrow-tips">' + _tips + '</div>');
                            }
                                $('#ck_procNode').attr('isparam', 1);

                        })


//                    var getTips = function(){
//                        var _datasourceId = $('#slt_selectdatasource').val();
//                        $.ajax({
//                            'url': i8_session.ajaxWfHost + 'webajax/design/activity/GetRunProcDataSourceAndLine',
//                            'data':    {'datasourceid':_datasourceId},
//                            'async':   false,
//                            'success': function (data) {
//                                var _retObj = data.ReturnObject;
//                                var _item1 = _retObj.Item1||[];
//                                var _item2 = _retObj.Item2||[];
//                                var _html1= '';
//                                var _html2='';
//                                if
//                                $('.bcontent',boxframe).find('.boxrow').last().before('<div class="boxrow boxrow-tips"></div>');
//                            }
//                        });
//                    }();

                    if (setting.isdrag) { boxframe.draggable(); $(".btitle", boxframe).css({ "cursor": "move" }); }
                    if (setting.showBtns) { $(".contentbox", boxframe) }


                };
                this.repos = function () { boxPosSet() };
                this.closeBox = function () { close(); };
            }
        },
        "JSONString": function (obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            }
            else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
                for (n in obj) {
                    v = obj[n]; t = typeof (v);
                    if (t == "function") continue; /*except function*/
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = $.JSONString(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        }
    });

    /* 列表数据插件 */
    $.fn.DataGridNew = function (columns,options) {

        //--var------------------------------------------------

        //默认初始化组件参数
        var defaults = {
            intRowNum: 0,
            columns: [],
            isSummary: true,
            mode: 'readonly',
            sumaryCfg: { 'text': '总计:', 'calculateCol': 'RbsCoins' },
            initDataSource: [],
            bindDataSource: [],
            defaultSelectItem: '-请选择-',
            onEdit: function (obj) { },
            onDelete: function (obj) { },
            onSave: function (obj) { },
            tagName:''
        };

        //xx
        var grid = $(this);

        //合并初始化配置
        var opts = $.extend({}, defaults, options);

        opts.columns = columns;
        var isSetWidth = opts.isSetWidth;
        configInfo.autoIndex =  (typeof opts.autoIndex === 'undefined'?false:opts.autoIndex);
        //xx
        var calculateTotalObj = null;

        //计算列索引
        var CalculateColIndex = 0;

        //控件对象列表
        var controlArr = [];

        //控件对象列表,用于修改
        controlArr2 = [];
        //表格父容器
        var parentContainer = $('<div class="workflow_table_container"></div>');
        //表格容器
        var tableContainer = $('<table width="100%" class="datagrid" border="1" cellpadding="0" cellspacing="0"></table>');



        //--fn------------------------------------------------

        //获取用户ids，names用逗号分割
        var getUserIDs = function (names) {
            var ary_uns = names.split(",");
            var getuseridbyname = function (name) {

                if (window["KSNUSER_CACHE"].length > 0) {
                    for (var y = 0; y < window["KSNUSER_CACHE"].length; y++) {
                        if (window["KSNUSER_CACHE"][y].uname == name) {
                            return window["KSNUSER_CACHE"][y].uid;
                        }
                    }
                }
            }
            var cvtUID = cvtUID || [];
            for (var p = 0; p < ary_uns.length; p++) {
                var getUID = getuseridbyname(ary_uns[p]);
                if (getUID) {
                    cvtUID.push(getUID);
                }
            }

            return cvtUID;
        }

        //用户id是否已存在与window["KSNUSER_CACHE"]中
        var useridIsExist = function (id) {
            if (window["KSNUSER_CACHE"]) {
                for (var i = 0; i < window["KSNUSER_CACHE"].length; i++) {
                    if (id == window["KSNUSER_CACHE"][i].uid) {
                        return true;
                    }
                }
            }
            return false;
        };

        //获取组织ids，names用逗号分割
        var getOrgIDs = function (names) {
            var ary_uns = names.split(",");
            var getuseridbyname = function (name) {

                if (window["KSNORG_CACHE"].length > 0) {
                    for (var y = 0; y < window["KSNORG_CACHE"].length; y++) {
                        if (window["KSNORG_CACHE"][y].uname == name) {
                            return window["KSNORG_CACHE"][y].uid;
                        }
                    }
                }
            }
            var cvtUID = cvtUID || [];
            for (var p = 0; p < ary_uns.length; p++) {
                var getUID = getuseridbyname(ary_uns[p]);
                if (getUID) {
                    cvtUID.push(getUID);
                }
            }

            return cvtUID;
        }

        //用户id是否已存在与window["KSNUSER_CACHE"]中
        var orgidIsExist = function (id) {
            if (window["KSNORG_CACHE"]) {
                for (var i = 0; i < window["KSNORG_CACHE"].length; i++) {
                    if (id == window["KSNORG_CACHE"][i].orgid) {
                        return true;
                    }
                }
            }
            return false;
        };

        //选人选组织控件激活
        var activeUserOrgControl = function (parentContainer) {
            parentContainer.find(".lsuserkeytag").each(function () {
                var ksn_id = $(this).attr("id");
                var _model = $(this).attr("ukmodel") == "multi" ? 2 : 1;
                var _tempKSN = selector.KSNSelector({ model: _model, element: "#" + ksn_id, width: 150 });
                window["KSN_OBJECT"].push({ 'id': ksn_id, 'obj': _tempKSN });
            });
            parentContainer.find(".lsorgkeytag").each(function () {
                var ksn_id = $(this).attr("id");
                var _model = $(this).attr("ukmodel") == "multi" ? 2 : 1;
                var _tempKSN = selector.KSNSelector({ model: _model, element: "#" + ksn_id, width: 150, searchType: { "org": true, "user": false, "grp": false } });
                window["KSN_OBJECT"].push({ 'id': ksn_id, 'obj': _tempKSN });
            })
        }

        //savedata
        var SaveData = function () {
            var rowIndex = tableContainer.find("tr:gt(0)").length;
            var data = grid.data("data");
            if (data == null || data == undefined)
                data = [];

            tableContainer.find("tr:gt(0)").each(function () {
                //总计行
                if ($(this).attr("id") == "gridSummaryRow")
                    return;
                var rowObj = [];
                $(this).find("td:gt(0)").each(function (i) {
                    if (i < opts.columns.length)
                        rowObj.push($(this).text());
                });
                data.push(rowObj);
            });
            grid.data("data", data);
        }

        //重置按钮
        var ResetAddRowBtn = function () {
            btnAddOrSave.val("添加");
            btnAddOrSave.removeData("editRow");
            btnCancel.hide();
            for (var i = 0; i < controlArr.length; i++) {
                controlArr[i].reset();
            }
        }

        //添加行方法
        var AddDataRows = function (tableContainer, rowArr) {
            var rowIndex = tableContainer.find("tr:gt(0)").length;
            var summaryRow = null;
            if (opts.isSummary) {
                summaryRow = tableContainer.find("tr:eq(" + rowIndex + ")");
                rowIndex--;
            }

            if (!rowArr && rowArr.length <= 0) return;

            for (var i = 0; i < rowArr.length; i++, rowIndex++) {
                var trContainer = $("<tr class='normaltr'></tr>");
                //Serial Number
                //trContainer.append("<td align='center'>" + (rowIndex + 1) + "</td>");
                //Data Columns
                for (var j = 0; j < rowArr[i].length; j++) {
                    trContainer.append('<td>' + rowArr[i][j] + '</td>');
                }
                //Options Columns
                var optionContainer = $('<td align="center" isoptiontd="true"></td>');

                if (opts.mode == "edit") {
                    //修改
                    var btnModify = $('<input type="button" class="datagrid_row_modify" title="修改" />');
                    btnModify.click(function () {
                        var trParent = $(this).parent().parent();
                        //触发外部事件
                        opts.onEdit(trParent);
                        for (var i = 0; i < controlArr.length; i++) {
                            controlArr[i].reset();
                        }
                        var tdArr = trParent.find("td");
                        var k = 0;
                        for (var i = 0; i < tdArr.length; i++) {
                            if (i == (tdArr.length - 1))
                                continue;
                            controlArr[k].setValue($(tdArr[i]).text());
                            k++;
                        }

                        btnAddOrSave.data("editRow", trParent);
                        btnAddOrSave.val('保存');
                        btnCancel.show();
                    });

                    //删除
                    var btnDelete = $('<input type="button" class="datagrid_row_delete" title="删除" />');
                    btnDelete.click(function () {
                        var trRow = $(this).parent().parent();
                        //触发外部删除事件
                        opts.onDelete(trRow);
                        trRow.remove();
                        //重新生成序号
                        //                        tableContainer.find("tr:gt(0)").each(function (i) {
                        //                            var serialNumCell = $(this).find("td:eq(0)");
                        //                            if (serialNumCell.text() != "")
                        //                                serialNumCell.text(i + 1);
                        //                        });

                        CalculateGridTotalDesc(tableContainer, CalculateColIndex, calculateTotalObj);
                        SaveData();
                    });

                    //保存
                    //var btnSave = $('<a class="datagrid_row_save" href="javascript:void(0);" style="display:none;">保存</a>');
                    //btnSave.click(function () {

                    //    var trParent = $(this).parent().parent();
                    //    //按钮变化
                    //    $(this).parent().find(".datagrid_row_modify").show();
                    //    $(this).parent().find(".datagrid_row_delete").show();
                    //    $(this).parent().find(".datagrid_row_save").hide();
                    //    //编辑状态在行中显示
                    //    var _td = $("td", trParent);
                    //    _td.each(function (index) {
                    //        if (index != _td.length - 1) {
                    //            $(this).html(controlArr2[index].getValue());
                    //            controlArr2[index].reset();
                    //        }
                    //    });

                    //    CalculateGridTotalDesc(tableContainer, CalculateColIndex, calculateTotalObj);
                    //});

                    optionContainer.append(btnModify);
                    optionContainer.append(btnDelete);
                    //optionContainer.append(btnSave);

                }

                trContainer.append(optionContainer);

                trContainer.bind('mouseover', function () {
                    $(this).css({ 'background-color': '#D9EBF5' });
                }).bind('mouseout', function () {
                    $(this).css({ 'background-color': 'white' });
                });
                if (opts.isSummary)
                    //summaryRow.before(trContainer);
                    $(".gridSummaryRow", tableContainer).before(trContainer);
                else
                    tableContainer.append(trContainer);
            }
        }



        //--run------------------------------------------------
        parentContainer.append(tableContainer);
        //添加到表格
        $(this).append(parentContainer);

        //初始化列头
        InitDataColumns(tableContainer, opts.columns,opts);

        //合计内容
        if (opts.isSummary) {
            //合计
            var trSumary = '<tr class="gridSummaryRow">';
            for (var i = 0; i < opts.columns.length; i++) {
                if (opts.columns[i].iscolsum) {
                    CalculateColIndex = i; //iscolsum
                    var hidensum = '<input type="text" class="grid_col_total_inputvalue" isparam="' + opts.columns[i].isparam + '" valuetype="4" tagctrl="text" tagname="listSUM' + opts.columns[i].colName + '_'+(opts.tagName||'')+'" tagtitle="' + opts.columns[i].colText + '合计" formdata="true" value="0">';
                    trSumary += '<td class="td_summary_txt"><b>合计: <span class="grid_col_total">0</span></b>' + hidensum + '</td>';
                } else
                    trSumary += '<td></td>';
            }
            trSumary += '<td></td></tr>';
            //大写
            //var trSumaryChinese = '<tr class="gridSummaryRowChinese">';
            //for (var i = 0; i < opts.columns.length; i++) {
            //    if (opts.columns[i].iscolchinese) {
            //        trSumaryChinese += '<td class="td_summary_txt"><b>大写: <span class="grid_col_total">0</span></b></td>';
            //    } else
            //        trSumaryChinese += '<td></td>';
            //}
            //trSumaryChinese += '<td></td></tr>';
            //var sumaryhtml = trSumary + trSumaryChinese;

            tableContainer.append(trSumary);
            calculateTotalObj = tableContainer.find(".grid_col_total");
        }

        //初始化行
        if (opts.initDataSource != null && opts.initDataSource.length > 0) {
            //初始化默认数据
            AddDataRows(tableContainer, opts.initDataSource);
            CalculateGridTotalDesc(tableContainer, CalculateColIndex, calculateTotalObj);
            SaveData();
        } else {
            //初始化空行
            //var arr = [];
            //for (var i = 0; i < opts.intRowNum; i++) {
            //    arr[i] = [];
            //    for (var j = 0; j < opts.columns.length; j++) {
            //        arr[i][j] = "";
            //    }
            //}
            //AddDataRows(tableContainer, arr);
        }



        //编辑模式
        if (opts.mode == "edit") {
            var EditContainer = $('<ul class="editulcontainer"></ul>');
            for (var i = 0; i < opts.columns.length; i++) {
                var col = opts.columns[i];
                var fieldContainer = $('<li></li>');
                var fieldText = $('<div class="div_fieldtxt">' + (col.mustInput ? '<b class="span_mustinputtag">*</b>' : '') + col.colText + '：</div>');
                fieldContainer.append(fieldText);


                //编辑区域初始化
                //文本
                if (col.colType == "Text") {
                    //用于添加
                    var control = $('<input id="' + col.colName + '" ntext="' + col.colText + '" valuetype="' + col.valuetype + '" ismustinput="' + col.mustInput + '" class="floatRight" type="text" />');
                    control.getValue = function (isVal) {//获取值
                        var vType = $(this).attr("valuetype");
                        var cur_value = $.trim($(this).val()).replace(/[&<>]+/g, "");
                        var nText = $(this).attr("ntext");
                        switch (vType) {
                            case "unlimited":
                                if (cur_value.length == 0 && isVal) {
                                    alert(nText + '未填写');
                                    return false;
                                }
                                break;
                            case "email":
                                var email_reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/g;
                                if (!email_reg.test(cur_value) && isVal) {
                                    alert(nText + '字段请输入邮箱');
                                    $(this).select();
                                    return false;
                                }
                                break;
                            case "phone":
                                var cellphone_reg = /^1[3|4|5|6|8][0-9]\d{8}$/g;
                                if (!cellphone_reg.test(cur_value) && isVal) {
                                    alert(nText + '字段请输入手机号');
                                    $(this).select();
                                    return false;
                                }
                                break;
                            case "number":
                                var numberchar_reg = /^(\-?)[0-9]+(\.[0-9]+)?$/g; /* /^[1-9]\d*$/g;*/
                                if (!numberchar_reg.test(cur_value) && isVal) {
                                    alert(nText + '字段请输入数字');
                                    $(this).select();
                                    return false;
                                }
                                break;
                            case "numberchar":
                                var numberchar_reg = /^\w+$/g;
                                if (!numberchar_reg.test(cur_value) && isVal) {
                                    alert(nText + '字段请输入字母或数字');
                                    $(this).select();
                                    return false;
                                }
                                break;
                        }
                        return cur_value;
                    };
                    control.setValue = function (value) {
                        $(this).val(value);
                    }
                    control.reset = function () {
                        $(this).val("");
                    }
                    controlArr.push(control);
                    fieldContainer.append($('<div class="div_field_control"></div>').append(control));
                }
                //自动序号
                else if (col.colType == "AutoIndex") {
                    //用于添加
                   // var control = $('<input readonly="readonly" id="' + col.colName + '" ntext="' + col.colText + '" valuetype="' + col.valuetype + '" ismustinput="' + col.mustInput + '" class="floatRight" type="text" />');
                    var control="自动序号无需填写";
                    controlArr.push(control);
                    fieldContainer.append($('<div class="div_field_control div_autoindex_control"></div>').append(control));
                }
                    //下拉
                else if (col.colType == "Dropdown") {
                    //用于添加
                    var dropdownControl = $('<select id="' + col.colName + '" ismustinput="' + col.mustInput + '" class="floatRight"></select>');
                    (function(dropdownControlSingle) {
                       dropdownControlSingle.getValue = function (isVal) {
                           var selectedValue = $(this).val();
                           if (selectedValue == opts.defaultSelectItem && isVal) {
                               var itemName = dropdownControlSingle.parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                               alert("请选择" + itemName + "!");
                               return false;
                           }
                           return selectedValue;
                       };
                       dropdownControlSingle.setValue = function (value) {
                           $(this).val(value);
                       }
                       //添加默认值
                       dropdownControlSingle.append('<option>' + opts.defaultSelectItem + '</option>');
                       if (opts.bindDataSource) {
                           dataCache.getSourceByID(col.dataSource, function (dataobj) {
                               var opts = "";
                               _.each(dataobj, function (item) {
                                   opts += '<option>' + item.Text + '</option>';
                               });
                               dropdownControlSingle.append(opts);
                           });


                       }
                       dropdownControlSingle.reset = function () {
                           $(this)[0].selectedIndex = 0;
                       }
                       controlArr.push(dropdownControlSingle);
                       fieldContainer.append($('<div class="div_field_control"></div>').append(dropdownControlSingle));
                   })(dropdownControl);
                }
                    //自动计算
                else if (col.colType == "AutoCalculate") {
                    var control = $('<span>自动计算列无需填写</span>');
                    control.getValue = function (isVal) {

                        return "";
                    };
                    control.setValue = function (value) {
                        $(this).val(value);
                    }
                    control.reset = function () {
                        $(this).val("");
                    }
                    controlArr.push(control);
                    fieldContainer.append($('<div class="div_field_control"></div>').append(control));

                }
                    //级联菜单
                else if (col.colType == "Subsetoption") {

                    (function(dropdownControl){
                        //级联数据源绑定
                        var subsetControlNew = function (data, $mainSelDom, $subSelDom) {
                            //默认
                            var _sourceId = $mainSelDom.parent('span').attr('source-id');
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].DataSourceID != _sourceId) continue;
                                $mainSelDom.append("<option value=" + data[i].Value + " data-id=" + data[i].ID + ">" + data[i].Text + "</option>");
                                if (i == 0 && data[0].subItems.length > 0) {
                                    var data2 = data[0].subItems;
                                    for (var j = 0; j < data2.length; j++) {
                                        $subSelDom.append("<option value=" + data2[j].Value + " data-id=" + data2[j].ID + ">" + data2[j].Text + "</option>");
                                    }
                                }
                            }
                            //绑定改变方法
                            $mainSelDom.change(function () {
                                $subSelDom.html("");

                                var id = $("option:selected", this).attr("data-id");
                                for (var i = 0; i < data.length; i++) {
                                    if (id == data[i].ID) {
                                        var data2 = data[i].subItems;
                                        for (var j = 0; j < data2.length; j++) {
                                            $subSelDom.append("<option value=" + data2[j].Value + " data-id=" + data2[j].ID + ">" + data2[j].Text + "</option>");
                                        }
                                    }
                                }
                            });
                        };


                        //添加读取值的方法
                        dropdownControl.getValue = function (isVal) {
                            var selectedValue = $(this).val();
                            if (selectedValue == opts.defaultSelectItem && isVal) {
                                var itemName = dropdownControl.parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                                alert("请选择" + itemName + "!");
                                return false;
                            }

                            var mainselVal = $(".ctrl_mainoptions", $(this)).val();
                            var subselVal = $(".ctrl_subsetoptions", $(this)).val();
                            return mainselVal + ">>" + subselVal;
                        };

                        dropdownControl.setValue = function (value) {
                            var sourceID = $(this).attr("source-id");
                            var mainselval = value.split(",")[0];
                            var subselVal = value.split(",")[1];
                            var subdata = "";
                            $(".ctrl_mainoptions", $(this)).val(mainselval);

                            var dataID = $(".ctrl_mainoptions option[value=" + mainselval + "]", $(this)).attr("data-id");
                            if (opts.bindDataSource && opts.bindDataSource.length) {
                                var datasourcelist = opts.bindDataSource;
                                for (var k in datasourcelist) {
                                    if (datasourcelist[k].id == sourceID) {
                                        var itemlist = datasourcelist[k].list;
                                        for (var i = 0; i < itemlist.length; i++) {
                                            if (itemlist[i].id == dataID && itemlist[i].subset && itemlist[i].subset.length > 0) {
                                                subdata = itemlist[i].subset;
                                                var suboptionHtml = "";
                                                for (var j = 0; j < subdata.length; j++) {
                                                    suboptionHtml += "<option value='" + subdata[j].Value + "' data-id='" + subdata[j].ID + "'>" + subdata[j].Text + "</option>";
                                                }
                                                $(".ctrl_subsetoptions", $(this)).html("");
                                                $(".ctrl_subsetoptions", $(this)).append(suboptionHtml);
                                                $(".ctrl_subsetoptions", $(this)).val(subselVal);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        controlArr.push(dropdownControl);
                        fieldContainer.append($('<div class="div_field_control"></div>').append(dropdownControl));
                        //添加默认值
                        //dropdownControl.append('<option>' + opts.defaultSelectItem + '</option>');
                        //添加默认配置数据源
                        if (opts.bindDataSource) {
                            dataCache.getSourceByID(col.dataSource, function (datalist) {
                                //console.log(dropdownControl.html());
                                subsetControlNew(datalist, dropdownControl.find(".ctrl_mainoptions"), dropdownControl.find(".ctrl_subsetoptions"));
                            })

                            /*if (opts.bindDataSource.length > 0) {
                             var datasourcelist = opts.bindDataSource;
                             for (var k in datasourcelist) {
                             if (datasourcelist[k].id == col.dataSource) {
                             var itemlist = datasourcelist[k].list;
                             subsetControlNew(itemlist, dropdownControl.find(".ctrl_mainoptions"), dropdownControl.find(".ctrl_subsetoptions"));

                             }
                             }
                             }*/
                        }
                        dropdownControl.reset = function () {
                            $(this)[0].selectedIndex = 0;
                        }
                    })($('<span id="' + col.colName + '" ismustinput="' + col.mustInput + '" class="floatRight" source-id="' + col.dataSource + '"><select class="ctrl_mainoptions"></select><select class="ctrl_subsetoptions"></select></span>'));
                }
                    //选人控件
                else if (col.colType == "UserKey") {
                    var userkey_rd_name = Math.random().toString().replace(".", "");
                    window["KSNUSER_CACHE"] = window["KSNUSER_CACHE"] || []; /*选择的人缓存全局变量之中*/

                    //用于添加
                    var control = $('<div class="div_field_control" ismustinput="' + col.mustInput + '" ><input id="uk_' + userkey_rd_name + '" ukmodel="' + col.valuetype + '" class="lsuserkeytag floatRight" ismustinput="' + (col.mustInput == undefined ? true : false) + '" type="text" /></div>');
                    control.getValue = function (isVal) {
                        var _uns = "";
                        var _uids = "";
                        $(this).find(".fw_ksninput_slted").each(function () {
                            var _uid = $(this).attr("data-uid");
                            var _uname = $(this).find("em").text();
                            if (!useridIsExist(_uid)) {
                                window["KSNUSER_CACHE"].push({ 'uid': _uid, 'uname': _uname });

                            }
                            _uns += _uname + ",";
                            _uids += _uid + ",";
                        })
                        if (_uns.indexOf(",") > 0) {
                            _uns = _uns.substr(0, _uns.lastIndexOf(","));
                        }
                        if (_uns.length == 0 && isVal) {
                            var itemName = $(this).parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                            alert('请选择' + itemName + "!");
                            return false;
                        } else {
                            return _uns + "<input type='hidden' s-type='user' value='" + _uids + "'/>";
                        }
                    };
                    control.setValue = function (value) {
                        var ary_uns = value.split(",");
                        var getuseridbyname = function (name) {
                            if (window["KSNUSER_CACHE"].length > 0) {
                                for (var y = 0; y < window["KSNUSER_CACHE"].length; y++) {
                                    if (window["KSNUSER_CACHE"][y].uname == name) {
                                        return window["KSNUSER_CACHE"][y].uid;
                                    }
                                }
                            }
                        }
                        var cvtUID = cvtUID || [];
                        for (var p = 0; p < ary_uns.length; p++) {
                            var getUID = getuseridbyname(ary_uns[p]);
                            if (getUID) {
                                cvtUID.push(getUID);
                            }
                        }
                        var ksn_obj_id = $(".lsuserkeytag", this).attr("id");
                        if (window["KSN_OBJECT"].length > 0) {
                            for (var m = 0; m < window["KSN_OBJECT"].length; m++) {
                                if (window["KSN_OBJECT"][m].id == ksn_obj_id) {
                                    window["KSN_OBJECT"][m].obj.loadData(cvtUID);
                                }
                            }
                        }
                        var _model = $(".lsuserkeytag", this).attr("ukmodel");
                        selector.KSNSelector({ model: _model, element: "#" + ksn_obj_id, searchType: { "org": false, "user": true, "grp": false } });
                    }
                    control.reset = function () {
                        var ksn_obj_id = $(".lsuserkeytag", this).attr("id");
                        if (window["KSN_OBJECT"].length > 0) {
                            for (var m = 0; m < window["KSN_OBJECT"].length; m++) {
                                if (window["KSN_OBJECT"][m].id == ksn_obj_id) {
                                    window["KSN_OBJECT"][m].obj.clearData();
                                }
                            }
                        }
                    }
                    controlArr.push(control);
                    fieldContainer.append(control);

                }
                    //选部门控件
                else if (col.colType == "OrgKey") {
                    var orgkey_rd_name = Math.random().toString().replace(".", "");
                    window["KSNORG_CACHE"] = window["KSNORG_CACHE"] || [];
                    //用于添加
                    var control = $('<div class="div_field_control" ismustinput="' + col.mustInput + '" ><input id="orgk_' + orgkey_rd_name + '" ukmodel="' + col.valuetype + '" class="lsorgkeytag floatRight" ismustinput="' + (col.mustInput == undefined ? true : false) + '" type="text" /></div>');
                    control.getValue = function (isVal) {
                        var _uns = "";
                        var _uids = "";
                        $(this).find(".fw_ksninput_slted").each(function () {
                            var _uid = $(this).attr("data-uid");
                            var _uname = $(this).find("em").text();
                            if (!orgidIsExist(_uid)) {
                                window["KSNORG_CACHE"].push({ 'uid': _uid, 'uname': _uname });
                            }
                            _uns += _uname + ",";
                            _uids += _uid + ",";
                        })
                        if (_uns.indexOf(",") > 0) {
                            _uns = _uns.substr(0, _uns.lastIndexOf(","));
                        }
                        if (_uns.length == 0 && isVal) {
                            var itemName = $(this).parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                            alert('请选择' + itemName + "!");
                            return false;
                        } else {
                            return _uns + "<input type='hidden' s-type='org' value='" + _uids + "'/>";
                        }
                    };
                    control.setValue = function (value) {
                        var ary_uns = value.split(",");
                        var getuseridbyname = function (name) {
                            if (window["KSNORG_CACHE"].length > 0) {
                                for (var y = 0; y < window["KSNORG_CACHE"].length; y++) {
                                    if (window["KSNORG_CACHE"][y].uname == name) {
                                        return window["KSNORG_CACHE"][y].uid;
                                    }
                                }
                            }
                        }
                        var cvtUID = cvtUID || [];
                        for (var p = 0; p < ary_uns.length; p++) {
                            var getUID = getuseridbyname(ary_uns[p]);
                            if (getUID) {
                                cvtUID.push(getUID);
                            }
                        }
                        var ksn_obj_id = $(".lsorgkeytag", this).attr("id");
                        if (window["KSN_OBJECT"].length > 0) {
                            for (var m = 0; m < window["KSN_OBJECT"].length; m++) {
                                if (window["KSN_OBJECT"][m].id == ksn_obj_id) {
                                    for (var i = 0; i < cvtUID.length; i++) {
                                        window["KSN_OBJECT"][m].obj.setAllselectedData([{ "type": "org", "id": cvtUID[i] }]);
                                    }

                                }
                            }
                        }
                        var _model = $(".lsorgkeytag", this).attr("ukmodel");
                        selector.KSNSelector({ model: _model, element: "#" + ksn_obj_id, searchType: { "org": true, "user": false, "grp": true } });
                    }
                    control.reset = function () {
                        var ksn_obj_id = $(".lsorgkeytag", this).attr("id");
                        if (window["KSN_OBJECT"].length > 0) {
                            for (var m = 0; m < window["KSN_OBJECT"].length; m++) {
                                if (window["KSN_OBJECT"][m].id == ksn_obj_id) {
                                    window["KSN_OBJECT"][m].obj.clearData();
                                }
                            }
                        }
                    }
                    controlArr.push(control);
                    fieldContainer.append(control);
                }
                    //日期控件
                else if (col.colType == "DatePicker") {
                    //用于添加
                    var control = $('<input id="' + col.colName + '" ntext="' + col.colText + '" valuetype="' + col.valuetype + '" ismustinput="' + col.mustInput + '" class="floatRight Wdate" type="text" onFocus="WdatePicker({dateFmt:\'' + col.valuetype + '\',skin:\'whyGreen\'})" />');
                    control.getValue = function (isVal) {
                        var dText = $(this).val();
                        var nText = $(this).attr("ntext");
                        if (dText.length == 0 && isVal) {
                            alert(nText + '未选择');
                            return false;
                        }
                        return dText;
                    };
                    control.setValue = function (value) {
                        $(this).val(value)
                    }
                    control.reset = function () {
                        $(this).val("");
                    }
                    controlArr.push(control);
                    fieldContainer.append($('<div class="div_field_control"></div>').append(control));
                }
                    //单选
                else if (col.colType == "RadioButton") {
                    //用于添加
                    var control = $('<div class="wdf_tblist_radios" ismustinput="' + col.mustInput + '"></div>');
                    (function(control){
                    if (opts.bindDataSource) {
                        if (col.dataSource.length==36) {

                            dataCache.getSourceByID(col.dataSource,function(datalist){
                                //var itemsHtml="";
                                _.each(datalist,function(item){
                                    var itemNum = Math.random().toString().replace(".", "");
                                    control.append('<input type="radio"  name="'+_.uniqueId("rdName_")+'" id="wdf_tblist_radios' + itemNum + '" /><label for="wdf_tblist_radios' + itemNum + '">' + item.Text + '</label>');
                                });
                            });

                            /*var datasourcelist = opts.bindDataSource;
                            for (var k in datasourcelist) {
                                if (datasourcelist[k].id == col.dataSource) {
                                    var itemlist = datasourcelist[k].list;
                                    var itemNameNum = Math.random().toString().replace(".", "");
                                    for (var j in itemlist) {
                                        if (typeof itemlist[j] == "object") {
                                            var itemNum = Math.random().toString().replace(".", "");
                                            control.append('<input type="radio" name="n' + itemNameNum + '" id="wdf_tblist_radios' + itemNum + '" /><label for="wdf_tblist_radios' + itemNum + '">' + itemlist[j].Text + '</label>');
                                        }
                                    }
                                }
                            }*/

                        }
                    }
                    control.getValue = function (isVal) {
                        //验证
                        var size = $(this).find("input:checked").length;
                        if (size == 0 && isVal) {
                            var itemName = $(this).parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                            alert('请选择' + itemName + "!");
                            return false;
                        }
                        //取值
                        var checkedID = $(this).find("input:checked").attr("id");
                        var txtvalue = $(this).find("label[for='" + checkedID + "']").text();
                        return txtvalue;
                    };
                    control.setValue = function (value) {
                        $(this).find("label").each(function () {
                            if ($(this).text() == value) {
                                var checkid = $(this).attr("for");
                                $("#" + checkid).prop({ checked: true });
                            }
                        })
                    };
                    control.reset = function () {
                        $(this).find(":radio").prop({ checked: false });
                    };
                    controlArr.push(control);
                    fieldContainer.append($('<div class="div_field_control"></div>').append(control));
                    })(control);
                }
                    //多选
                else if (col.colType == "Checkbox") {
                    //用于添加
                    var control = $('<div class="wdf_tblist_checkbox" ismustinput="' + col.mustInput + '" ></div>');
                    (function(control) {
                        if (opts.bindDataSource) {
                            if (col.dataSource.length == 36) {
                                dataCache.getSourceByID(col.dataSource, function (datalist) {
                                    //subsetControlNew(datalist, dropdownControl.find(".ctrl_mainoptions"), dropdownControl.find(".ctrl_subsetoptions"));
                                    //var itemsHtml="";
                                    _.each(datalist, function (item) {
                                        var itemNum = Math.random().toString().replace(".", "");
                                        control.append('<input type="checkbox" id="wdf_tblist_checkbox' + itemNum + '"/><label for="wdf_tblist_checkbox' + itemNum + '">' + item.Text + '</label>');
                                    });
                                });
                                /*var datasourcelist = opts.bindDataSource;
                                 for (var k in datasourcelist) {
                                 if (datasourcelist[k].id == col.dataSource) {
                                 var itemlist = datasourcelist[k].list;
                                 for (var j in itemlist) {
                                 if (typeof itemlist[j] == "object") {
                                 var itemNum = Math.random().toString().replace(".", "");
                                 control.append('<input type="checkbox" id="wdf_tblist_checkbox' + itemNum + '" /><label for="wdf_tblist_checkbox' + itemNum + '">' + itemlist[j].Text + '</label>');
                                 }
                                 }
                                 }
                                 }*/
                            }
                        }
                        control.getValue = function (isVal) {
                            //验证
                            var size = $(this).find("input:checked").length;
                            if (size == 0 && isVal) {
                                var itemName = $(this).parents("li").find(".div_fieldtxt").text().replace(/[\*|:|：]/ig, "");
                                alert('请选择' + itemName + "!");
                                return false;
                            }
                            //取值
                            var txt = "";
                            $(this).find("input:checked").each(function () {
                                var checkedID = $(this).attr("id");
                                txt += $("label[for='" + checkedID + "']").text() + ",";
                            });
                            if (txt.indexOf(",") > 0) {
                                txt = txt.substr(0, txt.lastIndexOf(","));
                            }
                            return txt;
                        };
                        control.setValue = function (value) {
                            var setvs = value.split(',');
                            if (setvs.length > 0) {
                                for (var p = 0; p < setvs.length; p++) {
                                    $(this).find("label").each(function () {
                                        if ($(this).text() == setvs[p]) {
                                            var checkid = $(this).attr("for");
                                            $("#" + checkid).prop({checked: true});
                                        }
                                    })
                                }
                            }
                        }
                        control.reset = function () {
                            $(this).find(":checkbox").prop({checked: false});
                        }
                        controlArr.push(control);
                        fieldContainer.append($('<div class="div_field_control"></div>').append(control));
                    })(control);
                }

                EditContainer.append(fieldContainer);
            }

            var btnContainer = $('<div class="editbtns"></div>');
            var btnAddOrSave = $('<input type="button" class="btnsave" value="添加" />');
            var btnCancel = $('<a style="display:none;margin-left:5px" href="javascript:void(0)">取消</a>'); //<input type="button" style="display:none;" value="取消" />
            btnAddOrSave.click(function () {
                var rowdata = [[]];
                for (var i = 0; i < controlArr.length; i++) {
                    var ismustInput = controlArr[i].attr("ismustinput") == "true";
                    var value = controlArr[i].getValue(ismustInput);
                    if (typeof value == "boolean" && value == false) {
                        return;
                    }
                    else {
                        rowdata[0].push(value);
                    }
                }
                for (var i = 0; i < controlArr.length; i++) {
                    controlArr[i].reset();
                }
                if ($(this).val() == "添加") {
                    //添加行数据
                    AddDataRows(tableContainer, rowdata);
                } else if ($(this).val() == "保存" && $(this).data("editRow") != null) {
                    var modifyRow = $(this).data("editRow");
                    var cellArr = modifyRow.find("td");
                    for (var i = 0; i < cellArr.length; i++) {
                        if (i != cellArr.length - 1)
                            $(cellArr[i]).html(rowdata[0][i]);
                    }

                    ResetAddRowBtn();
                }
                CalculateGridTotalDesc(tableContainer, CalculateColIndex, calculateTotalObj);
                //保存数据
                SaveData();
            });

            btnCancel.click(function () {
                ResetAddRowBtn();
            });

            btnContainer.append(btnAddOrSave);
            btnContainer.append(btnCancel);
            //EditContainer.append(btnContainer);
            var editbar = $('<div  class="editbar"></div>');
            editbar.append(EditContainer).append(btnContainer);
            $(this).append(editbar);
            window["KSN_OBJECT"] = window["KSN_OBJECT"] || []; /*缓存选人控件实例对象*/
            activeUserOrgControl(editbar);
        }

        return tableContainer;
    }


    $.fn.personInfo = function (options) { }


    //读取组件设计模式Html代码
    $.fn.personInfo.initHtml = function (checkedBoxes, isparam, mustinput) {
        //id生成
        var idCode = "personInfo_" + Math.random().toString().replace(".", "");
        //主htmlcode
        var htmlContent = '<div id="' + idCode + '" class="personInfo" checkednames="' + checkedBoxes.join(',') + '" isparam="' + isparam + '" mustinput="' + mustinput + '" sourceid="">'
                                + '<table class="user_info_sel"><tr><td style="width:80px;text-align:right;">姓名:</td><td style="width:200px;text-align:left;"><input type="text" id="' + idCode + '_input"/></td><td style="width:80px;text-align:right;">部门:</td><td class="orgSel" style="width:200px;text-align:left;"><input type="text" id="' + idCode + '_input_org"/></td></tr>'
                                + '</table>'
                                + '<div class="user_info_container">'
                                + '</div>'
                        + '</div>';
        return htmlContent;
    }


    //激活组件
    $.fn.personInfo.initActive = function (divID, userID, orgID) {
        //
        if (userID != undefined && orgID != undefined) {
            //添加部门
            var orgsel = KSNSelector({
                model: "1", element: "#" + divID + "_input_org", width: '200px',
                searchType: { "org": true, "user": false, "grp": false }
            });
            //var setData = [{ "type": "org", "id": orgID }];
            var setData = [{ "type": "org" }];
            orgsel.setAllselectedData(setData);
        }
        //信息容器
        var container = $("#" + divID + " .user_info_container");
        //var containerTab = $("#" + divID + " .user_info_sel");
        //选人控件
        KSNSelector({
            model: "1", element: "#" + divID + "_input", width: '200px',
            searchType: { "org": false, "user": true, "grp": false },
            loadItem: {
                items: (userID == undefined ? [i8_session.uid] : [userID]),
                loadedCallBack: function () {
                   // getData(userID == undefined ? i8_session.uid : userID);// alert();
                }
            },
            selectCallback: function (personID) {
             //   getData(personID);
            },
            deleteCallback: function (data, data2) {
                $("#" + divID + " .orgSel .fw_ksninput_slted a").click();
                container.html("");
                container.hide();
            }
        });


    }

    //--空间外部方法------------------------------------------------

    //更新生成合计、生成公式计算结果
    var CalculateGridTotalDesc = function (tableContainer, colIndex, viewObj) {
        //公式计算
        $("th", tableContainer).each(function (i) {
            var index = "";//运算的列
            var firstColIndex = "";
            var secColIndex = "";
            var formulaMark = "";
            var formula = ""
            formula = $(this).attr("formula");
            if (formula) {
                index = i;
                var arr = formula.split(";");
                firstColIndex = arr[0] - 1;
                secColIndex = arr[2] - 1;
                formulaMark = arr[1];
                $("tr.normaltr", tableContainer).each(function () {
                    var formulatd = $(this).find("td").eq(index);
                    var firstval = $(this).find("td").eq(firstColIndex).text();
                    var secval = $(this).find("td").eq(secColIndex).text();
                    var formulaResult = "";

                    if (firstval && secval) {
                        firstval = parseFloat(firstval);
                        secval = parseFloat(secval);
                        switch (formulaMark) {
                            case "+": formulaResult = firstval + secval; break;
                            case "-": formulaResult = firstval - secval; break
                            case "*": formulaResult = firstval * secval; break;
                            case "/":
                                if (secval == 0) {
                                    var colname = $("th", tableContainer).eq(secColIndex).text();
                                    alert(colname + "作为除数不能为0");
                                } else {
                                    formulaResult = firstval / secval;
                                }
                                break;
                        }
                    }

                    formulatd.text(formulaResult);
                });
            }
        });
        //、、合计
        $(".gridSummaryRow td", tableContainer).each(function (e) {
            var col_index = e;
            if ($(this).attr("class") == "td_summary_txt") {
                if ($("th", tableContainer).eq(e).attr("issumformula") == "true") {//多列计算
                    var formula = $("th", tableContainer).eq(e).attr("formulasum").split(";");
                    var col_1_index = formula[0] - 1;
                    var col_2_index = formula[2] - 1;
                    var flag = formula[1];

                    //运算项1的合计
                    var _summary1 = 0;
                    tableContainer.find("tr:gt(0)").not(".gridSummaryRow").each(function () {
                        var num = parseFloat($(this).find("td:eq(" + (col_1_index) + ")").text());
                        if (!num) {
                            num = 0;
                        }
                        _summary1 += num;
                    })
                    //_summary1 = (_summary1 + 0.00).toFixed(2);

                    //运算项2的合计
                    var _summary2 = 0;
                    tableContainer.find("tr:gt(0)").not(".gridSummaryRow").each(function () {
                        var num = parseFloat($(this).find("td:eq(" + (col_2_index) + ")").text());
                        if (!num) {
                            num = 0;
                        }
                        _summary2 += num;
                    })
                    //_summary2 = (_summary2 + 0.00).toFixed(2);

                    //合计
                    var _summary = 0;
                    switch (flag) {
                        case "+": _summary = _summary1 + _summary2; break;
                        case "-": _summary = _summary1 - _summary2; break;
                        case "*": _summary = _summary1 * _summary2; break;
                        case "/": _summary = _summary1 / _summary2; break;
                    }

                    $(".grid_col_total", this).text(_summary);
                    $(".grid_col_total_inputvalue", this).attr("value", _summary);

                } else {
                    var _summary = 0;
                    tableContainer.find("tr:gt(0)").not(".gridSummaryRow").each(function () {
                        var num = parseFloat($(this).find("td:eq(" + (col_index) + ")").text());
                        if (!num) {
                            num = 0;
                        }
                        _summary += num;
                    })
                    _summary = (_summary + 0.00).toFixed(2);
                    $(".grid_col_total", this).text(_summary);
                    $(".grid_col_total_inputvalue", this).attr("value", _summary);
                }

            }
        });
        //合计大写
        $(".gridSummaryRowChinese td", tableContainer).each(function (e) {
            var col_index = e;
            if ($(this).attr("class") == "td_summary_txt") {
                var summaryNum = $(".gridSummaryRow td", tableContainer).eq(col_index).find("input.grid_col_total_inputvalue").val();
                $(this).find(".grid_col_total").text(numToChinese(summaryNum));
            }
        });

    }

    //初始化列头
    var InitDataColumns = function (tableContainer, columns, opts, controlArr) {
        var isSetWidth = opts.isSetWidth;
        if (columns && columns.length > 0) {
            try {
                var colRow = $("<tr></tr>");
                if(!!configInfo.autoIndex){
                    colRow.append('<th class="datalist-notsubmit">序号</th>');
                }
                //初始化列
                var _currentWidth = 0;
                var _baseWidth = 750;
                var _totalWidth = 0;

                for (var i = 0; i < columns.length; i++) {
                    // _width = columns[i].colWidth;
                    if(isSetWidth) {
                        _width = (parseFloat(columns[i].colWidth, 10) || 10);
                        _totalWidth += _width;
                        _currentWidth = parseInt(_baseWidth * _width / 100);
                        //如果不足 100% ，最后一列取全部剩下的宽度
                        if (_totalWidth < 100 && i == columns.length - 1) {
                            _currentWidth += (100 - _totalWidth) * _baseWidth / 100;
                        }
                        _currentWidth = _currentWidth + 'px';
                    }else{
                        _currentWidth = 'auto';
                    }
                    colRow.append("<th style=\"width:" + _currentWidth + "\" formula='" + columns[i].formula + "' formulaSum='" + columns[i].formulaSum + "' isSumFormula='" + columns[i].isSumFormula + "'>" + columns[i].colText + "</th>");
                }
                colRow.append("<th style='width:60px'>操作</th>");
                tableContainer.append(colRow);
            } catch (e) {
                tableContainer.append("<tr><td>初始化列头数据失败!</td></tr>");
            }
        }

    }

    //大写
    function numToChinese(money) {
        //debugger;
        var IntNum, PointNum, IntValue, PointValue, unit, moneyCNY;
        var Number = "零壹贰叁肆伍陆柒捌玖";
        var NUMUnit = { LING: "零", SHI: "拾", BAI: "佰", QIAN: "仟", WAN: "万", YI: "亿" }
        var CNYUnit = { YUAN: "元", JIAO: "角", FEN: "分", ZHENG: "整" };
        var beforeReplace =
                {
                    Values:
                    [
                        { Name: NUMUnit.LING + NUMUnit.YI },               // 零亿
                        { Name: NUMUnit.LING + NUMUnit.WAN },              // 零万
                        { Name: NUMUnit.LING + NUMUnit.QIAN },             // 零千
                        { Name: NUMUnit.LING + NUMUnit.BAI },              // 零百
                        { Name: NUMUnit.LING + NUMUnit.SHI },              // 零十
                        { Name: NUMUnit.LING + NUMUnit.LING },             // 零零
                        { Name: NUMUnit.YI + NUMUnit.LING + NUMUnit.WAN }, // 亿零万
                        { Name: NUMUnit.LING + NUMUnit.YI },               // 零亿
                        { Name: NUMUnit.LING + NUMUnit.WAN },              // 零万
                        { Name: NUMUnit.LING + NUMUnit.LING }              // 零零
                    ]
                };
        var afterReplace =
                {
                    Values:
                    [
                        { Name: NUMUnit.YI + NUMUnit.LING }, //亿零
                        { Name: NUMUnit.WAN + NUMUnit.LING }, //万零
                        { Name: NUMUnit.LING },              //零
                        { Name: NUMUnit.LING },              //零
                        { Name: NUMUnit.LING },              //零
                        { Name: NUMUnit.LING },              //零
                        { Name: NUMUnit.YI + NUMUnit.LING }, //亿零
                        { Name: NUMUnit.YI },                //亿
                        { Name: NUMUnit.WAN },               //万
                        { Name: NUMUnit.LING }               //零
                    ]
                };
        var pointBefore =
                {
                    Values:
                    [
                        { Name: NUMUnit.LING + CNYUnit.JIAO }, //零角
                        { Name: NUMUnit.LING + CNYUnit.FEN },  //零分
                        { Name: NUMUnit.LING + NUMUnit.LING }, //零零
                        { Name: CNYUnit.JIAO + NUMUnit.LING }  //角零
                    ]
                };
        var pointAfter =
                {
                    Values:
                    [
                        { Name: NUMUnit.LING }, //零
                        { Name: NUMUnit.LING }, //零
                        { Name: "" },
                        { Name: CNYUnit.JIAO }  //角
                    ]
                };

        /// 递归替换
        var replaceAll = function (inputValue, beforeValue, afterValue) {
            while (inputValue.indexOf(beforeValue) > -1) {
                inputValue = inputValue.replace(beforeValue, afterValue);
            }
            return inputValue;
        }
        /// 获取输入金额的整数部分
        IntNum = money.indexOf(".") > -1 ? money.substring(0, money.indexOf(".")) : money;
        /// 获取输入金额的小数部分
        PointNum = money.indexOf(".") > -1 ? money.substring(money.indexOf(".") + 1) : "";
        IntValue = PointValue = "";

        /// 计算整数部分
        for (var i = 0; i < IntNum.length; i++) {
            /// 获取数字单位
            switch ((IntNum.length - i) % 8) {
                case 5:
                    unit = NUMUnit.WAN; //万
                    break;
                case 0:
                case 4:
                    unit = NUMUnit.QIAN; //千
                    break;
                case 7:
                case 3:
                    unit = NUMUnit.BAI; //百
                    break;
                case 6:
                case 2:
                    unit = NUMUnit.SHI; //十
                    break;
                case 1:
                    if ((IntNum.length - i) > 8) {
                        unit = NUMUnit.YI; //亿    
                    }
                    else { unit = ""; }
                    break;
                default:
                    unit = "";
                    break;
            }
            /// 组成整数部分
            IntValue += Number.substr(parseInt(IntNum.substr(i, 1)), 1) + unit;
        }

        /// 替换零
        for (var i = 0; i < beforeReplace.Values.length; i++) {
            IntValue = replaceAll(IntValue, beforeReplace.Values[i].Name, afterReplace.Values[i].Name);
        }
        // 末尾是零则去除
        if (IntValue.substr(IntValue.length - 1, 1) == NUMUnit.LING) IntValue = IntValue.substring(0, IntValue.length - 1);
        // 一十开头的替换为十开头
        if (IntValue.substr(0, 2) == Number.substr(1, 1) + NUMUnit.SHI) IntValue = IntValue.substr(1, IntValue.length - 1);

        /// 计算小数部分
        if (PointNum != "") {
            PointValue = Number.substr(PointNum.substr(0, 1), 1) + CNYUnit.JIAO;
            PointValue += Number.substr(PointNum.substr(1, 1), 1) + CNYUnit.FEN;
            for (var i = 0; i < pointBefore.Values.length; i++) {
                PointValue = replaceAll(PointValue, pointBefore.Values[i].Name, pointAfter.Values[i].Name);
            }
        }
        if (IntValue == "") {
            moneyCNY = PointValue;
        } else {
            moneyCNY = PointValue == "" ? IntValue + CNYUnit.YUAN + CNYUnit.ZHENG : IntValue + CNYUnit.YUAN + PointValue;
        }
        return moneyCNY;
    }



    //---假期控件---------
    $.fn.VacationSummary = function (options) {
        //默认初始化组件参数
        var defaults = {
            mode: 'edit',  //readonly,design,edit
            data: [],
            uid: '',
            instID: 0,
            instStatus: ''  //流程状态
        };
        var VacationComponent = $(this);
        //合并初始化配置
        var opts = $.extend({}, defaults, options);

        if (opts.mode.toLowerCase() != "design") {


            if (opts.mode.toLowerCase() != "readonly") {
                //初始化假期操作
                var summary_data = VacationComponent. find(".vacationsummary_data");
                var bodyContainer = summary_data.find("tbody");
                //清空无数据行
                bodyContainer.find("tr:eq(1)").remove();

                var addRow = $("<tr class='operatrow'>" +
                                    "<td align='center'><select id='vacation_item' style='width:80px'></select></td>" +
                                    "<td><input id='vacation_begindate' type='text' class='Wdate' style='width:115px;' onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',maxDate:'#F{$dp.$D(\\'vacation_enddate\\')}',skin:'whyGreen'})\"/></td>" +
                                    "<td><input id='vacation_enddate' type='text' class='Wdate' style='width:115px;' onfocus=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',minDate:'#F{$dp.$D(\\'vacation_begindate\\')}',skin:'whyGreen'})\"/></td>" +
                                    "<td><input id='vacation_days' maxlength='10' type='text' style='width:40px;' /></td>" +
                                    "<td><input id='vacation_remark' maxlength='255' type='text' style='width:100px;' /></td>" +
                                    "<td style='width:60px;text-align:center;margin:0px;padding:0px;'><a id='btnAdd' href='javascript:void(0);'>添加</a></td>" +
                                "</tr>");
                var btnAdd = addRow.find("#btnAdd");
                //参数项
                var vacation = addRow.find("#vacation_item");
                var beginDate = addRow.find("#vacation_begindate");
                var endDate = addRow.find("#vacation_enddate");
                var days = addRow.find("#vacation_days");
                var remark = addRow.find("#vacation_remark");
                btnAdd.click(function () {
                    addVacationItem(vacation, beginDate, endDate, days, remark, addRow);
                });

                //支持edit模式设置初始化数据
                if (opts.data != null && opts.data.length > 0) {
                    var viewMode = "";
                    if (opts.instStatus.toLowerCase() == "stopped" || opts.instStatus.toLowerCase() == "reverted")
                        viewMode = "add";
                    else
                        viewMode = "view";
                    for (var i = 0; i < opts.data.length; i++) {
                        var rowdata = "<tr>";
                        for (var j = 0; j < opts.data[i].length; j++) {
                            if (j == 1 || j == 2)
                                rowdata += "<td style='width:120px;'>" + opts.data[i][j] + "</td>";
                            else
                                rowdata += "<td>" + opts.data[i][j] + "</td>";
                        }

                        if (opts.mode.toLowerCase() == "edit")
                            rowdata += "<td style='text-align:center;margin:0px;padding:0px;'><a class='itemDel' open='open' href='javascript:void(0);'>删除</a></td></tr>";

                        var addNewRow = $(rowdata);
                        bodyContainer.append(addNewRow);
                        if (opts.mode.toLowerCase() == "edit") {
                            bodyContainer.find('.itemDel').click(function () {
                                var dataRow = $(this).parent().parent();
                                UpdateMyVacationStatus(dataRow, "remove");
                                dataRow.remove();
                            });
                        }
                        UpdateMyVacationStatus(addNewRow, viewMode);
                    }
                }
                bodyContainer.append(addRow);

            } else if (opts.mode.toLowerCase() == "readonly" && opts.data != null && opts.data.length > 0) {
                //初始化假期操作
                var summary_data = VacationComponent.find(".vacationsummary_data");
                var bodyContainer = summary_data.find("tbody");
                //清空无数据行
                bodyContainer.find("tr:eq(1)").remove();

                var viewMode = "";
                if (opts.instStatus.toLowerCase() == "stopped" || opts.instStatus.toLowerCase() == "reverted")
                    viewMode = "add";
                else
                    viewMode = "view";

                for (var i = 0; i < opts.data.length; i++) {
                    var rowdata = "<tr>";
                    for (var j = 0; j < opts.data[i].length; j++) {
                        if (j == 1 || j == 2)
                            rowdata += "<td style='width:120px;'>" + opts.data[i][j] + "</td>";
                        else
                            rowdata += "<td>" + opts.data[i][j] + "</td>";
                    }
                    if (opts.mode.toLowerCase() == "readonly")
                        rowdata += "<td></td></tr>";

                    var addNewRow = $(rowdata);
                    bodyContainer.append(addNewRow);

                }
            }
        }

        //新增一行数据
        function addVacationItem(vacation, beginDate, endDate, days, remark, pushID) {
            if ($.trim(beginDate.val()) == "") {
                alert("请填写开始时间!");
                return false;
            } else if ($.trim(endDate.val()) == "") {
                alert("请填写结束时间!");
                return false;
            } else if ($.trim(days.val()) == "") {
                alert("请填写假期数量!");
                return false;
            } else if (isNaN(days.val())) {
                alert("假期数量只能填写数字!");
                return false;
            }
            var addNewRow = $("<tr>" +
                "<td>" + vacation.find("option:selected").text() + "</td>" +
                "<td>" + beginDate.val() + "</td>" +
                "<td>" + endDate.val() + "</td>" +
                "<td>" + days.val() + "</td>" +
                "<td>" + remark.val() + "</td>" +
                "<td style='text-align:center;margin:0px;padding:0px;'><a class='itemDel' open='open' href='javascript:void(0);'>删除</a></td>" +
                "</tr>");
            addNewRow.find('.itemDel').click(function () {
                var dataRow = $(this).parent().parent();

                dataRow.remove();
            });
            pushID.before(addNewRow);

            //清空参数值
            beginDate.val('');
            endDate.val('');
            days.val('');
            remark.val('');
        }




    }


    //---消假控件---------
    $.fn.CancelVacationSummary = function (options) {


    }




    //---消假控件---------
    $.fn.OvertimeSummary = function (options) {


    }
    //读取组件设计模式Html代码

    $.fn.CancelVacationSummary.GetInitHtml = function (m,mode,option) {

        var _option = option || {};
        var _tagName = _option.tagName || '';
        //<tr><td>调休</td><td>2013-02-05 18:43:11</td><td>2013-02-06 18:43:11</td><td>18小时</td><td>18小时</td><td>显示详请</td><td><span class="control-vacation-tip-red">无可用假期</span></td><td><a href="javascript:void 0" class="example_bg_icon1 btn-delete">删除</a></td></tr>\
        var htmlContent = ' <div class="control-vacation-container">\
        <div class="control-vacation-header">\
        <div class="fw_left control-vacation-title">此次销假明细</div> <div class="fw_left">&nbsp;&nbsp;<a class="control-vacation-view-existvacation" href="javascript:void 0">查看全部可用假期</a></div>\
        <div class="fw_right"> <span class="control-vacation-unit">单位&nbsp;</span>\
        <div class="timeset fw_right m-l20">\
        <a class="a1 selected">小时</a><a class="a2">天</a>\
        </div>\
        </div>\
        </div>\
        <div class="fw_clear"></div>\
        <div class="control-vacation-body control-vacation-cancelvacation">\
        <table class="control-vacation-detail vacationsummary_cancelvacation">\
        <thead><tr><th class="vacation-header-type">假期类型</th><th class="vacation-header-time">销假开始时间</th><th class="vacation-header-time">销假结束时间</th><th class="vacation-header-time">销假时长</th><th class="vacation-header-amount">审批后可用</th><th class="vacation-header-applytime">审批后已用</th><th class="vacation-header-available">流程号</th><th class="vacation-header-remark">备注</th><th class="vacation-header-operate">操作</th></tr></thead>\
        <tbody class="control-vacation-list">\
        </tbody>\
          <tbody class="control-vacation-total">\
            <tr><td colspan="2"></td><td class="vacation-row-amount" colspan="6"><span class="vacation-total-title">合计：</span><span class="vacation-datatype-amount vacation-sum-total-amount">0</span></td></tr>\
            </tbody>\
        </table>\
        <table class="control-vacation-operate">\
            <tr class="operatrow">\
        <td class="vacation-operation-title">销假类型</td>\
        <td class="vacation-operation-date"><select id="vacation_item"></select></td>\
        <td class="vacation-operation-title"  >销假开始时间</td>\
        <td class="control-operation-time" > <input type="text" class="vacation-begindate vacation-begindate-cancelvacation"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td> \
          <td class="vacation-operation-title"  >销假结束时间</td>\
        <td class="control-operation-time" > <input type="text" class="vacation-enddate vacation-enddate-cancelvacation"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td> \
                    </tr></table>\
                    <table class="control-vacation-operate"><tr class="operatrow">\
                   <td class="vacation-operation-title">销假时长</td>\
                   <td class="vacation-operation-data"><input type="text"  class="vacation-detail-duration" />&nbsp;<span class="vacation-control-vacationtype">小时</span></td>\
                   <td  class="vacation-operation-remark">备注</td>\
            <td ><input type="text" class="vacation-detail-remark"  /></td>\
            <td class="vacation-operation-relation"><a class="vacation-relation-proc" href="javascript:void 0">关联请假数据</a></td>\
            <td class="vacation-operation-save"><a class="vacation-addnewrow">增加</a>  <span type="text" calc_class="vacation-total-amount" class="vacationsummary_total_inputvalue" isparam="false" valuetype="4" tagctrl="text" tagname="listSUMcol_2_amount_'+_tagName+'"  tagtitle="申请合计" formdata="true" value="0"></span></td>\
                    </tr>\
                    </table>\
                    </div>\
                    </div>';

        return htmlContent;
    }

    // 加班控件
    $.fn.OvertimeSummary.GetInitHtml =  function (m,mode,option) {

        var _option = option || {};
        var _tagName = _option.tagName || '';
            //<tr><td>调休</td><td>2013-02-05 18:43:11</td><td>2013-02-06 18:43:11</td><td>18小时</td><td>18小时</td><td>显示详请</td><td><span class="control-vacation-tip-red">无可用假期</span></td><td><a href="javascript:void 0" class="example_bg_icon1 btn-delete">删除</a></td></tr>\
            var htmlContent = ' <div class="control-vacation-container">\
        <div class="control-vacation-header">\
        <div class="fw_left control-vacation-title">此次加班明细</div> <div class="fw_left">&nbsp;&nbsp;<a class="control-vacation-view-existvacation" href="javascript:void 0">查看全部可用假期</a></div>\
        <div class="fw_right"> <span class="control-vacation-unit">单位&nbsp;</span>\
        <div class="timeset fw_right m-l20">\
        <a class="a1 selected">小时</a><a class="a2">天</a>\
        </div>\
        </div>\
        </div>\
        <div class="fw_clear"></div>\
        <div class="control-vacation-body control-vacation-overtime">\
        <table class="control-vacation-detail  vacationsummary_overtime">\
        <thead><tr><th class="vacation-header-type">假期类型</th><th class="vacation-header-time">开始时间</th><th class="vacation-header-time">结束时间</th><th class="vacation-header-amount">可用数量</th><th class="vacation-header-applytime">加班时长</th><th class="vacation-header-available">审批后可用</th><th class="vacation-header-remark">备注</th><th class="vacation-header-operate">操作</th></tr></thead>\
        <tbody class="control-vacation-list">\
        </tbody>\
            <tbody class="control-vacation-total">\
            <tr><td colspan="3"></td><td class="vacation-row-amount" colspan="5"><span class="vacation-total-title">合计：</span><span class="vacation-datatype-amount vacation-sum-total-amount">0</span></td></tr>\
            </tbody>\
        </table>\
        <table class="control-vacation-operate">\
            <tr class="operatrow">\
        <td>加班类型</td><td><select id="vacation_item"></select></td><td >开始时间</td><td colspan="2" class="vacation-control-begin-container"><input type="text" class="vacation-begindate"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td><td>结束时间</td><td class="vacation-control-end-container" colspan="2"><input type="text"  class="vacation-enddate"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td>\
                    </tr>\
                    <tr class="operatrow">\
                    <td>加班时长</td><td><input type="text"  class="vacation-detail-duration" />&nbsp;<span class="vacation-control-vacationtype">小时</span></td><td class="vacation-operation-remark">备注</td><td colspan="4"><input type="text" class="vacation-detail-remark"  /></td><td  class="vacation-operation-save"><a class=" vacation-addnewrow">增加</a>    <span type="text" calc_class="vacation-total-amount" class="vacationsummary_total_inputvalue" isparam="false" valuetype="4" tagctrl="text" tagname="listSUMcol_4_applytime_'+_tagName+'"  tagtitle="申请合计" formdata="true" value="0"></span></td>\
                    </tr>\
                    </table>\
                    </div>\
                    </div>';

            return htmlContent;
        }

    $.fn.VacationSummary.GetInitHtml =  function (m,mode,option) {

        var _option = option || {};
        var _tagName = _option.tagName || '';
        var _controlVersion = _option.controlVersion || 2;
        if(_controlVersion == 2) {
            //<tr><td>调休</td><td>2013-02-05 18:43:11</td><td>2013-02-06 18:43:11</td><td>18小时</td><td>18小时</td><td>显示详请</td><td><span class="control-vacation-tip-red">无可用假期</span></td><td><a href="javascript:void 0" class="example_bg_icon1 btn-delete">删除</a></td></tr>\
            var htmlContent = ' <div class="control-vacation-container">\
        <div class="control-vacation-header">\
        <div class="fw_left control-vacation-title">此次请假明细</div> <div class="fw_left">&nbsp;&nbsp;<a class="control-vacation-view-existvacation" href="javascript:void 0">查看全部可用假期</a></div>\
        <div class="fw_right"> <span class="control-vacation-unit">单位&nbsp;</span>\
        <div class="timeset fw_right m-l20">\
        <a class="a1 selected">小时</a><a class="a2">天</a>\
        </div>\
        </div>\
        </div>\
        <div class="fw_clear"></div>\
        <div class="control-vacation-body control-vacation-summary">\
        <table class="control-vacation-detail vacationSummary vacationsummary_data">\
        <thead><tr><th class="vacation-header-type">假期类型</th><th class="vacation-header-time">开始时间</th><th class="vacation-header-time">结束时间</th><th class="vacation-header-amount">可用数量</th><th class="vacation-header-applytime">申请时长</th><th class="vacation-header-remark">备注</th><th class="vacation-header-available">可用</th><th class="vacation-header-operate">操作</th></tr></thead>\
        <tbody class="control-vacation-list">\
        </tbody>\
           <tbody class="control-vacation-total">\
            <tr><td colspan="3"></td><td class="vacation-row-amount" colspan="5"><span class="vacation-total-title">合计：</span><span class="vacation-datatype-amount vacation-sum-total-amount">0</span></td></tr>\
            </tbody>\
        </table>\
        <table class="control-vacation-operate">\
            <tr class="operatrow">\
        <td>请假类型</td><td><select id="vacation_item"></select></td><td>开始时间</td><td colspan="2" class="vacation-control-begin-container"><input type="text" class="vacation-begindate"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td><td>结束时间</td><td class="vacation-control-end-container" colspan="2"><input type="text"  class="vacation-enddate"  onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd  HH:mm\'})" /></td>\
                    </tr>\
                    <tr class="operatrow">\
                    <td>申请时长</td><td><input type="text"  class="vacation-detail-duration" />&nbsp;<span class="vacation-control-vacationtype">小时</span></td><td class="vacation-operation-remark">备注</td><td colspan="4"><input type="text" class="vacation-detail-remark"  /></td><td  class="vacation-operation-save"><a class="vacation-addnewrow">增加</a> <span type="text" calc_class="vacation-total-amount" class="vacationsummary_total_inputvalue" isparam="false" valuetype="4" tagctrl="text" tagname="listSUMcol_4_applytime_'+_tagName+'"  tagtitle="申请合计" formdata="true" value="0"></span></td>\
                    </tr>\
                    </table>\
                    </div>\
                    </div>';

            return htmlContent;
        }

        if(!mode)
        {
            mode=0;
        }
        var title="请假";
        var dsp="";
        if(mode==0)
        {
            title="加班";
            dsp=";display:none";
        }

        var htmlContent = '<div class="vacationSummary" isparam="false" mustinput="' + m + '" sourceid="">';
        htmlContent += '<div class="item_title" style="padding-left:10px;">可用假期数据(<span id="vacationsummary_unit">天</span>)</div>';
        htmlContent += '<table width="100%" class="datagrid vacationsummary_detailMsg" border="1" cellpadding="0" cellspacing="0"><tbody><tr><th style="width:auto">假期年</th><th style="width:auto">假期类型</th><th style="width:auto">假期总数</th><th style="width:auto">可用数量</th><th style="width:auto">申请数量</th><th style="width:auto'+dsp+'">预算控制</th></tr><tr><td colspan="6" align="center">暂无数据</td></tr></tbody></table>'
        htmlContent += '<div><div class="item_title" style="border-top:none;padding-left:10px;">此次'+title+'明细</div>';
        htmlContent += '<table width="100%" mode="'+mode+'" class="datagrid vacationsummary_data" border="1" cellpadding="0" cellspacing="0"><tbody><tr><th style="width:100px">假期类型</th><th style="width:110px">开始时间</th><th style="width:110px">结束时间</th><th style="width:80px">'+title+'<span id="vacationsummary_rowdata_unit">天</span>数</th><th style="width:auto">备注</th><th style="width:60px">操作</th></tr><tr><td colspan="6" align="center">暂无数据</td></tr></tbody></table>'
        htmlContent += '</div>';
        return htmlContent;
        /**/
    }



    //---选人信息控件-------

    $.fn.personInfo = function (options) { }


    //读取组件设计模式Html代码
    $.fn.personInfo.initHtml = function (checkedBoxes, isparam, mustinput) {
        //id生成
        var idCode = "personInfo_" + Math.random().toString().replace(".", "");
        //主htmlcode
        var htmlContent = '<div id="' + idCode + '" class="personInfo" checkednames="' + checkedBoxes.join(',') + '" isparam="' + isparam + '" mustinput="' + mustinput + '" sourceid="">'
                                + '<table class="user_info_sel"><tr><td style="width:80px;text-align:right;">姓名:</td><td style="width:200px;text-align:left;"><input type="text" id="' + idCode + '_input"/></td><td style="width:80px;text-align:right;">部门:</td><td class="orgSel" style="width:200px;text-align:left;"><input type="text" id="' + idCode + '_input_org"/></td></tr>'
                                + '</table>'
                                + '<div class="user_info_container">'
                                + '</div>'
                        + '</div>';
        return htmlContent;
    }


    //激活组件
    $.fn.personInfo.initActive = function (divID, userID, orgID) {
        //
        if (userID != undefined && orgID != undefined) {
            //添加部门
            var orgsel = KSNSelector({
                model: "1", element: "#" + divID + "_input_org", width: '200px',
                searchType: { "org": true, "user": false, "grp": false }
            });
            //var setData = [{ "type": "org", "id": orgID }];
            var setData = [{ "type": "org" }];
            orgsel.setAllselectedData(setData);
        }
        //信息容器
        var container = $("#" + divID + " .user_info_container");
        //var containerTab = $("#" + divID + " .user_info_sel");
        //选人控件
        KSNSelector({
            model: "1", element: "#" + divID + "_input", width: '200px',
            searchType: { "org": false, "user": true, "grp": false },
            loadItem: {
                items: (userID == undefined ? [i8_session.uid] : [userID]),
                loadedCallBack: function () {
                    //getData(userID == undefined ? i8_session.uid : userID);// alert();
                }
            },
            selectCallback: function (personID) {
               // getData(personID);
            },
            deleteCallback: function (data, data2) {
                $("#" + divID + " .orgSel .fw_ksninput_slted a").click();
                container.html("");
                container.hide();
            }
        });


    }
    /* == jquery mousewheel plugin == Version: 3.1.11, License: MIT License (MIT) */
    //!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;) a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.11", setup: function () { if (this.addEventListener) for (var c = h.length; c;) this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;) this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b)["offsetParent" in a.fn ? "offsetParent" : "parent"](); return c.length || (c = a("body")), parseInt(c.css("fontSize"), 10) }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) });
    /* == malihu jquery custom scrollbar plugin == Version: 3.0.4, License: MIT License (MIT) */
    //(function (b, a, c) { (function (d) { d(jQuery) }(function (j) { var g = "mCustomScrollbar", d = "mCS", m = ".mCustomScrollbar", h = { setWidth: false, setHeight: false, setTop: 0, setLeft: 0, axis: "y", scrollbarPosition: "inside", scrollInertia: 950, autoDraggerLength: true, autoHideScrollbar: false, autoExpandScrollbar: false, alwaysShowScrollbar: 0, snapAmount: null, snapOffset: 0, mouseWheel: { enable: true, scrollAmount: "auto", axis: "y", preventDefault: false, deltaFactor: "auto", normalizeDelta: false, invert: false, disableOver: ["select", "option", "keygen", "datalist", "textarea"] }, scrollButtons: { enable: false, scrollType: "stepless", scrollAmount: "auto" }, keyboard: { enable: true, scrollType: "stepless", scrollAmount: "auto" }, contentTouchScroll: 25, advanced: { autoExpandHorizontalScroll: false, autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']", updateOnContentResize: true, updateOnImageLoad: true, updateOnSelectorChange: false }, theme: "light", callbacks: { onScrollStart: false, onScroll: false, onTotalScroll: false, onTotalScrollBack: false, whileScrolling: false, onTotalScrollOffset: 0, onTotalScrollBackOffset: 0, alwaysTriggerOffsets: true, onOverflowY: false, onOverflowX: false, onOverflowYNone: false, onOverflowXNone: false }, live: false, liveSelector: null }, l = 0, o = {}, f = function (p) { if (o[p]) { clearTimeout(o[p]); i._delete.call(null, o[p]) } }, k = (b.attachEvent && !b.addEventListener) ? 1 : 0, n = false, e = { init: function (q) { var q = j.extend(true, {}, h, q), p = i._selector.call(this); if (q.live) { var s = q.liveSelector || this.selector || m, r = j(s); if (q.live === "off") { f(s); return } o[s] = setTimeout(function () { r.mCustomScrollbar(q); if (q.live === "once" && r.length) { f(s) } }, 500) } else { f(s) } q.setWidth = (q.set_width) ? q.set_width : q.setWidth; q.setHeight = (q.set_height) ? q.set_height : q.setHeight; q.axis = (q.horizontalScroll) ? "x" : i._findAxis.call(null, q.axis); q.scrollInertia = q.scrollInertia > 0 && q.scrollInertia < 17 ? 17 : q.scrollInertia; if (typeof q.mouseWheel !== "object" && q.mouseWheel == true) { q.mouseWheel = { enable: true, scrollAmount: "auto", axis: "y", preventDefault: false, deltaFactor: "auto", normalizeDelta: false, invert: false } } q.mouseWheel.scrollAmount = !q.mouseWheelPixels ? q.mouseWheel.scrollAmount : q.mouseWheelPixels; q.mouseWheel.normalizeDelta = !q.advanced.normalizeMouseWheelDelta ? q.mouseWheel.normalizeDelta : q.advanced.normalizeMouseWheelDelta; q.scrollButtons.scrollType = i._findScrollButtonsType.call(null, q.scrollButtons.scrollType); i._theme.call(null, q); return j(p).each(function () { var u = j(this); if (!u.data(d)) { u.data(d, { idx: ++l, opt: q, scrollRatio: { y: null, x: null }, overflowed: null, contentReset: { y: null, x: null }, bindEvents: false, tweenRunning: false, sequential: {}, langDir: u.css("direction"), cbOffsets: null, trigger: null }); var w = u.data(d).opt, v = u.data("mcs-axis"), t = u.data("mcs-scrollbar-position"), x = u.data("mcs-theme"); if (v) { w.axis = v } if (t) { w.scrollbarPosition = t } if (x) { w.theme = x; i._theme.call(null, w) } i._pluginMarkup.call(this); e.update.call(null, u) } }) }, update: function (q) { var p = q || i._selector.call(this); return j(p).each(function () { var t = j(this); if (t.data(d)) { var v = t.data(d), u = v.opt, r = j("#mCSB_" + v.idx + "_container"), s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")]; if (!r.length) { return } if (v.tweenRunning) { i._stop.call(null, t) } if (t.hasClass("mCS_disabled")) { t.removeClass("mCS_disabled") } if (t.hasClass("mCS_destroyed")) { t.removeClass("mCS_destroyed") } i._maxHeight.call(this); i._expandContentHorizontally.call(this); if (u.axis !== "y" && !u.advanced.autoExpandHorizontalScroll) { r.css("width", i._contentWidth(r.children())) } v.overflowed = i._overflowed.call(this); i._scrollbarVisibility.call(this); if (u.autoDraggerLength) { i._setDraggerLength.call(this) } i._scrollRatio.call(this); i._bindEvents.call(this); var w = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)]; if (u.axis !== "x") { if (!v.overflowed[0]) { i._resetContentPosition.call(this); if (u.axis === "y") { i._unbindEvents.call(this) } else { if (u.axis === "yx" && v.overflowed[1]) { i._scrollTo.call(this, t, w[1].toString(), { dir: "x", dur: 0, overwrite: "none" }) } } } else { if (s[0].height() > s[0].parent().height()) { i._resetContentPosition.call(this) } else { i._scrollTo.call(this, t, w[0].toString(), { dir: "y", dur: 0, overwrite: "none" }); v.contentReset.y = null } } } if (u.axis !== "y") { if (!v.overflowed[1]) { i._resetContentPosition.call(this); if (u.axis === "x") { i._unbindEvents.call(this) } else { if (u.axis === "yx" && v.overflowed[0]) { i._scrollTo.call(this, t, w[0].toString(), { dir: "y", dur: 0, overwrite: "none" }) } } } else { if (s[1].width() > s[1].parent().width()) { i._resetContentPosition.call(this) } else { i._scrollTo.call(this, t, w[1].toString(), { dir: "x", dur: 0, overwrite: "none" }); v.contentReset.x = null } } } i._autoUpdate.call(this) } }) }, scrollTo: function (r, q) { if (typeof r == "undefined" || r == null) { return } var p = i._selector.call(this); return j(p).each(function () { var u = j(this); if (u.data(d)) { var x = u.data(d), w = x.opt, v = { trigger: "external", scrollInertia: w.scrollInertia, scrollEasing: "mcsEaseInOut", moveDragger: false, timeout: 60, callbacks: true, onStart: true, onUpdate: true, onComplete: true }, s = j.extend(true, {}, v, q), y = i._arr.call(this, r), t = s.scrollInertia > 0 && s.scrollInertia < 17 ? 17 : s.scrollInertia; y[0] = i._to.call(this, y[0], "y"); y[1] = i._to.call(this, y[1], "x"); if (s.moveDragger) { y[0] *= x.scrollRatio.y; y[1] *= x.scrollRatio.x } s.dur = t; setTimeout(function () { if (y[0] !== null && typeof y[0] !== "undefined" && w.axis !== "x" && x.overflowed[0]) { s.dir = "y"; s.overwrite = "all"; i._scrollTo.call(this, u, y[0].toString(), s) } if (y[1] !== null && typeof y[1] !== "undefined" && w.axis !== "y" && x.overflowed[1]) { s.dir = "x"; s.overwrite = "none"; i._scrollTo.call(this, u, y[1].toString(), s) } }, s.timeout) } }) }, stop: function () { var p = i._selector.call(this); return j(p).each(function () { var q = j(this); if (q.data(d)) { i._stop.call(null, q) } }) }, disable: function (q) { var p = i._selector.call(this); return j(p).each(function () { var r = j(this); if (r.data(d)) { var t = r.data(d), s = t.opt; i._autoUpdate.call(this, "remove"); i._unbindEvents.call(this); if (q) { i._resetContentPosition.call(this) } i._scrollbarVisibility.call(this, true); r.addClass("mCS_disabled") } }) }, destroy: function () { var p = i._selector.call(this); return j(p).each(function () { var s = j(this); if (s.data(d)) { var u = s.data(d), t = u.opt, q = j("#mCSB_" + u.idx), r = j("#mCSB_" + u.idx + "_container"), v = j(".mCSB_" + u.idx + "_scrollbar"); if (t.live) { f(p) } i._autoUpdate.call(this, "remove"); i._unbindEvents.call(this); i._resetContentPosition.call(this); s.removeData(d); i._delete.call(null, this.mcs); v.remove(); q.replaceWith(r.contents()); s.removeClass(g + " _" + d + "_" + u.idx + " mCS-autoHide mCS-dir-rtl mCS_no_scrollbar mCS_disabled").addClass("mCS_destroyed") } }) } }, i = { _selector: function () { return (typeof j(this) !== "object" || j(this).length < 1) ? m : this }, _theme: function (s) { var r = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"], q = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"], p = ["minimal", "minimal-dark"], u = ["minimal", "minimal-dark"], t = ["minimal", "minimal-dark"]; s.autoDraggerLength = j.inArray(s.theme, r) > -1 ? false : s.autoDraggerLength; s.autoExpandScrollbar = j.inArray(s.theme, q) > -1 ? false : s.autoExpandScrollbar; s.scrollButtons.enable = j.inArray(s.theme, p) > -1 ? false : s.scrollButtons.enable; s.autoHideScrollbar = j.inArray(s.theme, u) > -1 ? true : s.autoHideScrollbar; s.scrollbarPosition = j.inArray(s.theme, t) > -1 ? "outside" : s.scrollbarPosition }, _findAxis: function (p) { return (p === "yx" || p === "xy" || p === "auto") ? "yx" : (p === "x" || p === "horizontal") ? "x" : "y" }, _findScrollButtonsType: function (p) { return (p === "stepped" || p === "pixels" || p === "step" || p === "click") ? "stepped" : "stepless" }, _pluginMarkup: function () { var y = j(this), x = y.data(d), r = x.opt, t = r.autoExpandScrollbar ? " mCSB_scrollTools_onDrag_expand" : "", B = ["<div id='mCSB_" + x.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + x.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_vertical" + t + "'><div class='mCSB_draggerContainer'><div id='mCSB_" + x.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + x.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + x.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_horizontal" + t + "'><div class='mCSB_draggerContainer'><div id='mCSB_" + x.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"], u = r.axis === "yx" ? "mCSB_vertical_horizontal" : r.axis === "x" ? "mCSB_horizontal" : "mCSB_vertical", w = r.axis === "yx" ? B[0] + B[1] : r.axis === "x" ? B[1] : B[0], v = r.axis === "yx" ? "<div id='mCSB_" + x.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "", s = r.autoHideScrollbar ? " mCS-autoHide" : "", p = (r.axis !== "x" && x.langDir === "rtl") ? " mCS-dir-rtl" : ""; if (r.setWidth) { y.css("width", r.setWidth) } if (r.setHeight) { y.css("height", r.setHeight) } r.setLeft = (r.axis !== "y" && x.langDir === "rtl") ? "989999px" : r.setLeft; y.addClass(g + " _" + d + "_" + x.idx + s + p).wrapInner("<div id='mCSB_" + x.idx + "' class='mCustomScrollBox mCS-" + r.theme + " " + u + "'><div id='mCSB_" + x.idx + "_container' class='mCSB_container' style='position:relative; top:" + r.setTop + "; left:" + r.setLeft + ";' dir=" + x.langDir + " /></div>"); var q = j("#mCSB_" + x.idx), z = j("#mCSB_" + x.idx + "_container"); if (r.axis !== "y" && !r.advanced.autoExpandHorizontalScroll) { z.css("width", i._contentWidth(z.children())) } if (r.scrollbarPosition === "outside") { if (y.css("position") === "static") { y.css("position", "relative") } y.css("overflow", "visible"); q.addClass("mCSB_outside").after(w) } else { q.addClass("mCSB_inside").append(w); z.wrap(v) } i._scrollButtons.call(this); var A = [j("#mCSB_" + x.idx + "_dragger_vertical"), j("#mCSB_" + x.idx + "_dragger_horizontal")]; A[0].css("min-height", A[0].height()); A[1].css("min-width", A[1].width()) }, _contentWidth: function (p) { return Math.max.apply(Math, p.map(function () { return j(this).outerWidth(true) }).get()) }, _expandContentHorizontally: function () { var q = j(this), s = q.data(d), r = s.opt, p = j("#mCSB_" + s.idx + "_container"); if (r.advanced.autoExpandHorizontalScroll && r.axis !== "y") { p.css({ position: "absolute", width: "auto" }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({ width: (Math.ceil(p[0].getBoundingClientRect().right + 0.4) - Math.floor(p[0].getBoundingClientRect().left)), position: "relative" }).unwrap() } }, _scrollButtons: function () { var s = j(this), u = s.data(d), t = u.opt, q = j(".mCSB_" + u.idx + "_scrollbar:first"), r = ["<a href='#' class='mCSB_buttonUp' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonDown' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonLeft' oncontextmenu='return false;' />", "<a href='#' class='mCSB_buttonRight' oncontextmenu='return false;' />"], p = [(t.axis === "x" ? r[2] : r[0]), (t.axis === "x" ? r[3] : r[1]), r[2], r[3]]; if (t.scrollButtons.enable) { q.prepend(p[0]).append(p[1]).next(".mCSB_scrollTools").prepend(p[2]).append(p[3]) } }, _maxHeight: function () { var t = j(this), w = t.data(d), v = w.opt, r = j("#mCSB_" + w.idx), q = t.css("max-height"), s = q.indexOf("%") !== -1, p = t.css("box-sizing"); if (q !== "none") { var u = s ? t.parent().height() * parseInt(q) / 100 : parseInt(q); if (p === "border-box") { u -= ((t.innerHeight() - t.height()) + (t.outerHeight() - t.innerHeight())) } r.css("max-height", Math.round(u)) } }, _setDraggerLength: function () { var u = j(this), s = u.data(d), p = j("#mCSB_" + s.idx), v = j("#mCSB_" + s.idx + "_container"), y = [j("#mCSB_" + s.idx + "_dragger_vertical"), j("#mCSB_" + s.idx + "_dragger_horizontal")], t = [p.height() / v.outerHeight(false), p.width() / v.outerWidth(false)], q = [parseInt(y[0].css("min-height")), Math.round(t[0] * y[0].parent().height()), parseInt(y[1].css("min-width")), Math.round(t[1] * y[1].parent().width())], r = k && (q[1] < q[0]) ? q[0] : q[1], x = k && (q[3] < q[2]) ? q[2] : q[3]; y[0].css({ height: r, "max-height": (y[0].parent().height() - 10) }).find(".mCSB_dragger_bar").css({ "line-height": q[0] + "px" }); y[1].css({ width: x, "max-width": (y[1].parent().width() - 10) }) }, _scrollRatio: function () { var t = j(this), v = t.data(d), q = j("#mCSB_" + v.idx), r = j("#mCSB_" + v.idx + "_container"), s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")], u = [r.outerHeight(false) - q.height(), r.outerWidth(false) - q.width()], p = [u[0] / (s[0].parent().height() - s[0].height()), u[1] / (s[1].parent().width() - s[1].width())]; v.scrollRatio = { y: p[0], x: p[1] } }, _onDragClasses: function (r, t, q) { var s = q ? "mCSB_dragger_onDrag_expanded" : "", p = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag"], u = r.closest(".mCSB_scrollTools"); if (t === "active") { r.toggleClass(p[0] + " " + s); u.toggleClass(p[1]); r[0]._draggable = r[0]._draggable ? 0 : 1 } else { if (!r[0]._draggable) { if (t === "hide") { r.removeClass(p[0]); u.removeClass(p[1]) } else { r.addClass(p[0]); u.addClass(p[1]) } } } }, _overflowed: function () { var t = j(this), u = t.data(d), q = j("#mCSB_" + u.idx), s = j("#mCSB_" + u.idx + "_container"), r = u.overflowed == null ? s.height() : s.outerHeight(false), p = u.overflowed == null ? s.width() : s.outerWidth(false); return [r > q.height(), p > q.width()] }, _resetContentPosition: function () { var t = j(this), v = t.data(d), u = v.opt, q = j("#mCSB_" + v.idx), r = j("#mCSB_" + v.idx + "_container"), s = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")]; i._stop(t); if ((u.axis !== "x" && !v.overflowed[0]) || (u.axis === "y" && v.overflowed[0])) { s[0].add(r).css("top", 0); i._scrollTo(t, "_resetY") } if ((u.axis !== "y" && !v.overflowed[1]) || (u.axis === "x" && v.overflowed[1])) { var p = dx = 0; if (v.langDir === "rtl") { p = q.width() - r.outerWidth(false); dx = Math.abs(p / v.scrollRatio.x) } r.css("left", p); s[1].css("left", dx); i._scrollTo(t, "_resetX") } }, _bindEvents: function () { var r = j(this), t = r.data(d), s = t.opt; if (!t.bindEvents) { i._draggable.call(this); if (s.contentTouchScroll) { i._contentDraggable.call(this) } if (s.mouseWheel.enable) { function q() { p = setTimeout(function () { if (!j.event.special.mousewheel) { q() } else { clearTimeout(p); i._mousewheel.call(r[0]) } }, 1000) } var p; q() } i._draggerRail.call(this); i._wrapperScroll.call(this); if (s.advanced.autoScrollOnFocus) { i._focus.call(this) } if (s.scrollButtons.enable) { i._buttons.call(this) } if (s.keyboard.enable) { i._keyboard.call(this) } t.bindEvents = true } }, _unbindEvents: function () { var s = j(this), t = s.data(d), p = d + "_" + t.idx, u = ".mCSB_" + t.idx + "_scrollbar", r = j("#mCSB_" + t.idx + ",#mCSB_" + t.idx + "_container,#mCSB_" + t.idx + "_container_wrapper," + u + " .mCSB_draggerContainer,#mCSB_" + t.idx + "_dragger_vertical,#mCSB_" + t.idx + "_dragger_horizontal," + u + ">a"), q = j("#mCSB_" + t.idx + "_container"); if (t.bindEvents) { j(a).unbind("." + p); r.each(function () { j(this).unbind("." + p) }); clearTimeout(s[0]._focusTimeout); i._delete.call(null, s[0]._focusTimeout); clearTimeout(t.sequential.step); i._delete.call(null, t.sequential.step); clearTimeout(q[0].onCompleteTimeout); i._delete.call(null, q[0].onCompleteTimeout); t.bindEvents = false } }, _scrollbarVisibility: function (q) { var t = j(this), v = t.data(d), u = v.opt, p = j("#mCSB_" + v.idx + "_container_wrapper"), r = p.length ? p : j("#mCSB_" + v.idx + "_container"), w = [j("#mCSB_" + v.idx + "_scrollbar_vertical"), j("#mCSB_" + v.idx + "_scrollbar_horizontal")], s = [w[0].find(".mCSB_dragger"), w[1].find(".mCSB_dragger")]; if (u.axis !== "x") { if (v.overflowed[0] && !q) { w[0].add(s[0]).add(w[0].children("a")).css("display", "block"); r.removeClass("mCS_no_scrollbar_y mCS_y_hidden") } else { if (u.alwaysShowScrollbar) { if (u.alwaysShowScrollbar !== 2) { s[0].add(w[0].children("a")).css("display", "none") } r.removeClass("mCS_y_hidden") } else { w[0].css("display", "none"); r.addClass("mCS_y_hidden") } r.addClass("mCS_no_scrollbar_y") } } if (u.axis !== "y") { if (v.overflowed[1] && !q) { w[1].add(s[1]).add(w[1].children("a")).css("display", "block"); r.removeClass("mCS_no_scrollbar_x mCS_x_hidden") } else { if (u.alwaysShowScrollbar) { if (u.alwaysShowScrollbar !== 2) { s[1].add(w[1].children("a")).css("display", "none") } r.removeClass("mCS_x_hidden") } else { w[1].css("display", "none"); r.addClass("mCS_x_hidden") } r.addClass("mCS_no_scrollbar_x") } } if (!v.overflowed[0] && !v.overflowed[1]) { t.addClass("mCS_no_scrollbar") } else { t.removeClass("mCS_no_scrollbar") } }, _coordinates: function (q) { var p = q.type; switch (p) { case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp": return [q.originalEvent.pageY, q.originalEvent.pageX]; break; case "touchstart": case "touchmove": case "touchend": var r = q.originalEvent.touches[0] || q.originalEvent.changedTouches[0]; return [r.pageY, r.pageX]; break; default: return [q.pageY, q.pageX] } }, _draggable: function () { var u = j(this), s = u.data(d), p = s.opt, r = d + "_" + s.idx, t = ["mCSB_" + s.idx + "_dragger_vertical", "mCSB_" + s.idx + "_dragger_horizontal"], v = j("#mCSB_" + s.idx + "_container"), w = j("#" + t[0] + ",#" + t[1]), A, y, z; w.bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r, function (E) { E.stopImmediatePropagation(); E.preventDefault(); if (!i._mouseBtnLeft(E)) { return } n = true; if (k) { a.onselectstart = function () { return false } } x(false); i._stop(u); A = j(this); var F = A.offset(), G = i._coordinates(E)[0] - F.top, B = i._coordinates(E)[1] - F.left, D = A.height() + F.top, C = A.width() + F.left; if (G < D && G > 0 && B < C && B > 0) { y = G; z = B } i._onDragClasses(A, "active", p.autoExpandScrollbar) }).bind("touchmove." + r, function (C) { C.stopImmediatePropagation(); C.preventDefault(); var D = A.offset(), E = i._coordinates(C)[0] - D.top, B = i._coordinates(C)[1] - D.left; q(y, z, E, B) }); j(a).bind("mousemove." + r + " pointermove." + r + " MSPointerMove." + r, function (C) { if (A) { var D = A.offset(), E = i._coordinates(C)[0] - D.top, B = i._coordinates(C)[1] - D.left; if (y === E) { return } q(y, z, E, B) } }).add(w).bind("mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r, function (B) { if (A) { i._onDragClasses(A, "active", p.autoExpandScrollbar); A = null } n = false; if (k) { a.onselectstart = null } x(true) }); function x(B) { var C = v.find("iframe"); if (!C.length) { return } var D = !B ? "none" : "auto"; C.css("pointer-events", D) } function q(D, E, G, B) { v[0].idleTimer = p.scrollInertia < 233 ? 250 : 0; if (A.attr("id") === t[1]) { var C = "x", F = ((A[0].offsetLeft - E) + B) * s.scrollRatio.x } else { var C = "y", F = ((A[0].offsetTop - D) + G) * s.scrollRatio.y } i._scrollTo(u, F.toString(), { dir: C, drag: true }) } }, _contentDraggable: function () { var y = j(this), K = y.data(d), I = K.opt, F = d + "_" + K.idx, v = j("#mCSB_" + K.idx), z = j("#mCSB_" + K.idx + "_container"), w = [j("#mCSB_" + K.idx + "_dragger_vertical"), j("#mCSB_" + K.idx + "_dragger_horizontal")], E, G, L, M, C = [], D = [], H, A, u, t, J, x, r = 0, q, s = I.axis === "yx" ? "none" : "all"; z.bind("touchstart." + F + " pointerdown." + F + " MSPointerDown." + F, function (N) { if (!i._pointerTouch(N) || n) { return } var O = z.offset(); E = i._coordinates(N)[0] - O.top; G = i._coordinates(N)[1] - O.left }).bind("touchmove." + F + " pointermove." + F + " MSPointerMove." + F, function (Q) { if (!i._pointerTouch(Q) || n) { return } Q.stopImmediatePropagation(); A = i._getTime(); var P = v.offset(), S = i._coordinates(Q)[0] - P.top, U = i._coordinates(Q)[1] - P.left, R = "mcsLinearOut"; C.push(S); D.push(U); if (K.overflowed[0]) { var O = w[0].parent().height() - w[0].height(), T = ((E - S) > 0 && (S - E) > -(O * K.scrollRatio.y)) } if (K.overflowed[1]) { var N = w[1].parent().width() - w[1].width(), V = ((G - U) > 0 && (U - G) > -(N * K.scrollRatio.x)) } if (T || V) { Q.preventDefault() } x = I.axis === "yx" ? [(E - S), (G - U)] : I.axis === "x" ? [null, (G - U)] : [(E - S), null]; z[0].idleTimer = 250; if (K.overflowed[0]) { B(x[0], r, R, "y", "all", true) } if (K.overflowed[1]) { B(x[1], r, R, "x", s, true) } }); v.bind("touchstart." + F + " pointerdown." + F + " MSPointerDown." + F, function (N) { if (!i._pointerTouch(N) || n) { return } N.stopImmediatePropagation(); i._stop(y); H = i._getTime(); var O = v.offset(); L = i._coordinates(N)[0] - O.top; M = i._coordinates(N)[1] - O.left; C = []; D = [] }).bind("touchend." + F + " pointerup." + F + " MSPointerUp." + F, function (P) { if (!i._pointerTouch(P) || n) { return } P.stopImmediatePropagation(); u = i._getTime(); var N = v.offset(), T = i._coordinates(P)[0] - N.top, V = i._coordinates(P)[1] - N.left; if ((u - A) > 30) { return } J = 1000 / (u - H); var Q = "mcsEaseOut", R = J < 2.5, W = R ? [C[C.length - 2], D[D.length - 2]] : [0, 0]; t = R ? [(T - W[0]), (V - W[1])] : [T - L, V - M]; var O = [Math.abs(t[0]), Math.abs(t[1])]; J = R ? [Math.abs(t[0] / 4), Math.abs(t[1] / 4)] : [J, J]; var U = [Math.abs(z[0].offsetTop) - (t[0] * p((O[0] / J[0]), J[0])), Math.abs(z[0].offsetLeft) - (t[1] * p((O[1] / J[1]), J[1]))]; x = I.axis === "yx" ? [U[0], U[1]] : I.axis === "x" ? [null, U[1]] : [U[0], null]; q = [(O[0] * 4) + I.scrollInertia, (O[1] * 4) + I.scrollInertia]; var S = parseInt(I.contentTouchScroll) || 0; x[0] = O[0] > S ? x[0] : 0; x[1] = O[1] > S ? x[1] : 0; if (K.overflowed[0]) { B(x[0], q[0], Q, "y", s, false) } if (K.overflowed[1]) { B(x[1], q[1], Q, "x", s, false) } }); function p(P, N) { var O = [N * 1.5, N * 2, N / 1.5, N / 2]; if (P > 90) { return N > 4 ? O[0] : O[3] } else { if (P > 60) { return N > 3 ? O[3] : O[2] } else { if (P > 30) { return N > 8 ? O[1] : N > 6 ? O[0] : N > 4 ? N : O[2] } else { return N > 8 ? N : O[3] } } } } function B(P, R, S, O, N, Q) { if (!P) { return } i._scrollTo(y, P.toString(), { dur: R, scrollEasing: S, dir: O, overwrite: N, drag: Q }) } }, _mousewheel: function () { var w = j(this), v = w.data(d); if (v) { var p = v.opt, s = d + "_" + v.idx, q = j("#mCSB_" + v.idx), x = [j("#mCSB_" + v.idx + "_dragger_vertical"), j("#mCSB_" + v.idx + "_dragger_horizontal")], t = j("#mCSB_" + v.idx + "_container").find("iframe"), r = q; if (t.length) { t.each(function () { var y = this; if (u(y)) { r = r.add(j(y).contents().find("body")) } }) } r.bind("mousewheel." + s, function (C, G) { i._stop(w); if (i._disableMousewheel(w, C.target)) { return } var E = p.mouseWheel.deltaFactor !== "auto" ? parseInt(p.mouseWheel.deltaFactor) : (k && C.deltaFactor < 100) ? 100 : C.deltaFactor || 100; if (p.axis === "x" || p.mouseWheel.axis === "x") { var z = "x", F = [Math.round(E * v.scrollRatio.x), parseInt(p.mouseWheel.scrollAmount)], B = p.mouseWheel.scrollAmount !== "auto" ? F[1] : F[0] >= q.width() ? q.width() * 0.9 : F[0], H = Math.abs(j("#mCSB_" + v.idx + "_container")[0].offsetLeft), D = x[1][0].offsetLeft, A = x[1].parent().width() - x[1].width(), y = C.deltaX || C.deltaY || G } else { var z = "y", F = [Math.round(E * v.scrollRatio.y), parseInt(p.mouseWheel.scrollAmount)], B = p.mouseWheel.scrollAmount !== "auto" ? F[1] : F[0] >= q.height() ? q.height() * 0.9 : F[0], H = Math.abs(j("#mCSB_" + v.idx + "_container")[0].offsetTop), D = x[0][0].offsetTop, A = x[0].parent().height() - x[0].height(), y = C.deltaY || G } if ((z === "y" && !v.overflowed[0]) || (z === "x" && !v.overflowed[1])) { return } if (p.mouseWheel.invert) { y = -y } if (p.mouseWheel.normalizeDelta) { y = y < 0 ? -1 : 1 } if ((y > 0 && D !== 0) || (y < 0 && D !== A) || p.mouseWheel.preventDefault) { C.stopImmediatePropagation(); C.preventDefault() } i._scrollTo(w, (H - (y * B)).toString(), { dir: z }) }) } function u(z) { var y = null; try { var B = z.contentDocument || z.contentWindow.document; y = B.body.innerHTML } catch (A) { } return (y !== null) } }, _disableMousewheel: function (r, t) { var p = t.nodeName.toLowerCase(), q = r.data(d).opt.mouseWheel.disableOver, s = ["select", "textarea"]; return j.inArray(p, q) > -1 && !(j.inArray(p, s) > -1 && !j(t).is(":focus")) }, _draggerRail: function () { var s = j(this), t = s.data(d), q = d + "_" + t.idx, r = j("#mCSB_" + t.idx + "_container"), u = r.parent(), p = j(".mCSB_" + t.idx + "_scrollbar .mCSB_draggerContainer"); p.bind("touchstart." + q + " pointerdown." + q + " MSPointerDown." + q, function (v) { n = true }).bind("touchend." + q + " pointerup." + q + " MSPointerUp." + q, function (v) { n = false }).bind("click." + q, function (z) { if (j(z.target).hasClass("mCSB_draggerContainer") || j(z.target).hasClass("mCSB_draggerRail")) { i._stop(s); var w = j(this), y = w.find(".mCSB_dragger"); if (w.parent(".mCSB_scrollTools_horizontal").length > 0) { if (!t.overflowed[1]) { return } var v = "x", x = z.pageX > y.offset().left ? -1 : 1, A = Math.abs(r[0].offsetLeft) - (x * (u.width() * 0.9)) } else { if (!t.overflowed[0]) { return } var v = "y", x = z.pageY > y.offset().top ? -1 : 1, A = Math.abs(r[0].offsetTop) - (x * (u.height() * 0.9)) } i._scrollTo(s, A.toString(), { dir: v, scrollEasing: "mcsEaseInOut" }) } }) }, _focus: function () { var r = j(this), t = r.data(d), s = t.opt, p = d + "_" + t.idx, q = j("#mCSB_" + t.idx + "_container"), u = q.parent(); q.bind("focusin." + p, function (x) { var w = j(a.activeElement), y = q.find(".mCustomScrollBox").length, v = 0; if (!w.is(s.advanced.autoScrollOnFocus)) { return } i._stop(r); clearTimeout(r[0]._focusTimeout); r[0]._focusTimer = y ? (v + 17) * y : 0; r[0]._focusTimeout = setTimeout(function () { var C = [w.offset().top - q.offset().top, w.offset().left - q.offset().left], B = [q[0].offsetTop, q[0].offsetLeft], z = [(B[0] + C[0] >= 0 && B[0] + C[0] < u.height() - w.outerHeight(false)), (B[1] + C[1] >= 0 && B[0] + C[1] < u.width() - w.outerWidth(false))], A = (s.axis === "yx" && !z[0] && !z[1]) ? "none" : "all"; if (s.axis !== "x" && !z[0]) { i._scrollTo(r, C[0].toString(), { dir: "y", scrollEasing: "mcsEaseInOut", overwrite: A, dur: v }) } if (s.axis !== "y" && !z[1]) { i._scrollTo(r, C[1].toString(), { dir: "x", scrollEasing: "mcsEaseInOut", overwrite: A, dur: v }) } }, r[0]._focusTimer) }) }, _wrapperScroll: function () { var q = j(this), r = q.data(d), p = d + "_" + r.idx, s = j("#mCSB_" + r.idx + "_container").parent(); s.bind("scroll." + p, function (t) { s.scrollTop(0).scrollLeft(0) }) }, _buttons: function () { var u = j(this), w = u.data(d), v = w.opt, p = w.sequential, r = d + "_" + w.idx, t = j("#mCSB_" + w.idx + "_container"), s = ".mCSB_" + w.idx + "_scrollbar", q = j(s + ">a"); q.bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function (z) { z.preventDefault(); if (!i._mouseBtnLeft(z)) { return } var y = j(this).attr("class"); p.type = v.scrollButtons.scrollType; switch (z.type) { case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown": if (p.type === "stepped") { return } n = true; w.tweenRunning = false; x("on", y); break; case "mouseup": case "touchend": case "pointerup": case "MSPointerUp": case "mouseout": case "pointerout": case "MSPointerOut": if (p.type === "stepped") { return } n = false; if (p.dir) { x("off", y) } break; case "click": if (p.type !== "stepped" || w.tweenRunning) { return } x("on", y); break } function x(A, B) { p.scrollAmount = v.snapAmount || v.scrollButtons.scrollAmount; i._sequentialScroll.call(this, u, A, B) } }) }, _keyboard: function () { var u = j(this), t = u.data(d), q = t.opt, x = t.sequential, s = d + "_" + t.idx, r = j("#mCSB_" + t.idx), w = j("#mCSB_" + t.idx + "_container"), p = w.parent(), v = "input,textarea,select,datalist,keygen,[contenteditable='true']"; r.attr("tabindex", "0").bind("blur." + s + " keydown." + s + " keyup." + s, function (D) { switch (D.type) { case "blur": if (t.tweenRunning && x.dir) { y("off", null) } break; case "keydown": case "keyup": var A = D.keyCode ? D.keyCode : D.which, B = "on"; if ((q.axis !== "x" && (A === 38 || A === 40)) || (q.axis !== "y" && (A === 37 || A === 39))) { if (((A === 38 || A === 40) && !t.overflowed[0]) || ((A === 37 || A === 39) && !t.overflowed[1])) { return } if (D.type === "keyup") { B = "off" } if (!j(a.activeElement).is(v)) { D.preventDefault(); D.stopImmediatePropagation(); y(B, A) } } else { if (A === 33 || A === 34) { if (t.overflowed[0] || t.overflowed[1]) { D.preventDefault(); D.stopImmediatePropagation() } if (D.type === "keyup") { i._stop(u); var C = A === 34 ? -1 : 1; if (q.axis === "x" || (q.axis === "yx" && t.overflowed[1] && !t.overflowed[0])) { var z = "x", E = Math.abs(w[0].offsetLeft) - (C * (p.width() * 0.9)) } else { var z = "y", E = Math.abs(w[0].offsetTop) - (C * (p.height() * 0.9)) } i._scrollTo(u, E.toString(), { dir: z, scrollEasing: "mcsEaseInOut" }) } } else { if (A === 35 || A === 36) { if (!j(a.activeElement).is(v)) { if (t.overflowed[0] || t.overflowed[1]) { D.preventDefault(); D.stopImmediatePropagation() } if (D.type === "keyup") { if (q.axis === "x" || (q.axis === "yx" && t.overflowed[1] && !t.overflowed[0])) { var z = "x", E = A === 35 ? Math.abs(p.width() - w.outerWidth(false)) : 0 } else { var z = "y", E = A === 35 ? Math.abs(p.height() - w.outerHeight(false)) : 0 } i._scrollTo(u, E.toString(), { dir: z, scrollEasing: "mcsEaseInOut" }) } } } } } break } function y(F, G) { x.type = q.keyboard.scrollType; x.scrollAmount = q.snapAmount || q.keyboard.scrollAmount; if (x.type === "stepped" && t.tweenRunning) { return } i._sequentialScroll.call(this, u, F, G) } }) }, _sequentialScroll: function (r, u, s) { var w = r.data(d), q = w.opt, y = w.sequential, x = j("#mCSB_" + w.idx + "_container"), p = y.type === "stepped" ? true : false; switch (u) { case "on": y.dir = [(s === "mCSB_buttonRight" || s === "mCSB_buttonLeft" || s === 39 || s === 37 ? "x" : "y"), (s === "mCSB_buttonUp" || s === "mCSB_buttonLeft" || s === 38 || s === 37 ? -1 : 1)]; i._stop(r); if (i._isNumeric(s) && y.type === "stepped") { return } t(p); break; case "off": v(); if (p || (w.tweenRunning && y.dir)) { t(true) } break } function t(z) { var F = y.type !== "stepped", J = !z ? 1000 / 60 : F ? q.scrollInertia / 1.5 : q.scrollInertia, B = !z ? 2.5 : F ? 7.5 : 40, I = [Math.abs(x[0].offsetTop), Math.abs(x[0].offsetLeft)], E = [w.scrollRatio.y > 10 ? 10 : w.scrollRatio.y, w.scrollRatio.x > 10 ? 10 : w.scrollRatio.x], C = y.dir[0] === "x" ? I[1] + (y.dir[1] * (E[1] * B)) : I[0] + (y.dir[1] * (E[0] * B)), H = y.dir[0] === "x" ? I[1] + (y.dir[1] * parseInt(y.scrollAmount)) : I[0] + (y.dir[1] * parseInt(y.scrollAmount)), G = y.scrollAmount !== "auto" ? H : C, D = !z ? "mcsLinear" : F ? "mcsLinearOut" : "mcsEaseInOut", A = !z ? false : true; if (z && J < 17) { G = y.dir[0] === "x" ? I[1] : I[0] } i._scrollTo(r, G.toString(), { dir: y.dir[0], scrollEasing: D, dur: J, onComplete: A }); if (z) { y.dir = false; return } clearTimeout(y.step); y.step = setTimeout(function () { t() }, J) } function v() { clearTimeout(y.step); i._stop(r) } }, _arr: function (r) { var q = j(this).data(d).opt, p = []; if (typeof r === "function") { r = r() } if (!(r instanceof Array)) { p[0] = r.y ? r.y : r.x || q.axis === "x" ? null : r; p[1] = r.x ? r.x : r.y || q.axis === "y" ? null : r } else { p = r.length > 1 ? [r[0], r[1]] : q.axis === "x" ? [null, r[0]] : [r[0], null] } if (typeof p[0] === "function") { p[0] = p[0]() } if (typeof p[1] === "function") { p[1] = p[1]() } return p }, _to: function (v, w) { if (v == null || typeof v == "undefined") { return } var C = j(this), B = C.data(d), u = B.opt, D = j("#mCSB_" + B.idx + "_container"), r = D.parent(), F = typeof v; if (!w) { w = u.axis === "x" ? "x" : "y" } var q = w === "x" ? D.outerWidth(false) : D.outerHeight(false), x = w === "x" ? D.offset().left : D.offset().top, E = w === "x" ? D[0].offsetLeft : D[0].offsetTop, z = w === "x" ? "left" : "top"; switch (F) { case "function": return v(); break; case "object": if (v.nodeType) { var A = w === "x" ? j(v).offset().left : j(v).offset().top } else { if (v.jquery) { if (!v.length) { return } var A = w === "x" ? v.offset().left : v.offset().top } } return A - x; break; case "string": case "number": if (i._isNumeric.call(null, v)) { return Math.abs(v) } else { if (v.indexOf("%") !== -1) { return Math.abs(q * parseInt(v) / 100) } else { if (v.indexOf("-=") !== -1) { return Math.abs(E - parseInt(v.split("-=")[1])) } else { if (v.indexOf("+=") !== -1) { var s = (E + parseInt(v.split("+=")[1])); return s >= 0 ? 0 : Math.abs(s) } else { if (v.indexOf("px") !== -1 && i._isNumeric.call(null, v.split("px")[0])) { return Math.abs(v.split("px")[0]) } else { if (v === "top" || v === "left") { return 0 } else { if (v === "bottom") { return Math.abs(r.height() - D.outerHeight(false)) } else { if (v === "right") { return Math.abs(r.width() - D.outerWidth(false)) } else { if (v === "first" || v === "last") { var y = D.find(":" + v), A = w === "x" ? j(y).offset().left : j(y).offset().top; return A - x } else { if (j(v).length) { var A = w === "x" ? j(v).offset().left : j(v).offset().top; return A - x } else { D.css(z, v); e.update.call(null, C[0]); return } } } } } } } } } } break } }, _autoUpdate: function (q) { var t = j(this), F = t.data(d), z = F.opt, v = j("#mCSB_" + F.idx + "_container"); if (q) { clearTimeout(v[0].autoUpdate); i._delete.call(null, v[0].autoUpdate); return } var s = v.parent(), p = [j("#mCSB_" + F.idx + "_scrollbar_vertical"), j("#mCSB_" + F.idx + "_scrollbar_horizontal")], D = function () { return [p[0].is(":visible") ? p[0].outerHeight(true) : 0, p[1].is(":visible") ? p[1].outerWidth(true) : 0] }, E = y(), x, u = [v.outerHeight(false), v.outerWidth(false), s.height(), s.width(), D()[0], D()[1]], H, B = G(), w; C(); function C() { clearTimeout(v[0].autoUpdate); v[0].autoUpdate = setTimeout(function () { if (z.advanced.updateOnSelectorChange) { x = y(); if (x !== E) { r(); E = x; return } } if (z.advanced.updateOnContentResize) { H = [v.outerHeight(false), v.outerWidth(false), s.height(), s.width(), D()[0], D()[1]]; if (H[0] !== u[0] || H[1] !== u[1] || H[2] !== u[2] || H[3] !== u[3] || H[4] !== u[4] || H[5] !== u[5]) { r(); u = H } } if (z.advanced.updateOnImageLoad) { w = G(); if (w !== B) { v.find("img").each(function () { A(this.src) }); B = w } } if (z.advanced.updateOnSelectorChange || z.advanced.updateOnContentResize || z.advanced.updateOnImageLoad) { C() } }, 60) } function G() { var I = 0; if (z.advanced.updateOnImageLoad) { I = v.find("img").length } return I } function A(L) { var I = new Image(); function K(M, N) { return function () { return N.apply(M, arguments) } } function J() { this.onload = null; r() } I.onload = K(I, J); I.src = L } function y() { if (z.advanced.updateOnSelectorChange === true) { z.advanced.updateOnSelectorChange = "*" } var I = 0, J = v.find(z.advanced.updateOnSelectorChange); if (z.advanced.updateOnSelectorChange && J.length > 0) { J.each(function () { I += j(this).height() + j(this).width() }) } return I } function r() { clearTimeout(v[0].autoUpdate); e.update.call(null, t[0]) } }, _snapAmount: function (r, p, q) { return (Math.round(r / p) * p - q) }, _stop: function (p) { var r = p.data(d), q = j("#mCSB_" + r.idx + "_container,#mCSB_" + r.idx + "_container_wrapper,#mCSB_" + r.idx + "_dragger_vertical,#mCSB_" + r.idx + "_dragger_horizontal"); q.each(function () { i._stopTween.call(this) }) }, _scrollTo: function (q, s, u) { var I = q.data(d), E = I.opt, D = { trigger: "internal", dir: "y", scrollEasing: "mcsEaseOut", drag: false, dur: E.scrollInertia, overwrite: "all", callbacks: true, onStart: true, onUpdate: true, onComplete: true }, u = j.extend(D, u), G = [u.dur, (u.drag ? 0 : u.dur)], v = j("#mCSB_" + I.idx), B = j("#mCSB_" + I.idx + "_container"), K = E.callbacks.onTotalScrollOffset ? i._arr.call(q, E.callbacks.onTotalScrollOffset) : [0, 0], p = E.callbacks.onTotalScrollBackOffset ? i._arr.call(q, E.callbacks.onTotalScrollBackOffset) : [0, 0]; I.trigger = u.trigger; if (s === "_resetY" && !I.contentReset.y) { if (t("onOverflowYNone")) { E.callbacks.onOverflowYNone.call(q[0]) } I.contentReset.y = 1 } if (s === "_resetX" && !I.contentReset.x) { if (t("onOverflowXNone")) { E.callbacks.onOverflowXNone.call(q[0]) } I.contentReset.x = 1 } if (s === "_resetY" || s === "_resetX") { return } if ((I.contentReset.y || !q[0].mcs) && I.overflowed[0]) { if (t("onOverflowY")) { E.callbacks.onOverflowY.call(q[0]) } I.contentReset.x = null } if ((I.contentReset.x || !q[0].mcs) && I.overflowed[1]) { if (t("onOverflowX")) { E.callbacks.onOverflowX.call(q[0]) } I.contentReset.x = null } if (E.snapAmount) { s = i._snapAmount(s, E.snapAmount, E.snapOffset) } switch (u.dir) { case "x": var x = j("#mCSB_" + I.idx + "_dragger_horizontal"), z = "left", C = B[0].offsetLeft, H = [v.width() - B.outerWidth(false), x.parent().width() - x.width()], r = [s, s === 0 ? 0 : (s / I.scrollRatio.x)], L = K[1], J = p[1], A = L > 0 ? L / I.scrollRatio.x : 0, w = J > 0 ? J / I.scrollRatio.x : 0; break; case "y": var x = j("#mCSB_" + I.idx + "_dragger_vertical"), z = "top", C = B[0].offsetTop, H = [v.height() - B.outerHeight(false), x.parent().height() - x.height()], r = [s, s === 0 ? 0 : (s / I.scrollRatio.y)], L = K[0], J = p[0], A = L > 0 ? L / I.scrollRatio.y : 0, w = J > 0 ? J / I.scrollRatio.y : 0; break } if (r[1] < 0 || (r[0] === 0 && r[1] === 0)) { r = [0, 0] } else { if (r[1] >= H[1]) { r = [H[0], H[1]] } else { r[0] = -r[0] } } if (!q[0].mcs) { F() } clearTimeout(B[0].onCompleteTimeout); if (!I.tweenRunning && ((C === 0 && r[0] >= 0) || (C === H[0] && r[0] <= H[0]))) { return } i._tweenTo.call(null, x[0], z, Math.round(r[1]), G[1], u.scrollEasing); i._tweenTo.call(null, B[0], z, Math.round(r[0]), G[0], u.scrollEasing, u.overwrite, { onStart: function () { if (u.callbacks && u.onStart && !I.tweenRunning) { if (t("onScrollStart")) { F(); E.callbacks.onScrollStart.call(q[0]) } I.tweenRunning = true; i._onDragClasses(x); I.cbOffsets = y() } }, onUpdate: function () { if (u.callbacks && u.onUpdate) { if (t("whileScrolling")) { F(); E.callbacks.whileScrolling.call(q[0]) } } }, onComplete: function () { if (u.callbacks && u.onComplete) { if (E.axis === "yx") { clearTimeout(B[0].onCompleteTimeout) } var M = B[0].idleTimer || 0; B[0].onCompleteTimeout = setTimeout(function () { if (t("onScroll")) { F(); E.callbacks.onScroll.call(q[0]) } if (t("onTotalScroll") && r[1] >= H[1] - A && I.cbOffsets[0]) { F(); E.callbacks.onTotalScroll.call(q[0]) } if (t("onTotalScrollBack") && r[1] <= w && I.cbOffsets[1]) { F(); E.callbacks.onTotalScrollBack.call(q[0]) } I.tweenRunning = false; B[0].idleTimer = 0; i._onDragClasses(x, "hide") }, M) } } }); function t(M) { return I && E.callbacks[M] && typeof E.callbacks[M] === "function" } function y() { return [E.callbacks.alwaysTriggerOffsets || C >= H[0] + L, E.callbacks.alwaysTriggerOffsets || C <= -J] } function F() { var O = [B[0].offsetTop, B[0].offsetLeft], P = [x[0].offsetTop, x[0].offsetLeft], M = [B.outerHeight(false), B.outerWidth(false)], N = [v.height(), v.width()]; q[0].mcs = { content: B, top: O[0], left: O[1], draggerTop: P[0], draggerLeft: P[1], topPct: Math.round((100 * Math.abs(O[0])) / (Math.abs(M[0]) - N[0])), leftPct: Math.round((100 * Math.abs(O[1])) / (Math.abs(M[1]) - N[1])), direction: u.dir } } }, _tweenTo: function (r, u, s, q, B, t, K) { var K = K || {}, H = K.onStart || function () { }, C = K.onUpdate || function () { }, I = K.onComplete || function () { }, z = i._getTime(), x, v = 0, E = r.offsetTop, F = r.style, A; if (u === "left") { E = r.offsetLeft } var y = s - E; r._mcsstop = 0; if (t !== "none") { D() } p(); function J() { if (r._mcsstop) { return } if (!v) { H.call() } v = i._getTime() - z; G(); if (v >= r._mcstime) { r._mcstime = (v > r._mcstime) ? v + x - (v - r._mcstime) : v + x - 1; if (r._mcstime < v + 1) { r._mcstime = v + 1 } } if (r._mcstime < q) { r._mcsid = A(J) } else { I.call() } } function G() { if (q > 0) { r._mcscurrVal = w(r._mcstime, E, y, q, B); F[u] = Math.round(r._mcscurrVal) + "px" } else { F[u] = s + "px" } C.call() } function p() { x = 1000 / 60; r._mcstime = v + x; A = (!b.requestAnimationFrame) ? function (L) { G(); return setTimeout(L, 0.01) } : b.requestAnimationFrame; r._mcsid = A(J) } function D() { if (r._mcsid == null) { return } if (!b.requestAnimationFrame) { clearTimeout(r._mcsid) } else { b.cancelAnimationFrame(r._mcsid) } r._mcsid = null } function w(N, M, R, Q, O) { switch (O) { case "linear": case "mcsLinear": return R * N / Q + M; break; case "mcsLinearOut": N /= Q; N--; return R * Math.sqrt(1 - N * N) + M; break; case "easeInOutSmooth": N /= Q / 2; if (N < 1) { return R / 2 * N * N + M } N--; return -R / 2 * (N * (N - 2) - 1) + M; break; case "easeInOutStrong": N /= Q / 2; if (N < 1) { return R / 2 * Math.pow(2, 10 * (N - 1)) + M } N--; return R / 2 * (-Math.pow(2, -10 * N) + 2) + M; break; case "easeInOut": case "mcsEaseInOut": N /= Q / 2; if (N < 1) { return R / 2 * N * N * N + M } N -= 2; return R / 2 * (N * N * N + 2) + M; break; case "easeOutSmooth": N /= Q; N--; return -R * (N * N * N * N - 1) + M; break; case "easeOutStrong": return R * (-Math.pow(2, -10 * N / Q) + 1) + M; break; case "easeOut": case "mcsEaseOut": default: var P = (N /= Q) * N, L = P * N; return M + R * (0.499999999999997 * L * P + -2.5 * P * P + 5.5 * L + -6.5 * P + 4 * N) } } }, _getTime: function () { if (b.performance && b.performance.now) { return b.performance.now() } else { if (b.performance && b.performance.webkitNow) { return b.performance.webkitNow() } else { if (Date.now) { return Date.now() } else { return new Date().getTime() } } } }, _stopTween: function () { var p = this; if (p._mcsid == null) { return } if (!b.requestAnimationFrame) { clearTimeout(p._mcsid) } else { b.cancelAnimationFrame(p._mcsid) } p._mcsid = null; p._mcsstop = 1 }, _delete: function (r) { try { delete r } catch (q) { r = null } }, _mouseBtnLeft: function (p) { return !(p.which && p.which !== 1) }, _pointerTouch: function (q) { var p = q.originalEvent.pointerType; return !(p && p !== "touch" && p !== 2) }, _isNumeric: function (p) { return !isNaN(parseFloat(p)) && isFinite(p) } }; j.fn[g] = function (p) { if (e[p]) { return e[p].apply(this, Array.prototype.slice.call(arguments, 1)) } else { if (typeof p === "object" || !p) { return e.init.apply(this, arguments) } else { j.error("Method " + p + " does not exist") } } }; j[g] = function (p) { if (e[p]) { return e[p].apply(this, Array.prototype.slice.call(arguments, 1)) } else { if (typeof p === "object" || !p) { return e.init.apply(this, arguments) } else { j.error("Method " + p + " does not exist") } } }; j[g].defaults = h; b[g] = true; j(b).load(function () { j(m)[g]() }) })) }(window, document));

});