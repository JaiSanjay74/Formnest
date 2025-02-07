<template>
  <div class="vst" v-if="type == 'vlist'">
    <section>
        <b>Viewers</b>
        <b>Submitted At</b>
    </section>
    <b v-if="fields.length == 0">0 Viewers</b>
    <vstr v-for="(v,i) in fields" v-bind:custid="v[1]" :ref="v[1]" :key="v[1]">
        <b>{{v[0]}}</b>
        <b>{{values[i]}}</b>
    </vstr>
  </div>

  <div class="vst" v-if="type == 'vdata'">
    <section>
        <b>Property</b>
        <b>Data</b>
    </section>
    <vstr v-for="(v,i) in fields" v-bind:custid="v[1]" :ref="v[1]" :key="v[1]">
        <b>{{v}}</b>
        <b>{{values[i]}}</b>
    </vstr>
  </div> 

</template>

<style src="../CSS/VISITORS.css" scoped>
</style>

<script>
import moment from "moment/moment"
export default{
  props:["frmid",'type','custid'],
  data(){
    return{
      state:"vdata",// vdata
      fields:[],
      values:[]
    }
  },
 async mounted(){

    if(this.type == "vlist"){
      let forms = JSON.parse(sessionStorage.getItem("FormNest")).data
      let customers = (forms.filter((v,i)=>{
        return v.formID == this.frmid
      }))[0].visitors 

      customers.forEach((v,i)=>{
        this.fields.push([v.custname,v.custid])
        this.values.push(moment(v.submittedAt).format("DD.MM.YYYY"))
      })
      console.log('.b. '+this.custid)
      await this.$nextTick()
      console.log('.a.'+this.custid)
      for(let itm of customers){
        this.$refs[itm.custid][0].addEventListener("click",(e)=>{
          this.$parent.viewerssate  = "vdata"
          this.$parent.custid = itm.custid
          
          
      let forms = JSON.parse(sessionStorage.getItem("FormNest")).data
      this.fields = (forms.filter((v,i)=>{
        return v.formID == this.frmid
      }))[0].fields

      let custcred = (forms.filter((v,i)=>{
        return v.formID == this.frmid
      }))[0].visitors
      
      this.values = (custcred.filter((v,i)=>{
        console.log(v.custid +","+this.custid)
        return v.custid == this.$parent.custid
      }))[0].datum
        })
      }
    }
  }
}
</script>