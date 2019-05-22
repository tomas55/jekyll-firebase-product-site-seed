import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

// Import the core node modules.
import admin from './config';

export const confirmMail = functions.https.onRequest(async (req, res) => {
  const confirmId = req.query.uid;
  try {
    const snapshot = await admin.database().ref('confirms').child(confirmId).once('value');
    const data = snapshot.val();
    const {email} = data;
    const key = email.replace(/\./g, '%2E');

    await admin.database().ref(`/signups/${key}`).update({confirmed: admin.database.ServerValue.TIMESTAMP})    
    await admin.database().ref('confirms').child(confirmId).remove();    

    console.log(`Confirmation deleted: ${confirmId}`);
  } catch (error) {
    console.log(`Could not delete confirmation: ${confirmId} | ERROR: ${error}`);
  }

  res.redirect('https://simracing.gp/email-confirmed.html')
});
