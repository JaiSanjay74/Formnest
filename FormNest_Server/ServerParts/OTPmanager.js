var nodemailer = require("nodemailer");

async function sendOTP(details){

    const OTP =  Math.round(Math.random()*10*10*10*10*10*10*10*10*10).toString().substring(0,6);;

      await  nodemailer.createTransport({
        service:"gmail",
        auth:{user:details.ouremail,
        pass:"liqu yaxg nziv gvaq"} //our current google app password : yufb oxjo gsjs qzei
    }).sendMail({
        from:details.ouremail,
        to:details.clientemail,
        subject:details.subject,
        html:`
        
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>

        div:nth-of-type(1){
            background-color: blue;<!--something problem-->
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 1.10rem;
        }
        h1{
            text-align: center;
        }
        div:nth-of-type(2){
            margin-top: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 1.40rem;
        }
        h5{
            font-weight: 400;
            text-align: center;
        }
        h6{
            text-align: center;
        }
        b{
            color: rgb(0, 0, 134);
        }
    </style>
</head>
<body>

    <div>
        <h1>FormNest<sup></sup></h1>
    </div>
    <div>
        <h5>Your OTP for the forget password </h5>
        <h6>Your OTP : <b>${OTP}</b></h6>
    </div>
</body>
</html>
        
        `
    })

    return OTP;
}

async function sendPassword(details){

    const PASSWORD =  details.passw;

      await  nodemailer.createTransport({
        service:"gmail",
        auth:{user:details.ouremail,
        pass:"liqu yaxg nziv gvaq"} //our current google app password : yufb oxjo gsjs qzei
    }).sendMail({
        from:details.ouremail,
        to:details.clientemail,
        subject:details.subject,
        html:`
        
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>

        div:nth-of-type(1){
            background-color: blue;<!--something problem-->
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 1.10rem;
            color: white;
            border: 1px solid white;
        }
        h1{
            text-align: center;
        }
        div:nth-of-type(2){
            margin-top: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid white;
            font-size: 1.40rem;
        }
        h5{
            font-weight: 400;
            text-align: center;
        }
        h6{
            text-align: center;
        }
        b{
            color: rgb(0, 0, 134);
        }
    </style>
</head>
<body>

    <div>
        <h1>FormNest<sup>TM</sup></h1>
    </div>
    <div>
        <h5>Your Password of your account</h5>
        <h6>Your password : <b>${PASSWORD}</b></h6>
    </div>
</body>
</html>
        
        `
    })
}
/*sendOTP({
    ouremail:"jothiarul376@gmail.com",
    clientemail:"perunkarunai@gmail.com",
    subject:"arul foods otp",
})*/
module.exports = {sendOTP,sendPassword};