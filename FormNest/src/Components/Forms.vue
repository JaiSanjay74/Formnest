<template>
<div class="forms">
    <section class="head">
        <section>
            <i class="fa-solid fa-arrow-left" v-if="larrow" @click="larrowfn"></i>
            <b>{{winname}}</b>
        </section>
        <section>
        <a v-if="newfrmbtn" @click="trigernewform">+ New Form</a>
        <i class="fa-solid fa-trash" v-if="trash" @click="deleteform"></i>
        </section>
    </section>

   <div class="formtbl" v-if="forms != null">
        <div class="titl" >
            <fdct>Form Name</fdct>
            <fdct>Created On</fdct>
            <fdct>Visible state</fdct>
            <fdct>Viewers</fdct>
            <fdct>Link</fdct>
        </div>
        <b v-if="forms.length == 0">No forms are created</b>
        <div :class="'fdth ' + (delfm == form.formID?'fdthsel':'')"
             v-for="form in forms" :frmid="form.formID" :key="form.formID" >
            <fdt @click="openopt" id="fdi" style="font-size: 1px;" :ref="form.formID">{{form.formname}}</fdt>
            <fdt id="fdi">{{moment(form.createdAt).format("DD.MM.YYYY")}}</fdt>
            <i :class="('fa-solid ' + (form.settings.visibility ? 'fa-eye':'fa-eye-slash'))"></i>
            <fdt id="fdi">{{form.visitors.length}}</fdt>
            <i class="fa-solid fa-link" :frmlnk="form.formURL" @click="copyurl"></i>
        </div>
    </div>
    
    <FormOperation :formid="formid" v-if="options"/>
    <Settings :frmid="formid" v-if="settings"/>
    <Viewers :type="viewerssate" :custid="custid" :frmid="formid" v-if="viewers"/>
    <NewForm v-if="newform"/>
</div>
</template>

<style src="../CSS/forms.css" scoped>
</style>

<script>
import moment from "moment/moment"
import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
import ShowMessage from "../Resources/Msgtool.js"
import Operations from "../HelperComponents/FormOerations.vue"
import settings from "../HelperComponents/FormSettings.vue"
import Viewers from "../HelperComponents/Visitors.vue"
import Addform from "../HelperComponents/NewForm.vue"

import {onLongPress} from "@vueuse/core"

 
export default{
   components:{
    FormOperation:Operations,
    Settings:settings,
    Viewers:Viewers,
    NewForm:Addform
  
   },
   data(){
     return{
        forms:null,
        formid:null,
     moment:moment,
     delft:null,
     delfm:null,
     /* navset */
     newfrmbtn:true,
     larrow:false,
     trash:false,
     winname:"Forms",
     larrowfn:this.resetselect,
     /*newform*/
     newform:false,
     /*others*/
     options:false,
     /* form operations*/
     settings:false,
     viewers:false,
     viewerssate:null,
     custid:null
   }},
   async mounted(){ 
    let isAndroid = navigator.userAgent.includes("Android")
            if(isAndroid){
               if(!window.matchMedia("(orientation:landscape)").matches){
                console.log("portrait")
                this.$root.uialert = true
               }
               else{
                console.log("landscape")
                this.$root.uialert = false
               }
            }
      window.addEventListener("orientationchange",this.alertui)
      let forms = await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))
      this.forms = forms.data
      sessionStorage.setItem("FormNest",JSON.stringify(forms))
      await this.$nextTick()
      for(let itm of forms.data){
        let refel = this.$refs[itm.formID][0]
        onLongPress(refel,this.selectfordel,{delay:1000})
      }
   }, 
   unmounted(){
      window.removeEventListener("orientationchange",this.alertui)
   },
   methods:{
    alertui(){
        setTimeout(() => {
            let isAndroid = navigator.userAgent.includes("Android")
            if(isAndroid){
               if(!window.matchMedia("(orientation:landscape)").matches){
                console.log("portrait")
                this.$root.uialert = true
               }
               else{
                console.log("landscape")
                this.$root.uialert = false
               }
            }
        }, 1000);
        
      
    },
   selectfordel(e){
      
           let frmid = e.target.parentElement.getAttribute("frmid")
           this.delfm = frmid
        this.trash = true
        this.larrow = true
        this.winname = `${frmid} will be deleted`
        this.newfrmbtn = false
    },
    /* -- leftarrow functions--*/
    resetselect(){
        this.delfm = null
        this.newfrmbtn = true
        this.trash = false
        this.larrow = false
        this.winname = "Forms"
    },
    async deleteform(){
        let isdeleted = await FormNestAPI.Deleteform(sessionStorage.getItem("TFMSSID"),this.delfm)
        if(isdeleted.data){
            ShowMessage(this.$root,this.delfm + "was deleted !")
            let forms = await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))
            this.forms = forms.data
            this.resetselect()
            sessionStorage.setItem("FormNest",JSON.stringify(forms))
        }
        else{
            ShowMessage(this.$root,this.delfm + "was not exist !")
        }
    },
    async nformreset(){
        this.newform = false
        this.winname = "Forms"
        let forms = await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))
        this.forms = forms.data
        this.newfrmbtn = true
        this.larrow = false
        this.larrowfn = this.resetselect
        
    },
    trigernewform(){
        this.forms = null
        this.newfrmbtn = false
        this.newform = true
        this.winname = "New Form"
        this.larrow = true
        this.larrowfn = this.nformreset
        window.removeEventListener("orientationchange",this.alertui)
    },
    async optreset(){
        this.winname = "Forms"
        this.formid = null
        this.larrow = false
        this.newfrmbtn = true
        this.settings = false
        this.options = false
        let forms = await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))
        this.forms = forms.data
        sessionStorage.setItem("FormNest",JSON.stringify(forms))
    },
    openopt(e){
        this.formid = e.currentTarget.parentElement.getAttribute("frmid") 
        this.forms = null
        this.options = true
        this.newfrmbtn = false
        this.winname = e.currentTarget.parentElement.getAttribute("frmid") + " - Manage"
        this.larrow = true
        this.larrowfn = this.optreset
    },
    async copyurl(e){
            await navigator.clipboard.writeText(e.currentTarget.getAttribute("frmlnk"))
            ShowMessage(this.$root,"Form link URL is copied to clipboard !")
         },
    async visitorlireset(){
        this.formid = null
        this.winname = "Forms"
        let forms = await FormNestAPI.Getforms(sessionStorage.getItem("TFMSSID"))
        this.forms = forms.data
        sessionStorage.setItem("FormNest",JSON.stringify(forms))
        this.viewers = false
        this.viewerssate = "vlist"
        this.newfrmbtn = true
        this.larrow = false
    }     
   }
}
</script>