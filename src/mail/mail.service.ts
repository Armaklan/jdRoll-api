import nodemailer from 'nodemailer';

export default class MailService {

  constructor() {

  }

  sendMail () {
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"jdRoll" <contact@jdroll.org>', // sender address
        to: 'test@armaklan.org', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    }); 
  }

};
