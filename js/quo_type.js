$( document ).ready(function() {
	if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }else{
		document.getElementById("quoDocNo").innerHTML = "เลขที่ "+localStorage.quotadocNo;
		console.log(localStorage.codeinsert);
		if(localStorage.step=="NQ1"||localStorage.step=="NQ2"){
			localStorage.step="NQ2";
		}else{
			alertify.alert("ท่านทำรายการไม่ถูกต้อง!!");
			window.location = "quotation.html";
		}

		console.log(localStorage.step);
	}
});

function send_type(type){
	localStorage.type = type;
	window.location = "quotation_view.html";
	console.log(localStorage.type);
}

function logout(){
    // confirm dialog
    alertify.confirm("ท่านต้องการออกจากระบบ ใช่หรือไม่ ?", function (e) {
        if (e) {
            window.location="index.php";
        } else {
            // user clicked "cancel"
        }
    });
}