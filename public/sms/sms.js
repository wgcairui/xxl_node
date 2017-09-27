// JavaScript Document
$(document).ready(function(){
	"use strict";
	$.getScript('../js/wait.js');
	$.ajaxSetup({
		sync:"true",
		type:"GET",
		dataType:"json",
		url:"/get"
	});
	//Vue js
	var sms = new Vue({
		el:"#sms",
		data:{
			territorylist:[],
			storelist:[],
			storelisttemp:[],
			territoryname:"",
			storename:"",
			territory:"",
			moneytemplate:[],
			money:0,
			tel:1,
			show:{
				selectpay:true,
				pic:false,
				picsrc:""
					}
		},
		watch:{
			territoryname:function(){
				for(var i=0,l=this.territorylist.length;i<l;i++){				
					var ii = this.territorylist[i];
					if(ii.id === this.territoryname){
						this.territory = ii.territory;
						break;
					}
				}				
				//search store
				var temp = [],
					tname = this.territory,
					slist = this.storelisttemp;
				for(var a=0,b=slist.length;a<b;a++){
					if(slist[a].territory === tname){
						temp.push(slist[a]);
					}	
				}
				this.storelist = temp;
			}
		},
		methods:{
			quest_ok:function(){
				if(this.storename === "" || this.tel == 1){
					alert("argment error");
				}else{
					console.log(this.storename+this.tel);
					$("#pay").modal("show");
				}
			}
		}
		
	});
	
	var vm_pay = new Vue({
		el:"#pay",
		data:sms.$data,
		computed:{
			tedsrc:function(){
				return "pay/"+this.show.picsrc+".jpg";
			}
		},
		methods:{
			
			alipay:function(){
				this.show.selectpay = false;
				this.show.pic = true;
				this.show.picsrc = "alipay";
			},
			wxpay:function(){
				this.show.selectpay = false;
				this.show.pic = true;
				this.show.picsrc = "wxpay";
			},
			refreshpay:function(){
				this.show.selectpay = true;
				this.show.pic = false;
				this.show.picsrc = "";
			},
			pay:function(){
				$.ajax({
					data:{
							sid:"pay-success",
							store:this.storename,
							tel:this.tel,
							payment:this.show.picsrc
						},
						success:function(data){
							console.log(data);
							if(data.error === 1){
								console.info(this.storename+"提交成功；");
								alert("已成功发送请求，请耐心等待！！！");
								$("#pay").modal("hide");
							}else{
								alert("提交失败，请联系技术支持人员（15337364316）");
							}
							
						}
				});
			}			
		}
	});
	console.log(vm_pay.$data);
	//获取地域列表
	$.ajax({
		data:{
			sid:"get-territory"
		},
		success:function(data){
			sms.territorylist=data;
		}
	});
	
	//获取门店信息留存
	$.ajax({
			data:{sid:"select-store"},
			success:function(data){
				sms.storelist = data;
				sms.storelisttemp = data;
			}
	});	
	//获取充值信息留存
	$.ajax({
		data:{sid:"money"},
		success:function(data){
			sms.moneytemplate = data;
		}
	});
	
});