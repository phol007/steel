$( document ).ready(function() {
	if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }else{

	    search_custo(1,5);
	    var sale = localStorage.saleCode+" : "+localStorage.SaleName;
	    document.getElementById("SaleName").value = sale;
	    var d = new Date();
	    document.getElementById("delivery").valueAsDate  = d;
	    document.getElementById("expire").valueAsDate  = d;
	    var Ncus = document.getElementById("customer").value;
	    if(Ncus==""){
	    	document.getElementById("contactCode").disabled = true;
	    	document.getElementById("company").disabled = true;
	    	document.getElementById("location").disabled = true;
	    	document.getElementById("telwork").disabled = true;
	    	document.getElementById("cont").style.display = "none";
	    }
	    if(localStorage.step||localStorage.step=="NQ1"){
	    	localStorage.step="NQ1";
	    }else{
	    	localStorage.step="NQ1";
	    }

	    if(localStorage.stepEQ){
	    	localStorage.stepEQ=null;
	    }
	}

});

function search_custo(acpage,limit){

	var Ncus = document.getElementById("customer").value;
	var type = localStorage.type;
	var data = "";
	//console.log(Ncus);
	
	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/customer",
            data: '{"type":"","search":"'+Ncus+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	data += `<table class="table table-hover" style="text-align:center; margin-top:5%;">
					          <thead>
					            <tr style="background:#2980b9; color:#fff;">
					              <th style="text-align:center;">ลำดับ</th>
					              <th style="text-align:center;">รหัสลูกค้า</th>
					              <th style="text-align:center;">ชื่อลูกค้า</th> 
					              <th style="text-align:center;">เบอร์โทร</th>         
					            </tr>
					          </thead>
					          <tbody>
					    `;
				var cnt = result.listCust.length;
				var start = (acpage*limit)-limit; 
				var end = start+limit;

				if(end>cnt){ end = cnt;}
				/*console.log(limit);
				console.log(end);
				console.log(JSON.stringify(result.listCust));*/

            	if(JSON.stringify(result.listCust)!="[]"){
            		var n = (start+1);
            		for(var i = start; i < end; i++) {
				    var obj = result.listCust[i];
				    	if(obj.custCode==""){obj.custCode="ไม่มีคลัง"}
						data += `<tr onclick="selectcus('`+obj.custCode+`')">
						              <td>`+n+`</td>
						              <td style="text-align:right;">`+obj.custCode+`</td>
						              <td style="text-align:right;">`+obj.custName+`</td>
						              <td style="text-align:left;">`+obj.telePhone+`</td>          
						            </tr>
						        `;
						        n++;
            		}
            	
				
				var page = cnt/5;
				var backpage = acpage-1;
				var nextpage = acpage+1;
				var pages = acpage+3; 
				var list = "";
				//console.log(pages);

				if(start!=0){list += `<a href='javascript:search_custo(`+backpage+`,`+limit+`)'> <b>ย้อนกลับ</b> </a>&nbsp;`;}

				if(acpage >= (Math.ceil(page)-3)){
					//console.log(acpage);
					start = (Math.ceil(page)-3)
					pages = Math.ceil(page);
				}else{
					start = acpage;
				}
					if(start<=0){
						start = 1;
					}
					for(var s = start;s <= pages; s++){
						if(acpage==s){
							list += `<font color='red'>`+s+`</font>&nbsp;`;
						}else{
							list += `<b><a href='javascript:search_custo(`+s+`,`+limit+`)'>`+s+`</a></b>&nbsp;`;
						}						
					}

					if(acpage!=Math.ceil(page)){list += `<a href='javascript:search_custo(`+nextpage+`,`+limit+`)'> <b>ถัดไป</b> </a>&nbsp;`;}
					
					/*console.log(epage);*/
					//console.log(list);
				
				
				document.getElementById("pagecus").innerHTML = "หน้า : " + list;
				document.getElementById("pagecus").style.textAlign  = "center";

            	}else{
            		data += `<tr>
					              <td colspan='5'><h3><font color="red">ไม่มีข้อมูล</font></h3></td>              
					        </tr>`;
					document.getElementById("pagecus").innerHTML = "";
            	}
            	data += `</tbody>
					    </table>`;

				document.getElementById("custolist").innerHTML = data;
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }

        });

}


function search_contact(acpage,limit){

	var ar = document.getElementById("customers").value;
	var ct = document.getElementById("contact").value;
	ar = ar.split(":");

	var arCode = ar[0];

	var type = localStorage.type;
	var data = "";
	//console.log(Ncus);
	
	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/contact",
            data: '{"refCode":"'+arCode+'","search":"'+ct+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	data += `<table class="table table-hover" style="text-align:center; width:100%; margin-top:5%;">
					          <thead>
					            <tr style="background:#2980b9; color:#fff;">
					              <th style="text-align:center;">ลำดับ</th>
					              <th style="text-align:center;">รหัส</th>
					              <th style="text-align:center;">ชื่อ-สกุล</th>      
					              <th style="text-align:center;">เบอร์โทร</th>       
					            </tr>
					          </thead>
					          <tbody>
					    `;
				var cnt = result.listCon.length;
				var start = (acpage*limit)-limit; 
				var end = start+limit;

				if(end>cnt){ end = cnt;}
				/*console.log(limit);
				console.log(end);
				console.log(JSON.stringify(result.listCust));*/

            	if(JSON.stringify(result.listCon)!="[]"){
            		var n = (start+1);
            		for(var i = start; i < end; i++) {
				    var obj = result.listCon[i];
				    	if(obj.code==""){obj.code="ไม่มีคลัง"}
						data += `<tr onclick="selectcont('`+obj.code+`','`+obj.name+`','`+obj.address+`','`+obj.telephone+`')">
						              <td>`+n+`</td>
						              <td style="text-align:right;">`+obj.code+`</td>
						              <td style="text-align:right;">`+obj.name+`</td> 
						              <td style="text-align:left;">`+obj.telephone+`</td>          
						            </tr>
						        `;
						        n++;
            		}
            	
				
				var page = cnt/5;
				var backpage = acpage-1;
				var nextpage = acpage+1;
				var pages = acpage+3; 
				var list = "";
				//console.log(pages);

				if(start!=0){list += `<a href='javascript:search_contact(`+backpage+`,`+limit+`)'> <b>ย้อนกลับ</b> </a>&nbsp;`;}

				if(acpage >= (Math.ceil(page)-3)){
					//console.log(acpage);
					start = (Math.ceil(page)-3)
					pages = Math.ceil(page);
				}else{
					start = acpage;
				}
					if(start<=0){
						start = 1;
					}
					for(var s = start;s <= pages; s++){
						if(acpage==s){
							list += `<font color='red'>`+s+`</font>&nbsp;`;
						}else{
							list += `<b><a href='javascript:search_contact(`+s+`,`+limit+`)'>`+s+`</a></b>&nbsp;`;
						}						
					}

					if(acpage!=Math.ceil(page)){list += `<a href='javascript:search_contact(`+nextpage+`,`+limit+`)'> <b>ถัดไป</b> </a>&nbsp;`;}
					
					/*console.log(epage);*/
					//console.log(list);
				
				
				document.getElementById("pagecont").innerHTML = "หน้า : " + list;
				document.getElementById("pagecont").style.textAlign  = "center";

            	}else{
            		data += `<tr>
					              <td colspan='5'><h3><font color="red">ไม่มีข้อมูล</font></h3></td>              
					        </tr>`;
					document.getElementById("pagecont").innerHTML = "";
            	}
            	data += `</tbody>
					    </table>`;

				document.getElementById("contlist").innerHTML = data;
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }

        });

}

function selectcus(cusCode){
//	console.log(cusCode);
	var type = localStorage.type;
		$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/customerdetails",
            data: '{"type":"","search":"'+cusCode+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){

            	if(result.arCode==""){
            		result.arCode = "ไม่มีข้อมูล";
            	}
            	if(result.telePhone==""){
            		result.telePhone = "ไม่มีข้อมูล";
            	}
            	if(result.contactAddress==""){
            		result.contactAddress = "ไม่มีข้อมูล";
            	}
            	if(result.contactName==""){
            		result.contactName = "ไม่มีข้อมูล";
            	}
            	if(result.contactCode==""){
            		result.contactCode = "ไม่มีข้อมูล";
            	}

            	document.getElementById("customers").value = result.arCode+" : "+result.arName;
            	document.getElementById("contactCode").disabled = false;
		    	document.getElementById("company").disabled = false;
		    	document.getElementById("location").disabled = false;
		    	document.getElementById("telwork").disabled = false;
		    	document.getElementById("cont").style.display = "inline";

		    	search_contact(1,5);
		    	//document.getElementById("qty").autofocus = true;	
            	//document.getElementById("telwork").value = result.telePhone;
            	//document.getElementById("location").value = result.contactAddress;
            	//document.getElementById("company").value = result.contactName;
            	//document.getElementById("companyCode").value = result.contactCode;

            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });

	

	$('#searchCus').modal('hide');
}

function selectcont(code,name,address,tel){
	document.getElementById("contactCode").value = code;
	document.getElementById("company").value = name;
	document.getElementById("location").value = address;
	document.getElementById("telwork").value = tel;

	$('#searchCom').modal('hide');
}

function insert_docno(){
		var sale = localStorage.saleCode;
		
		var billType = document.getElementById("bil").value;
		var taxType = document.getElementById("tax").value;
		var arCode = document.getElementById("customers").value;

		localStorage.arCode = arCode;
		localStorage.saleType = billType;

		var saleCode = document.getElementById("SaleName").value;
		//var departCode = document.getElementById("customers").value;

		var deliveryDay = document.getElementById("delivery").value;
		var expireCredit = document.getElementById("expire").value;

		/*var dateDe = new Date("2016-10-07");
		var dateEx = new Date(expireCredit);

		alert(dateDe+","+dateEx);

		if(dateDe<=dateEx){
			alert("ผ่าน");
		}else{
			alert("ไม่ผ่าน");
		}*/
		/*var date = deliveryDay.split("-");
		var delivery = date[2]-1;
		delivery = date[0]+"-"+date[1]+"-"+delivery;
*/
		var dateDe = new Date(deliveryDay);
		var dateEx = new Date(expireCredit);

	if(dateDe<=dateEx){

		//alert("ผ่าน");
		//var myDiscription1 = document.getElementById("customers").value;
		//var sumOfItemAmount = document.getElementById("customers").value;
		//var discountWord = document.getElementById("customers").value;
		//var discountAmount = document.getElementById("customers").value;
		var contactCode = document.getElementById("contactCode").value;
		var contactName = document.getElementById("company").value;
		var contactAdd = document.getElementById("location").value;
		var contactTel = document.getElementById("telwork").value;
		//var userID = document.getElementById("customers").value;
		

		console.log(contactAdd+"data");
		if(billType&&taxType&&arCode&&saleCode&&deliveryDay&&expireCredit!="ไม่มีข้อมูล"||billType&&taxType&&arCode&&saleCode&&deliveryDay&&expireCredit!=""){
			
			if(contactCode){
				contactCode = contactCode;
			}else{
				contactCode = "";
			}

			if(contactName){
				contactName = contactName;
			}else{
				contactName = "";
			}

			if(contactAdd!=""){
				contactAdd = "";
			}else{
				contactAdd = "";
			}


			if(contactTel){
				contactTel = contactTel;
			}else{
				contactTel = "";
			}

			var dDate = deliveryDay.split("-");
			deliveryDay = dDate[2]+"/"+dDate[1]+"/"+dDate[0];

			var eDate = expireCredit.split("-");
			expireCredit = eDate[2]+"/"+eDate[1]+"/"+eDate[0];

			var arC = arCode.split(":");
			arCode = arC[0];

			saleCode = saleCode.split(":");
			saleCode = saleCode[0];

		    if(contactCode=="ไม่มีข้อมูล"){ contactCode=""; }
		    localStorage.codeinsert = '{"docNo":"","billType":"'+billType+'", "taxType":"'+taxType+'","arCode":"'+arCode+'","saleCode":"'+saleCode+'","departCode":"","deliveryDay":"'+deliveryDay+'","expireCredit":"'+expireCredit+'","myDescription1":"","sumOfItemAmount":"","discountWord":"","discountAmount":"","userID":"'+sale+'","contactCode":"'+contactCode+'","contactName":"'+contactName+'","contactAdd":"'+contactAdd+'","contactTel":"'+contactTel+'","payment":""}';
			console.log('{"docNo":"","billType":"'+billType+'", "taxType":"'+taxType+'","arCode":"'+arCode+'","saleCode":"'+saleCode+'","departCode":"","deliveryDay":"'+deliveryDay+'","expireCredit":"'+expireCredit+'","myDescription1":"","sumOfItemAmount":"","discountWord":"","discountAmount":"","userID":"'+sale+'","contactCode":"'+contactCode+'","contactName":"'+contactName+'","contactAdd":"'+contactAdd+'","contactTel":"'+contactTel+'"}');
			$.ajax({
	            url: localStorage.link+"CMSteelWs/quotation/insert",
	            data: '{"docNo":"","billType":"'+billType+'", "taxType":"'+taxType+'","arCode":"'+arCode+'","saleCode":"'+saleCode+'","departCode":"","deliveryDay":"'+deliveryDay+'","expireCredit":"'+expireCredit+'","myDescription1":"","sumOfItemAmount":"","discountWord":"","discountAmount":"","contactCode":"","userID":"'+sale+'","contactCode":"'+contactCode+'","contactName":"'+contactName+'","contactAdd":"'+contactAdd+'","contactTel":"'+contactTel+'","payment":""}',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            type: "POST",
	            cache: false,
	            success: function(result){

	                  console.log(JSON.stringify(result.docNo));
	                  localStorage.quotadocNo = result.docNo;
	                  window.location = "quotation_type.html";
	            },
	            error: function(err){
	            	console.log(JSON.stringify(err));
	            }
	        });
    	}else{
    		alertify.alert("กรุณากรอกข้อมูลให้ครบ");
    	}
    }else{
    	alertify.alert("วันที่ส่งของต้องน้อยกว่าหรือเท่ากับวันที่ยืนราคา");
    }

}

function check_dateDe(){
    
	var d = new Date();

	d ; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

	d.setDate(d.getDate() - 1);

    var delivery = document.getElementById("delivery").value;

	var date = new Date(delivery);
	if(d>date){
		alertify.alert("ท่านไม่สามารถเลือกวันที่ย้อนหลังได้");	
		document.getElementById("delivery").valueAsDate  = new Date();
	}
	

}

function check_dateEx(){
    
	var d = new Date();

	d ; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)

	d.setDate(d.getDate() - 1);

    var delivery = document.getElementById("expire").value;

	var date = new Date(delivery);
	if(d>date){
		alertify.alert("ท่านไม่สามารถเลือกวันที่ย้อนหลังได้");	
		document.getElementById("expire").valueAsDate  = new Date();
	}
	

}

function CheckNum() {
	console.log(event.keyCode);
	
	if(event.keyCode != 45 && event.keyCode != 44){
		if (event.keyCode < 48 || event.keyCode > 57){
		      event.returnValue = false;
	    }
	}
}

function openCus(){
	$('#searchCus').modal('show');
	//document.getElementById("customer").autofocus = true;	
	$('#searchCus').on('shown.bs.modal', function () {
    $('#customer').focus();
	})
}

function openCom(){
	$('#searchCom').modal('show');
	//document.getElementById("contact").autofocus = true;	
	$('#searchCom').on('shown.bs.modal', function () {
    $('#contact').focus();
	})
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