<?php 
class DocClass
{
	
	function getDocCommentObject($objname,$fn) {
		$descpPattern = '/@'.$objname.'(.*)/';
		preg_match_all($descpPattern, $fn, $obj);
		return $obj;
	}

	function filterObj($str) {
		return str_replace(":","",$str);
	}

	//file uploading with curl
	//echo PostData('http://localhost/src/imagestest.php',"Chrysanthemum.jpg");

	function PostData($target_url,$method_name,$api_request_parameters)
	{
			$method_name= strtoupper(trim($method_name));
		//This needs to be the full path to the file you want to send.
		//$file_name_with_full_path = realpath($filename); 
		/* curl will accept an array here too.
		 * Many examples I found showed a url-encoded string instead.
		 * Take note that the 'key' in the array will be the key that shows up in the
		 * $_FILES array of the accept script. and the at sign '@' is required before the
		 * file name.
		 */
		//$post = array('extra_info' => '123456','file_contents'=>'@'.$file_name_with_full_path);
		$ch = curl_init();
		
		// Set request method to POST start
		//curl_setopt($ch, CURLOPT_POST,1);
		//curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
		

		if ($method_name == 'DELETE')
		{
		  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
		  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($api_request_parameters));
		}

		if ($method_name == 'GET')
		{
		  $target_url .= '?' . http_build_query($api_request_parameters);
		}

		if ($method_name == 'POST')
		{
		  curl_setopt($ch, CURLOPT_POST, TRUE);
		  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($api_request_parameters));
		}

		if ($method_name == 'PUT')
		{
		  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
		  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($api_request_parameters));
		}
		
		// Set request method to POST end 
		curl_setopt($ch, CURLOPT_URL,$target_url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		$result=curl_exec ($ch);
		curl_close ($ch);
		return $result;
	}
	
	
	function prettyPrint( $json )
	{
		$result = '';
		$level = 0;
		$in_quotes = false;
		$in_escape = false;
		$ends_line_level = NULL;
		$json_length = strlen( $json );

		for( $i = 0; $i < $json_length; $i++ ) {
			$char = $json[$i];
			$new_line_level = NULL;
			$post = "";
			if( $ends_line_level !== NULL ) {
				$new_line_level = $ends_line_level;
				$ends_line_level = NULL;
			}
			if ( $in_escape ) {
				$in_escape = false;
			} else if( $char === '"' ) {
				$in_quotes = !$in_quotes;
			} else if( ! $in_quotes ) {
				switch( $char ) {
					case '}': case ']':
						$level--;
						$ends_line_level = NULL;
						$new_line_level = $level;
						break;

					case '{': case '[':
						$level++;
					case ',':
						$ends_line_level = $level;
						break;

					case ':':
						$post = " ";
						break;

					case " ": case "\t": case "\n": case "\r":
						$char = "";
						$ends_line_level = $new_line_level;
						$new_line_level = NULL;
						break;
				}
			} else if ( $char === '\\' ) {
				$in_escape = true;
			}
			if( $new_line_level !== NULL ) {
				$result .= "\n".str_repeat( "\t", $new_line_level );
			}
			$result .= $char.$post;
		}

		return $result;
	}

}

?>