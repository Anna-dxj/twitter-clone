import { db } from "../firebase/db.js";
import { ref, push, update } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

export async function createPost(currentUserId, postContent) {
    const postId = push(ref(db, 'posts')).key;
    const postData = {
        postId: postId,
        creatorId: currentUserId,
        postContent: postContent,
        dateUpdated: new Date().toISOString(),
        likes: {},
    }

    const returnObj = {
        postId: postId, 
        postContent: postData.postContent
    }

    const updateDatabase = {}
    updateDatabase[`posts/${postId}`] = postData;
    updateDatabase[`user/${currentUserId}/posts/${postId}`] = true; 

    try {
        await update(ref(db), updateDatabase); 
        return returnObj
    } catch (error) {
        console.error('Post creation error: ', error)
    }
}