// 下载wait片段，监听ajax sytart，end事件
console.info('get wait event!!');
$("#wait").load('doc/wait.html');

$(document).ajaxStart(function(){
	$("#modal1").modal("show");
	console.log("ajaxStart  "+Date());
});
$(document).ajaxStop(function(){
	$("#modal1").modal("hide");
	console.log("ajaxStop  "+Date());
});

