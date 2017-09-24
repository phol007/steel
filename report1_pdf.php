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

$pick_w = array (
  $_GET['para']

  );  
$server = fopen("url.txt","r") or die("Unable to open file!");
$urlserver = fgets($server);

$pick_string_w = json_encode($pick_w); 
//$token = 'your token here';
//echo $pick_string_w;
$ch_w = curl_init();
curl_setopt($ch_w, CURLOPT_URL, $urlserver."CMSteelWs/quotation/reportsaledetails");
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
$sum_sale = 0;
$sum_cost = 0;
$sum_profit = 0;
//echo $cnt;
echo '<h2>รายงานขาย</h2>';
echo '<table class="pdf">';
for($i=0;$i<$cnt;$i++){
echo "<tr style='background-color: #39b3d7;'>";
echo "<td colspan='2'>เลขที่ใบเสร็จ : <b>".($i+1)." ".$out_w["listData"][$i]["docNo"]."</b></td>";
echo "<td colspan='3'>".$out_w["listData"][$i]["docName"]." (".$out_w["listData"][$i]["creditDay"].")</td>";
echo "<td colspan='3'>พนักงานขาย : ".$out_w["listData"][$i]["saleName"]."</td>";
echo "</tr>";
echo "<tr>";
echo '<td> ชื่อลูกค้า : <b>'.$out_w["listData"][$i]["arName"].'</b></td>';
echo '<td>จำนวน</td>';
echo '<td>หน่วย</td>';
echo '<td>ราคาขาย</td>';
echo '<td>ทุน</td>';
echo '<td>ยอดขาย</td>';
echo '<td>ทุน</td>';
echo '<td>กำไร</td>';
echo '<td>% กำไร</td>';
echo '</tr>';
	$cntitem = count($out_w["listData"][$i]["listItem"]);
	for($j=0;$j<$cntitem;$j++){
            echo '<tr>';
            echo '<td>'.($j+1)."&nbsp;&nbsp;".$out_w["listData"][$i]["listItem"][$j]["itemName"].'</td>';
            echo '<td>'.$out_w["listData"][$i]["listItem"][$j]["qty"].'</td>';
            echo '<td>'.$out_w["listData"][$i]["listItem"][$j]["unitCode"].'</td>';
            echo '<td>'.number_format($out_w["listData"][$i]["listItem"][$j]["price"],2).'</td>';
            echo '<td>'.number_format($out_w["listData"][$i]["listItem"][$j]["averageCost"],2).'</td>';
            echo '<td>'.number_format($out_w["listData"][$i]["listItem"][$j]["amount"],2).'</td>';
            echo '<td>'.number_format($out_w["listData"][$i]["listItem"][$j]["sumOfCost"],2).'</td>';
            echo '<td>'.number_format(($out_w["listData"][$i]["listItem"][$j]["qty"]*$out_w["listData"][$i]["listItem"][$j]["profit"]),2).'</td>';
            echo '<td>'.$out_w["listData"][$i]["listItem"][$j]["percentPF"].'%</td>';
            echo '</tr>';
	}
    echo '<tr>';
    echo '<td colspan="5">รวม</td>';
    echo '<td>'.number_format($out_w["listData"][$i]["totalAmount"],2).'</b></td>';
    echo '<td>'.number_format($out_w["listData"][$i]["sumOfCostAmount"],2).'</b></td>';
    echo '<td>'.number_format($out_w["listData"][$i]["sumProfitAmount"],2).'</b></td>';
    echo '<td>&nbsp;</td>';
    echo '</tr>';
    $sum_sale += $out_w["listData"][$i]["totalAmount"];
    $sum_cost += $out_w["listData"][$i]["sumOfCostAmount"];
    $sum_profit +=$out_w["listData"][$i]["sumProfitAmount"];
 }
echo '<tr style="background-color: #39b3d7;">';
echo '<td colspan="5">&nbsp;</td>';
echo '<td>'.number_format($sum_sale,2).'</b></td>';
echo '<td>'.number_format($sum_cost,2).'</b></td>';
echo '<td>'.number_format($sum_profit,2).'</b></td>';
echo '<td>&nbsp;</td>';
echo '</tr>';
echo "</table>";
$header = "รายงานขาย";
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
