import * as admin from 'firebase-admin';
const serviceAccount = require('../service-account.json');
import * as fs from 'fs-extra';

const directoryPathToJson = '/home/local/TAG/gowthama/Desktop/Test/';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

(async ( ) => {
  await backup();
  process.exit(0);
})()
. catch (err => { console.error(err) })

export async function backup() {
  const collections = await admin.firestore().listCollections();
  for(const collection of collections) {
    console.log(`-----${collection.id}-----`);
    fs.mkdirpSync(`${directoryPathToJson}${collection.id}`);
    const allDocs = await admin.firestore().collection(`${collection.id}`).listDocuments();
    for (const doc of allDocs) {
      console.log(`Found document with id: ${doc.id}`);
      // primary docs
      const primaryDoc = await admin.firestore().collection(`${collection.id}`).doc(`${doc.id}`).get();
      if(primaryDoc.exists) {
        console.log(primaryDoc.data());
        fs.writeJSONSync(`${directoryPathToJson}${collection.id}/${doc.id}.json`, primaryDoc.data());
      }
      //  else {
      //   console.log(doc.id, 'document doesn\'t exists or document is a subcollection')
      // }
      // subcollections
      const subCollections = await admin.firestore().collection(`${collection.id}`).doc(`${doc.id}`).listCollections();
      for (const subCollection of subCollections) {
        fs.mkdirpSync(`${directoryPathToJson}${collection.id}/${doc.id}`);
        console.log(`-----${subCollection.id}-----`);
        const subCollectionData = await admin.firestore().collection(`${collection.id}`).doc(`${doc.id}`).collection(`${subCollection.id}`).get();
        subCollectionData.docs.forEach(subCollectionDoc => {
          fs.mkdirpSync(`${directoryPathToJson}${collection.id}/${doc.id}/${subCollection.id}`);
          console.log(subCollectionDoc.data());
          fs.writeJSONSync(`${directoryPathToJson}${collection.id}/${doc.id}/${subCollection.id}/${subCollectionDoc.id}.json`, subCollectionDoc.data());
        })
        console.log(`-----${subCollection.id}-----`);
      }
    }
    console.log(`-----${collection.id}-----`);
  };
}

