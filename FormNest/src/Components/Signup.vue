<template>

    <form class="log">
        <b>SIGN UP</b>
        <input type="text" placeholder="Name" ref="nm">
        <input type="email" placeholder="Email" ref="em">
        <input type="password" placeholder="Password" ref="ps">
        <input type="button" value="SIGN UP" @click="signup">
        <p>If you already have an account,please <span @click="$root.current = 'login'">Login</span></p>
    </form>
    </template>
    
    <style src="../CSS/log.css" scoped>
    </style>
    
    <script>
    import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
    import ShowMessage from "../Resources/Msgtool.js"

    export default {
        methods:{
            async signup(){
                let $root = this
                // client side validation 
                if(this.$refs.nm.value.length <= 10){
                    if(this.$refs.em.value.includes("@")&&this.$refs.em.value.includes(".")){
                        if(this.$refs.ps.value.length == 6){
                            let signup = await FormNestAPI.Signup(this.$refs.nm.value,this.$refs.em.value,this.$refs.ps.value)
                            let result = signup.data
                            if(result == false){
                               ShowMessage($root,"Try another email or password !")
                            }
                            else if(result == "SERVER_ERROR"){
                               ShowMessage($root,"Something went wrong on server !")
                            }
                            else if(result == "FORMSPACE_NOT_CREATED"){
                               ShowMessage($root,"Sorry, your space for forms not created. please contact through email !")
                            }
                            else if(result == true){
                               this.$root.current = "login"
                            }
                        }
                        else{
                            ShowMessage($root,"Password must be 6 digit !")
                        }
                    }
                    else{
                        ShowMessage($root,"'@' or '.' missing in email")
                    }
                }
                else{
                    ShowMessage($root,"In name, Please use only upto 10 charecters !")
                }
            }
        }
    }
    </script>