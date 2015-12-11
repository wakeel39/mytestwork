<?php
$PROJECT_NAME = "Isura";
$file_name = (__DIR__) . "/".$PROJECT_NAME."_documantion.txt";
$inputfile = (__DIR__) . "/json.php";
$tokens = token_get_all(file_get_contents($inputfile));
//print_r($tokens);
$comments = array();
foreach ($tokens as $token) {
    if ($token[0] == T_COMMENT || $token[0] == T_DOC_COMMENT) {
        $token = str_replace("/*", "", $token[1]);
        $token = str_replace("*/", "", $token);
        $comments[] = $token;
    }
}

$string = "";
foreach ($comments as $comment) {
    //$string .= "\n---------------------------------------------------------";
    $string .= "\n".$comment;
    $string .= "\n---------------------------------------------------------------------------------------------------";
}
if (file_exists($file_name)) {
    unlink($file_name);
}
$file_name = fopen($file_name, 'a');
fwrite($file_name, $string);
fclose($file_name);
?>