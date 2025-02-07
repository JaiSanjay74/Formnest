<template>
       <ol id="sd">
        <i class="fa-solid fa-x" @click="()=>{this.$parent.side = false}" style="margin:calc(13px + 12px);"></i>
        <li @click="trigformfromnavl">My Forms</li>
        <li>How it works ?</li>
        <li>About</li>
        <a @click="currentfn">
        <i 
            :class="('fa-solid ' + ((['login','signup',null].includes(this.$root.current))?'fa-right-to-bracket':'fa-user'))">

        </i>{{
    (['login','signup',null].includes(this.$root.current))?'Log In':'My Account'
    }}</a>
    </ol>
</template>

<style scoped>
#sd{
    position: fixed;
    border-radius: 10px;
    right: 10px;
    top:15px;
    height: 100%;
    width: 90%;
    list-style: none;
    display: flex;
    flex-direction: column !important;
    padding: 0px;
    margin: 0px;
    font-family: rob-lt;
    font-size: 1.20rem;
    background-color: white;
    color: black;
    
}
#sd li,#sd a,#sd .fa-bars{
    padding: 12px;
    margin-left: 13px;
    margin-right: 13px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.7s background-color;
}
#sd .fa-bars{
    display: none;
    font-size: 1.60rem;
}
#sd li:hover,#sd a:hover,#sd .fa-bars:hover{
   background-color: rgba(232, 232, 232, 0.7);
}
#sd a:hover{
    color: rgb(140, 140, 140);
}
#sd a i{
    margin-right: 12px;
}
#sd a{
    margin-top: 10px;
    color: white;
    background-color: rgba(10, 102, 251, 0.922);
}
</style>


<script>
import ShowMessage from "../Resources/Msgtool.js"
   export default{
    data(){
        return{
            root:this.$root
        }
    },
    methods:{
        currentfn(){
            if (['login','signup',null].includes(this.root.current)) 
            { 
                 this.root.current = "login"
                 this.$parent.side = false
            } 
            else 
            { 
                this.root.current = "profile"
                this.$parent.side = false
            }
        },
        trigformfromnavl(){
            
            if(sessionStorage.getItem("TFMSSID") != null){
                this.$parent.side = false
                this.$root.current = "forms"
            }
            else{
                
                ShowMessage(this,"Please sign in to open forms !")
                this.$parent.side = false
            }
        }
    }
   }
</script>