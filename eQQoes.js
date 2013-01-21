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
// GET database to see if there are new eQQoes waiting to be eQQoed
var a_e = function(){
request(
    {
        method: 'GET'
     , uri: 'http://localhost:1984/eqqoes/_design/eqqo_00/_view/auto_eqqo'
     , json: true
    }, function(error, response, body){
        if(response.statusCode == 200 && body.total_rows > 0 ){
            console.log('Data Acquired');
            body.rows.forEach(function (doc){
                // setup e-mail data with unicode symbols
                var mailOptions;
                if(doc.value.lang == 'fr' && doc.value.schedule == null){
                   mailOptions = {
                       from: "Premier eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Bonjour - Voici le 1er eQQo pour " + doc.value.sharee + " ✔"  
                       , text:  "'" + doc.value.sharee + "'  est actuellement partagé (avec <3) entre " + doc.value.sharers[0] + " et " + doc.value.sharers[1] + ", 'Ad vitam æternam'. \r\n" 
                   };
                  }else if(doc.value.lang == 'fr'){
                   mailOptions = {
                       from: "Premier eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Bonjour - Voici le 1er eQQo pour " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "'  est actuellement partagé (avec <3) entre " + doc.value.sharers[0] + " et " + doc.value.sharers[1] + " jusqu'au " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ".  Vous recevrez un 2nd eQQo la veille, pour vous le rappeler. :).\r\n \r\n  D'ici là, portez vous bien!" // plaintext body
                   };
                  }else if(doc.value.lang == 'en' && doc.value.schedule == null){
                   mailOptions = {
                       from: "First eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the first eQQo for " + doc.value.sharee + " ✔"  
                       , text:  "'" + doc.value.sharee + "'  is currently shared (with <3) between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + ", 'Ad vitam æternam'. \r\n" 
                   };
                  }else if(doc.value.lang == 'en'){
                   mailOptions = {
                       from: "First eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the first eQQo for " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "' is currently shared (with <3) between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + " until the " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ". The QloQ has started. You shall receive another eQQo the previous day, so that you remember. :).\r\n \r\n  Until then, take care!" // plaintext body
                   };
                  }else if(doc.value.lang == null && doc.value.schedule == null){
                   mailOptions = {
                       from: "First eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the first eQQo for " + doc.value.sharee + " ✔"  
                       , text:  "'" + doc.value.sharee + "'  is currently shared (with <3) between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + ", 'Ad vitam æternam'. \r\n" 
                   };
                  }else if(doc.value.lang == null){
                   mailOptions = {
                       from: "First eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the first eQQo for " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "' is currently shared (with <3) between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + " until the " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ". The QloQ has started. You shall receive another eQQo the previous day, so that you remember it. :).\r\n \r\n  Until then, take care!" // plaintext body
                   };
                  }
                console.log('mailOptions configured');        
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                        //modify the document
                        delete doc.value.auto_eqqo;
                        doc.value.auto_eQQo = true;
                        // if you don't want to use this transport object anymore, uncomment following line
                        //smtpTransport.close(); // shut down the connection pool, no more messages
                        // Now send the updated document
                        request(
                            { method: 'PUT'
                             , uri: 'http://localhost:1984/eqqoes/' + doc.value._id
                             , json: doc.value 
                            }
                            , function (error, response, body) {
                                if(response.statusCode == 201){
                                    console.log('document saved as: ' + doc.value._id)
                                }else{
                                    console.log('error when saving: '+ response.statusCode);
                                    console.log(body);
                                }
                            });
                    }
                }); 
            })
        }else if(response.statusCode == 200 && body.total_rows == 0 ){
            console.log('No eQQo to be autosent: '+ response.statusCode)
        }else{
            console.log("Uh uh..." + response.statusCode)
        }
    });
};
exports.a_e = a_e;
// GET database to see if there are final eQQœs waiting to be eQQoed
var f_e = function(){
request(
    {
        method: 'GET'
     , uri: 'http://localhost:1984/eqqoes/_design/eqqo_00/_view/final_eqqo'
     , json: true
    }, function(error, response, body){
        if(response.statusCode == 200 && body.total_rows > 0 ){
            console.log('Data Acquired');
            body.rows.forEach(function (doc){
                // setup e-mail data with unicode symbols
                var mailOptions;
                if(doc.value.lang == 'fr'){
                   mailOptions = {
                       from: "Second eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Bonjour - Voici le 2nd eQQo pour " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "'  est partagé entre " + doc.value.sharers[0] + " et " + doc.value.sharers[1] + " jusqu'au " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ". \r\n Vous devriez jetez un coup d'oeil à la date d'aujourd'hui, au cas où vous auriez oublié. ;). \r\n Et d'ici votre prochain eQQo, portez vous bien!" // plaintext body
                   };
                  }else if(doc.value.lang == 'en'){
                   mailOptions = {
                       from: "Second eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the 2nd eQQo for " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "' is being shared between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + " until the " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ". \r\n You should check today's date, just in case. ;). \r\n And until your next eQQo, take care!" // plaintext body
                   };
                  }else if(doc.value.lang == null){
                   mailOptions = {
                       from: "Second eQQo ✔"
                       , to: doc.value.sharers
                       , subject: "Hi - Here comes the 2nd eQQo for " + doc.value.sharee + " ✔"
                       , text:  "'" + doc.value.sharee + "' is being shared between " + doc.value.sharers[0] + " & " + doc.value.sharers[1] + " until the " + doc.value.schedule[2] + "/" + doc.value.schedule[1] + "/" + doc.value.schedule[0] + ". \r\n You should check today's date, just in case. ;). \r\n And until your next eQQo, take care!" // plaintext body
                   };
                  }
                console.log('mailOptions mis a jour');   
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                        //modify the document
                        delete doc.value.final_eqqo;
                        doc.value.final_eQQo = true;
                        // if you don't want to use this transport object anymore, uncomment following line
                        //smtpTransport.close(); // shut down the connection pool, no more messages
                        // Now send the updated document
                        request(
                            { method: 'PUT'
                             , uri: 'http://localhost:1984/eqqoes/' + doc.value._id
                             , json: doc.value 
                            }
                            , function (error, response, body) {
                                if(response.statusCode == 201){
                                    console.log('document saved as: ' + doc.value._id)
                                }else{
                                    console.log('error when saving: '+ response.statusCode);
                                    console.log(body);
                                }
                            });
                    }
                }); 
            })
        }else if(response.statusCode == 200 && body.total_rows == 0 ){
            console.log('No eQQo to scheduled for now: '+ response.statusCode)
        }else{
            console.log("Uh uh..." + response.statusCode)
        }
    });
};
exports.f_e = f_e;
//
//
// DAEMONS
//
//
// eQQoing starts
var starts = function(){
    console.log('eQQoing starts');
    follow("https://localhost:1984/eqqoes/", function(error, change) {
        if(!error && change.seq > 111){
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
