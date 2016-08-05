/**
 * Created by ryf on 2016/8/2.
 */
define(function (require, exports, module) {
    var _host=window.location.host;
    var _domain=_host.substr(_host.split('.')[0].length+1);
    var hostname=window.location.hostname.split('.').splice(-2).join('.');
    document.domain=_domain;
    //白名�?
    var _white_list = /^[【��（），；��：、��������？《�������?;￥����！~=@#%`,;_/\?\{\}\[\]\!\$\^\*\(\)\+\.\|\-\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
    var _workflowInputVerify = function (value) {
        var _retObj = {};
        var _flag = false;
        _white_list.lastIndex = 0;
        if (_white_list.test(value)) {
            _flag = true;
        }
        _retObj.result =  _flag;
        _retObj.tips = "输入名中包含非法字符�?";
        return _retObj;
    }
    var util = function () {
        /*创建cookie*/
        var _setCookie = function (sName, sValue, days) {
            _delCookie(sName);
            if (!days) {
                document.cookie = sName + "=" + encodeURIComponent(sValue) + ';path=/;';
                return;
            }
            var exp = new Date();
            exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = sName + "=" + encodeURIComponent(sValue) + ";path=/; expires=" + exp.toGMTString();
        }
        /*获取cookies*/
        var _getCookie = function (sName) {
            var aCookie = document.cookie.split("; ");
            for (var i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return decodeURIComponent(aCrumb[1]);
            }
        }
        /*删除cookies*/
        var _delCookie = function (sName) {
            var cookieDate = new Date(2000,11,10,19,30,30);
            document.cookie = sName+'= ; expires=' + cookieDate.toGMTString() + '; path=/';
        }
        /*将json object对象转换成string*/
        var _toJsonString = function (obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                if (t == "string") obj = '"' + obj + '"'; /* simple data type*/
                return String(obj);
            }
            else {
                var n, v, json = [], arr = (obj && obj.constructor == Array); /* recurse array or object*/
                for (n in obj) {
                    v = obj[n]; t = typeof (v);
                    if (t == "function") continue; /*except function*/
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = _toJsonString(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        };
        var _urlParamToJson = function (url, key, replace) {
            url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
            var json = {};
            url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
                if (!(key in json)) {
                    json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
                }
                else if (json[key] instanceof Array) {
                    json[key].push(value);
                }
                else {
                    json[key] = [json[key], value];
                }
            });
            return key ? json[key] : json;
        };
        var stringifyParam=function(param, key){//json转化为url
            var paramStr="";
            if(param instanceof String||param instanceof Number||param instanceof Boolean){
                paramStr+="&"+key+"="+encodeURIComponent(param);
            }else{
                $.each(param,function(i){
                    var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
                    paramStr+='&'+stringifyParam(this, k);
                });
            }
            return paramStr.substr(1);
        };
        /*
         *公用提示方法
         *btnobj:$对象,默认为空在屏幕中间显示，有传递对象则在按钮的上方显示,
         *str:提示消息内容,
         *type:1,提示类型�?1为错误提示，2为警告，3为��过或��成�?
         *stype:默认为空，false 自动关闭，true 则手动关�?
         *time:默认�?2000(两秒)
         *cbk:function() 回调函数
         */
        var i8alert = function (json) {
            var time = 2000;
            var _color = " #FF690E";
            var stypehtml = "";
            if (!json.type) {
                json.type = 1;
            }
            //提示内容类型
            if (json.type != 1) {
                _color = " #717276";
            }
            //显示方式
            if (json.stype) {
                stypehtml = '<span class="lg_fm_close"></span>';
            }
            if (json.time) {
                time = json.time;
            }
            var domobj = document.getElementById("js_lg_tp_div");
            if (domobj) {
                domobj = $(document.getElementById("js_lg_tp_div"));
                domobj.html('<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml);
            } else {
                var htmlstr = '<div id="js_lg_tp_div" style="position:absolute; z-index:9999999; left:50%; top:50%;' +
                    'font-size:14px;color:' + _color + '; border:1px solid #CFD0D0; padding:8px 30px 8px 15px; background:#fff;' +
                    'box-shadow:2px 2px 2px -1px #C5C6C7; line-height:25px; display:none;">' +
                    '<i class="lg_fm_' + json.type + '"></i>' + json.str + stypehtml + '</div>';
                $("body").append(htmlstr);
                domobj = $(document.getElementById("js_lg_tp_div"));
            }
            domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, color: _color, "position": "fixed" });
            if (json.btnobj) {
                var _left = json.btnobj.offset().left;
                var _top = json.btnobj.offset().top - domobj.outerHeight() - 10;
                if (_top < 0)
                    _top = 1;
                var _right = "auto";
                var wdwidht = $(window).width();
                var boxwidth = domobj.width();
                if (_left > (wdwidht - boxwidth)) {
                    _left = "auto";
                    _right = 0;
                }
                domobj.css({ margin: 0, left: _left, top: _top,right:_right, position: "absolute" });
            }
            domobj.show();
            if (json.stype) {
                $(".lg_fm_close").click(function () {
                    $(this).parent().hide();
                });
                return;
            }
            setTimeout(function () {
                domobj.hide();
                if (json.cbk) {
                    json.cbk();
                }
            }, time);
        };
        /*全屏loading效果
         *btnobj:$对象,默认为空在屏幕中间显示，有传递对象则在按钮的上方显示,
         *str:提示消息内容,
         */
        var i8loaing = function (json) {
            if (!json.str) {
                json.str = "请稍�?..."
            }
            var domobj = document.getElementById("js_lg_tp_div");
            if (domobj) {
                domobj = $(document.getElementById("js_lg_tp_div"));
                domobj.html('<i class="lg_loading' + json.type + '"></i>' + json.str );
            } else {
                var html = '<div id="js_lg_tp_div" style="position: absolute; z-index: 100; left:50%; top:50%; font-size: 12px; border: 1px solid rgb(207, 208, 208); padding: 8px 30px 8px 15px; background-color: rgb(255, 255, 255); box-shadow: rgb(197, 198, 199) 2px 2px 2px -1px; line-height: 25px; margin: 0px; background-position: initial initial; background-repeat: initial initial;"><i class="lg_loading"></i>' + json.str + '</div>';
                $("body").append(html);
                domobj = $(document.getElementById("js_lg_tp_div"));
            }
            if (document.getElementById("fw_zhezhaomaskmodel") == null) {
                var mask = "<div id ='fw_nomaskzhezhao' class='fw_mask0'></div>";
                $("body").append(mask);
            }
            $("#fw_nomaskzhezhao").show();
            domobj.css({ "margin-left": 0 - domobj.width() / 2, "margin-top": 0 - domobj.height() / 2, "position": "fixed" }).show();
            if (json.btnobj) {
                var _left = json.btnobj.offset().left;
                var _top = json.btnobj.offset().top - domobj.outerHeight() - 10;
                domobj.css({ margin: 0, left: _left, top: _top, position: "absolute" });
            }
        };

        /**
         * 截取字符�?
         * @param str
         * @param len
         */
        var fnStringCut = function(str,len) {

            var _str = str || '',
                _len = len || 0;

            if(_str.length<len)
            {
                return str;
            }

            return _str.substr(0,len-2)+'..';
        }
        var replaceSpecial=function(str,es){
            var es=es||'';
            var keyword=new RegExp("[\\ ,\\�?,\\`,\\~,\\!,\\@,\\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]","gi")
            return str.replace(keyword,function(word){
                return '\\'+word;
            })
        }

        //关闭loading方法
        var i8closeloading = function () {
            $("#js_lg_tp_div").hide();
            $("#fw_nomaskzhezhao").hide();
        }
        var oneDay = 3600 * 24 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000, week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

        //分钟处理函数  ，当分钟小于10时，自动在分钟前�?0
        var fMinuteHandle = function (minute) {
            if (minute < 10) {
                return '0' + minute;
            }
            return minute;
        };
        var fDayHandle = function (day) {
            if (day < 10) {
                return '0' + day;
            }
            return day;
        };
        //日期处理函数
        var fDateHandle = function (date, currentDate) {
            var curDate = null;
            if (currentDate) {
                if (typeof currentDate === 'string') {
                    try {
                        curDate = currentDate.toDate(); //尝试转化�? datetime对象
                    }
                    catch (e) {
                        curDate = new Date();
                    }
                }
                else {
                    curDate = curDate || new Date();    //否则认为是传入的时间对象，此处可以��虑重构，判断curDate�? datetime对象
                }
            }
            curDate = curDate || new Date();
            var msgDate = null;
            try {
                msgDate = date.toDate();
            } catch (e) {
                alert(e);
                return;
            }
            var timeTick = curDate - msgDate;
            if (timeTick <= 0) {
                return '刚刚';
            }
            if ((timeTick / oneDay) >= 1 || (Math.abs((curDate.getDate() - msgDate.getDate())) >= 1)) {
                return msgDate.getFullYear() + '�?' + (msgDate.getMonth() + 1) + '�?' + msgDate.getDate() + '�?' + " " + (msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes()));
            }
            if ((timeTick / oneHour) > 1) {
                return '今天 ' + msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes());
            }
            if ((timeTick / oneMinute) > 1) {
                return Math.ceil(timeTick / oneMinute) + '分钟�?';
            }
            return '刚刚';
        };
        var _dateDiff = function (interval, date1, date2) {
            var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
            interval = interval.toUpperCase();
            if (typeof (data1) == "Object") {
                date1 = date1.toDate();
                date2 = date2.toDate();
            }
            try {
                return Math.round((date2 - date1) / eval('(objInterval.' + interval + ')'));
            }
            catch (e) {
                return e.message;
            }
        };
        var fw_request = function (paras) {
            var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {}
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof (returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        }
        function _loadsinglejs(url, callback) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement('script');
            script.onload = script.onreadystatechange = script.onerror = function () {
                if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
                script.onload = script.onreadystatechange = script.onerror = null;
                script.src = '';
                script.parentNode.removeChild(script);
                script = null;
                if (callback)
                    callback();
            }
            script.charset = "utf-8";
            script.src = url;
            try {
                head.appendChild(script);
            } catch (exp) { }
        }
        /*动��加载JS*/
        function _loadjs(url, callback) {
            if (Object.prototype.toString.call(url) === '[object Array]') {	//是否数组
                this.suc = 0;			//加载计数
                this.len = url.length;	//数组长度
                var a = this;
                for (var i = 0; i < url.length; i++) {
                    _loadsinglejs(url[i], function () { a.suc++; if (a.suc == a.len) try { callback(); } catch (e) { } });
                }
            } else if (typeof (url) == 'string') {
                _loadsinglejs(url, callback);
            }
        }
        /*文件大小转换_byte字节*/
        function _sizeFormat(_byte) {
            var i = 0;
            while (Math.abs(_byte) >= 1024) {
                _byte = _byte / 1024;
                i++;
                if (i == 4) break;
            }
            $units = new Array("Bytes", "KB", "MB", "GB", "TB");
            $newsize = Math.round(_byte, 2);
            return $newsize + $units[i];
        }
        function _dateConverter (_date) {
            var date = _date.replace(/\-/g, "/");
            var nDate = new Date(date);
            var time = (nDate.getHours().toString().length == 1 ? ("0" + nDate.getHours().toString()) : nDate.getHours().toString()) +":"+ (nDate.getMinutes().toString().length == 1 ? ("0" + nDate.getMinutes().toString()) : nDate.getMinutes().toString());
            var cn_str = (nDate.getYear().toString()).substr(1, 3) + "�?" + (nDate.getMonth() + 1) + "�?" + nDate.getDate() + "�? " + time;
            return cn_str;
        }
        var _subString = function (str, n) {
            var r = /[^\x00-\xff]/g;
            if (str.replace(r, "mm").length <= n) { return str; }
            var m = Math.floor(n / 2);
            for (var i = m; i < str.length; i++) {
                if (str.substr(0, i).replace(r, "mm").length >= n) {
                    return str.substr(0, i) + "...";
                }
            }
            return str;
        }
        var TxtBoxWarn = function (txtobj) {
            var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
            var colorAnimate = function (cls) {
                var clrTimer = null;
                if (cls.length > 0) {
                    clrTimer = setTimeout(function () {
                        txtobj.css({ "background-color": cls.shift() });
                        colorAnimate(cls);
                    }, 100);
                } else {
                    clearTimeout(clrTimer);
                }
            }
            colorAnimate(colors);
        };
        var _strFormat = function () {
            var s = arguments[0];
            var args = arguments;
            if (s) {
                return s.replace(/\{(\d+)\}/ig, function (a, b) {
                    var ret = args[(b | 0) + 1];
                    return ret == null ? '' : ret;
                })
            }
            else {
                return "";
            }
        };
        var _strLength=function(str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        }


        /*import  重写window.alert*/
        window._alert = window.alert;
        window.alert = function (data) {
            i8alert({str:data});
        }
        //转换时间格式（用于ajax获取数据后执行格式转换）
        var dateformat=function dateformat(value, format) {
            var date=new Date(value);
            if(date=='Invalid Date'||isNaN(date)){
                date= new Date(value.replace(/-/g,'/'));
            }
            return date.format(format);
        }
        Date.prototype.format = function (format,type) {
            /*
             * eg:format="yyyy-MM-dd hh:mm:ss";
             */
            var cn=['�?','丢�','�?','�?','�?','�?','�?'];
            var o = {
                "M+": this.getMonth() + 1, // month
                "d+": this.getDate(), // day
                "h+": this.getHours(), // hour
                "m+": this.getMinutes(), // minute
                "s+": this.getSeconds(), // second
                "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                "S": this.getMilliseconds(),
                "D":type=='cn' ? cn[this.getDay()] : this.getDay()
                // millisecond
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                    - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        var _HtmlUtil = {
            /*1.用正则表达式实现html转码*/
            htmlEncodeByRegExp:function (str){
                var s = "";
                if(str.length == 0) return "";
                s = str.replace(/&/g,"&amp;");
                s = s.replace(/</g,"&lt;");
                s = s.replace(/>/g,"&gt;");
                s = s.replace(/ /g,"&nbsp;");
                s = s.replace(/\'/g,"&#39;");
                s = s.replace(/\"/g,"&quot;");
                return s;
            },
            /*2.用正则表达式实现html解码*/
            htmlDecodeByRegExp:function (str){
                var s = "";
                if(str.length == 0) return "";
                s = str.replace(/&amp;/g,"&");
                s = s.replace(/&lt;/g,"<");
                s = s.replace(/&gt;/g,">");
                s = s.replace(/&nbsp;/g," ");
                s = s.replace(/&#39;/g,"\'");
                s = s.replace(/&quot;/g,"\"");
                return s;
            }
        };

        var _fLoadCss = function (url) {
            var head = document.getElementsByTagName('head')[0] || document.documentElement,
                css = document.createElement('link');
            css.rel = 'stylesheet';
            css.type = 'text/css';
            css.href = url;
            head.insertBefore(css, head.firstChild);
        }
        var faceLib = [["微笑", "weixiao.gif"], ["大笑", "ciya.gif"], ["花痴", "se.gif"], ["傲慢", "aoman.gif"], ["拜拜", "zaijian.gif"], ["悲剧", "ai.gif"], ["鄙视", "bishi.gif"], ["发呆", "fadai.gif"], ["闭嘴", "bizui.gif"], ["大哭", "daku.gif"], ["大骂", "zhouma.gif"], ["点头�?", "hanxiao.gif"], ["�?", "liuhan.gif"], ["惊恐", "jingkong.gif"], ["敲打", "qiaoda.gif"], ["抓狂", "zhuakuang.gif"], ["奋斗", "fengdou.gif"], ["鼓掌", "guzhang.gif"], ["打哈�?", "haqian.gif"], ["擦汗", "cahan.gif"], ["尴尬", "ganga.gif"], ["�?", "fanu.gif"], ["�?", "kun.gif"], ["白眼", "baiyan.gif"], ["吃惊", "jingyan.gif"], ["�?", "nanguo.gif"], ["可��?", "kelian.gif"], ["�?", "liulei.gif"], ["害羞", "haixiu.gif"], ["坏笑", "huaixiao.gif"], ["左哼�?", "zuohenhen.gif"], ["右哼�?", "youhenhen.gif"], ["亲亲", "qinqin.gif"], ["�?", "xia.gif"], ["大兵", "dabin.gif"], ["�?", "ku.gif"], ["得意", "deyi.gif"], ["睡觉", "shui.gif"], ["疑问", "yiwen.gif"], ["偷笑", "touxiao.gif"], ["�?", "tu.gif"], ["调皮", "tiaopi.gif"], ["挖鼻�?", "koubi.gif"], ["无奈", "piezui.gif"], ["快哭�?", "kuaikule.gif"], ["冷汗", "lenghan.gif"], ["可爱", "keai.gif"], ["糗大�?", "qiudale.gif"], ["�?", "xun.gif"], ["�?", "yun.gif"], ["阴险", "yinxian.gif"], ["委屈", "weiqu.gif"], ["美味", "jie.gif"], ["骷髅", "kulou.gif"], ["猪头", "zhutou.gif"], ["抱拳", "baoquan.gif"], ["胜利", "shengli.gif"], ["爱你", "aini.gif"], ["顶你", "qiang.gif"], ["�?", "ruo.gif"], ["�?", "no.gif"], ["勾引", "gouying.gif"], ["握手", "woshou.gif"], ["拳头", "quantou.gif"], ["差劲", "chajing.gif"], ["好的", "ok.gif"], ["太阳", "taiyang.gif"], ["月亮", "yueliang.gif"]];
        var faceBpath = i8_session.resHost+"workflow/images/face/";
        //内容@人转�?
        var atUserFormate=function(str){
            if(!str){
                return "";
            }
            if(str.length>0) {
                str = str.replace(/\$%\$([\w\-\,\u4E00-\ufa2d\.]+)\$%\$/g, function (str, info) {
                    var infosry = info.split(',');
                    var enType = infosry[2];//enType�?0,人员�?1，群组；2，组织；
                    var newStr = '<a class="k-a" href="users/' + infosry[1] + '">@' + infosry[0] + '</a>';
                    switch (enType) {
                        case "1":
                            newStr = '<a class="k-g" href="group/home?id=' + infosry[1] + '">@' + infosry[0] + '</a>';
                            break;
                        case "2":
                            newStr = '<a>@' + infosry[0] + '</a>';
                    }
                    return newStr;
                });
                str=str.replace(/\[[\u4E00-\ufa2d]+\]/ig, function (m) {
                    for (var i = 0; i < faceLib.length; i++) {
                        var _faceName = m.replace(/[\[\]]/ig, "");
                        if (faceLib[i][0] == _faceName) {
                            return "<img src=\"" + faceBpath + faceLib[i][1] + "\" alt=\"" + _faceName + "\" />";
                        }
                    }
                    return m;
                });
                str=str.replace(/%\$%(\S+),(\w{6,7})%\$%/ig,function(str,or,nw){
                    if(or&&nw){
                        return "<a href=\"/url/"+nw +"\" target=\"_blank\" title=\""+or+"\">http://i8xs.cn/"+nw+"</a>";
                    }else{
                        return str;
                    }
                });
                //[url="/report/detail/decffb25-5abc-4925-8fdc-47cc0633f4cc";txt="2015�?3�?9�?-2015�?3�?15�?"]
                str=str.replace(/\[url="([\S^"]+)";txt="([^"]+)";target="([_\w]+)"\]/ig,function(str,href,txt,target){
                    if(href&&txt){
                        return "<a href=\""+href+"\"  target=\""+target+"\">"+txt+"</a>";
                    }else{
                        return str;
                    }
                });
                str=str.replace(/#(.+?)#/g,function(str,or){
                    return '<a href="search?keyword='+encodeURIComponent(or.replace(/<[^>]+\/?>/g,""))+'#dynamic" target="_blank">#'+or.replace(/<[^>]+\/?>/g,"")+'#</a>';
                });
                str=str.replace(/[\r|\n]/g,"<br/>");
            }
            return str;
        };
        var _getLastUrlName=function(){
            var fulUrl=window.location.href;
            var target=fulUrl.substr(fulUrl.lastIndexOf('/')+1,fulUrl.length).split('?')[0];
            return target;
        }
        var filterJsonString = function(str){
            var strArr = str.split('');
            var resultArr = [];
            var code = '';
            while(strArr.length>0){
                code = strArr[0].charCodeAt(0);
                if(!((code<=31 && code !=10) || code==127 )){
                    resultArr.push(strArr[0]);
                }


                strArr.shift();
            }
            return resultArr.join('');
        }
        return {
            getLastUrlName:_getLastUrlName,
            htmlUtil:_HtmlUtil,
            atkkContent:atUserFormate,
            strLength:_strLength,
            bgFlicker:TxtBoxWarn,
            setCookies: _setCookie,
            getCookies: _getCookie,
            delCookies: _delCookie,
            toJsonString: _toJsonString,
            urlParamToJson: _urlParamToJson,
            i8alert: i8alert,
            formateDate: fDateHandle,
            dateformat:dateformat,
            getUrlParam: fw_request,
            i8loading: i8loaing,
            i8closeloading: i8closeloading,
            i8loadjs: _loadjs,
            dateDiff: _dateDiff,
            sizeFormat: _sizeFormat,
            dateConverter: _dateConverter,
            subString: _subString,
            strFormat: _strFormat,
            workflowInputVerify: _workflowInputVerify,
            workflowWhiteList :_white_list,
            stringCut:fnStringCut,
            loadCss:_fLoadCss,
            replaceSpecial:replaceSpecial,
            stringifyParam:stringifyParam,
            filterJsonString:filterJsonString
        };
    } ();
    module.exports = util;
})