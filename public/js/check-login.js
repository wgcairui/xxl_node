// JavaScript Document

$(document).ready(function(){
	"use strict";	
	//检测登陆状态；
	var stat = 1;
	CheckLogin();
	$("*").hover(function(){
		stat = 1;
	});
	var setint1 = window.setInterval(CheckLogin,600000);
	

	function CheckLogin(){
		if(stat === 1){
		$.ajax({
			type:"POST",
			url:"/login",
			data:{
				sid:"ch_login"
			},
			success:function(data){
				switch(data.status){
					case "0":
						$("body").empty();
						console.log("verification error, stat = 1");
						location.href="index.html";
						return false;
					break;
					case '1':
						return console.log("verification success ");
					break;
					case '3':
						clearInterval(setint1);
						console.log('clenr setinterval');
						return;
					break;
					default:
						location.href="index.html";
					break;
				}
			}
		});
			stat = 0;
		}
	}
});
