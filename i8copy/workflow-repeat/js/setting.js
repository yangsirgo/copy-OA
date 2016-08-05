/**
 * Created by ryf on 2016/8/2.
 */
define(function (require, exports) {

    var fw_selector = require("default/javascripts/plugins/i8selector/fw_selector");
    var i8ui = require('default/javascripts/common/i8ui.js');
    var _hash = require('default/javascripts/common/gethashjson.js');
    var fw_page = require('default/javascripts/common/fw_pagination.js');
    var util = require('../common/util.js');
    require('default/javascripts/plugins/i8formdesigner/base-plugin.js');
    //var white_list = /^[\u4e00-\u9fa5_a-zA-Z0-9\s]+$/ig;
    var white_list = util.workflowWhiteList;
    //var white_list = /^[（），。：、‘’“”￥……！'"~=@#%_\:\!\$\^\*\(\)\+\|\-\\\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
    var getRunProcDataSourceAndLine = function(dataSourceID,callback){
        $.ajax({
            'url': i8_session.ajaxWfHost + 'webajax/design/activity/GetRunProcDataSourceAndLine',
            'data':    {'datasourceid': dataSourceID},
            'async':   true,
            'success': function (data) {
                var _retObj = data.ReturnObject;
                if($.isFunction(callback)){
                    callback(_retObj);
                }
            }
        });
    }
    window._alert = window.alert;
    window.alert = function (data) {
        i8ui.alert({title:data});
    }
    //var white_list = /^.*/ig;
    var GUID_EMPTY = '00000000-0000-0000-0000-000000000000';
    //页面初始化
    var PageInit = function () {
        var hash = _hash.getHashJson(window.location.hash);
        $('#' + hash.page).show();
        $('.app-menu-navigation div[listtype=' + hash.page + ']').parent().addClass('current');
        $('.app-menu-navigation').on('click', 'li', function () {
            $('.app-menu-navigation').find('.current').removeClass('current');
            $(this).addClass('current');
        })

        //根据角色id获取流程名称
        var fnGetProcNameByRoleId = function (roleid, callback) {
            $.ajax({
                url: i8_session.ajaxWfHost + 'webajax/setting/getProcNameByRoleId',
                type: 'get',
                data: {roleid: roleid},
                dataType: 'json',
                success: function (data) {
                    if (data.Result) {
                        if ($.isFunction(callback)) {
                            callback(data.ReturnObject)
                        }
                    } else {
                        i8ui.alert({'title': data.Description});
                    }
                }
            });
        }

        //菜单注册
        $('.app-menu-list').on('click', 'div', function () {
            var list_type = $(this).attr('listType');
            var hashjson = _hash.getHashJson(window.location.hash);
            /*if(hashjson.page){
             $('#'+hashjson.page).hide();
             window.location.hash='page='+list_type;
             $('#'+list_type).show();
             }
             else{
             window.location.hash='page='+list_type;
             }*/

            $('.fw_hidden').hide();
            window.location.hash = 'page=' + list_type;
            $('#' + list_type).show();
        });

        //流程类型配置
        (function () {
            var category = $('#category');
            var isEdit = false;

            //流程类型配置 编辑 按钮注册
            category.on('click', '.btn-edit-one', function () {
                if (!isEdit) {
                    isEdit = true;
                    changeView($(this), 1);
                }
                else {
                    i8ui.alert({title: '正在编辑中，请先保存或取消！'});
                }
            });

            //流程类型配置 取消 按钮注册
            category.on('click', '.btn-cancel', function () {
                isEdit = false;
                var _this = $(this);
                if (!_this.parent().attr('categoryid')) {
                    _this.parents('tr').remove();
                } else {
                    changeView($(_this), 0);
                }
            });

            //流程类型配置 保存 按钮注册
            category.on('click', '.btn-save', function () {
                var _this = $(this);
                var _tr = $(this).parents('tr');
                saveCategory(_tr, function (data) {
                    i8ui.alert({title: '保存成功！', type: 2})
                    getCategory(1);
                    isEdit = false;
                });
            });

            //流程类型配置 删除 按钮注册
            category.on('click', '.btn-delete', function () {
                var _this = $(this);
                deleteCategory(_this.parent().attr('categoryid'), function () {
                    getCategory(1);
                    i8ui.alert({title: '删除成功！', type: 2})
                })
            });

            //流程类型配置 添加 按钮注册
            category.on('click', '.sys-mgadd-btn', function () {
                if (isEdit) {
                    i8ui.alert({title: '正在编辑中，请先保存或取消！'});
                    return;
                }
                isEdit = true;
                category.find('table tbody').append('<tr></tr><td class="p-l-50"><input class="l-h20 b-colorcfc" id="className"></td>\
                    <td class="p-l-50"><input class="l-h20 b-colorcfc" id="sortIndex" ></td>\
                    <td></td>\
                    <td class="p-l-l10" ><a class="design-bg-icons3 btn-save">保存</a><a class="example_bg_icon1 btn-cancel">取消</a></td></tr>');
            });

            //改变显示
            var changeView = function (_this, type) {
                var _tr = _this.parents('tr');
                var td1 = _tr.find('td').eq(0);
                var td2 = _tr.find('td').eq(1);
                var td3 = _tr.find('td').eq(3);
                if (type) {
                    var input1 = '<input class="l-h20 b-colorcfc" id="className" value="' + $.trim(td1.text()) + '" />';
                    var input2 = '<input class="l-h20 b-colorcfc" id="sortIndex" value="' + $.trim(td2.text()) + '" />';
                    td1.html(input1);
                    td2.html(input2);
                    td3.html('<a class="design-bg-icons3 btn-save">保存</a><a class="example_bg_icon1 btn-cancel">取消</a>')

                } else {
                    td1.html(_tr.attr('CategoryName'));
                    td2.html(_tr.attr('SortIndex'));
                    td3.html('<a class="design-bg-icons3 btn-edit-one">编辑</a><a class="example_bg_icon1 btn-delete edit-icon">删除</a>')
                }
            }

            //根据ID删除流程类别
            var deleteCategory = function (categoryID, callback) {
                var _title = '确定要删除吗？';
                $.ajax({
                    url: i8_session.ajaxWfHost + 'webajax/setting/getProcCountByID',
                    type: 'get',
                    data: 'categoryID=' + categoryID,
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        if (!data.Result) {
                            i8ui.alert({title: data.Description});
                            return;
                        }
                        else {
                            if (data.Count > 0) {
                                _title = '该分类下有流程,确定要删除吗? 删除后，流程将会归到未分类目录里';
                            }
                        }
                    }
                })
                i8ui.confirm({
                        title: _title
                    },
                    function (divDom) {
                        divDom.close();
                        $.ajax({
                            url: i8_session.ajaxWfHost + 'webajax/setting/deleteCategoryByID',
                            type: 'get',
                            data: 'categoryID=' + categoryID,
                            dataType: 'json',
                            success: function (data) {
                                if (!data.Result) {
                                    i8ui.alert({title: '删除失败，' + data.Description})
                                }
                                callback();
                            }
                        })
                    });
            }

            //保存流程类别  （添加  修改）
            var saveCategory = function (_tr, callback) {
                var className = $.trim($('#className').val());
                var sortIndex = parseInt($('#sortIndex').val());
                if (!className) {
                    i8ui.alert({title: '类别名称不能为空！'});
                    return;
                }
                if ((!sortIndex) || $.type(sortIndex) !== 'number') {
                    i8ui.alert({title: '排序分值必须为非空整数！'});
                    return;
                }
                var td3 = _tr.find('td').eq(3);
                var categoryid = td3.attr('categoryid');
                $.ajax({
                    url: i8_session.ajaxWfHost + 'webajax/setting/saveCategory',
                    type: 'get',
                    data: 'ID=' + categoryid + '&CategoryName=' + encodeURIComponent(className) + '&SortIndex=' + sortIndex,
                    dataType: 'json',
                    success: function (data) {
                        if (!data.Result) {
                            i8ui.alert({title: data.Description});
                            return;
                        }
                        $('#sortIndex').val(sortIndex);
                        callback(data);
                    }, error: function (e1, e2, e3) {
                        i8ui.alert({title: '保存流程类别时请求超时，请检查网络！'});
                    }
                })
            }
            $('#processdata').on('click', '.sys-mgadd-btn', function () {

                var _html = '<span class="ipt_datasourcename">数据源名称：</span><input type="text" class="ipt_tempUpdateText" style="width:140px" >';
                i8ui.confirm({
                    title: _html,
                    body: '<div style="height:36px;line-height: 36px;font-weight:bold;font-size:16px;border-bottom:1px solid #47C7EA;padding-left:4px">数据源名称</div>',
                    success: function () {

                    }
                }, function (divDom) {
                    fnAddMainDataSource($('.ipt_tempUpdateText').val());
                });

                //  i8ui.showNoTitle();
            })

            //数据源子集数据操作
            var tablEventBind = function (drow) {
                /*添加数据源项保存*/
                $("#editSourceContentBox table").delegate("a.ds_row_save", "click", function () {
                    if ($(this).hasClass("a-disable")) {
                        return;
                    }
                    $(this).addClass("a-disable");//fix bug74:2424
                    var _athis = this;
                    var cRow = $(this).parents("tr");
                    var _guid = cRow.attr("gid");
                    var inputvalue = $(".srcIptAdd", cRow).val();
                    var _indexValue =  $(".srcIptIndexAdd", cRow).val();// $.trim($('.td_sort', cRow).text());
                    white_list.lastIndex = 0;
                    if (!white_list.test(inputvalue)) {
                        alert('属性值中包含非法字符！');
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
                        //if ($(".srcIptAdd", cRow).attr("orgvalue") == inputvalue) {
                        //    $(this).siblings("a.ds_row_cancel").trigger("click");
                        //    $(this).removeClass("a-disable");
                        //    return;
                        //}
                        var _itemId = $(this).attr("itemid");
                        var _sourceId = $(this).attr('sourceid');
                        $.post(i8_session.ajaxWfHost + "webajax/form/addsourceitem",
                            { 'itemid': _itemId, 'parentid': '', 'sourceid': _sourceId, 'name': encodeURIComponent(inputvalue), 'index': _indexValue }, function (response) {
                                if (response.Result) {
                                    var itemObj = response.ReturnObject;

                                    cRow.attr("gid", itemObj.DataSourceID);
                                    cRow.find(".proptext").html(inputvalue);
                                    cRow.find('.td_sort').html(_indexValue);
                                    cRow.find('.ds_row_save').attr('itemid', itemObj.ID);
                                    cRow.find('.ds_row_subset').attr('itemid', itemObj.ID);
                                    cRow.find('.ds_subrow_delete').attr('itemid', itemObj.ID);
                                    //$(_athis).parents(".srcItems").attr("tr-data",encodeURIComponent(util.toJsonString(itemObj)));
                                    $(_athis).parent().removeClass("saveState").addClass("editState");
                                    $(_athis).removeClass("a-disable");
                                    //dataCache.updateSourceByID(_sourceid);
                                } else {
                                    alert('保存失败！' + response.Description);
                                    $(_athis).removeClass("a-disable");
                                }
                            }, "json");
                    }
                });
                /*点击子集*/
                $("#editSourceContentBox table").delegate("a.ds_row_subset", "click", function () {
                    var _thisTr = this;
                    if ($('.subsetListBox').length > 0) {
                        $('.subsetListBox').remove();
                    }
                    var curRourceName = $(this).parents(".srcItems").find(".proptext").text();
                    $("#editSourceContentBox div.subsetListBox").remove();
                    var gid = $(this).parents("tr").attr("gid");
                    var sourceid = $(this).attr("sourceid");
                    var parentid = $(this).attr('itemid');
                    if ($(this).siblings("subsetListBox").length == 0) {
                        var subsetBox = $('<div class="subsetListBox" parentid="' + parentid + '" sourceid="' + sourceid + '"><div style="line-height:30px;text-align:center;color:#37A7E0;background:#f1f1f1">"' + curRourceName + '"子集</div><table class="subsettable"><thead><tr><th>属性</th><th>操作</th></tr></thead><tbody></tbody><tfoot><tr><td></td><td><a class="add_subsetitem">添加</a></td></tr></tfoot></table></div>');
                        //$('#editSourceContentBox').after(subsetBox);
                        $('body').append(subsetBox);
                        var trDataStr = $(_thisTr).parents(".srcItems").attr("tr-data");
                        if (!!trDataStr) {
                            var dataStr = decodeURIComponent(trDataStr);
                            dataStr = dataStr.replace(/\:null/ig,':"null"').replace(/\t/g,"");
                            var trData = $.parseJSON(dataStr);// $.parseJSON(decodeURIComponent(trDataStr));
                            var subColStr = '';
                            _.each(trData.subItems, function (ditem) {
                                subColStr += '<tr class="tb_subset_row" targetid="' + gid + '" asetid="' + ditem.ID + '" tr-data=' + encodeURIComponent(util.toJsonString(ditem)) + '><td class="tb_subsetrow_item">' + ditem.Text + '</td><td class="tb_subsetrow_control"><a targetid="' + gid + '"  class="row_subset_delete">删除</a></td></tr>';
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
                                            $(_thisa).parents("tr.tb_subset_row").attr("asetid", item.ID).attr("tr-data", encodeURIComponent(util.toJsonString(item))).attr('targetid', gid);
                                            $(_thisa).parents("tr.tb_subset_row").find("td.tb_subsetrow_item").html(addvalue);
                                            //获取父节点存储的子节点信息，然后增加新添加的子节点项，再存储原节点
                                            var col_lib = [];
                                            $(_thisa).parents("table.subsettable").find("tr.tb_subset_row").each(function () {
                                                var th_item = $.parseJSON(decodeURIComponent($(this).attr("tr-data")));
                                                col_lib.push(th_item);
                                            });
                                            if (!$.isPlainObject(trData)) {
                                                trData = {};
                                            }
                                            trData.subItems = col_lib;
                                            $(_thisTr).parents(".srcItems").attr("tr-data", encodeURIComponent(util.toJsonString(trData)));
                                            $(_thisa).parent().html('<a class="row_subset_delete">删除</a>');
                                            //loadDataResource();
                                            /*更新数据源*/
                                        } else {
                                            alert('保存失败！' + response.Description);
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
                            if (confirm('确定删除该数据吗?')) {
                                $.get(i8_session.ajaxWfHost + "webajax/form/delsourceitem", { 'id': itemID }, function (response) {
                                    if (response.Result) {
                                        itemthisrow.toggle(300, function () {
                                            // var trData = itemthisrow.
                                            itemthisrow.remove();
                                            var $trDataContainer = $('tr[gid="' + thisTargetid + '"]');
                                            trData = $.parseJSON(decodeURIComponent($trDataContainer.attr('tr-data')));
                                            var subItems = trData.subItems;
                                            var index = 0;
                                            $.each(subItems, function (index, item) {
                                                if (item.ID == itemID) {
                                                    subItems.splice(index, 1);
                                                }
                                                index++;
                                            })
                                            trData.subItems = subItems;
                                            $trDataContainer.attr('tr-data', encodeURIComponent(util.toJsonString(trData)));
                                            //loadDataResource();
                                            /*更新数据源*/
                                        });
                                    } else {
                                        alert(response.Description);
                                    }
                                }, "json");
                            }
                        }).click(function () {
                            return false;
                        });
                        subsetBox.delegate("a.add_subsetitem", "click", function () {
                            if ($(this).parents(".subsettable").find('input.srcsubset').length > 0) {

                                alert('请先保存未添加完的数据！');
                                return;
                            }
                            $(this).parents("table.subsettable").find("tbody").append('<tr class="tb_subset_row"><td class="tb_subsetrow_item"><input type="text" class="srcsubset"/></td><td class="row_subset_save_container"><a class="row_subset_save">保存</a></td></tr>');
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
                    var indexValue = $(".td_sort",cRow).text();
                    $(".proptext", cRow).html('<input type="text" class="srcIptAdd editName-text-box" orgvalue="' + ovle + '" value="' + ovle + '"/>');
                    $(".td_sort", cRow).html('<input type="text" class="srcIptIndexAdd editName-text-box-index" orgvalue="' + indexValue + '" value="' + indexValue + '"/>');
                    $(this).parent().addClass("saveState").removeClass("editState");
                });
                /*删除数据源项*/
                $("#editSourceContentBox table").delegate(".ds_row_delete", "click", function () {
                    if (confirm('确定删除该数据源吗?')) {
                        var _thistr = $(this).parents("tr");
                        //var itemID = _thistr.attr("gid");
                        var _itemid = $(this).attr('itemid');
                        $.get(i8_session.ajaxWfHost + "webajax/form/delsourceitem", { 'id': _itemid }, function (response) {
                            if (response.Result) {
                                _thistr.toggle(300, function () {
                                    _thistr.remove();
                                    //$("#editSourceContentBox table tbody tr[status='1'] .td_sort").each(function (e) {
                                    //    $(this).html((e + 1).toString());
                                    //});
                                });
                            }
                        }, "json");
                    }
                });
                $("#editSourceContentBox table tfoot tr a.a_add_row").click(function () {
                    var sort = $("#editSourceContentBox table tbody tr[status='1']").length + 1;
                    $("#editSourceContentBox table tbody").append('<tr class="srcItems" gid="00000000-0000-0000-0000-000000000000" value="" status="1"><td class="proptext"><input type="text" class="srcIptAdd" /></td><td class="td_sort" align="center"><input type="text"  class="srcIptIndexAdd  editName-text-box-index" value="' + sort + '" /></td><td class="td_edit saveState" align="center"><a class="ds_row_save" sourceid=' + drow.ID + '>保存</a> <a class="ds_row_cancel">取消</a> <a class="ds_row_edit">编辑</a> <a class="ds_row_delete ds_subrow_delete">删除</a> <a class="ds_row_subset"  sourceid=' + drow.ID + '>子集</a></td></tr>');
                })

                $("#editSourceContentBox table").delegate("a.ds_row_cancel", "click", function () {
                    var cur_row = $(this).parents("tr.srcItems");
                    var _gid = cur_row.attr('gid');
                    if (_gid == GUID_EMPTY) {
                        cur_row.remove();
                        return;
                    }
                    var originalValue = cur_row.find(".editName-text-box").attr("orgvalue");
                    // $(".td_sort", cRow).html('<input type="text" class="srcIptIndexAdd editName-text-box-index" orgvalue="' + indexValue + '" value="' + indexValue + '"/>');
                    var indexValue = cur_row.find('.editName-text-box-index').attr("orgvalue");
                    cur_row.find("td.proptext").text(originalValue);
                    cur_row.find('td.td_sort').text(indexValue);
                    cur_row.find("td.td_edit").removeClass("saveState").addClass("editState");
                })

            };


            //获取流程类别列表
            var getCategory = function (pageIndex) {
                var page = _hash.getHashJson().pageindex;
                var pageIndex = pageIndex || page || 1;
                var w_hash = window.location.hash;
                if (page) {
                    window.location.hash = w_hash.replace(/pageindex=[\d]+/, 'pageindex=' + pageIndex);
                } else {
                    window.location.hash += '&pageindex=' + pageIndex;
                }
                var pageSize = 10;
                var category_tbody = category.find('tbody');
                var _page = category.find('.pagination').empty();
                category_tbody.html("<tr ><td colspan=\"3\" align='center'><div class='list-loading'>正在加载......</div></td></tr>");
                $.ajax({
                    url: i8_session.ajaxWfHost + 'webajax/setting/getCategory',
                    type: 'get',
                    data: {pageIndex: pageIndex, pageSize: pageSize},
                    dataType: 'json',
                    success: function (data) {
                        if (!data.Result) {
                            category_tbody.html('<tr><td colspan="3" align="center">' + data.Description + '</td></tr>');
                            return;
                        }
                        if (data.ReturnObject.Item2.length == 0) {
                            category_tbody.html('<tr><td colspan="3" align="center">暂无数据</td></tr>');
                            return;
                        }
                        var tpl = require('default/template/design/category-list.tpl');
                        var render = template(tpl);
                        var html = render(data.ReturnObject);
                        category_tbody.html(html);
                        fw_page.pagination({
                            ctr: _page,
                            totalPageCount: data.ReturnObject.Item1,
                            pageSize: 10,
                            current: pageIndex,
                            fun: function (new_current_page, containers) {
                                getCategory(new_current_page);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }, error: function (e1, e2, e3) {
                        category_tbody.html('<tr><td colspan="3" align="center">获取流程类别列表时请求超时，请检查网络！</td></tr>');
                    }
                });
            }

            var getDataSourceList = function (pageIndex) {
                var page = _hash.getHashJson().pageindex;
                var pageIndex = pageIndex || page || 1;
                var w_hash = window.location.hash;
                if (page) {
                    window.location.hash = w_hash.replace(/pageindex=[\d]+/, 'pageindex=' + pageIndex);
                } else {
                    window.location.hash += '&pageindex=' + pageIndex;
                }
                var pageSize = 10;
                var processdata = $('#processdata');
                var processdatarender = template(require('default/template/design/processdatalist.tpl'));
                var _page = processdata.find('.pagination').empty();
                //var getSourceData = function () {
                $.ajax({
                    url: i8_session.ajaxWfHost + 'webajax/setting/getDataSourceList',
                    type: 'get',
                    data: {pageIndex: pageIndex, pageSize: pageSize},
                    dataType: 'json',
                    beforeSend: function () {
                        processdata.find('tbody').html('<tr><td colspan="4" align="center"><div class="list-loading">加载中.....</div></td></tr>');
                    },
                    success: function (data) {
                        //  var processdata_content =
                        processdata.find('tbody').html(processdatarender({data: data.ReturnObject.Item2}));

                        fw_page.pagination({
                            ctr: _page,
                            totalPageCount: data.ReturnObject.Item1,
                            pageSize: 10,
                            current: pageIndex,
                            fun: function (new_current_page, containers) {
                                getDataSourceList(new_current_page);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }, error: function (data) {

                    }
                })
                //  }
            }
            getDataSourceList(1);

            var fnAjaxGetsubnodelistByID = function (id, callback) {
                $.get(i8_session.ajaxWfHost + "webajax/form/getsubnodelist?" + Math.random(), {mitemid: id}, function (data) {
                    if (data.Result) {
                        // window["sourceLib"][id]=data.ReturnObject.Items;//更新
                        if ($.isFunction(callback)) {
                            //callback({result: true, msg: 'update success!'});
                            callback(data.ReturnObject);
                        }
                    }
                }, "json");
            };

            //删除数据源
            var fnDelDataSource = function (sourceid, callback) {

                $.get(i8_session.ajaxWfHost + "webajax/setting/delDataSource", {  sourceid: sourceid }, function (response) {
                    var _retObj = response.ReturnObject;
                    if (!!_retObj && $.isArray(_retObj) && _retObj.length > 0) {
                        //alert('您的数据源被以下流程占用:<br/>'+_retObj.join(',')+'<br/>请在相关流程里删除数据源绑定后再删除此数据源！');
                        i8ui.showbox({'title': '删除失败！'});
                        //, 'cont': '<div style="line-height: 20px;padding:20px;"><div style="font-weight: bold">您的数据源被以下流程占用:</div><br/><div style="color:red">' + _retObj.join(',') + '</div><br/><div style="font-weight: bold">请在相关流程里删除数据源绑定后再删除此数据源！</div></div>'});
                        return;
                    }
                    if (response.Result) {
                        getDataSourceList();
                        // $(_this).replaceWith('<span class="span_dsn_value" title="双击修改数据源名">' + newvalue + '</span>');

                    } else {
                        alert(response.Description);
                    }
                }, "json");
            }

            var fnGetProcDataSource = function (sourceid, callback) {


                $.get(i8_session.ajaxWfHost + "webajax/setting/getProcDataSource", {  sourceid: sourceid }, function (response) {
                    var _retObj = response.ReturnObject;
                    if (!!_retObj && $.isArray(_retObj) && _retObj.length > 0) {
                        if($.isFunction(callback)){
                            callback(_retObj);
                            return;
                        }
//                        //alert('您的数据源被以下流程占用:<br/>'+_retObj.join(',')+'<br/>请在相关流程里删除数据源绑定后再删除此数据源！');
//                        i8ui.showbox({'title': '删除失败！', 'cont': '<div style="line-height: 20px;padding:20px;"><div style="font-weight: bold">您的数据源被以下流程占用:</div><br/><div style="color:red">' + _retObj.join(',') + '</div><br/><div style="font-weight: bold">请在相关流程里删除数据源绑定后再删除此数据源！</div></div>'});
//                        return;
                    }

                    if (response.Result) {
                        // callback(_retObj);
                        i8ui.confirm({
                                title: '是否确认删除?'},
                            function (divDom) {
                                fnDelDataSource(sourceid,getDataSourceList);
                                //fnDelDataSource(_sourceId);
                            }
                        );

                    } else {
                        alert(response.Description);
                    }
                }, "json");
            }

            //添加主数据源
            var fnAddMainDataSource = function (newdsname) {
                var newdsname = newdsname || '';
                if (newdsname.length == 0) {
                    alert('请输入数据源名!');
                    return false;
                }
                if (newdsname.length > 20) {
                    alert('字符串长度不得大于20');
                    return false;
                }

                white_list.lastIndex = 0;
                if (!white_list.test(newdsname)) {
                    alert('数据源名称中包含非法字符！');
                    return false;
                } else {
                    $.post(i8_session.ajaxWfHost + "webajax/form/addmainsource", {sname: encodeURIComponent(newdsname)}, function (response) {
                        if (response.Result) {
                            getDataSourceList();
                        } else {
                            alert(response.Description);
                        }
                    }, "json");
                }
            }

            //更新数据源
            var fnUpdateDataSource = function (sourceid, newvalue) {
                // var newvalue = $(this).val();
                if (newvalue.length > 20) {
                    alert('数据源长度超出20个字符的限制！');
                    return false;
                }
                white_list.lastIndex = 0;
                if (!white_list.test(newvalue)) {
                    alert('数据源名称中包含非法字符！');
                    return;
                }
                //var sourceid = $(this).parent().attr("sourceid");
                var _this = this;
                $.get(i8_session.ajaxWfHost + "webajax/form/updatesourcename", { nsname: encodeURIComponent(newvalue), sourceID: sourceid }, function (response) {
                    if (response.Result) {
                        getDataSourceList();
                        // $(_this).replaceWith('<span class="span_dsn_value" title="双击修改数据源名">' + newvalue + '</span>');
                        return true;
                    } else {
                        alert(response.Description);
                    }
                }, "json");
            }

            $("#processdata").on("click", ".setting-datasource-eidt", function () {
                var _$me = $(this);
                if(_$me.attr("class").indexOf("disabled")>=0){
                    return;
                }
                var _$tr = _$me.parents('tr');
                var _sourceid = _$me.parent('td').attr('sourceid');
                var _origvalue = $.trim(_$tr.find('td').first().text());
                var _html = '<span class="ipt_datasourcename">数据源名称：</span><input type="text" class="ipt_tempUpdateText" style="width:140px" value="' + _origvalue + '"/>';
                i8ui.confirm({
                    title: _html,
                    body: '<div style="height:36px;line-height: 36px;border-bottom:1px solid #47C7EA;padding-left:4px;font-weight: bold;font-size:16px;">修改名称</div>',
                    success: function () {

                    }
                }, function (divDom) {
                    var _dataSourceValue = $('.ipt_tempUpdateText').val();
                    // if(!_data)
                    fnUpdateDataSource(_sourceid, _dataSourceValue);
                });
//                function (divDom) {
//                    divDom.close();

                //$(this).replaceWith($('<input type="text" class="ipt_tempUpdateText" style="width:100px" value="' + origvalue + '"/>').blur(function () {
//                var showbox = $.MsgBox({
//                    title:"修改名称",
//                    content: _html,
//                    isdrag: false,
//                    showBtns: true,
//                    confirmClick: function (data) {
//                        showbox.closeBox();
//                        fnUpdateDataSource(_sourceid,$('.ipt_tempUpdateText').val());
//                        //loadDataResource();
//                        //dataCache.updateSourceByID(drow.ID);
//                    },
//                    btncanceltxt: "关闭",
//                    cancelClick: function (data) {
//                        //dataCache.updateSourceByID(drow.ID);
//                    }
//                });
//                showbox.show();
                // }));
                //  $(".ipt_tempUpdateText").focus();
            })

            $("#processdata").on("click", ".setting-datasource-eidtsub", function () {
                var _$me = $(this);
                if(_$me.attr("class").indexOf("disabled")>=0){
                    return;
                }
                var _$tr = _$me.parents('tr');
                var _origvalue = $.trim(_$tr.find('td').first().text());
                var _sourceId = $(this).parent('td').attr('sourceid');
                var _callback = function (data) {
                    var _html = '';
                    var _result = _.sortBy(data.Items, function (item) {
                        return item.SortIndex;
                    })
                    for (var i = 0, len = _result.length; i < len; i++) {
                        _html += '<tr class="srcItems" gid="' + _result[i].DataSourceID + '" tr-data=\'' + encodeURIComponent(util.toJsonString(_result[i])) + '\' status="1"><td class="proptext">' + _result[i].Text + '</td><td class="td_sort" align="center">' + _result[i].SortIndex + '</td><td class="td_edit editState" align="center"><a class="ds_row_save" sourceid="' + _result[i].DataSourceID + '" itemid="' + _result[i].ID + '">保存</a> <a class="ds_row_cancel">取消</a> <a class="ds_row_edit">编辑</a> <a class="ds_row_delete" itemid="' + _result[i].ID + '">删除</a> <a itemid="' + _result[i].ID + '" sourceid="' + _result[i].DataSourceID + '" class="ds_row_subset">子集</a></td></tr>';
                    }
                    var content = ('<div class="div_editSource" style="min-height:100px;width: 428px;" id="editSourceContentBox"><table><thead><tr><th>属性值名</th><th>排序</th><th align="center">操作</th></tr></thead><tbody>' + _html + '</tbody><tfoot><tr><td></td><td></td><td style="height:25px;line-height:25px;text-align:center"><a class="a_add_row">新增</a></td></tr></tfoot></table></div>');
                    //dataCache.getSourceByID(drow.ID,function(datalist){
                    var pre_appendCon = "";
                    i8ui.confirm({
                        title: content,
                        body: '<div style="width:490px;height:36px;line-height: 36px;border-bottom:1px solid #47C7EA;padding-left:4px;font-weight: bold;font-size: 16px;">数据源管理--' + _origvalue + '</div>',
                        success: function () {

                        }
                    }, function (divDom) {

                    });
                    getRunProcDataSourceAndLine(_sourceId||'',function(data){
                        if(data.Item1.length>0 || data.Item2.length>0) {
                            var _html1 = '',_html2 = '',_resultHtml = '',_tipHtml = '';
                            if(data.Item1.length>0){
                                _html1 = '<div><span style="font-weight: bold">此数据源已被以下流程占用:</span><br/>'+data.Item1.join(',')+'</div><br/>';
                            }
                            if(data.Item2.length>0){
                                _html2 = '<div><span style="font-weight: bold">此数据源已参与以下流程分支条件:</span><br/>'+data.Item2.join(',')+'</div><br/>';
                            }
                            if(!!_html1 && !!_html2){
                                _tipHtml = '<div class="popup-datasource-tips">提示：为了不影响流程正常使用，请在修改数据源后及时更新相关流程设计！</div>';
                            }
                            _resultHtml = '<div class="popup-datasrouce-container">'+_html1+_html2+_tipHtml+'</div>';
                            $('.ct-ly').find('.tcenter').before(_resultHtml);
                        }
                    })
                    tablEventBind({ID: _sourceId, Name: _origvalue});
                }

                fnAjaxGetsubnodelistByID(_sourceId, _callback);


                //sourceEditDialog(_origvalue);
            })

            $("#processdata").on("click", ".setting-datasource-delete", function () {
                if($(this).attr("class").indexOf("disabled")>=0){
                    return;
                }
                var _sourceId = $(this).parent('td').attr('sourceid'),
                    _title = '是否确认删除<br/>';
                fnGetProcDataSource(_sourceId,function(data){
                    var _content = '';
                    if($.isArray(data)&& data.length>0){
                        _content += '<div style="font-weight: bold">您的数据源被以下流程占用:</div>';
                        _content += '<div style="color:red">'+data.join(',')+'</div>';
                        _content += '<div style="font-weight: bold">请在相关流程里删除数据源绑定后再删除此数据源！</div>';
                    }
                    i8ui.confirm({
                            title: _title+_content},
                        function (divDom) {
                            //fnDelDataSource(_sourceId);
                        }
                    );
                });
            })
            getCategory();
        })();

        //专项角色
        $(function () {

            var specialrole = $('#specialrole');
            var userList = '';
            //删除专项角色数据
            specialrole.on('click', '.btn-delete.control-delete', function () {
                var _role_op = $(this).parents('.control-zxrole-op');
                var _roleid = _role_op.attr('id');
                // fnGetProcNameByRoleId(_roleid,function(data){

                //  })
                //var _deleteTips =
                fnGetProcNameByRoleId(_roleid, function (data) {
                    var _deletetip = '';
                    if ($.isArray(data) && data.length > 0) {
                        _deletetip = '经检测，当前此角色参与流程设计共<em style="color:red">' + data.length + '</em>支<br/>(<span>' + data.join(',') + '</span>)<br/>';
                    }
                    deleteRoleList(_role_op, function () {
                        getRoleList(1);
                    }, _deletetip);
                });
            });

            //删除专项角色数据
            specialrole.on('click', '.btn-delete.control-disable', function () {
                i8ui.alert({title: '系统角色，不能删除！'});
            });

            //编辑专项角色数据
            specialrole.on('click', '.btn-edit-one.control-edit', function () {
                var _role_op = $(this).parents('.control-zxrole-op');
                var _roleid = _role_op.attr('id');
                outputWin({_role_op: _role_op, operation: 'update', title: '编辑', fun: function () {
                    fnGetProcNameByRoleId(_roleid, function (data) {
                        if ($.isArray(data) && data.length > 0) {
                            $('#role_participant_process').html('经检测，当前角色参与流程共<em style="color:red">' + data.length + '</em>支<br/>(<em>' + data.join(',') + '</em>)').show();
                        }
                    });
                }});
            });

            //添加专项角色数据
            specialrole.on('click', '.add', function () {
                outputWin({operation: 'add', title: '新增'});
            });


            //获取专项角色数据
            var getRoleList = function (pageIndex) {
                var specialrole_content = specialrole.find('.sys-zxrole-list');
                specialrole_content.html('<table width="100%"><tr><td align="center"><div class="list-loading">正在加载......</div></td></tr></table>');
                var page = _hash.getHashJson().pageindex;
                var pageIndex = pageIndex || page || 1;
                var w_hash = window.location.hash;
                if (page) {
                    window.location.hash = w_hash.replace(/pageindex=[\d]+/, 'pageindex=' + pageIndex);
                } else {
                    window.location.hash += '&pageindex=' + pageIndex;
                }
                var pageSize = 10;
                var _page = specialrole.find('.pagination');
                $.ajax({
                    url: i8_session.ajaxWfHost + 'webajax/setting/getRoleData',
                    type: 'get',
                    data: {pageIndex: pageIndex, pageSize: pageSize},
                    dataType: 'json',
                    success: function (data) {
                        if (!data.Result) {
                            specialrole_content.html('<table width="100%"><tr><td align="center">' + data.Description + '</td></tr></table>');
                            return;
                        }
                        if (data.ReturnObject.Item2.length == 0) {
                            specialrole_content.html('<div class="sys-zxrole-op add">+增加新角色</div>');
                            return;
                        }
                        var tpl = require('default/template/design/specialrole.tpl');
                        var render = template(tpl);
                        var html = render(data);
                        specialrole_content.html(html);
                        fw_page.pagination({
                            ctr: _page,
                            totalPageCount: data.ReturnObject.Item1,
                            pageSize: pageSize,
                            current: pageIndex,
                            fun: function (new_current_page, containers) {
                                getRoleList(new_current_page);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }, error: function (e1, e2, e3) {
                        specialrole_content.html('获取专项角色列表时请求超时，请检查网络！');
                    }
                });
            }

            //删除专项角色数据
            var deleteRoleList = function (_role_op, callback, deletetips) {
                var adminRoleId = _role_op.attr('id');
                var _deletetips = deletetips || '';
                // if ($.isFunction(deletefun)) {


                i8ui.confirm({
                        title: '确认删除吗？<br/>' + _deletetips + '<span class="red">删除后，该专项角色审批、执行、收文时将直接跳过，设置的固定收文人也将直接删除无法收文！</span>',
                        cont: ''
                    },
                    function (divDom) {
                        divDom.close();
                        $.ajax({
                            url: i8_session.ajaxWfHost + 'webajax/setting/deleteAdminRole',
                            type: 'get',
                            data: 'adminRoleId=' + adminRoleId,
                            dataType: 'json',
                            success: function (data) {
                                if (!data.Result) {
                                    i8ui.alert({title: '删除失败,' + data.Description});
                                    return;
                                }
                                i8ui.alert({title: '删除成功！', type: 2});
                                callback(data);
                            }, error: function (e1, e2, e3) {
                                i8ui.alert({title: '删除专项角色时请求超时，请检查网络！'});
                            }
                        });
                    });

                /*$.ajax({
                 url:i8_session.ajaxWfHost+'webajax/setting/getRoleCount',
                 type: 'get',
                 data: 'adminRoleId='+adminRoleId,
                 dataType: 'json',
                 success: function (data) {
                 if(!data.Result){
                 i8ui.alert({title:'查询失败,'+data.Description});
                 return;
                 }
                 if(data.ReturnObject>0){
                 i8ui.alert({title:'已有流程使用了该专项角色，不能删除！'});
                 return;
                 }
                 i8ui.confirm({
                 title:'确认删除吗？'
                 },
                 function(divDom){
                 divDom.close();
                 $.ajax({
                 url:i8_session.ajaxWfHost+'webajax/setting/deleteAdminRole',
                 type: 'get',
                 data: 'adminRoleId='+adminRoleId,
                 dataType: 'json',
                 success: function (data) {
                 if(!data.Result){
                 i8ui.alert({title:'删除失败,'+data.Description});
                 return;
                 }
                 i8ui.alert({title:'删除成功！',type:2});
                 callback(data);
                 },error: function(e1,e2,e3){
                 i8ui.alert({title:'删除专项角色时请求超时，请检查网络！'});
                 }
                 });
                 });
                 },error: function(e1,e2,e3){
                 i8ui.alert({title:'检查是否已有流程使用了该专项角色时请求超时，请检查网络！'});
                 }
                 });*/
            }

            //弹出窗口
            var outputWin = function (options, callback) {
                var _title = '<div >' + options.title + ' 专项角色</div>';


                var tpl = require('default/template/design/specialrole-pop.tpl');
                var render = template(tpl);
                var _scontent = render({});
                i8ui.showNoTitle({title: _title, cont: _scontent});
                userList = fw_selector.KSNSelector({ model: 2, element: '#userlist', width: '370', isAbox: true});
                if (options._role_op) {
                    var users= _.map(options._role_op.attr('userid').split(','),function(item){
                        return{
                            "type":"user",
                            id: item
                        }
                    });
                    userList.setAllselectedData(users);
                    var _role_name = $('#role_name').val(options._role_op.attr('rolename'))
                    if (options._role_op.attr('issys') == 'true') {
                        _role_name.attr('readonly', 'readonly');
                    }

                    if ($.isFunction(options.fun)) {
                        options.fun();
                    }
                }
                $('#role_save').on('click', function () {
                    var role_name = $('#role_name').val();
                    var userid = userList.selectedData();
                    if (!role_name) {
                        i8ui.alert({title: '角色名称不能为空！'});
                        return;
                    }
                    if (!userid) {
                        i8ui.alert({title: '指定人员不能为空！'});
                        return;
                    }
                    var _param = 'rolename=' + encodeURIComponent(role_name) + '&userid=' + userid;

                    if (options.operation == 'update') {
                        _param += '&operation=update&RoleId=' + options._role_op.attr('id');
                    }
                    else {
                        _param += '&operation=add';
                    }
                    $.ajax({
                        url: i8_session.ajaxWfHost + 'webajax/setting/saveAdminRole',
                        type: 'get',
                        data: _param,
                        dataType: 'json',
                        success: function (data) {
                            if (!data.Result) {
                                i8ui.alert({title: '保存失败,' + data.Description});
                                return;
                            }
                            $('.ct-close').trigger('click');
                            i8ui.alert({title: '保存成功！', type: 2});
                            getRoleList();
                        }, error: function (e1, e2, e3) {
                            i8ui.alert({title: '保存专项角色是请求超时，请检查网络！'});
                        }
                    });
                })
            }
            getRoleList();
        })


        //数据源管理
//        (function(){

//            var processdata=$('#processdata');
//            var processdatarender=template(require('default/template/design/processdatalist.tpl'));
//            var getSourceData=function(){
//                var processdata_content=processdata.find('tbody').html(processdatarender({loading:true}));
//            }
//            getSourceData();
//        })
    }
    PageInit();//页面初始化

});