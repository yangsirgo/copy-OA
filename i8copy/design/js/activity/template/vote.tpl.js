define("./js/activity/template/vote.tpl", [], '<!--表决环节配置模板-->\n    <table class="wf_show_table">\n        <tr>\n            <td colspan="2">环节说明：<input id="txt_VoteTitle" type="text" style="width: 276px;" />\n            </td>\n        </tr>\n        <tr>\n            <td colspan="2">设置表决角色\n            </td>\n        </tr>\n        <tr>\n            <td colspan="2">\n                <!--动态添加角色-->\n                <table id="table_VoteRole">\n                    <tr>\n                        <td style="padding-left: 30px;">\n                            <span>角色&nbsp;&nbsp;1&nbsp;：</span>\n                            <select>\n                                <!--<option value="1">职级角色</option>-->\n                                <option value="2">专项角色</option>\n                                <option value="3">流程角色</option>\n                            </select>\n                            <select>\n                            </select>\n                            <img src="{basePath}default/images/design/graph/delete.png"/>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td style="padding-left: 30px;">\n                            <span>角色&nbsp;&nbsp;2&nbsp;：</span>\n                            <select>\n                                <option value="2">专项角色</option>\n                                <option value="3">流程角色</option>\n                            </select>\n                            <select>\n                            </select>\n                            <img src="{basePath}default/images/design/graph/delete.png"/>\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n        <tr>\n            <td align="right" colspan="2">\n                <a href="###" id="a_AddVoteRole">\n                    <img src="{basePath}default/images/design/images/plus.png" height="12px" />增加表决角色</a>\n            </td>\n        </tr>\n        <tr style="line-height: 25px; display: none;">\n            <td valign="top" align="left">&nbsp;&nbsp;&nbsp;&nbsp;表决策略：\n            </td>\n            <td>\n                <div>\n                    <input type="radio" name="rdo_Vote" checked="checked" />&nbsp;表决意见不影响流程进程\n                </div>\n                <div>\n                    <input type="radio" name="rdo_Vote" />&nbsp;表决通过率小于50%时流程退回\n                </div>\n            </td>\n        </tr>\n        <tr style="line-height: 30px;">\n                            <td><input type="checkbox" id="cb_todotime"> 到期催办 设置每个审批人待办停留的催办时间<br>\n                                <span style="margin-left:82px;">停留&nbsp;</span>\n                                <input type="text" style="width:50px" maxlength="5" id="txt_todotime" value="0"> &nbsp;小时后 &nbsp;催办\n                            </td>\n                        </tr>\n<tr style="line-height: 30px;">\n                                <td><input type="checkbox" id="cb_skiptime"> 到期跳过 <span>停留&nbsp;</span>\n                                    <input type="text" style="width:50px" maxlength="5" id="txt_skiptime" value="0"> &nbsp;小时后 &nbsp;跳过\n                                </td>\n                            </tr>\n        <tr>\n            <td align="center" style="padding-top: 10px;" colspan="2">\n                <span id="txt_VoteSubmit" class="designer_pubprocess_content_submit">确　定</span>\n            </td>\n        </tr>\n    </table>');