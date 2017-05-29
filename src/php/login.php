<?php
	//initialize login info
	$usr = $pwd = "";

	//get user login info
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	  $usr = checkInput($_POST["usr"]);
	  $pwd = checkInput($_POST["pwd"]);
	}


	//allows for flexible forms of input
	function checkInput($data) {
	  $data = trim($data);
	  $data = stripslashes($data);
	  $data = htmlspecialchars($data);
	  return $data;
	}

	echo $usr + " " + $pwd;
	//retrieve user data from database
		//if valid user - login

		//else - send error, prompt for login again
	

?>
