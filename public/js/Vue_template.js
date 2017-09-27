//el:head
//header 
Vue.component('app-header',{
    data:function(){
        return{src:'http://static.ghostchina.com/image/b/46/4f5566c1f7bc28b3f7ac1fada8abe.png'};
    },
    template:'<header class="container-fluid jumbotron headerimg" style="margin-bottom: 0">\
                <div class="row header-ico">\
                    <a class="tip " title="xxl" href="#">\
                    <img :src="src">\
                </a></div></header>'
});

//nav
Vue.component('app-nav',{
    props:['links','ht'],
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


