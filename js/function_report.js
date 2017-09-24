$(document).ready(function() {
    if (localStorage.activeStatus != 1) {
        alertify.alert("ท่านไม่มีสิทธ์เข้าใช้งานระบบนี้");
        window.location = 'index.php';
    }
});

function logout() {
    // confirm dialog
    alertify.confirm("ท่านต้องการออกจากระบบ ใช่หรือไม่ ?", function(e) {
        if (e) {
            window.location = "index.php";
        } else {
            // user clicked "cancel"
        }
    });
}
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
var today = yyyy + '-' + mm + '-' + dd;

function defult_value() {
    document.getElementById("select_date").value = today;
    document.getElementById("select_begindate").value = today;
    document.getElementById("select_enddate").value = today;

    selecttype_sale();
}


function selecttype_sale(s_type) {

    if (s_type) {
        var type = s_type.value;
    } else {
        var s_types = document.getElementById("select_type");
        type = s_types.options[s_types.selectedIndex].value;
    }

    if (type == "0") {

        document.getElementById("select_date").style.display = "block";

        document.getElementById("select_begindate").style.display = "none";
        document.getElementById("select_enddate").style.display = "none";

        var begin_date = "";
        var end_date = "";
        var date_date = document.getElementById("select_date").value;

        var res = date_date.split("-");
        date_date = res[2] + "-" + res[1] + "-" + res[0];


    } else if (type == "1") {
        document.getElementById("select_begindate").style.display = "block";
        document.getElementById("select_enddate").style.display = "block";

        document.getElementById("select_date").style.display = "none";

        var begin_date = document.getElementById("select_begindate").value;
        var end_date = document.getElementById("select_enddate").value;
        var date_date = "";

        var resb = begin_date.split("-");
        begin_date = resb[2] + "-" + resb[1] + "-" + resb[0];

        var rese = end_date.split("-");
        end_date = rese[2] + "-" + rese[1] + "-" + rese[0];


    }
    var salecode = document.getElementById("salecode").value;
    var ARcode = document.getElementById("arcode").value;
    var paramiter = '{"pType":"' + type + '","pDocDate":"' + date_date + '","pBeginDate":"' + begin_date + '","pEndDate":"' + end_date + '","pSaleCode":"' + salecode + '","pArCode":"' + ARcode + '"}';

    var pdf = "<a href='report1_pdf.php?para=" + paramiter + "'  target='_blank' class='btn btn-success' style='float:right; margin-right:30px;'>pdf</a>";
    document.getElementById("show_pdf").innerHTML = pdf;

    console.log('{"pType":"' + type + '","pDocDate":"' + date_date + '","pBeginDate":"' + begin_date + '","pEndDate":"' + end_date + '","pSaleCode":"' + salecode + '","pArCode":"' + ARcode + '"}');
    $.ajax({
        url: localStorage.link + "CMSteelWs/quotation/reportsaledetails",
        data: '{"pType":"' + type + '","pDocDate":"' + date_date + '","pBeginDate":"' + begin_date + '","pEndDate":"' + end_date + '","pSaleCode":"' + salecode + '","pArCode":"' + ARcode + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        cache: false,
        success: function(result) {
            //console.log(result);

            //console.log(JSON.stringify(groupedData));

            var count = result.listData.length;
            var detail_sale = "";
            if (count == 0) {
                detail_sale = "<h2 style='text-align:center;'>ไม่มีข้อมูล กรุณาเลือกวันที่ต้องการอีกครั้ง !!</h2>"
            } else {



                var sum_sale = 0;
                var sum_cost = 0;
                var sum_profit = 0;
                var dcNo = "";
                var r = 0;


                detail_sale += '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable  res" id="testt">';
                //detail_sale +='<tr class="header_table"><th>ลำดับ</th><th>เลขที่เอกสาร</th><th>รายการ</th><th>จำนวน</th><th>หน่วย</th><th>ราคา/หน่วย</th><th>ทุน/หน่วย</th><th>กำไร/หน่วย</th><th>ยอดขาย</th><th>ยอดทุน</th><th>ยอดกำไร</th><th>%กำไร</th></tr>';
                var dcNo = "";
                var dcNo1 = [];
                var a = 0;
                var co = 1;
                var coo = 1;
                var cc = 0;
                var sum1 = 0;
                var sum2 = 0;
                var sum3 = 0;
                for (var i = 0; i < count; i++) {

                    detail_sale += '<tr style="background-color: #39b3d7;">';
                    detail_sale += '<td colspan="2"> เลขที่ใบเสร็จ : <b>' + result.listData[i].docNo + '</b></td>';
                    detail_sale += '<td colspan="3">' + result.listData[i].docName + ' (' + result.listData[i].creditDay + ')</td>';
                    detail_sale += '<td colspan="5"> พนักงานขาย : ' + result.listData[i].saleName + '</td>';
                    detail_sale += '</tr>';
                    detail_sale += '<tr>';
                    detail_sale += '<td> ชื่อลูกค้า : <b>' + result.listData[i].arName + '</b></td>';
                    detail_sale += '<td>จำนวน</td>';
                    detail_sale += '<td>หน่วย</td>';
                    detail_sale += '<td>ราคาขาย/หน่วย</td>';
                    detail_sale += '<td>ทุน</td>';
                    detail_sale += '<td>ยอดขาย</td>';
                    detail_sale += '<td>ทุน</td>';
                    detail_sale += '<td>กำไร</td>';
                    detail_sale += '<td> % กำไร</td>';
                    detail_sale += '</tr>';
                    var countitem = result.listData[i].listItem.length;
                    for (var j = 0; j < countitem; j++) {
                        detail_sale += '<tr onclick=\'cost_popup("' + result.listData[i].docNo + '","' + result.listData[i].listItem[j].itemCode + '")\'>';
                        //'+"'"+result.listData[i].docNo+"','"+result.listData[i].listItem[j].itemCode+"','"+result.listData[i].listItem[j].itemName+"'"+'
                        detail_sale += '<td>' + (j + 1) + "&nbsp;&nbsp;" + result.listData[i].listItem[j].itemName + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].qty + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].unitCode + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].averageCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].sumOfCost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
                        detail_sale += '<td>' + (result.listData[i].listItem[j].qty * result.listData[i].listItem[j].profit).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>';
                        detail_sale += '<td>' + result.listData[i].listItem[j].percentPF + '%</td>';
                        detail_sale += '</tr>';
                    }
                    detail_sale += '<tr>';
                    detail_sale += '<td colspan="5">รวม</td>';
                    detail_sale += '<td>' + result.listData[i].totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                    detail_sale += '<td>' + result.listData[i].sumOfCostAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                    detail_sale += '<td>' + result.listData[i].sumProfitAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                    detail_sale += '<td>&nbsp;</td>';
                    detail_sale += '</tr>';

                    sum1 += result.listData[i].totalAmount;
                    sum2 += result.listData[i].sumOfCostAmount;
                    sum3 += result.listData[i].sumProfitAmount;
                }
                detail_sale += '<tr style="background-color: #39b3d7;">';
                detail_sale += '<td colspan="5">&nbsp;</td>';
                detail_sale += '<td>' + sum1.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                detail_sale += '<td>' + sum2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                detail_sale += '<td>' + sum3.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</b></td>';
                detail_sale += '<td>&nbsp;</td>';
                detail_sale += '</tr>';
                detail_sale += '</table>';

            }

            document.getElementById("show_detail").innerHTML = detail_sale;
            document.getElementById("arcode").value = "";
            document.getElementById("salecode").value = "";


        },
        error: function(error) {
            alertify.alert(error);
        }
    });


}

function cost_popup(dcNo, itemcode) {
    if (localStorage.usernames == "sa" || localStorage.usernames == "admin") {
        console.log(dcNo + "/" + itemcode);
        document.getElementById("doc_cost_insert").value = dcNo;
        document.getElementById("code_cost_insert").value = itemcode;
        $.ajax({
            url: localStorage.link + "CMSteelWs/quotation/item",
            data: '{"type":"2","search":"' + itemcode + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result) {
                console.log(result);
                var count = result.listItem.length;
                document.getElementById("name_cost_insert").value = result.listItem[0].itemName
                document.getElementById("unit_cost_insert").value = result.listItem[0].unitCode

                $('#cost_insert').modal('show');
            },
            error: function(error) {
                alertify.alert(error);
            }
        });
    }else{
    
    }
}

function submit_cost() {
    var dcNo = document.getElementById("doc_cost_insert").value;
    var itemcode = document.getElementById("code_cost_insert").value;
    var itemname = document.getElementById("name_cost_insert").value;
    var unit = document.getElementById("unit_cost_insert").value;
    var cost = document.getElementById("costInsert").value;
    if (cost == "") {
        alert("กรุณากรอกข้อมูลต้นทุนให้ถูกต้อง");
    } else {
        $.ajax({
            url: localStorage.link + "CMSteelWs/quotation/costofarea",
            data: '{"docno":"' + dcNo + '","itemcode":"' + itemcode + '","unitcode":"' + unit + '", "costofarea":"' + cost + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(result) {
                console.log(result);
                if (result.processDesc = "Successful") {
                    alertify.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                    document.getElementById("costInsert").value = "";
                    $('#cost_insert').modal('hide');
                }
            },
            error: function(error) {
                alertify.alert(error);
            }
        });
    }
}

function report_detail(d_no) {
    $('#detail').modal();
    //alert(d_no);
    $.ajax({
        url: localStorage.link + "CMSteelWs/quotation/invitem",
        data: '{"type":"0","search":"' + d_no + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        cache: false,
        success: function(result) {
            console.log(result);


            var count = result.listItem.length;
            var sale_detail = "";
            if (count == 0) {
                sale_detail = "<h2 style='text-align:center;'>ไม่มีข้อมูล กรุณากรอกข้อมูลให้ถูกต้อง !!</h2>"
            } else {




                sale_detail += '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable" id="stock">';
                sale_detail += '<tr><th>ลำดับ</th><th>รายการ</th><th>คลัง/ชั้นเก็บ</th><th>จำนวน</th><th>หน่วย</th><th>ราคา/หน่วย</th></tr>';
                for (var i = 0; i < count; i++) {
                    sale_detail += "<tr><td>" + (i + 1) + "</td><td>" + result.listItem[i].itemCode + " " + result.listItem[i].itemName + "</td><td>" + result.listItem[i].whCode + "/" + result.listItem[i].shelfCode + "</td><td>" + result.listItem[i].qty + "</td><td>" + result.listItem[i].unitCode + "</td><td>" + result.listItem[i].price + "</td></tr>";
                }
                //sum_sale = sum_sale.toFixed(2);
                //sum_cost = sum_cost.toFixed(2);
                //sum_profit = sum_profit.toFixed(2);

                //sale_detail += '<tr style="font-weight: bold;"><td colspan="7"></td><td>ยอดรวม</td><td>'+sum_sale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td>'+sum_profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</td><td></td></tr>';
                sale_detail += '</table>';
            }

            document.getElementById("show_saledetail").innerHTML = sale_detail;


        },
        error: function(error) {
            alertify.alert(error);
        }
    });
}

function search_ar() {
    var arname = document.getElementById("ar_search").value;

    $.ajax({
        url: localStorage.link + "CMSteelWs/quotation/customer",
        data: '{"type":"0","search":"' + arname + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        cache: false,
        success: function(result) {
            console.log(result);


            var count = result.listCust.length;
            var custlist = "";
            if (count == 0) {
                custlist = "<p>ไม่มีข้อมูล!!</p>"
            } else {
                custlist += `<table class="table table-hover res" style="text-align:center; width:100%;">
                              <thead>
                                <tr class="header_table">
                                  <th style="text-align:center;">ที่</th>
                                  <th style="text-align:center;">รหัสลูกค้า</th>
                                  <th style="text-align:center;">ชื่อลูกค้า</th>        
                                </tr>
                              </thead>
                              <tbody>
                        `;
                for (var i = 0; i < count; i++) {
                    custlist += `<tr onclick="addar('` + result.listCust[i].custCode + `')">
                                      <td>` + (i + 1) + `</td>
                                      <td style="text-align:left;">` + result.listCust[i].custCode + `</td>
                                      <td>` + result.listCust[i].custName + `</td>          
                                    </tr>`;
                }
                custlist += '</table>';
            }
            document.getElementById("show_listar").innerHTML = custlist;
        },
        error: function(error) {
            alertify.alert(error);
        }
    });

}

function search_sale() {
    var arname = document.getElementById("sale_search").value;

    $.ajax({
        url: localStorage.link + "CMSteelWs/quotation/searchsale",
        data: '{"type":"0","search":"' + arname + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "POST",
        cache: false,
        success: function(result) {
            console.log(result);


            var count = result.listCon.length;
            var salelist = "";
            if (count == 0) {
                salelist = "<p>ไม่มีข้อมูล!!</p>"
            } else {
                salelist += `<table class="table table-hover res" style="text-align:center; width:100%;">
                              <thead>
                                <tr class="header_table">
                                  <th style="text-align:center;">ที่</th>
                                  <th style="text-align:center;">รหัสพนักงาน</th>
                                  <th style="text-align:center;">ชื่อพนักงาน</th>        
                                </tr>
                              </thead>
                              <tbody>
                        `;
                for (var i = 0; i < count; i++) {
                    salelist += `<tr onclick="addsale('` + result.listCon[i].code + `')">
                                      <td>` + (i + 1) + `</td>
                                      <td style="text-align:left;">` + result.listCon[i].code + `</td>
                                      <td>` + result.listCon[i].name + `</td>          
                                    </tr>`;
                }
                salelist += '</table>';
            }
            document.getElementById("show_listsale").innerHTML = salelist;
        },
        error: function(error) {
            alertify.alert(error);
        }
    });

}

function addar(a) {
    document.getElementById("arcode").value = a;
    $('#searchar').modal('hide');
}

function addsale(s) {
    document.getElementById("salecode").value = s;
    $('#searchsale').modal('hide');
}
$(document).ready(function() {
    $('#searchar').on('shown.bs.modal', function() {
        $('#ar_search').focus();
    })
    $('#searchsale').on('shown.bs.modal', function() {
        $('#sale_search').focus();
    })

});