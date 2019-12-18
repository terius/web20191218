$(function(){
    $(".js-xinBtn").click(function(){
        var num=$(this).find("h1").text();
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            num=parseInt(num)-1;
            if(num<=0){
                num=0;
            }
        }else{
            $(this).addClass("active");
            num=parseInt(num)+1;
        }
        $(this).find("h1").text(num);
    });

    $(".js-praiseBtn").click(function(){
        var num=$(this).find("h1").text();
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            num=parseInt(num)-1;
            if(num<=0){
                num=0;
            }
        }else{
            $(this).addClass("active");
            num=parseInt(num)+1;
        }
        $(this).find("h1").text(num);
    });

    $(".js-collectBtn").click(function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).find("h1").text("收藏");
        }else{
            $(this).addClass("active");
            $(this).find("h1").text("已收藏");
        }
    });


//share
    $(".js-shareBtn").click(function(){
        $(".sharecover").show();
    });
    $(".cancle").click(function(){
        $(".sharecover").hide();
    });
});