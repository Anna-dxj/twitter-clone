import { auth, db } from './db.js';
import { showEl, hideEl } from '../utils/hideShowDivs.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';

let currentUser = null; 

export async function getUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 
        currentUser = user;

        const userRef = ref(db, `user/${user.id}`)
        const snapshot = await get(userRef);

        if (snapshot) {
            return { user, userData: snapshot.val() }
        }
    } catch (error) {
        throw error
    }

}