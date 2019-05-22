import * as admin from 'firebase-admin';
import key from './service-key.json';


admin.initializeApp({
    serviceAccountId: key.client_email
});


export default admin;