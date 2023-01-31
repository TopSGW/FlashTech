require('dotenv').config();
const https = require("https");
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRIDAPIKEY);

const sendEmail = ({ to, from, subject, text, html }) => {
    const msg = { to, from, subject, text, html };
    return sgMail.send(msg);
};

const app = express();
// app.use(cors({
//     origin: 'https://flash-technologies.org/'
// }));
app.use(cors({
    origin: '*'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('build'));

app.post('/messages', async (req, res)=>{

    const info = req.body;
    console.log(info);
    // msg.from = info.emailAddress;
    // msg.subject = info.firstName + info.lastName;
    // msg.text = info.messageContent;
    try {
        await sendEmail({
            //the client email 
           to: 'contact@flash-technologies.com',
            // to: 'junior950803@gmail.com',
           // to: 'web.smartdev22@gmail.com',
            //sendGrid sender id 
            from: info.emailAddress,
            subject: info.firstName + info.lastName,
            text: info.messageContent,
            html:`<h1>Name: ${info.firstName +' '+ info.lastName}</h1>
                <h1> <strong>Email: ${info.emailAddress}</strong> </h1>
                 <p>message: ${info.messageContent}</p>`
        });
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

const port = 3000;

// app.listen(port, console.log(`server running on port 3000`));

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  };

// Creating https server by passing
// options and app object
https.createServer(options, app)
.listen(port, function (req, res) {
  console.log("Server started at port 3000");
});