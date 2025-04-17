// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz-FrSPMo6QP5SMI3pnaX21O6IMlv3obg",
  authDomain: "saa-finalprjoject.firebaseapp.com",
  projectId: "saa-finalprjoject",
  storageBucket: "saa-finalprjoject.appspot.com",
  messagingSenderId: "703575363419",
  appId: "1:703575363419:web:50c361ca96ee092611547e",
  measurementId: "G-ZBDP8SGZTH",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAz-FrSPMo6QP5SMI3pnaX21O6IMlv3obg",
//   authDomain: "saa-finalprjoject.firebaseapp.com",
//   projectId: "saa-finalprjoject",
//   storageBucket: "saa-finalprjoject.firebasestorage.app",
//   messagingSenderId: "703575363419",
//   appId: "1:703575363419:web:50c361ca96ee092611547e",
//   measurementId: "G-ZBDP8SGZTH",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
