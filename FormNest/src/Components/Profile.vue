<template>
<div class="prof">
    <b v-if="!del">My Profile</b>
    <section class="cred" v-if="!del">
        <b>Name</b>
        <input type="text" placeholder="Your name" :value="credentials.name" spellcheck="false" disabled ref="nm">
        <b>Email</b>
        <input type="email" placeholder="Your email" :value="credentials.email" spellcheck="false" disabled ref="em">
        <b>Password</b>
        <input type="text" placeholder="Your password" :value="credentials.password" spellcheck="false" disabled ref="ps">
    </section>
    <section class="opts" v-if="!del">
        <b @click="b1fn">{{b1txt}}</b>
        <b @click="b2fn">{{ b2txt }}</b>
        <b @click="logout">LOG OUT</b>
    </section>

    
    <div class="dela" v-else>
        <i class="fa-solid fa-user-xmark"></i>
        <p>If you delete your account, your forms and its data and account credentials 
            will be deleted permanently. you can't recover them. Sure you want to delete you account ?
        </p>
        <button @click="delaccount"><i class="fa-solid fa-trash"></i>DELETE MY ACCOUNT</button>
    </div>
</div>
</template>

<style src="../CSS/profile.css" scoped>
</style>

<script>
import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
import ShowMessage from "../Resources/Msgtool.js"

export default{
    data(){
        return{
            credentials:{email:"",name:"",password:""},
            del:false,
            b1txt:"UPDATE MY PROFILE",
            b2txt:"DELETE MY PROFILE",
            b1fn:this.trigupdateacc,
            b2fn:this.trigdel
        }
    },
   async mounted(){
         let account = await FormNestAPI.Getaccount(sessionStorage.getItem("TFMSSID"))

         if(typeof account.data == "boolean"){
            ShowMessage(this,"Something went wrong !")
         }
         else{
            this.credentials = account.data
         }
    },
    methods:{
        trigdel(){
           this.del = true
        },
        async logout(){
           let logout = await FormNestAPI.Logout(sessionStorage.getItem("TFMSSID"))
           if(logout.data){
            sessionStorage.clear()
            location.reload()
           }
           else{
            ShowMessage(this,"Unable to Log out !")
           }
        },
       async delaccount(){
          let isdeleted = await FormNestAPI.Deleteaccount(sessionStorage.getItem("TFMSSID"))

          if(isdeleted.data){
            ShowMessage(this,"Your account was successfully deleted !")
            setTimeout(() => {
                sessionStorage.clear()
                location.reload()
            },3000);
          }
          else{
            ShowMessage(this,"Unfurtanetly, Your account not found !")
          }
        },
        reset(){
            this.$refs.nm.disabled = true; this.$refs.em.disabled = true; this.$refs.ps.disabled = true
            this.b1fn = this.trigupdateacc
            this.b1txt = "UPDATE MY PROFILE"
            this.b2fn = this.trigdel
            this.b2txt = "DELETE MY PROFILE"
        },
        trigupdateacc(){
            this.$refs.nm.disabled = false; this.$refs.em.disabled = false; this.$refs.ps.disabled = false
            this.$refs.nm.focus();
            this.b1txt = "SAVE"
            this.b1fn = this.updateaccount
            this.b2fn = ()=>{this.reset()}
            this.b2txt = "CANCEL"
        },
        async updateaccount(){  
            if(this.$refs.nm.value.length <= 10){
                    if(this.$refs.em.value.includes("@")&&this.$refs.em.value.includes(".")){
                        if(this.$refs.ps.value.length == 6){
                            let updated  = await FormNestAPI.Updateaccount(sessionStorage.getItem("TFMSSID"),
                            this.$refs.nm.value,this.$refs.em.value,this.$refs.ps.value)

                             if(updated.data == "ALREADY_EXIST"){
                                ShowMessage(this,"Please use different email or password !")
                             }    
                             else if(updated.data){
                                ShowMessage(this,"Your account was Successfully updated !")
                                let account = await FormNestAPI.Getaccount(sessionStorage.getItem("TFMSSID"))

                                if(typeof account.data == "boolean"){
                                  ShowMessage(this,"Something went wrong !")
                                }
                                else{
                                  this.credentials = account.data
                                }
                                  this.reset()
                             }
                             else{
                                ShowMessage(this,"Something went wrong !")
                            }
                        }
                        else{
                            ShowMessage(this,"Password must be 6 digit !")
                        }
                    }
                    else{
                        ShowMessage(this,"'@' or '.' missing in email")
                    }
                }
                else{
                    ShowMessage(this,"In name, Please use only upto 10 charecters !")
                }
        }
    }
}
</script>