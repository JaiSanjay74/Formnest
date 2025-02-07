// Thyform's Session Based Authentication v1
 
const date_fns = require("date-fns")
const mong = require("mongodb").MongoClient
const cuid = require('cuid')

// Create session and return session credentials
async function CreateSession(umongo,email){
   
    let ID = cuid()
    let isSessionIdAlreadyExists = await umongo.findOne(
        {
            $and:[
                {email:email},
                {"Loggers":{$elemMatch:{sessionID:ID}}}
            ]  
        })
    while(isSessionIdAlreadyExists != null){
        
        ID = cuid()
        isSessionIdAlreadyExists = await umongo.findOne({
            $and:[
                {email:email},
                {"Loggers":{$in:[{sessionID:ID}]}}
            ]
        })
    }
    let credentials = {
        sessionID:ID,
        expiredAt:date_fns.addHours(new Date(),24).toISOString()
    }
    try{
        await umongo.updateOne({
            email:email,  
        },{
            $push:{
                Loggers:credentials
            }
        })
        return credentials.sessionID
    }
    catch{
        return false
    }  
}

// End the session and return either true or false
async function EndSession(umongo,sessionID){
    let isUpdated = await umongo.updateOne({
            Loggers:{$elemMatch:{
                sessionID:sessionID
            }}
    },{
        $pull:{
            Loggers:{
                    sessionID:sessionID
            }
        }
    })
    return isUpdated.modifiedCount == 1 ? true : false
}

// Verify session and return either true or false or expired
async function VerifySession(umongo,sessionID){

    try{
    let currentdate = new Date()
    let session =(await umongo.findOne({Loggers:{$elemMatch:{sessionID:sessionID}}})).Loggers.filter((v,i)=>{
        return v.sessionID == sessionID
    })[0]
    
        let isExpired = date_fns.isEqual(date_fns.parseISO(session.expiredAt),currentdate) || 
        date_fns.isAfter(currentdate,date_fns.parseISO(session.expiredAt))

        if(isExpired){
           await EndSession(umongo,session.sessionID) 
           return "Expired"
        }
        else{
            return true
        }
    }
    catch(er){
        return false
    }
}

// Delete unsigned-out sessions and return true or false
async function RemoveUnusedSessions() {
    

}


/*async function k(){
let mongo = new mong("mongodb://localhost:27017")
let db = (await mongo.connect())
let d2 = db.db("Thyforms")
let c = d2.collection("Userprofiles")
//console.log(await CreateSession(c,'sample@gmail.com'))
console.log(await VerifySession(c,'cm35tkf950000jkvqdpu7a3at'))
db.close()
}
k()*/

module.exports = {
    CreateSession,VerifySession,EndSession
}