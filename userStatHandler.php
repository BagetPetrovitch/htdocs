<?php
	if(isset($_POST))
	{
		$statData = file_get_contents('php://input');
		$statData = json_decode($statData, true); 
		$statData['userIp']=$_SERVER['REMOTE_ADDR'];
		
		$file = fopen('stat.txt', 'a');
		foreach ($statData as $key => $val)
		{
			fwrite($file, $key . ' | ' . $val . "\n");
		}
		fwrite($file, '------------------------------------------------------------------' . "\n");
		fclose($file);
	};
?>