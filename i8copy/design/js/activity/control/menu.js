/**
 * Created by Ling on 2014/11/20.
 */
define(function (require, exports) {
    var load_menu = function () {
        //加载图形
        //$.get(i8_session.ajaxWfHost+'webajax/design/activity/getregisteract',function(menu){
        var menu = {
            "ReturnObject": {
                "Item1": 2,
                "Item2": [{
                    "ActivityName": "开始",
                    "ActivityType": 0,
                    "RoleType": [],
                    "Duration": 0,
                    "Config": "",
                    "Version": 1,
                    "Sort": 0,
                    "Status": 0,
                    "ID": "9d2bde64-7316-3ab8-af2f-c18f3106ba9e",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "结束",
                    "ActivityType": 10,
                    "RoleType": [],
                    "Duration": 0,
                    "Config": "",
                    "Version": 0,
                    "Sort": 0,
                    "Status": 0,
                    "ID": "dce9ceb1-ed09-d06b-e7a2-ec7dce527462",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "串签(汇报关系)",
                    "ActivityType": 1,
                    "RoleType": [7, 8],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 6,
                    "Status": 0,
                    "ID": "c809b23c-abe3-47b4-8e81-214080fbccc1",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "串签(指定角色)",
                    "ActivityType": 1,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 7,
                    "Status": 0,
                    "ID": "4016e2cd-23ec-4fa9-180d-ce23d6f62e10",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "并签环节",
                    "ActivityType": 2,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 8,
                    "Status": 0,
                    "ID": "20002cd8-eec4-e0c3-c8d5-b1c0192096af",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "收文环节",
                    "ActivityType": 3,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 9,
                    "Status": 0,
                    "ID": "7cabe7fa-a5dd-646a-e7c9-f5884889bf5e",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "执行环节",
                    "ActivityType": 4,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 10,
                    "Status": 0,
                    "ID": "f037c292-c1ac-93cd-11ad-d6c379d013b1",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "表决环节",
                    "ActivityType": 7,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 11,
                    "Status": 0,
                    "ID": "af078f85-7531-6df5-04e3-edabc38710cc",
                    "LastUpdateTime": "2014-04-14 19:06:47",
                    "CreateTime": "2014-04-14 19:06:47",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }, {
                    "ActivityName": "或签环节",
                    "ActivityType": 8,
                    "RoleType": [2, 4],
                    "Duration": 0,
                    "Config": "",
                    "Version": 2,
                    "Sort": 12,
                    "Status": 0,
                    "ID": "0f9d1236-12ba-44f2-bc47-696d43d3e3cf",
                    "LastUpdateTime": "2014-12-09 18:36:11",
                    "CreateTime": "2014-12-09 18:36:11",
                    "AccountID": "00000000-0000-0000-0000-000000000000"
                }]
            }, "Result": true, "Code": 0, "Description": null
        };
        if (menu.Result) {//获取成功
            var json = menu.ReturnObject;
            js_act_version = json.Item1;//环节版本，1：B方式用户2：C方式用户
            var regAct = json.Item2;//环节列表
//                if(js_act_version >=1){//B用户
//                    for(var i=0;i<regAct.length;i++){
//                        if(regAct[i].Version == 1 && regAct[i].ActivityType != 0 && regAct[i].ActivityType != 10){
//                            switch(regAct[i].ActivityType) {
//                                case 1://上级审批
//                                    if(regAct[i].RoleType.indexOf(7) > -1)//汇报关系
//                                        wf_addVertex(wf_imgpath + 'design/graph/b1.png', 140, 40, 'shape=label;image=' + wf_imgpath + 'design/b1.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fillColor=#47c7ea;imageWidth=27;imageHeight=25;fontColor=#ffffff;', "Sequence_ReportActivity",regAct[i].ActivityName,regAct[i].Version);
//                                    else //专项人员审批 //多人同时审批
//                                        wf_addVertex(wf_imgpath + 'design/graph/b1.1.png', 140, 40, 'shape=label;image=' + wf_imgpath + 'design/b1.1.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fillColor=#47c7ea;imageWidth=27;imageHeight=25;fontColor=#ffffff;',"Sequence_RoleActivity", regAct[i].ActivityName,regAct[i].Version);
//                                    break;
//                                case 2: //多人同时审批
//                                    wf_addVertex(wf_imgpath + 'design/graph/b2.png', 140, 40, 'shape=label;image=' + wf_imgpath + 'design/b2.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fillColor=#47c7ea;imageWidth=27;imageHeight=25;fontColor=#ffffff;',"ConCurrentActivity", regAct[i].ActivityName,regAct[i].Version);
//                                    break;
//                                case 4://专项人员执行
//                                    wf_addVertex(wf_imgpath + 'design/graph/b4.png', 140, 40, 'shape=label;image=' + wf_imgpath + 'design/b4.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fillColor=#47c7ea;imageWidth=27;imageHeight=25;fontColor=#ffffff;',"ExecutionActivity", regAct[i].ActivityName,regAct[i].Version);
//                                    break;
//                                case 7://多人表决
//                                    wf_addVertex(wf_imgpath + 'design/graph/b7.png', 140, 40, 'shape=label;image=' + wf_imgpath + 'design/b7.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fillColor=#47c7ea;imageWidth=27;imageHeight=25;fontColor=#ffffff;',"VoteActivity", regAct[i].ActivityName,regAct[i].Version);
//                                    break;
//                            }
//                        }
//                    }
//                }
//                if(js_act_version == 2){//C用户
            for (var i = 0; i < regAct.length; i++) {
                if (regAct[i].Version == 2 && regAct[i].ActivityType != 0 && regAct[i].ActivityType != 10) {
                    switch (regAct[i].ActivityType) {
                        case 1://串签
                            if ((',' + regAct[i].RoleType.join(',') + ',').search(',' + 7 + ',') > -1)//汇报关系
                                wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_1.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_1.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fontColor=#ffffff;fillColor=#2ca3da;', "Sequence_ReportActivity", regAct[i].ActivityName, regAct[i].Version);
                            else
                                wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_1.1.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_1.1.png' + ';gradientDirection=south;rounded=true;fontColor=#ffffff;perimeterspacing=6;fillColor=#0bb59b;', "Sequence_RoleActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 2://并签
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_2.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_2.png' + ';gradientDirection=south;rounded=true;perimeterspacing=6;fontColor=#ffffff;fillColor=#c7c916;', "ConCurrentActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 3://收文
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_3.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_3.png' + ';gradientDirection=south;fontColor=#ffffff;rounded=true;perimeterspacing=6;fillColor=#f5b927;', "ReceiverActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 4://执行
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_4.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_4.png' + ';gradientDirection=south;fontColor=#ffffff;rounded=true;perimeterspacing=6;fillColor=#f58327', "ExecutionActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 5://知会
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_5.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_5.png' + ';gradientDirection=south;fontColor=#ffffff;rounded=true;perimeterspacing=6;fillColor=#ffd314;', "NotifiedActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 7://表决
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_7.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_7.png' + ';gradientDirection=south;fontColor=#ffffff;rounded=true;perimeterspacing=6;fillColor=#d09ef0', "VoteActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                        case 8://或签
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/new_8.png', 140, 47, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/new_icon_8.png' + ';gradientDirection=south;fontColor=#ffffff;rounded=true;perimeterspacing=6;fillColor=#7c96f4', "OrSignActivity", regAct[i].ActivityName, regAct[i].Version);
                            break;
                    }
                }
            }
//                }
            for (var i = 0; i < regAct.length; i++) {
                if (regAct[i].ActivityType == 0 || regAct[i].ActivityType == 10) {
                    switch (regAct[i].ActivityType) {
                        case 0://开始
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/tools_start.png', 22, 22, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/tools_start.png' + ';rounded=true;fillColor=#93DF00;imageAlign=center;', "StartActivity", '开始', '');
                            break;
                        case 10://结束
                            wf_addVertex('https://dn-i8res.qbox.me/public/workflow/design/icos/tools_end.png', 22, 22, 'shape=label;image=https://dn-i8res.qbox.me/public/workflow/design/icos/tools_end.png' + ';rounded=true;fillColor=#f97e76;imageAlign=center;', "EndActivity", '结束', '');
                            break;
                    }
                }
            }
//                var endHtml = $("#graphTool div:last").html();
//                $("#graphTool div:last").remove();
//                $("#graphTool div:last").append("开始&nbsp;" + endHtml +"结束");
        }
        //})
    }
    //创建工具栏
    var wf_addVertex = function (icon, w, h, style, ctlName, title, version) {
        var wf_doc = mxUtils.createXmlDocument(); //创建一个空的xml文档
        var wf_graphTool = document.getElementById("graphTool"); //获取工具栏容器
        var div_tools = document.createElement("div");
        if (title == "结束")
            div_tools = $("#graphTool div:last");
        else
            div_tools.setAttribute("class", "wf_tools_img");
        var wf_toolbar = new mxToolbar(div_tools);
        wf_toolbar.enabled = false;
        var node = wf_doc.createElement(ctlName);
        if (title == "开始" || title == "结束")
            node.setAttribute("value", ' ');
        else
            node.setAttribute("value", title);

        var vertex = new mxCell(node, new mxGeometry(0, 0, w, h), style);
        vertex.setVertex(true);
        var img = wf_addToolbarItem(wf_graph, wf_toolbar, vertex, icon, ctlName, version);
        img.title = title;
        $(wf_graphTool).append(div_tools);
        //wf_toolbar.addLine();
    };
    //添加图形工具
    function wf_addToolbarItem(wf_graph, wf_toolbar, prototype, image, type, version) {
        var wf_funct = function (wf_graph, evt, cell, x, y) {
            //判断拖入的图形如果是开始或者结束，则判断容器中是否已存在，不能重复添加，开始或结束只能出现一次
            if (type == "StartActivity" || type == "EndActivity") {
                var encoder = new mxCodec();
                var node = encoder.encode(wf_graph.getModel());
                var StartNodes = $(node).find("StartActivity").length; //开始节点
                var EndNodes = $(node).find("EndActivity").length; //开始节点
                if (type == "StartActivity") {//开始节点
                    if (StartNodes > 0) {
                        seajs.use("default/javascripts/common/i8ui", function (i8ui) {
                            i8ui.alert({title: "开始节点已存在,不能重复添加!"});
                        })
                        return;
                    }
                }
                if (type == "EndActivity") {//结束节点
                    if (EndNodes > 0) {
                        seajs.use("default/javascripts/common/i8ui", function (i8ui) {
                            i8ui.alert({title: "结束节点已存在,不能重复添加!"});
                        })
                        return;
                    }
                }
            }

            wf_graph.stopEditing(false);
            var vertex = wf_graph.getModel().cloneCell(prototype);
            vertex.setId(Guid.NewGuid().ToString());
            vertex.setAttribute("Version", version);//版本号

            vertex.geometry.x = x + 3;
            vertex.geometry.y = y + 18;
            wf_graph.addCell(vertex);
            wf_graph.setSelectionCell(vertex);

        }
        // Creates the image which is used as the drag icon (preview)
        var img = wf_toolbar.addMode(type, image, function (evt, cell) {
            var pt = this.wf_graph.getPointForEvent(evt);
            wf_funct(wf_graph, evt, cell, pt.x, pt.y);
        });
        mxUtils.makeDraggable(img, wf_graph, wf_funct);

        return img;
    }

    exports.load_menu = load_menu;//加载环节
});