import { db } from '../firebase/db.js'
import { ref, set, update, get } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js';
import { getOnePost } from './read.js';


export async function updateUserInfo(userId, userhandle, displayname, bio) {
    try {
        const userRef = ref(db, `user/${userId}`);
        await set(userRef, {
            userhandle: userhandle, 
            displayname: displayname, 
            bio: bio, 
        });
    } catch (error) {
        console.error(error); 
    }
}

export async function addLikes(postId, userId) {
    const postRef = ref(db, `posts/${postId}`)

    try {
        await update(postRef, { likes: {[userId]: true}}) 
        console.log('postId', postId, 'userId', userId)

    } catch (error) {
        console.error(error)
    }
}

export async function removeLikes (postId, userId) {
    const postRef = ref(db, `posts/${postId}/likes`)

    try {
        const snapshot = await get(postRef);
        const likesObj = snapshot.val() || {};

        if (likesObj.hasOwnProperty(userId)) {
            delete likesObj[userId]

            await set(postRef, likesObj);

            console.log('unliked!')
        }


    } catch (error) {
        console.error('error removing like:', error)
    }
}