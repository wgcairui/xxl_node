<?php
require("../php/PDO_class.php");
if(isset($_GET['name'])){
	$name = $_GET['name'];
	$ip = $_SERVER['REMOTE_ADDR'];
	$date = date("Y-m-d h:i:sa");
	
	$my = new PDO_my();
	$storeid = $my->my_query("select `id` FROM `client_data` WHERE `client_name`='$name'","val");
	if($storeid){
		$stat = $my->my_query("UPDATE `client`.`client_data` SET `net`='$ip',`sing_date`=now() WHERE  `id`='$storeid'","num");
		$str = "IP:".$ip.";注册名;".$name.";时间戳：".$date.";-----更新门店id：".$storeid.";stat:".$stat;
	}else{
		$str = "IP:".$ip.";注册名;".$name.";时间戳：".$date.";-----更新失败；未能找到对应门店信息，门店未注册或名称不相符；";
	}
		
	echo($str);
	my_log($str,"ip更新");
}
?>