<?php

	function writeState($statArr) //Запись статистики.
	{
		$file = fopen('stat.txt', 'a');
		foreach ($statArr as $key => $val)
		{
			if (is_array($val))
			{
				fwrite($file, 'Stat Timing (ms):' . "\n");
				foreach ($val as $key2 => $val2)
				{
					fwrite($file, '- ' . $key2 . ' | ' . $val2  . "\n");
				}
			}
			else
			{
				fwrite($file, $key . ' | ' . $val . "\n");
			}
		}
		fwrite($file, '------------------------------------------------------------------' . "\n");
		fclose($file);
	};

/*	function getTimeRange($eventTime, $startTime) 
	{
		if (($eventTime != null) && ($startTime != null))
		{
			return $eventTime - $startTime != null;
		}
		else
		{
			return null;
		}
	};
*/
	function statPreparing($statArr)
	{
		if ($statArr["startTime"] != null)
		{
			foreach ($statArr as $key => &$val)
			{
				if (is_array($val))
				{
					foreach ($val as $key2 => &$val2)
					{
						if ($val2 != null)
						{
							$val[$key2] = $val2 - $statArr["startTime"];
							echo ($val[$key2] . ' | ');
						}
					}
				}
				
			}
		}
		return $statArr;
	};

	if(isset($_POST))
	{
		$statData = file_get_contents('php://input');
		$statData = json_decode($statData, true); 

		$statData['userIp'] = $_SERVER['REMOTE_ADDR'];
		$statData['statReturnTime'] = date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME']);
		
		writeState(statPreparing($statData));
	};
?>