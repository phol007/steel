<?php
require_once('mpdf/mpdf.php');
//require("numwordthai.php");
function numwordthai($number){ 
$txtnum1 = array('ศูนย์','หนึ่ง','สอง','สาม','สี่','ห้า','หก','เจ็ด','แปด','เก้า','สิบ'); 
$txtnum2 = array('','สิบ','ร้อย','พัน','หมื่น','แสน','ล้าน','สิบ','ร้อย','พัน','หมื่น','แสน','ล้าน'); 
$number = str_replace(",","",$number); 
$number = str_replace(" ","",$number); 
$number = str_replace("บาท","",$number); 
$number = explode(".",$number); 
if(sizeof($number)>2){ 
return 'ทศนิยมหลายตัวนะจ๊ะ'; 
exit; 
} 
$strlen = strlen($number[0]); 
$convert = ''; 
for($i=0;$i<$strlen;$i++){ 
    $n = substr($number[0], $i,1); 
    if($n!=0){ 
        if($i==($strlen-1) AND $n==1){ $convert .= 'เอ็ด'; } 
        elseif($i==($strlen-2) AND $n==2){  $convert .= 'ยี่'; } 
        elseif($i==($strlen-2) AND $n==1){ $convert .= ''; } 
        else{ $convert .= $txtnum1[$n]; } 
        $convert .= $txtnum2[$strlen-$i-1]; 
    } 
} 

$convert .= 'บาท'; 
if($number[1]=='0' OR $number[1]=='00' OR 
$number[1]==''){ 
$convert .= 'ถ้วน'; 
}else{ 
$strlen = strlen($number[1]); 
for($i=0;$i<$strlen;$i++){ 
$n = substr($number[1], $i,1); 
    if($n!=0){ 
    if($i==($strlen-1) AND $n==1){$convert 
    .= 'สิบ';} 
    elseif($i==($strlen-2) AND 
    $n==2){$convert .= 'ยี่';} 
    elseif($i==($strlen-2) AND 
    $n==1){$convert .= '';} 
    else{ $convert .= $txtnum1[$n];} 
    $convert .= $txtnum2[$strlen-$i-1]; 
    } 
} 
$convert .= 'สตางค์'; 
} 
return $convert; 
} 

ob_start();

$table = array (
  "type" => "",
  "search" => $_GET['docNo']
  );
// json encode data
$data_string = json_encode($table); 
// the token
$token = 'your token here';
// set up the curl resource
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_GET['link']."CMSteelWs/quotation/searchdetails");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
//curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
    'Content-Type: application/json',                                                                                
    'Content-Length: ' . strlen($data_string)                                                                       
));       
// execute the request
$out = curl_exec($ch);
$data = json_decode($out, TRUE);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<html>
<head>

    <meta name="viewport" content="width=device-width, initial-scale=1">
      <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <title>ReportSaler</title>
<style type="text/css">
.table td,th{
  padding-top: 1%;
  border-radius: 9px;
  font-size: 12px;
}

</style>
</head>

<body>
<table  class="table" width="100%">
  <tr>
    <td width="50%" style="border-right: 1px solid black; vertical-align: top;">
        <table>
          <tr>
            <td width="40%"><b>ชื่อลูกค้า</b></td><td><?php echo $data['arname']; ?></td>
          </tr>
          <tr>
            <td width="40%"><b>ทีอยู่</b></td><td><?php 
              if($data['contactTel']){
                echo $data['contactAddress']."&nbsp;โทร ".$data['contactTel'];
              }else{
                echo $data['contactAddress'];
              }
             ?></td>
          </tr>
          <tr>
            <td width="40%"><b>วันที่นัดส่งสินค้า</b></td><td><?php echo ""; ?></td>
          </tr>
        </table>
    </td>
    <td style="vertical-align: top;">
       <table>
          <tr>
            <td width="40%" align="right"><h3>เลขที่ใบเสนอราคา</h3></td><td style="padding-left: 2%; font-size: 15px;"><?php echo $data['docNo'];?></td>
          </tr>
          <tr>
            <td width="40%" align="right"><b>วันทีออกเอกสาร</b></td><td style="padding-left: 2%;">
            <?php $date = $data['docDate'];
                  $date = explode(" ",$date);
                  $dd = $date[0];
                  $date = explode("-",$dd);

                  $date = $date[2]."/".$date[1]."/".$date[0];
                  echo $date;
            ?>
              
            </td>
          </tr>
          <tr>
            <td width="40%" align="right"><b>เงื่อนไขการชำระเงิน</b></td><td style="padding-left: 2%;"><?php echo ""; ?></td>
          </tr>
          <tr>
            <td width="40%" align="right"><b>ยืนราคาถึงวันที่</b></td><td style="padding-left: 2%;"><?php echo $data['expireCredit']; ?></td>
          </tr>
        </table>
    </td>
  </tr>

  <tr style="border:1px solid black;">
    <td colspan="2" style="border-top:1px solid black; text-align: center;">
      *** <u>ขอขอบพระคุณที่ท่านไว้วางใจในบริการของเรา ทางบริษัทฯ มีความยินดีที่จะเสนอราคาสินค้า ดังต่อไปนี้</u> ***
    </td>
  </tr>
  <tr>
    
    <td colspan="2" style="border-top:1px solid black; padding: 0;">

      <table style="border:1px solid black; height: 500px;" width="100%;">
        <tr style="background: #d9d9d9">
          
          <th style="border-right:0.5px dashed black; border-bottom:1px solid black;">ลำดับ</th>
          <th width="40%" style="border-right:0.5px dashed black; border-bottom:1px solid black;">รายละเอียด</th>
          <th style="border-right:1px dashed black; border-bottom:1px solid black;">จำนวน</th>
          <th style="border-right:1px dashed black; border-bottom:1px solid black;">หน่วย</th>
          <th style="border-right:1px dashed black; border-bottom:1px solid black;">ราคาต่อหน่วย</th>
          <th style="border-bottom:1px solid black;">ราคารวม</th>

        </tr>
        <?php
          $cnt = count($data['listItem']);
          $result = $data['listItem'];
          $n = 1;
         foreach($result as $val) {
                  echo "<tr>
                            <td style='border-right:0.5px dashed black; text-align:center; vertical-align: top;'>".$n."</td>
                            <td style='border-right:0.5px dashed black;'>".$val['itemName']."</td>
                            <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'>".$val['qty']."</td>
                            <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'>".$val['unitCode']."</td>
                            <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'>".number_format( $val['price'] , 2 )."</td>
                            <td style='text-align:right; padding-right:1%;'>".number_format($val['amount'], 2 )."</td>
                            </tr>
                      ";       
                      $n++;

                  if($n>$cnt){
                     for($i=($n);$i<20;$i++){
                      echo "<tr>
                              <td style='border-right:0.5px dashed black; text-align:center;'><br><br></td>
                              <td style='border-right:0.5px dashed black;'></td>
                              <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'></td>
                              <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'></td>
                              <td style='border-right:0.5px dashed black; text-align:right; padding-right:1%;'></td>
                              <td style='text-align:right; padding-right:1%;'></td>
                              </tr>
                        ";
                      }
                  } 
          }
          
        ?>
      </table>
      <hr>
      <table style="border:1px solid black; margin-top: 1%; font-size: 8px;" width="100%">
        <tr>
          <td width="33%" rowspan="3" style="vertical-align: top; border-right:0.5px dashed black; padding-right: 2%; line-height: 22px;">
          <b>หมายเหตุ : </b><?php echo $data['myDescription1'] ?></td>

          <td style="text-align: center;">
          <?php echo $data['saleCode']."&nbsp;".$data['salename'];?>
          <br>
          <br><br>
            <p>ผู้ทำรายการ</p>
          </td>
          <td width="16%" style="border-right:0.5px dashed black;"></td>
          <td colspan="2" style="vertical-align: top;">
              <table width="100%" style="margin: 0; ">
                <tr>
                  <td style="text-align: right; width: 55%;">ยอดรวม</td>
                  <td style="text-align: right;"><?php echo number_format($data['beforeTaxAmount'],2); ?></td>
                </tr>
                <tr>
                  <td style="text-align: right; width: 55%;">ภาษีมูลค่าเพิ่ม</td>
                  <td style="text-align: right;"><?php echo number_format($data['taxAmount'],2) ?></td>
                </tr>
                <tr>
                  <td style="text-align: right; width: 55%;">จำนวนเงินทั้งสิน</td>
                  <td style="text-align: right;"><?php echo number_format($data['totalAmount'],2) ?></td>
                </tr>
              </table>
          </td>
        </tr>
        <tr>
          <td colspan="4" style="padding-left:2%; border-top:1px solid black; border-bottom:1px solid black; vertical-align: middle;">
          <b>ตัวอักษร : <?php echo numwordthai(number_format($data['totalAmount'],2)); ?></b></td>
        </tr>
        <tr>
          <td width="16%" style="text-align: center; border-right:0.5px dashed black; padding-left:1%; padding-right: 1%; vertical-align: top;">
          <?php echo $data['saleCode']."&nbsp;".$data['salename'];?>
          <br>
          <br>
          <br>
          .........../........../...........<br>
          พนักงานขาย/ผู้เสนอ<br>ราคา
          </td>
          <td style="text-align: center; border-right:0.5px dashed black; padding-left:1%; padding-right: 1%; vertical-align: top;">
          ขอแสดงความนับถือ
          <br>
          <br>
          <br>
          <br>
          .........../........../...........<br>
          ผู้อนุมัติการเสนอราคา
          </td>
          <td width="20%" style="text-align: center; vertical-align: top;">
          อนุมัติสั่งซื้อตามใบเสนอราคานี้
          <br>
          <br>
          <br>
          <br>
          .........../........../...........<br>
          ลงชื่อผู้มีอำนาจในการสั่งซื้อ<br>พร้อมประทับตรา
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>

<?php
date_default_timezone_set("Asia/Bangkok");

$datetime = date("d/m/Y H:i:s");

$header = "<div style='width:50%; text-align:left; float:left;'><img src='images/nps2.png' style='width:70px;'>&nbsp;<img src='images/nps.gif' style='width:70px;'></div>";
$header .= "<div style='width:50%; text-align:right; float:left; padding:0;'><h1 style='padding-top:10%; padding-bottom: 0; margin: 0;'>ใบเสนอราคา/QUOTATION</h1></div>";

$footer = "<div style='width:100%; text-align:right;'>บันทึก ณ วันที่ ".$datetime."</div>"; 

$html = ob_get_contents();
ob_end_clean();
$pdf = new mPDF('th', 'A4-P', '0', 'THsarabun');
$pdf->SetMargins(0,0,30);
$pdf->SetHeader($header);
$pdf->WriteHTML($html);
$pdf->Setfooter($footer);
$pdf->Output('Report'.$_GET['docNo'].'.pdf', 'I');
?>     