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
$server = fopen("url.txt","r") or die("Unable to open file!");
$urlserver = fgets($server);

$pick_w = array (
  $_GET['para']

  );  
$pick_string_w = json_encode($pick_w); 
//$token = 'your token here';
//echo $pick_string_w;
$ch_w = curl_init();
curl_setopt($ch_w, CURLOPT_URL, $urlserver."CMSteelWs/quotation/reportitemstock");
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
$cnt =count($out_w["listItem"]);
//echo $cnt;
//echo $cnt;
echo '<h2>รายงานสต๊อกสินค้า</h2>';
echo '<table class="pdf">';
echo '<tr><th>ลำดับ</th><th>รายการ</th><th>น้ำหนัก</th><th>จำนวน</th><th>หน่วย</th><th>คลัง</th><th>ราคา/หน่วย</th><th>จอง</th></tr>';
for($i=0;$i<$cnt;$i++){
echo "<tr><td>".($i+1)."</td>";
echo "<td>".$out_w["listItem"][$i]["itemCode"]." ".$out_w["listItem"][$i]["itemName"]."</td>";
echo "<td>".$out_w["listItem"][$i]["itemWeight"]."</td>";
echo "<td>".$out_w["listItem"][$i]["qty"]."</td>";
echo "<td>".$out_w["listItem"][$i]["unitCode"]."</td>";
echo "<td>".$out_w["listItem"][$i]["whCode"]."</td>";
echo "<td>".$out_w["listItem"][$i]["salePrice"]."</td>";
echo "<td>".$out_w["listItem"][$i]["resQty"]."</td></tr>"; 

 }
 echo "</table>";
$header = "รายงานสต๊อกสินค้า";
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
