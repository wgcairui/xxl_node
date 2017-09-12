$(document).ready(function(){
	"use strict";
	$.getScript('js/wait.js');	
	//登陆唤起modal
	$.ajaxSetup({
		type:'GET',
		url:'/get',
		dataType:'json'
	});
	$("#login").on("click",function(){
		$.ajax({
			type:"POST",
			url:"/login",
			dataType:"json",
			data:{				
				sid:"ch_login"
			},
			success:function(data){
				switch(data.status){
					case '1':
						location.href = data.info;
						break;
					case '0':
						//alert('超时请重新登陆');
						$("#loginin").modal("toggle");
						break;
					default:
						$("#loginin").modal("toggle");
						break;
				}
			}
		});
		
	});
	
	//登陆验证 --------------------------------------------
	$("#logins").on("click",function(){
		var data = {
			sid:"logins",
			user:$("#user").val(),
			passwd:$("#pass").val()
		};
		$.ajax({
			type:"POST",
			url:"/login",
			data:data,
			success:function(data){
				if(data.status === "1"){
					console.log("login ok");
					location.href = data.info;
				}else{
					$("#pass").val("");
					alert("密码错误");
					console.log("psaawd error");
				}
			},
			error:function(data){
				console.log(data);
				alert(data);
			}
		});
	});
	
	
	//请求xxl-down下载链接
	$.ajax({
		data:{
			sid:"xxl-down"
		},success:function(data){
			$.each(data,function(i,item){
				$("#xxl-down").append("<li class=\"list-group-item\"><a href=\"file/"+item+"\">"+item+"<span class=\"badge pull-right\"><span class=\"glyphicon glyphicon-folder-open\"></span></span></a></li>");
			});
			$("#xxl-down >li:gt(7)").addClass("hidden");
			
		},error:function(data){
			alert(data);
		}
	});
	$.ajax({
		data:{
			sid:"get-down-files"
		},success:function(data){
			$.each(data,function(i,item){
				$("#other-down").append("<li class=\"list-group-item\"><a class=\"tip\" target=\"_blank\" href=\""+item.adress+"\"le=\""+item.title+"\">"+item.name+"<span class=\"badge pull-right\"><span class=\"glyphicon glyphicon-cloud\"></span></span></a></li>");
			});
			$("#other-down").after("");
			$("#other-down >li:gt(7)").addClass("hidden");
		}
	});
	
	//显示更多元素
	$(".btn-link").on("click",function(){
		$(this).prev().find("li:gt(7)").removeClass("hidden");
		$(this).addClass("hidden");
	});
	
	
});