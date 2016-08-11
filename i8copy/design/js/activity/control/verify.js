/**
 * Created by Ling on 2014/11/13.
 */
define(function(require,exports) {
    var i8ui = require("default/javascripts/common/i8ui");
    var act_common = require("./common");
    //提交数据验证
    function wf_subVerify(node) {
        var nodes = $(node).find("mxCell[source]"); //获取XML的Cell节点。
        var StartNodes = $(node).find("StartActivity"); //开始节点
        var EndNodes = $(node).find("EndActivity"); //开始节点
        var VoteActivityNodes = $(node).find("VoteActivity"); //表决环节
        //判断表决环节是否是最后一个
        var isVoteLast = $(node).find("mxCell[source='" + VoteActivityNodes.attr("id") + "'][target='" + EndNodes.attr("id") + "']");
        if (isVoteLast.length > 0) {
            i8ui.alert({title:"表决环节不能做为最后环节!"});
            return false;
        }
        var startNum = 0;
        var endNum = 0;
        var repeatSource = ""; //用于记录线的起始目标
        var repeatTarget = ""; //用于记录线的终点目标
        var lineIDList = ""; //记录重复数据的ID信息
        var ArraySource = new Array(); //用于记录重复数据的数量
        for (var i = 0; i < nodes.length; i++) {
            //查找开始节点和结束节点是否都已连接
            lineIDList += "|" + $(nodes[i]).attr("id").toString();
            repeatSource += "|" + $(nodes[i]).attr("source").toString();
            repeatTarget += "|" + $(nodes[i]).attr("target").toString();
            if ($(nodes[i]).attr("source") == $(StartNodes[0]).attr("id"))//计算开始节点是否已连接
                startNum++;
            if ($(nodes[i]).attr("target") == $(EndNodes[0]).attr("id"))//计算结束节点是否已连接
                endNum++;
        }
        lineIDList = lineIDList.substring(1, lineIDList.length).split("|");
        repeatSource = repeatSource.substring(1, repeatSource.length).split("|");
        repeatTarget = repeatTarget.substring(1, repeatTarget.length).split("|");
        for (var i = 0; i < repeatSource.length; i++) {
            var repeatNum = 0;
            for (var j = 0; j < ArraySource.length; j++) {
                if (ArraySource[j].source == repeatSource[i]) {//用于记录重复的数据
                    ArraySource[j].num++;
                    ArraySource[j].id += "|" + lineIDList[i];
                    repeatNum++;
                }
            }
            if (repeatNum == 0) {//添加新数据
                var objSource = new Object();
                objSource.id = lineIDList[i];
                objSource.source = repeatSource[i];
                objSource.num = 1;
                ArraySource.push(objSource);
            }
        }
        if (startNum == 0) {
            i8ui.alert({title:"请确保开始节点已连接!"});
            return false;
        }
        if (endNum == 0) {
            i8ui.alert({title:"请确保结束节点已连接!"});
            return false;

        }
        var ErrorlineIDList = ""; //记录未配置的条件
        var DelLineIDList = ""; //配置成功需要去除警告样式的条件线
        //匹配查看分支条件是否都以配置
        if (ArraySource.length < repeatSource.length) {//小于代表有重复的数据，有需要配置的条件
            for (var i = 0; i < ArraySource.length; i++) {
                for (var j = 0; j < act_common.wf_ArrayLineArray.length; j++) {//连线数组集合
                    act_common.wf_ArrayLineArray[j].Priority = wf_LinePriority(act_common.wf_ArrayLineArray[j].ExpressionCode); //判断连线的表达式的复杂度，越复杂的优先级越低
                    if (act_common.wf_ArrayLineArray[j].StartActivity == ArraySource[i].source) {
                        ArraySource[i].num--;
                        ArraySource[i].id = ArraySource[i].id.replace("|" + act_common.wf_ArrayLineArray[j].ID, ""); //删除已配置的条件线
                    }
                }
                if (ArraySource[i].num > 1)
                    ErrorlineIDList += "|" + ArraySource[i].id; //记录未配置的条件ID
                else
                    DelLineIDList += "|" + ArraySource[i].id; //记录不需配置的条件ID，后续清除样式
            }
            if (ErrorlineIDList != "") {//代表有未配置的条件
                ErrorlineIDList = ErrorlineIDList.substring(1, ErrorlineIDList.length);
                i8ui.alert({title:"请确保分支节点条件都已配置!"});
                wf_LineSetStyle(ErrorlineIDList, 2, "请双击线配置条件！"); //条件警告样式
                return false;
            }
        }
        if (DelLineIDList != "") {
            DelLineIDList = DelLineIDList.substring(1, DelLineIDList.length);
            wf_LineDelStyle(DelLineIDList, 2); //清除条件警告样式
        }
        repeatSource = repeatSource + ",";
        repeatTarget = repeatTarget + ",";
        //获取各个环节是否都已配置信息
        var SequenceReportLength = $(node).find("Sequence_ReportActivity"); //串签（按汇报关系）环节有几个
        var SequenceRoleLength = $(node).find("Sequence_RoleActivity"); //串签（按指定角色）环节有几个
        var ConCurrentLength = $(node).find("ConCurrentActivity"); //并签环节有几个
        var ReceiverLength = $(node).find("ReceiverActivity"); //收文环节有几个
        var NotifiedLength = $(node).find("NotifiedActivity"); //知会环节有几个
        var ExecutionLength = $(node).find("ExecutionActivity"); //执行环节有几个
        var SignLength = $(node).find("SignActivity"); //会签环节有几个
        var VoteLength = $(node).find("VoteActivity"); //投票环节有几个
        var OrSignLength = $(node).find("OrSignActivity"); //或签环节有几个

        var wf_ArraySequenceReport = new Array(); //串签-按汇报关系存储数据数组
        var wf_ArraySequenceRole = new Array(); //串签-按指定角色存储数据数组
        var wf_ArrayConCurrent = new Array(); //并签存储数据数组
        var wf_ArrayReceiver = new Array(); //收文人存储数据数组
        var wf_ArrayNotified = new Array(); //知会环节存储数据数组
        var wf_ArrayExecution = new Array(); //执行环节存储数据数组
        var wf_ArraySign = new Array(); //会签环节存储数据数组
        var wf_ArrayVote = new Array(); //投票环节存储数据数组
        var wf_ArrayOrSign = new Array(); //或签环节存储数据数组

        var wf_ProcActity = act_common.wf_ProcActityArray;//环节数据
        for (var i = 0; i < wf_ProcActity.length; i++) {
            switch (wf_ProcActity[i].ActivityType) {
                case 1://串签-按汇报关系 or 串签-按指定角色
                    if (wf_ProcActity[i].Approver.indexOf('|') > -1)
                        wf_ArraySequenceReport.push(wf_ProcActity[i]);
                    else
                        wf_ArraySequenceRole.push(wf_ProcActity[i]);
                    break;
                case 2://并签
                    wf_ArrayConCurrent.push(wf_ProcActity[i]);
                    break;
                case 3://收文人
                    wf_ArrayReceiver.push(wf_ProcActity[i]);
                    break;
                case 4://执行环节
                    wf_ArrayExecution.push(wf_ProcActity[i]);
                    break;
                case 5://知会环节
                    wf_ArrayNotified.push(wf_ProcActity[i]);
                    break;
                case 6://会签环节
                    wf_ArraySign.push(wf_ProcActity[i]);
                    break;
                case 7://投票环节
                    wf_ArrayVote.push(wf_ProcActity[i]);
                    break;
                case 8://或签环节
                    wf_ArrayOrSign.push(wf_ProcActity[i]);
                    break;
            }
        }

        //判断存储的值与页面的元素是否匹配(兼容老版本BUG修复)，存储的值在页面找不到对应的环节值则删除掉，以页面环节值为基准
        //串签（按汇报关系）
        if (wf_ArraySequenceReport.length > SequenceReportLength.length)
            wf_ArraySequenceReport = act_common.verifyGraphData(wf_ArraySequenceReport, SequenceReportLength);
        //串签（按指定角色）
        if (wf_ArraySequenceRole.length > SequenceRoleLength.length)
            wf_ArraySequenceRole = act_common.verifyGraphData(wf_ArraySequenceRole, SequenceRoleLength);
        //并签环节
        if (wf_ArrayConCurrent.length > ConCurrentLength.length)
            wf_ArrayConCurrent = act_common.verifyGraphData(wf_ArrayConCurrent, ConCurrentLength);
        //收文环节
        if (wf_ArrayReceiver.length > ReceiverLength.length)
            wf_ArrayReceiver = act_common.verifyGraphData(wf_ArrayReceiver, ReceiverLength);
        //知会环节
        if (wf_ArrayNotified.length > NotifiedLength.length)
            wf_ArrayNotified = act_common.verifyGraphData(wf_ArrayNotified, NotifiedLength);
        //执行环节
        if (wf_ArrayExecution.length > ExecutionLength.length)
            wf_ArrayExecution = act_common.verifyGraphData(wf_ArrayExecution, ExecutionLength);
        //会签环节
        if (wf_ArraySign.length > SignLength.length)
            wf_ArraySign = act_common.verifyGraphData(wf_ArraySign, SignLength);
        //投票环节
        if (wf_ArrayVote.length > VoteLength.length)
            wf_ArrayVote = act_common.verifyGraphData(wf_ArrayVote, VoteLength);
        //或签环节
        if (wf_ArrayOrSign.length > OrSignLength.length)
            wf_ArrayOrSign = act_common.verifyGraphData(wf_ArrayOrSign, OrSignLength);

        //串签（按汇报关系）--验证
        if (wf_ArraySequenceReport.length != SequenceReportLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var SequenceReportIDList = ""; //记录未配置的环节
            for (var i = 0; i < SequenceReportLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArraySequenceReport.length; j++) {
                    if ($(SequenceReportLength[i]).attr("id") == wf_ArraySequenceReport[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    SequenceReportIDList += "|" + $(SequenceReportLength[i]).attr("id");
            }
            if (SequenceReportIDList != "") {
                SequenceReportIDList = SequenceReportIDList.substring(1, SequenceReportIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(SequenceReportIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (SequenceReportLength.length > 0) {//判断串签（按汇报关系）环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < SequenceReportLength.length; i++) {
                if (repeatSource.indexOf($(SequenceReportLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(SequenceReportLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(SequenceReportLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //串签（按指定角色）--验证
        if (wf_ArraySequenceRole.length != SequenceRoleLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var SequenceRoleIDList = ""; //记录未配置的环节
            for (var i = 0; i < SequenceRoleLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArraySequenceRole.length; j++) {
                    if ($(SequenceRoleLength[i]).attr("id") == wf_ArraySequenceRole[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    SequenceRoleIDList += "|" + $(SequenceRoleLength[i]).attr("id");
            }
            if (SequenceRoleIDList != "") {
                SequenceRoleIDList = SequenceRoleIDList.substring(1, SequenceRoleIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(SequenceRoleIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (SequenceRoleLength.length > 0) {//判断串签（按指定角色）环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < SequenceRoleLength.length; i++) {
                if (repeatSource.indexOf($(SequenceRoleLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(SequenceRoleLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(SequenceRoleLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //并签验证
        if (wf_ArrayConCurrent.length != ConCurrentLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var ConCurrentIDList = ""; //记录未配置的环节
            for (var i = 0; i < ConCurrentLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayConCurrent.length; j++) {
                    if ($(ConCurrentLength[i]).attr("id") == wf_ArrayConCurrent[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    ConCurrentIDList += "|" + $(ConCurrentLength[i]).attr("id");
            }
            if (ConCurrentIDList != "") {
                ConCurrentIDList = ConCurrentIDList.substring(1, ConCurrentIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(ConCurrentIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (ConCurrentLength.length > 0) {//判断并签环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < ConCurrentLength.length; i++) {
                if (repeatSource.indexOf($(ConCurrentLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(ConCurrentLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(ConCurrentLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //收文验证
        if (wf_ArrayReceiver.length != ReceiverLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var ReceiverIDList = ""; //记录未配置的环节
            for (var i = 0; i < ReceiverLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayReceiver.length; j++) {
                    if ($(ReceiverLength[i]).attr("id") == wf_ArrayReceiver[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    ReceiverIDList += "|" + $(ReceiverLength[i]).attr("id");
            }
            if (ReceiverIDList != "") {
                ReceiverIDList = ReceiverIDList.substring(1, ReceiverIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(ReceiverIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (ReceiverLength.length > 0) {//判断并签环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < ReceiverLength.length; i++) {
                if (repeatSource.indexOf($(ReceiverLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(ReceiverLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(ReceiverLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //知会验证
        if (wf_ArrayNotified.length != NotifiedLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var NotifiedIDList = ""; //记录未配置的环节
            for (var i = 0; i < NotifiedLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayNotified.length; j++) {
                    if ($(NotifiedLength[i]).attr("id") == wf_ArrayNotified[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    NotifiedIDList += "|" + $(NotifiedLength[i]).attr("id");
            }
            if (NotifiedIDList != "") {
                NotifiedIDList = NotifiedIDList.substring(1, NotifiedIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(NotifiedIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (NotifiedLength.length > 0) {//判断知会环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < NotifiedLength.length; i++) {
                if (repeatSource.indexOf($(NotifiedLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(NotifiedLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(NotifiedLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //执行验证
        if (wf_ArrayExecution.length != ExecutionLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var ExecutionIDList = ""; //记录未配置的环节
            for (var i = 0; i < ExecutionLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayExecution.length; j++) {
                    if ($(ExecutionLength[i]).attr("id") == wf_ArrayExecution[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    ExecutionIDList += "|" + $(ExecutionLength[i]).attr("id");
            }
            if (ExecutionIDList != "") {
                ExecutionIDList = ExecutionIDList.substring(1, ExecutionIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(ExecutionIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (ExecutionLength.length > 0) {//判断执行环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < ExecutionLength.length; i++) {
                if (repeatSource.indexOf($(ExecutionLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(ExecutionLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(ExecutionLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //会签环节验证
        if (wf_ArraySign.length != SignLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var SignIDList = ""; //记录未配置的环节
            for (var i = 0; i < SignLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArraySign.length; j++) {
                    if ($(SignLength[i]).attr("id") == wf_ArraySign[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    SignIDList += "|" + $(SignLength[i]).attr("id");
            }
            if (SignIDList != "") {
                SignIDList = SignIDList.substring(1, SignIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(SignIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (SignLength.length > 0) {//判断会签环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < SignLength.length; i++) {
                if (repeatSource.indexOf($(SignLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(SignLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(SignLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //投票环节验证
        if (wf_ArrayVote.length != VoteLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var VoteIDList = ""; //记录未配置的环节
            for (var i = 0; i < VoteLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayVote.length; j++) {
                    if ($(VoteLength[i]).attr("id") == wf_ArrayVote[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    VoteIDList += "|" + $(VoteLength[i]).attr("id");
            }
            if (VoteIDList != "") {
                VoteIDList = VoteIDList.substring(1, VoteIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(VoteIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (VoteLength.length > 0) {//判断会签环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < VoteLength.length; i++) {
                if (repeatSource.indexOf($(VoteLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(VoteLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(VoteLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        //或签环节验证
        if (wf_ArrayOrSign.length != OrSignLength.length) {//配置的信息与节点数量不同，则代表有遗漏没有配置的信息
            var OrSignIDList = ""; //记录未配置的环节
            for (var i = 0; i < OrSignLength.length; i++) {
                var ExistNum = 0;
                for (var j = 0; j < wf_ArrayOrSign.length; j++) {
                    if ($(OrSignLength[i]).attr("id") == wf_ArrayOrSign[j].ActID)
                        ExistNum++;
                }
                if (ExistNum == 0) //该配置尚未配置
                    OrSignIDList += "|" + $(OrSignLength[i]).attr("id");
            }
            if (OrSignIDList != "") {
                OrSignIDList = OrSignIDList.substring(1, OrSignIDList.length);
                i8ui.alert({title:"请确保环节参数都已配置!"});
                wf_LineSetStyle(OrSignIDList, 1, "请双击配置环节参数！"); //环节警告样式
                return false;
            }
        }
        if (OrSignLength.length > 0) {//判断会签环节是否都有连接和被连接状态
            var ConnectionIDList = ""; //记录没有连接和被连接状态的环节
            for (var i = 0; i < OrSignLength.length; i++) {
                if (repeatSource.indexOf($(OrSignLength[i]).attr("id") + ",") < 0 || repeatTarget.indexOf($(OrSignLength[i]).attr("id") + ",") < 0) //判断此环节是否都有连接和被连接状态
                    ConnectionIDList += "|" + $(OrSignLength[i]).attr("id");
            }
            if (ConnectionIDList != "") {
                ConnectionIDList = ConnectionIDList.substring(1, ConnectionIDList.length);
                i8ui.alert({title:"请确保环节都已连接和被连接!"});
                wf_LineSetStyle(ConnectionIDList, 1, "请拖动环节中的连接线进行连接！"); //环节警告样式
                return false;
            }
        }
        return true;
    }
    //判断环节连接的优先级
    function wf_LinePriority(expression) {
        var Priority = 2; //默认优先级。
        if(expression.indexOf("&&") > 0)
            Priority += expression.split("&&").length-1;
        if(expression.indexOf("||") > 0)
            Priority += expression.split("||").length-1;
        return Priority;
    }
    exports.wf_subVerify = wf_subVerify;//提交验证方法
});