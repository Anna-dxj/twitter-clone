import { auth, db } from './db.js';
import { ref, get, set } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';

let currentUser = null; 

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; 
        currentUser = user;

        const userRef = ref(db, `user/${user.uid}`)
        const snapshot = await get(userRef);

        if (snapshot) {
            return { user, userData: snapshot.val() }
        }
    } catch (error) {
        throw error
    }
}

export async function createUser(email, password, userhandle) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user; 

        const userRef = ref(db, `user/${newUser.uid}`);

        await set(userRef, {
            email: newUser.email, 
            userhandle: userhandle, 
            posts: {}
        })

        currentUser = newUser; 

        return newUser; 
    } catch (error) {
        throw error
    }
}

export function getCurrentUser() {
    return currentUser.uid;
}

export async function logoutUser() {
    try {
        await signOut(auth);
        currentUser = null; 
    } catch (error) {
        throw error
    }
}