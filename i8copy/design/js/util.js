/**
 * Created by ryf on 2016/8/4.
 */
define(function (require, exports, module) {
    //var _host=window.location.host;
    //var _domain=_host.substr(_host.split('.')[0].length+1);
    //var hostname=window.location.hostname.split('.').splice(-2).join('.');
    //document.domain=_domain;
    //������
    var _white_list = /^[��������������������������������������;��������~=@#%`,;_/\?\{\}\[\]\!\$\^\*\(\)\+\.\|\-\u4e00-\u9fa5a-zA-Z0-9\s]+$/ig;
    var _workflowInputVerify = function (value) {
        var _retObj = {};
        var _flag = false;
        _white_list.lastIndex = 0;
        if (_white_list.test(value)) {
            _flag = true;
        }
        _retObj.result =  _flag;
        _retObj.tips = "�������а����Ƿ��ַ���";
        return _retObj;
    }
    var util = function () {
        /*����cookie*/
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
        /*��ȡcookies*/
        var _getCookie = function (sName) {
            var aCookie = document.cookie.split("; ");
            for (var i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return decodeURIComponent(aCrumb[1]);
            }
        }
        /*ɾ��cookies*/
        var _delCookie = function (sName) {
            var cookieDate = new Date(2000,11,10,19,30,30);
            document.cookie = sName+'= ; expires=' + cookieDate.toGMTString() + '; path=/';
        }
        /*��json object����ת����string*/
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
            url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //ȥ����ַ��hash��Ϣ
            var json = {};
            url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
                if (!(key in json)) {
                    json[key] = /\[\]$/.test(key) ? [value] : value; //�����������[]��β����������
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
        var stringifyParam=function(param, key){//jsonת��Ϊurl
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
         *������ʾ����
         *btnobj:$����,Ĭ��Ϊ������Ļ�м���ʾ���д��ݶ������ڰ�ť���Ϸ���ʾ,
         *str:��ʾ��Ϣ����,
         *type:1,��ʾ���ͣ�1Ϊ������ʾ��2Ϊ���棬3Ϊͨ�����߳ɹ�
         *stype:Ĭ��Ϊ�գ�false �Զ��رգ�true ���ֶ��ر�
         *time:Ĭ��Ϊ2000(����)
         *cbk:function() �ص�����
         */
        var i8alert = function (json) {
            var time = 2000;
            var _color = " #FF690E";
            var stypehtml = "";
            if (!json.type) {
                json.type = 1;
            }
            //��ʾ��������
            if (json.type != 1) {
                _color = " #717276";
            }
            //��ʾ��ʽ
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
        /*ȫ��loadingЧ��
         *btnobj:$����,Ĭ��Ϊ������Ļ�м���ʾ���д��ݶ������ڰ�ť���Ϸ���ʾ,
         *str:��ʾ��Ϣ����,
         */
        var i8loaing = function (json) {
            if (!json.str) {
                json.str = "���Ե�..."
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
         * ��ȡ�ַ���
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
            var keyword=new RegExp("[\\ ,\\��,\\`,\\~,\\!,\\@,\\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]","gi")
            return str.replace(keyword,function(word){
                return '\\'+word;
            })
        }

        //�ر�loading����
        var i8closeloading = function () {
            $("#js_lg_tp_div").hide();
            $("#fw_nomaskzhezhao").hide();
        }
        var oneDay = 3600 * 24 * 1000, oneHour = 3600 * 1000, oneMinute = 60 * 1000, week = ['��һ', '�ܶ�', '����', '����', '����', '����', '����'];

        //���Ӵ�����  ��������С��10ʱ���Զ��ڷ���ǰ��0
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
        //���ڴ�����
        var fDateHandle = function (date, currentDate) {
            var curDate = null;
            if (currentDate) {
                if (typeof currentDate === 'string') {
                    try {
                        curDate = currentDate.toDate(); //����ת��Ϊ datetime����
                    }
                    catch (e) {
                        curDate = new Date();
                    }
                }
                else {
                    curDate = curDate || new Date();    //������Ϊ�Ǵ����ʱ����󣬴˴����Կ����ع����ж�curDateΪ datetime����
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
                return '�ո�';
            }
            if ((timeTick / oneDay) >= 1 || (Math.abs((curDate.getDate() - msgDate.getDate())) >= 1)) {
                return msgDate.getFullYear() + '��' + (msgDate.getMonth() + 1) + '��' + msgDate.getDate() + '��' + " " + (msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes()));
            }
            if ((timeTick / oneHour) > 1) {
                return '���� ' + msgDate.getHours() + ':' + fMinuteHandle(msgDate.getMinutes());
            }
            if ((timeTick / oneMinute) > 1) {
                return Math.ceil(timeTick / oneMinute) + '����ǰ';
            }
            return '�ո�';
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
        /*��̬����JS*/
        function _loadjs(url, callback) {
            if (Object.prototype.toString.call(url) === '[object Array]') {	//�Ƿ�����
                this.suc = 0;			//���ؼ���
                this.len = url.length;	//���鳤��
                var a = this;
                for (var i = 0; i < url.length; i++) {
                    _loadsinglejs(url[i], function () { a.suc++; if (a.suc == a.len) try { callback(); } catch (e) { } });
                }
            } else if (typeof (url) == 'string') {
                _loadsinglejs(url, callback);
            }
        }
        /*�ļ���Сת��_byte�ֽ�*/
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
            var cn_str = (nDate.getYear().toString()).substr(1, 3) + "��" + (nDate.getMonth() + 1) + "��" + nDate.getDate() + "�� " + time;
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
                //���ֽڼ�1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    len++;
                }
                else {
                    len += 2;
                }
            }
            return len;
        }


        /*import  ��дwindow.alert*/
        window._alert = window.alert;
        window.alert = function (data) {
            i8alert({str:data});
        }
        //ת��ʱ���ʽ������ajax��ȡ���ݺ�ִ�и�ʽת����
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
            var cn=['��','һ','��','��','��','��','��'];
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
            /*1.��������ʽʵ��htmlת��*/
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
            /*2.��������ʽʵ��html����*/
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
        var faceLib = [["΢Ц", "weixiao.gif"], ["��Ц", "ciya.gif"], ["����", "se.gif"], ["����", "aoman.gif"], ["�ݰ�", "zaijian.gif"], ["����", "ai.gif"], ["����", "bishi.gif"], ["����", "fadai.gif"], ["����", "bizui.gif"], ["���", "daku.gif"], ["����", "zhouma.gif"], ["��ͷЦ", "hanxiao.gif"], ["��", "liuhan.gif"], ["����", "jingkong.gif"], ["�ô�", "qiaoda.gif"], ["ץ��", "zhuakuang.gif"], ["�ܶ�", "fengdou.gif"], ["����", "guzhang.gif"], ["���Ƿ", "haqian.gif"], ["����", "cahan.gif"], ["����", "ganga.gif"], ["ŭ", "fanu.gif"], ["��", "kun.gif"], ["����", "baiyan.gif"], ["�Ծ�", "jingyan.gif"], ["��", "nanguo.gif"], ["����", "kelian.gif"], ["��", "liulei.gif"], ["����", "haixiu.gif"], ["��Ц", "huaixiao.gif"], ["��ߺ�", "zuohenhen.gif"], ["�Һߺ�", "youhenhen.gif"], ["����", "qinqin.gif"], ["��", "xia.gif"], ["���", "dabin.gif"], ["��", "ku.gif"], ["����", "deyi.gif"], ["˯��", "shui.gif"], ["����", "yiwen.gif"], ["͵Ц", "touxiao.gif"], ["��", "tu.gif"], ["��Ƥ", "tiaopi.gif"], ["�ڱ�ʺ", "koubi.gif"], ["����", "piezui.gif"], ["�����", "kuaikule.gif"], ["�亹", "lenghan.gif"], ["�ɰ�", "keai.gif"], ["�ܴ���", "qiudale.gif"], ["��", "xun.gif"], ["��", "yun.gif"], ["����", "yinxian.gif"], ["ί��", "weiqu.gif"], ["��ζ", "jie.gif"], ["����", "kulou.gif"], ["��ͷ", "zhutou.gif"], ["��ȭ", "baoquan.gif"], ["ʤ��", "shengli.gif"], ["����", "aini.gif"], ["����", "qiang.gif"], ["��", "ruo.gif"], ["��", "no.gif"], ["����", "gouying.gif"], ["����", "woshou.gif"], ["ȭͷ", "quantou.gif"], ["�", "chajing.gif"], ["�õ�", "ok.gif"], ["̫��", "taiyang.gif"], ["����", "yueliang.gif"]];
        var faceBpath = i8_session.resHost+"default/images/face/";
        //����@��ת��
        var atUserFormate=function(str){
            if(!str){
                return "";
            }
            if(str.length>0) {
                str = str.replace(/\$%\$([\w\-\,\u4E00-\ufa2d\.]+)\$%\$/g, function (str, info) {
                    var infosry = info.split(',');
                    var enType = infosry[2];//enTypeΪ0,��Ա��1��Ⱥ�飻2����֯��
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
                //[url="/report/detail/decffb25-5abc-4925-8fdc-47cc0633f4cc";txt="2015��3��9��-2015��3��15��"]
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