// JavaScript Document
$(function(){
	"use strict";
	//配置ajax默认参数
	$.ajaxSetup({
				type:"GET",
				url:"/get",
				dataType:"json"
	});
	$.getScript('js/wait.js');
	//查询信息list
	GetStoreInfo("select-name");
	var stores; //缓存选择的门店对象
	var select_store = []; //缓存选择的门店id
	var select_main = [];
	
	//显示选择器
	$("#select-store").click(function(){
		stores = $("#select-name>option:selected");
		var checkbox = $("#checkbox"),
			html = "";
		select_store = [];
		checkbox.empty();
		stores.each(function(){
			var text = $(this).text();
			var val = $(this).val();			
			select_store.push(val);
			html+="<div class=\"radio\"><label><input type=\"radio\" name=\"radio\" id=\""+val+"\" value=\""+val+"\">"+text+"</label></div>";
		});
		checkbox.append(html);
	});
	
	//show select-reference
	$("#checkbox").on("focusin",".radio",function(){
		$("#select-reference").removeClass("hidden");
	});
	
	//确定参考系之后提交，刷新设置参数
	$("#select-reference").click(function(){
		var select_refereence_store = $("#checkbox input:checked").val(),
			html="";
		
		$.ajax({
			data:{				
				sid:"get-reference-argument",				
				//storeid:select_store.join("-"),
				reference_store:select_refereence_store				
			},
			success:function(data){
				if(data.length > 100){
					var argument_tbody = $("#argument-tbody");
					$("#argument-thead").empty();
					argument_tbody.empty();
					$("#argument-thead").append("<th>main</th><th>Argument</th><th>参考门店</th>");					
					$.each(data,function(i,item){
						if(item.main_item !== "技师钟数统计模板"){
							html +="<tr><td>"+item.main_item+"</td><td>"+item.sub_item+"</td><td>"+item.item_value+"</td></tr>";
							select_main.push(item.main_item);
						}
						argument_tbody.append(html);
					});	
					
					//处理类别选择表单 seach-main
					var temp = un(select_main),
						str="";
					for(var a=0;a<temp.length;a++){	
						str+="<option value=\""+a+"\">"+temp[a]+"</option>";
					}
					$("#seach-main").append(str);
					
				//下面开始获取已选择门店列表的参数值；
					for(var i=0;i<select_store.length;i++){
						if(select_store[i] !== select_refereence_store){
							get_s(i);							
						}
						
					}
					
					
				}else if(data.id === "1"){
					console.log(data.info+data.error);
					alert(data.log+"==错误代码"+data.error);
				}else{
					alert(data);
				}				
			}		
		
		});	
			
	});
	//按类别显示
	$("#seach-mainin").click(function(){
		
		var select_main = $("#seach-main>option:selected").text();
		var tr = $("#argument-tbody>tr");
		tr.removeClass("hidden")
		.not(function(){			
			return $(this).children().eq(0).text() === select_main;
		}).addClass("hidden");
	});
	
	//按模糊搜索显示
	$("#seach-itemin").click(function(){
		var select_item = $("#seach-item").val();
		var tr = $("#argument-tbody>tr");
		tr.removeClass("hidden")
		.not(function(){
			return $(this).children().eq(1).text().indexOf(select_item) > 0;
		}).addClass("hidden");
	});
	
	//修改配置
	$("#argument-tbody").on("click","tr",function(){
		var main = $(this).children().eq(1).text();
		var item = $(this).children().eq(2).text();
		$("#argument-name-label").text(main);
		$("#argument-name").val(item);
		$("#argument-name").show();
		$("#show-set-success").empty();
		$("#modal2").modal("show");
		
	});
	
	$("#argumrnt-configure").click(function(){
		var main = $("#argument-name-label").text();
		var item = $("#argument-name").val();
		if(item === ""){
			return false;
		}
		$.ajax({
			data:{
				sid:"set-argument",
				main:main,
				item:item,
				storelist:select_store
			},
			success:function(data){
				var show_set_success = $("#show-set-success"),
					html ="";
				show_set_success.empty();
				$("#argument-name").hide();
				$.each(data,function(i,item){
					console.log(item);
					html +="<label class=\"label label-success center-block\">"+get_store_name(item.storeid)+":"+item.info+"</label>";		
				});
				show_set_success.append(html);
			}
		});
	});
	
	
	
	//数组去重
	function un(array){
		var tmp = [];
		var json = {};
		for(var i=0;i<array.length;i++){
			if(!json[array[i]]){
				tmp.push(array[i]);
				json[array[i]] = 1;
			}
		}
		//console.log(tmp);
		return tmp;
	}
	
	//获取函数
	function get_s(i){
		$.ajax({
			data:{
				sid:"get-store-argument",
				reference_store:select_store[i]
			},
			success:function(data){
				var name = get_store_name(select_store[i]);
				if(data.length > 100){
					$("#argument-thead").append("<th>"+name+"</th>");
					$.each(data,function(i,item){
						var td = $("#argument-tbody td:contains("+item.sub_item+")");
						if(td.prev().text() == item.main_item){
							var tr = td.parent();						
							tr.append("<td>"+item.item_value+"</td>");
						}						
					});					
				}else{
					select_store.splice(i,1);
					console.log(name+data.info);
					console.log(select_store);
				}
			}
		});
	}
	
	function get_store_name(id){
		return($("#select-name>option[value='"+id+"']").text());
	}
	
	//获取门店列表
	
	function GetStoreInfo(id){
		$.ajax({
			url:"/get",
			data:{
				
				sid:"get-store-list-domain"
			},success:function(data){
				$("#"+id).empty();
				$("#panel1").removeClass("hidden");
				$.each(data,function(i,item){					
					$("#"+id).append("<option value=\""+item.id+"\">"+item.client_name+"</option>");
				});
			}
		});
	}
});