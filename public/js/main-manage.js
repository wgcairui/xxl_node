// JavaScript Document

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

	var vmmanage = new Vue({
		el:'#head',
		data:{
			links:[
                {href:'index.html',target:'',tittle:'home',text:'Home',type:'link'},
                {href:'http://www.microcloud.asia',target:'_blank',tittle:'休闲乐微云程序',text:'微信-微云',type:'link'},
                {href:'http://regxxl.microcloud.asia',target:'_blank',tittle:'账号35630密码210',text:'软件新注册/延期',type:'link'},
				{href:'#smslog',target:'',tittle:'SMS log',text:'SMS log',type:'btn'},
				{href:'#',target:'',tittle:'Exit Login',text:'Exit Login',type:'btn'}
			],
			ht:'Exit Login'
		},

		//methods
		methods:{
			//检测事件唤醒的键
			check_event:function(e){
				var innertext = e.target.innerText;
				switch(innertext){
					case 'SMS log':
						if(sms.smslist.length > 1) sms.get_sms_log();
						sms.show = true;
						return;
					break;

					case 'Exit Login':
						this.exit_login();
					break;
				}
			},
			//退出登录
			exit_login:function(){
				$.ajax({
					type:'GET',
					url:'/get',
					data:{sid:'exit_login'},
					success:function(data){
					    location.href="index.html";
					},
					error:function(data){
						href.location ='index.html';
					}	
				});
			}
		}
	});

	var manage1 = new Vue({
		el:'#manage1',
		data:{
			class_btn:['btn','btn-default','btn-block','btn-primary'],
			clients:[],//门店列表
			clientsback:[],//门店列表备份
			storeid:0,//门店id
			storeinfo:[],//门店信息
			keyword:'',//检索关键字
			modify:{  //
				val:'',
				pre:'',
				valback:''
			},
			modal_body:true,//if modalbody show
			modal:{
				ids:'modal3',
				btntext:'确认修改',
				title:'Modify Store Info'
			},
			territorys:[],
			optionlist:[],//缓存modify modal option
			sqlversion:["SQL2000",'SQL2005',"SQL2008","SQL2008r2","SQL2012"],
			link_name:'',
			link_src:'',
			log_num:100,
			logs:[],

			//reg
			reg_key:'',
			reg_date:'',
			key:''
		},
		computed:{
			//获取选择的店名
			storename:function(){
				//console.log(this.storeid);
				if(!this.storeid) return ('未选择');
				for(var i=0;i<this.clients.length;i++){
					if(this.clients[i].id == this.storeid){
						return(this.clients[i].client_name);
					}
				}				
			},
			//添加网址前戳
			link_srccm:function(){
				return ("http://"+this.link_src);
			},
			//formart date
			getdate:function(){
				if(this.reg_date === ''){
					var d = new Date();
					var Y = d.getFullYear(),
						M = d.getMonth()+1,
						D = d.getDate();
					
					this.reg_date = [Y,M,D].join('-');
					return this.reg_date;
				}
				return this.reg_date;
			}
		},
		watch:{
			//监视模糊关键字变化
			keyword:function(){
				this.clients = this.clientsback;
				var list = [];
				var len = this.clients.length;
				for(var i=0;i<len;i++){
					var name = this.clients[i].client_name;					
					if(name.indexOf(this.keyword) !== -1){
						list.push(this.clients[i]);
					}
				}
				this.clients = list;
			},
			log_num:function(){
				if(this.log_num > 200){
					this.log_num = 200;
				}
			}
		},
		methods:{
			//reg xxl
			reg_xxl:function(){
				$.ajax({
					url:'/post',
					type:'POST',
					data:{
						sid:'xxl_register',
						key:this.reg_key,
						regdate:this.reg_date
					},
					success:function(data){
						manage1.key = data.Body;
					}
				})
			},
			
			//获取门店详细信息
			get_storeinfo:function(){
				$.ajax({
					url:'/get',
					type:'GET',
					data:{
						sid:"get-store-info",
						select:this.storeid
					},success:function(data){
						manage1.storeinfo = data;
					}
				});
			},
			//删除门店信息
			delete_store:function(){
				$.ajax({
					url:'/get',
					type:'GET',
					data:{
						sid:"delete-store",
						select:this.storeid
					},success:function(data){						
						if(data.status === "1"){
							alert(data.info);
						}else{
							alert(data.info+":已成功删除此记录。。");
						}				
					}
				});
			},
			//打印出modal值
			modify_value:function(event){
				this.modify.pre = event.target.previousSibling.innerText;
				this.modify.val = event.target.innerText;
				this.modify.valback = event.target.innerText;
				console.log(this.modify.val);
				$("#modal3").modal("show");
				switch (this.modify.pre){
					case "territory":
						this.modal_body = false;
						if(this.territorys.length >0){
							this.optionlist = this.territorys;
						}else{
							this.get_modify_val("get-territory-info",'territory');
						}						
					break;
					case "Sql_version":
						this.modal_body = false;
						this.optionlist = this.sqlversion;
					break;
					default:
						this.modal_body = true;
					break;
				}
			},
			//修改客户信息参数值
			modify_quest:function(){
				if(this.modify.val === this.modify.valback){
					alert('值没有变动，操作提交error；');
					return;
				}
				$.ajax({
					type:'POST',
					url:'/post',
					data:{
						sid:"modifyval",
						store:this.storeid,
						valname:this.modify.pre,
						val:this.modify.val
					},
					success:function(data){
						if(data.status === '1'){
							manage1.storeinfo[manage1.modify.pre] = manage1.modify.val;
							console.log(data.info);								
						}else if(data.status === '0'){
							alert("数据提交错误；"+data.info);
						}						
						$("#modal3").modal("toggle");
					}
				});
			},

			//获取参数list
			get_modify_val:function(sid,key){
				if(this.optionlist.length > 0) return this.optionlist;
				$.ajax({
					type:'GET',
					url:'/get',
					data:{
						sid:sid
					},
					success:function(data){
						var list = [];
						for(var i=0;i<data.length;i++){
							list.push(data[i][key]);
						}
						manage1.optionlist = list;
						if(sid === 'get-territory-info'){
							manage1.territorys = list;
						}	
					}					
				});
			},
			//get store list
			get_store_list:function(){
				$.ajax({
					type:'GET',
					url:'/get',
					data:{
						sid:"get-store-list"
					},success:function(data){
						manage1.clients=data;
						manage1.clientsback = data;
					}
				});
			},
			//add-store-update
			add_store_update:function(){
				var seriz = $("#storeinfo").serializeArray(),
					obj_s = {sid:"update-store-info"};			
				for(var i=0,l=seriz.length;i<l;i++){
					var obj = seriz[i].name,
						value = seriz[i].value;
					obj_s[obj]=value;
				}			
				//console.info(obj_s);		
				$.ajax({
					type:'POST',
					url:'/post',
					data:obj_s,
					success:function(data){
						if(data.status !== '0'){
							alert("提交成功;"+data.info);
							manage1.get_store_list(); //更新门店列表;;
							$("#addstore").click();
						}else{
							alert(data.info);
						}
					}
				});
			},
			//add link src
			add_link:function(){
				if(this.link_name !== '' && this.link_src !== ''){
					$.ajax({
						type:'POST',
						url:'/post',
						data:{
							sid:"update-link-adress",
							name:this.link_name,
							adress:this.link_srccm
						},success:function(data){
							alert("已插入记录："+data.info);
							manage1.link_name = '';
							manage1.link_src = '';
						}
					});
				}
			},
			//get log
			get_log:function(){
				$.ajax({
					type:'GET',
					url:'/get',
					data:{				
						sid:"get-log",
						limit:this.log_num
					},success:function(data){				
						manage1.logs = data;
					}
				});
			},
			//del_log
			del_log:function(){
				this.logs = [];
			}
		},
		created:function(){
			//get storelist
			this.get_store_list();
			this.get_modify_val("get-territory-info",'territory');
		}
	});

	// manage2 ------------------------------
	var manage2 = new Vue({
		el:'#manage2',
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
				if(this.argument_key == 'all') return this.sys_argument;
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
						type:'GET',
						url:'/get',
						data:{
							sid:"set-argument",
							main:this.argument_main,
							sub:this.argument_sub,
							val:this.argument_val,
							storeid:this.storeid_select[i]
						},success:function(data){
							manage2.modal_show.push(data);
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
						manage2.clients=data;
						manage2.clientsback = data;
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
						url:'/get',
						type:'GET',
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
								var vmain = manage2.sys_main,
									main = data[i].Main_Item;
								if(vmain.indexOf(main) == -1){
									vmain.push(main);
								}
							}
							//push data to select_main
							manage2.select_main.push({id:id,data:data});

							if(length-1 === ilen){ //判断是否执行到最后一个ajax，true则show_batch_info
								console.log('last get argument ajax;length:'+length+';/i:'+ilen+1);
								manage2.show_batch_info();
							}else{
								console.log('last get argument ajax;length:'+length+'/i:'+ilen+1);
							}
						}
					});
				}
				//设置storenames.status的状态参数变化
				function setstatus(id,info,bool){
					var s = manage2.storenames;
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

	//SMS 
	var sms = new Vue({
		el:'#smslog',
		data:{
			smslist:[],
			show:false
		},
		computed:{
			listnum:function(){
				return this.smslist.length;
			}
		},
		methods:{
			get_sms_log:function(){
				$.ajax({
					type:"GET",
					url:"/get",
					dataType:"json",
					data:{sid:"get_sms_list"},
					success:function(data){
						sms.smslist = data;
					}
				});
			},
			setlogstat:function(id){
				//console.log(id);
				$.ajax({
					type:"GET",
					url:"/get",
					dataType:"json",
					data:{
						sid:"set-sms-status",
						id:id
					},
					success:function(data){
						console.log(data);
						sms.get_sms_log();
					}
				});
			}
		},
		mounted:function(){
			this.get_sms_log();
		}
	});

	//el footer
	var footer = new Vue({
		el:'#footer'
	});
