// for submit buton
    document.getElementsByClassName("opts").item(0).children.item(1).addEventListener("click",async ()=>{
    let inputs = document.getElementsByTagName("input")
    let next = 0
    let truetable = []
    while(next != inputs.length){
        if(inputs.item(next).value.length != 0 || !inputs.item(next).value.charAt(0).includes(" ")){
            truetable.push(inputs.item(next).value)
        } 
        else{
            truetable.push(false)
        }
        next++
    }

    if(truetable.filter((v,i)=>v == false).length == 0){
        let customername = prompt("Enter your name :")
        if(customername != null){
            let isSubmitted = (await(await fetch("https://yak-upright-urgently.ngrok-free.app/api/submit",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:customername,
                    frmid:sessionStorage.getItem("TFRMID"),
                    datum:truetable
                })
            })).json())
    
            if(isSubmitted.data == true){
                
                document.getElementsByClassName("opts").item(0).children.item(1).disabled = true
                Resetinputs(true)
                Showmessage("Your request was successfully submitted !")
            }
            else if(isSubmitted.data == "FORM_NOT_EXIST"){
                Showmessage("Form was unfortunatley deleted now !" + isSubmitted.data)
            }
            else{
                Showmessage("Something went wrong on server !" + isSubmitted.data)
            }
        }
        else{
            Showmessage("Please enter your name !")
        }
    }
    else{
        Showmessage("Please fill all fields !")
    }
})
// for reset buttom
document.getElementsByClassName("opts").item(0).children.item(0).addEventListener("click",Resetinputs)

// for display message
function Showmessage(msg){
    let msghold = document.getElementsByClassName("msh")[0]
    msghold.children.item(0).innerHTML = '<i class="fa-solid fa-message"></i>' + msg
    msghold.style.display = "flex"
    setTimeout(()=>{
        msghold.style.display = "none"
    },2000)
}
 
// for reset inputs
function Resetinputs(submitted){
    let inputs = document.getElementsByTagName("input")
    let next = 0
    while(next != inputs.length){
        inputs.item(next).value = ""
        next++
    }

    if(submitted == true){
        let inputs = document.getElementsByTagName("input")
        let next = 0
        while(next != inputs.length){
            inputs.item(next).disabled = true
            next++
        }
    }
}