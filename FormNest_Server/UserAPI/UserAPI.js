// User API v1

// exports
module.exports = {
    LogIn,SignUp,NewForm,LogOut,UpdateAccount,Visible,
    NoOfmembers,ForgetPassword,VerifyOTP,DeleteForm,DeleteAccount,Forms,getAccountCredentials
}
//----

// Session Based Authentication v1
const SessionAuthV1 = require("../ServerParts/SessionAuth.js")
const cuid = require('cuid')
const OTPmanager = require("../ServerParts/OTPmanager.js")

async function SignUp(rq,rs){
   
    try{
        let isAlreadyexist = await rs.userProfiles.findOne({email:rq.body.email})
        let ispassexist = await rs.userProfiles.findOne({password:rq.body.password})
        if(isAlreadyexist == null && ispassexist == null){
           await rs.userProfiles.insertOne({
                name:rq.body.name,
                email:rq.body.email,
                password:rq.body.password,
                createdAt:(new Date()).toISOString(),
                CurrentOTP:null,
                Loggers:[]
             })
           await rs.db.createCollection(rq.body.email+"forms")
           let iscreated = (await rs.db.listCollections().toArray()).filter((v,i)=>v.name == rq.body.email+"forms").length == 1   
           rs.json({data:iscreated ? true : "FORMSPACE_NOT_CREATED"})
        }
        else{
            rs.json({data:false})
        }
    }
    catch(e){
        rs.json({data:"SERVER_ERROR"})
        console.log(e.message)
    }
}

async function LogIn(rq,rs) {
    
    let isAccountexist = await rs.userProfiles.findOne({email:rq.body.email})

    if(isAccountexist != null){
        if(isAccountexist.password == rq.body.password){
            let iscreated = await SessionAuthV1.CreateSession(rs.userProfiles,isAccountexist.email)
            if(typeof iscreated == "string"){
               rs.json({data:iscreated})
            }
            else{
               rs.json({data:false}) 
            }
        }
        else{
            rs.json({data:"INCCORECT_PASSWORD"})
        }
    }
    else{
        rs.json({data:"NO_ACCOUNT_FOUND"})
    }
}

async function LogOut(rq,rs){

    let isLoggout = await SessionAuthV1.EndSession(rs.userProfiles,rq.body.sessionid)
    if(isLoggout){
        rs.json({data:isLoggout})
    }
    else{
        rs.json({data:isLoggout})
    }
}

async function UpdateAccount(rq,rs) {

    let isAccountexist = await rs.userProfiles.findOne({email:rq.body.email})
    let isPasswordexist = await rs.userProfiles.findOne({password:rq.body.password})

    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email
        if((isAccountexist == null && isPasswordexist == null)){
            await rs.db.renameCollection(account+"forms",rq.body.email+"forms")
            let isupdated = (await rs.userProfiles.updateOne({
                Loggers:{$elemMatch:{
                    sessionID:rq.body.sessionid
                }}
            },{$set:{
                email:rq.body.email,
                password:rq.body.password,
                name:rq.body.name
            }})).modifiedCount == 1
            
            let isrenamed = (await rs.db.listCollections().toArray()).filter((v,i)=>v.name == rq.body.email+"forms").length == 1
        
            if(isupdated && isrenamed){
                rs.json({data:true})
            }
            else{
                rs.json({data:false})
            }
        }
        else{
            rs.json({data:"ALREADY_EXIST"})
        }
}

async function NewForm(rq,rs) {

    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email

    try{
    let ID = cuid()    
    const URL = "https://yak-upright-urgently.ngrok-free.app/api/form?frmid=" + ID    
    await rs.db.collection(account+"forms").insertOne({
        formname:rq.body.name,
        formID:ID,
        formURL: URL,
        createdAt:(new Date()).toISOString(),
        fields:[...rq.body.fields],     // only send array type data for fields from client
        settings:{
            visibility:rq.body.visible, // only send bool data from client
            onlyAllowed:rq.body.members // only send no.of members using string data from client
        },
        visitors:[]
    })
    rs.json({data:true})
    }
    catch(e){
        rs.json({data:false})
    }
}

async function DeleteAccount(rq,rs) {

    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email
    let iscreddeleted = (await rs.userProfiles.deleteOne({Loggers:{
        $elemMatch:{
            sessionID:rq.body.sessionid
        }
    }})).deletedCount != 0 && (await rs.db.dropCollection(account+"forms"))

    if(iscreddeleted){
        rs.json({data:true})
    }
    else{
        rs.json({data:false})
    }
}

async function DeleteForm(rq,rs) {
    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email
    let isdeleted = (await rs.db.collection(account+"forms").deleteOne({formID:rq.body.formid})).deletedCount == 1

    rs.json({data:isdeleted})
}

async function Visible(rq,rs) {

    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email
    console.log(account)    
    let updated = (await rs.db.collection(account+"forms").updateOne({
        formID:rq.body.formid
    },{
        $set:{
           "settings.visibility":rq.body.visible // // only send bool data from client
        }
    })).modifiedCount == 1

    rs.json({data:updated})
}

async function NoOfmembers(rq,rs) {

    let account = (await rs.userProfiles.findOne({
        Loggers:{$elemMatch:{
            sessionID:rq.body.sessionid
        }}})).email
    let updated = (await rs.db.collection(account+"forms").updateOne({
        formID:rq.body.formid
    },{
        $set:{
           "settings.onlyAllowed":rq.body.members // only send no.of members using string data from client
        }
    })).modifiedCount == 1

    rs.json({data:updated})
}

async function ForgetPassword(rq,rs) {
    let account = (await rs.userProfiles.findOne({
        email:rq.body.email
}))
    if(account != null){
        let otp = await OTPmanager.sendOTP({ouremail:"perunkarunai@gmail.com",
            clientemail:rq.body.email,
            subject:"FormNest - OTP for forget password"
        })
        rs.send({data:true})
        await rs.userProfiles.updateOne({email:rq.body.email},{$set:{CurrentOTP:otp}})
        setTimeout(async () => {
           await rs.userProfiles.updateOne({email:rq.body.email},{$set:{CurrentOTP:"null"}})
        }, 60000);
    }
    else{
        rs.send({data:"UNKNOWN_ACCOUNT"})
    }
}
    
async function VerifyOTP(rq,rs) {
    let otp = await rs.userProfiles.findOne({email:rq.body.email})
    if(otp != null){
        if(otp.CurrentOTP != "null"){
            if(otp.CurrentOTP == rq.body.otp){
                await rs.userProfiles.updateOne({email:rq.body.email},{$set:{CurrentOTP:"null"}})
                OTPmanager.sendPassword({
                    ouremail:"perunkarunai@gmail.com",
                    clientemail:rq.body.email,
                    subject:"FormNest - Password for log in",
                    passw:otp.password
                })
                rs.send({data:rq.body.email})
            }
            else{
                rs.send({data:"INCORRECT_OTP"})
            }
        }
        else{
            rs.send({data:"EXPIRED"})
        }
    }
    else{
        rs.send({data:"UNKNOWN_ACCOUNT"})
    }
}
    
async function Forms(rq,rs) {
    let account = await rs.userProfiles.findOne({
        Loggers:{
            $elemMatch:{
                sessionID:rq.query.sessionid
            }
        }
    })
    let forms = await rs.db.collection(account.email+"forms").find({},{projection:{_id:0}}).toArray()
    rs.json({data:forms})
}

async function getAccountCredentials(rq,rs){
    let account = await rs.userProfiles.findOne({
        
        Loggers:{$elemMatch:{sessionID:rq.query.sessionid}}},{projection:{_id:0,name:1,email:1,password:1}})

    if(account != null){
        rs.json({data:account})
    }
    else{
        rs.json({data:false})
    }
}