/**
 * Created by kusion on 2014/11/19.
 */
define(function(require){
    //var _=require('../../common/underscore-min-cmd');
    function i8designer(_settings){
        var _settings= $.extend({
            formname:'#',
            btnLink:'',
            action:'new',
            formid:'00000000-0000-0000-0000-000000000000',
            baseinfoid:'00000000-0000-0000-0000-000000000000',
            formSaveCompleted:function(){},
            formCancel:function(){}
        },_settings);
        $(_settings.btnLink).click(function(){
            window.pageYOffset=document.documentElement.scrollTop=document.body.scrollTop=0;
            var designerLayer=$('<div class="dsn-Layer"><iframe frameborder="0" width="100%" height="100%" src="design/plugin/form?action='+_settings.action+'&id='+_settings.formid+'&name='+_settings.formname+'&baseinfoid='+_settings.baseinfoid+'"></iframe></div>');
            $('body').append(designerLayer).css({"overflow-y":"hidden"});
            window.formSaveCompleted=function(data){
                _settings.formSaveCompleted(data);
                $('.dsn-Layer').find('iframe').remove();
                $('.dsn-Layer').remove();
                $('body').css({"overflow-y":"auto"});
            };
            window.formCancel=function(data){
                _settings.formCancel(data);
                $('.dsn-Layer').find('iframe').remove();
                $('.dsn-Layer').remove();
                $('body').css({"overflow-y":"auto"});
            };
        });
    }
    return i8designer;
})