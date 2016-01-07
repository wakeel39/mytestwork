<?php 

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

?>