function save_setting(){
	//localStorage.link = document.getElementById('link_api').value;
	//localStorage.steel_per1 = document.getElementById('steel_per1').value;
	//localStorage.steel_per2 = document.getElementById('steel_per2').value;
	$.ajax({  
    type: 'POST',  
    url: 'setting.php', 
    data: { url: document.getElementById('link_api').value,
    		sp1: document.getElementById('steel_per1').value,
    		sp2: document.getElementById('steel_per2').value
     },
    success: function(response) {
        console.log(response);
        alertify.success('บันทึกสำเร็จ !!');
    }
});
localStorage.link = document.getElementById('link_api').value;
localStorage.steel_per1 = document.getElementById('steel_per1').value;
localStorage.steel_per2 = document.getElementById('steel_per2').value;
}


function show_setting(){
if(localStorage.usernames == "sa" || localStorage.usernames == "admin"){
	console.log(localStorage.link);
	document.getElementById('link_api').value = localStorage.link;
	document.getElementById('steel_per1').value = localStorage.steel_per1;
	document.getElementById('steel_per2').value = localStorage.steel_per2;
	}else{
		alert("user นี้ไม่สามารถเข้าเมนูนี้ได้ !!");
		window.history.back();

	}
}