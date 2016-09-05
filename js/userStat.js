//Инициализируем, что выгребаем.
var userStat = {
	startTime: new Date(),
	pageUrl: null,
	pageReferrer: null,
	userAgent: null,
	browser: null,
	flashVersion: null,
	platform: null,
	screenResol: null,
	innerResol: null,
	screenAvai: null,
	statTiming: {
		connectStart: null,
		connectEnd: null,
		domStart: null,
		domReady: null,
		domComplete: null,
		scriptsStart: null,
		scriptsComplete: null,
		onloadStart: null,
		onloadComplete: null  //Применить jQuery или костыль.
	}
};

function getBrowser()
{
	var bro;
	
	if (window.opera) return 'Opera';
	if (window.chrome) return 'Chrome';
	if (window.sidebar) return 'Firefox';
	
	if (document.all && !document.querySelector) return 'ie7';
	if (document.all && document.querySelector && !document.addEventListener) return 'ie8';
	if (document.all && document.querySelector && document.addEventListener) return 'ie9/10';
	if (!document.all) return 'ie11 или нет';
}

function pageMarking() //Запилить букмарки на срипты.
{
	
}

function pageTiming() //В ms. 
{
	if (window.performance && window.performance.timing && document.addEventListener) //Не веган.
//	if (document.addEventListener)
	{
		try
		{
			var apiTiming = window.performance.timing; 
			userStat.startTime = apiTiming.navigationStart;
			
			//Соединене.
			userStat.statTiming.connectStart = apiTiming.connectStart;
			userStat.statTiming.connectEnd = apiTiming.connectEnd;
			
			//Все для Дома. 
			userStat.statTiming.domStart = apiTiming.domLoading;
			userStat.statTiming.domReady = apiTiming.domInteractive;
			userStat.statTiming.domComplete = apiTiming.domComplete;
//			userStat.statTiming.domTiming = apiTiming.domComplete - apiTiming.domLoading;
			
//			userStat.statTiming.scriptsStart = ;
//			userStat.statTiming.scriptsComplete = ;
			
			//Все, после дома.
			userStat.statTiming.onloadStart = apiTiming.loadEventStart;
			userStat.statTiming.onloadComplete = userStat.loadEventEnd;
//			userStat.statTiming.onloadTiming = apiTiming.loadEventStart - userStat.loadEventEnd;
		}
		catch(err){};
	}
	else 
	{
		userStat.onloadStartTime = new Date() - userStat.startTime;		
	}
}

function getFlashVersion() //Куда ж без него?
{
	var version = null;
	var i;
	var plugin;
	
	if (!document.addEventListener) //ie8 и ниже.
	{
		//в пекло.
	}
	else
	{
		for (i in navigator.plugins) 
		{
			plugin = navigator.plugins[i];
			if (plugin.name == undefined) continue;
			if (plugin.name.indexOf('Flash') > -1) version = /\d+/.exec(plugin.description);
		}
		return version[0]; 
	}
}


function grabTheGear() //Агент, ОСь, URL страницы, Разрешение экрана и т.д. 
{
	userStat.pageUrl = location.href;
	userStat.pageReferrer = location.referrer;
	
	userStat.userAgent = navigator.userAgent;
	userStat.platform = navigator.platform;
	
	userStat.screenResol = window.screen.width + 'x' + window.screen.height;
	userStat.innerResol = window.innerWidth + 'x' + window.innerHeight;
	userStat.screenAvai = window.screen.availWidth + 'x' + window.screen.availHeight;
	
	userStat.browser = getBrowser();
	userStat.flashVersion = getFlashVersion();
}

function sendStat() //Пакуем, отправляем.
{
	var stat = new XMLHttpRequest();
	stat.open('POST', 'userStatHandler.php', true);
	stat.setRequestHeader("Content-Type","application/json");
	stat.timeout = 3000;
	stat.send(JSON.stringify(userStat));
	
		stat.onreadystatechange = function() 
	{
		if ((stat.readyState == 4) && (stat.status !== 200))
		{
			
			//to Local Storage. 
		}
	}
}

function statEnd() //Стартуем.
{
	grabTheGear();
	pageTiming();
	sendStat();
	console.log(JSON.stringify(userStat));
	
	if (document.addEventListener)
	{
		window.removeEventListener("load", statEnd);
	}
}

if (!document.addEventListener)
{
	window.attachEvent( "onload", statEnd);
}
else
{
	window.addEventListener("load", statEnd);
}

//window.addEventListener("load", statEnd);
//window.onload = statEnd();