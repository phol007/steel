<?php
require_once('/var/www/html/qMon/realtime/mpdf/mpdf.php');
ob_start();

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<html>
<head>

    <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
      <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <title>ReportSaler</title>

<link rel="stylesheet" href="css/css2.css" type="text/css" />
</head>

<body>
<?php

echo "<p style='display:none;'>";
require("connect_apiQdetail.php");
require("dateThai.php");
echo "</p>";
?>

<?php
$out_w=json_decode($Qdetail,true);



$result = array();
$cnt=0;
$all_prouct="";
$Pickdetail="";
$checkdetail="";
$checker="";
$sum=0;
$time="";
$p="";
$c="";
foreach ($out_w as $row) {
  $result[$row['qId']]['qId'] = $row['qId'];
  $result[$row['qId']]['carLicence'] = $row['carLicence'];
  $result[$row['qId']]['carBrand'] = $row['carBrand'];
  @$result[$row['qId']]['itemCode'] .= $row['itemCode']."<br>";
  $result[$row['qId']]['invoiceNo'] = $row['invoiceNo'];
  $result[$row['qId']]['itemCancel'] = $row['itemCancel'];
  $result[$row['qId']]['isCancel'] = $row['isCancel'];
  $result[$row['qId']]['createDate'] = $row['createDate'];
  @$result[$row['qId']]['Unit'] .= $row['numberOfItem']." &nbsp;".$row['unitCode']."<br>";
  $result[$row['qId']]['pickerCode'] = $row['pickerCode'];
  $result[$row['qId']]['pickerName'] = $row['pickerName'];
  $result[$row['qId']]['checkerCode'] = $row['checkerCode'];
  $result[$row['qId']]['checkerName'] = $row['checkerName'];
  $result[$row['qId']]['saleCode'] = $row['saleCode'];
  $result[$row['qId']]['saleName'] = $row['saleName'];
  @$result[$row['qId']]['itemName'] .= "- &nbsp;".$row['itemName']."<br>";
  @$result[$row['qId']]['billAmount'] .= number_format($row['billAmount'],2)."<br>";
}
  $result = array_values($result);
    if(empty($result)){
      $all_prouct = "<tr><td colspan='5'><h1> ไม่มีข้อมูล </h1><td></tr>";
    }else{
      $sort = array();
      foreach ($result as $k => $v) {
      $sort['qId'][$k] = $v['qId'];
      $sort['carLicence'][$k] = $v['carLicence'];
      $sort['carBrand'][$k] = $v['carBrand'];
      $sort['itemCode'][$k] = $v['itemCode'];
      $sort['invoiceNo'][$k] = $v['invoiceNo'];
      $sort['Unit'][$k] = $v['Unit'];
      $sort['pickerCode'][$k]=$v['pickerCode'];
      $sort['pickerName'][$k]=$v['pickerName'];
      $sort['checkerCode'][$k]=$v['checkerCode'];
      $sort['checkerName'][$k]=$v['checkerName'];
      $sort['saleCode'][$k]=$v['saleCode'];
      $sort['saleName'][$k]=$v['saleName'];
      $sort['itemName'][$k] = $v['itemName'];
      $sort['itemCancel'][$k] = $v['itemCancel'];
      $sort['isCancel'][$k] = $v['isCancel'];
      $sort['billAmount'][$k] = $v['billAmount']; 
      $sort['createDate'][$k] = $v['createDate']; 
      }
    }
    //array_multisort($sort['qId'],SORT_ASC,$result);

    $cnt=count($result);
$all_prouct.="<div class='Table table-responsive' style='width:100%; '><table border='1'  width='100%'><tr><th>ลำดับ</th><th>ทะเบียน</th><th>ยี่ห้อ</th><th>เวลา</th><th>เลขที่บิล</th><th>รหัสสินค้า</th><th>รายการ</th><th>จำนวน</th><th>ผู้จัด</th><th>ผู้ตรวจเช็ค</th><th>ผู้ขาย</th><th>ราคา</th></tr>";
    for($i=0;$i<$cnt;$i++){
      $time=substr($sort['createDate'][$i],11);
      if(empty($sort['invoiceNo'][$i])){$sort['invoiceNo'][$i]="ไม่มีเลขที่บิล";}

      if($sort['isCancel'][$i] ==0){
      $all_prouct.="<tr valign='top' style='background:#FFF;'><td align='center'>".$sort['qId'][$i]."</td><td>".$sort['carLicence'][$i]."</td><td>";
      $all_prouct.=$sort['carBrand'][$i]."</td><td align='right'>".substr($time,0,5)." น.</td><td align='right'>".$sort['invoiceNo'][$i]."</td><td align='right'>".$sort['itemCode'][$i]."</td><td>".$sort['itemName'][$i]."</td>";
      $all_prouct.="<td align='left'>".$sort['Unit'][$i]."</td><td>".$sort['pickerCode'][$i]." :&nbsp;".$sort['pickerName'][$i]."</td><td>".$sort['checkerCode'][$i]." :&nbsp;".$sort['checkerName'][$i]."</td><td>".$sort['saleCode'][$i]." :&nbsp;".$sort['saleName'][$i]."</td><td align='right'>".$sort['billAmount'][$i]."</td></tr>";  
      
      }else{
      $all_prouct.="<tr valign='top' style='background-color:red; color:#fff;'><td align='center'>".$sort['qId'][$i]."</td><td>".$sort['carLicence'][$i]."</td><td>";
      $all_prouct.=$sort['carBrand'][$i]."</td><td align='right'>".substr($time,0,5)." น.</td><td align='right'>".$sort['invoiceNo'][$i]."</td><td align='right'>".$sort['itemCode'][$i]."</td><td>".$sort['itemName'][$i]."</td>";
      $all_prouct.="<td align='left'>".$sort['Unit'][$i]."</td><td>".$sort['pickerCode'][$i]." :&nbsp;".$sort['pickerName'][$i]."</td><td>".$sort['checkerCode'][$i]." :&nbsp;".$sort['checkerName'][$i]."</td><td>".$sort['saleCode'][$i]." :&nbsp;".$sort['saleName'][$i]."</td><td align='right'>".$sort['billAmount'][$i]."</td></tr>";  
      }


 

    }
    $time = date('H:i');
    echo "<div style='float:left; border-bottom:5px solid yellow; width:150px;'><img src='images/logo.jpeg' width='150'></div>";
    echo "<div style='float:left; border-bottom:5px solid yellow; font-size:21px; font-style:bold; text-align:center;'>รายงานสรุปผลการทำงานของ DriveTHRU ประจำวันที่ $curdate</div><br>";
   // echo "<div style='font-size:10px; magin-top:5px; clear:both; color:red;'><i>** พิมพ์เวลา $time นาที</i></div>";
    echo $all_prouct;
    //echo $sum;


echo "<p style='display:none;'>";
require("connect_apiQdetail.php");
echo "</p>";

$out=json_decode($Qdetail,true);



$result = array();
$cnt=0;
$all_bill="";

foreach ($out as $row) {
  $result[$row['billAmount']]['billAmount'] += $row['billAmount'];
}
  $result = array_values($result);
    if(empty($result)){
      $all_prouct = "<h1> ไม่มีข้อมูล </h1>";
    }else{
      $sort = array();
      foreach ($result as $k => $v) {
      $sort['billAmount'][$k] = $v['billAmount'];
      }
    }
    //array_multisort($sort['qId'],SORT_ASC,$result);

    $cnt=count($result);

    for($i=0;$i<$cnt;$i++){
      $all_bill += $sort['billAmount'][$i];
      }
 
?>
<tr style="background-color:#e2e3e4;"><td colspan="11" align="right" style='font-size:12px;'><b>total</b></td><td align="right"><b><?php echo number_format($all_bill,2);?></b></td></tr></table><br>

<?Php
echo "<p style='display:none;'>";
require("connect_apiQdetail.php");
echo "</p>";

$out_w=json_decode($Qdetail,true);



$result = array();
$cnt=0;
$all_pick="";
$all_check="";

foreach ($out_w as $row) {
  $result[$row['pickerCode']]['pickerCode'] = $row['pickerCode'];
  @$result[$row['pickerCode']]['pickerName'] = $row['pickerCode']." : ".$row['pickerName']."<br>";
  @$result[$row['checkerCode']]['checkerCode'] = $row['checkerCode'];
  @$result[$row['checkerCode']]['checkerName'] = $row['checkerCode']." : ".$row['checkerName']."<br>";
  @$result[$row['saleCode']]['saleCode'] = $row['saleCode'];
  @$result[$row['saleCode']]['saleName'] = $row['saleCode']." : ".$row['saleName']."<br>";
}
  $result = array_values($result);
    if(empty($result)){
      $all_prouct = "<h1> ไม่มีข้อมูล </h1>";
    }else{
      $sort = array();
      foreach ($result as $k => $v) {
      @$sort['pickerCode'][$k] = $v['pickerCode'];
      @$sort['pickerName'][$k] = $v['pickerName'];
      @$sort['checkerCode'][$k]=$v['checkerCode'];
      @$sort['checkerName'][$k]=$v['checkerName'];
      @$sort['saleCode'][$k]=$v['saleCode'];
      @$sort['saleName'][$k]=$v['saleName'];
      }
    }
    //array_multisort($sort['qId'],SORT_ASC,$result);

    $cnt=count($result);

    for($i=0;$i<$cnt;$i++){

      if($sort['pickerName'][$i]!=":"||$all_check.=$sort['checkerName'][$i]!=":"||$all_sale.=$sort['saleName'][$i]!=":"){
      $all_pick.=$sort['pickerName'][$i];
      $all_check.=$sort['checkerName'][$i];
      $all_sale .=$sort['saleName'][$i];
      }else{
      $all_pick.="-";
      $all_check.="-";   
      $all_sale .="-";
      }
    }
echo "</div>";

$datename = Date('d-m-Y');

$footer .="<table border='0' style='width:100%; font-size:12px; vertical-align:top; margin-top:5px;'><tr><td width='45%'>";
$footer .="<b>รายชื่อพนักงาน Pickup</b><br>".$all_pick;
$footer .="</td><td width='38%'>";
$footer .="<b>รายชื่อพนักงาน CheckOut</b><br>".$all_check;
$footer .="</td><td><b>รายชื่อพนักงาน sale</b><br>$all_sale</td></tr></table>";
    
$save = 'report_file/ReportDriveThru '.$datename.'.pdf';   
$html = ob_get_contents();
ob_end_clean();
$pdf = new mPDF('th', 'A4-L', '0', 'Tohama');
$pdf->SetHeader($header);
$pdf->WriteHTML($html);
$pdf->Setfooter($footer);
$pdf->Output($save, 'F');
?>     