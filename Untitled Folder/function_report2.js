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
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd
}
if(mm<10){
    mm='0'+mm
}
var today = yyyy+'-'+mm+'-'+dd;

function defult_value2(){
document.getElementById("select_date").value = today;
document.getElementById("select_begindate").value = today;
document.getElementById("select_enddate").value = today;

selecttype_sale();
}


function selecttype_sale(s_type){

	if(s_type){var type = s_type.value;
	}else{
		var s_types = document.getElementById("select_type");
		type = s_types.options[s_types.selectedIndex].value;
	}

		if(type=="0"){

			document.getElementById("select_date").style.display = "block";

			document.getElementById("select_begindate").style.display = "none";
			document.getElementById("select_enddate").style.display = "none";
			
			var begin_date = "";
			var end_date = "";
			var date_date = document.getElementById("select_date").value;

			var res = date_date.split("-");
			date_date = res[2]+"-"+res[1]+"-"+res[0];


		}else if(type=="1"){
			document.getElementById("select_begindate").style.display = "block";
			document.getElementById("select_enddate").style.display = "block";

			document.getElementById("select_date").style.display = "none";

			var begin_date = document.getElementById("select_begindate").value;
			var end_date = document.getElementById("select_enddate").value;
			var date_date = "";

			var resb = begin_date.split("-");
			begin_date = resb[2]+"-"+resb[1]+"-"+resb[0];

			var rese = end_date.split("-");
			end_date = rese[2]+"-"+rese[1]+"-"+rese[0];

			
		}

        var pItemGroup = document.getElementById("itemgroup");
        ItemGroup = pItemGroup.options[pItemGroup.selectedIndex].value;

        var pBillType = document.getElementById("billtype");
        BillType = pBillType.options[pBillType.selectedIndex].value;

        console.log(BillType+" "+ItemGroup);


		var paramiter = '{"pType":"'+type+'","pDocDate":"'+date_date+'","pBeginDate":"'+begin_date+'","pEndDate":"'+end_date+'","pSaleCode":"","pArCode":"","pItemGroup":"'+ItemGroup+'","pBillType":"'+BillType+'"}';

		var pdf = "<a href='report2_pdf.php?para="+paramiter+"'  target='_blank' class='btn btn-success' style='float:right; margin-right:30px;'>pdf</a>";
		document.getElementById("show_pdf").innerHTML = pdf;
	
        console.log('{"pType":"'+type+'","pDocDate":"'+date_date+'","pBeginDate":"'+begin_date+'","pEndDate":"'+end_date+'","pSaleCode":"","pArCode":"","pItemGroup":"'+ItemGroup+'","pBillType":"'+BillType+'"}');
		$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/reportsale",
                        data: '{"pType":"'+type+'","pDocDate":"'+date_date+'","pBeginDate":"'+begin_date+'","pEndDate":"'+end_date+'","pSaleCode":"","pArCode":"","pItemGroup":"'+ItemGroup+'","pBillType":"'+BillType+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        //console.log(result);
						
                        //console.log(JSON.stringify(groupedData));

                    	var count = result.listData.length;
                    	var detail_sale = "";
                    	if(count==0){
						detail_sale ="<h2 style='text-align:center;'>ไม่มีข้อมูล กรุณาเลือกวันที่ต้องการอีกครั้ง !!</h2>"
                    	}else{


						
						var sum_sale = 0;
						var sum_cost = 0;
						var sum_profit = 0;
                        var dcNo = "";  
                        var r = 0;
                       

                        detail_sale += '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable res" id="testt">';
                        detail_sale +='<tr class="header_table"><th>ลำดับ</th><th>เลขที่เอกสาร</th><th>ชื่อลูกค้า</th><th>ยอดขาย</th><th>กำไร</th><th>ชื่อเซล</th><th>ผู้ออกบิล</th><th>สถานที่ส่งของ</th></tr>';
                        var dcNo ="";
                        var dcNo1 =[];
                        var a =0;
                        var co =1;
                        var cc =0;
                        for(var i = 0;i<count;i++){
                         
                         
                         var docNo ="";
                         
                         if(a!=count){
                            //alert(dcNo +" , "+ result.listData[i].docNo)
                         
                         if(dcNo == result.listData[i].docNo){
                                    docNo = "";
                                    cc ="";
                               }else{
                                    docNo = result.listData[i].docNo;
                                    cc=co;
                                    co++;
                               }
                         dcNo = result.listData[a].docNo;
                         
                           }
                          a++;
                          console.log(result.listData[i].returnMoney);
                          if(result.listData[i].returnMoney>0){
                                detail_sale += '<tr style="color:red;">';
                          }else{
                            detail_sale += '<tr>';
                          }
                            /*   
                            for(var c = 0;c<count;c++){
                                var dcNo = result.listData[i].docNo;  
                               if(result.listData[c].docNo == result.listData[i].docNo){
                                    dcNo = result.listData[c].docNo;
                               }else{
                                    dcNo = "";
                               }
                            }*/

                        detail_sale += '<td>'+cc+'</td><td>'+docNo+'</td><td>'+result.listData[i].arName+'</td><td>'+result.listData[i].totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' บาท</td><td>'+result.listData[i].profit+'</td><td>'+result.listData[i].saleName+'</td><td>'+result.listData[i].creatorCode+'</td><td>'+result.listData[i].address+''+result.listData[i].creatorName+'</td></tr>';
                        	sum_sale += result.listData[i].amount;
                        	sum_cost += result.listData[i].sumOfCost;
                        	sum_profit += result.listData[i].profit;
                    	
                        }
                    	sum_sale = sum_sale.toFixed(2);
                    	sum_cost = sum_cost.toFixed(2);
                    	sum_profit = sum_profit.toFixed(2);

                    	//detail_sale += '<tr  class="header_table" style="font-weight: bold;"><td colspan="7"></td><td>ยอดรวม</td><td>'+sum_sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td></tr>';
                    	detail_sale += '</table>';
   						}

                    	document.getElementById("show_detail").innerHTML = detail_sale;

                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });


}

function report_detail2(d_no){
	$('#detail').modal();
	//alert(d_no);
	$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/reportsale",
                        data: '{"pType":"'+type+'","pDocDate":"'+date_date+'","pBeginDate":"'+begin_date+'","pEndDate":"'+end_date+'","pSaleCode":"","pArCode":"","pItemGroup":"'+ItemGroup+'","pBillType":"'+BillType+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        console.log(result);
						    

                    	var count = result.listData.length;
                    	var sale_detail = "";
                    	if(count==0){
						sale_detail ="<h2 style='text-align:center;'>ไม่มีข้อมูล กรุณากรอกข้อมูลให้ถูกต้อง !!</h2>"
                    	}else{


						

                        sale_detail += '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable" id="stock">';
                        sale_detail +='<tr><th>ลำดับ</th><th>เลขที่เอกสาร</th><th>ชื่อลูกค้า</th><th>ยอดขาย</th><th>กำไร</th><th>ชื่อเซล</th><th>ผู้ออกบิล</th><th>สถานที่ส่งของ</th></tr>';
                        for(var i = 0;i<count;i++){
                        sale_detail += "<tr><td>"+(i+1)+"</td><td>"+result.listData[i].docNo+"</td><td>"+result.listData[i].arName+"</td><td>"+result.listData[i].totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"</td><td>"+result.listData[i].profit+"</td><td>"+result.listData[i].saleName+"</td><td>"+result.listData[i].creatorCode+"</td><td>"+result.listData[i].address+"</td></tr>";
                    	}
                    	//sum_sale = sum_sale.toFixed(2);
                    	//sum_cost = sum_cost.toFixed(2);
                    	//sum_profit = sum_profit.toFixed(2);

                    	//sale_detail += '<tr style="font-weight: bold;"><td colspan="7"></td><td>ยอดรวม</td><td>'+sum_sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td></td></tr>';
                    	sale_detail += '</table>';
   						}

                    	document.getElementById("show_saledetail").innerHTML = sale_detail;

                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });
}
