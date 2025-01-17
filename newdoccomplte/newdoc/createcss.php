<?php

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
		pre {
			background-color: #000;
			color: #fff;
			max-height: 200px;
			overflow: auto;
			padding: 20px;
			height:auto;
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
		#documenter_copyright{display:block !important;visibility:visible !important;}
		
		.myButton {
	-moz-box-shadow:inset 0px 1px 0px 0px #9acc85;
	-webkit-box-shadow:inset 0px 1px 0px 0px #9acc85;
	box-shadow:inset 0px 1px 0px 0px #9acc85;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #74ad5a), color-stop(1, #68a54b));
	background:-moz-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
	background:-webkit-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
	background:-o-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
	background:-ms-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
	background:linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#74ad5a", endColorstr="#68a54b",GradientType=0);
	background-color:#74ad5a;
	border:1px solid #3b6e22;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:13px;
	font-weight:bold;
	padding:6px 12px;
	text-decoration:none;
}
.myButton:hover {
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #68a54b), color-stop(1, #74ad5a));
	background:-moz-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
	background:-webkit-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
	background:-o-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
	background:-ms-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
	background:linear-gradient(to bottom, #68a54b 5%, #74ad5a 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#68a54b", endColorstr="#74ad5a",GradientType=0);
	background-color:#68a54b;
}
.myButton:active {
	position:relative;
	top:1px;
}
.theader {     background: #61AD3D;
    color: #fff; }
#search_m { margin: 5px; width: 86%; }
		';
		
//if (!file_exists($css_file_name)) {
$file_name = fopen($css_file_name, 'a');
fwrite($file_name, $css_string);
fclose($file_name);
 ?>