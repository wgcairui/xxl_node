// JavaScript Document
$(document).ready(function(){
	"use strict";
	$.getScript('../js/wait.js');
	$.ajax({
		type:"GET",
		url:"/get",
		dataType:"json",
		data:{sid:"get_sms_list"},
		success:function(data){
			var html = "",
				num = data.length;
			$.each(data,function(i,item){
				console.log(item.stat);
				switch(item.stat){
					case 0:
						html +="<tr><td>"+item.id+"</td><td>"+item.store+"</td><td>"+item.tel+"</td><td>"+item.payment+"</td><td>"+item.modifydate+"</td><td><button class=\"btn btn-default\">标记完成</button></td></tr>";
						break;
					case 1:
						html +="<tr><td>"+item.id+"</td><td>"+item.store+"</td><td>"+item.tel+"</td><td>"+item.payment+"</td><td>"+item.modifydate+"</td><td>已完成</td></tr>";
						break;
				}
			});
			//console.log('');
			$("#smslist").empty().append(html);
			$("#foot").empty().append("条目总数为："+num+"..;");
		}
	});
	
	$("#smslist").on("click","button",function(){
		var first = $(this).parent().siblings().first().text();
		$.ajax({
			type:"GET",
			url:"/get",
			dataType:"json",
			data:{
				sid:"set-sms-status",
				id:first
			},
			success:function(data){
				console.log(data);
				$(this).remove();
				location.reload();
			}
		});
	});
});