const GenerateCUID = require("cuid")
async function GetForm(rq,rs) {

    // Needed vars
    let IsVisible = false 
    let IsAllowed = false
    let Fields = null
    let name = null
    let frmid = null

    // Getting ready for fields and name
    let Collections = await rs.db.listCollections().toArray()
    let collectionSize = 0
    while(collectionSize != Collections.length){
        let form = await rs.db.collection(Collections[collectionSize].name).findOne({formID:rq.query.frmid})
        
        if(form != null){
            Fields = form.fields
            name = form.formname
            frmid = form.formID
            IsVisible = form.settings.visibility
            IsAllowed = form.visitors.length == parseInt(form.settings.onlyAllowed)
            break
        }
        collectionSize++
    }
   
    // Getting ready for fields UI
    let UI = ``
    if(Fields != null){
        if(IsVisible){
            if(!IsAllowed){
                for(let param of Fields){
                    UI += `<section>
                        <b>${param}</b>
                        <input type="text" placeholder="${param}">
                    </section>`
                }
        
                let Form = `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://kit.fontawesome.com/f4a9039b41.js" crossorigin="anonymous"></script>

            <script>sessionStorage.setItem("TFRMID","${frmid}")</script>

            <link rel="stylesheet" href="https://yak-upright-urgently.ngrok-free.app/TForm.css">
            <title>${name} - FormNest</title>
        </head>
        <body>
            
            <div class="form">
                <b class="title">${name}</b>
                ${UI+`<div class="opts">
                    <button>RESET</button>
                    <button>SUBMIT</button>
                </div>`}
                
                <div class="thinfo">Powered By <span>FormNest<sup>&reg;</sup></span></div>
            </div>
        
            <div class="msh">
            <b class="msg"><i class="fa-solid fa-message"></i> Message</b>
        </div>

        <script src="https://yak-upright-urgently.ngrok-free.app/TForm.js"></script>
        </body>
        </html>
                `
                rs.send(Form)
            }
            else{
              // IF NOT ALLOWED
              let Form = `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://kit.fontawesome.com/f4a9039b41.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="https://yak-upright-urgently.ngrok-free.app/TForm.css">
            <title>${name} - FormNest</title>
        </head>
        <body>
            
            <div class="form">
                <b class="title">${name}</b>
                <b class="mainmsg">Sorry, Form requesting quota was fulled !</b>
                <div class="thinfo">Powered By <span>FormNest<sup>&reg;</sup></span></div>
            </div>
        
            <div class="msh">
            <b class="msg"><i class="fa-solid fa-message"></i> Message</b>
        </div>
        </body>
        </html>
                `
                rs.send(Form)
            }
        }
        else{
          // IF VISIBLE FALSE   
          let Form = `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://kit.fontawesome.com/f4a9039b41.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="https://yak-upright-urgently.ngrok-free.app/TForm.css">
            <title>${name} - FormNest</title>
        </head>
        <body>
            
            <div class="form">
                <b class="title">${name}</b>
                <b class="mainmsg">Unfourtunately, form was currently turned off. Please try again after an hour.</b>
                <div class="thinfo">Powered By <span>FormNest<sup>&reg;</sup></span></div>
            </div>
        
            <div class="msh">
            <b class="msg"><i class="fa-solid fa-message"></i> Message</b>
        </div>
        </body>
        </html>
                `
                rs.send(Form)
        }
    }
    else{
        // IF FORM NOT FOUND
        let Form = `
                <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://kit.fontawesome.com/f4a9039b41.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="https://yak-upright-urgently.ngrok-free.app/TForm.css">
            <title>Message - FormNest</title>
        </head>
        <body>
            
            <div class="form">
                <b class="title">FormNest - Message</b>
                <b class="mainmsg">Form not found !</b>
                <div class="thinfo">Powered By <span>FormNest<sup>&reg;</sup></span></div>
            </div>
        
            <div class="msh">
            <b class="msg"><i class="fa-solid fa-message"></i> Message</b>
        </div>
        </body>
        </html>
                `
                rs.send(Form)
    }
}

async function SubmitForm(rq,rs){
    let Collections = await rs.db.listCollections().toArray()
    let collectionSize = 0
    let isexist = true
    console.log(Collections.length)
    while(collectionSize != Collections.length){
        if(Collections[collectionSize].name == "Userprofiles"){
            collectionSize++
            continue
        }
        else{
            let form = await rs.db.collection(Collections[collectionSize].name).findOne({formID:rq.body.frmid})
             console.log(Collections[collectionSize].name)
            if(form != null){
                isexist = true
                break
            }
            else{
                isexist = false
            }
        }
        collectionSize++
    }

    if(isexist){
        
        let issubited = (await rs.db.collection(Collections[collectionSize].name).updateOne({formID:rq.body.frmid},
            {$push:{
                visitors:{
                    custname:rq.body.name,
                    custid:GenerateCUID(),
                    submittedAt:(new Date()).toISOString(),
                    datum:rq.body.datum
                }
            }}
        )).modifiedCount == 1
        console.log(issubited)

        if(issubited){

            rs.send({data:true})
        }
        else{
            rs.send({data:false})
        }
    }
    else{
        rs.send({data:"FORM_NOT_EXIST"})
    }
}

module.exports = {GetForm,SubmitForm} 