$( document ).ready(function() {
	if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }else{
		document.getElementById("quoDocNo").innerHTML = "เลขที่ "+localStorage.quotadocNo;
	    order_list();
	    console.log(localStorage.arCode);
	    document.getElementById("des").value = null;
	    if(localStorage.step=="NQ3"||localStorage.step=="NQ4"){
	    	localStorage.step="NQ4";
	    }else if(localStorage.stepEQ){
			alertify.alert("ท่านทำรายการไม่ถูกต้อง!!");
			window.location = "quotation.html";
		}
		console.log(localStorage.step);
	}

});

function update(){
	var docNo = localStorage.quotadocNo;
	var sale = localStorage.saleCode;
	var arCode = localStorage.arCode;
	arCode = arCode.split(":");
	arCode = arCode[0];
	var des = document.getElementById("des").value;
	var depart = $('input[name=optradio]:checked').val();
	var sumof = document.getElementById("totalprice").value;
	console.log('{"docNo":"'+docNo+'","billType":"", "taxType":"","arCode":"'+arCode+'","saleCode":"'+sale+'","departCode":"","deliveryDay":"","expireCredit":"","myDescription1":"'+des+'","sumOfItemAmount":"'+sumof+'","discountWord":"","discountAmount":"","userID":"'+sale+'","payment":"'+depart+'"}');
	
	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/insert",
            data: '{"docNo":"'+docNo+'","billType":"", "taxType":"","arCode":"'+arCode+'","saleCode":"'+sale+'","departCode":"","deliveryDay":"","expireCredit":"","myDescription1":"'+des+'","sumOfItemAmount":"'+sumof+'","discountWord":"","discountAmount":"","userID":"'+sale+'","payment":"'+depart+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){

                  console.log(JSON.stringify(result.docNo));
                  localStorage.quotadocNo = result.docNo;
                  window.open(
						  'quotation_pdf.php?docNo='+localStorage.quotadocNo+'&link='+localStorage.link,
						  '_blank' // <- This is what makes it open in a new window.
				  );

                  
                  localStorage.quotadocNo = null;
                  localStorage.type = null;
                  localStorage.arCode = null;
                  localStorage.saleType = null;
                  document.getElementById("des").value = null;
                  localStorage.codeinsert = null;
                  localStorage.step=null;
                  
                  alertify.success("บันทึกข้อมูลเรียบร้อย");

                  setTimeout(function(){window.location = "quotation_form.html"; }, 1000);

            },
            error: function(err){
            	console.log(JSON.stringify(err));
            	if(err.status==400){
            		alertify.alert("มีการกรอกข้อมูลไม่ถูกต้อง");
            	}else{
            		alertify.alert("พบปัญหาในการเชื่อต่อเครือข่าย กรุณาตรวจสอบเครือข่ายของท่าน");
            	}
            	

            }
        });

}

function pdf(){
	//window.location = "quotation_pdf.php?docNo="+localStorage.quotadocNo;
	/*window.open(
		  'quotation_pdf.php?docNo='+localStorage.quotadocNo+'&link='+localStorage.link,
		  '_blank' // <- This is what makes it open in a new window.
	);*/
	window.open("quotation_pdf.php?docNo="+localStorage.quotadocNo+"&link="+localStorage.link);
}

function order_list(){
	var docNo = localStorage.quotadocNo;
	var type = localStorage.type;
	var data = "";
	var itemCode = "";
	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/searchdetails",
            data: '{"type":"'+type+'","search":"'+docNo+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){                  
                  if(result.listItem){
					//console.log(JSON.stringify(result));
					data += `  <table class="table" style="text-align:center;">
					          <thead>
					            <tr style="background:#2980b9; color:#fff;">
					              <th>ลำดับ</th>
					              <th style="text-align:center;">รายการ</th>
					              <th>จำนวน/หน่วย</th>
					              <th>ราคา</th> 
					              <th style="text-align:center;">ราคารวม</th>             
					            </tr>
					          </thead>
					          <tbody>`;
					 var n=1;
					 var sum_price = 0;
					 var sum = 0;
					 $.each(result.listItem, function(key, val) {
					 	if(val['itemCode']){
					 		itemCode = val['itemCode'];
					 		sum = val['qty']*val['price'];

					 		var pri = val['price'].toFixed(2);
					         //alert(Cnum)
					        pri = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					        var sum = sum.toFixed(2);
					         //alert(Cnum)
					        sum = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


					 		
					        if(val['isCancelSub']==1){
					        	data +=`<tr style="color:red;">
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+val['itemName']+`</td>
						              <td>`+val['qty']+` `+val['unitCode']+`</td>
						              <td style="text-align:right;">`+pri+`</td>  
						              <td style="text-align:right;">`+sum+`</td>
						            </tr>`;
					        }else{
						 		data +=`<tr onclick="showModal('`+itemCode+`','`+val['whCode']+`','`+val['unitCode']+`')">
							              <td>`+n+`</td>
							              <td style="text-align:left;">`+val['itemName']+`</td>
							              <td>`+val['qty']+` `+val['unitCode']+`</td>
							              <td style="text-align:right;">`+pri+`</td>  
							              <td style="text-align:right;">`+sum+`</td>
							            </tr>`;
							}
							//sum_price += val['price']; 
					 	}else{
					 		data +=`<tr>
						              <td colspan='5'>ยังไม่มีรายการ</td>           
						            </tr>`;
					 	}
					 	n++;
					 });
					 document.getElementById("totalprice").value = result.beforeTaxAmount;
					 if(itemCode){
					 	var pri = result.beforeTaxAmount.toFixed(2);
					         //alert(Cnum)
					        sum_price = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					    var tax = result.taxAmount.toFixed(2);
					         //alert(Cnum)
					        tax_price = tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					    var total = result.totalAmount.toFixed(2);
					         //alert(Cnum)
					        total_price = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					        
					 	data += `<tr style="border-top:2px solid black; background:#dcdbdb; color:#000;">
					              <td colspan="4" align="right"><b>รวม</b></td>
					              <td style="text-align:right;">`+sum_price+`</td>
					            </tr>`;
					    data += `<tr style="border-top:2px solid #585858; border-bottom:2px solid #585858; background:#dcdbdb; color:#000;"">
					              <td colspan="4" align="right"><b>จำนวนภาษีมูลค่าเพิ่ม</b></td>
					              <td style="text-align:right;">`+tax_price+`</td>
					            </tr>`;
					    data += `<tr style="border-bottom:2px solid black; background:#dcdbdb; color:#000;"">
					              <td colspan="4" align="right"><b>จำนวนเงินทั้งสิ้น</b></td>
					              <td style="text-align:right;">`+total_price+`</td>
					            </tr>`;
					 }

					 data += `</tbody>
							  </table>        
							`;

					document.getElementById("listorder").innerHTML = data;		
					console.log(sum_price);

                  }else{
                  	console.log("ยังไม่มีรายการ");
                  }
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });
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