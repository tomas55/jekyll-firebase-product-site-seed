import * as functions from 'firebase-functions';

import {createHash} from 'crypto';
import admin from './config'
import { sendConfirmEmail } from './nodemailer-sender';

/*
 Commented imports for alternative approach
*/
// import key from './service-key.json';
// import { google } from 'googleapis';
// import MailComposer from 'nodemailer/lib/mail-composer';

export const sendMail = functions.database.ref('signups/{emailId}').
    onCreate(async (snapshot, context)=>{
        // console.log('KEY: ', key.client_id);
        
        const rec = snapshot.val();
        const email = rec.email;
        const isValidEmail =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
        if (!isValidEmail) {
          console.log(`EMAIL NOT VALID: ${email}`);
          return;
        }
        
        const hash = createHash('sha256')
            .update(context.params.emailId)
            .digest('hex');
        try {
          await admin.database().ref('/confirms/' + hash).set({
            email,
            date: admin.database.ServerValue.TIMESTAMP
          });
          // await sendGmail(email, hash);
          await sendConfirmEmail(email, functions.config().gmail.sender, hash);
          // console.log('EMAIL SENT TO: ', email);
        } 
        catch (err) {
          console.log('SEND ERROR:', err);
        }    
      });

// ==============================
// Commented code implements an alternative approach using googleapis liblary
//==================================
// async function sendGmail (to: string, hash: string) {
//   try {

//     const jwtClient = new google.auth.JWT({
//       key: key.private_key,
//       email: key.client_email,
//       subject: 'simracing@nascent-works.com',
//       scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://mail.google.com/']
//     });

//     const gtoken = await jwtClient.authorize();
//     console.log('TOKEN: ', gtoken);

//     const raw = await compose('simracing@nascent-works.com', 'mikas@mailinator.com', hash);
    
//     console.log('RAW: ', raw);
    
//   } catch (err) {
//     console.log('SEND ERROR: ', err);
//   }
// }

// async function compose (from: string, to: string, hash: string) {
//   const link = `https://simracing.gp/confirmMail?uid=${hash}`;
//   const body = `<p><b>Hi!</b></p>
//                 <p>Thank you for signing up for <b>simracing.gp BETA</b>.</p>
//                 <p>Please, confirm your email by clicking this 
//                 <a href="${link}">link</a>.</p>`;
  
//   const options = {
//     from: from,
//     to: to,
//     subject: 'simracing.gp email confirmation',
//     html: body
//   }


//   let res = await new MailComposer(options).compile().build();
//   return new Buffer(res.toString()).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
// }

