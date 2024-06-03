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
        comments: {},
    }

    const updateDatabase = {}

    updateDatabase[`posts/${postId}`] = postData;
    updateDatabase[`user/${currentUserId}/posts/${postId}`] = true; 

    try {
        await update(ref(db), updateDatabase); 
    } catch (error) {
        console.error('Post creation error: ', error)
    }
}

export async function createComment(currentUser, commentContent, postId) {
    try {
        const commentRef = `posts/${postId}/comments`
    
        const commentId = push(ref(db, commentRef)).key;
    
    
        const commentData = {
            commentId, 
            commenterId: currentUser,
            commentContent, 
            datePosted: new Date().toISOString(),
        }
    
        const updateDatabase = {}
        updateDatabase[`${commentRef}/${commentId}`] = commentData; 
    
        await update(ref(db), updateDatabase);

        return commentData; 
    } catch (error) {
        console.error('Error creating comment:', error)
    }
}