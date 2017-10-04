	"use strict";
	$.getScript('js/wait.js');
	$.ajaxSetup({
		type:'GET',
		url:'/get',
		dataType:'json'
	});
	$.ajaxPrefilter('json',function(xhr,option){
		var data = option.data;
		//console.log(data);
		for(var i in data){
			console.log({i:data[i],ii:SHA1(data[i])});
			option.data[i] = '999';
		}
		//console.log(data);
	});	
//el:vm
	var vm = new Vue({
		el:'#vm',
		data:{
			update_time:'2017-07-21',
			localdowns:[],
			linkdowns:[],
			territorys:[],
			moreinfo:'显示更多'
		},

		computed:{
			//计算链接下载前戳
			itemadress:function(){
				return ("file/");
			},
			//
			f:function(){
				return "#";
			},
			a:function(){
				return "a";
			},
			//对territorys去重
			terri_list:function(){
				var list=[],len=this.territorys.length;
				if(len == 0) return list;
				$.each(this.territorys,function(i,item){
					var terri = item.territory;
					if(list.indexOf(terri) == -1){
						list.push(terri);
					}
				});
				return list;
			}
		},
		//vm方法
		methods:{
			//显示更多元素
			show_link:function(idname){
				$("#"+idname).find('li').show();
				
			},
			territory_find:function(im){
				var list = [];
				$.each(this.territorys,function(i,item){
					if(item.territory == im) list.push(item.client_name);
				});
				return list;
			}
		},
		//vm greated		
		created:function(){	
			//请求xxl-down下载链接		
			$.ajax({
				data:{
					sid:"xxl-down"
				},success:function(data){
					vm.localdowns = data;
					//console.log(this.localdowns);
				},error:function(data){
					alert(data);
				}
			});
			//get link_down
			$.ajax({
				data:{
					sid:"get-down-files"
				},success:function(data){
					vm.linkdowns = data;
				}
			});
			//get territory info
			$.ajax({
				data:{
					sid:'get-client-name'
				},success:function(data){
					vm.territorys = data;
				}
			});
		},
		//vm组件
		

	});

	var vm2 = new Vue({
		el:"#head",
		data:{
			links:[
                {href:'#',target:'',tittle:'SMS',text:'短信自助充值服务',type:'btn'},
                {href:'http://www.microcloud.asia',target:'_blank',tittle:'休闲乐微云程序',text:'微信-微云',type:'link'},
                {href:'#s10',target:'',tittle:'软件供应客户',text:'企业客户',type:'link'},
                {href:'#s15',target:'',tittle:'展示最新消息',text:'最新公告',type:'link'},
                {href:'#',target:'',tittle:'管理人员后台登陆，用于添加数据',text:'后台登陆',type:'btn'}
			],
			ht:'后台登陆',
			user:'',
			passwd:'',
			sms:{
				territorylist:[],
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

		},
		computed:{
			se_storelist:function(){
				var list = [];
				var ter = vm.territorys;
				for(var i=0;i<ter.length;i++){
					if(ter[i].territory === this.sms.territoryname){
						list.push(ter[i]);
					}
				}
				return list;
			},
			tedsrc:function(){
				return "img/pay/"+this.sms.show.picsrc+".jpg";
			}
		},
		methods:{
			//sms register
			SMS_register:function(){
				if(this.sms.storename === "" || this.sms.tel == 1){
					alert("argment error");
				}else{
					console.log(this.storename+this.tel);
					$("#SMSindex").modal('hide');
					$("#SMSpay").modal('show');
				}				
			},
			smsalipay:function(){
				this.sms.show.selectpay = false;
				this.sms.show.pic = true;
				this.sms.show.picsrc = "alipay";
			},
			smswxpay:function(){
				this.sms.show.selectpay = false;
				this.sms.show.pic = true;
				this.sms.show.picsrc = "wxpay";
			},
			smsrefreshpay:function(){
				this.sms.show.selectpay = true;
				this.sms.show.pic = false;
				this.sms.show.picsrc = "";
			},
			SMS_pay:function(){
				$.ajax({
					url:'/get',
					type:'GET',
					data:{
							sid:"pay-success",
							store:this.sms.storename,
							tel:this.sms.tel,
							payment:this.sms.show.picsrc
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
			},
			//检测事件唤醒的键
			check_event:function(e){
				var innertext = e.target.innerText;
				switch(innertext){
					case '短信自助充值服务':
						this.SMS_modal();
					break;

					case '后台登陆':
						this.login_modal();
					break;
				}
			},
			SMS_modal:function(){
				$("#SMSindex").modal('show');
				this.sms.territorylist = vm.terri_list;
				$.ajax({
					url:'/get',
					type:'GET',
					data:{sid:"money"},
					success:function(data){
						vm2.sms.moneytemplate = data;
					}
				});
			},
			login_modal:function(e){
				//登陆唤起modal				
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
			},

			//登陆验证
			login_check:function(){
				var s = SHA1(this.passwd);
				console.log(s);
				
				var data = {
					sid:"logins",
					user:this.user,
					passwd:s
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
							this.passwd = '';
							alert("密码错误");
							console.log("psaawd error");
						}
					},
					error:function(data){
						console.log(data);
						alert(data);
					}
				});
			}
		}
	});
	
	//el footer
	var footer = new Vue({
		el:'#footer'
	});