import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyBNmLunGkbWxVx-3U7a56AHa0za5zHREW4",
  authDomain: "twitter-clone-601e7.firebaseapp.com",
  projectId: "twitter-clone-601e7",
  storageBucket: "twitter-clone-601e7.appspot.com",
  messagingSenderId: "41113534420",
  appId: "1:41113534420:web:420fb003760715ea84e041",
  measurementId: "G-D430L5FLNM"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getDatabase(app)