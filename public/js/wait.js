// 下载wait片段，监听ajax sytart，end事件
console.info('get wait event!!');
$('body').append('<div id = "wait"></div>');
$("#wait").load('doc/wait.html');

$(document).ajaxStart(function(){
	$("#modal1").modal("show");
	console.log("ajaxStart  "+Date());
});
$(document).ajaxStop(function(){
	$("#modal1").modal("hide");
	console.log("ajaxStop  "+Date());
});
$.getScript('js/check-login.js');
//interval
/*
window.setInterval(this.CheckLogin,240000);
//检查登录情况
function CheckLogin(){
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
				console.log("verification status, stat = 1");
				$("body").empty();
				location.href="index.html";
				return false;
			}else{
				$("body").empty();
				location.href="index.html";
				return false;
			}
		}
	});	
}
*/
