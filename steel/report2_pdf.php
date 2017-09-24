<?php
require_once('mpdf/mpdf.php');
ob_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="css/table.css">
<title>รายงานขาย</title>
</head>
<body>
<?php 
//$api_url = "<script type='text/javascript'>localStorage.link</script>"."asdasd";
$server = fopen("url.txt","r") or die("Unable to open file!");
$urlserver = fgets($server);


$pick_w = array (
  $_GET['para']

  );  
$pick_string_w = json_encode($pick_w); 
//$token = 'your token here';
//echo $pick_string_w;
$ch_w = curl_init();
//curl_setopt($ch_w, CURLOPT_URL, "http://api.nopadol.com:8080/CMSteelWs/quotation/reportsale");
curl_setopt($ch_w, CURLOPT_URL, $urlserver."CMSteelWs/quotation/reportsale");
curl_setopt($ch_w, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch_w, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch_w, CURLOPT_POST, true);
curl_setopt($ch_w, CURLOPT_POSTFIELDS, $_GET['para']);
//curl_setopt($ch_w, CURLOPT_HEADER, true);
curl_setopt($ch_w, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($pick_string_w)                                                                       
));  

$all_w="";
$use_w=array();$cancel_w=array();
$u_w=0;$c_w=0;  
// execute the request
$json_w = curl_exec($ch_w);
$out_w=json_decode($json_w,true);
//var_dump($out_w)
$cnt =count($out_w["listData"]);
//echo $cnt;
$sum_amount = 0;
$sum_cost = 0;
$sum_profit = 0;
//echo $cnt;
echo '<h2>รายงานยอดขาย</h2>';
echo '<table class="pdf" style="width:100%;";>';
echo '<tr class="header_table"><th>ลำดับ</th><th>เลขที่เอกสาร</th><th>ชื่อลูกค้า</th><th>ยอดขาย</th><th>กำไร</th><th>ชื่อเซล</th><th>ผู้ออกบิล</th><th>สถานที่ส่งของ</th></tr>';
$dcNo ="";
$a =0;
$co =1;
$cc =0;
for($i=0;$i<$cnt;$i++){
	  $docNo ="";
                         
                         if($a!=$cnt){
                         if($dcNo == $out_w["listData"][$i]["docNo"]){
                                    $docNo = "";
                                    $cc ="";
                               }else{
                                    $docNo = $out_w["listData"][$i]["docNo"];
                                    $cc=$co;
                                    $co++;
                               }
                         $dcNo = $out_w["listData"][$a]["docNo"];
                         
                           }
                          $a++;
if($out_w["listData"][$i]["returnMoney"]>0){
    echo "<tr class='red_table'>";
  }else{
    echo "<tr>";
  }
echo "<td>". $cc."</td>";
echo "<td>".$docNo."</td>";
echo "<td>".$out_w["listData"][$i]["itemCode"]." ".$out_w["listData"][$i]["arName"]."</td>";
echo "<td>".number_format($out_w["listData"][$i]["totalAmount"], 2, '.', ',')."</td>";
echo "<td>".number_format($out_w["listData"][$i]["profit"], 2, '.', ',')."</td>";
echo "<td>".$out_w["listData"][$i]["saleName"]."</td>";
echo "<td>".$out_w["listData"][$i]["creatorCode"]."</td>";
echo "<td>".$out_w["listData"][$i]["address"]."</td>";
echo "</tr>";
$sum_amount += $out_w["listData"][$i]["totalAmount"];
$sum_profit += $out_w["listData"][$i]["profit"];
 }
 echo "<tr class='header_table'>";
echo "<td colspan='3'>รวม</td>";
echo "<td>".number_format($sum_amount, 2, '.', ',')."</td>";
echo "<td>".number_format($sum_profit, 2, '.', ',')."</td>";
echo "<td colspan='3'></td>";

echo "</tr>";
 echo "</table>";
$header = "รายงานยอดขาย";
//$datename = Date('d-m-Y');
//$save = 'Report1 '.$datename.'.pdf';   

$html = ob_get_contents();
ob_end_clean();
$pdf = new mPDF('th', 'A4-P', '0', 'THSaraban'); 
$pdf->SetHeader($header);
$pdf->WriteHTML($html);
//$pdf->Setfooter($footer);
$pdf->Output('report.pdf', 'I');

?>
