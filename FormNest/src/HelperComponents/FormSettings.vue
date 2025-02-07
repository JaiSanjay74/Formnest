<template>
<div class="set">
    <section>
        <b>Visible to world</b>
        <input type="checkbox" id="vis" v-model="visbl">
        <label for="vis" @click="visble">
            <i class="fa-solid fa-check"></i>
        </label>
        
    </section>

    <section>
        <b>No. of visitors allowed</b>
        <input type="text" id="nm" v-model="allowed" @focusout="allow">  
    </section>
</div>
</template>

<style src="../CSS/FORMSETGS.css" scoped>
</style>

<script>
import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
import ShowMessage from "../Resources/Msgtool.js"
export default{
   props:["frmid"],
   data(){
    return{
        visbl:false,
        allowed:"0"
    }
   },
   methods:{
    async allow(){
        if((new RegExp(/^[0-9]+$/)).test(this.allowed)){
            let updated = await FormNestAPI.UpdateNoOfMem(sessionStorage.getItem("TFMSSID"),this.$parent.formid,this.allowed)
            if(updated.data){
                
               ShowMessage(this,"Allowed section was Successfully updated !")
               let forms = (await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))).data
                let filtered = forms.filter((v,i)=>{
                     return v.formID == this.frmid
               })[0]
                this.visbl = filtered.settings.visibility
                this.allowed = filtered.settings.onlyAllowed
            }
            else{
               ShowMessage(this,"Form not found on server, please refresh and try again !")
            }
        }
        else{
            ShowMessage(this,"Please enter only numbers in allowed section !")
        }
    },
    async visble(){
           setTimeout(async()=>{
            let updated = await FormNestAPI.UpdateVisible(sessionStorage.getItem("TFMSSID"),this.$parent.formid,this.visbl)
            if(updated.data){
               ShowMessage(this,"Visibility was Successfully updated !")
               let forms = (await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))).data
               let filtered = forms.filter((v,i)=>{
                     return v.formID == this.frmid
               })[0]
                this.visbl = filtered.settings.visibility
                this.allowed = filtered.settings.onlyAllowed
            }
            else{
               ShowMessage(this,"Form not found on server, please refresh and try again !")
            }
           },2000)
    }
   },
   mounted(){
     let frmsettings = JSON.parse(sessionStorage.getItem("FormNest")).data
     let filtered = frmsettings.filter((v,i)=>{
        return v.formID == this.frmid
     })[0]
     this.visbl = filtered.settings.visibility
     this.allowed = filtered.settings.onlyAllowed
   }
}
</script>