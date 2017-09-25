$( document ).ready(function() {
	if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }else{
	    search_item(1,5);
	    btdnone();
	    document.getElementById("quoDocNo").innerHTML = "เลขที่ "+localStorage.quotadocNo;
	    order_list();



	    if(localStorage.step=="NQ2"||localStorage.step=="NQ3"){
	    	localStorage.step="NQ3";
	    }else if(localStorage.stepEQ==1){
	    	document.getElementById("next").value = "ย้อนกลับ";
	    	//document.getElementById("backEQ").innerHTML = `<button class="btn btn-default btn-xs" onclick="window.location='quotation.html'">ย้อนกลับ</button>`;
	    	document.getElementById("Epdf").innerHTML = `<button class="btn btn-default btn-sm" onclick="pdf();">Export PDF</button>`;
	    }else{
			alertify.alert("ท่านทำรายการไม่ถูกต้อง!!");
			window.location = "quotation.html";
		}

	    console.log(localStorage.quotadocNo);
	    console.log(localStorage.type);
	    console.log(localStorage.step);
	    console.log(localStorage.stepEQ);
	}

});

function search_item(acpage,limit) {
	var Nitem = document.getElementById("item").value;
	var type = localStorage.type;
	var saleType = localStorage.saleType;
	var data = "";

	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/item",
            data: '{"type":"'+type+'","search":"'+Nitem+'","saleType":"'+saleType+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	data += `<table class="table table-hover" style="text-align:center;">
					          <thead>
					            <tr style="background:#2980b9; color:#fff;">
					              <th style="text-align:center;">ลำดับ</th>
					              <th style="text-align:center;">รายการ</th>
					              <th>น้ำหนัก</th>
					              <th>จำนวน/หน่วย</th>
					              <th>ราคา</th>              
					            </tr>
					          </thead>
					          <tbody>
					    `;
				var cnt = result.listItem.length;
				var start = (acpage*limit)-limit; 
				var end = start+limit;

				if(end>cnt){ end = cnt;}
				/*console.log(limit);
				console.log(end);
				console.log(JSON.stringify(result.listItem));*/

            	if(JSON.stringify(result.listItem)!="[]"){
            		var n = (start+1);
            		for(var i = start; i < end; i++) {
				    var obj = result.listItem[i];
				    	if(obj.whCode==""){obj.whCode="ไม่มีคลัง"}

				    		var pri = obj.salePrice.toFixed(2);
					         //alert(Cnum)
					        obj.salePrice = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

						data += `<tr onclick="showModal('`+obj.itemCode+`','`+obj.whCode+`','`+obj.unitCode+`')">
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+obj.itemName+`</td>
						              <td>`+obj.itemWeight+`</td>
						              <td>`+obj.stockQty+' '+obj.unitCode+`</td>
						              <td style="text-align:right;">`+obj.salePrice+`</td>              
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
				list += `<ul class="pagination pagination-sm"><li><a href="#">หน้า :</a></li>`;
				if(start!=0){list += `<li><a href='javascript:search_item(`+backpage+`,`+limit+`)'> <b>ย้อนกลับ</b> </a></li>`;}

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
							list += `<li class="active"><a href="#">`+s+`</a></li>`;
						}else{
							list += `<li><a href='javascript:search_item(`+s+`,`+limit+`)'>`+s+`</a></li>`;
						}						
					}
					if(acpage!=Math.ceil(page)){list += `<li><a href='javascript:search_item(`+nextpage+`,`+limit+`)'> <b>ถัดไป</b> </a></li>`;}
					list += `</ul>`;
					/*console.log(epage);*/
					//console.log(list);
				

				document.getElementById("pages").innerHTML = list;
				document.getElementById("pages").style.textAlign  = "center";

            	}else{
            		data += `<tr>
					              <td colspan='5'><h3><font color="red">ไม่มีข้อมูล</font></h3></td>              
					        </tr>`;
					document.getElementById("pages").innerHTML = "";
            	}
            	data += `</tbody>
					    </table>`;

				document.getElementById("searchitem").innerHTML = data;
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
    });
}

function showModal(itemCode,whCode,unitCode,qty){
	$('#myModal').on('shown.bs.modal', function () {
    $('#qty').focus();
	})  
	var detail = "";
	var saleType = localStorage.saleType;
	if(qty){
		qty = qty;
	}else{
		qty = 1;
	}

	if(whCode=="ไม่มีคลัง"){ whCode="";}
	console.log('{"whCode":"'+whCode+'","itemCode":"'+itemCode+'","unitCode":"'+unitCode+'","saleType":"'+saleType+'"}');
	if(document.getElementById("qty").value==""){document.getElementById("bt_in").disabled = true;}
	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/stock",
			data: '{"whCode":"'+whCode+'","itemCode":"'+itemCode+'","unitCode":"'+unitCode+'","saleType":"'+saleType+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	if(result.itemCode!=null){

					 		var pri = result.salePrice.toFixed(2);
					         //alert(Cnum)
					        pri = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					//perprice(result.salePrice);
					//perprice(price)
            		document.getElementById("unitCode").value = unitCode;
            		detail += `<label>รหัสสินค้า : `+result.itemCode+`</label><br/>
            				  <label>สินค้า : `+result.itemName+`</label><br/>
            				  <label>น้ำหนัก : `+result.itemWeight+`</label><br/>
            				  <label>ราคาขาย : `+pri+` บาท </label><br/>
            				  <label>ต้องการขายได้กำไร : <input type="text" id="kr" value="0" style="width: 50px; border-radius:5px; padding:1%; border:1px solid #d2d4d4;" onkeyup="perprice()" onkeypress="inper()"> % 
            				  &nbsp; เป็นราคา <input type="text" style="text-align:right; width: 80px; border-radius:5px; padding:1%; border:1px solid #d2d4d4;" id="pri" onchange="chprice(`+result.salePrice.toFixed(2)+`)" value="`+pri+`" onkeypress="inper()"> บาท</label><br/>
            				  <label>หน่วยที่ขาย : `+unitCode+`</label><br/>
            				  <label>ลดทุน : 0 </label><br/>
            				  `;

            		detail += `
					          <div width='100%'>
					          <table  class="table table-hover" style="text-align:center; width:100%;">
					          <thead><tr style="background:#2980b9; color:#fff;">
					          			<th style="text-align:center;">คลัง</th>
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
					          document.getElementById("qty").value = qty;         
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

function perprice(price){
	
		var pp = "";
		var per = document.getElementById("kr").value;
		price = document.getElementById("price").value;
		if(per!=0||per!=""){
			pp = parseInt(price)+(parseInt(price)*parseInt(per)/100);
			pp = pp.toFixed(2);
			document.getElementById("price").value =pp;
			//pp = pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}else{
			pp = price;
			document.getElementById("price").value =pp;
		}

		document.getElementById("pri").value = pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");		
		document.getElementById("price").value = pp;		
		console.log(pp);
	
}

function inper(){
	console.log(event.keyCode);
	if (event.keyCode < 48 || event.keyCode > 57){
		if(event.keyCode == 46){
		  event.returnValue = true;
		}else{
		  event.returnValue = false;
		}
	}
}

function chprice(price){
	var pri = document.getElementById("pri").value;
	pri = parseInt(pri);
	if(pri<price){
		document.getElementById("pri").value = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		alertify.alert("ราคาต้องไม่น้อยกว่าราคาขาย !!");
	}else{
		var per = (parseInt(pri)-parseInt(price))/100;
		pri = pri.toFixed(2);
		document.getElementById("pri").value = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		document.getElementById("price").value = pri;
		document.getElementById("kr").value = per.toFixed(2);
	}
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
	//console.log('{"docNo":"'+docNo+'","itemCode":"'+itemC+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":'+price+',"discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"0"}');

	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/manageitem",
            data: '{"docNo":"'+docNo+'","itemCode":"'+itemC+'","whCode":"'+whCode+'", "shelfCode":"'+shCode+'","qty":"'+qty+'","price":'+price+',"discountWord":"","discountAmount":"0","unitCode":"'+unit+'","isCancel":"0"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
                  console.log(JSON.stringify(result));
                  document.getElementById("qty").value="";
                  order_list();
                  btdnone();
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });

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
					data += `  <table class="table table-hover" style="text-align:center;">
					          <thead>
					            <tr style="background:#27ae60; color:#fff;">
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
						 		data +=`<tr onclick="showModal('`+itemCode+`','`+val['whCode']+`','`+val['unitCode']+`','`+val['qty']+`')">
							              <td>`+n+`</td>
							              <td style="text-align:left;">`+val['itemName']+`</td>
							              <td>`+val['qty']+` `+val['unitCode']+`</td>
							              <td style="text-align:right;">`+pri+`</td>  
							              <td style="text-align:right;">`+sum+`</td>
							            </tr>`;
							}
							
						    document.getElementById("next").disabled = false;
					 	}else{
					 		data +=`<tr>
						              <td colspan='5' style="text-align:center; color:red;"><h3>ยังไม่มีรายการ</h3></td>           
						            </tr>`;
						    if(localStorage.stepEQ==1){
						    	document.getElementById("next").disabled = false;
						    }else{
						    	document.getElementById("next").disabled = true;
						    }
						    
					 	}
					 	n++;
					 });
					 if(itemCode){
					 	var pri = result.sumOfItemAmount.toFixed(2);
					         //alert(Cnum)
					        sum_price = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					 	data += `<tr style="background:#dcdbdb; color:#000;">
					              <td><b>รวม</b></td>
					              <td colspan="3"></td>
					              <td style="text-align:right;">`+sum_price+`</td>
					            </tr>`;
					 }

					 data += `</tbody>
							  </table>        
							`;
					if(localStorage.stepEQ==1){
						if(result.docDate!=null){
								var date = result.docDate.split(" ");
								date = date[0].split("-");
								date = date[2]+"/"+date[1]+"/"+date[0];
							}else{
								date = "ไม่มีข้อมูล";
							}
							
						var cus = `
									<div style="float:left; width:30%; text-align:right;"><b>วันที่ : </b></div><div style="float:left; padding-left:2%;">`+date+`</div>
											<br style="clear:both;"><div style="float:left; width:30%; text-align:right;"><b>ชื่อลูกค้า : </b></div><div style="float:left; padding-left:2%;">`+result.arCode+` `+result.arname+`</div>
											<br style="clear:both;"><div style="float:left; width:30%; text-align:right;"><b>พนักงาน : </b></div><div style="float:left; padding-left:2%;">`+result.saleCode+` `+result.salename+`</div>
											
									`;
									if(result.contactAddress){result.contactAddress}else{ result.contactAddress = `ไม่ได้ระบุ`;}
									if(result.contactTel){result.contactTel}else{ result.contactTel = `-`;}
						var con = `
									<div style="float:left; width:30%; text-align:right;"><b>วันที่ : </b></div><div style="float:left; padding-left:2%;">`+date+`</div>
											<br style="clear:both;"><div style="float:left; width:30%; text-align:right;"><b>ชื่อผู้ติดต่อ : </b></div><div style="float:left; padding-left:2%;">`+result.contactCode+` `+result.contactName+`</div>
											<br style="clear:both;"><div style="float:left; width:30%; text-align:right;"><b>สถานที่ขนส่ง : </b></div><div style="float:left; padding-left:2%;">
											`+result.contactAddress+` โทร. `+result.contactTel+`</div>
											
									`;
						document.getElementById("cuslist").innerHTML = cus;
						document.getElementById("conlist").innerHTML = con;
					}
					document.getElementById("listorder").innerHTML = data;		

                  }else{
                  	console.log("ยังไม่มีรายการ");
                  }
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
        });
}

function order_listCC(){
	
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
					        }else{
					        	data +=`<tr>
						            		<td>`+n+`</td>
								            <td style="text-align:left;">`+val['itemName']+`</td>
								            <td>`+val['qty']+` `+val['unitCode']+`</td>
								            <td style="text-align:right;">`+pri+`</td>  
								            <td style="text-align:right;">`+sum+`</td>
							              <td class="del">
							             <a href="#" onclick="cencel('`+docNo+`','`+itemCode+`','`+val['whCode']+`','`+val['shelfCode']+`','`+val['qty']+`','`+val['price']+`','`+val['unitCode']+`')"
							              ><img src="images/bin.png"></a></td>  
							            </tr>`;
					        }
					 		
						    document.getElementById("next").disabled = false;
					 	}else{
					 		data +=`<tr>
						              <td colspan='5'>ยังไม่มีรายการ</td>           
						            </tr>`;
						    document.getElementById("next").disabled = true;
					 	}
					 	n++;
					 });
					 if(itemCode){
					 	var pri = result.sumOfItemAmount.toFixed(2);
					         //alert(Cnum)
					        sum_price = pri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

					 	data += `<tr style="background:#dcdbdb; color:#000;">
					              <td><b>รวม</b></td>
					              <td colspan="3"></td>
					              <td style="text-align:right;">`+sum_price+`</td>
					              <td></td>
					            </tr>`;
					 }

					 data += `</tbody>
							  </table>        
							`;
					if(localStorage.stepEQ==1){
						if(result.docDate!=null){
								var date = result.docDate.split(" ");
								date = date[0].split("-");
								date = date[2]+"/"+date[1]+"/"+date[0];
							}else{
								date = "ไม่มีข้อมูล";
							}
							
						var cus = `
									<b>วันที่ : </b>`+date+`
											<br><b>ชื่อลูกค้า : </b>`+result.arCode+` `+result.arname+`
											<br><b>พนักงาน : </b>`+result.saleCode+` `+result.salename+`
											
									`;
						var con = `
									<b>วันที่ : </b>`+date+`
											<br><b>ชื่อผู้ติดต่อ : </b>`+result.contactCode+` `+result.contactName+`
											<br><b>พนักงาน : </b>`+result.saleCode+` `+result.salename+`
											
									`;
						document.getElementById("cuslist").innerHTML = cus;
						document.getElementById("conlist").innerHTML = con;
					}
					document.getElementById("listorder").innerHTML = data;		

                  }else{
                  	console.log("ยังไม่มีรายการ");
                  }
            },
            error: function(err){
            	console.log(JSON.stringify(err));
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

function btd(){
	order_listCC();
	document.getElementById("delete").innerHTML = `<button class="btn btn-default btn-sm" onclick="btdnone()">เสร็จสิน</button>`;
}

function btdnone(){
	order_list();
	document.getElementById("delete").innerHTML = `<button class="btn btn-default btn-sm" onclick="btd()">ยกเลิกรายการ</button>`;
}

function cencel(docNo,itemCode,whCode,shCode,qty,price,unit){
	alertify.confirm("ต้องการยกเลิกรายการสินค้านี้หรือไม่ ??", function (e) {
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
		                  alertify.error("ยกเลิกข้อมูลเรียบร้อย");
		            },
		            error: function(err){
		            	console.log(JSON.stringify(err));
		            }
		        });
		}
	});

}

function next(){
	if(localStorage.stepEQ==1){
		localStorage.stepEQ=null;
		alertify.success("ท่านได้ทำการแก้ไขข้อมูลรายการสินค้าในใบเสนอราคาเลขที่ "+localStorage.quotadocNo+" เรียบร้อยแล้ว!!");
		setTimeout(function(){ window.location='quotation.html'; }, 2000);
	}else{
		window.location='quotation_sum.html';
	}
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

function pdf(){
	//window.location = "quotation_pdf.php?docNo="+localStorage.quotadocNo;
	window.open(
		  'quotation_pdf.php?docNo='+localStorage.quotadocNo+'&link='+localStorage.link,
		  '_blank' // <- This is what makes it open in a new window.
	);
}