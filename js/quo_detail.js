$( document ).ready(function() {
	console.log(localStorage.quotadocNo);
	if(localStorage.activeStatus!=1){
		alertify.alert("ท่านไม่มีสิทธิ์เข้าใช้งานระบบนี้");
		window.location='index.php';
	}else{	
	order_list();
	qty();
	btdnone();
	}
});

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

function showModal(itemCode,whCode,unitCode){

	$('#myModal').on('shown.bs.modal', function () {
    	$('#qty').focus();
	});

	var detail = "";
	if(whCode=="ไม่มีคลัง"){ whCode="";}
	console.log('{"whCode":"'+whCode+'","itemCode":"'+itemCode+'","unitCode":"'+unitCode+'"}');
	$.ajax({
            url: "http://nopadolais.dyndns.org:8080/CMSteelWs/quotation/stock",
			data: '{"whCode":"'+whCode+'","itemCode":"'+itemCode+'","unitCode":"'+unitCode+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            		var pri = result.salePrice.toFixed(2);
					         //alert(Cnum)
					pri = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            	if(result.itemCode!=null){
            		document.getElementById("unitCode").value = unitCode;
            		detail += `<label>รหัสสินค้า : `+result.itemCode+`</label><br/>
            				  <label>สินค้า : `+result.itemName+`</label><br/>
            				  <label>น้ำหนัก : `+result.itemWeight+`</label><br/>
            				  <label>ราคา : `+pri+` บาท </label><br/>
            				  <label>หน่วยที่ขาย : `+unitCode+`</label><br/>
            				  <label>ลดทุน : 0 </label><br/>
            				  `;

            		detail += `
					          <div width='100%'>
					          <table  class="table table-hover" style="text-align:center; width:100%;">
					          <thead><tr style="background:#2980b9; color:#fff;"><th style="text-align:center;">คลัง</th>
					          			<th style="text-align:center;">ชั้นเก็บ</th>
					          			<th style="text-align:center;">จำนวน</th>
					          </tr></thead><tbody>`;

						            $.each(result.listStk, function(key, val) {
						            	if(val['whCode']!=null){
	                                    	detail += `<tr>
				                                        	<td>`+val['whCode']+`</td>
				                                        	<td>`+val['shelfCode']+`</td>
				                                        	<td>`+val['qty']+` `+val['unitCode']+`</td>
				                                       </tr>`;

				                            document.getElementById("whCode").value = val['whCode'];
					          				document.getElementById("shelfCode").value = val['shelfCode'];
					          				

				                        }else{
				                        	detail += `<tr>
				                        					<td colspan="3">ไม่มีข้อมูล</td>
				                        			   </tr>
				                        			  `;
				                        			  return false;
				                        }

                                    });

					detail += `</tbody></table></div>`;
					
					          document.getElementById("itemdetail").innerHTML = detail;
					          document.getElementById("itemCode").value = result.itemCode;
					          document.getElementById("price").value = result.salePrice;	
					          document.getElementById("qty").autofocus = true;			          
					          $('#myModal').modal('show');
            	}else{
            		alertify.alert("สินค้ามีข้อมูลไม่ถูกต้อง!!");
            	}
            	
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });

	
}

function insert_item(){
	var docNo = localStorage.quotadocNo;
	var itemC = document.getElementById("itemCode").value;
	var price = document.getElementById("price").value;	
	var whCode = document.getElementById("whCode").value;
	var shCode = document.getElementById("shelfCode").value;
	var unit = document.getElementById("unitCode").value;
	var qty = document.getElementById("qty").value;

	if(whCode=="ไม่มีคลัง"){ whCode="";}
	console.log('{"docNo":"'+docNo+'","itemCode":"'+itemC+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":"'+price+'","discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"0"}');

	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/manageitem",
            data: '{"docNo":"'+docNo+'","itemCode":"'+itemC+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":"'+price+'","discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"0"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
                  console.log(JSON.stringify(result));
                  document.getElementById("qty").value="";
                  order_list();
                  alertify.alert("แก้ไขเรียบร้อยแล้ว");
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });

}

function order_list(){
	var docNo = localStorage.quotadocNo;
	var itemCode = "";
	console.log(docNo);
	var data = "";
	$.ajax({
	            url: localStorage.link+"CMSteelWs/quotation/searchdetails",
	            data: '{"type":"","search":"'+docNo+'"}',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            type: "POST",
	            cache: false,
	            success: function(result){                  
	                  if(result.listItem){
						//console.log(JSON.stringify(result));
						data += `  <table class="table table-hover" style="text-align:center;">
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
						 var condetail = "";
						 console.log(result.isCancel);
					 	 if(result.isCancel==1){document.getElementById("pdf").disabled=true;}
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
						        }else if(result.isConfirm==1){
						        	data +=`<tr style="color:#0cdb29;">
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

						 	}else{
						 		data +=`<tr>
							              <td colspan='5'>ยังไม่มีรายการ</td>           
							            </tr>`;
						 	}
						 	n++;
						 });
						 if(itemCode){
						 	var pri = result.sumOfItemAmount.toFixed(2);
						         //alert(Cnum)
						        sum_price = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

						    if(result.isCancel==1){
						    	data += `<tr style="background:#dcdbdb; color:red;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;">`+sum_price+`</td>
						            </tr>`;
						    }else if(result.isConfirm==1){
						    	data += `<tr style="background:#dcdbdb; color:green;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;">`+sum_price+`</td>
						            </tr>`;

						    }else{
						    	data += `<tr style="background:#dcdbdb; color:#000;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;"><b>`+sum_price+`<b></td>
						            </tr>`;
						    }

						 }

						 data += `</tbody>
								  </table>        
								`;

						if(result.docDate!=null){
							var date = result.docDate.split(" ");
							date = date[0].split("-");
							date = date[2]+"/"+date[1]+"/"+date[0];
						}else{
							date = "ไม่มีข้อมูล";
						}

						if(result.arCode!=null){
							result.arCode = result.arCode;
							result.arname = result.arname;
						}else{
							result.arCode = "ไม่มีข้อมูล";
							result.arname = "";
						}

						if(result.saleCode!=null){
							result.saleCode = result.saleCode;
							result.salename = result.salename;
						}else{
							result.saleCode = "ไม่มีข้อมูล";
							result.salename = "";
						}

						 condetail += `วันที่ : `+date+`
										<br>ชื่อลูกค้า : `+result.arCode+` `+result.arname+`
										<br>พนักงาน : `+result.saleCode+` `+result.salename+`
										`;
						if(result.isConfirm==1){
							document.getElementById("bt").style.display = "none";
						}
						document.getElementById("quodetail").innerHTML = data;
						document.getElementById("docNo").innerHTML = docNo;	
						document.getElementById("condetail").style.textAlign = "left";
						document.getElementById("condetail").innerHTML = condetail;	

	                  }else{
	                  	console.log("ยังไม่มีรายการ");
	                  	alertify.alert("ไม่มีข้อมูล");
	                  	window.location = "quotation.html";
	                  }
	            },
	            error: function(err){
	            	console.log(JSON.stringify(err));
	            }
	        });
}


function order_listCC(){
	var docNo = localStorage.quotadocNo;
	var itemCode = "";
	console.log(docNo);
	var data = "";
	$.ajax({
	            url: localStorage.link+"CMSteelWs/quotation/searchdetails",
	            data: '{"type":"","search":"'+docNo+'"}',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            type: "POST",
	            cache: false,
	            success: function(result){                  
	                  if(result.listItem){
						//console.log(JSON.stringify(result));
						data += `  <table class="table table-hover" style="text-align:center;">
						          <thead>
						            <tr style="background:#ea6153; color:#fff;">
						              <th>ลำดับ</th>
						              <th style="text-align:center;">รายการ</th>
						              <th>จำนวน/หน่วย</th>
						              <th>ราคา</th> 
						              <th style="text-align:center;">ราคารวม</th> 
						              <th></th>            
						            </tr>
						          </thead>
						          <tbody>`;
						 var n=1;
						 var sum_price = 0;
						 var sum = 0;
						 console.log(result.isCancel);
					 	 if(result.isCancel==1){document.getElementById("pdf").disabled=true;}
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
						              <td></td>
							            </tr>`;
						        }else if(result.isConfirm==1){
						        	data +=`<tr style="color:#0cdb29;">
							              <td>`+n+`</td>
							              <td style="text-align:left;">`+val['itemName']+`</td>
							              <td>`+val['qty']+` `+val['unitCode']+`</td>
							              <td style="text-align:right;">`+pri+`</td>  
							              <td style="text-align:right;">`+sum+`</td>
							            </tr>`;
						        }else{
						        	data +=`<tr>
							            		<td>`+n+`</td>
									            <td style="text-align:left;">`+val['itemName']+`</td>
									            <td>`+val['qty']+` `+val['unitCode']+`</td>
									            <td style="text-align:right;">`+pri+`</td>  
									            <td style="text-align:right;">`+sum+`</td>
								              <td class="del">
								              <a href="#" 
								              onclick="cancel('`+docNo+`','`+itemCode+`','`+val['whCode']+`','`+val['shelfCode']+`','`+val['qty']+`','`+val['price']+`','`+val['unitCode']+`')"
								              ><img src="images/bin.png"></a></td>  
								            </tr>`;
						        }

						 	}else{
						 		data +=`<tr>
							              <td colspan='5'>ยังไม่มีรายการ</td>           
							            </tr>`;
						 	}
						 	n++;
						 });
						 if(itemCode){
						 	var pri = result.sumOfItemAmount.toFixed(2);
						         //alert(Cnum)
						        sum_price = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

						 	if(result.isCancel==1){
						    	data += `<tr style="background:#dcdbdb; color:red;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;">`+sum_price+`</td>
						            </tr>`;
						    }else if(result.isConfirm==1){
						    	data += `<tr style="background:#dcdbdb; color:green;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;">`+sum_price+`</td>
						            </tr>`;
						    }else{
						    	data += `<tr style="background:#dcdbdb; color:#000;">
						              <td><b>รวม</b></td>
						              <td colspan="3"></td>
						              <td style="text-align:right;"><b>`+sum_price+`<b></td>
						            </tr>`;
						    }
						 }

						 data += `</tbody>
								  </table>        
								`;

						document.getElementById("quodetail").innerHTML = data;
						document.getElementById("docNo").innerHTML = docNo;		

	                  }else{
	                  	console.log("ยังไม่มีรายการ");
	                  	alertify.alert("ไม่มีข้อมูล");
	                  	window.location = "quotation.html";
	                  }
	            },
	            error: function(err){
	            	console.log(JSON.stringify(err));
	            }
	        });
}

function cancel(docNo,itemCode,whCode,shCode,qty,price,unit){
	alertify.confirm("ต้องการลบรายการนี้หรือไม่ ??", function (e) {
	    if (e) {    
			if(whCode=="ไม่มีคลัง"){ whCode="";}
			console.log('{"docNo":"'+docNo+'","itemCode":"'+itemCode+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":"'+price+'","discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"1"}');

			$.ajax({
		            url: localStorage.link+"CMSteelWs/quotation/manageitem",
		            data: '{"docNo":"'+docNo+'","itemCode":"'+itemCode+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":"'+price+'","discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"1"}',
		            contentType: "application/json; charset=utf-8",
		            dataType: "json",
		            type: "POST",
		            cache: false,
		            success: function(result){
		                  console.log(JSON.stringify(result));
		                  document.getElementById("qty").value="";
		                  order_listCC();
		                  alertify.error("ลบข้อมูลเรียบร้อย");
		            },
		            error: function(err){
		            	console.log(JSON.stringify(err));
		            }
		        });
		}
	}); 
}

function qty(){

	var qty = document.getElementById("qty").value;
	qty = parseInt(qty);
	if(qty<=0){
		document.getElementById("bt_in").disabled = true;
	}else if(document.getElementById("qty").value==""){
		document.getElementById("bt_in").disabled = true;
	}else{
		document.getElementById("bt_in").disabled = false;
	}

	if (event.keyCode < 48 || event.keyCode > 57){
		      event.returnValue = false;
	}
}

var body = document.querySelector('body');
body.onkeydown = function () {
 	if($('#myModal').hasClass('in')==true){
 		if(event.keyCode==13){
 			document.getElementById("bt_in").click();
 		}
 	}
}

function pdf(){
	//window.location = "quotation_pdf.php?docNo="+localStorage.quotadocNo;
	window.open(
		  'quotation_pdf.php?docNo='+localStorage.quotadocNo+'&link='+localStorage.link,
		  '_blank' // <- This is what makes it open in a new window.
	);
}

function btd(){
	order_listCC(1,10);
	 document.getElementById("bt").innerHTML = `&nbsp;<button class="btn btn-primary btn-sm" onclick="btdnone()">เสร็จสิน</button>`;
}

function btdnone(){
	order_list(1,10);
	document.getElementById("bt").innerHTML = `&nbsp;<button class="btn btn-primary btn-sm" onclick="btd()">ยกเลิกรายการ</button>`;
}
