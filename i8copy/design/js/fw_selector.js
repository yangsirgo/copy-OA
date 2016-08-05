/**
 * Created by ryf on 2016/8/4.
 */
/**
 * Created by kusion on 2014/11/3.
 */
/*
 *选择人，部门，群组控件(author: Kusion)
 *Update:2/4/2013(新增简洁调用)
 *说明：本控件依赖fw.css文件
 */
define(function (require, exports, module) {
    /*removed content*/
    var kSNSelector=function (setting) {
            //选人光标状态
            $(document).on('focus',setting.element,function(){
                var _this=$(this);
                if(setting.model!=1||!_this.prev('.fw_ksninput_slted').attr('data-uid')){
                    _this.parents('.fw_ksntxtbox').addClass("ksner-focus");//.css('border','1px solid #47c7ea');
                }
            }).on('blur',setting.element,function(){
                $(this).parents('.fw_ksntxtbox').removeClass("ksner-focus");//.css('border','1px solid #E2E5E7');
            });
            if (i8_session.avip > 0) {/*VIP用户*/
                if (setting.isAbox == undefined || setting.isAbox) {
                    setting = $.extend(setting, { isAbox: true });
                } else {
                    setting = $.extend(setting, { isAbox: false });
                }
            } else {
                setting = $.extend(setting, { isAbox: true });
            }
            setting = $.extend({ model: 1, element: null, width: 250, maxSelected: 100, isShowQuit: false, readonly: false, showIco: false, isAbox: false, searchType: { "org": false, "user": true, "grp": false }, loadItem: {itemReadonly:false, items: [], loadedCallBack: function (obj) { } }, selectCallback: function () { }, deleteCallback: function () { } }, setting);
            var singleObj = null;
            var multiObjs={};
            /*根据ID初始化控件*/
            var initSelector = function (elemid) {
                /*removed content*/
                if (setting.model == 1 || setting.model == 2) {
                    /*若input外围标签已完整存在*/
                    if ($("#" + elemid).parents(".fw_ksntxtbox").length > 0 && $("#" + elemid).parents(".fw_ksninput").length > 0) {
                        if (setting.showIco) {
                            $("#" + elemid).parents(".fw_ksninput").removeClass("fw_ksntxtbox_ksi1").removeClass("fw_ksntxtbox_ksi2").addClass("fw_ksntxtbox_ksi" + setting.model);
                        }
                        else {
                            $("#" + elemid).parents(".fw_ksninput").removeClass("fw_ksntxtbox_ksi1").removeClass("fw_ksntxtbox_ksi2");
                        }
                        if ($("#" + elemid).attr("placeholder")) {
                            $("#" + elemid).parents(".fw_ksntxtbox").append($('<div class="fw_ksnplaceholder">' + $("#" + elemid).attr("placeholder") + '</div>'));
                            $("#" + elemid).removeAttr("placeholder");
                        }
                        $("#" + elemid).parents(".fw_ksntxtbox").find(".fw_ksntxtbox_alert_ico").remove(); /*删除可能已存在的isAbox图标*/

                        if (setting.isAbox) {
                            $.detectAboxer($("#" + elemid).parents(".fw_ksntxtbox"), setting); /*进入弹出选择框初始化*/
                        }
                    } else if ($("#" + elemid).parents(".fw_ksntxtbox").length == 0 || $("#" + elemid).parents(".fw_ksninput").length == 0) {
                        /*若input外围标签不完整或不存在*/
                        var _showico = "";
                        if (setting.showIco)
                            _showico = "fw_ksntxtbox_ksi" + setting.model;
                        var inputBox = $('<div class="fw_ksninput ' + _showico + '"></div>').append($("#" + elemid).clone());
                        var selectorBox = $('<div class="fw_ksntxtbox" style="width:' + setting.width + (setting.width > 0 ? 'px;min-width:inherit' : '') + '"></div>').append(inputBox)
                            .click(function () {
                                $(this).find("input").focus();
                                $(this).find(".fw_ksnplaceholder").hide();
                            });
                        if ($("#" + elemid).attr("placeholder")) {
                            selectorBox.append($('<div class="fw_ksnplaceholder">' + $("#" + elemid).attr("placeholder") + '</div>'));
                        }
                        if (setting.isAbox) {
                            $.detectAboxer(selectorBox, setting); /*进入弹出选择框初始化*/
                        }
                        if ($("#" + elemid).parents(".fw_ksntxtbox,.fw_ksninput").length > 0) {
                            $("#" + elemid).parents(".fw_ksntxtbox,.fw_ksninput").replaceWith(selectorBox);
                        } else {
                            $("#" + elemid).replaceWith(selectorBox);
                        }
                        $("#" + elemid).removeAttr("placeholder");
                    }
                }
                var _sType = "";
                for (var item in setting.searchType) {
                    if (setting.searchType[item]) {
                        _sType += item + ",";
                    }
                }
                /*配参数*/
                var opts2 = {
                    elem: document.getElementById(elemid),
                    url: i8_session.ajaxHost+"webajax/plugins/selector/selectentity?r=t",
                    model: setting.model,
                    readonly: setting.readonly,
                    maxSelected: setting.maxSelected,
                    exitsGuid:setting.exitsGuid,
                    sType: _sType,
                    sugListID: "mutiSugList" + Math.random().toString().replace(".", "")
                };
                var select2 = new KSNSelect(opts2);
                if (setting.model == 0) {
                    select2.init();
                    select2.seletedCallback = function (uid, uname, uemail,datatype) {
                        return setting.selectCallback(uid, uname, uemail,datatype);
                    }
                } else {
                    select2.KIInit();
                    if (setting.loadItem.items.length > 0) {
                        if (setting.model == 2) {
                            select2.KISetDataLoad(setting.loadItem.items, setting.loadItem.loadedCallBack);
                        } else if (setting.model == 1) {
                            select2.KISetDataLoad(setting.loadItem.items.slice(0, 1), setting.loadItem.loadedCallBack);
                        }
                    }
                    select2.deleteItemCallBack = function (obj) {
                        setting.deleteCallback(obj, opts2.elem); /*obj:被删除的对象，opts.elem:原输入文本框对象*/
                    }
                    select2.seletedCallback = function (uid, uname, uemail, datatype) {
                        return setting.selectCallback(uid, uname, uemail, datatype, opts2.elem); /*uid:选择用户ID，uname:选择用户名，uemail:选择用户邮箱,opts2.elem:输入原文本框对象*/
                    }
                }
                if (setting.readonly) opts2.elem.setAttribute("disabled", true);
                $(opts2.elem).unbind("keyup").bind("keyup",
                    _.debounce(function(e){
                        $(".fw_boxerContainer").remove();
                        if (setting.model == 0) {
                            select2.getAt(e);
                        } else if (setting.model == 1 || setting.model == 2) {
                            select2.KIshow(e);
                        }
                    },200)
                );
                $(opts2.elem).blur(function () {
                    var ksnSelector = $(this).parents(".fw_ksntxtbox");
                    if (ksnSelector.find(".fw_ksninput_slted").length == 0) {
                        $(this).parents(".fw_ksntxtbox").find(".fw_ksnplaceholder").show();
                    }
                });
                return select2;
            };
            if (setting.element) {
                if ($(setting.element).length == 1) {
                    singleObj = initSelector($(setting.element).attr("id"));
                }
                else {
                    $(setting.element).each(function () {
                        var aObj = initSelector($(this).attr("id"));
                        aObj['selectedData']=aObj.KISelectedData;
                        aObj['loadData']=aObj.KISetDataLoad;
                        aObj['clearData']=aObj.KIClearData;
                        aObj['getAllselectedData']=aObj.KIGetAllSelectedData;
                        aObj['setAllselectedData']=aObj.KISetSelectedData;
                        multiObjs[this.id]=aObj;
                    })
                }
            }
            return new function () {
                this.getAllMutiKsnObjs=function(){
                    return multiObjs;
                };
                this.getMultiKsnObjById=function(id){
                    return multiObjs[id];
                };
                this.selectedData = function () {
                    if (singleObj != null)
                        return singleObj.KISelectedData();
                };
                this.loadData = function (data) {
                    if (singleObj != null)
                        return singleObj.KISetDataLoad(data);
                }
                this.clearData = function () {
                    if (singleObj != null)
                        return singleObj.KIClearData();
                }
                this.getAllselectedData = function () {
                    if (singleObj != null)
                        return singleObj.KIGetAllSelectedData();
                };
                this.setAllselectedData = function (data) {
                    if (singleObj != null)
                        return singleObj.KISetSelectedData(data);
                };
            }
        }
        ;
    (function ($) {
        $.extend({
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
            },
            "includePath": i8_session.resHost,
            "include": function (file) {
                var files = typeof file == "string" ? [file] : file;
                for (var i = 0; i < files.length; i++) {
                    var name = files[i].replace(/^\s|\s$/g, "");
                    var att = name.split('.');
                    var ext = att[att.length - 1].toLowerCase();
                    var isCSS = ext == "css";
                    var filepath = $.includePath + name;
                    if (isCSS) {
                        if ($("link[href='" + filepath + "']").length == 0) {
                            var cssfile = document.createElement("link");
                            cssfile.rel = "StyleSheet";
                            cssfile.type = "text/css";
                            cssfile.href = filepath;
                            cssfile.media = "screen";
                            var newcssLink = document.getElementsByTagName("head")[0];
                            newcssLink.appendChild(cssfile);
                        }
                    } else {
                        if ($("script[src='" + filepath + "']").length == 0) {
                            var scriptfile = document.createElement("script");
                            scriptfile.language = "javascript";
                            scriptfile.type = "text/javascript";
                            scriptfile.src = filepath;
                            var newscriptsrc = document.getElementsByTagName("head")[0];
                            newscriptsrc.appendChild(scriptfile);
                        }
                    }
                }
            },
            "detectAboxer": function (obj, setting) {
                var _ksnbox = obj; /*控件DOM对象*/
                var tbset = setting.searchType; /*检索类型*/
                var modelset = setting.model; /*选择模式*/
                var isShowQuit = setting.isShowQuit; /*是否显示离职人员*/
                //tbset = { "org": true, "grp": true, "user": true };
                var keybaordIco = $('<div class="fw_sboxer fw_ksntxtbox_alert_ico"></div>');
                keybaordIco.click(function () {
                    $(".fw_boxerContainer").remove(); $(".fw_agtlist").hide(); $("input", _ksnbox).val("");
                    var advBoxer = $('<div class="fw_boxerContainer"><div class="bc_loading"><img src="'+i8_session.resHost+'default/images/16x16loading.gif"/><span>加载中...</span></div></div>').click(function (e) { _ksnbox.find(".fw_ksnplaceholder").hide(); return false; });
                    $("body").append(advBoxer); /*添加到Body*/
                    var ksnSelector = $(this).parents(".fw_ksntxtbox");
                    var _left = ksnSelector.offset().left; var _top = ksnSelector.offset().top + ksnSelector.outerHeight();
                    var _bodyWith = $("body").width();
                    if (_left + 452 > _bodyWith) {/*当弹出的框超出body最右边时，将原位置向左移*/
                        _left = _bodyWith - 452 - 5;
                    }
                    advBoxer.css({ "position": "absolute", "z-index": "9999", "left": _left, "top": _top });
                    var tabHtml = "";
                    var _left = 0;
                    var treeNodeEnable = { user: true, org: true }; /*存储树节点是否可选*/
                    if (tbset["org"] && tbset["user"]) {
                        tabHtml += '<span id="tab_span_org_select" style="left:0px">组织/同事</span>'; _left = 75;
                    } else {
                        if (tbset["org"]) {
                            tabHtml += '<span id="tab_span_org_select" style="left:0px">组织</span>'; _left = 47;
                            treeNodeEnable.user = false;
                        } else if (tbset["user"]) {
                            tabHtml += '<span id="tab_span_org_select" style="left:0px">同事</span>'; _left = 47;
                            treeNodeEnable.org = false;
                        }
                    }
                    if (tbset["grp"]) {
                        tabHtml += '<span id="tab_span_grp_select" style="left:' + _left + 'px">群组</span>';
                    }
                    // boxer_top = $('<div class="bcon_top"></div>').append();
                    var boxer_ctr = $('<div class="list_tab">' + tabHtml + '</div><div class="bcon_center"><div class="bcc_left"><div class="bcl_srchbox" style="display:none"><input type="text" class="searchkeyword" placeholder="姓名、拼音可检索"/><span class="span_act_search"></span><span class="span_act_delete"></span></div><div class="bcl_list"><div id="tab_list_container" class="list_details"><div id="tbls_org_box" style="display:none" class="tb_refence_box" dataload="0"><ul id="cropOrgTree" class="ztree"><img class="loading-ico" src="default/images/32loading_white.gif"/></ul></div><div id="tbls_grp_box" style="display:none" class="tb_refence_box" dataload="0">加载中...</div><div id="tbls_clg_box" style="display:none" class="tb_refence_box" dataload="0">加载中...</div></div></div></div><div class="bcc_ctr"><input type="button" id="btn_addselecteditemforls" class="btn_add_item disable_add"/></div><div class="bcc_right"><div id="bccr_selectedItem_container" class="bccr_selectedItem"><div id="con_selectorItemList"></div></div></div></div>');
                    var boxer_ftr = $('<div class="bcon_footer"><input type="button" class="btn_submit_select" value="确定"/>　<a class="btn_cancel_select">取消</a></div>');
                    /*添加到DOM*/
                    advBoxer.empty().append(boxer_ctr).append(boxer_ftr).append($('<a title="关闭" class="i8selector-popu-closed">×</a>').click(function () { advBoxer.remove();setting.cancelCbk && setting.cancelCbk();return false; }));
                    /*阻止单击冒泡并绑定单击事件*/
                    obj.click(function (e) { return false; })
                    window.document.onclick = function (e) {
                        $(".fw_boxerContainer").remove();
                    };
                    /*左侧选择区滚动条*/
                    var addSilderBarScroll = function () {
                        if ($("#cropOrgTree").height() > 190) {
                            $('#tbls_org_box').jkScrollBar({ pattern: 'jkscroll-simple' });
                        }
                    };
                    /*右侧待选择区滚动条*/
                    var addSelectedItemBarScroll = function () {
                        if ($("#con_selectorItemList").height() > 240) {
                            $("#bccr_selectedItem_container").mCustomScrollbar("update");
                            //$('#bccr_selectedItem_container').jkScrollBar({ pattern: 'jkscroll-simple' });
                        }
                    };
                    /*加载原有值*/
                    if (ksnSelector.find(".fw_ksninput_slted").length > 0) {
                        var span_itemHtml = "";
                        ksnSelector.find(".fw_ksninput_slted").each(function () {
                            var jqItem = $.parseJSON(decodeURIComponent($(this).attr("f-data")));
                            span_itemHtml += '<span class="item_slted" tagid="' + jqItem.uid + '" tagname="' + jqItem.uname + '" tagtype="' + jqItem.datatype + '" u-readonly="'+jqItem.ureadonly+'" f-data="'+$(this).attr("f-data")+'"><img src="'+jqItem.headimg+'" class="sbox-usr-img"><em>' + jqItem.uname + '</em>'+(jqItem.ureadonly?'':'<a></a>')+'</span>';
                        });
                        $("#con_selectorItemList", boxer_ctr).append(span_itemHtml);
                        $("#bccr_selectedItem_container").mCustomScrollbar({ theme: "dark-3" ,axis:"y"});
                        //addSelectedItemBarScroll();
                    }
                    /*确定*/
                    $(".btn_submit_select", advBoxer).click(function () {
                        var _selecteditems = $(".bccr_selectedItem .item_slted", boxer_ctr);
                        if (_selecteditems.length == 0) {
                            alert('未任何项选择！'); return;
                        } else {
                            var span_itemHtml = "",sltItems=[];
                            for (var i = 0; i < _selecteditems.length; i++) {
                                var jqItem = $(_selecteditems[i]);
                                var _category = "";
                                if (jqItem.attr("tagtype") == "user") {

                                } else if (jqItem.attr("tagtype") == "org") {
                                    _category = "[组织]";
                                } else if (jqItem.attr("tagtype") == "grp") {
                                    _category = "[群组]";
                                }
                                //if (_ksnbox.html().indexOf(jqItem.attr("tagid")) == -1) {
                                var comName = jqItem.attr("tagname");
                                if (comName.indexOf(_category) == -1) {
                                    comName = _category + comName;
                                }
                                var nodeItem={'id':jqItem.attr("tagid"),'type':jqItem.attr("tagtype"),'name':jqItem.attr("tagname"),readonly:jqItem.attr("u-readonly")};
                                span_itemHtml += "<span class=\"fw_ksninput_slted\" data-uid=\"" + nodeItem.id + "\" data-type=\"" + nodeItem.type + "\" f-data=\""+jqItem.attr("f-data")+"\"><em>" + nodeItem.name + "</em>"+(nodeItem.readonly?"":"<a></a>")+"</span>";
                                sltItems.push(nodeItem);
                            }
                            $(".fw_ksninput_slted", _ksnbox).remove(); /*清空原有的*/
                            _ksnbox.find("input").before(span_itemHtml); /*添加*/
                            _ksnbox.find(".fw_ksnplaceholder").hide(); /*隐藏placeholder*/
                            advBoxer.remove();
                            /*如果设置的是单选模式，则在选中之后删除ICO图标*/
                            if (modelset == 1) {
                                keybaordIco.hide(); _ksnbox.find("input").hide(); obj.css("border", "solid 1px transparent");
                                if (setting.selectCallback) { /*在单选情况下，依次返回uid, uname, uemail, datatype，elem*/
                                    //console.log(_selecteditems)
                                    setting.selectCallback(_selecteditems.attr("tagid"), _selecteditems.attr("tagname"), _selecteditems.attr("email"), _selecteditems.attr("tagtype"), $(setting.element)[0]);
                                }
                            } else {
                                if (setting.selectCallback) {
                                    setting.selectCallback(sltItems);
                                }
                            }
                        }
                        return false;
                    });
                    /*取消*/
                    $(".btn_cancel_select", advBoxer).click(function () {
                        advBoxer.remove();
                        setting.cancelCbk && setting.cancelCbk();
                        return false;
                    });
                    /*转换成树结构*/
                    function convertTreeJson(source) {
                        var tmp = {}, parent, n;
                        for (n in source) {
                            var item = source[n];
                            if (item.OrgID == item.RootID) {
                                parent = item.OrgID;
                            }
                            if (!tmp[item.OrgID]) {
                                tmp[item.OrgID] = {};
                            }
                            tmp[item.OrgID].text=item.Name;
                            tmp[item.OrgID].name = item.Name;
                            tmp[item.OrgID].OrgID = item.OrgID;
                            tmp[item.OrgID].isParent = true;
                            tmp[item.OrgID].RootID = item.RootID;
                            tmp[item.OrgID].isExpand = false;
                            tmp[item.OrgID].nodeType = treeNodeEnable.org ? "org" : "none";
                            if (!("children" in tmp[item.OrgID])) tmp[item.OrgID].children = [];
                            if (item.OrgID != item.ParentID) {
                                if (tmp[item.ParentID]) {
                                    tmp[item.ParentID].children.push(tmp[item.OrgID]);
                                }
                                else {
                                    tmp[item.ParentID] = { children: [tmp[item.OrgID]] };
                                }
                            }
                        }
                        return tmp[parent];
                    }
                    /*加载树*/
                    var loadOrgTree = function () {
                        $.post(i8_session.ajaxHost+"webajax/settings/GetDefaultOrgTree?rd=" + Math.random(), {}, function (response) {
                            if (response.Result) {
                                console.log(response.ReturnObject);
                                var idObj={};
                                _.each(response.ReturnObject,function(data){
                                    //if(data) {
                                    idObj[data.OrgID] = data;
                                    //}
                                });
                                var tempdata = convertTreeJson(idObj);
                                //console.log(tempdata)
                                //console.log(tempdata);

                                /*                                $('#tbls_org_box').jstree({
                                 'core' : {
                                 'data' : [tempdata]
                                 }
                                 }).on("open_node.jstree",function(e,data){
                                 console.log(e);
                                 console.log(data);
                                 $("#tbls_org_box").mCustomScrollbar("update");
                                 }).on("loaded.jstree",function(e,data){
                                 $("#tbls_org_box").mCustomScrollbar({ theme: "dark-3" ,axis:"y"});
                                 });*/
                                var zTreeObj,
                                    setting = {
                                        /*data: {
                                         keep:{parent:true,leaf:true},
                                         simpleData: {
                                         enable: true,
                                         idKey: "OrgID",
                                         pIdKey: "ParentID",
                                         rootPId: 1
                                         },
                                         key: {
                                         title: "Name",
                                         name: "Name"
                                         }
                                         },*/
                                        view: { selectedMulti: true, showIcon: showIconForTree, fontCss: setSpacialFontCss },
                                        check: { enable: false },
                                        callback: { onExpand: onExpandEvent, beforeClick: treeBeforeClick, onClick: nodeOnClickEvent }
                                    };
                                //zTreeObj = $.fn.zTree.init($("#cropOrgTree"), setting, response.ReturnObject);
                                zTreeObj = $.fn.zTree.init($("#cropOrgTree"), setting, tempdata);
                                $("#tbls_org_box").attr("dataload", "1");
                                $("#tbls_org_box").mCustomScrollbar({ theme: "dark-3" ,axis:"y"});
                                $("#cropOrgTree_1_switch").trigger("click");
                            }
                        }, "json");
                    };
                    /*点击节点之前事件*/
                    var treeBeforeClick = function (treeId, treeNode, clickFlag) {
                        if (treeNode.name == "无成员") {
                            return false;
                        } else if (treeNode.isParent && tbset.org) {
                            return true;
                        } else if (!treeNode.isParent && tbset.user) {
                            return true;
                        } else {
                            return false;
                        }
                    };
                    /*选择事件*/
                    var nodeOnClickEvent = function (event, treeId, treeNode, clickFlag) {
                        var btnAdd = $("#btn_addselecteditemforls", boxer_ctr);
                        var treeObj = $.fn.zTree.getZTreeObj("cropOrgTree");
                        var nodes = treeObj.getSelectedNodes();
                        if (nodes.length > 0) {
                            btnAdd.removeClass("disable_add");
                            btnAdd.data();
                        } else {
                            btnAdd.addClass("disable_add");
                            btnAdd.removeData();
                        }
                    };
                    /*节点颜色设定*/
                    var setSpacialFontCss = function (treeId, treeNode) {
                        if (treeNode.name == "无成员") {
                            return { color: "#ccc" };
                        } else {
                            if (treeNode.isManager != undefined) {
                                if (treeNode.isManager) {
                                    return { "color": "#cc0000" };
                                }
                            }
                        }
                    };
                    /*加载群组*/
                    var loadGrpList = function () {
                        $.get(i8_session.ajaxHost+"webajax/platform/getmygroups", { fn: "gt", range: "pub", p: 1, s: 300, state: "0", orderby: 'name', rad: Math.random() }, function (response) {
                            if (response.Result) {
                                var aList = response.ReturnObject.List;
                                if (aList.length > 0) {
                                    var ulboxer = $('<ul id="ul_cropGroupList" class="crop_grouplist"></ul>');
                                    for (var i in aList) {
                                        if (aList[i].ID && aList[i].Name) {
                                            var liRec = $('<li><div class="crop_grp_ico"></div><div class="crop_text"><span class="crop_grp_name_txt" dataid="' + aList[i].ID + '">' + aList[i].Name + '</span></div></li>').click(function () {
                                                if (!$(this).attr("class")) {
                                                    $(this).parent().find("li").removeClass("liselected");
                                                    $(this).addClass("liselected");
                                                    $("#btn_addselecteditemforls").removeClass("disable_add");
                                                    var _data = { "ID": $(".crop_grp_name_txt", this).attr("dataid"), "name": $.trim($(".crop_grp_name_txt", this).text()), "nodeType": "grp" };
                                                    $("#btn_addselecteditemforls").data(_data);
                                                } else {
                                                    $(this).removeClass("liselected");
                                                    $("#btn_addselecteditemforls").addClass("disable_add").removeData();
                                                }
                                            });
                                            ulboxer.append(liRec);
                                        }
                                    }
                                    $("#tbls_grp_box").empty().append(ulboxer);
                                    if ($("#ul_cropGroupList").height() > 190) {
                                        $('#tbls_grp_box').mCustomScrollbar({ theme: "dark-3" ,axis:"y"});;
                                    }
                                    $("#ul_cropGroupList").attr("dataload", "1");
                                }
                            }
                        }, "json");
                    };
                    /*是否显示图标*/
                    var showIconForTree = function (treeId, treeNode) {
                        return !treeNode.noIco;
                    };
                    Array.prototype.removeNodeByKeyValue = function (key, value) {
                        var tempNew = [];
                        for (var i = 0; i < this.length; i++) {
                            var item = this[i];
                            if (item[key] != value) {
                                tempNew.push(item);
                            }
                        }
                        return tempNew;
                    };
                    /*展开*/
                    var onExpandEvent = function (event, treeId, treeNode) {
                        if (!treeNode.isExpand && treeNodeEnable.user) {
                            $.post(i8_session.ajaxHost+"webajax/settings/GetOrgPersonsInfo", {orgID:treeNode.OrgID,isOnlyContract:false}, function (response) {
                                if (response.Result) {
                                    var treeObj = $.fn.zTree.getZTreeObj("cropOrgTree");
                                    var Members = _.pluck(response.ReturnObject.Result,"Item1");
                                    if (!isShowQuit)
                                        Members = Members.removeNodeByKeyValue("Status", "1"); /*删除WorkType为1为对象*/
                                    if (Members.length == 0) {
                                        var newNodes = [{ "name": "无成员", "nodeType": "none", "noIco": true}];
                                        treeObj.addNodes(treeNode, newNodes);
                                    } else {
                                        var Persons = Members;
                                        /* var Persons = Members.sort(function (a, b) {
                                         return a.IsManager ? -1 : 1;
                                         });*/
                                        var p_node = [];
                                        for (var i = 0; i < Persons.length; i++) {
                                            var per = Persons[i];
                                            p_node.push({"name": per.Name + (per.Status == 1 ? "(已离职)" : ""), "ID": per.PassportID,"headimg":per.HeadImage, "nodeType": "user", "isManager":false /*per.IsManager*/, "email": per.Email });
                                        }
                                        treeObj.addNodes(treeNode, p_node);
                                        //addSilderBarScroll();
                                    }
                                    treeNode.isExpand = true;
                                }
                            }, "json");
                        } else {
                            if (!treeNodeEnable.user) {/*判断子节点下是否还有子节点，若没有直接展开*/
                                var treeObj = $.fn.zTree.getZTreeObj("cropOrgTree");
                                for (var i = 0; i < treeNode.children.length; i++) {
                                    if (treeNode.children[i].children.length == 0) {
                                        treeObj.expandNode(treeNode.children[i], true, true, true);
                                    }
                                }
                            }
                        }
                        //addSilderBarScroll();
                    }
                    /*添加到右侧待选框*/
                    $("#btn_addselecteditemforls", boxer_ctr).click(function () {
                        if ($(this).attr("class").indexOf("disable_add") > -1) {
                            return;
                        }
                        var treeObj = $.fn.zTree.getZTreeObj("cropOrgTree");
                        var recNodes = treeObj.getSelectedNodes()||[];
                        var grpData=$(this).data();/*data数据目前只存放群组节点*/
                        if(grpData.name&&grpData.nodeType&&grpData.ID){/*群组数据拼装进去*/
                            recNodes.push({"name":grpData.name,"nodeType":grpData.nodeType,"ID":grpData.ID});
                        }
                        if (recNodes.length > 0) {
                            if (treeObj) {
                                treeObj.cancelSelectedNode();
                            }
                            if ($("#ul_cropGroupList .liselected").length > 0) {
                                $("#ul_cropGroupList li").removeClass("liselected");
                            }
                            var countS = $("#con_selectorItemList span").length + recNodes.length;
                            if (countS > setting.maxSelected) {
                                alert('已到达最大可选数了');
                                return;
                            }
                            for (var i = 0; i < recNodes.length; i++) {
                                var _category = "";
                                var f_data={datatype:""};
                                if (recNodes[i].nodeType == "user") {
                                    f_data.datatype="user";
                                } else if (recNodes[i].nodeType == "org") {
                                    f_data.datatype="org";
                                    _category = "[组织]";
                                } else if (recNodes[i].nodeType == "grp") {
                                    f_data.datatype="grp";
                                    _category = "[群组]";
                                }
                                f_data['uname']=recNodes[i].name;
                                f_data['uid']=recNodes[i].ID;
                                f_data['email']=recNodes[i].email;
                                f_data['headimg']=recNodes[i].headimg;
                                var sp_sltItem = $('<span class="item_slted" tagid="' + recNodes[i].ID + '" tagname="' + recNodes[i].name + '" tagtype="' + recNodes[i].nodeType + '" email="' + recNodes[i].email + '" f-data="'+encodeURIComponent($.JSONString(f_data))+'"><img src="'+recNodes[i].headimg+'" class="sbox-usr-img"/><em>' + _category + recNodes[i].name + '</em><a></a></span>');
                                if (modelset == 1 && $("#con_selectorItemList span").length == 1) {
                                    alert('单选框模式只能待选一项');
                                    $(this).removeData().addClass("disable_add");
                                    return;
                                }
                                if ($("#con_selectorItemList span[tagid='" + recNodes[i].ID + "']", boxer_ctr).length > 0) {
                                    alert('选项已存在!');
                                    $(this).removeData().addClass("disable_add");
                                    return;
                                } else {
                                    $("#con_selectorItemList", boxer_ctr).append(sp_sltItem);
                                    $(this).removeData().addClass("disable_add");
                                }
                            }
                            addSelectedItemBarScroll();
                        }
                    });
                    /*绑定删除*/
                    $(".bccr_selectedItem", boxer_ctr).bind("click", function (event) {
                        if ($(event.target)[0].tagName == "A") {
                            $(event.target).parents(".item_slted").remove();
                            addSelectedItemBarScroll();
                        }
                    })
                    /*识别第一个TAB页，并加载相关内容【开始】*/
                    var firstTab = $(".list_tab span", advBoxer)[0];
                    firstTab.className = "activetab";
                    if (firstTab.id == "tab_span_org_select") {
                        $("#tbls_org_box").show();
                        loadOrgTree();
                    } else if (firstTab.id == "tab_span_grp_select") {
                        $("#tbls_grp_box").show();
                        loadGrpList();
                    } else if (firstTab.id = "tab_span_clg_select") {
                        $("#tbls_clg_box").show();
                    }
                    /*识别第一个TAB页，并加载相关内容【结束】*/
                    $(".list_tab span", advBoxer).click(function () {
                        if ($(this).attr("class")) return;
                        $(".list_tab span", advBoxer).removeClass("activetab");
                        $(this).addClass("activetab");
                        $(".tb_refence_box", advBoxer).hide();
                        if ($(this).attr("id") == "tab_span_org_select") {/*组织结构*/
                            $("#tbls_org_box").show();
                            if ($("#tbls_org_box").attr("dataload") != "1") {
                                loadOrgTree();
                            }
                        } else if ($(this).attr("id") == "tab_span_grp_select") {/*群组*/
                            $("#tbls_grp_box").show();
                            if ($("#tbls_grp_box").attr("dataload") != "1") {
                                loadGrpList();
                            }
                        } else if ($(this).attr("id") == "tab_span_clg_select") {/*同事*/
                            $("#tbls_clg_box").show();
                            if ($("#tbls_clg_box").attr("dataload") != "1") {

                            }
                        }

                    });
                    /*文本搜索图标*/
                    $(".span_act_search", advBoxer).click(function () {
                        var seck = $(".searchkeyword", advBoxer).val();
                        if (seck.length > 0) {
                            $(".span_act_search", advBoxer).hide();
                            $(".span_act_delete", advBoxer).show();
                        } else {
                            alert('输入搜索关键词!')
                        }
                    });
                    /*文本删除图标*/
                    $(".span_act_delete", advBoxer).click(function () {
                        $(".searchkeyword", advBoxer).val("");
                        $(this).hide();
                        $(".span_act_search", advBoxer).show();
                    });
                    $(".searchkeyword", advBoxer).change(function () {
                        if ($.trim($(this).val().length > 0)) {

                        }
                    })
                });
                obj.append(keybaordIco);
            }
        });
    })(jQuery);

    function KSNSelect(opts) {
        this.elem = opts.elem; //文本框
        this.at = {}; //临时保存文本框内容截取属性
        this.opt = {};
        this.searched = ""; //用于判断用户输入字符是否和前面一样，如果一样跳过ajax
        this.url = opts.url;
        this.index = 0;
        this.timeout = 0;
        this.sType = opts.sType || "user,";
        this.isAjax = true;
        this.maxSelected = opts.maxSelected || 100;
        this.readonly = opts.readonly || false;
        this.isEnable = opts.isEnable || true;  //是否启用多项选择控件
        this.model = opts.model; //0:kankan输入提示;1:文本框输入单选提示;2:文本框输入多选提示
        this.sugListID = opts.sugListID;
        this.selectedGuid =  new Array();/*已存选择的GUID*/
        this.selectorExitsGuid = opts.exitsGuid || [];/*控制默认已存在的GUID*/
        this.seletedCallback = function (data) { }; //选中回调
        this.deleteItemCallBack = function (data) { }; //删除选项回调
        this.tWarp = opts.tArea || "tWarp";  //定位框
    }

    KSNSelect.prototype = {
        getCursor: function (elem) {
            var _this = this;
            var rangeData = {
                start: 0,
                end: 0,
                text: ""
            };
            if (typeof (this.elem.selectionStart) == "number") {//W3C
                rangeData.start = this.elem.selectionStart; //光标起始位置
                rangeData.end = this.elem.selectionEnd; //光标末尾位置
                rangeData.text = this.elem.value.substring(0, this.elem.selectionStart); //获取文本框value
            } else if (document.selection) {//IE
                var sRange = document.selection.createRange();
                var oRange = document.body.createTextRange();
                oRange.moveToElementText(this.elem);
                rangeData.text = sRange.text;
                rangeData.bookmark = sRange.getBookmark();
                for (i = 0; oRange.compareEndPoints("StartToStart", sRange) < 0 && sRange.moveStart("character", -1) !== 0; i++) {
                    if (this.elem.value.charAt(i) == '\r') {
                        i++; //IE的特殊处理，遇到enter键需要加1
                    }
                }
                rangeData.start = i;
                rangeData.end = rangeData.text.length + rangeData.start;
                rangeData.text = this.elem.value.substring(0, i);
            }
            //alert(rangeData.text)
            return rangeData;
        },
        setCursor: function (elem, start, end) {//设置光标
            if (this.elem.setSelectionRange) {//W3C
                this.elem.setSelectionRange(start, end);
            } else if (this.elem.createRange) {//IE
                var range = this.elem.createRange();
                if (this.elem.value.length == rangeData.start) {
                    range.collapse(false);
                    range.select();
                } else {
                    range.moveToBookmark(rangeData.bookmark);
                    range.select();
                }
            }
        },
        add: function (elem, txtData, nStart, nLen, guid,email,dtype) {//插入文本   参数  操作的元素，数据，起始坐标位置，用户输入字符长度
            if (!$(this.elem).is(":hidden")) {
                this.elem.focus();
            }
            var _range;
            //this.selectedGuidAdd(guid + "@" + txtData); //保存结果集
            if (this.seletedCallback != null)
                this.seletedCallback(guid, txtData,email,dtype);
            if (this.elem.setSelectionRange) {//W3C
                _tValue = this.elem.value; //获取文本框内容
                var _start = nStart - nLen, //设置光标起点  光标的位置-离@的文本长度
                    _end = _start + txtData.length, //设置光标末尾，start+数据文字长度
                    _value = _tValue.substring(0, _start) + txtData + " " + _tValue.substring(nStart, this.elem.value.length);
                this.elem.value = _value;
                this.setCursor(this.elem, _end + 1, _end + 1);
            } else if (this.elem.createTextRange) {
                _range = document.selection.createRange();
                _range.moveStart("character", -nLen); //移动光标
                _range.text = txtData + " ";
            }
        },
        getAt: function (e) {
            var _rangeData = this.getCursor();
            var _this = this;
            var k = _value = _rangeData.text.replace(/\r/g, ""); //去掉换行符
            var _reg = /@[^@\s]{0,20}$/g; //正则，获取value值后末尾含有@的并且在20字符内
            var _string = ""; //alert(_value);
            if (_value.indexOf("@") >= 0 && _value.match(_reg)) {
                //if (_value.indexOf("@") >= 0) {//去掉_value.match(_reg)条件，当直接输入@显示tip
                var _postion = _rangeData.start;
                var _oValue = _value.match(_reg)[0]; //找到value中最后匹配的数据
                var vReg = new RegExp("^" + _oValue + ".*$", "m"); //跟数据匹配的正则   暂时保留
                _value = _value.slice(0, _postion); //重写_value 字符串截取  从0截取到光标位置
                if (/^@[a-zA-Z0-9\u4e00-\u9fa5_]*$/.test(_oValue) && !/\s/.test(_oValue)) {
                    this.at['m'] = _oValue = _oValue.slice(1); //用户输入的字符
                    this.at['l'] = _value.slice(0, -_oValue.length - 1); //@前面的文字
                    this.at['r'] = k.slice(_postion - _oValue.length, k.length); //@后面的文字
                    this.at['pos'] = _postion; //光标位置
                    this.at['len'] = _oValue.length; //光标位置至@的长度，如 @小魔，即"小魔"的长度
                    _this.showTip(e);

                } else {
                    this.hiddenTip()
                }
            } else {
                this.hiddenTip()
            }

        },
        uniqAtList: function () {//已@用户数组集合
            var _reg = /@[^@\s]{0,20}/g;
            var inputData = $(this.elem).val();
            var ary = inputData.match(_reg);
            ary = ary.concat(ary).uniq();
            return ary;
        },
        getExitsGuids: function () {
            var guids = "";
            var _this = this;
            var sNameList = _this.uniqAtList().toString();
            var aName = sNameList.split(",");
            for (var i = 0; i < aName.length; i++) {
                var currentGuid = aName[i] == "@" ? "" : _this.getGuidByName(aName[i]);
                if (currentGuid != null && currentGuid != undefined) {
                    if (currentGuid.indexOf("@") > 10)
                        guids += "|" + _this.getGuidByName(aName[i]).split("@")[0];
                }
            }
            return guids;
        },
        selectedGuidAdd: function (guidname) {
            $(this.elem).attr("data-guids", guidname);
        },
        getGuidByName: function (name) {
            if (this.selectedGuid.length > 0) {
                for (var i = 0; i < this.selectedGuid.length; i++) {
                    if (this.selectedGuid[i].indexOf(name) > -1) {
                        return this.selectedGuid[i];
                    }
                }
            }
        },
        format: function (s) {//正则替换一些html代码
            var q = { "<": "&lt;", ">": "&gt;", '"': "&quot;", "\\": "&#92;", "&": "&amp;", "'": "&#039;", "\r": "", "\n": "<br>", " ": "&nbsp;" };
            var o = /<|>|\'|\"|&|\\|\r\n|\n| /gi;
            return s.replace(o, function (r) {
                return q[r]
            });
        },
        strSub: function (str, len) {
            if (!str || !len) { return ''; }
            var a = 0; var i = 0; var temp = '';
            for (i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    a += 2;
                }
                else { a++; }
                if (a > len) { return temp; }
                temp += str.charAt(i);
            }
            return str;
        },
        init: function () {//初始化
            var _body = $("body");
            $(".ksnsugctl").remove();
            var _div = $("<div id='" + this.tWarp + "' class='ksnsugctl'></div>");
            var _tip = $("<div id=\"" + this.sugListID + "\" style='display:none' class='fw_agtlist ksnsugctl'></div>");
            _body.append(_div);
            _body.append(_tip);
            var _left = $(this.elem).offset().left + "px",
                _top = $(this.elem).offset().top + "px",
                _width = $(this.elem).outerWidth() + "px",
                _height = $(this.elem).outerHeight() + "px",
                _lineHeight = $(this.elem).css("line-height"),
                _style = "position:absolute;overflow:hidden;z-index:-9999;line-height:" + _lineHeight + ";width:" + _width + ";height:" + _height + ";left:" + _left + ";top:" + _top;
            _div.attr("style", _style);
            this.inset();
        },
        showTip: function (e) {//显示tip，获取ajax数据
            var _this = this;
            var _sugListID = this.sugListID;
            var rqData;
            var _guidslist = _this.getExitsGuids();
            e = e || event;
            var curKeyCode = e.keyCode;
            //setTimeout(function () {
            if (_this.timeout == 0 || curKeyCode == 13) {
                _this.timeout = 1;
                $.ajax({
                    async: true,
                    url: _this.url + "&k=" + encodeURIComponent(_this.at['m']) + "&g=" + _guidslist + "&t=" + _this.sType + "&s=1",
                    type: "get",
                    dataType: "json",
                    data: {},
                    success: function (data) {
                        _this.timeout = 0;
                        if (data.Result) {
                            var tempdata = _.union(data.ReturnObject.user,data.ReturnObject.grp,data.ReturnObject.org); //数据列表
                            var dataList = "";
                            for (var i = 0; i < tempdata.length; i++) {
                                if (_this.ddtemplate(tempdata[i]) != undefined)
                                    dataList += _this.ddtemplate(tempdata[i]);
                            }
                            if (dataList.length > 0) {
                                $("#" + _sugListID).show().html("<dl><dt>可以@同事、部门、群组</dt>" + dataList + "</dl>")
                                _this.searched = _this.at['m'];
                                _this.buidTip();
                            }
                            else {
                                _this.hiddenTip();
                            }
                        } else {
                            _this.hiddenTip();
                        }
                    }
                });
            }
            //}, 200);
        },
        buidTip: function () {//创建tip，设置tip的位置
            var _this = this;
            var _sugListID = this.sugListID;
            $("#" + this.tWarp).empty();
            var _string = "<span>" + this.format(this.at['l']) + "</span>" + "<cite>@</cite>" + "<span>" + this.format(this.at['r']) + "</span>";
            $("#" + this.tWarp).html(_string);
            var _left = $("#" + this.tWarp + " cite").offset().left + "px",
                _top = $("#" + this.tWarp + " cite").offset().top + parseInt($("#" + this.tWarp).css("line-height")) + "px";
            if (parseInt(_top) > parseInt($("#" + this.tWarp).offset().top + $("#" + this.tWarp).height())) {
                _top = $("#" + this.tWarp).offset().top + $("#" + this.tWarp).height() + "px";
            }
            $("#" + _sugListID).css({ "left": _left, "top": _top, "display": "block" });
            $("#" + _sugListID + " dd").eq(0).addClass("on").siblings().removeClass("on");
            _this.hover(_sugListID);
            //取消keyup绑定，绑定keydown，键盘操作选择，避免与文本框的事件冲突
            $(_this.elem).unbind('keyup').unbind('keydown').bind('keydown', function (e) {
                return _this.keyMove(_sugListID, e);
            });
            document.onclick = function () {//document绑定事件
                _this.hiddenTip();
            }
        },
        inset: function () {//给dd绑定事件，
            var _this = this;
            $("#" + this.sugListID).delegate("dd", "click", function () {//事件委托
                if ($(this).index() == 0) {
                    _this.elem.focus();
                    return false;
                } else {
                    var txtData="";var _datatype = $(this).attr("data-type");
                    if(_datatype=="user"){
                        txtData = $(this).find(".fw_agtlist_sname").text();
                    }else if(_datatype=="grp"){
                        txtData = $(this).find(".sgt_groupname").text();
                    }else if(_datatype=="org"){
                        txtData = $(this).find(".sgt_orgname").text();
                    }
                    var guid = $(this).attr("data-uid");
                    var dtype=$(this).attr("data-type");
                    var email=$(this).find(".fw_agtlist_semail").text();
                    _this.add(_this.elem, txtData, _this.at['pos'], _this.at['len'], guid,email,dtype);
                    _this.hiddenTip();
                }
            })

        },
        hiddenTip: function () {
            var _this = this;
            $("#" + this.sugListID + " dd").unbind("click,mouseover");
            $("#" + this.sugListID).css("display", "none");
        },
        keyMove: function (eid, e) {//键盘操作
            var _this = this;
            var _key = e.keyCode;
            var _len = $("#" + eid + " dd").length;
            switch (_key) {
                case 40:
                    //下
                    _this.index++;
                    if (_this.index > _len - 1) {
                        _this.index = 0;
                    }
                    _this.keyMoveTo(eid, _this.index);
                    return false;
                    break;
                case 38:
                    //上
                    _this.index--;
                    if (_this.index < 0) {
                        _this.index = _len - 1;
                    }
                    _this.keyMoveTo(eid, _this.index);
                    return false;
                    break;
                case 13:
                    //enter键
                    if (this.model == 0)//侃侃框
                    {
                        var txtData="";var _thisItem = $("#" + eid).find(".on");var _datatype = _thisItem.attr("data-type");
                        if(_datatype=="user"){
                            txtData = $("#" + eid).find(".on").find(".fw_agtlist_sname").text();
                        }else if(_datatype=="grp"){
                            txtData = $(".sgt_groupname", _thisItem).text();
                        }else if(_datatype=="org"){
                            txtData = $(".sgt_orgname", _thisItem).text();
                        }
                        //var txtData = $("#" + eid).find(".on").find(".fw_agtlist_sname").text();
                        var uid = $("#" + eid).find(".on").attr("data-uid");
                        _this.add(_this.elem, txtData, _this.at['pos'], _this.at['len'], uid,"",_datatype);
                    }
                    else {//选择用户、组织、群组
                        //var txtData = $("#" + eid).find(".on").find(".fw_agtlist_sname").html(); //
                        //var uid = $("#" + eid).find(".on").attr("data-uid");
                        //var email = $("#" + eid).find(".on").find(".fw_agtlist_semail").html();
                        //_this.addin(uid, txtData, email, "SELECT_ADD");
                        var _thisItem = $("#" + eid).find(".on");
                        var _datatype = _thisItem.attr("data-type");
                        if (_datatype == "user") {
                            var txtData = _thisItem.find(".fw_agtlist_sname").text(); //user name
                            var txtemail = _thisItem.find(".fw_agtlist_semail").text(); //email
                            var uid = _thisItem.attr("data-uid");
                            var headimg=_thisItem.attr("data-headimg");
                            var p_data={uname:txtData,email:txtemail,uid:uid,headimg:headimg,datatype:_datatype};
                            _this.addin(p_data,"SELECT_ADD");
                            _this.KIhidden();
                        } else if (_datatype == "grp") {
                            var groupname = $(".sgt_groupname", _thisItem).text();
                            var groupid = _thisItem.attr("data-uid");
                            var p_data={uname:groupname,uid:groupid,datatype:_datatype};
                            _this.addin(p_data, "SELECT_ADD");
                            _this.KIhidden();
                        } else if (_datatype == "org") {
                            var orgname = $(".sgt_orgname", _thisItem).text();
                            var orgid = _thisItem.attr("data-uid");
                            var p_data={uname:orgname,uid:orgid,datatype:_datatype}
                            _this.addin(p_data, "SELECT_ADD");
                            _this.KIhidden();
                        }
                    }
                    _this.keyHandler()
                    return false;
                    break;
                default:

            };
            _this.keyHandler();
        },
        keyHandler: function () {
            var _this = this;
            _this.index = 0;
            //enter键盘操作后重新绑定keyup
            if (this.model == 0) {
                $(_this.elem).unbind("keydown").bind("keyup", function (e) {
                    _this.getAt(e);
                })
            }
            else {
                $(_this.elem).unbind("keydown").bind("keyup",
                    _.debounce(function(e){
                        _this.KIshow(e);
                    },200)
                )
            }
        },
        keyMoveTo: function (eid, index) {
            $("#" + eid + " dd").removeClass("on").eq(index).addClass("on");
        },
        hover: function (eid) {
            //hover事件
            var _this = this;
            $("#" + eid + " dd:not(:first)").hover(function () {
                _this.index = $(this).index();
                $(this).addClass("hover").siblings().removeClass("on hover")
            }, function () {
                $(this).removeClass("hover");
            });
        },
        ddtemplate: function (data, i) {
            data = jQuery.extend({ guid: '00000000-0000-0000-0000-000000000000', headimg: '', name: '匿名', department: '未知部门', passport: 'xx@abc.com', datatype: 'user' }, data);
            if (data.name == null) return;
            var _temp = "";
            var _class = i == 0 ? "class=\"agt_cate_line\"" : "";
            if (data.datatype == "user") {
                _temp = "<dd data-uid=\"" + data.guid + "\" data-type=\"" + data.datatype + "\" " + _class + " data-headimg=\""+data.headimg+"\" data-name=\""+data.name+"\">";
                _temp += "<div class=\"fw_agtlist_ddleft\">";
                _temp += "<img src=\"" + data.headimg + "\" alt=\"\"/>";
                _temp += "</div>";
                _temp += "<div class=\"fw_agtlist_ddright\"><span class=\"fw_agtlist_sname\">" + data.name + "</span><span class=\"fw_agtlist_sdepartment\">" + this.strSub(data.department, 12) + "</span><span class=\"fw_agtlist_semail\">" + data.passport + "</span></div>";
                _temp += "</dd>";
            } else if (data.datatype == "org") {
                _temp = "<dd data-uid=\"" + data.guid + "\" data-type=\"" + data.datatype + "\" " + _class + ">";
                _temp += "<div class=\"fw_agtlist_ddleft\">";
                _temp += "<div class=\"fw_agtlist_orgico\"></div>";
                _temp += "</div>";
                _temp += "<div class=\"fw_agtlist_ddright\"><span class=\"sgt_gtname\">部门</span><span class=\"sgt_orgname\">" + data.name + "</span></div>";
                _temp += "</dd>";
            } else if (data.datatype = "grp") {
                _temp = "<dd data-uid=\"" + data.guid + "\" data-type=\"" + data.datatype + "\" " + _class + ">";
                _temp += "<div class=\"fw_agtlist_ddleft\">";
                _temp += "<div class=\"fw_agtlist_grpico\"></div>";
                _temp += "</div>";
                _temp += "<div class=\"fw_agtlist_ddright\"><span class=\"sgt_gtname\">群组</span><span class=\"sgt_groupname\">" + data.name + "</span></div>";
                _temp += "</dd>";
            }
            return _temp;
        },
        /*单选选择*/
        KISetStyle: function (ojb) {
            var _left = $(this.elem).offset().left + "px",
                _top = $(this.elem).offset().top + 22 + "px",
                _width = $(this.elem).outerWidth() + "px",
                _height = $(this.elem).outerHeight() + "px";
            ojb.css({ "position": "absolute", "z-index": "9999", "left": _left, "top": _top, "display": "block" });
        },
        KIInit: function () {/*绑定*/
            var _body = $("body");
            $("#" + this.sugListID).remove(); /*若存在先删除*/
            $("#ksnselector_tempcontainer").remove();
            var _tip = $("<div id='" + this.sugListID + "' style='display:none' class='fw_agtlist'></div>");
            var _tempContainer = $('<span id="ksnselector_tempcontainer" style="display:none;"></span>'); /*添加临时监控容器*/
            _body.append(_tip).append(_tempContainer);
            var _this = this;
            var fw_ksntxtbox = $(this.elem).parent();
            if (!this.isEnable) {
                $(this.elem).attr("disabled", true);
                fw_ksntxtbox.parents(".fw_ksntxtbox").find(".fw_sboxer").hide();
            }
            if(!!this.readonly){
                fw_ksntxtbox.parents(".fw_ksntxtbox").find(".fw_sboxer").hide();
            }

            /*获取焦点事件*/
            fw_ksntxtbox.click(function () {
                $(this).find("input").focus();
            });
            /*删除事件*/
            fw_ksntxtbox.bind("click", function (event) {
                if ($(event.target)[0].tagName == "A") {
                    $(event.target).parents(".fw_ksninput_slted").remove();
                    $(".fw_boxerContainer").remove();
                    if (_this.model == 1) {
                        $(this).find("input").show();
                        $(this).parents(".fw_ksntxtbox").find(".fw_sboxer").show();
                        $(this).parents(".fw_ksntxtbox").css("border", "solid 1px #E2E5E7");
                    }
                    if (_this.deleteItemCallBack) {
                        _this.deleteItemCallBack($(event.target).parent()[0]);
                    }
                    _this.KInputReset();
                }
                return false;
            });
            _this.KIEventBind();
        },
        KIshow: function (event) {/*显示*/
            var _this = this;
            var _inputData = $.trim($(this.elem).val());
            var _sugListID = this.sugListID;
            var _guidslist = _this.KIExitGuid();
            if (_inputData.length > 0) {
                $("#ksnselector_tempcontainer").text(_inputData);
                $(this.elem).width($("#ksnselector_tempcontainer").width() + 3);
                $.ajax({
                    url: this.url + "&k=" + encodeURIComponent(_inputData) + "&g=" + _guidslist + "&t=" + _this.sType,
                    type: "get",
                    dataType: "json",
                    data: {},
                    success: function (rqData) {
                        if (rqData.Result) {//数据请求成功
                            var tempdata = rqData.ReturnObject; //数据列表
                            var typels = _this.sType;
                            var sglisHtml = "";
                            if (typels.indexOf("user") > -1) { /*选人*/
                                var userlist = tempdata.user;
                                if (userlist.length > 0) {
                                    for (var i = 0; i < userlist.length; i++) {
                                        sglisHtml += _this.ddtemplate(userlist[i], i);
                                    }

                                }
                            }
                            if (typels.indexOf("grp") > -1) {
                                var grplist = tempdata.grp;
                                if (grplist.length > 0) {
                                    for (var i = 0; i < grplist.length; i++) {
                                        sglisHtml += _this.ddtemplate(grplist[i], i);
                                    }
                                }
                            }
                            if (typels.indexOf("org") > -1) {
                                var orglist = tempdata.org;
                                if (orglist.length > 0) {
                                    for (var i = 0; i < orglist.length; i++) {
                                        sglisHtml += _this.ddtemplate(orglist[i], i);
                                    }
                                }
                            }
                            if (sglisHtml.length > 0) {
                                $("#" + _sugListID).html("<dl><dt>同事姓名、拼音、邮箱可检索</dt>" + sglisHtml + "</dl>");
                                _this.KISetStyle($("#" + _sugListID + ""));
                                $("#" + _sugListID + " dd").eq(0).addClass("on").siblings().removeClass("on");
                                //取消keyup绑定，绑定keydown，键盘操作选择，避免与文本框的事件冲突
                                $(_this.elem).unbind('keyup').unbind('keydown').bind('keydown', function (e) {
                                    $(".fw_boxerContainer").remove();
                                    return _this.keyMove(_sugListID, e);
                                });
                                document.onclick = function () {//document绑定事件
                                    _this.KIhidden();
                                }
                            }
                            else {
                                _this.KIhidden();
                            }
                        }
                        else {
                            _this.KIhidden();
                        }
                    }
                });
            } else {
                _this.KIhidden();
                event = event || window.event;
                if (_inputData.length == 0 && event.keyCode == 8) {
                    var t_length = $("#ksnselector_tempcontainer").text().length;
                    if (t_length == 1) {
                        $("#ksnselector_tempcontainer").text("");
                    } else {
                        $(this.elem).prev(".fw_ksninput_slted").remove();
                    }
                }

            }
        },
        KIExitGuid: function () {
            var guids = "";
            $(this.elem).parent().find(".fw_ksninput_slted").each(function () {
                guids += "|" + $(this).attr("data-uid");
            });
            if (this.selectorExitsGuid.length > 0) {/*接入选人控制时，转入默认已选择的人员*/
                for (var i = 0; i < this.selectorExitsGuid.length; i++) {
                    guids += "|" + this.selectorExitsGuid[i];
                }
            }
            return guids;
        },
        KIEventBind: function () {
            var _this = this;
            $("#" + this.sugListID).delegate("dd", "click", function () {//事件委托
                var _thisItem = $(this);
                if (_thisItem.index() == 0) {
                    _this.elem.focus();
                    return false;
                } else {
                    var _datatype = _thisItem.attr("data-type");
                    if (_datatype == "user") {
                        var txtData = _thisItem.find(".fw_agtlist_sname").text(); //user name
                        var txtemail = _thisItem.find(".fw_agtlist_semail").text(); //email
                        var uid = _thisItem.attr("data-uid");
                        var headimg=_thisItem.attr("data-headimg");
                        var p_data={uname:txtData,uid:uid,email:txtemail,headimg:headimg,datatype:_datatype};
                        _this.addin(p_data, "SELECT_ADD");
                        _this.KIhidden();
                    } else if (_datatype == "grp") {
                        var groupname = $(".sgt_groupname", _thisItem).text();
                        var groupid = _thisItem.attr("data-uid");
                        var p_data={uname:groupname,uid:groupid,headimg:"",datatype:_datatype};
                        _this.addin(p_data, "SELECT_ADD");
                        _this.KIhidden();
                    } else if (_datatype == "org") {
                        var orgname = $(".sgt_orgname", _thisItem).text();
                        var orgid = _thisItem.attr("data-uid");
                        var p_data={uname:orgname,uid:orgid,headimg:"",datatype:_datatype};
                        _this.addin(p_data,"SELECT_ADD");
                        _this.KIhidden();
                    }
                }
            });
        },
        addin: function (sltData,addtype) {
            var datatype=sltData.datatype,uname=sltData.uname,uid=sltData.uid,uemail=sltData.email,ureadonly=sltData.ureadonly;
            var dataStr=encodeURIComponent($.JSONString(sltData));
            var _this = this;
            var go = true;
            var _thiselem = $(this.elem);
            var exitsusers = _thiselem.parent().find(".fw_ksninput_slted").length;
            if (exitsusers + 1 > this.maxSelected) {
                alert('已到达最大可选数了');
                _thiselem.focus();
                go = false;
                this.elem.value = "";
            }
            var _category = "";
            if (datatype == "org") {
                _category = "[组织]";
            } else if (datatype == "grp") {
                _category = "[群组]";
            }
            if (this.model == 2 && go) {
                if (!$(this.elem).is(":hidden")) {
                    this.elem.focus();
                }
                _thiselem.val("");
                _thiselem.before("<span class=\"fw_ksninput_slted\" data-uid=\"" + uid + "\" data-type=\"" + datatype + "\" f-data=\""+dataStr+"\" u-readonly=\""+(_this.readonly||ureadonly)+"\"><em>" + _category + uname + "</em>" + (_this.readonly||ureadonly ? "" : "<a></a>") + "</span>");
                _this.KInputReset();
            } else if (this.model == 1 && go) {
                _thiselem.hide();
                _thiselem.val("");
                _thiselem.parent().parent().css("border", "solid 1px transparent");
                _thiselem.parents(".fw_ksntxtbox").find(".fw_sboxer").hide();
                _thiselem.before("<span class=\"fw_ksninput_slted\" data-uid=\"" + uid + "\" data-type=\"" + datatype + "\" f-data=\""+dataStr+"\" u-readonly=\""+(_this.readonly||ureadonly)+"\"><em>" + _category + uname + "</em>" + (_this.readonly||ureadonly ? "" : "<a></a>") + "</span>");
            }
            _this.KIhidden();
            $(this.elem).parents(".fw_ksntxtbox").find(".fw_ksnplaceholder").hide(); /*placeholder关闭*/
            if (_this.seletedCallback != null && addtype == "SELECT_ADD") {
                if (_this.seletedCallback(uid, uname, uemail, datatype) == "cancel") {/*当selectedCallback返回'cancel'串时，选不中*/
                    go = false;
                }
            }
        },
        KIhidden: function () {
            $("#" + this.sugListID).css("display", "none");
            $("#" + this.sugListID + " dd").unbind("click,mouseover");
        },
        KInputReset: function () {
            if ($.trim($(this.elem).parent().find("span").text()).length > 0) {
                var _lastElem = $(this.elem).parent().find("span").last();
                var _fatherElem = $(this.elem).parent();
                $(this.elem).width(10);
                $("#ksnselector_tempcontainer").text(""); /*清空临时监控容器*/
            }
        },
        KIClearData: function () { $(this.elem).parent().find("span a").click(); },
        KIDataLoaded: function (data) {//原始数据加载【推荐使用KISetDataLoad()方法】
            //data = [{ "uid": "00000000-0000-0000-0000-000000000000", "uname": "测试1" }, { "uid": "00000000-0000-0000-0000-000000000000", "uname": "测试2" }, { "uid": "00000000-0000-0000-0000-000000000000", "uname": "测试3"}];
            if (data.length > 0) {
                var _this = this;
                for (var i = 0; i < data.length; i++) {
                    _this.addin({uname:data[i].uname,uid:data[i].uid,headimg:data[i].headimg||"",datatype:data[i].datatype||"user"},"LOAD_ADD"); /*LOAD_ADD:程序加载；SELECT_ADD:手动选择*/
                }
            }
        },
        KISetDataLoad: function (data, _callback) {/*新增加方法，只需要传递UID*/
            //data = ["accc5925-2003-483c-8ad2-694c7f4385b8", "239971a7-304e-445a-9468-009c513658ff", "75b741a8-09cb-42ff-b105-2e10f6be3e59"];

            var newData = [];
            for (var i = 0; i < data.length; i++) {
                if(_.isObject(data[i])){//新扩展方法，支持传对象
                    newData.push({"type": "user", "id": data[i].id,"ureadonly":data[i].ureadonly });
                }else {//兼容原传单个ID
                    newData.push({ "type": "user", "id": data[i] });
                }
            }
            this.KISetSelectedData(newData, _callback); /*转向新方法*/
        },
        KISetSelectedData: function (data, _callback) { /*设置或加载人、群组、组织，使之已选中【新增方法】*/
            var _this = this;
            if (data.length > 0) {
                //sample:data=[{"type":"user","id":"accc5925-2003-483c-8ad2-694c7f4385b8"},{"type":"org","id":"accc5925-2003-483c-8ad2-694c7f4385b8"},{"type":"grp","id":"accc5925-2003-483c-8ad2-694c7f4385b8"}]
                var loadinfos = $.JSONString(data);
                $.post(i8_session.ajaxHost+'webajax/plugins/selector/getpers?', { data: loadinfos }, function (response) {
                    if (response) {
                        if (response.Result) {
                            var datalist = response.ReturnObject;
                            for (var i = 0; i < datalist.length; i++) {
                                var _u_readonly= _.findWhere(data,{id:datalist[i].id}).ureadonly||false;
                                _this.addin({uname:datalist[i].name,uid:datalist[i].id,headimg:datalist[i].img,datatype:datalist[i].type,ureadonly:_u_readonly},"LOAD_ADD" );
                            }
                            if (_callback) { _callback(); }
                        }
                    }
                }, "json")
            }
        },
        KIGetAllSelectedData: function () {/*获取或加载人、群组、组织，使之已选中【新增方法】*/
            var selectedData = [];
            var relist = this.elem.parentNode.childNodes;
            if (relist.length > 0) {
                for (var i = 0; i < relist.length; i++) {
                    if (relist[i].tagName == "SPAN") {
                        var _id = relist[i].attributes.getNamedItem("data-uid").nodeValue;
                        var _type = relist[i].attributes.getNamedItem("data-type").nodeValue;
                        var _name = relist[i].innerText || relist[i].textContent;
                        selectedData.push({ "type": _type, "id": _id, "name": _name });
                    }
                }
            }
            return selectedData;
        },
        KISelectedData: function () {
            var items = "";
            var relist = $(this.elem).parent().children("span");
            if (relist.length > 0) {
                for (var i = 0; i < relist.length; i++) {
                    var re = relist[i].attributes.getNamedItem("data-uid").nodeValue;
                    if (re != "") {
                        if (items != "") {
                            items = items + ";" + re;
                        } else {
                            items = re;
                        }
                    }
                }
            }
            return items;
        }
    };
    //经常用的是通过遍历,重构数组
    Array.prototype.remove = function (dx) {
        if (isNaN(dx) || dx > this.length) { return false; }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }
    //消重复项
    Array.prototype.uniq = function () {
        var temp = {}, len = this.length;
        for (var i = 0; i < len; i++) {
            if (typeof temp[this[i]] == "undefined") {
                temp[this[i]] = 1;
            }
        }
        this.length = 0;
        len = 0;
        for (var i in temp) {
            this[len++] = i;
        }
        return this;
    }

    function substr(str, len) {
        if (!str || !len) { return ''; }
        var a = 0; var i = 0; var temp = '';
        for (i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                a += 2;
            }
            else { a++; }
            if (a > len) { return temp; }
            temp += str.charAt(i);
        }
        return str;
    }

    if(i8_session&&i8_session.uid){
        exports.KSNSelector=kSNSelector;
    }else{
        exports.KSNSelector=require('./template/fw_selectornologin').KSNSelector;
    }
})