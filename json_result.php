<?php
    $amount      = $_POST["amount"];
    $firstName   = $_POST["firstName"];
    $lastName    = $_POST["lastName"];
    $email       = $_POST["email"];
    if(isset($amount)){
        $data = array(
            "amount"     => $amount,
            "firstName"  => $firstName,
            "lastName"   => $lastName,
            "email"      => $email
        );
        
        $myfile = fopen($_POST["amount"].".txt", "x+") or die("Unable to open file!");
		$txt = json_encode($data);
		fwrite($myfile, $txt);
    }
?>