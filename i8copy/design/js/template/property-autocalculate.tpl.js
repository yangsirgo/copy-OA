define("./js/template/property-autocalculate.tpl", [], '\n<div class="boxrow">\n<div class="brtt">\n  运算符：\n</div>\n<div class="brbx">\n<div class="control-autocalculate-symbol" id="autocalculate_symbol_container">\n		<table>\n		<tr>\n		<td><div class="ui-draggable" symbol="+">＋</div></td>\n		<td><div class="ui-draggable" symbol="-">－</div></td>\n		<td><div class="ui-draggable" symbol="*">×</div></td>\n		<td><div class="ui-draggable" symbol="/">÷</div></td>\n		<td><div class="ui-draggable" symbol="(">(</div></td>\n		<td><div class="ui-draggable" symbol=")">)</div></td></tr>\n		</table>\n	</div>\n</div>\n</div>\n\n<div class="boxrow">\n<div class="brtt">\n 	计算字段：\n</div>\n<div class="brbx">\n		<div class="control-autocalculate-field" id="autocalculate_field_container">\n\n		</div>\n		</div>\n\n</div>\n<div class="boxrow control-autocalculate-desc">计算规则：\n<div class="helper ">\n                                              <i></i>\n                                              <div class="helpertext" style="margin-top: -18px;">设置单行文本数字、金额2类控件加减乘除的复合运算，操作方式为拖拽计算字段和运算符\n                                                  <em class="em1" style="top: 18px;">\n                                                      <em class="em2"></em>\n                                                  </em>\n                                              </div>\n                                          </div>\n          	</div>\n<div class="boxrow customItemsettingsdiv control-autocalculate-container" id="autocalculate_design_container">\n<ul id="autocalculate_design_list">\n\n</ul>\n</div>\n\n');