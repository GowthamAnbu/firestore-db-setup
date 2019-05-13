import * as admin from 'firebase-admin';
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});


(async ( ) => {
  // await chat( 'pizzachat' , 'Fear', "what the heck is that?!");
  // await chat( 'pizzachat' , 'joy', "who puts broccoli on pizza?!");
  // await getAllcollections();
  // await admin.firestore().collection('test').doc().set(obj)
  const testDocs = await admin.firestore().collection('rooms').listDocuments();
  for (const doc of testDocs) {
    // primary docs
    const primaryDoc = await admin.firestore().collection('rooms').doc(`${doc.id}`).get();
    if(primaryDoc.exists) {
      console.log(doc.id, primaryDoc.data());
    } else {
      console.log(doc.id, 'document doesn\'t exists or document is a subcollection')
    }
    // subcollections
    const subCollections = await admin.firestore().collection('rooms').doc(`${doc.id}`).listCollections();
    for (const subCollection of subCollections) {
      const subCollectionData = await admin.firestore().collection('rooms').doc(`${doc.id}`).collection(`${subCollection.id}`).get();
      subCollectionData.docs.forEach(subCollectionDoc => console.log(subCollectionDoc.data()))
    }
  }
  process.exit(0);
})()
. catch (err => { console.error(err) })