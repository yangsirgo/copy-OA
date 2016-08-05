define(function (require, exports) {
    var dataCache=require('./sourceCache');
    //var white_list = /^[（），。‘“！'"=@#%_\!\$\^\*\(\)\+\|\-\\\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
    //var white_list = /^.*/ig;
    var util=require('./util.js');
    var white_list = util.workflowWhiteList;
    var tablEventBind=function(drow) {
        /*添加数据源项保存*/
        $("#editSourceContentBox table").delegate("a.ds_row_save", "click", function () {
            if ($(this).hasClass("a-disable")) {
                return;
            }
            $(this).addClass("a-disable");//fix bug7424
            var _athis = this;
            var cRow = $(this).parents("tr");
            var _guid = cRow.attr("gid");
            var inputvalue = $(".srcIptAdd", cRow).val();
            var _indexValue = $.trim($('.td_sort', cRow).text());
            white_list.lastIndex = 0;
            if (!white_list.test(inputvalue)) {
                alert('属性值中包含非法字符');
                return false;
            }
            var go = true;
            cRow.siblings(".srcItems").each(function () {
                if ($("td.proptext", $(this)).text() == inputvalue) {
                    alert('该属性值已存在!');
                    go = false;
                    $(_athis).removeClass("a-disable");
                }
            });
            if (inputvalue.length == 0) {
                alert('未填写属性值!');
                go = false;
                $(this).removeClass("a-disable");
            }
            if (go) {
                //点击保存，如果值没有变，则触发取消按钮
                if($(".srcIptAdd", cRow).attr("orgvalue")==inputvalue){
                    $(this).siblings("a.ds_row_cancel").trigger("click");
                    $(this).removeClass("a-disable");
                    return;
                }
                var _sourceid = $(this).attr("sourceid");
                $.post(i8_session.ajaxWfHost + "webajax/form/addsourceitem",
                    { 'itemid': _guid, 'parentid': '', 'sourceid': _sourceid, 'name': encodeURIComponent(inputvalue), 'index': _indexValue }, function (response) {
                        if (response.Result) {
                            var itemObj = response.ReturnObject;
                            cRow.attr("gid", itemObj.ID);
                            cRow.find(".proptext").html(inputvalue);
                            //$(_athis).parents(".srcItems").attr("tr-data",encodeURIComponent(util.toJsonString(itemObj)));
                            $(_athis).parent().removeClass("saveState").addClass("editState");
                            $(_athis).removeClass("a-disable");
                            //dataCache.updateSourceByID(_sourceid);
                        } else {
                            alert('保存失败！'+response.Description);
                            $(_athis).removeClass("a-disable");
                        }
                    }, "json");
            }
        });
        /*点击子集*/
        $("#editSourceContentBox table").delegate("a.ds_row_subset", "click", function () {
            var _thisTr=this;
            if ($('.subsetListBox').length > 0) {
                $('.subsetListBox').remove();
            }
            var curRourceName = $(this).parents(".srcItems").find(".proptext").text();
            $("#editSourceContentBox div.subsetListBox").remove();
            var gid = $(this).parents("tr").attr("gid");
            var sourceid = $(this).attr("sourceid");
            if ($(this).siblings("subsetListBox").length == 0) {
                var subsetBox = $('<div class="subsetListBox" parentid="' + gid + '" sourceid="' + sourceid + '"><div style="line-height:30px;text-align:center;color:#37A7E0;background:#f1f1f1">"' + curRourceName + '"子集</div><table class="subsettable"><thead><tr><th>属性</th><th>操作</th></tr></thead><tbody></tbody><tfoot><tr><td></td><td><a class="add_subsetitem">添加</a></td></tr></tfoot></table></div>');
                //$('#editSourceContentBox').after(subsetBox);
                $('body').append(subsetBox);
                var trDataStr = $(_thisTr).parents(".srcItems").attr("tr-data");
                if(!!trDataStr) {
                    var trData = $.parseJSON(decodeURIComponent(trDataStr));
                    var subColStr = '';
                    _.each(trData.subItems, function (ditem) {
                        subColStr += '<tr class="tb_subset_row" targetid="'+gid+'" asetid="' + ditem.ID + '" tr-data=' + encodeURIComponent(util.toJsonString(ditem)) + '><td class="tb_subsetrow_item">' + ditem.Text + '</td><td><a targetid="'+gid+'"  class="row_subset_delete">删除</a></td></tr>';
                    });
                    subsetBox.find("tbody").html(subColStr);
                }
                //fillSubsetList(sourceid, gid, subsetBox.find("tbody"));

                // '<tr class="tb_subset_row" asetid="' + _subset[k].id + '"><td class="tb_subsetrow_item">' + _subset[k].text + '</td><td><a class="row_subset_delete">删除</a></td></tr>';

                var left = $(this).offset().left;
                var top = $(this).offset().top;
                var subsetHeight = subsetBox.height();
                if (subsetHeight > 200) {
                    subsetBox.css('height', '200px').mCustomScrollbar({ theme: "dark-3" });
                    subsetHeight = 200;
                }
                top = top + subsetHeight > document.documentElement.clientHeight ? top - subsetHeight : top;
                if (top < 0) {
                    top = 0;
                }
                subsetBox.css({ "left": left + 40, "top": top });
                /*子集绑定保存*/
                subsetBox.delegate("a.row_subset_save", "click", function () {
                    if ($(this).hasClass("a-disable")) {
                        return;
                    }
                   // if($(this).parents('tbody').find())
                    $(this).addClass("a-disable");
                    var _thisa = this;
                    var addvalue = $.trim($(this).parents("tr.tb_subset_row").find("input.srcsubset").val());
                    var subset_table = $(this).parents("table.subsettable");
                    var submit = true;
                    if (addvalue.length == 0) {
                        alert('添加项为空！');
                        submit = false;
                        $(this).removeClass("a-disable");
                    }
                    subset_table.find("td.tb_subsetrow_item").each(function () {
                        if (addvalue == $.trim($(this).text())) {
                            submit = false;
                            alert('添加项已存在！');
                            $(_thisa).removeClass("a-disable");
                        }
                    });
                    var _sourceid = $(this).parents("div.subsetListBox").attr("sourceid");
                    var _parentid = $(this).parents("div.subsetListBox").attr("parentid");
                    var sortIndex = $(this).parents("div.subsetListBox").find("tr.tb_subset_row").length;
                    if (submit) {
                        $.post(i8_session.ajaxWfHost + "webajax/form/addsourceitem",
                            { 'itemid': '00000000-0000-0000-0000-000000000000', 'parentid': _parentid, 'sourceid': _sourceid, 'name': encodeURIComponent(addvalue), 'index': sortIndex }, function (response) {
                                if (response.Result) {
                                    var item = response.ReturnObject;
                                    $(_thisa).parents("tr.tb_subset_row").attr("asetid", item.ID).attr("tr-data",encodeURIComponent(util.toJsonString(item))).attr('targetid',gid);
                                    $(_thisa).parents("tr.tb_subset_row").find("td.tb_subsetrow_item").html(addvalue);
                                    //获取父节点存储的子节点信息，然后增加新添加的子节点项，再存储原节点
                                    var col_lib=[];
                                    $(_thisa).parents("table.subsettable").find("tr.tb_subset_row").each(function(){
                                        var th_item= $.parseJSON(decodeURIComponent($(this).attr("tr-data")));
                                        col_lib.push(th_item);
                                    });
                                    if(!$.isPlainObject(trData)){
                                        trData = {};
                                    }
                                    trData.subItems=col_lib;
                                    $(_thisTr).parents(".srcItems").attr("tr-data",encodeURIComponent(util.toJsonString(trData)));
                                    $(_thisa).parent().html('<a class="row_subset_delete">删除</a>');
                                    //loadDataResource();
                                    /*更新数据源*/
                                } else {
                                    alert('保存失败！'+response.Description);
                                    $(_thisa).removeClass("a-disable");
                                }
                            }, "json");
                    }
                });
                /*子集绑定删除*/
                subsetBox.delegate("a.row_subset_delete", "click", function () {
                    var itemthisrow = $(this).parents("tr.tb_subset_row");
                    var itemID = itemthisrow.attr("asetid");
                    var thisTargetid = itemthisrow.attr('targetid');
                    if(confirm('确定删除该数据吗?')) {
                        $.get(i8_session.ajaxWfHost + "webajax/form/delsourceitem", { 'id': itemID }, function (response) {
                            if (response.Result) {
                                itemthisrow.toggle(300, function () {
                                   // var trData = itemthisrow.
                                    itemthisrow.remove();
                                   var $trDataContainer = $('tr[gid="'+thisTargetid+'"]');
                                       trData = $.parseJSON(decodeURIComponent($trDataContainer.attr('tr-data')));
                                    var subItems = trData.subItems;
                                    var index = 0;
                                    $.each(subItems,function(index,item){
                                        if(item.ID == itemID){
                                            subItems.splice(index,1);
                                        }
                                        index++;
                                    })
                                    trData.subItems = subItems;
                                    $trDataContainer.attr('tr-data',encodeURIComponent(util.toJsonString(trData)));
                                    //loadDataResource();
                                    /*更新数据源*/
                                });
                            }else{
                                alert(response.Description);
                            }
                        }, "json");
                    }
                }).click(function () {
                    return false;
                });
                subsetBox.delegate("a.add_subsetitem", "click", function () {
                    if($(this).parents(".subsettable").find('input.srcsubset').length>0){

                        alert('请先保存未添加完的数据！');
                        return;
                    }
                    $(this).parents("table.subsettable").find("tbody").append('<tr class="tb_subset_row"><td class="tb_subsetrow_item"><input type="text" class="srcsubset"/></td><td><a class="row_subset_save">保存</a></td></tr>');
                }).click(function () {
                    return false;
                });

                $(document).click(function () {
                    subsetBox.remove();
                    //dataCache.updateSourceByID(_sourceid);
                })
            }
            return false;
        });
        $(document).click(function (e) {
            if (e.target.className != "ds_row_subset") {
                $("#editSourceContentBox div.subsetListBox").remove();
            }
        });
        //$("#editSourceContentBox table")
        $("#editSourceContentBox table").delegate("a.ds_row_edit", "click", function () {
            var cRow = $(this).parents("tr");
            var ovle = $(".proptext", cRow).text();
            $(".proptext", cRow).html('<input type="text" class="srcIptAdd editName-text-box" orgvalue="'+ovle+'" value="' + ovle + '"/>');
            $(this).parent().addClass("saveState").removeClass("editState");
        });
        /*删除数据源项*/
        $("#editSourceContentBox table").delegate(".ds_row_delete", "click", function () {
            if(confirm('确定删除该数据源吗?')) {
                var _thistr = $(this).parents("tr");
                var itemID = _thistr.attr("gid");
                $.get(i8_session.ajaxWfHost + "webajax/form/delsourceitem", { 'id': itemID }, function (response) {
                    if (response.Result) {
                        _thistr.toggle(300, function () {
                            _thistr.remove();
                            $("#editSourceContentBox table tbody tr[status='1'] .td_sort").each(function (e) {
                                $(this).html((e + 1).toString());
                            });
                        });
                    }
                }, "json");
            }
        });
        $("#editSourceContentBox table tfoot tr a.a_add_row").click(function () {
            var sort = $("#editSourceContentBox table tbody tr[status='1']").length + 1;
            $("#editSourceContentBox table tbody").append('<tr class="srcItems" gid="00000000-0000-0000-0000-000000000000" value="" status="1"><td class="proptext"><input type="text" class="srcIptAdd" /></td><td class="td_sort" align="center">' + sort + '</td><td class="td_edit saveState" align="center"><a class="ds_row_save" sourceid=' + drow.ID + '>保存</a> <a class="ds_row_cancel">取消</a> <a class="ds_row_edit">编辑</a> <a class="ds_row_delete">删除</a> <a class="ds_row_subset" sourceid=' + drow.ID + '>子集</a></td></tr>');
        })
    };
    $("a.ds_row_cancel").live("click",function(){
        var cur_row=$(this).parents("tr.srcItems");
        var originalValue=cur_row.find(".editName-text-box").attr("orgvalue");
        cur_row.find("td.proptext").text(originalValue);
        cur_row.find("td.td_edit").removeClass("saveState").addClass("editState");
    })
    function sourceEditDialog(drow) {
        var content = $('<div class="div_editSource" style="height:300px;" id="editSourceContentBox"><table><thead><tr><th>属性值名</th><th>排序</th><th align="center">操作</th></tr></thead><tbody></tbody><tfoot><tr><td></td><td></td><td style="height:25px;line-height:25px;text-align:center"><a class="a_add_row">新增</a></td></tr></tfoot></table></div>');
        dataCache.getSourceByID(drow.ID,function(datalist){
            var pre_appendCon = "";
            _.each(datalist,function(item,index){
                pre_appendCon += '<tr class="srcItems"  gid="' + item.ID + '" tr-data="'+ encodeURIComponent(util.toJsonString(item))+'" status=' + item.Status + '><td class="proptext">' + item.Text + '</td><td class="td_sort" align="center">' + (index+1) + '</td><td class="td_edit editState" align="center"><a class="ds_row_save" sourceid="' + drow.ID + '">保存</a> <a class="ds_row_cancel">取消</a> <a class="ds_row_edit">编辑</a> <a class="ds_row_delete" sourceid="'+item.ID+'">删除</a> <a sourceid="' + drow.ID + '" class="ds_row_subset">子集</a></td></tr>';
            })
            $("tbody", content).append(pre_appendCon).attr("sourceName", drow.Name).attr("sourceid", drow.ID);
            var showbox = $.MsgBox({
                title:decodeURIComponent(drow.Name) + "-- 数据源管理",
                content: content,
                isdrag: false,
                showBtns: true,
                confirmClick: function (data) {
                    showbox.closeBox();
                    //loadDataResource();
                    dataCache.updateSourceByID(drow.ID);
                },
                btncanceltxt: "关闭",
                cancelClick: function (data) {
                    dataCache.updateSourceByID(drow.ID);
                }
            });
            showbox.show();
            content.mCustomScrollbar({ theme: "dark-3" });
            tablEventBind(drow);
        })
        // comment by chentao  2014-08-06  can't supply sort by interface


        //$("#editSourceContentBox table tbody").sortable({
        //    placeholder: "ui-place-tr-src",
        //    item: ".srcItems",
        //    change: function (event, ui) {

        //    },
        //    stop: function (event, ui) {
        //        $("#editSourceContentBox table tbody .td_sort").each(function (e) { $(this).html((e + 1).toString()); });
        //    }
        //});

    }
    /*单选数据源*/
    function sourceRow(drow) {
        var contains = function (parentNode, childNode) {
            if (parentNode.contains) {
                return parentNode != childNode && parentNode.contains(childNode);
            } else {
                return !!(parentNode.compareDocumentPosition(childNode) & 16);
            }
        };
        var a_row = $('<li><div class="type_txt" sourceid="' + drow.ID + '"><span class="span_dsn_value" title="双击修改数据源名">' + decodeURIComponent(drow.Name) + '</span></div></li>');
        a_row.delegate(".span_dsn_value", "dblclick", function () {
            var origvalue = $(this).text();
            $(this).replaceWith($('<input type="text" class="ipt_tempUpdateText" style="width:100px" value="' + origvalue + '"/>').blur(function () {
                var newvalue = $(this).val();
                if (newvalue.length > 20)
                {
                    alert('数据源长度超出20个字符的限制！');
                    return false;
                }
                white_list.lastIndex = 0;
                if(!white_list.test(newvalue))
                {
                    alert('数据源名称中包含非法字符！');
                    return;
                }
                var sourceid = $(this).parent().attr("sourceid");
                var _this = this;
                $.get(i8_session.ajaxWfHost + "webajax/form/updatesourcename", { nsname: encodeURIComponent(newvalue), sourceID: sourceid }, function (response) {
                    if (response.Result) {
                        $(_this).replaceWith('<span class="span_dsn_value" title="双击修改数据源名">' + newvalue + '</span>');
                        return true;
                    } else {
                        alert(response.Description);
                    }
                }, "json");
            }));
            $(".ipt_tempUpdateText").focus();
        })
        return a_row.mouseover(function (e) {
            if (!contains(this, e.relatedTarget || e.fromElement) && !((e.relatedTarget || e.fromElement) === this)) {
                /*添加修改*/
                var _edit = $('<a class="a_edit_ico" title="修改数据名"></a>').click(function () {
                    $(this).parent().find(".span_dsn_value").dblclick();
                });
                var _set = $('<a class="a_set_ico" title="修改数据源"></a>').click(function () {
                    sourceEditDialog(drow);
                })
                $(this).append(_set).append(_edit);
                /*添加详细列表*/
                //                    var _rowTips = $('<div class="row_tips"></div>');
                //                    var _tipTb = $('<table><thead><tr><th>属性值名</th><th>排序</th></tr></thead><tbody></tbody></table>');
                //                    var datalist = drow.sourceList;
                //                    if (datalist.length > 0) {
                //                        for (var i = 0; i < datalist.length; i++) {
                //                            $("tbody", _tipTb).append('<tr><td>' + datalist[i].text + '</td><td>' + datalist[i].sort + '</td></tr>');
                //                        }
                //                    }
                //                    _rowTips.append(_tipTb);
                //                    $(this).append(_rowTips);
                //                    _rowTips.effect("slide", {}, 200, function () { });
            }
        }).mouseout(function (e) {
            if (!contains(this, e.relatedTarget || e.toElement) && !((e.relatedTarget || e.toElement) === this)) {
                $("a.a_edit_ico", this).remove();
                $("a.a_set_ico", this).remove();
                $("div.row_tips", this).effect("blind", {}, 200, function () { $(this).remove(); });
            }
        });
    }
    /*添加新数据源类*/
    $("#c_add_newdataType").click(function () {
        var box = $.MsgBox({
            title: "添加新数据源类",

            content: '<div class="boxbody"><div class="boxrow"><div class="brtt"><span class="span_bfieldTxt">数据源名：</span></div><div class="brbx"><input type="text" class="txtboxcs" id="txt_newdatasourceName"/></div></div></div>',
            isdrag: true,
            showBtns: true,
            confirmClick: function () {
                var newdsname = $.trim($("#txt_newdatasourceName").val());
                if (newdsname.length == 0) {
                    alert('请输入数据源名!');
                    return false;
                }
                if (newdsname.length > 20) {
                    alert('字符串长度不得大于20');
                    return false;
                }
                //newdsname = newdsname.replace(/["|'|\s]/g, "");
                //var len = newdsname.replace(/[^\x00-\xFF]/g, "**").length;
                if (window["DATARESOURCE"] && window["DATARESOURCE"].length > 0) {
                    for (var i = 0; i < window["DATARESOURCE"].length; i++) {
                        if (window["DATARESOURCE"][i].sourceName == newdsname) {
                            alert('已存在该数据源类型！');
                            return false;
                        }
                    }
                }
                white_list.lastIndex = 0;
                if (!white_list.test(newdsname)) {
                    alert('数据源名称中包含非法字符！');
                    return false;
                }else {
                    $.post(i8_session.ajaxWfHost + "webajax/form/addmainsource", {sname: decodeURIComponent(newdsname)}, function (response) {
                        if (response.Result) {
                            var ndrow = response.ReturnObject;
                            $("#fdcdatals").append(sourceRow(ndrow));
                            //window["DATARESOURCE"].push(ndrow);
                            dataCache.updateMainSourceItem(ndrow);
                            box.closeBox();

                            $("#fdcdls_mtype").mCustomScrollbar("update");
                            $("#fdcdls_mtype").mCustomScrollbar({"scrollTo":"bottom"});
                            //$('#fdcdls_mtype').jkScrollBar({ pattern: 'jkscroll-simple' });
                            //change by chentao   popup edit dialog
                            //sourceEditDialog(ndrow);
                        } else {
                            alert(response.Description);
                        }
                    }, "json");
                }
            }
        });
        box.show();
        $("#txt_newdatasourceName").focus();
    });
    dataCache.getMainSource(function(datalist){
        _.each(datalist,function(data){
            $("#fdcdatals").append(sourceRow(data));
        })
        $("#fdcdls_mtype").mCustomScrollbar({ theme: "dark-3" });
    })

})