// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRloT-f6E6RfagW-pwMCF0CoooNehTcD0",
  authDomain: "pantry-app-2d9fc.firebaseapp.com",
  projectId: "pantry-app-2d9fc",
  storageBucket: "pantry-app-2d9fc.appspot.com",
  messagingSenderId: "819843261373",
  appId: "1:819843261373:web:1d1539e6fa2fa3283728d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {
  app,
  firestore
};

