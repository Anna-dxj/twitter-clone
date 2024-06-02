import { ref, get, query, orderByChild, startAt, endAt } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js';
import { showEl } from '../utils/index.js';
import { db } from '../firebase/db.js'

export async function fetchPosts(pageNum, type, postIdsArr) {
    const feedPageNav = document.querySelector('#feed-page-navigator');
    const feedCurrentPageTxt = document.querySelector('#feed-current-page'); 
    const myProfileNav = document.querySelector('#my-page-navigator');
    const myCurrentPageTxt = document.querySelector('#my-current-page')

    const start = (pageNum - 1) * 10; 
    const end = start + 10; 
    if (type === 'feed') {

        const allPosts = await getAllPosts()
        
        if (Object.keys(allPosts).length > 10) {
            showEl(feedPageNav)
            feedCurrentPageTxt.textContent = pageNum;
        } else {
            hideEl(feedPageNav)
        }
        
        
        const paginatedPosts = allPosts.reverse().slice(start, end).reverse()
    
        const postWithUserDetails = await Promise.all(
            paginatedPosts.map(async (post) => {
                const { creatorId, postContent, postId, likes } = post; 
                const { userhandle, displayname } = await getOneUser(creatorId); 
                return { userhandle, displayname, postContent, postId, creatorId, likes }
            })
        )
        return postWithUserDetails
    } else {
        if (postIdsArr.length > 10) {
            showEl(myProfileNav)
            myCurrentPageTxt.textContent = pageNum;
        } else {
            hideEl(myProfileNav)
        }

        const paginatedPosts = postIdsArr.slice(start, end)

        const postDetails = await Promise.all(
            paginatedPosts.map(async (postId) => {
                const postData = await getOnePost(postId); 
                if (postData) {
                    const { postContent, likes, postId, creatorId } = postData
                    return { postContent, likes, postId, creatorId }
                }
            })
        )
        return postDetails
    }
}

export async function getAllPosts() {
    const postRef = ref(db, 'posts');
    if (postRef) {
        const snapshot = await get(postRef);
    
        if (snapshot.exists()) {
            const posts = snapshot.val();
            const postsArr = Object.keys(posts).map(key => ({ id: key, ...posts[key] }));
            return postsArr; 
        } else {
            return {}; 
        }
    }
}

export async function getOnePost(postId) {
    try {
        const postRef = ref(db, `posts/${postId}`);
        const snapshot = await get(postRef);

        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            throw new Error('Post data not found!')
        }
    } catch (error) {
        console.error('Could not get post:', error)
    }
}

export async function getUsersByKeyword(keyword) {
    const usersRef = ref(db, 'user'); 
    const queryRef = query(usersRef, orderByChild('userHandle')
    )

    try {
        const snapshot = await get(queryRef);
        const results = []

        snapshot.forEach(child => {
            results.push(child.val())
        })
    } catch (error) {
        console.error('Could not get users:', error)
    }
}

export async function getOneUser(userId) {
    try {
        const userRef = ref(db, `user/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            throw new Error('User data not found!')
        }
    } catch (error) {
        console.error('Could not get user: ', error)
    }
}