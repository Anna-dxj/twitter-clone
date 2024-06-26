import { getOneUser, fetchPosts, getAllUsers } from "../crudOperations/index.js";
import { getCurrentUser } from "../firebase/auth.js";
import { calculateMaxPage } from '../utils/index.js'

export async function getCurrentUserData(pageNum, type) {
    try {
        const currentUser = await getCurrentUser();
        const { userhandle, displayname, bio, posts = {} } = await getOneUser(currentUser); 
    
        const userPostArr = Object.keys(posts).reverse(); 
        const maxPagesNum = calculateMaxPage(userPostArr.length)
    
        const allUserPosts = await fetchPosts(pageNum, type, userPostArr)

        const returnObj = {
            currentUser, 
            userhandle, 
            displayname,
            bio, 
            allUserPosts,
            userPostArr,
            maxPagesNum, 
        }

        return returnObj
    } catch (error) {
        console.error('Problem getting userData:', error)
    }
    
}

export async function getOtherUserData(otherUserId, pageNum, type) {
    try {
        const currentUser = await getCurrentUser();
        const { userhandle, displayname, bio, posts = {} } = await getOneUser(otherUserId); 
    
        const userPostArr = Object.keys(posts).reverse(); 
        const maxPagesNum = calculateMaxPage(userPostArr.length)
    
        const allUserPosts = await fetchPosts(pageNum, type, userPostArr)

        const returnObj = {
            currentUser, 
            userhandle, 
            displayname,
            bio, 
            allUserPosts,
            userPostArr,
            maxPagesNum, 
        }

    
        return returnObj
    } catch (error) {
        console.error('Problem getting userData:', error)
    }
    
}

export async function getAllUserhandles() {
    try {
        const userIdArr = await getAllUsers(); 
        const userhandleArr = []

        for (const userId of userIdArr) {
            const { userhandle } = await getOneUser(userId)
            userhandleArr.push(userhandle); 
        }

        return userhandleArr
    } catch (error) {
        console.error('Problem in fetching userhandles:', error)
    }
}