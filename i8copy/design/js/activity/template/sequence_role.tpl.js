define("./js/activity/template/sequence_role.tpl", [], '<!--串签环节配置--按指定角色模板-->\n        <table class="wf_show_table">\n            <tr>\n                <td>环节说明：<input id="txt_sequenceRoleTitle" type="text" style="width: 276px;" />\n                </td>\n            </tr>\n            <tr>\n                <td>指定角色：<input id="rdo_specialRole" type="radio" name="rdo_special" checked="true"\n                                value="2" />专项角色&nbsp;&nbsp;<input id="rdo_processRole" name="rdo_special" type="radio"\n                                                                   value="3" />流程角色\n                    <input id="rdo_RankRole" name="rdo_special" type="radio" value="1"/>职级角色\n                </td>\n            </tr>\n            <tr>\n                <td id="td_RoleDirections" style="padding-left: 70px;">请根据专项角色选择\n                </td>\n            </tr>\n            <tr>\n                <td style="padding-left: 70px;">\n                    <select id="ddl_Role">\n                    </select>\n                    <a id="a_roleAdd">\n                        <img src="{basePath}default/images/design/images/plus.png" height="12px" />增加角色</a>\n                </td>\n            </tr>\n            <tr style="line-height: 30px;">\n                                <td><input type="checkbox" id="cb_todotime"> 到期催办 设置每个审批人待办停留的催办时间<br>\n                                    <span style="margin-left:82px;">停留&nbsp;</span>\n                                    <input type="text" style="width:50px" maxlength="5" id="txt_todotime" value="0"> &nbsp;小时后 &nbsp;催办\n                                </td>\n                            </tr>\n            <tr style="line-height: 30px;">\n                <td><input type="checkbox" id="cb_skiptime"> 到期跳过 <span>停留&nbsp;</span>\n                    <input type="text" style="width:50px" maxlength="5" id="txt_skiptime" value="0"> &nbsp;小时后 &nbsp;跳过\n                </td>\n            </tr>\n            <tr style="line-height: 30px;">\n                <td>\n                    <input type="checkbox" id="cb_errorCompatible"> 审批不容错\n                    <div class="act_rel">\n                        <div class="helper">\n                            <i></i>\n                            <div class="helpertext" style="margin-top: -76px;">设置后，若按汇报关系无人在此环节审批时，将直接进入下一审批环节；反之，系统将自动找寻更高职级汇报上级审批。\n                                <em class="em1" style="top: 72px;">\n                                    <em class="em2"></em>\n                                </em>\n                            </div>\n                        </div>\n                    </div>\n                </td>\n            </tr>\n            <tr>\n                <td align="center">\n                    <span id="btn_SequenceRoleSubmit" class="designer_pubprocess_content_submit">确　定</span>\n                </td>\n            </tr>\n        </table>');