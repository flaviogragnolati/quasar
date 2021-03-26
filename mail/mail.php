<?php

require_once "Mail.php";

//check submission
if(!isset($_POST['submit'])) {
  //This page should not be accessed directly. Need to submit the form.
  echo "mmmm you are not supposed to be here....go back to the shadows!";
  exit;
}


//check submission
if($_SERVER['REQUEST_METHOD'] == "POST") {

	//Get contact form data
	$contact_form_email = 'contact@quasaranlytic.com';
	$name = $_POST['name'];
	$visitor_email = $_POST['email'];
	$message = $_POST['message'];
	$phone = $_POST['phone'];
	$company = $_POST['company'];


	// Function to validate against any email injection attempts
	function IsInjected($str) {
		 $injections = array('(\n+)',
		              '(\r+)',
		              '(\t+)',
		              '(%0A+)',
		              '(%0D+)',
		              '(%08+)',
		              '(%09+)'
		              );
		  $inject = join('|', $injections);
		  $inject = "/$inject/i";
		  if(preg_match($inject,$str)) {
		    return true;
	  }
	  else {
	    return false;
	  }
	}

	//Server side data validation
	//check empty fields
	if(empty($name)||empty($visitor_email)||empty($message)) {
	    echo "<span class=formerror>Name, email and message are mandatory!</span>";
	    exit;
	}
	//checks if email is not valid
	elseif (!filter_var($visitor_email, FILTER_VALIDATE_EMAIL)) {
		echo "<span class=formerror>Not valid email format</span>";
		exit;
	}

	//checks injections
	elseif(IsInjected($visitor_email)) {
	    echo "<span class=formerror>Bad email value!</span>";
	    exit;
	}

	//compile emaile and send
	$host = "smtp.mailgun.org";
	$username = $_ENV['MAILGUN_USER'];
	$password = $_ENV['MAILGUN_PASS'];
	$port = "2525";
	$to = $_ENV['TARGET_EMAIL'];
	$email_from = "$contact_form_email";
	$email_subject = "Contact Form at Quasar Analytica site" ;
	$email_body = "You have received a new message from: $name, of company: $company, with email: $visitor_email and phone number: $phone.\n". 
	    "Here is the message:\n $message";

	$email_address = "$visitor_email";
	$content = "text/html; charset=utf-8";
	$mime = "1.0";

	//set up headers
	$headers = array ('From' => $email_from,
	'To' => $to,
	'Subject' => $email_subject,
	'Reply-To' => $email_address,
	'MIME-Version' => $mime,
	'Content-type' => $content);

	//smtp parameters
	$params = array  ('host' => $host,
	'port' => $port,
	'auth' => true,
	'username' => $username,
	'password' => $password);

	$smtp = Mail::factory ('smtp', $params);
	$mail = $smtp->send($to, $headers, $email_body);

	if (PEAR::isError($mail)) {
		echo("<p>" . $mail->getMessage() . "</p>");
	} 
	else {
		echo("<p>Message sent successfully!</p>");
	}
}

?>
