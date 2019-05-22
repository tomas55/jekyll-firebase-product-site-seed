import nodemailer from 'nodemailer';
import key from './service-key.json';
import Email from 'email-templates';
import path from 'path';
import * as functions from 'firebase-functions';

// nodemailer transport options
const options = {
    service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: functions.config().gmail.user,
            serviceClient: key.client_id,
            privateKey: key.private_key
        },
        logger: false
};

const transporter = nodemailer.createTransport(options);

/**
 * sends confirmation email
 * @param to {string} - send to email 
 * @param from {string} - email from
 * @param hash {string} - unique hash for confirmation link
 */
export async function sendConfirmEmail(to: string, from: string, hash: string) {
    
    const templateDir = path.join(__dirname, 'emails')
    const email = new Email({
        message: {
            to,
            from
        },
        transport: transporter,
        views: {
            root: templateDir
        }
    });

    await email.send({
        template: 'confirm',
        locals: { hash }
    });
}



// tests connection 
export function testMailer () {
    options.logger = true;
    const mailTrsp = nodemailer.createTransport(options);

    mailTrsp.on('token', (token: any) => console.log(token));

    mailTrsp.verify(function(error: any, success: any) {
        if (error) {
             console.log(error);
        } else {
             console.log('Server is ready to take our messages');
        }
     });
}
