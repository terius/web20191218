$(function () {

    var isAgree=false;//同意政策
    //phone register
    $(".js-phoneBtn").click(function(){
        var phone=$this.find("input[name='phone']").val().trim();
        var verCode=$this.find("input[name='verCode']").val().trim();
        var account=$this.find("input[name='account']").val().trim();
        var psd=$this.find("input[name='psd']").val().trim();
        if(phone==""){
            alert("请输入手机号码");
            return false;
        }
        if(verCode==""){
            alert("请输入验证码");
            return false;
        }
        if(account==""){
            alert("请输入账号");
            return false;
        }
        if(psd==""){
            alert("请输入密码");
            return false;
        }
        if(!isAgree){
            alert("请同意政策");
            return false;
        }
        window.location.href="Login.html";
    });

    //mail register
    $(".js-mailBtn").click(function(){
        $this=$(this).parents(".registerbox");
        var mail=$this.find("input[name='mail']").val().trim();
        var account=$this.find("input[name='account']").val().trim();
        var psd=$this.find("input[name='psd']").val().trim();
        if(mail==""){
            alert("请输入邮箱");
            return false;
        }
        if(account==""){
            alert("请输入账号");
            return false;
        }
        if(psd==""){
            alert("请输入密码");
            return false;
        }
        if(!isAgree){
            alert("请同意政策");
            return false;
        }
        window.location.href="Login.html";
    });

    //agree
    $(".js-agreeBtn").click(function(){
        if($(this).hasClass("act")){
            $(this).removeClass("act");
            isAgree=false;
        }else{
            $(this).addClass("act");
            isAgree=true;
        }
    });


});