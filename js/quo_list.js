$( document ).ready(function() {
	if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }else{
		localStorage.quotadocNo = "";
		search_quo(1,10);
		localStorage.stepEQ=null;
		localStorage.step=null;
		localStorage.quotadocNo = null;
		localStorage.type = null;
		localStorage.saleType = null;
	}
	//btdnone(1,10);
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

function search_quo(acpage,limit) {
	var Nitem = document.getElementById("docNo").value;
	//var type = localStorage.type;
	var data = "";

	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/listquotation",
            data: '{"type":"","search":"'+Nitem+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	data += `<table class="table table-hover res" style="text-align:center;">
					          <thead>
					            <tr style="background:#2980b9; color:#fff;">
					              <th style="text-align:center;">ลำดับ</th>
					              <th style="text-align:center;">เลขที่</th>
					              <th style="text-align:center;">ลูกค้า</th>
					              <th style="text-align:center;">พนักงาน</th>
					              <th style="text-align:center;">วัน/เดือน/ปี</th>  
					              <th style="text-align:center;">ราคา</th>              
					            </tr>
					          </thead>
					          <tbody>
					    `;
				var cnt = result.listQuo.length;
				var start = (acpage*limit)-limit; 
				var end = start+limit;

				if(end>cnt){ end = cnt;}
				/*console.log(limit);
				console.log(end);
				console.log(JSON.stringify(result.listItem));*/

            	if(JSON.stringify(result.listQuo)!="[]"){
            		var n = (start+1);
            		for(var i = start; i < end; i++) {
				    var obj = result.listQuo[i];
				    	if(obj.whCode==""){obj.whCode="ไม่มีคลัง"}

				    	var date = obj.docDate.split(" ");
				    	date = date[0].split("-");

				    	var day = date[2];
				    	var month = date[1];
				    	var year = date[0];

				    	obj.docDate = day+'/'+month+'/'+year;

				    	var sum = obj.totalAmount.toFixed(2);
					         //alert(Cnum)
					        obj.totalAmount = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					    if(obj.isCancel==1){
						    data += `<tr style=" color:red;" onclick="detail('`+obj.docNo+`')">
							        <td>`+n+`</td>
							        <td style="text-align:left;">`+obj.docNo+`</td>
							        <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
							        <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
							        <td style="text-align:center;">`+obj.docDate+`</td>
							        <td style="text-align:right;">`+obj.totalAmount+`</td>               
							        </tr>
							    `;
					    }else if(obj.isConfirm==1){
					    	data += `<tr style=" color:#0cdb29;" onclick="detail('`+obj.docNo+`')">
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+obj.docNo+`</td>
						              <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
						              <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
						              <td style="text-align:center;">`+obj.docDate+`</td>
						              <td style="text-align:right;">`+obj.totalAmount+`</td>
						              <td style="display:none;" class="de"><button class="btn btn-danger" onclick="cancel('`+obj.docNo+`')">Delete</button></td>               
						            </tr>
						        `;
					    }else{
					    	data += `<tr onclick="Edetail('`+obj.docNo+`','`+obj.groupItem+`','`+obj.saleType+`')">
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+obj.docNo+`</td>
						              <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
						              <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
						              <td style="text-align:center;">`+obj.docDate+`</td>
						              <td style="text-align:right;">`+obj.totalAmount+`</td>
						              <td style="display:none;" class="de"><button class="btn btn-danger" onclick="cancel('`+obj.docNo+`')">Delete</button></td>               
						            </tr>
						        `;
					    }
						
						        n++;
            		}
            	
				
				var page = cnt/10;
				var backpage = acpage-1;
				var nextpage = acpage+1;
				var pages = acpage+8; 
				var list = "";
				//console.log(pages);
				list += `<ul class="pagination"><li><a href="#">หน้า :</a></li>`;
				if(start!=0){list += `<li><a href='javascript:search_quo(`+backpage+`,`+limit+`)'> <b>ย้อนกลับ</b> </a></li>`;}

				if(acpage >= (Math.ceil(page)-8)){
					//console.log(acpage);
					start = (Math.ceil(page)-8)
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
							list += `<li><a href='javascript:search_quo(`+s+`,`+limit+`)'>`+s+`</a></li>`;
						}						
						var bt = `<button class="btn btn-primary" onclick="search_quoCC(`+acpage+`,`+limit+`)">ยกเลิกทั้งใบ</button>`;	
					}
					if(acpage!=Math.ceil(page)){list += `<li><a href='javascript:search_quo(`+nextpage+`,`+limit+`)'> <b>ถัดไป</b> </a></li>`;}
					list += `</ul>`;
					/*console.log(epage);*/
					//console.log(list);
				
				document.getElementById("pages").innerHTML = list;
				document.getElementById("pages").style.textAlign  = "center";
				console.log(bt);
				document.getElementById("bt").innerHTML = bt;

            	}else{
            		data += `<tr>
					              <td colspan='5'><h3><font color="red">ไม่มีข้อมูล</font></h3></td>              
					        </tr>`;
					document.getElementById("pages").innerHTML = "";
            	}
            	data += `</tbody>
					    </table>`;

				document.getElementById("quolist").innerHTML = data;
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
    });
}

function detail(docNo){
	localStorage.quotadocNo = docNo;
	window.location = "quotation_listdetail.html";
}

function Edetail(docNo,type,saleType){
	localStorage.quotadocNo = docNo;
	localStorage.type = type;
	localStorage.saleType = saleType;
	if(localStorage.stepEQ){
		localStorage.stepEQ = 1;
	}else{
		localStorage.stepEQ = 1;
	}
	console.log(docNo+","+type+","+saleType);
	window.location = "quotation_view.html";
}

function cancel(docNo){
	alertify.confirm("ต้องการลบรายการนี้หรือไม่ ??", function (e) {
	    if (e) {     
			$.ajax({
	            url: localStorage.link+"CMSteelWs/quotation/cancel",
	            data: '{"type":"","search":"'+docNo+'"}',
	            contentType: "application/json; charset=utf-8",
	            dataType: "json",
	            type: "POST",
	            cache: false,
	            success: function(result){
	            	  search_quoCC(1,10);
	            },
	            error: function (err){
	            	alertify.alert("ไม่สามารถเชื่อต่อ เครือข่ายข้อมูลได้");
	            }
	        });
		}
	});
}



function search_quoCC(acpage,limit) {
	var Nitem = document.getElementById("docNo").value;
	//var type = localStorage.type;
	var data = "";

	$.ajax({
            url: localStorage.link+"CMSteelWs/quotation/listquotation",
            data: '{"type":"","search":"'+Nitem+'"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result){
            	//console.log(JSON.stringify(result));
            	data += `<table class="table table-hover" style="text-align:center;">
					          <thead>
					            <tr style="background:#ea6153; color:#fff;">
					              <th style="text-align:center;">ลำดับ</th>
					              <th style="text-align:center;">เลขที่ใบเสนอขาย</th>
					              <th style="text-align:center;">ลูกค้า</th>
					              <th style="text-align:center;">พนักงาน</th>
					              <th style="text-align:center;">วัน/เดือน/ปี</th>  
					              <th style="text-align:center;">ราคา</th>
					              <th></th>              
					            </tr>
					          </thead>
					          <tbody>
					    `;
				var cnt = result.listQuo.length;
				var start = (acpage*limit)-limit; 
				var end = start+limit;

				if(end>cnt){ end = cnt;}
				/*console.log(limit);
				console.log(end);
				console.log(JSON.stringify(result.listItem));*/

            	if(JSON.stringify(result.listQuo)!="[]"){
            		var n = (start+1);
            		for(var i = start; i < end; i++) {
				    var obj = result.listQuo[i];
				    	if(obj.whCode==""){obj.whCode="ไม่มีคลัง"}

				    	var date = obj.docDate.split(" ");
				    	date = date[0].split("-");

				    	var day = date[2];
				    	var month = date[1];
				    	var year = date[0];

				    	obj.docDate = day+'/'+month+'/'+year;

				    	var sum = obj.totalAmount.toFixed(2);
					         //alert(Cnum)
					        obj.totalAmount = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					    if(obj.isCancel==1){
						    data += `<tr style=" color:red;">
							        <td>`+n+`</td>
							        <td style="text-align:left;">`+obj.docNo+`</td>
							        <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
							        <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
							        <td style="text-align:center;">`+obj.docDate+`</td>
							        <td style="text-align:right;">`+obj.totalAmount+`</td>
							        <td></td>               
							        </tr>
							    `;
					    }else if(obj.isConfirm==1){
					    	data += `<tr style=" color:#0cdb29;" onclick="detail('`+obj.docNo+`')">
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+obj.docNo+`</td>
						              <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
						              <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
						              <td style="text-align:center;">`+obj.docDate+`</td>
						              <td style="text-align:right;">`+obj.totalAmount+`</td>
						              <td style="display:none;" class="de"><button class="btn btn-danger" onclick="cancel('`+obj.docNo+`')">Delete</button></td>               
						            </tr>
						        `;
					    }else{
					    	data += `<tr>
						              <td>`+n+`</td>
						              <td style="text-align:left;">`+obj.docNo+`</td>
						              <td style="text-align:left;">`+obj.arCode+` : `+obj.arName+`</td>
						              <td style="text-align:left;">`+obj.saleCode+' : '+obj.saleName+`</td>
						              <td style="text-align:center;">`+obj.docDate+`</td>
						              <td style="text-align:right;">`+obj.totalAmount+`</td>
						              <td><a href="#" onclick="cancel('`+obj.docNo+`')"><img src="images/bin.png"></a></td>               
						            </tr>
						        `;
					    }
						
						        n++;
            		}
            	
				
				var page = cnt/10;
				var backpage = acpage-1;
				var nextpage = acpage+1;
				var pages = acpage+8; 
				var list = "";
				//console.log(pages);
				list += `<ul class="pagination"><li><a href="#">หน้า :</a></li>`;
				if(start!=0){list += `<li><a href='javascript:search_quoCC(`+backpage+`,`+limit+`)'> <b>ย้อนกลับ</b> </a></li>`;}

				if(acpage >= (Math.ceil(page)-8)){
					//console.log(acpage);
					start = (Math.ceil(page)-8)
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
							list += `<li><a href='javascript:search_quoCC(`+s+`,`+limit+`)'>`+s+`</a></li>`;
						}
						 var bt = `<button class="btn btn-primary" onclick="search_quo(`+acpage+`,`+limit+`)">เสร็จสิน</button>`;						
					}
					if(acpage!=Math.ceil(page)){list += `<li><a href='javascript:search_quoCC(`+nextpage+`,`+limit+`)'> <b>ถัดไป</b> </a></li>`;}
					list += `</ul>`;
					/*console.log(epage);*/
					//console.log(list);
				
				document.getElementById("pages").innerHTML = list;
				document.getElementById("pages").style.textAlign  = "center";
				document.getElementById("bt").innerHTML = bt;

            	}else{
            		data += `<tr>
					              <td colspan='5'><h3><font color="red">ไม่มีข้อมูล</font></h3></td>              
					        </tr>`;
					document.getElementById("pages").innerHTML = "";
            	}
            	data += `</tbody>
					    </table>`;

				document.getElementById("quolist").innerHTML = data;
            },
            error: function(err){
            	console.log(JSON.stringify(err));
            }
    });
}
