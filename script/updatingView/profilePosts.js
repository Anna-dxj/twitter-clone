import { getOneUser, fetchPosts } from "../crudOperations/index.js";
import { getCurrentUser } from "../firebase/auth.js";
import { calculateMaxPage } from '../utils/index.js'

export async function getCurrentUserData(pageNum, type) {
    try {
        const currentUser = await getCurrentUser();
        const { userhandle, displayname, bio, posts } = await getOneUser(currentUser); 
    
        const userPostArr = Object.keys(posts).reverse(); 
        const maxPagesNum = calculateMaxPage(userPostArr.length)
    
        const allUserPosts = await fetchPosts(pageNum, type, userPostArr)

        console.log(allUserPosts); 
    
        const returnObj = {
            currentUser, 
            userhandle, 
            displayname,
            bio, 
            allUserPosts,
            // userPosts: posts, 
            userPostArr,
            maxPagesNum, 
        }

        console.log('userPostArr:', userPostArr)
    
        return returnObj
    } catch (error) {
        console.error('Problem getting userData:', error)
    }
    
}