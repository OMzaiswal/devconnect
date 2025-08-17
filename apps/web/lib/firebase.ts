// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAroUbDwPqpGRLrCxjgR4DMjllYdxwnHpk",
  authDomain: "devconnnect-om.firebaseapp.com",
  projectId: "devconnnect-om",
  storageBucket: "devconnnect-om.firebasestorage.app",
  messagingSenderId: "999226732130",
  appId: "1:999226732130:web:166b3af87387f07bd56b3b",
//   measurementId: "G-SPWL85P54M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);