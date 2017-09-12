<?php
require_once("..\php\PDO_class.php");
require("SUBMAIL_PHP_SDK\app_config.php");
require("SUBMAIL_PHP_SDK\lib\messagexsend.php");
try{
	$sid = $_GET['sid'];
	$my = new PDO_my();
	
	switch($sid){
		case "get-territory":
			$result = $my->my_query("SELECT id,territory FROM `territory`","array");
			break;
			
		case "select-store":
			$result = $my->my_query("SELECT id,client_name,territory FROM `client_data`","array");
			break;
			
		case "money":
			$result = $my->my_query("SELECT template,money FROM `rechargetemplate`","array");
			break;
			
		case "pay-success":
			$store = $_GET['store'];
			$tel = $_GET['tel'];
			$payment = $_GET['payment'];
			switch($payment){
				case "alipay":
					$pay = "支付宝支付";
					break;
				case "wxpay":
					$pay = "微信支付";
					break;
				default:
					$pay = "undefault";
					break;
			}
			
			//send to client
			$sms = new MESSAGEXsend($message_configs);
			$content = array("store"=>$store,"payment"=>$pay);
			$requst_sms = Send_SMS($sms,$tel,"ALEJG3",$content);
			
			//send to admin
			$num = check_sms_stat();
			$contents = array("store"=>$store,"payment"=>$pay,"num"=>$num);
			$requst_sms_admin = Send_SMS($sms,"15337364316","xS5hJ4",$contents);
			
			if($requst_sms['status'] = "success"){
				$result = array("error"=>1,"info"=>$requst_sms,"admin"=>$requst_sms_admin);
			}else{
				$result = array("error"=>0,"info"=>$requst_sms,"admin"=>$requst_sms_admin);
			}						
			break;
			
		case "get_sms_list":
			$result = $my->my_query("SELECT * FROM `sms_pay`","array"); 
			break;
		
		case "set-sms-status":
			$id = $_GET['id'];
			$num = $my->my_query("UPDATE `sms_pay` SET `stat`=1,`modifydate`=now() WHERE id='$id'","num");
			$result=array("error"=>1,"info"=>$num);
			break;
			
	}
	echo_jsonencode($result);
}catch(Exception $e){
	echo $e;
}

//send SMS
function Send_SMS($class_sms,$tel,$label,$array){
	//start 开始作为短信提醒发送;		
			$sms = $class_sms;
			$sms->SetTo($tel);
			$sms->SetProject($label);
			foreach($array as $key=>$val){
				$sms->AddVar($key,$val);
			}
			$requst_sms = $sms->xsend();
	
	//write database
	//echo(gettype($requst_sms));
	$array_re =$requst_sms;
	
	if(is_array($array_re)){
		
		$my = new PDO_my();
		
		$status = $array_re['status'];
		$send_id = $array_re['send_id'];
		$fee = $array_re['fee'];
		$sms_credits = $array_re['sms_credits'];	
		$sql = "INSERT INTO `client`.`sms_send_receipt` (`status`, `send_id`, `fee`, `sms_credits`, `modifydate`) VALUES ( '$status', '$send_id', '$fee', '$sms_credits', now());";
		$my->my_query($sql,"num");
		
		//检测到短信发放到client端
		if($label = "ALEJG3"){
			$store = $array['store'];
			$payment = $array['payment'];
			$sql1 = "INSERT INTO `client`.`sms_pay` (`store`,`tel`,`payment`,`send_id`,`modifydate`) VALUES ('$store','$tel','$payment','$send_id',now());";
			$my->my_query($sql1,"num");
		}	
	}	
	return($array_re);
}

//check SMS_SEND_stat
function check_sms_stat(){
	$my = new PDO_my();
	$sms_send = $my->my_query("SELECT store,tel,payment FROM `sms_pay` WHERE stat = 0","array");
	$num = count($sms_send);
	return($num);	
}
?>