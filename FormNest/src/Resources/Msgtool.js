export default (root,msg)=>{
    root.$root.msg = msg
    setTimeout(()=>{root.$root.msg = ""},3000)
} 