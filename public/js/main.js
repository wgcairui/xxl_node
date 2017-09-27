$(document).ready(function(){
	"use strict";
	$.getScript('js/wait.js');
	$.ajaxSetup({
		type:'GET',
		url:'/get',
		dataType:'json'
	});	
//el:vm
//app showmore
Vue.component('app-moreinfo',{
    props:['message'],
    template:'<a class="btn btn-default btn-link btn-block center-block" v-on:click="iemit">{{message}}<span class="glyphicon glyphicon-arrow-down"></span></a>',
    methods:{
        iemit:function(){
            this.$emit('inemit');
        }
    }        
    }
);


	var vm = new Vue({
		el:'#vm',
		data:{
			update_time:'2017-07-21',
			loadtittle:'软件下载',
			linktittle:'工具链接下载',
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
			show_link:function(){
				var show = $(".btn-link");
				show.prev().children().show();
				show.addClass("hidden");
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
                {href:'sms/sms.html',target:'_blank',tittle:'SMS',text:'短信自助充值服务'},
                {href:'http://www.microcloud.asia',target:'_blank',tittle:'休闲乐微云程序',text:'微信-微云'},
                {href:'#s10',target:'',tittle:'软件供应客户',text:'企业客户'},
                {href:'#s15',target:'',tittle:'展示最新消息',text:'最新公告'},
                {href:'#',target:'',tittle:'管理人员后台登陆，用于添加数据',text:'后台登陆'}
			],
			ht:'后台登陆',
			user:'',
			passwd:''
		},
		methods:{
			login_modal:function(){
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
				var data = {
					sid:"logins",
					user:this.user,
					passwd:this.passwd
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
});