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
    //var white_list = /^[����������������������������'"~=@#%_\:\!\$\^\*\(\)\+\|\-\\\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
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
    //ҳ���ʼ��
    var PageInit = function () {
        var hash = _hash.getHashJson(window.location.hash);
        $('#' + hash.page).show();
        $('.app-menu-navigation div[listtype=' + hash.page + ']').parent().addClass('current');
        $('.app-menu-navigation').on('click', 'li', function () {
            $('.app-menu-navigation').find('.current').removeClass('current');
            $(this).addClass('current');
        })

        //���ݽ�ɫid��ȡ��������
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

        //�˵�ע��
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

        //������������
        (function () {
            var category = $('#category');
            var isEdit = false;

            //������������ �༭ ��ťע��
            category.on('click', '.btn-edit-one', function () {
                if (!isEdit) {
                    isEdit = true;
                    changeView($(this), 1);
                }
                else {
                    i8ui.alert({title: '���ڱ༭�У����ȱ����ȡ����'});
                }
            });

            //������������ ȡ�� ��ťע��
            category.on('click', '.btn-cancel', function () {
                isEdit = false;
                var _this = $(this);
                if (!_this.parent().attr('categoryid')) {
                    _this.parents('tr').remove();
                } else {
                    changeView($(_this), 0);
                }
            });

            //������������ ���� ��ťע��
            category.on('click', '.btn-save', function () {
                var _this = $(this);
                var _tr = $(this).parents('tr');
                saveCategory(_tr, function (data) {
                    i8ui.alert({title: '����ɹ���', type: 2})
                    getCategory(1);
                    isEdit = false;
                });
            });

            //������������ ɾ�� ��ťע��
            category.on('click', '.btn-delete', function () {
                var _this = $(this);
                deleteCategory(_this.parent().attr('categoryid'), function () {
                    getCategory(1);
                    i8ui.alert({title: 'ɾ���ɹ���', type: 2})
                })
            });

            //������������ ��� ��ťע��
            category.on('click', '.sys-mgadd-btn', function () {
                if (isEdit) {
                    i8ui.alert({title: '���ڱ༭�У����ȱ����ȡ����'});
                    return;
                }
                isEdit = true;
                category.find('table tbody').append('<tr></tr><td class="p-l-50"><input class="l-h20 b-colorcfc" id="className"></td>\
                    <td class="p-l-50"><input class="l-h20 b-colorcfc" id="sortIndex" ></td>\
                    <td></td>\
                    <td class="p-l-l10" ><a class="design-bg-icons3 btn-save">����</a><a class="example_bg_icon1 btn-cancel">ȡ��</a></td></tr>');
            });

            //�ı���ʾ
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
                    td3.html('<a class="design-bg-icons3 btn-save">����</a><a class="example_bg_icon1 btn-cancel">ȡ��</a>')

                } else {
                    td1.html(_tr.attr('CategoryName'));
                    td2.html(_tr.attr('SortIndex'));
                    td3.html('<a class="design-bg-icons3 btn-edit-one">�༭</a><a class="example_bg_icon1 btn-delete edit-icon">ɾ��</a>')
                }
            }

            //����IDɾ���������
            var deleteCategory = function (categoryID, callback) {
                var _title = 'ȷ��Ҫɾ����';
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
                                _title = '�÷�����������,ȷ��Ҫɾ����? ɾ�������̽���鵽δ����Ŀ¼��';
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
                                    i8ui.alert({title: 'ɾ��ʧ�ܣ�' + data.Description})
                                }
                                callback();
                            }
                        })
                    });
            }

            //�����������  �����  �޸ģ�
            var saveCategory = function (_tr, callback) {
                var className = $.trim($('#className').val());
                var sortIndex = parseInt($('#sortIndex').val());
                if (!className) {
                    i8ui.alert({title: '������Ʋ���Ϊ�գ�'});
                    return;
                }
                if ((!sortIndex) || $.type(sortIndex) !== 'number') {
                    i8ui.alert({title: '�����ֵ����Ϊ�ǿ�������'});
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
                        i8ui.alert({title: '�����������ʱ����ʱ���������磡'});
                    }
                })
            }
            $('#processdata').on('click', '.sys-mgadd-btn', function () {

                var _html = '<span class="ipt_datasourcename">����Դ���ƣ�</span><input type="text" class="ipt_tempUpdateText" style="width:140px" >';
                i8ui.confirm({
                    title: _html,
                    body: '<div style="height:36px;line-height: 36px;font-weight:bold;font-size:16px;border-bottom:1px solid #47C7EA;padding-left:4px">����Դ����</div>',
                    success: function () {

                    }
                }, function (divDom) {
                    fnAddMainDataSource($('.ipt_tempUpdateText').val());
                });

                //  i8ui.showNoTitle();
            })

            //����Դ�Ӽ����ݲ���
            var tablEventBind = function (drow) {
                /*�������Դ���*/
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
                        alert('����ֵ�а����Ƿ��ַ���');
                        return false;
                    }
                    var go = true;
                    cRow.siblings(".srcItems").each(function () {
                        if ($("td.proptext", $(this)).text() == inputvalue) {
                            alert('������ֵ�Ѵ���!');
                            go = false;
                            $(_athis).removeClass("a-disable");
                        }
                    });
                    if (inputvalue.length == 0) {
                        alert('δ��д����ֵ!');
                        go = false;
                        $(this).removeClass("a-disable");
                    }
                    if (go) {
                        //������棬���ֵû�б䣬�򴥷�ȡ����ť
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
                                    alert('����ʧ�ܣ�' + response.Description);
                                    $(_athis).removeClass("a-disable");
                                }
                            }, "json");
                    }
                });
                /*����Ӽ�*/
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
                        var subsetBox = $('<div class="subsetListBox" parentid="' + parentid + '" sourceid="' + sourceid + '"><div style="line-height:30px;text-align:center;color:#37A7E0;background:#f1f1f1">"' + curRourceName + '"�Ӽ�</div><table class="subsettable"><thead><tr><th>����</th><th>����</th></tr></thead><tbody></tbody><tfoot><tr><td></td><td><a class="add_subsetitem">���</a></td></tr></tfoot></table></div>');
                        //$('#editSourceContentBox').after(subsetBox);
                        $('body').append(subsetBox);
                        var trDataStr = $(_thisTr).parents(".srcItems").attr("tr-data");
                        if (!!trDataStr) {
                            var dataStr = decodeURIComponent(trDataStr);
                            dataStr = dataStr.replace(/\:null/ig,':"null"').replace(/\t/g,"");
                            var trData = $.parseJSON(dataStr);// $.parseJSON(decodeURIComponent(trDataStr));
                            var subColStr = '';
                            _.each(trData.subItems, function (ditem) {
                                subColStr += '<tr class="tb_subset_row" targetid="' + gid + '" asetid="' + ditem.ID + '" tr-data=' + encodeURIComponent(util.toJsonString(ditem)) + '><td class="tb_subsetrow_item">' + ditem.Text + '</td><td class="tb_subsetrow_control"><a targetid="' + gid + '"  class="row_subset_delete">ɾ��</a></td></tr>';
                            });
                            subsetBox.find("tbody").html(subColStr);
                        }
                        //fillSubsetList(sourceid, gid, subsetBox.find("tbody"));

                        // '<tr class="tb_subset_row" asetid="' + _subset[k].id + '"><td class="tb_subsetrow_item">' + _subset[k].text + '</td><td><a class="row_subset_delete">ɾ��</a></td></tr>';

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
                        /*�Ӽ��󶨱���*/
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
                                alert('�����Ϊ�գ�');
                                submit = false;
                                $(this).removeClass("a-disable");
                            }
                            subset_table.find("td.tb_subsetrow_item").each(function () {
                                if (addvalue == $.trim($(this).text())) {
                                    submit = false;
                                    alert('������Ѵ��ڣ�');
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
                                            //��ȡ���ڵ�洢���ӽڵ���Ϣ��Ȼ����������ӵ��ӽڵ���ٴ洢ԭ�ڵ�
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
                                            $(_thisa).parent().html('<a class="row_subset_delete">ɾ��</a>');
                                            //loadDataResource();
                                            /*��������Դ*/
                                        } else {
                                            alert('����ʧ�ܣ�' + response.Description);
                                            $(_thisa).removeClass("a-disable");
                                        }
                                    }, "json");
                            }
                        });
                        /*�Ӽ���ɾ��*/
                        subsetBox.delegate("a.row_subset_delete", "click", function () {
                            var itemthisrow = $(this).parents("tr.tb_subset_row");
                            var itemID = itemthisrow.attr("asetid");
                            var thisTargetid = itemthisrow.attr('targetid');
                            if (confirm('ȷ��ɾ����������?')) {
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
                                            /*��������Դ*/
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

                                alert('���ȱ���δ���������ݣ�');
                                return;
                            }
                            $(this).parents("table.subsettable").find("tbody").append('<tr class="tb_subset_row"><td class="tb_subsetrow_item"><input type="text" class="srcsubset"/></td><td class="row_subset_save_container"><a class="row_subset_save">����</a></td></tr>');
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
                /*ɾ������Դ��*/
                $("#editSourceContentBox table").delegate(".ds_row_delete", "click", function () {
                    if (confirm('ȷ��ɾ��������Դ��?')) {
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
                    $("#editSourceContentBox table tbody").append('<tr class="srcItems" gid="00000000-0000-0000-0000-000000000000" value="" status="1"><td class="proptext"><input type="text" class="srcIptAdd" /></td><td class="td_sort" align="center"><input type="text"  class="srcIptIndexAdd  editName-text-box-index" value="' + sort + '" /></td><td class="td_edit saveState" align="center"><a class="ds_row_save" sourceid=' + drow.ID + '>����</a> <a class="ds_row_cancel">ȡ��</a> <a class="ds_row_edit">�༭</a> <a class="ds_row_delete ds_subrow_delete">ɾ��</a> <a class="ds_row_subset"  sourceid=' + drow.ID + '>�Ӽ�</a></td></tr>');
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


            //��ȡ��������б�
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
                category_tbody.html("<tr ><td colspan=\"3\" align='center'><div class='list-loading'>���ڼ���......</div></td></tr>");
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
                            category_tbody.html('<tr><td colspan="3" align="center">��������</td></tr>');
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
                                text: '��ת'
                            }
                        });
                    }, error: function (e1, e2, e3) {
                        category_tbody.html('<tr><td colspan="3" align="center">��ȡ��������б�ʱ����ʱ���������磡</td></tr>');
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
                        processdata.find('tbody').html('<tr><td colspan="4" align="center"><div class="list-loading">������.....</div></td></tr>');
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
                                text: '��ת'
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
                        // window["sourceLib"][id]=data.ReturnObject.Items;//����
                        if ($.isFunction(callback)) {
                            //callback({result: true, msg: 'update success!'});
                            callback(data.ReturnObject);
                        }
                    }
                }, "json");
            };

            //ɾ������Դ
            var fnDelDataSource = function (sourceid, callback) {

                $.get(i8_session.ajaxWfHost + "webajax/setting/delDataSource", {  sourceid: sourceid }, function (response) {
                    var _retObj = response.ReturnObject;
                    if (!!_retObj && $.isArray(_retObj) && _retObj.length > 0) {
                        //alert('��������Դ����������ռ��:<br/>'+_retObj.join(',')+'<br/>�������������ɾ������Դ�󶨺���ɾ��������Դ��');
                        i8ui.showbox({'title': 'ɾ��ʧ�ܣ�'});
                        //, 'cont': '<div style="line-height: 20px;padding:20px;"><div style="font-weight: bold">��������Դ����������ռ��:</div><br/><div style="color:red">' + _retObj.join(',') + '</div><br/><div style="font-weight: bold">�������������ɾ������Դ�󶨺���ɾ��������Դ��</div></div>'});
                        return;
                    }
                    if (response.Result) {
                        getDataSourceList();
                        // $(_this).replaceWith('<span class="span_dsn_value" title="˫���޸�����Դ��">' + newvalue + '</span>');

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
//                        //alert('��������Դ����������ռ��:<br/>'+_retObj.join(',')+'<br/>�������������ɾ������Դ�󶨺���ɾ��������Դ��');
//                        i8ui.showbox({'title': 'ɾ��ʧ�ܣ�', 'cont': '<div style="line-height: 20px;padding:20px;"><div style="font-weight: bold">��������Դ����������ռ��:</div><br/><div style="color:red">' + _retObj.join(',') + '</div><br/><div style="font-weight: bold">�������������ɾ������Դ�󶨺���ɾ��������Դ��</div></div>'});
//                        return;
                    }

                    if (response.Result) {
                        // callback(_retObj);
                        i8ui.confirm({
                                title: '�Ƿ�ȷ��ɾ��?'},
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

            //���������Դ
            var fnAddMainDataSource = function (newdsname) {
                var newdsname = newdsname || '';
                if (newdsname.length == 0) {
                    alert('����������Դ��!');
                    return false;
                }
                if (newdsname.length > 20) {
                    alert('�ַ������Ȳ��ô���20');
                    return false;
                }

                white_list.lastIndex = 0;
                if (!white_list.test(newdsname)) {
                    alert('����Դ�����а����Ƿ��ַ���');
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

            //��������Դ
            var fnUpdateDataSource = function (sourceid, newvalue) {
                // var newvalue = $(this).val();
                if (newvalue.length > 20) {
                    alert('����Դ���ȳ���20���ַ������ƣ�');
                    return false;
                }
                white_list.lastIndex = 0;
                if (!white_list.test(newvalue)) {
                    alert('����Դ�����а����Ƿ��ַ���');
                    return;
                }
                //var sourceid = $(this).parent().attr("sourceid");
                var _this = this;
                $.get(i8_session.ajaxWfHost + "webajax/form/updatesourcename", { nsname: encodeURIComponent(newvalue), sourceID: sourceid }, function (response) {
                    if (response.Result) {
                        getDataSourceList();
                        // $(_this).replaceWith('<span class="span_dsn_value" title="˫���޸�����Դ��">' + newvalue + '</span>');
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
                var _html = '<span class="ipt_datasourcename">����Դ���ƣ�</span><input type="text" class="ipt_tempUpdateText" style="width:140px" value="' + _origvalue + '"/>';
                i8ui.confirm({
                    title: _html,
                    body: '<div style="height:36px;line-height: 36px;border-bottom:1px solid #47C7EA;padding-left:4px;font-weight: bold;font-size:16px;">�޸�����</div>',
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
//                    title:"�޸�����",
//                    content: _html,
//                    isdrag: false,
//                    showBtns: true,
//                    confirmClick: function (data) {
//                        showbox.closeBox();
//                        fnUpdateDataSource(_sourceid,$('.ipt_tempUpdateText').val());
//                        //loadDataResource();
//                        //dataCache.updateSourceByID(drow.ID);
//                    },
//                    btncanceltxt: "�ر�",
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
                        _html += '<tr class="srcItems" gid="' + _result[i].DataSourceID + '" tr-data=\'' + encodeURIComponent(util.toJsonString(_result[i])) + '\' status="1"><td class="proptext">' + _result[i].Text + '</td><td class="td_sort" align="center">' + _result[i].SortIndex + '</td><td class="td_edit editState" align="center"><a class="ds_row_save" sourceid="' + _result[i].DataSourceID + '" itemid="' + _result[i].ID + '">����</a> <a class="ds_row_cancel">ȡ��</a> <a class="ds_row_edit">�༭</a> <a class="ds_row_delete" itemid="' + _result[i].ID + '">ɾ��</a> <a itemid="' + _result[i].ID + '" sourceid="' + _result[i].DataSourceID + '" class="ds_row_subset">�Ӽ�</a></td></tr>';
                    }
                    var content = ('<div class="div_editSource" style="min-height:100px;width: 428px;" id="editSourceContentBox"><table><thead><tr><th>����ֵ��</th><th>����</th><th align="center">����</th></tr></thead><tbody>' + _html + '</tbody><tfoot><tr><td></td><td></td><td style="height:25px;line-height:25px;text-align:center"><a class="a_add_row">����</a></td></tr></tfoot></table></div>');
                    //dataCache.getSourceByID(drow.ID,function(datalist){
                    var pre_appendCon = "";
                    i8ui.confirm({
                        title: content,
                        body: '<div style="width:490px;height:36px;line-height: 36px;border-bottom:1px solid #47C7EA;padding-left:4px;font-weight: bold;font-size: 16px;">����Դ����--' + _origvalue + '</div>',
                        success: function () {

                        }
                    }, function (divDom) {

                    });
                    getRunProcDataSourceAndLine(_sourceId||'',function(data){
                        if(data.Item1.length>0 || data.Item2.length>0) {
                            var _html1 = '',_html2 = '',_resultHtml = '',_tipHtml = '';
                            if(data.Item1.length>0){
                                _html1 = '<div><span style="font-weight: bold">������Դ�ѱ���������ռ��:</span><br/>'+data.Item1.join(',')+'</div><br/>';
                            }
                            if(data.Item2.length>0){
                                _html2 = '<div><span style="font-weight: bold">������Դ�Ѳ����������̷�֧����:</span><br/>'+data.Item2.join(',')+'</div><br/>';
                            }
                            if(!!_html1 && !!_html2){
                                _tipHtml = '<div class="popup-datasource-tips">��ʾ��Ϊ�˲�Ӱ����������ʹ�ã������޸�����Դ��ʱ�������������ƣ�</div>';
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
                    _title = '�Ƿ�ȷ��ɾ��<br/>';
                fnGetProcDataSource(_sourceId,function(data){
                    var _content = '';
                    if($.isArray(data)&& data.length>0){
                        _content += '<div style="font-weight: bold">��������Դ����������ռ��:</div>';
                        _content += '<div style="color:red">'+data.join(',')+'</div>';
                        _content += '<div style="font-weight: bold">�������������ɾ������Դ�󶨺���ɾ��������Դ��</div>';
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

        //ר���ɫ
        $(function () {

            var specialrole = $('#specialrole');
            var userList = '';
            //ɾ��ר���ɫ����
            specialrole.on('click', '.btn-delete.control-delete', function () {
                var _role_op = $(this).parents('.control-zxrole-op');
                var _roleid = _role_op.attr('id');
                // fnGetProcNameByRoleId(_roleid,function(data){

                //  })
                //var _deleteTips =
                fnGetProcNameByRoleId(_roleid, function (data) {
                    var _deletetip = '';
                    if ($.isArray(data) && data.length > 0) {
                        _deletetip = '����⣬��ǰ�˽�ɫ����������ƹ�<em style="color:red">' + data.length + '</em>֧<br/>(<span>' + data.join(',') + '</span>)<br/>';
                    }
                    deleteRoleList(_role_op, function () {
                        getRoleList(1);
                    }, _deletetip);
                });
            });

            //ɾ��ר���ɫ����
            specialrole.on('click', '.btn-delete.control-disable', function () {
                i8ui.alert({title: 'ϵͳ��ɫ������ɾ����'});
            });

            //�༭ר���ɫ����
            specialrole.on('click', '.btn-edit-one.control-edit', function () {
                var _role_op = $(this).parents('.control-zxrole-op');
                var _roleid = _role_op.attr('id');
                outputWin({_role_op: _role_op, operation: 'update', title: '�༭', fun: function () {
                    fnGetProcNameByRoleId(_roleid, function (data) {
                        if ($.isArray(data) && data.length > 0) {
                            $('#role_participant_process').html('����⣬��ǰ��ɫ�������̹�<em style="color:red">' + data.length + '</em>֧<br/>(<em>' + data.join(',') + '</em>)').show();
                        }
                    });
                }});
            });

            //���ר���ɫ����
            specialrole.on('click', '.add', function () {
                outputWin({operation: 'add', title: '����'});
            });


            //��ȡר���ɫ����
            var getRoleList = function (pageIndex) {
                var specialrole_content = specialrole.find('.sys-zxrole-list');
                specialrole_content.html('<table width="100%"><tr><td align="center"><div class="list-loading">���ڼ���......</div></td></tr></table>');
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
                            specialrole_content.html('<div class="sys-zxrole-op add">+�����½�ɫ</div>');
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
                                text: '��ת'
                            }
                        });
                    }, error: function (e1, e2, e3) {
                        specialrole_content.html('��ȡר���ɫ�б�ʱ����ʱ���������磡');
                    }
                });
            }

            //ɾ��ר���ɫ����
            var deleteRoleList = function (_role_op, callback, deletetips) {
                var adminRoleId = _role_op.attr('id');
                var _deletetips = deletetips || '';
                // if ($.isFunction(deletefun)) {


                i8ui.confirm({
                        title: 'ȷ��ɾ����<br/>' + _deletetips + '<span class="red">ɾ���󣬸�ר���ɫ������ִ�С�����ʱ��ֱ�����������õĹ̶�������Ҳ��ֱ��ɾ���޷����ģ�</span>',
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
                                    i8ui.alert({title: 'ɾ��ʧ��,' + data.Description});
                                    return;
                                }
                                i8ui.alert({title: 'ɾ���ɹ���', type: 2});
                                callback(data);
                            }, error: function (e1, e2, e3) {
                                i8ui.alert({title: 'ɾ��ר���ɫʱ����ʱ���������磡'});
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
                 i8ui.alert({title:'��ѯʧ��,'+data.Description});
                 return;
                 }
                 if(data.ReturnObject>0){
                 i8ui.alert({title:'��������ʹ���˸�ר���ɫ������ɾ����'});
                 return;
                 }
                 i8ui.confirm({
                 title:'ȷ��ɾ����'
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
                 i8ui.alert({title:'ɾ��ʧ��,'+data.Description});
                 return;
                 }
                 i8ui.alert({title:'ɾ���ɹ���',type:2});
                 callback(data);
                 },error: function(e1,e2,e3){
                 i8ui.alert({title:'ɾ��ר���ɫʱ����ʱ���������磡'});
                 }
                 });
                 });
                 },error: function(e1,e2,e3){
                 i8ui.alert({title:'����Ƿ���������ʹ���˸�ר���ɫʱ����ʱ���������磡'});
                 }
                 });*/
            }

            //��������
            var outputWin = function (options, callback) {
                var _title = '<div >' + options.title + ' ר���ɫ</div>';


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
                        i8ui.alert({title: '��ɫ���Ʋ���Ϊ�գ�'});
                        return;
                    }
                    if (!userid) {
                        i8ui.alert({title: 'ָ����Ա����Ϊ�գ�'});
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
                                i8ui.alert({title: '����ʧ��,' + data.Description});
                                return;
                            }
                            $('.ct-close').trigger('click');
                            i8ui.alert({title: '����ɹ���', type: 2});
                            getRoleList();
                        }, error: function (e1, e2, e3) {
                            i8ui.alert({title: '����ר���ɫ������ʱ���������磡'});
                        }
                    });
                })
            }
            getRoleList();
        })


        //����Դ����
//        (function(){

//            var processdata=$('#processdata');
//            var processdatarender=template(require('default/template/design/processdatalist.tpl'));
//            var getSourceData=function(){
//                var processdata_content=processdata.find('tbody').html(processdatarender({loading:true}));
//            }
//            getSourceData();
//        })
    }
    PageInit();//ҳ���ʼ��

});