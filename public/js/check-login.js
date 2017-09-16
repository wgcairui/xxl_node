// JavaScript Document

$(document).ready(function(){
	"use strict";
	
	//检测登陆状态；
	var stat = 1;
	CheckLogin();
	$("*").hover(function(){
		stat = 1;
	});
	window.setInterval(CheckLogin,600000);
	

	function CheckLogin(){
		if(stat === 1){
		$.ajax({
			type:"POST",
			url:"/login",
			data:{
				sid:"ch_login"
			},
			success:function(data){
				if(data.status === "1"){
					console.log("verification success ");
					return true;
				}else if(data.status === "0"){
					console.log("verification error, stat = 1");
					$("body").empty();
					//alert("verification error, stat = 1");
					location.href="index.html";
					return false;
				}else{
					//alert("verification error, stat id undenfine");
					location.href="index.html";
					return false;
				}
			}
		});
			stat = 0;
		}
	}
});
