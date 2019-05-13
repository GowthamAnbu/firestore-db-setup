import * as admin from 'firebase-admin';
const serviceAccount = require('../service-account.json');
import * as fs from 'fs-extra';

const filePathToJson = '/home/local/TAG/gowthama/Desktop/playground/Firebase/functions/test.json';
const obj = fs.readJSONSync(filePathToJson);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});


(async ( ) => {
  await setup();
  process.exit(0);
})()
. catch (err => { console.error(err) })

export async function setup() {
  console.log(obj);
  await admin.firestore().collection('test1').doc('pizzachat').collection('messages').add(obj);
}