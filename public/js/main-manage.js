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
	var vmmanage = new Vue({
		el:'#head',
		data:{
			links:[
                {href:'index.html',target:'',tittle:'home',text:'Home'},
                {href:'http://www.microcloud.asia',target:'_blank',tittle:'休闲乐微云程序',text:'微信-微云'},
                {href:'http://regxxl.microcloud.asia',target:'_blank',tittle:'账号35630密码210',text:'软件新注册/延期'},
                {href:'ArgumentDeploy.html',target:'',tittle:'批量修改门店设置',text:'批量修改门店设置'},
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
					    location.href="index.html";
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
						console.log(data);
						for(var i in data) console.log(i);
						vmbody.key = data;
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
						vmbody.storeinfo = data;
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
							vmbody.storeinfo[vmbody.modify.pre] = vmbody.modify.val;
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
						vmbody.optionlist = list;
						if(sid === 'get-territory-info'){
							vmbody.territorys = list;
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
						vmbody.clients=data;
						vmbody.clientsback = data;
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
							vmbody.get_store_list(); //更新门店列表;;
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
							vmbody.link_name = '';
							vmbody.link_src = '';
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
						vmbody.logs = data;
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

});
