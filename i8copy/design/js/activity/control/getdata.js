/**
 * Created by Ling on 2014/11/14.
 */
define(function(require,exports) {
    var act_common = require('./common');
    function getDesignerData() {
        var baseinfoid = parent.copyBaseInfoID == '' ? parent.js_wf_BaseInfoID:parent.copyBaseInfoID;//parent.js_wf_BaseInfoID;
        var isCopy = parent.copyBaseInfoID == '' ? false:true;
        if(isCopy)//复制流程功能
            wf_isChange = true;
        //获取XML数据
        $.ajax({url:i8_session.ajaxWfHost+ 'webajax/design/activity/getprocdiagram', type: 'get', data: 'baseinfoid=' + baseinfoid + '&isCopy=' + isCopy, dataType: 'json', async: false, success: function (json) {
            if (json.Result) {
                var resultData = json.ReturnObject;
                var ActivityList = resultData.Activitys; //获取Activity集合
                var Activity_MultiRoleList = resultData.Activitys_MultiRole; //获取Activitys_MultiRole循环审批集合
                var Activitys_RelationList = resultData.Activitys_Relation; //获取Activitys_Relation循环审批集合
                var LineList = resultData.Lines; //获取Line集合
                var ProcBaseInfo = resultData.ProcBaseInfo; //获取ProcBaseInfo,流程基本信息
                //填充数据.根据类型存在到不同的数组里面
                if (ActivityList.length > 0) {
                    for (var i = 0; i < ActivityList.length; i++) {
                        var obj = new Object();
                        obj.ID = ActivityList[i].ID;
                        obj.ActivityName = ActivityList[i].ActivityName;
                        obj.ActivityType = ActivityList[i].ActivityType;
                        obj.Duration = ActivityList[i].Duration;
                        obj.ToDoTime = ActivityList[i].ToDoTime;
                        obj.SkipTime = ActivityList[i].SkipTime;
                        obj.Config = ActivityList[i].Config;
                        switch (ActivityList[i].ActivityType) {
                            case 1://循环审批
                                if (Activitys_RelationList != null) {//循环审批角色
                                    var isExit = false;
                                    for (var j = 0; j < Activitys_RelationList.length; j++) {
                                        if (Activitys_RelationList[j].ActivityID == ActivityList[i].ID) {
                                            isExit = true;
                                            obj.RoleExpression = Activitys_RelationList[j].RoleType;
                                            obj.Approver = Activitys_RelationList[j].RoleValue + "|";
                                            obj.Approver += Activitys_RelationList[j].StartWith + "|";
                                            obj.Approver += Activitys_RelationList[j].EndWith;
                                        }
                                    }
                                }
                                if (!isExit) {
                                    obj.RoleExpression = ActivityList[i].RoleExpression; //审批类型
                                    obj.Approver = ActivityList[i].Approver;
                                }
                                break;
                            case 2://多角色审批
                                var roleTypeList = "";
                                var roleTypeValueList = "";
                                if (Activity_MultiRoleList != null) {
                                    for (var j = 0; j < Activity_MultiRoleList.length; j++) {
                                        if (Activity_MultiRoleList[j].ActivityID == ActivityList[i].ID) {
                                            roleTypeList += Activity_MultiRoleList[j].RoleType + "|";
                                            roleTypeValueList += Activity_MultiRoleList[j].RoleValue + "|";
                                        }
                                    }
                                }
                                if (roleTypeList != "" && roleTypeValueList != "") {
                                    roleTypeList = roleTypeList.substring(0, roleTypeList.length - 1);
                                    roleTypeValueList = roleTypeValueList.substring(0, roleTypeValueList.length - 1);
                                }
                                else {
                                    roleTypeList = ActivityList[i].RoleExpression; //审批类型
                                    roleTypeValueList = ActivityList[i].Approver;
                                }
                                obj.RoleExpression = roleTypeList; //审批类型
                                obj.Approver = roleTypeValueList;
                                break;
                            default:
                                obj.RoleExpression = ActivityList[i].RoleExpression; //审批类型
                                obj.Approver = ActivityList[i].Approver;
                                break;

                        }
                        obj.ApproverDesc = ActivityList[i].ApproverDesc;
                        act_common.wf_ProcActityArray.push(obj);
                    }
                }
                //填充数据.连接
                if (LineList.length > 0) {
                    for (var i = 0; i < LineList.length; i++) {
                        var objLine = new Object();
                        objLine.ID = LineList[i].ID;
                        objLine.LineName = LineList[i].LineName == ''?"　":LineList[i].LineName;
                        objLine.Priority = LineList[i].Priority;
                        objLine.StartActivity = LineList[i].StartActivity; //开始环节ID
                        objLine.FinishActivity = LineList[i].FinishActivity; //结束环节ID
                        objLine.ConditionType = LineList[i].ConditionType;
                        objLine.Expression = LineList[i].Expression;
                        objLine.ExpressionCode = LineList[i].ExpressionCode;
                        objLine.ExpressionRule = LineList[i].ExpressionRule;
                        act_common.wf_ArrayLineArray.push(objLine);

                    }
                }
                parent.copyBaseInfoID = '';
            }
        }
        });
    }
    exports.getDesignerData = getDesignerData;//获取数据
});