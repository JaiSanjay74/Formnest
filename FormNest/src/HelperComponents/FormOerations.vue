<template>

<div class="oph">
    <section @click="sett">
        <i class="fa-solid fa-gear"></i>
        <b>Settings</b>
    </section>
    <section @click="viewrs">
        <i class="fa-solid fa-person-chalkboard"></i>
        <b>Viewers</b>
    </section>
</div>
</template>

<style src="../CSS/FORMOPRTN.css" scoped>
</style>

<script>

export default{
    props:["formid"],
    methods:{
        sett(){
            this.$parent.settings = true
            this.$parent.options = false
            this.$parent.winname = this.formid + " - Settings"
        },
        viewrs(){
            this.$parent.viewers = true
            this.$parent.options = false
            this.$parent.winname = this.formid + " - Viewers"
            this.$parent.viewerssate = "vlist"
            this.$parent.larrowfn = this.$parent.visitorlireset
        }
    }
}
</script>