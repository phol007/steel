<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

if (empty($_FILES['file'])) {
	echo 'Require images.';
	die;
}

$filename = $_FILES['file']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$new_filename = md5(uniqid($filename, true)) . '.' . $ext;

$location = $_FILES["file"]["tmp_name"];
$dir = __DIR__.'/tmp';
if(!is_dir($dir)) mkdir($dir, 755);
$destination = $dir.'/'.$new_filename;
move_uploaded_file($location, $destination);

$file[] = [
	'filename' => $new_filename
];

$list['success'] = true;
$list['file'] = $file;
$list['destination'] = $destination;
echo json_encode($list);