// Thyforms API version 0.1

let SERVER_ORIGIN = "https://yak-upright-urgently.ngrok-free.app"

export async function Signup(name,email,password){
    let IsSignup = await(await fetch(SERVER_ORIGIN + "/api/signup",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,email:email,password:password
            })
        }
    )).json()

    return IsSignup
}

export async function Login(email,password){
    let IsLogin = await(await fetch(SERVER_ORIGIN + "/api/login",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,password:password
            })
        }
    )).json()

    return IsLogin
}

export async function Logout(sessionid){
    let IsLogout = await(await fetch(SERVER_ORIGIN + "/api/logout",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                sessionid:sessionid
            })
        }
    )).json()

    return IsLogout
}

export async function Forgetpassword(email){
    let IsForgetSent = await(await fetch(SERVER_ORIGIN + "/api/forgetpassword",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
               email:email
            })
        }
    )).json()

    return IsForgetSent
}

export async function VerifyOTP(email,otp){
    let IsVerified = await(await fetch(SERVER_ORIGIN + "/api/verifyotp",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,otp:otp
            })
        }
    )).json()

    return IsVerified
}

export async function Updateaccount(sessionid,name,email,password){
    let IsUpdated = await(await fetch(SERVER_ORIGIN + "/api/updateaccount",
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,email:email,password:password,sessionid:sessionid
            })
        }
    )).json()

    return IsUpdated
}

export async function Newform(sessionid,name,visible,noOfmem,fields){
    let IsNCreated = await(await fetch(SERVER_ORIGIN + "/api/newform",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,visible:visible,members:noOfmem,sessionid:sessionid,fields:fields
            })
        }
    )).json()

    return IsNCreated
}


export async function Deleteform(sessionid,formid){
    let IsNCreated = await(await fetch(SERVER_ORIGIN + "/api/deleteform",
        {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                formid:formid,sessionid:sessionid
            })
        }
    )).json()

    return IsNCreated
}


export async function Deleteaccount(sessionid){
    let IsAdeleted = await(await fetch(SERVER_ORIGIN + "/api/deleteaccount",
        {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                sessionid:sessionid
            })
        }
    )).json()

    return IsAdeleted
}

export async function UpdateVisible(sessionid,formid,visible){
    let IsFupdated = await(await fetch(SERVER_ORIGIN + "/api/visible",
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                visible:visible,sessionid:sessionid,formid:formid
            })
        }
    )).json()

    return IsFupdated
}


export async function UpdateNoOfMem(sessionid,formid,noOfmem){
    let IsFupdated = await(await fetch(SERVER_ORIGIN + "/api/allowed",
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                members:noOfmem,sessionid:sessionid,formid:formid
            })
        }
    )).json()

    return IsFupdated
}


export async function Getforms(sessionid){
    let forms = await(await fetch(SERVER_ORIGIN + "/api/forms?sessionid="+sessionid
    )).json()

    return forms
}


export async function Getaccount(sessionid){
    let account = await(await fetch(SERVER_ORIGIN + "/api/account?sessionid="+sessionid
    )).json()

    return account
}