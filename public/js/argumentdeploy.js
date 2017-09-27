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

	var vmmanage = new Vue({
		el:'#head',
		data:{
			links:[
                {href:'index.html',target:'',tittle:'home',text:'Home'},
                {href:'manage.html',target:'',tittle:'ht',text:'Manage'},
				{href:'sms/CheckSms.html',target:'',tittle:'SMS log',text:'SMS log'},
				{href:'#',target:'',tittle:'Exit Login',text:'Exit Login'}
			],
			ht:'Exit Login'
		},

		//methods
		methods:{
			//退出登录
			exit_login:function(){
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
			}
		}
	});

	var vmbody = new Vue({
		el:'#main',
		data:{
			clients:[],//缓存选择的门店对象
			clientsback:[],
			storeid:[],//缓存选择的门店id
			storenames:[],//缓存重构已选择门店列表信息
			storeid_select:[],//缓存重构已选择门店列表id
			namelist:[],//缓存以下载的门店list
			select_main:[],//缓存下载的系统设置数据
			sys_main:[],//缓存参数类别
			sys_keyword:'',//缓存关键字
			sys_argument:[],//缓存重构的argument info
			argument_key:'',//参数选择关键字
			argument_sub:'',
			argument_main:'',
			argument_val:'',
			argument_valback:'',
			modal_show:[],
						
		},
		computed:{
			//
			main:function(){
				var tmplist = [];
				var ma = this.select_main;
				if(ma.length ===0) return ma;
				for(var i=0;i<ma.length;i++){
					if(i === 0){
						tmplist = ma[i];
					}
				}
				return tmplist;
			},
			
			//详细的参数列表
			arguments:function(){
				if(this.argument_key !== undefined){
					var main = this.sys_argument;
					var list = [];
					for(var i=0;i<main.length;i++){						
						if(main[i].main == this.argument_key) list.push(main[i]);
					}					
					return list;
				}
				return this.sys_argument;
			},
			//格式化modal-show
			shows:function(){
				var list = [];
				var show = this.modal_show;
				for(var i=0;i<show.length;i++){
					list.push({name:this.getname(show[i].id),status:show[i].data.status,info:show[i].data.info});
				}
				return list;
			}
		},
		watch:{
			//检测已选择的列表变化，更新storenames
			storeid:function(){
				this.storenames = [];
				for(var i=0;i<this.storeid.length;i++){
					for(var ii=0;ii<this.clients.length;ii++){
						if(this.clients[ii].id == this.storeid[i]){
							this.storenames.push({id:this.clients[ii].id,name:this.clients[ii].client_name,status:'cont success'});
						}
					}
				}
				//console.log(this.storenames);
			}		
		},
		methods:{
			//show modal
			show_modal:function(event){
				$("#modal2").modal("show");
				//console.log(event);
				this.argument_sub = event.target.innerText;
				this.argument_main = event.target.previousSibling.innerText;
				this.argument_val = event.target.nextSibling.innerText;
				
			},
			//post_argument_modify
			post_argument_modify:function(){
				console.log(this.storeid_select);
				for(var i=0;i<this.storeid_select.length;i++){					
					$.ajax({
						data:{
							sid:"set-argument",
							main:this.argument_main,
							sub:this.argument_sub,
							val:this.argument_val,
							storeid:this.storeid_select[i]
						},success:function(data){
							vmbody.modal_show.push(data);
						}
					});
				}
			},
			//get store list
			get_store_list:function(){
				$.ajax({
					type:'GET',
					url:'/get',
					data:{
						sid:"get-store-list-domain"
					},success:function(data){						
						vmbody.clients=data;
						vmbody.clientsback = data;
					}
				});
			},
			//显示argument
			show_batch_info:function(){
				this.mainnum = false;
				this.namelist = [];
				this.storeid_select = [];
				this.sys_argument = [];//清空
				var main = this.select_main;
				var list = [];
				for(var i=0;i<main.length;i++){ //循环已获取门店的参数列表
					var ma = main[i].data;
					this.namelist.push(this.getname(main[i].id));
					this.storeid_select.push(main[i].id);	//获取门店名称
					if(i === 0){ //判断是否为头一个门店，true则构建obj，预留val数组										
						for(var j=0;j<ma.length;j++){ //循环单个门店的data参数，获取参数列表
							var m = ma[j];						
							list.push({main:m.Main_Item,sub:m.Sub_Item,val:[m.Item_Value]});
						}
					}else{ //false则遍历list，sub&&main对号则push val数组
						for(var k=0;k<ma.length;k++){
							for(var l=0;l<list.length;l++){
								if(ma[k].Sub_Item === list[l].sub && ma[k].Main_Item === list[l].main){
									list[l].val.push(ma[k].Item_Value);
								}
							}
						}
					}
				}				
				this.sys_argument = list;
				//console.log(this.storeid_select);
			},
			//get store name
			getname:function(id){
				var names = this.storenames;
				for(var i=0;i<names.length;i++){
					if(names[i].id == id){
						return names[i].name;
					}
				}
			},
			//获取已选择列表的参数
			get_batch_info:function(){
				this.select_main = [];
				for(var i=0;i<this.storeid.length;i++){
					g(this.storeid[i],this.storeid.length,i);
				}				
				//
				function g(id,length,ilen){
					$.ajax({
						data:{
							sid:"get_reference_argument",
							storeid:id
						},success:function(data){
							//判断获取状态，							
							if(data.status == '0'){								
								setstatus(id,data.info,true);
								return;
							}
							//遍历data，获取item-main
							for(var i=0;i<data.length;i++){
								var vmain = vmbody.sys_main,
									main = data[i].Main_Item;
								if(vmain.indexOf(main) == -1){
									vmain.push(main);
								}
							}
							//push data to select_main
							vmbody.select_main.push({id:id,data:data});

							if(length-1 === ilen){ //判断是否执行到最后一个ajax，true则show_batch_info
								vmbody.show_batch_info();
							}
						}
					});
				}
				//设置storenames.status的状态参数变化
				function setstatus(id,info,bool){
					var s = vmbody.storenames;
					for(var i=0;i<s.length;i++){
						if(s[i].id == id && bool){
							s[i].status = info;
						}
					}
				}
			}
		},
		created:function(){
			this.get_store_list();
			
		}
	});
	
});
