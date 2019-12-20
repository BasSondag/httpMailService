const config = require('../config/config');
const he = require('he');
const querystring = require("querystring");
const request = require("request-promise");


module.exports = (() => {
  // build options for mailgun
  function mailgunOptions(data) {
    // convert data for mailgun bodyParser
    let mailgunBody = {
      to: data.to_name + "<" + data.to + ">",
      from: data.from_name + "<" + data.from + ">",
      subject: data.subject,
      text: data.text
    };
    // set clientServiceOptions
    let clientServiceOptions = {
      method: "POST",
      uri: "https://api:"+ config.mailgun.apiKey + "@api" +".mailgun.net/v3/"+ config.mailgun.domain  + "/messages",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: querystring.stringify(mailgunBody)
    };
    return clientServiceOptions;
  };

  // build options for sendgrid
  function sendgridOptions(data) {
    // convert data to sendgrid body
    let sendgridBody = {
      "personalizations": [
        {
        "to": [
          {
            "email": data.to,
            "name": data.to_name

          }
        ],
        "subject": data.subject
      }
    ],
      "from": {
        "email": data.from,
        "name": data.from_name
      },
      "content": [
        {
          "type": "text/plain",
          "value": data.text
        }
      ]
    };
    // set clientServiceOptions
    let clientServiceOptions = {
      method: "POST",
      uri: "https://api.sendgrid.com/v3/mail/send",
      headers: {
        "Authorization": "Bearer " + config.sendgrid.apiKey,
        "content-type": "application/json"
      },
      body: sendgridBody,
      json: true
    };
    // console.log(clientServiceOptions)
    return clientServiceOptions;
  };

  return {
    create: (req, res) => {
      const mailData = {
        to: req.body.to,
        to_name: req.body.to_name,
        from: req.body.from,
        from_name: req.body.from_name,
        subject: req.body.subject,
        text: req.body.body
      };

      const errors = [];

      // validate mailData
      for(let key in mailData) {
        if(mailData[key] == null || typeof mailData[key] !== "string" || mailData[key].length < 1 || !mailData[key].trim().length ) {
          errors.push("field " + key + " can not be empty");
        }
        if (key === "to"  && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailData[key])) || key === "from" && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailData[key])) ) {
          errors.push("field " + key + " is not a valid email");
        }
      };
      if (errors.length > 0) {
        return res.status(400).json({message: errors})
      }

      //strip html from body
      mailData.text = mailData.text.replace(/<[^>]+>/g, '');
      mailData.text = he.decode(mailData.text);


      // send mail
      function sendMail(clientServiceOptions) {
        request(clientServiceOptions)
          .then((response) => {
            res.status(200).json({success:true});
          })
          .catch((err) => {
            request(mailgunOptions(mailData))
              .then((response) => {
                res.status(200).json({success:true});
              })
              .catch((err) => {
                res.status(500).json({message: "mail is not send"})
              })
          })

      };
      sendMail(sendgridOptions(mailData));

    }
  }
})();
