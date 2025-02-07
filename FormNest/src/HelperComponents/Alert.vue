<template>
    <div class="alert">
        <i class="fa-solid fa-chart-simple"></i>
        <p>Please turn mobile (or) tablet to landscape mode to experience best UI performance.</p>
    </div>
</template>

<style scoped>
@import url('../Resources/tools/RobotoFont.css');
.alert{
    display: flex;
    position: fixed;
    justify-content: center;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px;
    background-color: white;
}
.alert i{
    font-size: 6rem;
    text-align: center;
    color: blue;
}
.alert p{
    font-family: rob-bld;
    font-size: 1.30rem;
    color: rgb(52, 52, 52);
    text-align: center;
    margin: 15px 0px 0px 0px;
}
</style>