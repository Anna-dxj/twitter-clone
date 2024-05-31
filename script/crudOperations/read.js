import { ref, get, query, orderByChild, startAt, endAt } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js';
import { db } from '../firebase/db.js'

export async function getAllPosts() {
    const postRef = ref(db, 'posts');
    const snapshot = await get(postRef);

    if (snapshot.exists()) {
        const posts = snapshot.val();
        // console.log(posts)
        return posts; 
    } else {
        throw new Erorr('No posts found in database!')
    }
}

export async function getOnePost(postId) {
    try {
        const postRef = ref(db, `posts/${postId}`);
        const snapshot = await get(postRef);

        if (snapshot.exists()) {
            // console.log(snapshot.val())
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
        console.log(keyword)

        const snapshot = await get(queryRef);
        const results = []

        snapshot.forEach(child => {
            results.push(child.val())
        })

        console.log(results.length)
        // return results;
    } catch (error) {
        console.error('Could not get users:', error)
    }
}

export async function getOneUser(userId) {
    try {
        const userRef = ref(db, `user/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            console.log(snapshot.val())
            return snapshot.val();
        } else {
            throw new Error('User data not found!')
        }
    } catch (error) {
        console.error('Could not get user: ', error)
    }
}