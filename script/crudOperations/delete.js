import { db } from "../firebase/db.js";
import { ref, set, get, remove } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js';

export async function deletePost(postId, userId) {
    try {
        const postRef = ref(db, `posts/${postId}`)
        const userRef = ref(db, `user/${userId}/posts`)
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            let postsObj = userSnapshot.val();
            delete postsObj[postId]
            
            await set(userRef, postsObj)
            await remove(postRef); 
        }
    } catch (error) {
        console.error('Error deleting post:', error)
    }
}