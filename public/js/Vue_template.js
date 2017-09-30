/*jshint multistr: true */
//el:head
//header 
Vue.component('app-header',{
    props:{
        'src':{
            default:'http://static.ghostchina.com/image/b/46/4f5566c1f7bc28b3f7ac1fada8abe.png'
        }
    },
    template:'<header class="container-fluid jumbotron headerimg" style="margin-bottom: 0">\
                <div class="row header-ico">\
                    <a class="tip " title="xxl" href="#">\
                    <img :src="src">\
                </a></div></header>'
});

//nav
Vue.component('app-nav',{
    props:{'links':{
                type:Object,
                default:function(){
                    return ['no data'];
                }
            },
            'ht':{
                type:String,
                default:''
            }},
    template:'<nav class="navbar navbar-default navbar-inverse" role="navigation" style="border-radius: 0">\
                <div class="navbar-header">\
                     <button class="navbar-toggle" data-toggle="collapse" data-target="#nav1" type="button">\
                        <span class="sr-only">sm show</span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                    </button>\
                    <a href="#" class="navbar-brand" >休闲乐软件</a>\
                </div>\
                <div class="collapse navbar-collapse pull-right" id="nav1">\
                    <ul class="nav navbar-nav">\
                        <li v-for="i in links" v-if="i.text !== ht"><a :href="i.href" class="fontfff tip" :target="i.target" :title="i.tittle">{{i.text}}</a></li>\
                        <li v-else><a :href="i.href" class="fontfff tip" :target="i.target" :title="i.tittle" @click="iemitl">{{i.text}}</a></li>\
                    </ul>\
                </div>\
            </nav>',
    methods:{
        iemitl:function(){
            this.$emit('emit-login');
            console.info("emit-login");
            return;
        }
    }
});
//body
//modal
Vue.component('app-modal',{
    template:'<div class="modal fade" role="dialog" tabindex="-1" aria-hidden="true" :id="ids">\
    			<div  class="modal-dialog">\
    				<div class="modal-content">\
    					<div class="modal-header">\
    						<button class="close" data-dismiss="modal">&times;</button>\
    						<h4 class="center-block">{{title}}</h4>\
    					</div>\
    					<div class="modal-body">\
    						<slot></slot>\
    					</div>\
    					<div class="modal-footer">\
    						<button class="btn btn-default" data-dismiss="modal">close</button>\
    						<button class="btn btn-default btn-success" @click="inc">{{btntext}}</button>\
    					</div>\
    				</div>\
    			</div>\
            </div>',
    //props:['id','tittle','btn_ok']
    props:{
        'ids':{
            type:String,
            default:'modal1'
        },
        'title':{
            type:String,
            default:'Modal'
        },
        'btntext':{
            type:String,
            default:'Yes'
        }
    },
    methods:{
        inc:function(){
            this.$emit('modal');
        }
    }
});


