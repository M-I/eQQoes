// GET database to see if there are new eQQoes waiting to be eQQoed
var a_e = function(){
request(
    {
        method: 'GET'
     , uri: 'localhost:5984/eqqoes/_design/eqqo_00/_view/auto_eqqo'
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
                             , uri: 'http://localhost:5984/eqqoes/' + doc.value._id
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
