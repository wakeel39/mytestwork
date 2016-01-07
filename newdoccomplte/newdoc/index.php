<?php 
set_time_limit(0);
$PROJECT_NAME = "West Chester";
$serverurl = "http://52.34.59.23/WestChesterRideCorp/";
$dir = "doc/";

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
		 
		 <script src="assets/js/jquery.ajax-cross-origin.min.js"></script>
        <script src="assets/js/jquery.scrollTo.js"></script>
	<script>document.createElement("section");var duration="500",easing="swing";</script>
	<script src="assets/js/script.js"></script>
	<link rel="stylesheet" href="assets/css/documenter_style.css" media="all">
	
	
</head>
<body>

	<div id="documenter_sidebar"><a href="#documenter_cover" id="documenter_logo">' . $PROJECT_NAME . '</a>';
	
	
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
		$string .= '<tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>';
		foreach($params as $row) 
		{ 
			if(strtolower($row[2]) == 'r' ) { $r = 'Yes'; } else { $r = 'No'; }
			$string .= '<tr><td>'.$row[0].'</td><td>'.$row[1].'</td><td>'.$r.'</td><td>'.str_replace('"', '',$row[4]).'</td></tr>';
		}
		$string .= '</table></td></tr>';
		
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
					$inputField = '<input type="text" readonly name="'.$row[0].'" value="'.$row[3].'" >';
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
	
	
print_r($menus); exit;



?>
