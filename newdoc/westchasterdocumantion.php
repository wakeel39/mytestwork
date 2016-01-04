<?php


////////////////format for testing////////

class Test
{
/**

@name  : getVechileList
@method: GET
@url   : json.php
@parms : tag string r getVechileList
@descp : 

*/
function getVechileList() { } 



/**

@name  : getUserPromoCode
@method: GET
@url   : json.php
@parms : tag string r getUserPromoCode
@parms : email string r us@yahoo.com "any valid passenger email"
@descp : 

*/
function getUserPromoCode() { } 

/**

@name  : getPromoCode
@method: GET
@url   : json.php
@parms : tag string r getPromoCode
@parms : email string r us1@yahoo.com "any valid passenger email"
@parms : promocode int r 12345 "any valid promocode"
@descp : 

*/
function getPromoCode() { } 

/**

@name  : getTotalUserCredit
@method: GET
@url   : json.php
@parms : tag string r getTotalUserCredit 
@parms : email string r us12@yahoo.com "any valid passenger email"
@descp : 

*/
function getTotalUserCredit() { } 



/**

@name  : getUsersPromo
@method: GET
@url   : json.php
@parms : tag string r getUsersPromo
@parms : email string r us122@yahoo.com "any valid passenger email"
@descp : 

*/

function getUsersPromo() { } 

/**

@name  : get_advanced_booking
@method: GET
@url   : json.php
@parms : user_email string r us123@yahoo.com "any valid passenger email"
@parms : job_start_time string r job 1230 "job start time"
@parms : start_late string r 1250 "start lat "
@parms : end_late string r 1630 "end late"
@parms : start_longe string r 114.2 "start longatitue"
@parms : end_longe string r 114.4 "end longatitue"
@parms : job_type string r normal "job type (Normal,Excutive)"
@parms : note string r goodjob "note"
@parms : passcount string r 55 "passgener counter"

@descp : 

*/

function get_advanced_booking() { } 


/**

@name  : userPaymentHistory
@method: GET
@url   : json.php
@parms : tag string r userPaymentHistory
@parms : txtb_email string r us124@yahoo.com "any valid passenger email"
@parms : trans_id string r 2,3 "comma separated transaction ids to get only limit transactions history"
@descp : 

*/
function userPaymentHistory() { } 

/**

@name  : AddUserCard
@method: GET
@url   : json.php
@parms : tag string r AddUserCard
@parms : txtb_email string r us125@yahoo.com "any valid passenger email"
@parms : trans_id string r 654466464 "Encrypted card String"
@parms : default string r 0 "default 0 OR 1"

@descp : 

*/
function AddUserCard() { } 


/**

@name  : getVehicleTypes
@method: GET
@url   : json.php
@parms : tag string r getVehicleTypes
@parms : type string r true "true or false"
@parms : message string r All Vehicle Types "All Vehicle Types" or "No Vehicle Types Found"
@parms : data string r  [1,2,3,4] "the Vehicle Types array"

@descp : 

*/

function getVehicleTypes() { } 

/**

@name  : getUserCards
@method: GET
@url   : json.php
@parms : tag string r getUserCards
@parms : txtb_email string r us126@yahoo.com "any valid passenger email"
@descp : 

*/

function getUserCards() { } 


/**

@name  : updateUserCard
@method: GET
@url   : json.php
@parms : tag string r updateUserCard
@parms : txtb_email string r us127@yahoo.com "any valid passenger email"
@parms : cardID int r 2255 "cardID"
@descp : 

*/

function updateUserCard() { } 


/**

@name  : deleteUserCards
@method: GET
@url   : json.php
@parms : tag string r deleteUserCards
@parms : txtb_email string r us127@yahoo.com "any valid passenger email"
@parms : cardID string r 2255,555 "comma separated user ID's"
@descp : 

*/

function deleteUserCards() { } 



/**

@name  : PaymentByNounce 
@method: GET
@url   : json.php
@parms : tag string r PaymentByNounce 
@parms : cardID int r 2255 "card id number, used for payment"
@parms : paymentNonce string r 4454 "valid nonce token for payment"
@parms : "txtb_email" string r us128@yahoo.com "any valid passenger email"
@parms : "paymentAmount" string r 65466 "valid amount"
@parms : "refference_id" int r 77 "trip reference id"
@descp : 

*/

function PaymentByNounce() { } 


/**

@name  : PaymentByCash  
@method: GET
@url   : json.php
@parms : tag string r PaymentByCash
@parms : "txtb_email" string r us129@yahoo.com "any valid passenger email"
@parms : "paymentAmount" string r 55548 "valid amount" 
@parms : "refference_id" int r 78 "trip reference id"
@descp : 

*/

function PaymentByCash() { } 

/**

@name  : sendPhoneCode  
@method: GET
@url   : json.php
@parms : tag string r sendPhoneCode
@parms : "type" string r true "true or false"
@parms : "message" string r Verification code sent "Verification code sent"
@parms : "verificationId" int r 78 "this verification code ID"
@parms : "phoneNumber" string r 923348688265 "the receive phone number"
@parms : "phoneCode" string r 5466165 "the code generated for phone number"

@descp : 

*/

function sendPhoneCode() { } 


/**

@name  : verifyPhoneCode  
@method: GET
@url   : json.php
@parms : tag string r verifyPhoneCode
@parms : "phoneNumber" string r 923348688265 "any valid phone number (without plus '+') like 923348688265"
@parms : "phoneCode" string r 645454 "code receives at mobile"

@descp : 

*/
function verifyPhoneCode() { } 


/**

@name  : driver_register  
@method: GET
@url   : json.php
@parms : tag string r driver_register
@parms : "txtb_name" string r hammeed "Driver User name"
@parms : "txtb_email" string r us129@yahoo.com "any valid passenger email"
@parms : "upassword" string r 7777744 "driver Password"
@parms : "cpassword" string r 7777744 "confirm_password"
@parms : "phone_no" string r 923348688265 "driver Phone No"
@parms : "professional_id_number" int r 51511 "driver card number"
@parms : "address" string r jk road islamabad "driver Address"
@parms : "car_brand" string r toyota "driver car Brand"
@parms : "model_year" int r 1982 "driver car model year"
@parms : "plates_no" string r 446565 "driver car plates no"
@parms : "licence_no" string r 6545594dd "driver licence no"
@parms : "txtCountry" string r pakistan "driver Country"
@parms : "txtCity" string r islamabad "driver City"
@parms : "platform" string r iphone "iphone or android"
@parms : "regId" string r 54545 "Driver device token/regId"
@parms : "file" string r driver.jpg "Driver image file or image link"
@descp : 

*/

function driver_register() { } 

/**

@name  : pass_register  
@method: GET
@url   : json.php
@parms : tag string r pass_register
@parms : "login" string r facebook "facebook or account"
@parms : "txtb_name" string r aliakram "passenger first name"
@parms : "txtb_email" string r us129@yahoo.com "any valid passenger email"
@parms : "txtb_password" string r 454545 "passenger account password"
@parms : "txtb_contactno" string r 923348688265 "passenger Contact No"
@parms : "txtb_gender" string r m "passenger gender"
@parms : "txtb_disability" string r none "passenger disability"
@parms : "regId" int r 5858 "passenger deviceToken"
@parms : "platform" string r iphone "iphone or android"
@parms : "txtb_businesscard" string r 5454 ""
@parms : "accountTitle" string r alikram ""
@parms : "sortCode" int r 1982 ""
@parms : "bankTitle" string r allied ""
@parms : "branchCode" string r 747 ""
@parms : "branchAddress" string r jinnahsuper,islamabad ""
@parms : "file" string r passengeraliakram.jpg "passenger image file or file link"
@descp : 

*/

function pass_register() { } 

/**

@name  : login  
@method: GET
@url   : json.php
@parms : tag string r login
@parms : "tag_type" int r passenger "passenger or driver"
@parms : "login" string r facebook "facebook or account"
@parms : "txtb_email" string r us130@yahoo.com "passenger account email address"
@parms : "txtb_password" string r 454545 "passenger account password"
@parms : "device_type" string r iphone "iphone or android"
@descp : 

*/

function login() { } 


/**

@name  : update_user_inf  
@method: GET
@url   : json.php
@parms : tag string r update_user_inf
@parms : "txtb_email" string r us129@yahoo.com "passenger/driver account email address""
@parms : "txtb_name" string r aliakram "passenger/driver account Name/Title"
@parms : "txtb_contactno" string r 923348688265 "passenger/driver account Contact Number"	
@parms : "txtb_gender" string r m  "M/F" or "m/f"
@parms : "txtb_disability" string r none "users disability"
@parms : "old_password" string r 5525222 "users old password"
@parms : "txtb_password" string r 454545 "users new password"
@parms : "file" string r passengeraliakram.jpg "passenger image file"
@descp : 

*/
function update_user_inf() { } 


/**

@name  : update_driver_info   
@method: GET
@url   : json.php
@parms : tag string r update_user_inf
@parms : "txtb_email" string r us129@yahoo.com "passenger/driver account email address""
@parms : "txtb_name" string r aliakram "passenger/driver account Name/Title"
@parms : "txtb_contactno" string r 923348688265 "passenger/driver account Contact Number"	
@parms : "txtb_gender" string r m  "M/F" or "m/f"
@parms : "txtb_password" string r 454545 "users new password"
@parms : "txtb_address" string r jinnah colony 
@parms : "txtb_city" string r islamabad "driver City"
@parms : "txtb_country" string r rawalpindi
@parms : "txtb_brand" string r toyota 
@parms : "txtb_model" string r corolla
@parms : "txtb_vtype" string r dsd
@parms : "txtb_year" string r 1989
@parms : "txtb_businesscard" string r 5454 ""

@parms : "accountTitle" string r alikram ""
@parms : "bankTitle" string r allied ""
@parms : "branchCode" string r 747 ""
@parms : "branchAddress" string r jinnahsuper,islamabad ""



@parms : "str_lang" string r english "english|arabic|dutch"
@parms : "lang_status" string r n "n|y|y|y|n|y|n"

@parms : "str_serv" string r wifi "wifi|baby Seats|Charger"
@parms : "serv_status" string r n "n|y|y|y|n|y|n"


@descp : 

*/

function update_driver_info() { } 

/**

@name  : on_click_boarding  
@method: GET
@url   : json.php
@parms : tag string r on_click_boarding
@parms : "email" string r us132@yahoo.com "driver account email"
@parms : "status" string r available "available or not available"
@descp : 

*/

function on_click_boarding() { } 

/**

@name  : logout  
@method: GET
@url   : json.php
@parms : tag string r logout
@parms : "email" string r us133@yahoo.com "passenger/driver account email address"
@descp : 

*/

function logout() { } 

/**

@name  : get_driver
@method: GET
@url   : json.php
@parms : "txtb_did" string r us134@yahoo.com "driver account email address"
@parms : "txtb_dlocations" string r 73.252525 "passenger location like 73.252525,74.639685"

@descp : 

*/
function get_driver() { } 

/**

@name  : get_passenger
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us135@yahoo.com "passenger account email address"
@descp : 

*/

function get_passenger() { } 

/**

@name  : update_driver_location
@method: GET
@url   : json.php
@parms : "txtb_email" string r us136@yahoo.com "driver account email address"
@parms : "txtb_locations" string r lat,lng "driver location array i.e.lat,lng||lat,lng||lat,lng||lat,lng||lat,lng
@parms : "journey" string r 0 "0 or 1" 

//send 1 when during on trip. else send 0, which means driver is not on trip
@descp : 

*/

function update_driver_location() { } 



/**

@name  : update_passenger_location
@method: GET
@url   : json.php
@parms : "txtb_email" string r us137@yahoo.com "passenger account email"
@parms : "txtb_latit" string r 33.445566 "passenger current location latitude"
@parms : "txtb_longi" string r 73.665544 "passenger current location longitude"

@descp : 

*/function update_passenger_location() { } 


/**

@name  : update_passenger_location2
@method: GET
@url   : json.php
@parms : "txtb_email" string r us138@yahoo.com "passenger account email"
@parms : "origins" string r 33.445566 "latitude of pick-up point"
@parms : "origine" string r 73.665544 "longitude of pick-up point"
@parms : "destinations" string r 33.445566 "latitude of drop-off point"
@parms : "destinatione" string r 73.665544 "longitude of drop-off point"

@parms : "circle" string r 30 "radius of the search from passenger current location"
@parms : "start_address" string r dsasdasd"address of the pick-up point"
@parms : "end_address" string r asadad "address of the drop-off point"
@parms : "txtb_vehType" string r 4x4 "vehicle type used by driver"


@descp : 

*/
function update_passenger_location2() { } 


/**

@name  : call_driver_booking
@method: GET
@url   : json.php
@parms : "booking_type" string r Normal_Booking "Normal_Booking"
@parms : "txtb_email" string r us139@yahoo.com "the passenger account email"

@parms : "refference_id" int r 55 "reference id which reference to details about pick-up and drop-off point"
@parms : "txtb_note" string r asdasd "passenger note to driver"
@parms : "passcount" string r 6 "passgener counter"



@descp : 

*/function call_driver_booking() { } 


/**

@name  : call_driver_booking2
@method: GET
@url   : json.php
@parms : "booking_type" string r Cancel_driver_call "Cancel_driver_call"
@parms : "txtb_email" string r us140@yahoo.com "the passenger account email"
@parms : "txtb_did" string r 5 "driver id"

@parms : "refference_id" int r 55 "reference id which reference to details about pick-up and drop-off point"


@descp : 

*/
function call_driver_booking2() { } 


/**

@name  : get_normal_booking_details
@method: GET
@url   : json.php
@parms : "refference_id" int r 55 "reference id which reference to details about pick-up and drop-off point"
@parms : "txtb_dlocations" string r 33.445566,73.665544 "driver location lat long with comma separated"


@descp : 

*/
function get_normal_booking_details() { } 



/**

@name  : driver_response_to_passenger_call
@method: GET
@url   : json.php
@parms : "txtb_pid" string r 5 us141@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"
@parms : "travel_time" string r 5 "driver reach time to passenger"


@descp : 

*/

function driver_response_to_passenger_call() { } 


/**

@name  : passenger_response_to_driver_call
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"
@parms : "drivers_ids" string r 5 1,2 "comma separated all drivers ids get in search list"


@descp : 

*/

function passenger_response_to_driver_call() { } 



/**

@name  : passenger_start_trip
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"



@descp : 

*/

function passenger_start_trip() { } 


/**

@name  : passenger_response_to_driver_call_new
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"
@parms : "drivers_ids" string r 5 1,2 "comma separated all drivers ids get in search list"



@descp : 

*/

function passenger_response_to_driver_call_new() { } 



/**

@name  : passenger_response_to_driver_call_accept
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function passenger_response_to_driver_call_accept() { } 


/**

@name  : passenger_refuse_driver_call
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function passenger_refuse_driver_call() { } 


/**

@name  : passenger_response_to_driver_call_reject
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function passenger_response_to_driver_call_reject() { } 

/**

@name  : driver_response_to_passenger_call_reject
@method: GET
@url   : json.php
@parms : "txtb_email" string r us140@yahoo.com "driver account email"
@parms : "txtb_pid" string r 5 us141@yahoo.com "passenger account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function driver_response_to_passenger_call_reject() { } 



/**

@name  : iAmArrived
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"

@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function iAmArrived() { } 



/**

@name  : start_boarding_by_driver
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"

@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function start_boarding_by_driver() { } 

/**

@name  : start_boarding_by_passenger
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"

@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function start_boarding_by_passenger() { } 


/**

@name  : end_boarding_by_passenger
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"

@parms : "txtb_did" string r 5 us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function end_boarding_by_passenger() { } 



/**

@name  : end_boarding_by_driver
@method: GET
@url   : json.php
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"

@parms : "txtb_did" string r us141@yahoo.com "driver account email"
@parms : "refference_id" int r 1430 "the call reference id"

@descp : 

*/function end_boarding_by_driver() { } 


/**

@name  : response_feedback
@method: GET
@url   : json.php
@parms : "refference_id" int r 1430 "Call reference id"
@parms : "txtb_pid" string r us140@yahoo.com "passenger account email"
@parms : "txtb_did" string r us141@yahoo.com "driver account email"
@parms : "txtb_comments" string r sadasdasd "any given comments"
@parms : "txtb_stars" string r 2 "range between 1-5"
@parms : "txtb_issuccessfull" string r y "y/n"
@parms : "txtb_ratedby" string r p "p/d" 


@descp : 

*/function response_feedback() { } 


/**

@name  : send_chat
@method: GET
@url   : json.php

@parms : "txtb_sid" string r us140@yahoo.com "the sender email"
@parms : "txtb_rid " string r 1,2 "comma separated receivers ids"
@parms : "chat_type " string r text "text or voice"
@parms : "txtb_msg " string r File "Chat Message or File"



@descp : 

*/function send_chat() { } 


/**

@name  : get_chat
@method: GET
@url   : json.php

@parms : "chat_id" int r 12


@descp : 

*/function get_chat() { } 


/**

@name  : journey_history
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "Passenger/Driver account Email"
@parms : "page_no " string r 12 "Range 1-N"
@parms : "page_rd " string r 15 "Range 1-N"


@descp : 

*/function journey_history() { } 



/**

@name  : advance_booking_jobs
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "Passenger/Driver account Email"
@parms : "page_no " string r 12 "Range 1-N"



@descp : 

*/function advance_booking_jobs() { } 




/**

@name  : job_cal
@method: GET
@url   : json.php

@parms : "refference_id" int r 1430 "Call reference id"


@descp : 

*/function job_cal() { } 



/**

@name  : job_cal2
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "Passenger account Email"
@parms : "txtb_did" string r 629  "driver id"


@descp : 

*/function job_cal2() { } 



/**

@name  : job_cal3
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "Driver account Email"
@parms : "txtb_did" string r 643  "driver id"


@descp : 

*/function job_cal3() { } 


/**

@name  : near_by_drivers
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "the user email address"
@parms : "txtb_did" string r 643  "driver id"
@parms : "origins" string r 33.445566 "the user latitude"
@parms : "origine" string r 73.665544 "the user longitude"
@parms : "txtb_vehType" string r asdas "the driver vehicle type"
@parms : "origine" string r 73.665544 "the user longitude"
@parms : "circle" string r 30 "the radius of circle to find the drives"
@descp : 

*/function near_by_drivers() { } 

/**

@name  : conversation_list
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "the email address of passenger or driver"
@parms : "page_no " string r 1 "The Page number default value is 1"
@parms : "page_rd " string r 25 "number of recodes per page" default value is 25"


@descp : 

*/function conversation_list() { } 


/**

@name  : chat_history
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "the email address of passenger or driver"
@parms : "page_no " string r 1 "The Page number default value is 1"
@parms : "page_rd " string r 25 "number of recodes per page" default value is 25"
@parms : "conver_ids " string r 15 "the specific conversation ids"


@descp : 

*/function chat_history() { } 


/**

@name  : update_regid
@method: GET
@url   : json.php

@parms : "txtb_email" string r us140@yahoo.com "the email address of passenger or driver"
@parms : "regId " string r 1 "Device regId"


@descp : 

*/function update_regid() { } 
}
?>