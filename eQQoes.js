/*
--proto stage--
i.e heavy use of console.log
just to be sure everything is going according to plan
*/
var nodemailer      = require('nodemailer')
    , request       = require('request')
    , follow        = require('follow')
    ;
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport  = nodemailer.createTransport("SMTP",{
  host: "", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
   auth: {
    user: "",
    pass: ""
  }
});
//--------------
//
//
// DAEMONS
//
//
// eQQoing starts
var starts = function(){
    console.log('eQQoing starts');
    follow("https://localhost:5984/eqqoes/", function(error, change) {
        if(!error && change.seq > 34){
            console.log("Got change number " + change.seq + ": " + change.id)
                console.log("Must be new eQQoers! Imma read db")
                    a_e();
        }
    })
};
exports.starts = starts;
// Starting the QloQ
var oQloQ = function(){
    console.log('Starting the QloQ')
        setInterval(f_e, 5 * 61 * 1000);//in milliseconds
};
exports.oQloQ = oQloQ;
starts();
oQloQ();
