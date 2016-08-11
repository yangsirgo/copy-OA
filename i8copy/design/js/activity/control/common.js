/**
 * Created by Ling on 2014/11/13.
 * 环节配置公共方法
 */
define(function(require,exports) {
    var i8ui = require("../../common/i8ui");
    var baseinfoID =parent.js_wf_BaseInfoID;
    var wf_ArrayLine = new Array(); //连线存储数据数组
    var wf_ProcActity = new Array();//环节存储数据数组

    var roleJson={};//保存绑定角色
    //添加属性
    Array.prototype.remove = function (dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }
    //根据类型名称获取子类别
    //selectedUserModel：只有汇报关系使用，汇报关系不支持多人的选人控件作为流程参数
    //isRefresh:是否强制刷新，不走缓存
    function wf_bindRole(typeCode, bindID, selectedUserModel,isRefresh) {
        selectedUserModel = selectedUserModel || 2;
        bindID.empty();
        //暂时屏蔽 角色增加多角色操作，所以缓存暂不用
//        if(selectedUserModel != 1 && roleJson.code == typeCode && isRefresh == undefined&&roleJson.value!= undefined){//存在
//            bindID.append("<option value='-1'>--请选择--</option>");
//            var jsonData = roleJson.value;
//            for (var i = 0; i < jsonData.length; i++) {
//                bindID.append("<option value=" + jsonData[i].Value + ">" + jsonData[i].Key + "</option>");
//            }
//        }
//        else {//不存在则获取
//            $.ajax({url: encodeURI(i8_session.ajaxWfHost+'webajax/design/activity/getlistroletype'), type: 'get', dataType: 'json',
//                data: 'typeCode=' + typeCode + '&baseinfoid=' + baseinfoID + '&Model=' + selectedUserModel, async: false, success: function (json) {
              if(typeCode==1){
                  var json = {"ReturnObject":[{"Key":"员工","Value":"0"},{"Key":"经理","Value":"2500"},{"Key":"副总","Value":"5000"},{"Key":"CEO","Value":"10000"}],"Result":true,"Code":0,"Description":null}
              }else if(typeCode==2){
                  var json = {"ReturnObject":[{"Key":"CEO/总经理/总裁(杨国超)","Value":"b36d97c9-60be-4ecb-8717-083c95dd0ba4"},{"Key":"财务专员(caiwu)","Value":"77c63c34-4c47-46cb-96c7-3129206bcc78"},{"Key":"采购专员(RONG)","Value":"d949eda3-a58c-4128-80c5-7491afa0b390"},{"Key":"法务专员(renshi)","Value":"dc51284c-a11c-4c52-be81-b9a5146352b2"},{"Key":"行政专员(RONG)","Value":"0514b9a0-6648-412e-99fc-57410687ede2"},{"Key":"人事专员(renshi)","Value":"d33d1748-f8df-4f7d-9656-6f5ae756ab81"}],"Result":true,"Code":0,"Description":null}
              }else if(typeCode==3){
                  var json = {"ReturnObject":[{"Key":"核算中心负责人","Value":"FeiYongShenQing_col_16_centerAdminId"},{"Key":"发起人","Value":"SysOriginatorID"}],"Result":true,"Code":0,"Description":null}
              };

                    if (json.Result) {
                        var jsonData = json.ReturnObject;
                        roleJson = {"code": typeCode, "value": jsonData};//存储值
                        bindID.append("<option value='-1'>--请选择--</option>");
                        for (var i = 0; i < jsonData.length; i++) {
                            bindID.append("<option value=" + jsonData[i].Value + ">" + jsonData[i].Key + "</option>");
                        }
                    }
                    else
                        i8ui.alert({title: "获取角色失败,请联系管理员!"});
                }
            //});
        //}
    //}
    //获取表单绑定字段
    //bingdID:要绑定的值ID，conditionType：绑定的类型0：简单条件1：复杂条件
    function wf_bindFormData(bindID) {
        $.ajax({
            url: i8_session.ajaxWfHost+'webajax/design/activity/getformdata',data: "baseinfoid=" + baseinfoID,type: 'get',dataType: 'json',async: false,
            success: function (json) {
                if (json.Result) {
                    var jsonData = json.ReturnObject;
                    bindID.empty();
                    bindID.append("<option>系统变量</option>");
                    for (var i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].VarType == 0)
                            bindID.append("<option value=" + jsonData[i].VarValue + " DataType=" + jsonData[i].ValueType + " code='["+jsonData[i].VarValue+"]'>└" + jsonData[i].VarName + "</option>");
                    }
                    bindID.append("<option>表单变量</option>");
                    for (var i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].VarType == 1)
                            bindID.append("<option value=" + jsonData[i].VarValue + " DataType=" + jsonData[i].ValueType + " CtType=" + jsonData[i].CtType + " DataFieldID=" + jsonData[i].DataFieldID + " sType="+jsonData[i].SType+" code='["+jsonData[i].VarValue+"]'>└" + jsonData[i].VarName + "</option>");
                    }
                }
                else
                    i8ui.alert({title:"获取角色失败,请联系管理员!"});
            }
        });
    }
    //封装环节数据
    function wf_addActity(ActID, ActName, ActType, Duration, Approver, RoleExpression, ApproverDesc,ToDoTime,SkipTime,IsErrorCompatible) {
        var listOrderNum = -1;
        for (var i = 0; i < wf_ProcActity.length; i++) {
            if (wf_ProcActity[i].ID == ActID)
                listOrderNum = i;
        }
        var config = {};
        if(IsErrorCompatible != undefined && IsErrorCompatible != "")
            config = {'EmptyLevelCancel':IsErrorCompatible};
        if (listOrderNum == -1) {//新增数据
            wf_isChange = true;
            var obj = new Object();
            obj.ID = ActID;
            obj.ActivityName = ActName;
            obj.ActivityType = ActType;
            obj.Duration = Duration;
            obj.Approver = Approver;
            obj.ApproverDesc = ApproverDesc;
            obj.RoleExpression = RoleExpression;
            obj.ToDoTime = ToDoTime;
 	        obj.SkipTime = SkipTime;
            obj.Config = config;
            wf_ProcActity.push(obj);
        }
        else {//修改数据
            wf_verifyActValue(listOrderNum,ActID,ActName,ActType,Duration,Approver,ApproverDesc,RoleExpression,ToDoTime,SkipTime,config);
            wf_ProcActity[listOrderNum].ID = ActID;
            wf_ProcActity[listOrderNum].ActivityName = ActName;
            wf_ProcActity[listOrderNum].ActivityType = ActType;
            wf_ProcActity[listOrderNum].Duration = Duration;
            wf_ProcActity[listOrderNum].Approver = Approver;
            wf_ProcActity[listOrderNum].ApproverDesc = ApproverDesc;
            wf_ProcActity[listOrderNum].RoleExpression = RoleExpression;
            wf_ProcActity[listOrderNum].ToDoTime = ToDoTime;
            wf_ProcActity[listOrderNum].SkipTime = SkipTime;
            wf_ProcActity[listOrderNum].Config = config;
        }
    }
    //验证环节的值是否有发生过变更，没边更则不提交后台
    function wf_verifyActValue(ActArrayIndex,ActID,ActName,ActType,Duration,Approver,ApproverDesc,RoleExpression,ToDoTime,SkipTime,config){
        var wf_procAct = wf_ProcActity[ActArrayIndex];
        //没有做修改
        if(!(wf_procAct.ID == ActID && wf_procAct.ActivityName == ActName && wf_procAct.ActivityType == ActType && wf_procAct.Duration == Duration && wf_procAct.Approver == Approver && wf_procAct.ApproverDesc == ApproverDesc && wf_procAct.RoleExpression == RoleExpression && wf_procAct.ToDoTime == ToDoTime && wf_procAct.SkipTime == SkipTime && wf_procAct.Config == config))
            wf_isChange = true;
    }
    //封装连线数据
    function wf_addLine(ID, LineName, Priority, StartActivity, FinishActivity, ConditionType, Expression,ExpressionCode,ExpressionRule) {
        //判断该条件的值是否已经存储过,存储过则修改
        var listOrderNum = -1;
        for (var i = 0; i < wf_ArrayLine.length; i++) {
            if (wf_ArrayLine[i].ID == ID)
                listOrderNum = i;
        }
        if (listOrderNum == -1) {//代表没有存储过该条件
            wf_isChange = true;
            var objLine = new Object();
            //容错处理，兼容老数据，老数据LineID不为GUID类型
            objLine.ID = ID;
            objLine.LineName = LineName;
            objLine.Priority = Priority;
            objLine.StartActivity = StartActivity; //开始环节ID
            objLine.FinishActivity = FinishActivity; //结束环节ID
            objLine.ConditionType = ConditionType;
            objLine.Expression = Expression;
            objLine.ExpressionCode = ExpressionCode;
            objLine.ExpressionRule = ExpressionRule;
            wf_ArrayLine.push(objLine);
        }
        else {//修改值
            wf_verifyLineValue(listOrderNum,LineName,StartActivity,FinishActivity,ConditionType,Expression,ExpressionCode);
            wf_ArrayLine[listOrderNum].LineName = LineName;
            wf_ArrayLine[listOrderNum].StartActivity = StartActivity; //开始环节ID
            wf_ArrayLine[listOrderNum].FinishActivity = FinishActivity; //结束环节ID
            wf_ArrayLine[listOrderNum].ConditionType = ConditionType;
            wf_ArrayLine[listOrderNum].Expression = Expression;
            wf_ArrayLine[listOrderNum].ExpressionCode = ExpressionCode;
            wf_ArrayLine[listOrderNum].ExpressionRule = ExpressionRule;
        }
    }
    //验证环节线的值是否有发生过变更，没边更则不提交后台
    function wf_verifyLineValue(LineArrayIndex,LineName,StartActivity,FinishActivity,ConditionType,Expression,ExpressionCode){
        var wf_procLine = wf_ArrayLine[LineArrayIndex];
        //没有做修改
        if(!(wf_procLine.LineName == LineName && wf_procLine.StartActivity == StartActivity && wf_procLine.FinishActivity == FinishActivity && wf_procLine.ConditionType == ConditionType && wf_procLine.Expression == Expression && wf_procLine.ExpressionCode == ExpressionCode))
            wf_isChange = true;
    }
    //日期格式验证
    function wf_strDateTime(str) {//短日期，形如 (2008-07-22)验证
        var _date = null;
        try {
            _date = new Date(str);
        } catch (e) {
            _date = null;
        }
        if (Object.prototype.toString.call(_date) == '[object Date]' && _date != 'Invalid Date') {
            return true;
        }
        return false;
    }
    //时间格式验证
    function wf_isTime(str) {//短时间，形如 (13:04:06)
        var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
        if (a == null) {
            return false;
        }
        if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
            return false;
        }
        return true;
    }
    //删除环节方法
    function wf_delLink() {
        var cells = wf_graph.getSelectionCells();
        if (cells.length > 0 && cells.length == 1) {
            var cell = cells[0];//获取第一个
            if (cell.value.nodeName == "StartActivity") {
                i8ui.alert({title:"开始节点不能删除!"});
                return;
            }
            if (cell.value.nodeName == "EndActivity") {
                i8ui.alert({title:"结束节点不能删除!"});
                return;
            }
            if (wf_graph.isEnabled()) {
                //删除环节对应信息
                for (var i = 0; i < wf_ProcActity.length; i++) {
                    if (cell.id == wf_ProcActity[i].ID) {
                        wf_ProcActity.remove(i);
                        wf_isChange = true;
                    }
                }
                //删除接线对应信息
                for (var i = 0; i < wf_ArrayLine.length; i++) {
                    if (cell.id == wf_ArrayLine[i].ID || cell.id == wf_ArrayLine[i].StartActivity || cell.id == wf_ArrayLine[i].FinishActivity) {
                        wf_ArrayLine.remove(i);
                        wf_isChange = true;
                    }
                }

                wf_graph.removeCells();
            }
        }
        if (cells.length > 1) {
            i8ui.alert({title:"环节请逐个删除!"});
            return;
        }
    }
    //验证配置的值与图片数据是否匹配，不匹配则删除多余的,以图形为基准
    function verifyGraphData(verifyAct, searchAct) {
        for (var i = 0; i < verifyAct.length; i++) {
            var isExist = false;
            for (var j = 0; j < searchAct.length; j++) {
                if (verifyAct[i].ID == $(searchAct[j]).attr("id"))
                    isExist = true;
            }
            if (isExist == false)//不存在则删除
            {
                for (var j = 0; j < wf_ProcActity.length; j++) {
                    if (wf_ProcActity[j].ID == verifyAct[i].ID)
                        wf_ProcActity.remove(j);
                }
                verifyAct.remove(i);
            }
        }
        return verifyGraphData;
    }
    exports.wf_bindRole = wf_bindRole;//根据类型名称获取子类别
    exports.wf_bindFormData = wf_bindFormData;//获取表单绑定字段
    exports.wf_addActity = wf_addActity;//封装环节数据
    exports.wf_addLine = wf_addLine;//封装环节链接数据
    exports.wf_strDateTime = wf_strDateTime;//日期格式验证
    exports.wf_isTime = wf_isTime;//时间格式验证
    exports.wf_delLink = wf_delLink;//删除环节方法
    exports.verifyGraphData = verifyGraphData;////验证配置的值与图片数据是否匹配，不匹配则删除多余的,以图形为基准

    exports.wf_ProcActityArray = wf_ProcActity;//环节数据集合
    exports.wf_ArrayLineArray = wf_ArrayLine;//环节数据集合
    exports.wf_roleJson = roleJson;
});