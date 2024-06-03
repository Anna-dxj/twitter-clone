import { getOneUser, getOnePost, getAllPosts, updateUserInfo, createPost, addLikes, removeLikes, deletePost, fetchPosts } from "../crudOperations/index.js";
import { loginUser, createUser, getCurrentUser, logoutUser } from "../firebase/auth.js";
import { calculateMaxPage } from '../utils/index.js'

export async function getAllPostInfo(pageNum, type) {
    try {
        const currentUser = await getCurrentUser(); 
        const allPosts = await fetchPosts(pageNum, type);
    
        const allPostsObj = await getAllPosts(); 
        const allPostsNum = Object.keys(allPostsObj).length; 
        const maxPagesNum = calculateMaxPage(allPostsNum); 
    
        const allPostInfoObj = {
            currentUser, 
            allPosts, 
            maxPagesNum,
        }
        return allPostInfoObj
    } catch (error) {
        console.error('Error getting all Post Info:', error)
        
    }
}

export async function updateHomeDiv() {}