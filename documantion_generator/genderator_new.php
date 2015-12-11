<?php

$PROJECT_NAME = "Ishura";
$dir = "doc/";
// create doc folder
if (!file_exists($dir) && !is_dir($dir)) {
    mkdir($dir, 0777);
}

// create assests folder
$asset = $dir . "assets";
if (!file_exists($asset) && !is_dir($asset)) {
    mkdir($asset, 0777);
}
// create js folder
$asset_js = $dir . "assets/js/";
if (!file_exists($asset_js) && !is_dir($asset_js)) {
    mkdir($asset_js, 0777);
}
// create css folder 
$asset_css = $dir . "assets/css/";
if (!file_exists($asset_css) && !is_dir($asset_css)) {
    mkdir($asset_css, 0777);
}

// create js file 
$css_file_name = $asset_css . "documenter_style.css";
$css_string = "
html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,a,abbr,acronym,address,big,cite,code,del,dfn,em,font,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td{
	margin:0;
	padding:0;
	border:0;
	outline:0;
	font-weight:inherit;
	font-style:inherit;
	font-size:100%;
	font-family:inherit;
	vertical-align:baseline;
}
html { 
	font-size:101%;
	font-family:Arial,verdana,arial,sans-serif;
	font-size:12px;
	-webkit-text-size-adjust:none;
	color:#6F6F6F;
	background-color:#efefef;
}
body{
	min-height:100%;
	height:auto;
	width:100%;
}
footer, header, section {
	display:block;
}
a{ color:#6F6F6F; text-decoration:none; cursor:pointer; }
a:hover { text-decoration:underline }
p, ul, ol{
	margin:18px 0;
	line-height:1.5em;
}
li{
	list-style:none;
}
li.placeholder{
	height:70px;
	width:100%;
	font-size:16px;
}
hr { 
	display:block;
	height:0px;
	line-height:0px;
	border:0;
	border-top:1px solid #ddd;
	border-bottom:1px solid #aaa;
	margin:16px 0;
	padding:0;
	clear:both;
	float:none;
}
hr.notop{
	margin-top:0;
}
strong{
	font-weight:700;
}
#documenter_buttons{
	position:absolute;
	right:10px;
	margin-top:-30px;
}
.btn{
	cursor:pointer;
	width:auto;
	padding:7px 7px 8px;
	border-radius:3px;
	border:1px solid #ccc;
}
.btn:hover{
	border:1px solid #B1B4B0;
	box-shadow:0px 2px 2px rgba(0,0,0,0.1);
	-moz-box-shadow:0px 2px 2px rgba(0,0,0,0.1);
	-webkit-box-shadow:0px 2px 2px rgba(0,0,0,0.1);
	text-decoration:none;
}
.btn:active{
	border:1px solid #B1B4B0;
	box-shadow:inset 0px 2px 2px rgba(0,0,0,0.1);
	-moz-box-shadow:inset 0px 2px 2px rgba(0,0,0,0.1);
	-webkit-box-shadow:inset 0px 2px 2px rgba(0,0,0,0.1);
	background-color:#eee;
}

#documenter_content{
	position:absolute;
	right:18px;
	left:218px;
	padding-left:10px;
	padding-bottom:800px;
	min-height:100%;
	height:auto;
	z-index:1;
	    background: #fff;
}
#documenter_sidebar{
	-moz-box-shadow:0 0 6px rgba(3,3,3,0.6);
	-webkit-box-shadow:0 0 6px rgba(3,3,3,0.6);
	box-shadow:0 0 6px rgba(3,3,3,0.6);
	position:fixed;
	left:0;
	width:200px;
	height:100%;
	min-height:100%;
	z-index:100;
}
#documenter_sidebar a{
	position:relative;
	z-index:100;
}
img{
	border:0;
}
#documenter_copyright{
	position:absolute;
	bottom:10px;
	font-size:10px;
	right:15px;
	width:200px;
	text-align:right;
	z-index:1
}
noscript{
	display:block;
	position:absolute;
	top:238px;
	margin:0 auto;
	width:800px;
	bottom:0;
	z-index:20;
}
noscript p{
	width:800px;
	font-size:20px;
	padding-top:20px;
	margin:0 auto;
	color:#4D4D4D;
}
.small{
	font-size:10px;
	letter-spacing:0;
}

/*----------------------------------------------------------------------*/
/* Sidebar
/*----------------------------------------------------------------------*/

#documenter_sidebar #documenter_logo{
	display:block;
	
	width:200px;
	background-position:center center;
	background-repeat:no-repeat;
}
#documenter_sidebar ul{
	font-size:12px;
	font-weight:700;
	min-height:150px;
	height:75%;
	overflow:auto;
}

#documenter_sidebar ul li{
	text-align:right;
	padding:0;
}
#documenter_sidebar ul a{
	display:block;
	border-top:1px solid #ddd;
	border-bottom:1px solid #aaa;
	padding:6px 15px 7px 0;
	text-align:right;
}
#documenter_sidebar ul a:hover,#documenter_sidebar ul a.current{
	-webkit-text-shadow:none;
	-moz-text-shadow:none;
	text-shadow:none;
	text-decoration:none;
}
#documenter_sidebar ul li ul{
	border-top:0;
	font-size:10px;
	min-height:10px;
	height:auto;
	overflow:auto;
	margin:0;
	display:none;
}
#documenter_sidebar ul li ul li a{
	display:block;
	padding:4px 15px 5px 0;
	text-align:right;
}

/*----------------------------------------------------------------------*/
/* Content
/*----------------------------------------------------------------------*/

#documenter_cover{
	position:relative;
	height:800px;
	padding-top:200px !important;
}
#documenter_cover li{
	list-style:none !important;
	margin-left:0 !important;
}
#documenter_cover p{
	width:500px;
}
#documenter_content section{
	padding-top:70px;
}
#documenter_content h1{
	font-size:30px;
	font-weight:700;
}
#documenter_content h2{
	font-size:20px;
	margin-bottom:18px;
	font-weight:100;
}
#documenter_content h3{
	font-size:26px;
	margin:18px 0 0;
	font-weight:100;
}
#documenter_content h4{
	font-size:20px;
	margin:18px 0;
	font-weight:100;
}
#documenter_content h5{
	font-size:16px;
	margin:18px 0;
	font-weight:100;
}
#documenter_content h6{
	font-size:14px;
	margin:18px 0;
	font-weight:100;
}
#documenter_content p{
	margin:18px 0;
}
#documenter_content ol li{
	list-style:decimal;
	margin-left:36px;
}
#documenter_content ul li{
	list-style:square;
	margin-left:36px;
}
#documenter_content dl{
}
#documenter_content dl dt{
	padding-top:12px;
	font-weight:700;
	font-size:14px;
}
#documenter_content dl dd{
	padding-top:3px;
	margin-left:18px;
}


#documenter_content .warning{
	padding:10px 10px 10px 30px;
	border:1px solid #D5D458;
	background-color:#F0FEB1;
	background-image:url(img/warning.png);
	background-repeat:no-repeat;
	background-position: 8px 11px;
}
#documenter_content .info{
	padding:10px 10px 10px 30px;
	border:1px solid #6AB3FF;
	background-color:#A3D0FF;
	background-image:url(img/info.png);
	background-repeat:no-repeat;
	background-position: 8px 11px;
}
#documenter_content div.alert {
  padding: 8px 35px 8px 14px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  background-color: #fcf8e3;
  border: 1px solid #fbeed5;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
#documenter_content div.alert-success,#documenter_content  div.alert-success div.alert-heading {
  color: #468847;
}
#documenter_content div.alert-danger,#documenter_content  div.alert-error {
  background-color: #f2dede;
  border-color: #eed3d7;
}
#documenter_content div.alert-danger,
#documenter_content div.alert-error,
#documenter_content div.alert-danger div.alert-heading,
#documenter_content div.alert-error div.alert-heading {
  color: #b94a48;
}
#documenter_content div.alert-info {
  background-color: #d9edf7;
  border-color: #bce8f1;
}
#documenter_content div.alert-info,#documenter_content  div.alert-info div.alert-heading {
  color: #3a87ad;
}
#documenter_content div.alert-block {
  padding-top: 14px;
  padding-bottom: 14px;
}
#documenter_content div.alert-block > p,#documenter_content  div.alert-block > ul {
  margin-bottom: 0;
}
#documenter_content div.alert-block p + p {
  margin-top: 5px;
}





/*----------------------------------------------------------------------*/
/* Print Styles
/*----------------------------------------------------------------------*/

@media print {
	 
	thead { display: table-header-group; } /* css-discuss.incutio.com/wiki/Printing_Tables */
	tr, img { page-break-inside: avoid; }
	@page { margin: 0.5cm; }
	p, h2, h3 { orphans: 3; widows: 3; }
	h2, h3{ page-break-after: avoid; }
	hr { border-top:1px solid #000 !important;border-bottom:0 !important; }
	
	#documenter_sidebar{
		-moz-box-shadow:none;
		-webkit-box-shadow:none;
		box-shadow:none;
		position:absolute;
		left:10px;
		top:0;
		width:100%;
		margin-top:500px;
	}
	#documenter_sidebar ul:before { content: 'Table of Contents'; }
	
	#documenter_sidebar ul{
		border:0 !important;
	}
	#documenter_sidebar ul li{
		border:0 !important;
		text-align:left;
	}
	#documenter_sidebar ul li a{
		border:0 !important;
		text-align:left;
		padding:4px;
	}
	#documenter_sidebar ul li a:hover{
		border:0 !important;
	}
	#documenter_sidebar #documenter_logo{
		display:none;
	}
	#documenter_sidebar #documenter_copyright{
		display:none;
	}
	#documenter_content{
		left:10px;
	}
	#documenter_cover{
		margin-bottom:300px;
	}
	#documenter_content .warning{
		background-image:url(img/warning.png) !important;
		background-repeat:no-repeat !important;
		background-position: 8px 11px !important;
	}
	#documenter_content .info{
		background-image:url(img/info.png) !important;
		background-repeat:no-repeat !important;
		background-position: 8px 11px !important;
	}
}";
$css_string .='table {
  border-collapse: collapse;
  width: 95%;
  margin: 0 0 20px 0;
}

th {
  background-color: #f5f5f5;
  text-align: left;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 700;
  padding: 4px 8px;
  border: #e0e0e0 1px solid;
}

td {
  vertical-align: top;
  padding: 2px 8px;
  border: #e0e0e0 1px solid;
}

        .btn_post {       font-family: "Source Sans Pro", sans-serif;
                            font-weight: 600;
                            font-size: 15px;
                            display: inline-block;
                            padding: 2px 5px;
                            border-radius: 6px;
                            text-transform: uppercase;
                            background-color: #3387CC;
                            color: #ffffff;
                   }
                   .btn_get {         
                            font-family: "Source Sans Pro", sans-serif;
                            font-weight: 600;
                            font-size: 15px;
                            display: inline-block;
                            padding: 2px 5px;
                            border-radius: 6px;
                            text-transform: uppercase;
                            background-color: green;
                            color: #ffffff;
                   }
		html{background-color:#EEEEEE;color:#383838;}
		::-moz-selection{background:#333636;color:#008C9E;}
		::selection{background:#333636;color:#008C9E;}
		#documenter_sidebar #documenter_logo{
    background: #376BCA;
    color: #fff;
    font-size: 30px;
 
    text-align: center;
    vertical-align: middle;
    margin-top: 12px;
    padding: 20px 0px;}
		a{color:#008C9E;}
		.btn {
			border-radius:3px;
		}
		.btn-primary {
			  background-image: -moz-linear-gradient(top, #0088CC, #006673);
			  background-image: -ms-linear-gradient(top, #0088CC, #006673);
			  background-image: -webkit-gradient(linear, 0 0, 0 0088CC%, from(#333636), to(#006673));
			  background-image: -webkit-linear-gradient(top, #0088CC, #006673);
			  background-image: -o-linear-gradient(top, #0088CC, #006673);
			  background-image: linear-gradient(top, #0088CC, #006673);
			  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#0088CC", endColorstr="#006673", GradientType=0);
			  border-color: #006673 #006673 #bfbfbf;
			  color:#FFFFFF;
		}
		.btn-primary:hover,
		.btn-primary:active,
		.btn-primary.active,
		.btn-primary.disabled,
		.btn-primary[disabled] {
		  border-color: #0088CC #0088CC #bfbfbf;
		  background-color: #006673;
		}
		hr{border-top:1px solid #D4D4D4;border-bottom:1px solid #FFFFFF;}
		#documenter_sidebar, #documenter_sidebar ul a{background-color:#333636;color:#FFFFFF;}
		#documenter_sidebar ul a{-webkit-text-shadow:1px 1px 0px #494F4F;-moz-text-shadow:1px 1px 0px #494F4F;text-shadow:1px 1px 0px #494F4F;}
		#documenter_sidebar ul{border-top:1px solid #212424;}
		#documenter_sidebar ul a{border-top:1px solid #494F4F;border-bottom:1px solid #212424;color:#FFFFFF;}
		#documenter_sidebar ul a:hover{background:#333636;color:#008C9E;border-top:1px solid #333636;}
		#documenter_sidebar ul a.current{background:#333636;color:#008C9E;border-top:1px solid #333636;}
		#documenter_copyright{display:block !important;visibility:visible !important;}';
//if (!file_exists($css_file_name)) {
$file_name = fopen($css_file_name, 'a');
fwrite($file_name, $css_string);
fclose($file_name);
//}
// create scrollTo js files 
$js_file_name = $asset_js . "jquery.scrollTo.js";
$js_string = "/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);";
//if (!file_exists($js_file_name)) {
$file_name = fopen($js_file_name, 'a');
fwrite($file_name, $js_string);
fclose($file_name);
//}
// create script js files 
$js_file_name = $asset_js . "script.js";
$js_string = "/*!
 * Documenter 2.0
 * http://rxa.li/documenter
 *
 * Copyright 2011, Xaver Birsak
 * http://revaxarts.com
 *
 */
 
$(document).ready(function() {
	var timeout,
		sections = new Array(),
		sectionscount = 0,
		win = $(window),
		sidebar = $('#documenter_sidebar'),
		nav = $('#documenter_nav'),
		logo = $('#documenter_logo'),
		navanchors = nav.find('a'),
		timeoffset = 50,
		hash = location.hash || null;
		iDeviceNotOS4 = (navigator.userAgent.match(/iphone|ipod|ipad/i) && !navigator.userAgent.match(/OS 5/i)) || false,
		badIE = $('html').prop('class').match(/ie(6|7|8)/)|| false;
		
	//handle external links (new window)
	$('a[href^=http]').bind('click',function(){
		window.open($(this).attr('href'));
		return false;
	});
	
	//IE 8 and lower doesn't like the smooth pagescroll
	if(!badIE){
		window.scroll(0,0);
		
		$('a[href^=#]').bind('click touchstart',function(){
			hash = $(this).attr('href');
			$.scrollTo.window().queue([]).stop();
			goTo(hash);
			return false;
		});
		
		//if a hash is set => go to it
		if(hash){
			setTimeout(function(){
				goTo(hash);
			},500);
		}
	}
	
	
	//We need the position of each section until the full page with all images is loaded
	win.bind('load',function(){
		
		var sectionselector = 'section';
		
		//Documentation has subcategories		
		if(nav.find('ol').length){
			sectionselector = 'section, h4';
		}
		//saving some information
		$(sectionselector).each(function(i,e){
			var _this = $(this);
			var p = {
				id: this.id,
				pos: _this.offset().top
			};
			sections.push(p);
		});
		
		
		//iPhone, iPod and iPad don't trigger the scroll event
		if(iDeviceNotOS4){
			nav.find('a').bind('click',function(){
				setTimeout(function(){
					win.trigger('scroll');				
				},duration);
				
			});
			//scroll to top
			window.scroll(0,0);
		}

		//how many sections
		sectionscount = sections.length;
		
		//bind the handler to the scroll event
		win.bind('scroll',function(event){
			clearInterval(timeout);
			//should occur with a delay
			timeout = setTimeout(function(){
				//get the position from the very top in all browsers
				pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				
				//iDeviceNotOS4s don't know the fixed property so we fake it
				if(iDeviceNotOS4){
					sidebar.css({height:document.height});
					logo.css({'margin-top':pos});
				}
				//activate Nav element at the current position
				activateNav(pos);
			},timeoffset);
		}).trigger('scroll');

	});
	
	//the function is called when the hash changes
	function hashchange(){
		goTo(location.hash, false);
	}
	
	//scroll to a section and set the hash
	function goTo(hash,changehash){
		win.unbind('hashchange', hashchange);
		hash = hash.replace(/!\//,'');
		win.stop().scrollTo(hash,duration,{
			easing:easing,
			axis:'y'			
		});
		if(changehash !== false){
			var l = location;
			location.href = (l.protocol+'//'+l.host+l.pathname+'#!/'+hash.substr(1));
		}
		win.bind('hashchange', hashchange);
	}
	
	
	//activate current nav element
	function activateNav(pos){
		var offset = 100,
		current, next, parent, isSub, hasSub;
		win.unbind('hashchange', hashchange);
		for(var i=sectionscount;i>0;i--){
			if(sections[i-1].pos <= pos+offset){
				navanchors.removeClass('current');
				current = navanchors.eq(i-1);
				current.addClass('current');
				
				parent = current.parent().parent();
				next = current.next();
				
				hasSub = next.is('ul');
				isSub = !parent.is('#documenter_nav');
				
				nav.find('ol:visible').not(parent).slideUp('fast');
				if(isSub){
					parent.prev().addClass('current');
					parent.stop().slideDown('fast');
				}else if(hasSub){
					next.stop().slideDown('fast');
				}
				win.bind('hashchange', hashchange);
				break;
			};
		}	
	}
	
    // make code pretty
    window.prettyPrint && prettyPrint();
	
});";
//if (!file_exists($js_file_name)) {
$file_name = fopen($js_file_name, 'a');
fwrite($file_name, $js_string);
fclose($file_name);
//}

$file_name = (__DIR__) . "/doc/" . "index.html";
$inputfile = (__DIR__) . "/test_doc.php";
$tokens = token_get_all(file_get_contents($inputfile));
//echo "<pre>"; print_r($tokens); exit;
$comments = array();
foreach ($tokens as $token) {

    if ($token[0] == T_COMMENT || $token[0] == T_DOC_COMMENT) {
        $token = str_replace("/*", "", $token[1]);
        $token = str_replace("*/", "", $token);
        $token = str_replace("*", "", $token);
        $comments[] = $token;
    }
}
//echo "<pre>"; print_r($comments); exit;
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

$a = array();
foreach ($comments as $key => $comment) {

    $ex = explode("\n", $comment);
    //print_r($ex); exit;
    foreach ($ex as $line) {
        $line = preg_replace('/\s+/', ' ', $line);
        if (!empty($line)) {
            $d = explode(":", $line);
            //print_r($line); exit;
            if (count($d) > 0 && $d[0] != ' ' && !empty($d[0]) && $d[1] != ' ' && !empty($d[1])) {
                //print_r($d); exit;
                $ind = preg_replace('/\s+/', '', $d[0]);
                $a[$key][$ind] = $d[1];
            }
        }
    }
    //$a[$key]['NAME'] = $
    //print_r($ex); exit;
    // $string .= "\n---------------------------------------------------------------------------------------------------";
}
//print_r($a); exit;
$string .= '<ul id="documenter_nav">';
$i = 0;
foreach ($a as $c) {

    $string .= '<li><a class="current" href="#' . str_replace(' ', '_', $c['NAME']) . '">' . $c['NAME'] . '</a></li>';

    $i++;
}
$string .= '</ul><div id="documenter_copyright">Copyright 2015 APPLICONIC</a> 
		</div>
	</div>
	<div id="documenter_content">';

foreach ($a as $key=>$c) {
    $method = preg_replace('/\s+/', '', $c['Method']);
    $pa = explode(",", $c['PARAMS']);
    $res = explode(",", $c['RESPONSE']);
    $string .= '<section id="' . str_replace(' ', '_', $c['NAME']) . '"><H1>' . $c['NAME'] . '</H1> <div class="btn_' . strtolower($method) . '">' . $c['Method'] . '</div><hr/> <table>';
	foreach($c as $k=>$n) { 	
                $string .= '<tr><Th>' . $k . '</th><Td>' . $n . '</td></tr>';
        }		
    $string .='</table></section>';

    $i++;
}
$string .= '</div></body></html>';

if (file_exists($file_name)) {
    unlink($file_name);
}
$file_name = fopen($file_name, 'a');
fwrite($file_name, $string);
fclose($file_name);
?>