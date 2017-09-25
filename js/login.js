$( document ).ready(function() {
    //localStorage.clear();
    localStorage.saleCode = "";
    localStorage.SaleName = "";
    localStorage.quotadocNo = "";
    localStorage.stepEQ= "";
    localStorage.step= "";
    localStorage.quotadocNo = "";
    localStorage.type = "";
    localStorage.saleType = "";
    localStorage.activeStatus = "";

});

var body = document.querySelector('body');
body.onkeydown = function () {

        if(event.keyCode==13){
            var user = document.getElementById("username").value;
            var pwd = document.getElementById("pwd").value;
            if(user){
                if(pwd){
                    if(user&&pwd){
                        //document.getElementById("login").click();
                        login();
                    }
                }else{
                    alertify.alert("ท่านยังไม่ได้กรอก Password");
                    document.getElementById("pwd").focus();
                }
            }else{
                alertify.alert("ท่านยังไม่ได้กรอก username");
            }
            

            

        }

         

}


function login(){
/*     var log_link = "";
    if(localStorage.link == "" || localStorage.link == null){
        log_link = "http://nps-server.dyndns.org:8080/";
        localStorage.link = log_link;
    }else{
     // alert("asd");
     log_link = localStorage.link;
     localStorage.link = log_link;
    }*/
    console.log(localStorage.link);
	var user = document.getElementById("username").value;
	var pwd = document.getElementById("pwd").value;

	//alert(user+" "+pwd);
            if(user){
                if(pwd){
                    if(user&&pwd){
                        $.ajax({
                                url: localStorage.link+"CMSteelWs/quotation/sale",
                                data: '{"userid":"'+user+'","password":"'+pwd+'"}',
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                type: "POST",
                                cache: false,
                                success: function(result){
                                    console.log(JSON.stringify(result));
                                    if(result.saleCode){
                                        console.log("success");
                                        localStorage.usernames = user;
                                        localStorage.saleCode = result.saleCode;
                                        localStorage.SaleName = result.saleName;
                                        localStorage.activeStatus = result.activeStatus;
                                        
                                        if(localStorage.activeStatus!=1){
                                            alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
                                            window.location='index.php';
                                        }else{
                                            alertify.success("Login สำเร็จ!!");
                                            setTimeout(function(){ window.location='quotation.html'; }, 500); 
                                        }
                                                                         
                                    }else{
                                        alertify.alert("Username หรือ Password ของคุณไม่ถูกต้อง");
                                    }
                                },
                                error: function(err){
                                    console.log(err);
                                }
                            });
                    }
                }else{
                    alertify.alert("ท่านยังไม่ได้กรอก Password");
                    document.getElementById("pwd").focus();
                }
            }else{
                alertify.alert("ท่านยังไม่ได้กรอก username");
            }

		
	
}

