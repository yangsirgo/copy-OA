define("default/javascripts/plugins/i8formdesigner/template/control-subsetoption.tpl", [], '<div class="ctrlbox" ctype="{ctype}" rowtype="1" ctrl-name="{FieldID}">\n	<div class="ctrltitle">\n		<span class="span_mustinputtag" style="visibility:{isvisible}">*</span>\n		<span class="ctitletxt">{FieldName}</span>：\n	</div>\n	<div class="ctrltxt">\n		<select class="ctrl_mainoptions">\n			{each sourcelist}\n				<option value="{$value.id}" text="{$value.text}">{$value.text}</option>\n			{/each}\n		</select>　\n		<select class="ctrl_subsetoptions">\n			<option value="0" text="请选择">--请选择--</option>\n			\n		</select>\n	</div>\n	<pre>{str_config}</pre>\n</div>');