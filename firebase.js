// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCm4yV8UQInwtkePfpjuL_PPt2t37F-9do",
    authDomain: "todoapp-d35fd.firebaseapp.com",
    projectId: "todoapp-d35fd",
    storageBucket: "todoapp-d35fd.appspot.com",
    messagingSenderId: "900298737121",
    appId: "1:900298737121:web:b061df3e1fffc88ef73ea0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc };