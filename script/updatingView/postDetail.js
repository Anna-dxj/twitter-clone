import { getOneUser, fetchPosts, getOnePost, getOneComment } from "../crudOperations/index.js";
import { getCurrentUser } from "../firebase/auth.js";
import { calculateMaxPage } from '../utils/index.js'

export async function getPostData(postId, posterId) {
    try {
        const currentUser = await getCurrentUser();
        const { postContent, likes, comments, dateUpdated } = await getOnePost(postId); 
        const { userhandle, displayname } = await getOneUser(posterId); 
    
        const returnObj = {
            currentUser,
            postContent, 
            likes,
            comments, 
            userhandle, 
            displayname, 
            dateUpdated,
        }

        return returnObj
    } catch (error) {
        console.error('Problem getting postData:', error)
    }
}

export async function getCommentData(commentId, postId) {
    try {
        const { commenterId, commentContent } = await getOneComment(commentId, postId); 
        const { userhandle, displayname } = await getOneUser(commenterId); 
    
        const returnObj = { 
            commentContent, 
            commenterHandle: userhandle, 
            commenterDisplayname: displayname
        }
    
        return returnObj
    } catch (error) {
        console.error('Error getting comment data', error)        
    }
}