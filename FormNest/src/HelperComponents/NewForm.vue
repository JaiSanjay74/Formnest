<template>
<!--This also uses the FORMSETGS.css-->
<div class="nfrmm">
    <b class="fnm">Form name</b>
    <input type="text" placeholder="Name" ref="fnm" spellcheck="false">
    <button @click="addfield">+ ADD FIELD</button>
    <section class="fld">
        <b v-for="fld in fields" :key="fld.fkey" :fkey="fld.fkey" >
            <j contenteditable="true" spellcheck="false" @focusout="updateval">{{fld.name}}</j>
            <i class="fa-solid fa-x" contenteditable="false" @click="remfirld"></i></b>
    </section>
    <div class="set" style="padding-left:0px;padding-right: 0px;align-items: flex-start;padding-top: 0px;margin-top: 20px;">
        
    <section style="width: 100%;">
        <b>Visible to world</b>
        <input type="checkbox" id="vis" v-model="isvisible">
        <label for="vis">
            <i class="fa-solid fa-check"></i>
        </label>   
    </section>

    <section style="width: 100%;">
        <b>No. of visitors allowed</b>
        <input type="text" id="nm" ref="aln">  
    </section>
    </div>
    <button id="sub" @click="createform">CREATE FORM</button>
</div>
</template>
<style src="../CSS/NFRM.css" scoped>

</style>
<style src="../CSS/FORMSETGS.css" scoped>

</style>

<script>
import * as FormNestAPI from "../Resources/tools/FormNestAPIv1.js"
import ShowMessage from "../Resources/Msgtool.js"

export default{
    data(){
        return{
            fields:[],
            isvisible:false
        }
    },
    methods:{
        addfield (){
            this.fields.push({fkey:this.fields.length + 1,name:"New field"})
        },
        updateval(e){
            let fkey = e.currentTarget.parentElement.getAttribute("fkey")
            let searchable = this.fields.filter((v,i)=>{
                return fkey == v.fkey
            })[0]
            let delindex = this.fields.indexOf(searchable)
            this.fields[delindex].name = e.currentTarget.innerText
        },
        async createform(){
            let fields = []
            for(let itm of this.fields){
                fields.push(itm.name)
            }
            if(this.$refs.fnm.value != "" && this.$refs.aln.value != ""){
                if((new RegExp(/^[0-9]+$/)).test(this.$refs.aln.value)){
                    if(fields.length != 0){
                        let iscreated = await FormNestAPI.Newform(sessionStorage.getItem("TFMSSID"),
                        this.$refs.fnm.value,this.isvisible,this.$refs.aln.value,fields)
                        if(iscreated.data){
                          ShowMessage(this,this.$refs.fnm.value + "was Succesfully created !") 
                          await this.$parent.nformreset()  
                        }    
                        else{
                          ShowMessage(this,"Something went wrong on server !")
                        }
                    }
                    else{
                        ShowMessage(this,"Please add atleast one field !")
                    }
                }
                else{
                    ShowMessage(this,"Please enter only numbers in allowed section !")
                }
            }
            else{
               ShowMessage(this,"Please fill the form credentials !")
            }
         },
         remfirld(e){
            let fkey = e.currentTarget.parentElement.getAttribute("fkey")
            let searchable = this.fields.filter((v,i)=>{
                return fkey == v.fkey
            })[0]
            let delindex = this.fields.indexOf(searchable)
            this.fields.splice(delindex,1)
         },
        },
        unmounted(){
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
            window.addEventListener("orientationchange",this.$parent.alertui)
        }
}
</script>