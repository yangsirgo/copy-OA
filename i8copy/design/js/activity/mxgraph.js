/**
 * Created by Ling on 2014/11/13.
 */
define(function(require,exports){
//    $(window.parent.document).keydown(function (event) {//事件监听
//        var curKey = event.which;
//        if (curKey == 46){
//            require("default/javascripts/design/activity/control/common").wf_delLink();
//            /*seajs.use("default/javascripts/design/activity/control/common",function(result){
//                result.wf_delLink();
//            })*/
//        }
//    })
//    $(document).keydown(function (event) {//事件监听
//        var curKey = event.which;
//        if (curKey == 46){
//            require("default/javascripts/design/activity/control/common").wf_delLink();
//            /*seajs.use("default/javascripts/design/activity/control/common",function(result){
//                result.wf_delLink();
//            })*/
//        }
//    })
    /*
     程序主入口  Start
     */
    $(document).ready(function () {
        //判断浏览器的兼容
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is
            // not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        }
        else {
            //获取面板容器
            var wf_Container = document.getElementById("graphContainer");

            //创建图形
            var wf_model = new mxGraphModel();
            wf_graph = new mxGraph(wf_Container, wf_model);
            //wf_graph.getStylesheet().styles.defaultVertex.fontColor = '#ffffff';
            wf_graph.setConnectable(true); //指定节点与节点之间是否可以连接
            wf_graph.setMultigraph(false); //指定节点与节点之间是否可以重复连接
            wf_graph.setAllowDanglingEdges(false); //设置连接线必需连接到节点上且不能移动
            //        graph.connectionHandler.createTarget = true;//当被接连的节点没有时，则创建一个克隆
            new mxRubberband(wf_graph); //启用拖动环节功能
            mxGraphHandler.prototype.guidesEnabled = true; //启用拖动指南针
            // Defines an icon for creating new connections in the connection handler.
            // This will automatically disable the highlighting of the source vertex.
            mxConnectionHandler.prototype.connectImage = new mxImage(wf_imgpath + 'design/graph/connector.gif', 16, 16); //创建连线图形
            wf_graph.createHandler = function (state) {
                if (state != null &&
                    this.model.isVertex(state.cell)) {
                    return new mxVertexToolHandler(state);
                }
                return mxGraph.prototype.createHandler.apply(this, arguments);
            };
            var util=require('../common/util.js');
            $(".tlftitle").text(util.stringCut($("#txt_name", window.parent.document).val(),40));
            $(".tlftitle").attr("title",$("#txt_name", window.parent.document).val());
            //获取流程名称
           /* seajs.use(i8_session.resWfHost+"default/javascripts/common/util.js",function(util){            ;
                $(".tlftitle").text(util.stringCut($("#txt_name", window.parent.document).val(),40));
                $(".tlftitle").attr("title",$("#txt_name", window.parent.document).val());
            })*/


            wf_graph.convertValueToString = function (cell)//返回单元格的值
            {
                return cell.getAttribute('value') == null ? cell.value : cell.getAttribute('value');
            };
            wf_defaultStyle(); //加载图形样式
            wf_defaultModel(); //创建默认图形
            //添加工具栏
            require("./control/menu").load_menu();
            /*seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/menu",function(result){
                result.load_menu();
            })*/
            wf_eventMethod(); //事件方法
        }
    })
    /*
     程序主入口  End
     */
    //---------------------------------------------------------------------------------------------
    //生成XML按钮  提交按钮
    $(document).on('click','#btn_save',function () {
        var encoder = new mxCodec();
        var node = encoder.encode(wf_graph.getModel());
        var verify=require("./control/verify");
        if (!verify.wf_subVerify(node))//验证
            return false;
        //是否需要提交后台
        if(wf_isChange) {
            //装载XML
            var xml = mxUtils.getXml(node);
            xml = xml.replace(/NaN/g, ' ');
            xml = xml.replace(/1.#QNAN/g, ' ');
            if (xml.indexOf("<mxGraphModel>") < 0)
                xml = "<mxGraphModel>" + xml + "</mxGraphModel>";
            //数据提交
            require("./control/submit").submitData('', '', xml);
        }
        else{
            wf_restWindow();
        }
    });
    //关闭窗口
    $(document).on('click',"#btn_colose",function () {
        wf_restWindow();
    })

    //还原窗口
    function wf_restWindow(){
        var encoder = new mxCodec();
        var node = encoder.encode(wf_graph.getModel());
        var nodes = $(node).find("mxCell");
        if (nodes.length > 2) {//mxcell大于2代表配置过设计器内容
            var xml = mxUtils.getPrettyXml(node);
            xml = xml.replace(/NaN/g, ' ');
            xml = xml.replace(/1.#QNAN/g, ' ');
            parent.diagramMetaData = xml;
            $("#js_edit_designer", window.parent.document).html("编辑");
        }
        else
            parent.diagramMetaData = "";
        //重绘设计器信息
        var dev=require("../design/dev");
        dev.Load_ActDesigner();
        window.parent.desginBox.close();
    }
    /*
     页面通用方法  Start
     */
    //条件未配置警告样式信息 lineIDList:需要删除样式的条件ID集合styleType:1:环节配置2:条件配置
    window.wf_LineSetStyle=function(lineIDList, styleType, strmsg) {
        var model = wf_graph.getModel();
        model.beginUpdate();
        try {
            if (lineIDList.indexOf('|') > 0) {
                lineIDList = lineIDList.split('|');
                for (var i = 0; i < lineIDList.length; i++) {
                    var cell = model.getCell(lineIDList[i]);
                    if (styleType == 1) //环节配置
                        wf_graph.setCellStyles("strokeColor", '#FF1A00', [cell]);
                    if (styleType == 2)//条件配置
                        wf_graph.setCellStyles("strokeColor", '#FF1A00', [cell]);
                    wf_graph.addCellOverlay(cell, createOverlay(wf_graph.warningImage, strmsg));
                }
            }
            else {
                var cell = model.getCell(lineIDList);
                if (styleType == 1)//环节配置
                    wf_graph.setCellStyles("strokeColor", '#FF1A00', [cell]);
                if (styleType == 2)//条件配置
                    wf_graph.setCellStyles("strokeColor", '#FF1A00', [cell]);
                wf_graph.addCellOverlay(cell, createOverlay(wf_graph.warningImage, strmsg));
            }
        }
        finally {
            model.endUpdate();
        }
    }
    //创建警告图形及错误信息
    function createOverlay(image, tooltip) {
        var i8ui=require('default/javascripts/common/i8ui');
        var overlay = new mxCellOverlay(image, tooltip);
        // Installs a handler for clicks on the overlay
        overlay.addListener(mxEvent.CLICK, function (sender, evt) {
            //seajs.use(i8_session.resWfHost+"default/javascripts/common/i8ui",function(i8ui){
                i8ui.alert({title:tooltip});
           // })
        });
        return overlay;
    };
    //清楚条件未配置警告样式信息 lineIDList:需要删除样式的条件ID集合 styleType:1:环节配置2:条件配置
    window.wf_LineDelStyle = function(lineIDList, styleType) {
        var model = wf_graph.getModel();
        model.beginUpdate();
        try {
            if (lineIDList.indexOf('|') > 0) {
                lineIDList = lineIDList.split('|');
                for (var i = 0; i < lineIDList.length; i++) {
                    var cell = model.getCell(lineIDList[i]);
                    if (styleType == 1)//条件配置
                        wf_graph.setCellStyles("strokeColor", '', [cell]);
                    if (styleType == 2)//条件配置
                        wf_graph.setCellStyles("", '', [cell]);
                    wf_graph.removeCellOverlays(cell);
                }
            } else {
                var cell = model.getCell(lineIDList);
                if (styleType == 1)//条件配置
                    wf_graph.setCellStyles("strokeColor", '', [cell]);
                if (styleType == 2)//条件配置
                    wf_graph.setCellStyles("", '', [cell]);
                wf_graph.removeCellOverlays(cell);
            }
        }
        finally {
            model.endUpdate();
        }
    }
    //事件方法
    function wf_eventMethod() {
        //连线验证，如果开始节点连接了一个节点则不能在连接
        mxConnectionHandler.prototype.isValidSource = function (cell) {
            if (cell == null || cell.value.nodeName == "EndActivity" || cell.isEdge()) {
                if (cell.isEdge() && cell.target == null) {
                    cell.remove();
                }
                return false;
            }
            return true;
        }
        //连线事件
        wf_graph.getEdgeValidationError = function (edge, source, target) {
            var result = "";
            if (target.value.nodeName == undefined)//连接到线上
                return false;
            //判断被连接的值是否是开始节点
            if (target.value.nodeName == "StartActivity")
                result = "开始节点不能被连接！";
            if (source.value.nodeName == "EndActivity")
                result = "结束节点不能进行连接！";
            if (source.id == target.id) //环节不能连接本身
                return false;
            var encoder = new mxCodec();
            var node = encoder.encode(wf_graph.getModel());
            //判断当前的环节版本1：B方式模式，2:C方式模式
            if(js_act_version == 1){//B方式
                if($(node).find("mxCell[source='"+source.id+"']").length > 0 && edge == null)
                    result = "当前版本不支持分支,请联系管理员！";
            }
            var nodes = $(node).find("mxCell[source]"); //获取XML的Cell节点。
            for (var i = 0; i < nodes.length; i++) {
                if ($(nodes[i]).attr("source") == source.id && $(nodes[i]).attr("target") == target.id)
                    result = "节点与节点之间不能重复连接！";
                if ($(nodes[i]).attr("source") == target.id && $(nodes[i]).attr("target") == source.id)
                    result = "节点与节点之间不能互相连接！";
            }
            wf_LineDelStyle(source.id + "|" + target.id, 1); // 清楚源和目标警告样式
            if (result != "") {
                seajs.use("default/javascripts/common/i8ui",function(i8ui){
                    i8ui.alert({title:result});
                });
                return false;
            }
        }
        //添加新的连接线的默认值
        mxConnectionHandlerInsertEdge = mxConnectionHandler.prototype.insertEdge;
        mxConnectionHandler.prototype.insertEdge = function (parent, id, value, source, target, style) {
            value = '　';
            id = Guid.NewGuid().ToString();
            return mxConnectionHandlerInsertEdge.apply(this, arguments);
        };
        //双击节点及连线事件
        wf_graph.dblClick = function (evt, cell) {
            if (cell != undefined) {
                //查询所有节点匹配所有节点是否只包含一个连接，如果是则不需要配置条件，否则则需要配置条件
                var encoder = new mxCodec();
                var node = encoder.encode(wf_graph.getModel());
                var nodes = "";
//                if($(node).find("mxCell").attr("source") == undefined)
//                {
//                    $(node).find("mxCell").each(function(i) {
//                        if($(this).attr("source")){
//                            nodes.add(this);
//                        }
//                    });
//                }
//                else
                    nodes = $(node).find("mxCell[source]"); //获取XML中包含source的Cell节点。
                var SourceEdgeNum = 0; //源连接次数
                for (var i = 0; i < nodes.length; i++) {
                    if (cell.source != null) {
                        if ($(nodes[i]).attr("source") == cell.source["id"])
                            SourceEdgeNum++;
                    }
                }
                var version = cell.getAttribute("Version");//环节版本
                //当节点不为开始节点和结束节点时则显示窗口
                if ((cell.value.nodeName != "StartActivity" && cell.value.nodeName != "EndActivity" && cell.value.nodeName != undefined) || (SourceEdgeNum > 1)) {
                    var showTitle = "";
                    var tplName = "";
                    cell = wf_graph.getSelectionCell();

                    if (cell.value.nodeName == "Sequence_ReportActivity") {//串签环节--汇报关系
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = version == 1? "上级审批":"串签环节--汇报关系";
                        tplName = "sequence_report";
                    }
                    else if (cell.value.nodeName == "Sequence_RoleActivity") {//串签环节--按指定角色
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = version == 1? "专项人员审批":"串签环节--按指定角色";
                        tplName = "sequence_role";
                    }
                    else if (cell.value.nodeName == "ConCurrentActivity") {//并签环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = version == 1? "多人同时审批":"并签环节";
                        tplName = "concurrent";
                    }
                    else if (cell.value.nodeName == "ReceiverActivity") {//收文环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = "收文环节";
                        tplName = "receiver";
                    }
                    else if (cell.value.nodeName == "NotifiedActivity") {//知会环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = "知会环节";
                        tplName = "notice";
                    }
                    else if (cell.value.nodeName == "ExecutionActivity") {//执行环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = version == 1? "专项人员执行":"执行环节";
                        tplName = "execute";
                    }
                    else if (cell.value.nodeName == "SignActivity") {//会签环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = "会签环节";
                        tplName = "sign";
                    }
                    else if (cell.value.nodeName == "VoteActivity") {//表决环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = version == 1 ? "多人表决":"表决环节";
                        tplName = "vote";
                    }
                    else if (cell.value.nodeName == "OrSignActivity") {//或签环节
                        wf_LineDelStyle(cell.id, 1); // 清楚警告样式
                        showTitle = "或签环节";
                        tplName = "orsign";
                    }
                    else {//为连线节点
                        wf_LineDelStyle(cell.id, 2); // 清楚警告样式
                        showTitle = "条件配置";
                        tplName = "line";
                    }
                    if(version == 1)//环节版本
                        tplName = "simple/" + tplName;
                    //获取模板
                    //seajs.use()

                    require.async('./template/'+ tplName + '.tpl',function(tpl){
                        tpl=template(tpl)({basePath:i8_session.resWfHost});
                        var i8ui=require("../common/i8ui");
                        //seajs.use(i8_session.resWfHost+"default/javascripts/common/i8ui",function(i8ui){
                            i8ui.showNoTitle({title:showTitle,cont:tpl});
                            var actType = 1;//环节类型
                            if (cell.value.nodeName == "Sequence_ReportActivity") {//串签环节--汇报关系
                                $("#txt_sequenceReportTitle").val(cell.getAttribute("value"));
                                actType = 1;
                            }
                            else if (cell.value.nodeName == "Sequence_RoleActivity") {//串签环节--按指定角色
                                $("#txt_sequenceRoleTitle").val(cell.getAttribute("value"));
                                actType = 2;
                            }
                            else if (cell.value.nodeName == "ConCurrentActivity") {//并签环节
                                $("#txt_conCurrentTitle").val(cell.getAttribute("value"));
                                actType = 3;
                            }
                            else if (cell.value.nodeName == "ReceiverActivity") {//收文环节
                                $("#txt_ReceiverTitle").val(cell.getAttribute("value"));
                                actType = 4;
                            }
                            else if (cell.value.nodeName == "NotifiedActivity") {//知会环节
                                $("#txt_NotifiedTitle").val(cell.getAttribute("value"));
                                actType = 7;
                            }
                            else if (cell.value.nodeName == "ExecutionActivity") {//执行环节
                                $("#txt_ExecutionTitle").val(cell.getAttribute("value"));
                                actType = 8;
                            }
                            else if (cell.value.nodeName == "SignActivity") {//会签环节
                                $("#txt_SignTitle").val(cell.getAttribute("value"));
                                actType = 9;
                            }
                            else if (cell.value.nodeName == "VoteActivity") {//表决环节
                                $("#txt_VoteTitle").val(cell.getAttribute("value"));
                                actType = 10;
                            }
                            else if (cell.value.nodeName == "OrSignActivity") {//或签环节
                                $("#txt_orSignTitle").val(cell.getAttribute("value"));
                                actType = 11;
                            }
                            else {//为连线节点
                                $("#lineName").val(cell.value || '　'); //节点名称
                                actType = 5;
                            }
                            wf_initConditionCongfig(actType, cell.id,version);
                        //})
                    })
                }
            }
        }
    }
    //初始化条件配置信息，并赋值
    function wf_initConditionCongfig(type, id,version) {
        var listOrderNum = -1;
        var common=require("./control/common");
        //seajs.use(i8_session.resWfHost+'default/javascripts/design/activity/control/common',function(common){
            var wf_ProcActity = common.wf_ProcActityArray;
            for (var i = 0; i < wf_ProcActity.length; i++) {
                if (wf_ProcActity[i].ID == id)//判断是否存在该对象，存在则代表存储过，
                    listOrderNum = i;
            }
            switch (type) {
                case 1: //串签环节--按汇报关系
                    if(version == 1)
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/simple/sequence_report",function(result){result.giveAct(listOrderNum);})
                        require("./control/simple/sequence_report").giveAct(listOrderNum);
                    else
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/sequence_report",function(result){result.giveAct(listOrderNum);})
                        require("./control/sequence_report").giveAct(listOrderNum);
                    break;
                case 2: //串签环节--按指定角色
                    if(version == 1)
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/simple/sequence_role",function(result){result.giveAct(listOrderNum);})
                        require("./control/simple/sequence_role").giveAct(listOrderNum);
                    else
                        //seajs.use(i8_session.resWfHost+'default/javascripts/design/activity/control/sequence_role',function(result){result.giveAct(listOrderNum);})
                        require('./control/sequence_role').giveAct(listOrderNum);
                    break;
                case 3: //并签环节
                    if(version == 1)
                        require("./control/simple/concurrent").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/simple/concurrent",function(result){result.giveAct(listOrderNum);})
                    else
                        require("./control/concurrent").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/concurrent",function(result){result.giveAct(listOrderNum);})
                    break;
                case 4: //收文环节
                    require("./control/receiver").giveAct(listOrderNum);
                    //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/receiver",function(result){result.giveAct(listOrderNum);})
                    break;
                case 5: //为连线节点
                    var wf_ArrayLine = common.wf_ArrayLineArray;
                    for (var i = 0; i < wf_ArrayLine.length; i++) {
                        if (wf_ArrayLine[i].ID == id)//判断是否存在该对象，存在则代表存储过，
                            listOrderNum = i;
                    }
                    require("./control/line").giveLine(listOrderNum);
                    //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/line",function(result){result.giveLine(listOrderNum);});
                    break;
                case 7: //知会环节
                    require("./control/notice").giveAct(listOrderNum);
                    //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/notice",function(result){result.giveAct(listOrderNum);})
                    break;
                case 8: //执行环节
                    if(version == 1)
                        require("./control/simple/execute").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/simple/execute",function(result){result.giveAct(listOrderNum);})
                    else
                        require("./control/execute").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/execute",function(result){result.giveAct(listOrderNum);})
                    break;
                case 9: //会签环节
                    require("./control/sign").giveAct(listOrderNum);
                    //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/sign",function(result){result.giveAct(listOrderNum);})
                    break;
                case 10: //表决环节
                    if(version == 1)
                        require("./control/simple/vote").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/simple/vote",function(result){result.giveAct(listOrderNum);})
                    else
                        require("./control/vote").giveAct(listOrderNum);
                        //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/vote",function(result){result.giveAct(listOrderNum);})
                    break;
                case 11: //或签环节
                    require("./control/orsign").giveAct(listOrderNum);
                    //seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/orsign",function(result){result.giveAct(listOrderNum);})
                    break;
            }
        //})
    }
    /*
     页面通用方法  End
     */
    //-----------------------------------------------------------------------------------------------
    /*
     MxGraph方法等  Start
     */
    //创建默认图形
    function wf_defaultModel() {
        if (parent.diagramMetaData != "" && parent.diagramMetaData != null) {
            require("./control/getdata").getDesignerData();
            /*seajs.use(i8_session.resWfHost+"default/javascripts/design/activity/control/getdata",function(data) {
                data.getDesignerData();
            });*/
            var js_wf_DesignXmlDom = mxUtils.parseXml(parent.diagramMetaData);
            //加载图形
            var decoder = new mxCodec(js_wf_DesignXmlDom);
            decoder.decode(js_wf_DesignXmlDom.documentElement, wf_graph.getModel());
        }

    }
    //加载图形及连接样式
    function wf_defaultStyle() {
        var wf_style = wf_graph.getStylesheet().getDefaultEdgeStyle();
        wf_style[mxConstants.STYLE_ROUNDED] = true;
        wf_style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        wf_graph.alternateEdgeStyle = 'elbow=vertical';
    }
    /*
 MxGraph方法等  End
 */
//--------------------------------------------------------------------------------------------
});