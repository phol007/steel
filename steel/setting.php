
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>
<body>
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' ) {
	
$server = $_POST['url'];
$fpserver = fopen("url.txt","w+");
fputs($fpserver,$server);
fclose($fpserver);

$sp1 = $_POST['sp1'];
$fpsp1 = fopen("sp1.txt","w+");
fputs($fpsp1,$sp1);
fclose($fpsp1);

$sp2 = $_POST['sp2'];
$fpsp2 = fopen("sp2.txt","w+");
fputs($fpsp2,$sp2);
fclose($fpsp2);
}


$server1 = fopen("url.txt","r") or die("Unable to open file!");
$urlserver = fgets($server1);

$rsp1 = fopen("sp1.txt","r") or die("Unable to open file!");
$urlsp1 = fgets($rsp1);

$rsp2 = fopen("sp2.txt","r") or die("Unable to open file!");
$urlsp2 = fgets($rsp2);

//$urlserver
echo  "<script type='text/javascript'>localStorage.link = '$urlserver';</script>";
echo  "<script type='text/javascript'>localStorage.steel_per1 = '$urlsp1';</script>";
echo  "<script type='text/javascript'>localStorage.steel_per2 = '$urlsp2';</script>";

fclose($server1);
fclose($rsp1);
fclose($rsp2);
//echo "alert($urlserver)";
//window.location="setting.php";
?>



</body>
</html>