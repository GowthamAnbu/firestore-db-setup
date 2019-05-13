import * as admin from 'firebase-admin';
const serviceAccount = require('../service-account.json');
// import * as fs from 'fs-extra';

// const filePathToJson = '/home/local/TAG/gowthama/Desktop/playground/Firebase/functions/test.json';

// const obj = fs.readJSONSync(filePathToJson);

// const allCollections: Array<FirebaseFirestore.CollectionReference> = [];

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

/* async function getAllcollections() {
  const collections = await admin.firestore().listCollections();
  for(const collection of collections) {
    console.log(`Found collection with id: ${collection.id}`);
    allCollections.push(collection);
  };
  await getShallowPrimaryFields();
} */

/* async function getShallowPrimaryFields() {
  const promiseArray: Array<Promise<FirebaseFirestore.QuerySnapshot>> = [];
  allCollections.forEach(collection => {
    const collectionSnapshotPromise = admin.firestore().collection(`${collection.id}`).get();
    promiseArray.push(collectionSnapshotPromise);
  });
  const collectionSnapshots = await Promise.all(promiseArray);
  collectionSnapshots.forEach(snapshot => {
    snapshot.docs.forEach(doc => console.log(doc.data()))
  });
} */

/* async function chat(room: string, name: string, text: string) {
  // * Firestore
  await admin.firestore().collection('rooms').doc(room).collection('messages').doc().set({name, text}, {merge: true});
  // * Real Time Database
  // const messagesRef = admin.database().ref('rooms').child(room).child('messages');
  // await messagesRef.push({name, text});
  console.log(`${name}: ${text}`);
  await sleep(2000);
} */

/* function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve,ms));
} */

