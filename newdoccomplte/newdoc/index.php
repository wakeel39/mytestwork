<?php 
set_time_limit(0);
$PROJECT_NAME = "West Chester";
$serverurl = "http://52.34.59.23/WestChesterRideCorp/";
$dir = "doc/";
$crossimage ="";
$crossimage ="<center><img alt=Embedded Image src=\"data:image/png;base64,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\" /></center>";
$tickimage ="<center><img alt=Embedded Image src=\"data:image/png;base64,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\" /></center>";


include("createfolders.php");
include("createjs.php");
include("createcss.php");

include("westchasterdocumantion.php");
include("docclass.php");
$test = new Test();
$DocClass = new DocClass();
$file_name = (__DIR__) . "/doc/" . "index.html";



/*
* get all class methods
*/
$class_methods = get_class_methods($test);

$r = new ReflectionClass($test);
$menus =array();
$i=0;
foreach($class_methods as $func) {
	$fn = $r->getMethod($func)->getDocComment();
	/*
	* get name
	*/
	$name = $DocClass->getDocCommentObject('name',$fn);
	$name = $DocClass->filterObj($name[1][0]);
	$menus[$i]['name'] =$name;
	/*
	* get method
	*/
	$method = $DocClass->getDocCommentObject('method',$fn);
	$method = $DocClass->filterObj($method[1][0]);
	$menus[$i]['method'] =$method;
	/*
	* get parms
	*/
	$param = $DocClass->getDocCommentObject('parms',$fn);
	$param = $DocClass->filterObj($param[1]);

	/*
	* get url
	*/
	$url = $DocClass->getDocCommentObject('url',$fn);
	$url = $DocClass->filterObj($url[1][0]);
	$menus[$i]['url'] =$url;
	/*
	* get descp
	*/
	$descp = $DocClass->getDocCommentObject('descp',$fn);
	$descp = $DocClass->filterObj($descp[1][0]);
	$menus[$i]['descp'] =$descp;
	/*
	*set post paramerts for success 
	*/
	$postSuccessParms = array();
	$postErrorParms = array();
	foreach($param as $key=>$parm) { 
		//$ext = explode(" ",trim($parm));
		preg_match_all('/"(?:\\\\.|[^\\\\"])*"|\S+/', $parm, $ext);
		
		$ext = $ext[0];
		if(strtolower($method) == 'post' || strtolower($method) == 'put' ) {
			$filename  = realpath($ext[3]);
			$postSuccessParms[$ext[0]] = $filename;
			
		} 
		else { 
			$postSuccessParms[$ext[0]] = $ext[3];
			
		}
		if(strtolower($ext[2]) == 'r') { $postErrorParms[$ext[0]] = $ext[3]; }
		/*
		*set paramerts for show tables 
		*/
		$menus[$i]['param'][] =$ext;
	}
		

	$u = $serverurl.trim($url); 
	/*
	* geting response for success
	*/
	$reponseSuccess = $DocClass->PostData($u,$method,$postSuccessParms);
	$res = json_decode($reponseSuccess);
	$json_string = json_encode($res, JSON_PRETTY_PRINT);
	$menus[$i]['reponseSuccess'] =$json_string;
	
	/*
	* geting response for error
	*/
	array_pop($postErrorParms);  
	$reponseError = $DocClass->PostData($u,$method,$postErrorParms);
	$res = json_decode($reponseError);
	$json_string = json_encode($res, JSON_PRETTY_PRINT);
	$menus[$i]['reponseError'] =$json_string;

	$i++;
}


$string = '<!doctype html>  
<!--[if IE 6 ]><html lang="en-us" class="ie6"> <![endif]-->
<!--[if IE 7 ]><html lang="en-us" class="ie7"> <![endif]-->
<!--[if IE 8 ]><html lang="en-us" class="ie8"> <![endif]-->
<!--[if (gt IE 7)|!(IE)]><!-->
<html lang="en-us"><!--<![endif]-->
<head>
	<meta charset="utf-8">
	<title>' . $PROJECT_NAME . ' Documantion </title>
         <script src="http://code.jquery.com/jquery-1.7.1.js" type="text/javascript"></script>
		 <script src="assets/js/jquery.scrollTo.js"></script>
	<script>document.createElement("section");var duration="500",easing="swing";</script>
	<script src="assets/js/script.js"></script>
	<link rel="stylesheet" href="assets/css/documenter_style.css" media="all">
	
	
</head>
<body>

	<div id="documenter_sidebar"><a href="#documenter_cover" id="documenter_logo">' . $PROJECT_NAME . '</a>';
	
	$string .= '<input type="text" id="search_m" placeholder="Search..." />';
	$string .= '<ul id="documenter_nav">';
$i = 0;
foreach ($menus as $c) {

    $string .= '<li><a class="current" href="#' . str_replace(' ', '_', trim($c['name'])) . '">' . $c['name'] . '</a></li>';

    $i++;
}
$string .= '</ul><div id="documenter_copyright">Copyright '.date("Y").' APPLICONIC</a> 
		</div>
	</div>
	<div id="documenter_content">';
	
	$counter=1;
	foreach ($menus as $key=>$c) {
		$method = $c['method'];
		$name= $c['name'];
		$descp= $c['descp'];
		$params= $c['param'];
		$url= $c['url'];
		//$success = $c['reponseSuccess'];
		$resSuccess = "<pre>".$c['reponseSuccess']."</pre>";
		$resError = "<pre>".$c['reponseError']."</pre>";
		$string .= '<section id="' . str_replace(' ', '_',trim($name)) . '"><H1>' . $name . '</H1> <div class="btn_'.trim(strtolower($method)).'">' . $c['method'] . '</div><hr/> <table>';
		$string .= '<tr><th> Name  </th><Td>' . $name . '</td></tr>';
		$string .= '<tr><th> Url  </th><Td>' . $url . '</td></tr>';
		$string .= '<tr><th> Parameters  </th><Td>';
		$string .= '<table>';
		$string .= '<thead><tr><th class="theader">Name</th><th class="theader">Type</th><th class="theader">Required</th><th class="theader">Description</th></tr></thead><tbody>';
		foreach($params as $row) 
		{ 
			if(strtolower($row[2]) == 'r' ) { $r = $tickimage; } else { $r = $crossimage; }
			if(!empty($row[4])) { $s = str_replace('"', '',$row[4]); } else { $s =""; }
			$string .= '<tr><th >'.$row[0].'</th><td>'.$row[1].'</td><td>'.$r.'</td><td>'.$s.'</td></tr>';
		}
		$string .= '</tbody></table></td></tr>';
		
		$string .= '<tr><Th> Success  </th><Td>' . $resSuccess . '</td></tr>';
		$string .= '<tr><Th> Error  </th><Td>' . $resError . '</td></tr>';
		$string .= '<tr><Th> Description  </th><Td>' . $descp . '</td></tr>';
		$string .= '<tr><Th> Test Api  </th><Td>';
		$string .='<form action="'.$serverurl.trim($url).'" method="'.strtoupper(trim($method)).'" id="f_'.$counter.'" enctype="multipart/form-data"><table>';
		$string .='<input type="hidden" name="url" value="'.$serverurl.trim($url).'" >';
		$string .='<input type="hidden" name="method" value="'.strtoupper(trim($method)).'" >';
		foreach($params as $row) 
		{
				if(strtolower($row[1]) == 'file') {
					$inputField = '<input type="file" name="'.$row[0].'" value="'.$row[3].'" >';
				}
				else { $inputField = '<input type="text" name="'.$row[0].'" value="'.$row[3].'" >'; }
				
				if(strtolower($row[0]) == 'tag') {
					$inputField = '<input type="text" readonly style="background: rgba(153, 153, 153, 0.42);" name="'.$row[0].'" value="'.$row[3].'" >';
				}
				$string .= '<tr><th>'.Ucfirst($row[0]).'</th><Td>'.$inputField.'</td></tr>';
		}
		$string .='';
		$url =$serverurl.trim($url);
		$string .='<tr><td colspan="2"><a onClick="FormSubmitData(\''.$url.'\','.$counter.')" class="myButton">Test</a></td></tr>';
		$string .='<tr><td colspan="2"><div id="response_testapi_'.$counter.'"></div> </td></tr>';
		$string .='</table></form>';
		
		$string .='</td></tr>';
		//"#response_testapi_"+id
		
		$string .='</table></section>';
		$counter++;
		$i++;
	}
$string .= '</div></body></html>';

if (file_exists($file_name)) {
    unlink($file_name);
}
$file_name = fopen($file_name, 'a');
fwrite($file_name, $string);
fclose($file_name);
	
	
//print_r($menus); exit;



?>
