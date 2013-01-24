// GET database to see if there are final eQQœs waiting to be eQQoed
var f_e = function(){
request(
    {
        method: 'GET'
     , uri: 'localhost:5984/eqqoes/_design/eqqo_00/_view/final_eqqo'
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
            console.log('No eQQo to scheduled for now: '+ response.statusCode)
        }else{
            console.log("Uh uh..." + response.statusCode)
        }
    });
};
exports.f_e = f_e;
