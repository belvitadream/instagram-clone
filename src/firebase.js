import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyCQBnsDtAsAvVXTMfmNnCFBGg0s58o1a64',
  authDomain: 'instagram-clone-848c4.firebaseapp.com',
  projectId: 'instagram-clone-848c4',
  storageBucket: 'instagram-clone-848c4.appspot.com',
  messagingSenderId: '830300604186',
  appId: '1:830300604186:web:9dbb65d25de3fc02394ea3',
  measurementId: 'G-TBD1BHX2JL',
})

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebaseApp.storage()
export { db, auth, storage }
