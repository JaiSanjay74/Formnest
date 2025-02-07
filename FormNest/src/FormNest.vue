<template>
<div class="entry" v-if="current == null">
    <h4>Welcome to the FormNest</h4>
    <b>Digitize, simplify, succeed And Forming the future, digitally. Seamless solutions, digital forms</b>
    <button @click="current = 'login'">Let's start</button>
</div>
<div class="whold" v-else>
    <section id="all">
        <Login v-if="current == 'login'"/>
        <Signup v-else-if="current == 'signup'"/>
        <Profile v-else-if="current == 'profile'"/>
        <Forms v-else-if="current == 'forms'"/>
    </section>
</div>
<Navbar/>
<Message :msg="msg" v-if="msg != ''"/>
<UIAlert v-if="uialert"/>
</template>

<style  src="./CSS/FormNest.css" scoped>

</style>

<script>
import Msg from "./HelperComponents/Msg.vue"
import UIAlert from "./HelperComponents/Alert.vue"

export default {
    components:{
        Message:Msg,
        UIAlert:UIAlert
    },
    data(){
        return{
           msg:"",
           uialert:false,
           current:null
        }
    },
    async mounted(){
       
        let issigned = sessionStorage.getItem("TFMSSID")
        if(issigned != null){
            this.current = "forms"
        }
    }
}
</script>

  