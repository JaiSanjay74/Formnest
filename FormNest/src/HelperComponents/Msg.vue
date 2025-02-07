<template>
    <div class="mshold">
<b id="msg"><i class="fa-solid fa-message"></i>{{ msg }}</b>
</div>
</template>

<style src="../CSS/MSG.css" scoped>
</style>

<script>
export default{
    props:{msg:{type:String,required:true}}
}
</script>