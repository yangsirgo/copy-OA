define(function (require, exports) {
    var i8ui=require('./i8ui');
    //管理员切换按钮
    var rootBtn=$('.unrootbtn')
    i8ui.drag('.unrootbtn',null,{
        imaxLeft:64,
        imaxT:'parent',
        upcbk:function(){
            var _left=parseInt(rootBtn.css('left'));
            if(_left<32){
                if(!$(window).attr("onbeforeunload")){
                    $('body').fadeOut(300,function(){
                        window.location.href=$('.my-control').attr('_href');
                    })
                    rootBtn.animate({
                        left:'-10px'
                    });
                }else{
                    //alert(9)
                    rootBtn.animate({
                        left:64
                    },80);
                    setTimeout(function(){
                        window.location.href=$('.my-control').attr('_href');
                    },100)
                    //return;
                }

            }else{
                rootBtn.animate({
                    left:64
                });
            }
        }
    });
    $('.my-control').on('click',function(){
        $('body').fadeOut(300,function(){
            window.location.href=$('.my-control').attr('_href');
        })
        rootBtn.animate({
            left:'-10px'
        });
    })
    rootBtn.on('click',function(ev){
        ev.stopPropagation();
    })
})