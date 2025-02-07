<template>

<form class="log">
    <b>LOGIN</b>
    <input type="email" :placeholder="emname" ref="em" >
    <input type="password" placeholder="Password" v-if="!forget" ref="ps">
    <b v-if="!forget" @click="forgetpass">Forget password ?</b>
    <input type="button" :value="logbtn" @click="logbtnfn">
    <p>If you don't have an account,please <span @click="$root.current = 'signup'">Sign up</span></p>
</form>
</template>

<style src="../CSS/log.css" scoped>
</style>

<script>
import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
import ShowMessage from "../Resources/Msgtool.js"
export default{
   data(){
    return {
        forget:false,
        emname:"Email",
        logbtn:"LOG IN",
        logbtnfn:this.login,
        currentotpemail:""
    }
   },
   methods:{
    async login(){
        let login = await FormNestAPI.Login(this.$refs.em.value,this.$refs.ps.value)
        let result = login.data
        if(result == "INCCORECT_PASSWORD"){
            ShowMessage(this,"Password is incorrect. Please try again !")
        }
        else if(result == "NO_ACCOUNT_FOUND"){
            ShowMessage(this,"Unknown user account !")
        }
        else if(result == false){
            ShowMessage(this,"Sorry, Something went wrong on server. Please contact through email")
        }
        else{
            sessionStorage.setItem("TFMSSID",result)
            this.$root.current = "forms"
        }
    },
     forgetpass(){
            this.forget = true
            this.logbtn = "SEND OTP"
            this.logbtnfn = this.sendotp
    },
   async sendotp(){
      let wassent = await FormNestAPI.Forgetpassword(this.$refs.em.value)
      if(wassent.data == "UNKNOWN_ACCOUNT"){
        ShowMessage(this,"Unknown user account !")
      }
      else{
        ShowMessage(this,"OTP was sent to " + this.$refs.em.value)
        this.currentotpemail = this.$refs.em.value
        this.$refs.em.value = ""
        this.emname = "OTP"
        this.logbtn = "VERIFY OTP"
        this.logbtnfn = this.verifyotp 
      }
   },
   async verifyotp(){
       let otpver = await FormNestAPI.VerifyOTP(this.currentotpemail,this.$refs.em.value)
       let result = otpver.data
       if(result == "INCORRECT_OTP"){
         ShowMessage(this,"OTP is incorrect !")
       }
       else if(result == "EXPIRED"){
        ShowMessage(this,"OTP was expired. Refresh the page and try again !")
       }
       else if(result == "UNKNOWN_ACCOUNT"){
        ShowMessage(this,"Unknow user account. Please try again !")
       }
       else{
        ShowMessage(this,"Your password was sent to " + result)
        this.forget = false
        this.$root.current = "login"
        this.$refs.em.value = ""
        this.logbtn = "LOG IN"
        this.emname = "Email"
        this.logbtnfn = this.login
       }
   }
   }
}
</script>