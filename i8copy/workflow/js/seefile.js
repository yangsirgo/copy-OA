/**
 * Created by ryf on 2016/8/2.
 */
define(function (require, exports) {
    require("../../stylesheets/fw.css"); //@TODO
    require("../../stylesheets/fj_see.css");// @TODO
    //var sbox = require("/resource/default/special/js/assets/fw_i8showbox.js");
    var util = require("./util.js");
    // var guidang= require.async(""+i8_session.resHost+"default/javascripts/document/common.js");
    window.powerIndex=window.powerIndex || 1;
    var sf = {
        fjId: "js_fj_id",  //鎺у埗鏄剧ず闅愯棌瀹瑰櫒ID
        panlId: "js_sf_panl", //鏁翠釜鏌ョ湅鍣ㄥ鍣↖D
        closeId: "js_sf_close", //鍏抽棴鎸夐挳ID
        fullScreenId:'js_sf_fullScreen',//鍏ㄥ睆
        showleftId: "js_showimg_div", //宸︿晶鍥剧墖灞曠ず瀹瑰櫒ID
        ckImgId: "js_showimg_id", //灞曠ず褰撳墠閫夋嫨鍥剧墖鐨処D
        bigckImgId: "js_showbigimg_id",//澶у浘
        ckFileId: "js_sf_id", //灞曠ず褰撳墠闄勪欢瀹瑰櫒ID
        imgsPanlId: "js_imgsall_Id",//鍥剧墖鍒楄〃瀹瑰櫒ID
        prevImg: "/default/images/fjsee/pic_prev.cur",   //涓婁竴寮犲浘鏍囪矾鍔?
        nextImg: "/default/images/fjsee/pic_next.cur",   //涓嬩竴寮犲浘鏍囪矾鍔?
        datas: {},                  //闄勪欢鍙傛暟缂撳瓨
        fileBgUrl: i8_session.resHost+"default/images/fjsee/",
        protocol:window.location.protocol,
        iframeUrl: "",
        iframePath: "",
        viewUrl:'http://wopi.i8xiaoshi.com/Home/ViewFile?filePath=',
        getDownUrl:function(item){
            var dl_url=location.protocol+"//"+location.host+i8_session.baseHost+"platform/get-file?imgurl="+encodeURIComponent(item.FilePath)+"&attname="+encodeURIComponent(item.FileName);
            var _extension=item.Extension.toLocaleLowerCase();
            if(_extension=='jpg'||_extension=='gif'||_extension=='png'||_extension=='jpeg'||_extension=='bmp'){
                if(item.FilePath.indexOf('?')==-1){
                    dl_url=item.FilePath+'?attname='+item.FileName;
                }else{
                    dl_url=item.FilePath+'&attname='+item.FileName;
                }
            }
            return dl_url;//item.FilePath;
        },
        getViewUrl:function(item){
            var _viewurl='';
            var _extension=item.Extension.toLocaleLowerCase();
            if(_extension=='txt'){
                _viewurl=location.protocol+"//"+location.host+i8_session.baseHost+"platform/view-txt?imgurl="+encodeURIComponent(item.FilePath);
            }else{
                _viewurl=location.protocol+"//"+location.host+i8_session.baseHost+"platform/view-file?imgurl="+encodeURIComponent(item.FilePath);
            }
            return _viewurl;
        },
        footheight: 135,
        imgMaxW: 1024,
        imgMaxH: 550,
        fileW: 860,
        fileH: 500,
        dg: function (id) {

            if (top.location != location) {
                return $(window.parent.document.getElementById(id));
            } else {
                return $(document.getElementById(id));
            }
        },
        getEment: function (id) {
            return document.getElementById(id) || window.parent.document.getElementById(id);
        },
        dcMent: function () {
            if (top.location != location) {
                return window.parent.document;
            } else {
                return document;
            }
        },
        getClientHeight: function () {
            if (top.location != location) {
                return window.parent.document.documentElement.clientHeight;
            } else {
                return document.documentElement.clientHeight;
            }
        },
        //鍒濆鍖栧姞杞芥鏋?
        begin: function (data) {
            sf.datas = data;
            var _downurl=sf.getDownUrl(data.imgs[data.ckindex]);
            var htArrs = [
                '<div id="' + sf.fjId + '" class="fj_panl">',
                '<span id="' + sf.closeId + '" class="fj_close"></span>',
                '<span id="' + sf.fullScreenId + '" class="js_sf_fullScreen"></span>',
                '<div id="' + sf.showleftId + '" class="fj_imgs tct" onselectstart="return false;">',
                '<span id="js_loading" class="fj_loading" style=""></span>',
                '</div>',
                '<div id="' + sf.imgsPanlId + '" class="fj_smalls">',
                '<div class="fj_small_cont">',
                '<div id="fj_img_editdiv" class="fj_links_div hide">',
                //'<a class="del_file fj3">鍒犻櫎</a>',
                '<a class="upimg_angle fj1">鍚戝乏杞?</a>',
                '<a class="upimg_angle fj2">鍚戝彸杞?</a>',
                '<a class="upimg_size fj3">鏀惧ぇ</a>',
                '<a id="fj_file_guidang" gd-in-dielog="true" class="fj_file_guidang fj5 hide">褰掓。鍒颁紒涓氭枃妗?</a>',
                '<a class="down_link fj4" href="'+_downurl+'" target="_blank">涓嬭浇鍘熷浘</a>',
                '</div>',
                '<div id="fj_file_editdiv" class="fj_links_div hide">',
                //'<a class="del_file fj3">鍒犻櫎</a>',
                '<a gd-in-dielog="true" class="fj_file_guidang fj5 hide">褰掓。鍒颁紒涓氭枃妗?</a>',
                '<span class="down_file fj4" target="_blank">涓嬭浇鏌ョ湅</span>',
                '</div>',
                '</div>',
                '<ul class="fj_small_ul oflow">',
                '</ul>',
                '</div>',
                '</div>'
            ]
            var strHt = htArrs.join('');
            if (document.getElementById(sf.fjId)) {
                sf.dg(sf.fjId).remove();
            }
            if (top.location != location) {
                $(window.parent.document.body).append(strHt);
            } else {
                $("body").append(strHt);
            }
            sf.countSize();
        },
        getWidth: function () {
            if (top.location != location) {
                return $(window.parent.document).width();
            } else {
                $(document).width();
            }
        },
        getHeight: function () {
            if (top.location != location) {
                return $(window.parent.document).height();
            } else {
                $(document).height();
            }
        },
        //璁＄畻瀹藉害锛岄珮搴﹀嚱鏁?
        countSize: function () {
            if (top.location == location) {
                $(document.body).css("overflow", "hidden");
            } else {
                $(window.parent.document.body).css("overflow", "hidden");
            }
            var $fjdiv = sf.dg(sf.fjId);
            var $panl = sf.dg(sf.panlId);
            var $pleft = sf.dg(sf.showleftId);
            var panlWidth = sf.getWidth();
            var panlHeight = sf.getHeight() - 50;
            //var mgleft = panlWidth * 100/96 * 2/100;
            $panl.width(panlWidth);
            //$pleft.width(panlWidth);

            //鍒ゆ柇閬僵灞傛槸鍚﹀瓨鍦?
            if (!sf.getEment("js_mask_zhezhao_div")) {
                if (top.location != location) {
                    $(window.parent.document.body).append('<div id="js_mask_zhezhao_div" class="fw_mask" style="display:block;"></div>');
                }
                $(document.body).append('<div id="js_mask_zhezhao_div" class="fw_mask" style="display:block;"></div>');

            } else {
                sf.dg("js_mask_zhezhao_div").show();
                $("#js_mask_zhezhao_div").show();
            }
            //璁剧疆寮瑰嚭灞傜殑浣嶇疆

            $fjdiv.css({ "width": panlWidth, "height": sf.getHeight() }).show();
            sf.imgMaxH = sf.getClientHeight() - sf.footheight;
            $pleft.css({ "height": sf.imgMaxH + "px", "line-height": sf.imgMaxH + "px" }); //淇敼閫傜敤浜庡浘鐗囨煡鐪嬬殑鏍峰紡
            sf.dg(sf.imgsPanlId).width(panlWidth);
            //鏄剧ず鍥剧墖鏂囦欢鍒楄〃
            sf.loadAllimgs();

            var ckobj = sf.datas.imgs[sf.datas.ckindex];
            //鍔犺浇褰撳墠閫夋嫨椤?
            sf.loadChecked(ckobj);
        },
        //鏄剧ず褰撳墠閫変腑鐨勫浘鐗?
        checkImg: function (item) {
            sf.dg("js_no_see_file").remove();
            var imgDom = sf.getEment(sf.ckImgId)
            var _downurl=sf.getDownUrl(item);
            if (sf.getEment(sf.ckFileId)) {
                sf.dg(sf.ckFileId).hide();
            }
            sf.dg("js_loading").show();
            //sf.imgMaxW = $(document).width() - 140;
            //鎿嶄綔鍖哄煙鏇存浛
            sf.dg("fj_file_editdiv").hide();
            sf.dg("fj_img_editdiv").show();
            if (imgDom) {
                sf.narrowImg();
                imgDom.style.display = "none";
                imgDom.src = item.FilePath;
                var oldsrc = sf.getEment(sf.bigckImgId).src; //淇濆瓨鍘熸潵鏄剧ず鐨勫浘鐗囧湴鍧€
                sf.getEment(sf.bigckImgId).src = item.ImageLarge;
                $(imgDom).attr("rotation", "0").attr("angle", "0").css({ "max-height": sf.imgMaxH, "max-width": sf.imgMaxW });
            } else {
                var conhtml = '<span>' +
                    '<img docid="'+item.ID+'" id="' + sf.ckImgId + '" src="' + item.FilePath + '" rotation="0" angle="0" style="max-height:' + sf.imgMaxH + 'px;max-width:' + sf.imgMaxW + 'px;" class="fj_show_img hide" />' +
                    '<img docid="'+item.ID+'" id="' + sf.bigckImgId + '" src="' + item.FilePath + '" style="max-width:' + sf.imgMaxW + 'px; display: none;" class="fj_show_img" />' +
                    '</span>';
                var $pleft = sf.dg(sf.showleftId);
                $pleft.append(conhtml);
                imgDom = sf.getEment(sf.ckImgId);
            }
            sf.dg(sf.imgsPanlId).find(".down_link").attr("href", _downurl);	 //鏇存柊涓嬭浇鍥剧墖鍦板潃
            if (oldsrc && oldsrc.indexOf(item.FilePath) >= 0) {  //濡傛灉鍥剧墖鍦板潃鏃犳敼鍙? 鍒欓渶鎵嬪姩鏄剧ず 鏃犳硶瑙﹀彂onload浜嬩欢
                sf.dg("js_loading").hide();
                imgDom.style.display = "inline-block";
            }
            imgDom.onload = function () {
                imgDom.style.display = "inline-block";
                sf.dg("js_loading").hide();
            }
            if (item.CreaterID==i8_session.uid && item.DocTreeID==0) {
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('褰掓。鍒颁紒涓氭枃妗?').attr('docname',item.FileName).attr('docid',item.ID);
            } else if(item.CreaterID==i8_session.uid && item.DocTreeID!=0){
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('宸插綊妗?').attr('docname',item.FileName).attr('docid',item.ID);
            }else{
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').hide();
            }
        },
        //鏄剧ず褰撳墠閫変腑鐨勬枃妗?
        checkFile: function (item, aid) {
            var down_url=sf.getDownUrl(item);
            var fileDom = sf.getEment(sf.ckFileId);
            if (sf.getEment(sf.ckImgId)) {
                sf.dg(sf.ckImgId).hide();
                sf.dg(sf.bigckImgId).hide();
            }
            var ldDom = sf.dg("js_loading");
            ldDom.hide();
            //鎿嶄綔鍖哄煙鏇存浛
            sf.dg("fj_img_editdiv").hide();
            sf.dg("fj_file_editdiv").show();
            sf.dg(sf.imgsPanlId).find(".down_link").attr("href", down_url);
            var reg = RegExp('rar|zip');
            if (reg.test(item.Extension)) {
                sf.dg("js_loading").hide();
                sf.dg(sf.ckFileId).hide();
                if (!sf.getEment("js_no_see_file")) {
                    sf.dg(sf.showleftId).append("<div docid='"+item.ID+"' id='js_no_see_file' style='background:#fff; font-size:14px; color: red;'>璇ユ枃浠朵笉鏀寔鍦ㄧ嚎闃呰锛?<span class='down_file' target='_blank' >璇蜂笅杞芥煡鐪?</span></div>");
                    sf.dg(sf.imgsPanlId).find(".down_file").attr("href",down_url);
                }
                //褰掓。缁戝畾
                sf.dg(sf.imgsPanlId).find(".down_file").attr("href", down_url);
                if (item.CreaterID==i8_session.uid && item.DocTreeID==0) {
                    sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('褰掓。鍒颁紒涓氭枃妗?').attr('docname',item.FileName).attr('docid',item.ID);
                } else if(item.CreaterID==i8_session.uid && item.DocTreeID!=0){
                    sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('宸插綊妗?').attr('docname',item.FileName).attr('docid',item.ID);
                }else{
                    sf.dg(sf.imgsPanlId).find('.fj_file_guidang').hide();
                }
                return false;
            } else {
                sf.dg("js_loading").hide();
                sf.dg("js_no_see_file").remove();
            }
            var _url=item.FilePath;
            _url=sf.getViewUrl(item);
            if (fileDom) {
                sf.dg(sf.ckFileId).hide();
                sf.getEment(sf.ckFileId).src = _url;   // "/Storage/fileview.aspx?fileid=" + item.ID + "&a=" + i8_session.aid;
            } else {
                var $pleft = sf.dg(sf.showleftId);
                var htsize = $pleft.height() > 450 ? $pleft.height() : 450;
                var framehtml = '<iframe id="' + sf.ckFileId + '" class="hide" style=" margin:15px auto;background-color:#fff" frameborder="0" src="' + _url+'" width="' + sf.fileW + '" height="' + sf.fileH + '"></iframe>';
                $pleft.append(framehtml);
                fileDom = sf.getEment(sf.ckFileId);
            }
            fileDom.style.display = "block";
            sf.dg(sf.imgsPanlId).find(".down_file").attr("href", down_url);
            if (item.CreaterID==i8_session.uid && item.DocTreeID==0) {
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('褰掓。鍒颁紒涓氭枃妗?').attr('docname',item.FileName).attr('docid',item.ID);
            } else if(item.CreaterID==i8_session.uid && item.DocTreeID!=0){
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').css('display','inline-block').text('宸插綊妗?').attr('docname',item.FileName).attr('docid',item.ID);
            }else{
                sf.dg(sf.imgsPanlId).find('.fj_file_guidang').hide();
            }
            // @todo
            //sf.dg("fj_file_guidang").hide();
        },
        //鍔犺浇褰撳墠閫夋嫨椤?
        loadChecked: function (ckobj) {
            if (sf.datas.imgs.length <= 0) {
                sf.close();
            }
            if (ks.getTypestr(ckobj.Extension) == "img") {
                sf.checkImg(ckobj);//鍥剧墖
            } else {
                sf.checkFile(ckobj); //鏂囦欢
            }
            var objlis = sf.dg(sf.imgsPanlId).find("li.fj_small_li");
            objlis.removeClass("current");
            $(objlis[sf.datas.ckindex]).addClass("current");
        },
        //鍔犺浇鎵€鏈夐檮浠跺垪琛?
        loadAllimgs: function () {
            var imgpanl = sf.dg(sf.imgsPanlId);
            var imgul = imgpanl.find("ul");
            var lihtml = "";
            if (sf.datas.imgs) {
                for (var i = 0; i < sf.datas.imgs.length; i++) {
                    var item = sf.datas.imgs[i];
                    var current = "";
                    var smallimgurl = item.FilePath;
                    if (ks.getTypestr(item.Extension) == "file") {
                        smallimgurl = sf.fileBgUrl + item.Extension.replace(".", "") + ".png";
                    }
                    if (sf.datas.ckindex == i) {
                        current = "current";
                    }
                    lihtml += '<li docid="'+item.ID+'" class="fj_small_li ' + current + '"><a style="line-height:0px"><img src="' + smallimgurl + '"></a></li>';
                };
                imgul.html(lihtml).width(90 * sf.datas.imgs.length);
                imgpanl.animate({ bottom: 0 }, 500);
            }
            sf.bindImgclick();
        },
        guidang:function($guidangbtn){
            var $this=$guidangbtn;
            if($this.text()=='宸插綊妗?'){
                return false;
            }
            var item= sf.datas.imgs[sf.datas.ckindex];
            var guidang= require("../../../default/javascripts/document/common.js");
            console.log(guidang)
            var _fileId=$this.attr('docid');
            var _fileName=$this.attr('docname');
            _fileName=_fileName.substr(0,_fileName.lastIndexOf('.'));
            guidang.page.btn_guidang_ev_file(null,null,_fileName,_fileId,function(){
                var $if_kk_files_panl=$(window.frames["iframe-kankan"].document).find('[docid='+item.ID+']').parents('.kk_files_panl');
                var $kk_files_panl=$('[docid='+item.ID+']').parents('.kk_files_panl');
                if($kk_files_panl.length==0){
                    $kk_files_panl=$("#"+item.ID).parents('.kk_files_panl');
                }
                if($if_kk_files_panl.length==0){
                    $if_kk_files_panl=$(window.frames["iframe-kankan"].document).find("#"+item.ID).parents('.kk_files_panl');
                }
                sf.updateData(_fileId,$kk_files_panl);
                sf.updateData(_fileId,$if_kk_files_panl);
                $this.text('宸插綊妗?');
                $('.btn-place-on-file[docid='+_fileId+']').replaceWith('<a class="btn-has-place-on-file" href="javascript:void(0)">宸插綊妗?</a>')
                $(window.frames["iframe-kankan"].document).find('.btn-place-on-file[docid='+_fileId+']').replaceWith('<a class="btn-has-place-on-file" href="javascript:void(0)">宸插綊妗?</a>')
            })

        },
        updateData:function(_fileId,$kk_files_panl){
            if($kk_files_panl && $kk_files_panl.length==0){
                return false;
            }
            var data_arr=$kk_files_panl.attr('data-arrs');
            data_arr= $.parseJSON(data_arr);
            for(var i in data_arr){
                if(data_arr[i].ID==_fileId){
                    data_arr[i].DocTreeID= 999999999999;
                }
            }
            data_arr=util.toJsonString(data_arr);
            $kk_files_panl.attr('data-arrs',data_arr);
        },
        //鏃嬭浆鍑芥暟
        setAngle: function (obj, size, index) {
            var browser = navigator.appName
            var b_version = navigator.appVersion
            var version = b_version.split(";");
            var trim_Version = version[1] ? version[1].replace(/[ ]/g, "") : version[0].replace(/[ ]/g, "");
            var imgMaxW = sf.imgMaxW;
            var imgMaxH = sf.imgMaxH;
            sf.dg(sf.bigckImgId).hide();
            sf.dg(sf.ckImgId).show();
            if (browser == "Microsoft Internet Explorer" && (trim_Version == "MSIE7.0" || trim_Version == "MSIE7.0")) {
                var rotation = parseInt(obj.attr("rotation")) + index;
                if (rotation > 3) {
                    rotation = 0;
                }
                if (rotation < 0) {
                    rotation = 3;
                }
                if (rotation % 2 == 1 || rotation % 2 == -1) {
                    imgMaxW = sf.imgMaxH;
                    imgMaxH = sf.imgMaxW;
                }
                obj[0].style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rotation + ")";
                obj.attr("rotation", rotation).css({ "max-width": imgMaxW, "max-height": imgMaxH });

            } else {
                var angle = parseInt(obj.attr("angle")) + size;
                if ((angle / 90) % 2 == 1 || (angle / 90) % 2 == -1) {
                    imgMaxW = sf.imgMaxH;
                    imgMaxH = sf.imgMaxW;
                }
                var angleTime = "0.5s";
                sf.dg(sf.panlId).css("overflow", "hidden");
                obj.css({
                    "transform": "rotate(" + angle + "deg)",
                    "-ms-transform": "rotate(" + angle + "deg)",	/* IE 9 */
                    "-webkit-transform": "rotate(" + angle + "deg)",	/* Safari and Chrome */
                    "-o-transform": "rotate(" + angle + "deg)",		/* Opera */
                    "-moz-transform": "rotate(" + angle + "deg)",	/* Firefox */
                    "transition": "transform " + angleTime,
                    "-ms-transition": "-ms-transform " + angleTime,	/* IE 9 */
                    "-webkit-transition": "-webkit-transform " + angleTime,
                    "-o-transition": "-o-transform " + angleTime,
                    "-moz-transition": "-moz-transform " + angleTime,
                    "max-width": imgMaxW, "max-height": imgMaxH
                }).attr("angle", angle);
            }
        },
        //缂╁皬鏀惧ぇ鍥剧墖骞跺皢鍥剧墖鏃嬭浆褰掗浂鍑芥暟
        narrowImg: function () {
            if (sf.getEment(sf.ckImgId).style.filter) {
                sf.getEment(sf.ckImgId).style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            } else {

            }
            var angle = 0;
            var angleTime = "0.5s";
            sf.dg(sf.panlId).css("overflow", "hidden");
            sf.dg(sf.ckImgId).css({
                "transform": "rotate(" + angle + "deg)",
                "-ms-transform": "rotate(" + angle + "deg)",	/* IE 9 */
                "-webkit-transform": "rotate(" + angle + "deg)",	/* Safari and Chrome */
                "-o-transform": "rotate(" + angle + "deg)",		/* Opera */
                "-moz-transform": "rotate(" + angle + "deg)",	/* Firefox */
                "transition": "transform " + angleTime,
                "-ms-transition": "-ms-transform " + angleTime,	/* IE 9 */
                "-webkit-transition": "-webkit-transform " + angleTime,
                "-o-transition": "-o-transform " + angleTime,
                "-moz-transition": "-moz-transform " + angleTime,
                "max-width": sf.imgMaxW, "max-height": sf.imgMaxH
            }).attr("angle", angle);
            sf.dg(sf.bigckImgId).hide();
            sf.dg(sf.ckImgId).attr("angle", "0").attr("rotation", "0");
            sf.dg(sf.showleftId).css("overflow", "hidden");
            sf.dg(sf.imgsPanlId).find("a.upimg_size").removeClass("fj3_1").html('鏀惧ぇ');
        },
        //缁戝畾鍥剧墖鐨勫悇绉嶄簨浠?
        bindImgclick: function () {
            //榧犳爣绉诲姩鏃舵樉绀虹殑鍥炬爣鏇存崲
            sf.dg(sf.showleftId).unbind().mousemove(function (e) {
                var objthis = $(this);
                var left = objthis.offset().left;
                var top = objthis.offset().top;
                var contwidth = objthis.outerWidth();
                var e = e || window.event;
                var sizeX = e.clientX || e.pageX;
                if (sizeX - left > contwidth / 2) {
                    if (sf.datas.ckindex >= sf.datas.imgs.length - 1) {
                        objthis.css("cursor", "default");
                    } else {
                        objthis.css("cursor", "url(" + sf.nextImg + "),auto");
                    }

                } else {
                    if (sf.datas.ckindex == 0) {
                        objthis.css("cursor", "default");
                    } else {
                        objthis.css("cursor", "url(" + sf.prevImg + "),auto");
                    }
                }
            });
            //鍥剧墖鍒囨崲浜嬩欢
            sf.dg(sf.showleftId).click(function (e) {
                var objthis = $(this);
                var left = objthis.offset().left;
                var top = objthis.offset().top;
                var contwidth = objthis.outerWidth();
                var ev = window.event || e || window.parent.event;
                var sizeX = ev.clientX || ev.pageX;
                if (sizeX - left > contwidth / 2) {
                    sf.datas.ckindex++;		//涓嬩竴寮?
                } else {
                    sf.datas.ckindex--;		// 涓婁竴寮?
                }
                if (sf.datas.ckindex < 0) {
                    sf.datas.ckindex = 0;
                    return false;
                }
                if (sf.datas.ckindex >= (sf.datas.imgs.length)) {
                    sf.datas.ckindex = sf.datas.imgs.length - 1;
                    return;
                }
                //鏄剧ず褰撳厛閫夋嫨椤?
                sf.loadChecked(sf.datas.imgs[sf.datas.ckindex]);
            });
            //鍏抽棴浜嬩欢
            sf.dg(sf.closeId).click(function () {
                sf.close();
            });
            //鍏ㄥ睆浜嬩欢
            sf.dg(sf.fullScreenId).click(function () {
                sf.fullScreen();
            });
            //搴曢儴鍥剧墖鎺掑垪浜嬩欢锛岄樆姝簨浠跺啋娉?
            sf.dg(sf.imgsPanlId).delegate("ul", "click", function () {
                return false;
            });
            //鏀惧ぇ缂╁皬浜嬩欢
            sf.dg(sf.imgsPanlId).delegate(".upimg_size", "click", function () {
                var thistext = $.trim($(this).text());
                if (thistext == "鏀惧ぇ") {
                    sf.dg(sf.ckImgId).hide();
                    sf.dg(sf.bigckImgId).show();
                    sf.dg(sf.showleftId).css("overflow", "auto");
                    $(this).html('缂╁皬').addClass("fj3_1");
                }
                if (thistext == "缂╁皬") {
                    sf.dg(sf.bigckImgId).hide();
                    sf.dg(sf.ckImgId).show();
                    sf.dg(sf.showleftId).css("overflow", "hidden");
                    $(this).html('鏀惧ぇ').removeClass("fj3_1");
                }
            });
            //鍥剧墖鏃嬭浆浜嬩欢
            sf.dg(sf.imgsPanlId).delegate(".upimg_angle", "click", function () {
                if (sf.getEment(sf.ckImgId).style.display == "none") {
                    sf.narrowImg();
                }
                if ($(this).text() == "鍚戝彸杞?") {
                    sf.setAngle(sf.dg(sf.ckImgId), 90, 1);
                } else {
                    sf.setAngle(sf.dg(sf.ckImgId), -90, -1);
                }
            });
            //搴曢儴鍥剧墖鐐瑰嚮鍒囨崲浜嬩欢
            sf.dg(sf.imgsPanlId).delegate("li.fj_small_li", "click", function () {
                var objlis = sf.dg(sf.imgsPanlId).find("li.fj_small_li");
                var index = objlis.index($(this));
                sf.datas.ckindex = index;
                sf.loadChecked(sf.datas.imgs[index]);
            });
            //褰掓。鍒扮煡璇嗗簱
            sf.dg(sf.imgsPanlId).find('.fj_file_guidang').click(function () {
                var $this=$(this);
                sf.guidang($this);
                return false;
                //sf.guidang(sf.datas.imgs[sf.datas.ckindex].ID);
            });
            //涓嬭浇鏂囨。浜嬩欢
            sf.dg(sf.fjId).delegate(".down_file", "click", function () {
                window.open($(this).attr("href"));
            });
            //鍒犻櫎浜嬩欢
            sf.dg(sf.fjId).delegate(".del_file", "click", function () {
                //console.log(sf.datas.ckindex);
                var thisobj = sf.dg(sf.imgsPanlId).find(".current");
                var removeIndex = thisobj.index();
                sf.datas.imgs.splice(removeIndex, 1);
                var ckobj = sf.datas.imgs[sf.datas.ckindex];
                thisobj.remove();
                sf.loadChecked(ckobj);

            });
        },
        //鍏抽棴鍑芥暟
        close: function () {
            sf.dg(sf.fjId).remove();
            sf.dg(sf.fullScreenId).remove();
            sf.dg("js_mask_zhezhao_div").hide();
            if (top.location == location) {
                $(document.body).css("overflow", "auto");
            } else {
                $(window.parent.document.body).css("overflow", "auto");
                $("#js_mask_zhezhao_div").hide();
            }
        },
        //鍏ㄥ睆
        fullScreen:function(){
            //console.log(sf.dg(sf.fjId))
            //sf.dg(sf.fjId).remove();
            //sf.dg("js_mask_zhezhao_div").hide();
            sf.dg('js_sf_id').toggleClass('full_iframe');
            sf.dg(sf.fullScreenId).toggleClass('full');
            //console.log($(document.getElementById('js_sf_id').contentWindow.document.body).html());
        }
    }

    var ks = {
        className: "kk_files_panl",
        getHtml: function (arrs, isDel,fileMaxWidth) {//fileMaxWidth瀹藉害鏂囦欢鍚嶅瓧瀹藉害
            var fileMaxWidth=fileMaxWidth || 320;
            var ulfile='<ul class="att_ulfile">';//闄勪欢灞曠ず鍒樿〃
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i];
                var display = "none";
                var m_l0=i%3==0?' margin-left:0 ':'';
                var _downurl=sf.getDownUrl(item)
                if (item.Creator == i8_session.uid && isDel) {
                    display = "inline";
                }
                var guidangHtml='';
                if(item.CreaterID==i8_session.uid && item.DocTreeID!=0){
                    guidangHtml='<a class="btn-has-place-on-file" href="javascript:void(0)">宸插綊妗?</a>'
                }else if(item.CreaterID==i8_session.uid && item.DocTreeID==0){
                    guidangHtml='<a class="btn-place-on-file" docname="'+item.FileName+'" docid="'+item.ID+'" href="javascript:void(0)">褰掓。</a>'
                }
                ulfile += '<li style="'+m_l0+' ;padding-right:20px;" docid="'+item.ID+'" class=" oflow" id="' + item.ID + '">\
                            <span style="max-width:'+fileMaxWidth+'px;" docid="'+item.ID+'" title="'+item.FileName+'" class="filename-span kks_option_li m-l10" zindex="' + i + '">' + item.FileName + '</span>\
                                <div class="rt m-r10">\
                                <span class="" style="vertical-align: -2px;margin-right: 20px;">'+item.CreaterName+' '+new Date(item.CreateTime.replace(/-/g,'/')).format('yyyy/MM/dd hh:mm')+'</span>\
                                <a class="kks_option_li" style="float: none;" zindex="' + i + '" href="javascript:void(0)">鏌ョ湅</a>\
                                <a class="kks-down-a attfile-down" href="'+_downurl+'">涓嬭浇</a>'+guidangHtml+'</div>\
                            <a class="del-down-a" style="margin-left:10px; display: ' + display + ';"></a>\
                            </li>';
            };
            ulfile += "</ul>";
            var arrsstring = util.toJsonString(arrs);
            return '<div class="' + this.className + '" data-arrs=\'' + arrsstring + '\'>' + ulfile + '</div>';
        },
        getHtmlFW:function(arrs, isDel,fileMaxWidth){
            return ks.getHtml(arrs, isDel,fileMaxWidth);
        },
        getHtmlKK: function (arrs, isDel) {
            var ulimgs = '<ul class="kks_op_ulimgs">'; //鍥剧墖鍒楄〃
            var ulfile = '<ul class="kks_op_ulfiles">'; //鏂囦欢鍒楄〃
            var SoundFile = '';

            //瀵归泦鍚堥噸鏂版帓搴?
            var newarrs = [];
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i];
                if (ks.getTypestr(item.Extension) == "img") {
                    newarrs.push(item);
                }
            }
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i];
                if (ks.getTypestr(item.Extension) == "file") {
                    newarrs.push(item);
                }
            }
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i];
                if (ks.getTypestr(item.Extension) == "amr") {
                    newarrs.push(item);
                }
            }
            arrs = newarrs;
            for (var i = 0; i < arrs.length; i++) {
                var item = arrs[i];
                var dsplay = "none";
                var m_l0=i%3==0?' margin-left:0 ':'';
                var _downurl=sf.getDownUrl(item)
                if (item.Creator == i8_session.uid && isDel) {
                    dsplay = "inline";
                }
                var guidangHtml='';
                //褰掓。鎸夐挳
                if(item.CreaterID==i8_session.uid && item.DocTreeID!=0){
                    guidangHtml='<a class="btn-has-place-on-file" href="javascript:void(0)">宸插綊妗?</a>'
                }else if(item.CreaterID==i8_session.uid && item.DocTreeID==0){
                    guidangHtml='<a class="btn-place-on-file" docname="'+item.FileName+'" docid="'+item.ID+'" href="javascript:void(0)">褰掓。</a>'
                }
                if (ks.getTypestr(item.Extension) == "img") {
                    //ulimgs += '<li class="kks_option_li rel" id="' + item.ID + '" zindex="' + i + '" ><a class="del-down-a ct_layer_close" style="margin:0px; top:0px; right:-1px; width:7px; height: 6px; display:' + dsplay + ';" title="鍒犻櫎"></a><img src="' + item.ImageSmall + '"></li>';
                    ulfile += '<li docid="'+item.ID+'" style="'+m_l0+'" class="kks_option_li oflow" id="' + item.ID + '" zindex="' + i + '">' +
                        '<img class="uploader-process-image-preview" style="width:80px;height:80px;" src="'+item.FilePath +'?imageView2/1/w/80/h/80" />' +
                        '<div class="kks_op_file_info">' +
                        '<p class="attfile-name">' + decodeURI(item.FileName) + '</p>' +
                        '<div><span style="color:#999;">' + item.CreaterName +'</span></div>' +
                        '<div><span style="color:#999;">' + item.CreateTime + '</span></div>'+
                        '<p><a  class="attfile-view" href="javascript:void(0)" >鏌ョ湅</a><a class="kks-down-a attfile-down" href="'+_downurl+'">涓嬭浇</a>'+guidangHtml+'<a class="del-down-a" style="margin-left:10px; display: ' + dsplay + ';"></a></p>' +
                        '</div>' +
                        '</li>';
                }
                if (ks.getTypestr(item.Extension) == "file") {
                    ulfile += '<li docid="'+item.ID+'" style="'+m_l0+'" class="kks_option_li oflow" id="' + item.ID + '" zindex="' + i + '">' +
                        '<span class="kks_op_file_bg filesicons i8files-ico-'+item.Extension+'"></span>' +
                        '<div class="kks_op_file_info">' +
                        '<p class="attfile-name">' + decodeURI(item.FileName) + '</p>' +
                        '<div><span style="color:#999;">' + item.CreaterName +'</span></div>' +
                        '<div><span style="color:#999;">' + item.CreateTime + '</span></div>'+
                        '<p><a href="javascript:void(0)">鏌ョ湅</a><a class="kks-down-a attfile-down" href="'+_downurl+'">涓嬭浇</a>'+guidangHtml+'<a class="del-down-a" style="margin-left:10px; display: ' + dsplay + ';"></a></p>' +
                        '</div>' +
                        '</li>';
                }
                if (ks.getTypestr(item.Extension) == "amr") {
                    var audio = require('./fw_i8audiofile');
                    SoundFile += audio.i8soundHTMLString({ mp3: item.AudioMP3, amr: item.FilePath, seconds: parseInt(item.Size), converted: item.ToStatus });
                }
            };
            ulimgs += "</ul>";
            ulfile += "</ul>";
            var arrsstring = util.toJsonString(arrs);
            //var $obj = $('<div class="kk_files_panl" data-arrs=\'' + arrsstring + '\'>' + ulimgs + ulfile + '</div>');
            //ks.bindImgClick($obj);
            return '<div class="' + this.className + '" data-arrs=\'' + arrsstring + '\'>' + ulimgs + ulfile + SoundFile + '</div>';
        },
        shouOnlyImg: function (imgIds) {
            if (imgIds) {

            }
        },
        showImg: function (obj) {
            var imgurl = $(obj).attr("src");
            var files = {
                ckindex: 0,
                imgs: [
                    {
                        "Extension": ".jpg",
                        "FilePath": imgurl,
                        "ImageMiddle": imgurl,
                        "ImageLarge": imgurl,
                        "ImageSmall": imgurl
                    }
                ]
            }

            $(obj).click(function () {
                sf.begin(files)
            });
        },
        bindImgClick: function (obj, collback) {
            var $obj = obj;
            //缁戝畾鍥剧墖鎴栬€呮枃浠剁殑鏌ョ湅浜嬩欢
            $obj.undelegate(".kks_option_li").delegate(".kks_option_li", "click", function () {
                var datas = {};
                datas.ckindex = $(this).attr("zindex");
                var partsobj = $(this).parents(".kk_files_panl")
                datas.imgs = $.parseJSON(partsobj.attr("data-arrs"));
                datas.Dom = partsobj;
                sf.begin(datas);
                return false;
            });
            $obj.delegate(".kks-down-a", "click", function () {
                window.open(this.getAttribute("href"));
                return false;
            });
            //褰掓。
            $obj.on("click",".btn-place-on-file", function () {
                var $this=$(this);
                var $kk_files_panl=$this.parents('.kk_files_panl');
                var guidang= require("../../../default/javascripts/document/common.js");
                var _fileId=$this.attr('docid');
                var _fileName=$this.attr('docname');
                _fileName=_fileName.substr(0,_fileName.lastIndexOf('.'));
                if($('.new-folder-cont').length==0){
                    guidang.page.btn_guidang_ev_file(null,null,_fileName,_fileId,function(){
                        $this.replaceWith('<a class="btn-has-place-on-file" href="javascript:void(0)">宸插綊妗?</a>');
                        sf.updateData(_fileId,$kk_files_panl)
                    })
                }
                return false;
            });
            if (collback) {
                $obj.delegate(".del-down-a", "click", function () {
                    var domLi = $(this).parents(".kks_option_li");
                    var linka = $(this);
//                    sbox.i8confirm({
//                        message: "纭畾瑕佸垹闄ゅ悧锛?", obj: linka, showmask: false, success: function () {
//                            var id = domLi.attr("id");
//                            collback(id);
//                            domLi.remove();
//                        }
//                    });

                    return false;
                });
            }
        },
        getTypestr: function (str) {
            var regimg = RegExp(/(jpg)|(png)|(gif)|(jpeg)/i);
            var regdoc = RegExp(/(doc)|(docx)|(txt)|(xls)|(xlsx)|(pdf)|(pdfx)|(rar)|(zip)|(ppt)|(pptx)/i);
            var regSound = RegExp(/(amr)|(mp3)|(\.amr)/i);
            if (regimg.test(str)) {
                return "img";
            } else if (regdoc.test(str)) {
                return "file";
            } else if(regSound.test(str)){
                return "amr";
            } else {
                return "";
            }
        }
    }
    exports.sf = sf;
    exports.ks = ks;
});