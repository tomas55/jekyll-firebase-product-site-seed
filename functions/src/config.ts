import * as admin from 'firebase-admin';
import serviceAccount from './service-key.json';
// import * as functions from 'firebase-functions';


const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');

const params = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url
  }

adminConfig.credential = admin.credential.cert(params);

// admin.initializeApp({
//     serviceAccountId: key.client_email,
//     databaseURL: functions.config().db.url
// });
admin.initializeApp(adminConfig);

export default admin;