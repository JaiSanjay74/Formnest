const express = require("express")
const server = express()
const mongodb = require("mongodb").MongoClient
const userAPI = require("./UserAPI/UserAPI.js")
const customerAPI = require("./CustomerAPI/CustomerAPI.js")
const sessionAuth = require("./ServerParts/SessionAuth.js")
const cors = require("cors")

// Middlewares
server.use(cors())
server.use(async(rq,rs,nxt)=>{
    console.log(rq.url)
    let mongo = new mongodb("mongodb://localhost:27017")
    let db = (await mongo.connect()).db("FormNest")
    rs.db = db
    rs.userProfiles = db.collection("Userprofiles")
    nxt()
})
server.use(express.json())
server.use(async(rq,rs,nxt)=>{
    
    let reqs = ["signup","login","logout","forgetpassword","verifyotp","form","TForm.css"
        ,"TForm.js","Roboto","RobotoFont.css","submit","assets"]
    let isreqs = false
        for(let itm of reqs){
            if(rq.url.includes(itm)){
               isreqs = true
               break
            }
        }
    if(!(rq.url == "/")){
        if(!isreqs){
            let sessionID
            switch(rq.method){
                case "GET":
                    sessionID = rq.query.sessionid
                    break
                default:
                    sessionID = rq.body.sessionid   
            }
            let isVerified = await sessionAuth.VerifySession(rs.userProfiles,sessionID)
            if(isVerified == true){
                nxt()
            }
            else if(isVerified == "Expired"){
                rs.json({data:"EXP"})
            }
            else{
                rs.json({data:"NOT_SIGNINED"})
            }
        }    
        else{
            nxt()
        }
    }
    else{
        nxt()
    }
})
server.use(express.static("./FormNest_Application"))
server.use(express.static("./FormNest_Form_Res"))

// FormNest Application v0.1 (Vue JS application)
server.get("/",(rq,rs)=>{
  rs.sendFile("./FormNest_Application/index.html")
})

// FormNest User REST API endpoints v1 
server.post("/api/signup",userAPI.SignUp)
server.post("/api/login",userAPI.LogIn)
server.post("/api/logout",userAPI.LogOut)
server.put("/api/updateaccount",userAPI.UpdateAccount)
server.post("/api/newform",userAPI.NewForm)
server.delete("/api/deleteform",userAPI.DeleteForm)
server.delete("/api/deleteaccount",userAPI.DeleteAccount)
server.put("/api/visible",userAPI.Visible)
server.put("/api/allowed",userAPI.NoOfmembers)
server.post("/api/forgetpassword",userAPI.ForgetPassword)
server.post("/api/verifyotp",userAPI.VerifyOTP)
server.get("/api/forms",userAPI.Forms)
server.get("/api/account",userAPI.getAccountCredentials)

// FormNest Customer REST API endpoints v1
server.get("/api/form",customerAPI.GetForm)
server.post("/api/submit",customerAPI.SubmitForm)

// Starting Server
server.listen(7000)

// For Server logs
let date = new Date()
let current_date = (date.getDay() + 1).toString()+"/"+date.getMonth().toString()+"/"+date.getFullYear().toString()
console.log("\nServer was successfully started At : "+current_date)
console.log("\nServer requests logs :\n")