// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1oOoJhpZgZkYKo2w-pEGQdK5coP2T6-U",
    authDomain: "ntufyp-242b6.firebaseapp.com",
    databaseURL: "https://ntufyp-242b6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ntufyp-242b6",
    storageBucket: "ntufyp-242b6.appspot.com",
    messagingSenderId: "541498843878",
    appId: "1:541498843878:web:2640482866acd47be89127",
    measurementId: "G-3KM96Q7NNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fbDatabase = getDatabase(app);

const analytics = getAnalytics(app);

export {fbDatabase};