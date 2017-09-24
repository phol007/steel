$( document ).ready(function() {
    if(localStorage.activeStatus!=1){
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location='index.php';
    }
});

function open_detailreport3(){
	document.getElementById('id03').style.display='block'
	
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

function selecttype_stock(a){
var type = "";
	if(a){var type = a.value;
	}else{
		var s_types = document.getElementById("select_typeitem");
		type = s_types.options[s_types.selectedIndex].value;
	}


var search = "";
var begin_item = "";
var end_item = "";

if(type=="0"){

document.getElementById("code").style.display = "block";
document.getElementById("begin_code").style.display = "none";
document.getElementById("end_code").style.display = "none";
search = document.getElementById("select_code").value;
begin_code = "";
end_code = "";
}else if(type=="1"){
document.getElementById("code").style.display = "none";
document.getElementById("begin_code").style.display = "block";
document.getElementById("end_code").style.display = "block";

search = "";
begin_code = document.getElementById("select_begincode").value;
end_code = document.getElementById("select_endcode").value;
}
//alert('{"pType":"'+type+'","pSearch":"'+search+'","pBegItem":"'+begin_code+'","pEndItem":"'+end_code+'"}');
$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/reportitemstock",
                        data: '{"pType":"'+type+'","pSearch":"'+search+'","pBegItem":"'+begin_code+'","pEndItem":"'+end_code+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        console.log(result);
						    

                    	var count = result.listItem.length;
                    	var detail_stock = "";
                    	if(count==0){
						detail_stock ="<h2 style='text-align:center;'>ไม่มีข้อมูล กรุณากรอกข้อมูลให้ถูกต้อง !!</h2>"
                    	}else{


						
						var sum_sale = 0;
						var sum_cost = 0;
						var sum_profit = 0;
                        detail_stock += '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable res" id="stock">';
                        detail_stock +='<tr class="header_table"><th>ลำดับ</th><th>รายการ</th><th>น้ำหนัก</th><th>จำนวน</th><th>หน่วย</th><th>ราคา/หน่วย</th><th>จอง</th></tr>';
                        for(var i = 0;i<count;i++){
                        detail_stock += "<tr><td>"+(i+1)+"</td><td>"+result.listItem[i].itemCode+" "+result.listItem[i].itemName+"</td><td>"+result.listItem[i].itemWeight+"</td><td>"+result.listItem[i].qty+"</td><td>"+result.listItem[i].unitCode+"</td><td>"+result.listItem[i].salePrice+"</td><td>"+result.listItem[i].resQty+"</td></tr>";
                        	sum_sale += result.listItem[i].amount;
                        	sum_cost += result.listItem[i].sumOfCost;
                        	sum_profit += result.listItem[i].profit;
                    	}
                    	//sum_sale = sum_sale.toFixed(2);
                    	//sum_cost = sum_cost.toFixed(2);
                    	//sum_profit = sum_profit.toFixed(2);

                    	//detail_stock += '<tr style="font-weight: bold;"><td colspan="7"></td><td>ยอดรวม</td><td>'+sum_sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td></td></tr>';
                    	detail_stock += '</table>';
   						}

                    	document.getElementById("show_stockdetail").innerHTML = detail_stock;

                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });
}

function search_item(){
	var item = document.getElementById("item_search").value;
  console.log(localStorage.link+"CMSteelWs/quotation/item");

$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/item",
                        data: '{"type":"2","search":"'+item+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        console.log(result);
						    

                    	var count = result.listItem.length;
                    	var itemlist = "";
                    	if(count==0){
						itemlist ="<p>ไม่มีข้อมูล!!</p>"
                    	}else{
                            itemlist += `<table class="table table-hover res" style="text-align:center; width:100%;">
                              <thead>
                                <tr class="header_table">
                                  <th style="text-align:center;">ที่</th>
                                  <th style="text-align:center;">รหัสสินค้า</th>
                                  <th style="text-align:center;">ชื่อสินค้า</th>  
                                  <th style="text-align:center;">หน่วยนับ</th>           
                                </tr>
                              </thead>
                              <tbody>
                        `;
                        for(var i = 0;i<count;i++){
                        itemlist += `<tr onclick="additem1('`+result.listItem[i].itemCode+`')">
                                      <td>`+(i+1)+`</td>
                                      <td style="text-align:left;">`+result.listItem[i].itemCode+`</td>
                                      <td>`+result.listItem[i].itemName+`</td> 
                                      <td>`+result.listItem[i].unitCode+`</td>            
                                    </tr>`;
                    	}
                        itemlist +='</table>';
                        }
                    	document.getElementById("show_srarchitem1").innerHTML = itemlist;                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });

}
function search_item2(){
    var item = document.getElementById("item_search2").value;

$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/item",
                        data: '{"type":"2","search":"'+item+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        console.log(result);
                            

                        var count = result.listItem.length;
                        var itemlist = "";
                        if(count==0){
                        itemlist ="<p>ไม่มีข้อมูล!!</p>"
                        }else{
                            itemlist += `<table class="table table-hover res" style="text-align:center; width:100%;">
                              <thead>
                                <tr class="header_table">
                                  <th style="text-align:center;">ที่</th>
                                  <th style="text-align:center;">รหัสสินค้า</th>
                                  <th style="text-align:center;">ชื่อสินค้า</th>  
                                  <th style="text-align:center;">หน่วยนับ</th>           
                                </tr>
                              </thead>
                              <tbody>
                        `;
                        for(var i = 0;i<count;i++){
                        itemlist += `<tr onclick="additem2('`+result.listItem[i].itemCode+`')">
                                      <td>`+(i+1)+`</td>
                                      <td style="text-align:left;">`+result.listItem[i].itemCode+`</td>
                                      <td>`+result.listItem[i].itemName+`</td> 
                                      <td>`+result.listItem[i].unitCode+`</td>            
                                    </tr>`;
                        }
                        itemlist +='</table>';
                        }
                        document.getElementById("show_srarchitem2").innerHTML = itemlist;                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });

}
function search_item3(){
    var item = document.getElementById("item_search3").value;

$.ajax({
                        url: localStorage.link+"CMSteelWs/quotation/item",
                        data: '{"type":"2","search":"'+item+'"}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "POST",
                        cache: false,
                        success: function(result){
                        console.log(result);
                            

                        var count = result.listItem.length;
                        var itemlist = "";
                        if(count==0){
                        itemlist ="<p>ไม่มีข้อมูล!!</p>"
                        }else{
                            itemlist += `<table class="table table-hover res" style="text-align:center; width:100%;">
                              <thead>
                                <tr class="header_table">
                                  <th style="text-align:center;">ที่</th>
                                  <th style="text-align:center;">รหัสสินค้า</th>
                                  <th style="text-align:center;">ชื่อสินค้า</th>  
                                  <th style="text-align:center;">หน่วยนับ</th>           
                                </tr>
                              </thead>
                              <tbody>
                        `;
                        for(var i = 0;i<count;i++){
                        itemlist += `<tr onclick="additem3('`+result.listItem[i].itemCode+`')">
                                      <td>`+(i+1)+`</td>
                                      <td style="text-align:left;">`+result.listItem[i].itemCode+`</td>
                                      <td>`+result.listItem[i].itemName+`</td> 
                                      <td>`+result.listItem[i].unitCode+`</td>            
                                    </tr>`;
                        }
                        itemlist +='</table>';
                        }
                        document.getElementById("show_srarchitem3").innerHTML = itemlist;                        
                        },
                        error: function (error){
                        alertify.alert(error);
                        }
                        });

}

function additem1(s){
document.getElementById("select_code").value = s;
$('#searchitem1').modal('hide');
}
function additem2(b){
document.getElementById("select_begincode").value = b;
$('#searchitem2').modal('hide');
}
function additem3(e){
document.getElementById("select_endcode").value = e;
$('#searchitem3').modal('hide');
}

$(document).ready(function() {
$('#searchitem1').on('shown.bs.modal', function () {
    $('#item_search').focus();
})
$('#searchitem2').on('shown.bs.modal', function () {
    $('#item_search2').focus();
})  
$('#searchitem3').on('shown.bs.modal', function () {
    $('#item_search3').focus();
})  
});