<?php

$connection = @mysqli_connect('127.0.0.1','jerry','jerry');
	//or die(mysqli_error());

if ($connection) {

	$msg = "<p>You have connected to the MySQL Database!</p>";
}  

?>
<!DOCTYPE html
	PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<title>DB Connection</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<link href="/css/style.css" rel="stylesheet" type="text/css" />
</head>

<body>

<h1>DB Connection</h1>

<?php echo "$msg"; ?>


</body>
</html>
