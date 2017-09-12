// JavaScript Document
$(document).ready(function(){
	"use strict";
	$(".tip").tooltip();
	//modal wait
	$.getScript('js/wait.js');
	//配置ajax默认参数
	$.ajaxSetup({
				type:"POST",
				url:"/post",
				dataType:"json"
			});
	
	//检测登陆状态；
	var stat = 1;
	CheckLogin();
	$("*").hover(function(){
		stat = 1;
	});
	window.setInterval(CheckLogin,60000);
	
	//查询信息list
	GetStoreInfo("select-name");
	$("#select-submit").on("click",function(){
		if(!CheckLogin()){
			
			$.ajax({
			url:'/get',
			type:'GET',
			data:{
				sid:"get-store-info",
				select:$("#select-name>option:selected").val()
			},success:function(data){
				$("#store-info").empty();
				var html = "";
				$.each(data,function(i,item){
					html += "<tr><td>"+i+"</td><td>"+item+"</td></tr>";
				});	
				$("#store-info").append(html);
			}
		});
		}
		
	});
	//删除门店信息-------
	$("#delete-store").on("click",function(){
		var selectid = $("#select-name>option:selected").val();
		$.ajax({
			url:'/get',
			type:'GET',
			data:{
				sid:"delete-store",
				select:selectid
			},success:function(data){
				//$("#store-info >option[value="+selectid+"]").remove();
				GetStoreInfo("select-name");
				if(data.status === "1"){
					alert(data.info);
				}else{
					alert(data.info+":已成功删除此记录。。");
				}				
			}
		});
	});
	
	//修改客户信息
	$("#store-info").on("click","td:last-child",function(){
		
		$("#modal3").modal("toggle");
		var key = $(this).prev().text(),
			val = $(this).text(),
			inp = $("#modify-val");
		$("#modify-val > label").text(key);
		inp.children().last().remove();
		switch(key){
			case "territory":
				var str = "<select class=\"form-control\"></select>";				
				inp.append(str);
				var selsct = inp.find("select");
				get_territory_info(selsct);				
				break;
			default:
				inp.append("<input type=\"text\" required class=\"form-control\" id=\"val\">");
				$("#modify-val > input").val(val);
				break;
		}		
		
	});
	
	$("#modifyval").on("click",function(){
		var store = $("#select-name>option:selected").val(),
			key = $("#modify-val > label").text(),
			val="";
			if(key === "territory"){
				val=$("#modify-val select>option:selected").text();
			}else{
				val=$("#modify-val > input").val();
			}
		if(!CheckLogin()){
			$.ajax({
			type:'POST',
			url:'/post',
			data:{
				sid:"modifyval",
				store:store,
				valname:key,
				val:val
			},
			success:function(data){
				console.log(data.info);				
				$("#modal3").modal("toggle");
				$("#select-submit").click();
			}
		});
		}
		
	});
	
	//添加链接 -----------------------------------------------------------------------
		$("#d").on('click',function(){
			if(!CheckLogin()){
				var name = $("#d-ipname").val();
				var adress = $("#d-ipadress").val();
				if(name !== '' && adress !== ''){
					$.ajax({
						type:'POST',
						url:'/post',
					data:{
						sid:"update-link-adress",
						name:name,
						adress:adress
					},success:function(data){
						alert("已插入记录："+data.info);
					}
				});
				}else{
					alert("值不能为空");
				}			
			}
			
		});
	
	// 添加本地文件上传 -----------------------------------------------------------------------------
	$("#file").on("click",function(){
		
	});
	
	//添加门店 ========================================================================================================================
	$("#add-store-update").on("click",function(){
		if(!CheckLogin()){
			/*var store = {
			sid:"update-store-info",
			cname:$("#cname").val(),
			csname:$("#csname").val(),
			cspasswd:$("#cspasswd").val(),
			cdbuser:$("#cdbuser").val(),
			cdbpasswd:$("#cdbpasswd").val(),
			csip:$("#csip").val(),
			cslinkman:$("#cslinkman").val(),
			cstel:$("#cstel").val(),
			cwifi:$("#cwifi").val(),
			cruser:$("#cruser").val(),
			crpasswd:$("#crpasswd").val(),
			cmid:$("#cmid").val(),
			cmname:$("#cmname").val(),
			cmpasswd:$("#cmpasswd").val(),
			cmyz:$("#cmyz").val(),
			cndomain:$("#cndomain").val(),
			cnuser:$("#cnuser").val(),
			cnpasswd:$("#cnpasswd").val(),
			cremark:$("#cremark").val()
		};*/
			var seriz = $("#storeinfo").serializeArray(),
				obj_s = {sid:"update-store-info"};
			
			for(var i=0,l=seriz.length;i<l;i++){
				var obj = seriz[i].name,
					value = seriz[i].value;
				obj_s[obj]=value;
			}
			
			console.info(obj_s);
		
		$.ajax({
			type:'POST',
			url:'/post',
			data:obj_s,
			success:function(data){
				if(data.status !== '0'){
					alert("提交成功，return(1)");
					GetStoreInfo("select-name"); //更新门店列表;;
				}else{
					alert(data.info);
				}
			}
		});
		
		}
		
	});

	$("#exit_login").click(function(){
		$.ajax({
			type:'GET',
			url:'/get',
			data:{sid:'exit_login'},
			success:function(data){
				CheckLogin();
			},
			error:function(data){
				href.location ='index.html';
			}	
		});
	});
	
	//添加territory info
	$("#addstore").click(function(){
		if($(this).hasClass("collapsed")){
				$("#territory").empty();
				get_territory_info($("#territory"));
		}
		
	});
	
	// 查询日志 =============================================================================
	$("#get-log").on("click",function(){
		
		$.ajax({
			type:'GET',
			url:'/get',
			data:{				
				sid:"get-log",
				limit:$("#loglimit").val()
			},success:function(data){
		
				var html = "";
				$.each(data,function(i,item){
					html += "<tr><th>"+item.id+"</th><td>"+item.incident+"</td><td>"+item.operate+"</td><td>"+item.tims+"</td></tr>";
				});
				$("#loginfo").empty().append(html);
			}
		});
		
	});
	
	$("#del-log").on("click",function(){
		$("#loginfo").empty();
	});
	// 函数===============================================================================================================
	function GetStoreInfo(id){
		$.ajax({
			type:'GET',
			url:'/get',
			data:{
				sid:"get-store-list"
			},success:function(data){
				$("#"+id).empty();				
				$.each(data,function(i,item){					
					$("#"+id).append("<option value=\""+item.id+"\">"+item.client_name+"</option>");
				});
			}
		});
	}
	
	function CheckLogin(){
		if(stat === 1){
		$.ajax({
			type:"POST",
			url:"login",
			data:{
				sid:"ch_login"
			},
			success:function(data){
				if(data.status === "1"){
					console.log("verification success ");
					return true;
				}else if(data.status === "0"){
					console.log("verification status, stat = 1");
					$("body").empty();
					alert("verification status, stat = 1");
					location.href="index.html";
					return false;
				}else{
					alert("verification status, stat id undenfine");
					location.href="index.html";
					return false;
				}
			}
		});
			stat = 0;
		}
	}
	
	function get_territory_info(obj){
		var str="";
		$.ajax({
			type:'GET',
			url:'/get',
			data:{
				sid:"get-territory-info"
			},
			success:function(data){				
				$.each(data,function(i,item){
					str += "<option value=\""+item.id+"\">"+item.territory+"</option>";
				});
				obj.append(str);
				return true;
			}
			
		});
		
	}
});
