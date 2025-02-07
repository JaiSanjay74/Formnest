<template>
<nav>
    <b>FormNest</b>

    <ol>
        <i class="fa-solid fa-bars" v-if="!side" @click="side = true"></i>
        <Sidebar v-if="side"/>
        <li @click="trigformfromnav">My Forms</li>
        <li>How it works ?</li>
        <li>About</li>
        <a @click="currentfn">
        <i 
            :class="('fa-solid ' + ((['login','signup',null].includes(root.current))?'fa-right-to-bracket':'fa-user'))">

        </i>{{
    (['login','signup',null].includes(root.current))?'Log In':'My Account'
    }}</a>
    </ol>
</nav>
</template>

<style src="../CSS/nav.css" scoped>
</style>

<script>
import Side from "../HelperComponents/Sidebar.vue"

   export default{
    components:{
        Sidebar:Side
    },
    data(){
        return{
            root:this.$parent,
            side:false
        }
    },
    methods:{
        currentfn(){
            if (['login','signup',null].includes(this.root.current)) 
            { 
                 this.root.current = "login"
            } 
            else 
            { 
                this.root.current = "profile"
            }
        },
        trigformfromnav(){
            
            if(sessionStorage.getItem("TFMSSID") != null){
                this.$parent.current = "forms"
            }
            else{
                this.$parent.current = "login"
            }
        }
    }
   }
</script>