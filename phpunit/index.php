<?php
error_reporting(0);
class test {
	/**
     * @test (0, 0) == 0
     * @test (0, 1) == 5
     * @test (1, 0) == 1
     * @test (1, 1) == 2
     * @test (1, 2) < 4
	 * @test (1, 2) > 4
     */
	function add($a, $b) {
		
		return $a + $b;
		
	}
}

$test = new test();
$r = new ReflectionClass($test);
$fn = $r->getMethod('add')->getDocComment();

$pattern = '/@test(.*)/';
preg_match_all($pattern, $fn, $annotations);
$p="";
foreach($annotations[1] as $a) {
	$b = explode(") ",$a);
	$COND = str_replace("("," ",$b[0]);
	$operator_ans = explode(" ",$b[1]);
	$operator = $operator_ans[0];
	$ans = $operator_ans[1];
	$t = call_user_func_array(array($test,"add"), explode(",",$COND));
	switch($operator) {
		 case "==";
		
			if( $t == $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
		
		case ">";
			if( $t > $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
		
		case "<";
			if( $t < $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
		
		case "===";
			if( $t === $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
		case "!=";
			if( $t != $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
		
		case "!==";
			if( $t !== $ans)  {
				$p .= $a."  Passed <br/>";
			}
			else {
			
				$p .= $a."  Faild <br/>";
			}
		break;
	 }
		
		
}
echo $p;
