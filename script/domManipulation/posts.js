import { displayComments } from "./comments.js";
import { showEl, hideEl, convertDate } from "../utils/index.js";
import { getOneUser } from "../crudOperations/index.js";

export function displayPosts(currentUser, userHandle, displayName, content, postId, userId, viewType, comment, likes, dateIsoString) {
       const feedPostContainer = document.querySelector('#post-container-div')
       const userPostContainer = document.querySelector('#user-posts');
       const myPostsContainer = document.querySelector('#my-posts')

       let commentNum = 0; 
       let likesNum = 0;
       let likesImgSrc = null; 
    
        const date = convertDate(dateIsoString)
        const displaynameValue = displayName ? displayName : ''

        console.log(displaynameValue); 

       const newPost = document.createElement('section');


       if (viewType === 'feed') {
           newPost.className = 'col-sm-12 offset-md-1 col-md-10'
       }

       newPost.classList.add('post')

       newPost.setAttribute('data-post-id', postId);
       newPost.setAttribute('data-poster-id', userId);


       if (comment) {
        commentNum = Object.keys(comment).length
       }

       if (likes) {
            likesNum = Object.keys(likes).length
            if (Object.keys(likes).includes(currentUser)) {
                likesImgSrc = './assets/heart-fill-icon.svg'
            } else {
                likesImgSrc = './assets/heart-empty-icon.svg'
            }
        } else {
        likesImgSrc = './assets/heart-empty-icon.svg'
       }

       if (currentUser === userId) {
           newPost.innerHTML = `
           <div class="poster-detail-div d-flex justify-content-between">
                <div class='m-2 p-2'>
                    <h3 class="user-handle">@${userHandle}</h3>
                    <p class="display-name">${displaynameValue}</p>
                </div>
                <div class="m-2 px-2">
                    <button class="delete-btn btn d-flex align-items-center">
                        <img src="./assets/delete-icon.svg" alt="Delete" class="delete-icon"/>
                    </button>
                </div>
            </div>
            <div class="post-body">
                <p>${content}</p>
            </div>
            <div class="d-flex btn-divs justify-content-between align-items-center">
                <div class="px-2 m-2">
                    <p class="date">${date}</p>
                </div>
                <div class="d-flex btn-divs justify-content-end">
                    <div>
                        <button class="likes-btn btn d-flex align-items-center">
                            <img alt="Likes" src="${likesImgSrc}" class="likes-icon"/>
                            <p class="likes-num">${likesNum}</p>
                        </button>
                    </div>
                    <div>
                        <button class="comments-btn btn d-flex align-items-center">
                            <img alt="Comments" src="./assets/comment-icon.svg" class="comments-icon"/>
                            <p class="comments-num">${commentNum}</p>
                        </button>
                    </div>
                </div>
            </div>`
       } else {
            newPost.innerHTML = `
            <div class="poster-detail-div d-flex">
                <div class='m-2 p-2'>
                    <h3 class="user-handle">@${userHandle}</h3>
                    <p class="display-name">${displaynameValue}</p>
                </div>
            </div>
            <div class="post-body">
                <p>${content}</p>
            </div>
            <div class="d-flex btn-divs justify-content-end">
                <div>
                    <button class="likes-btn btn d-flex align-items-center">
                        <img alt="Likes" src="${likesImgSrc}" class="likes-icon"/>
                        <p class="likes-num">${likesNum}</p>
                    </button>
                </div>
                <div>
                    <button class="comments-btn btn d-flex align-items-center">
                        <img alt="Comments" src="./assets/comment-icon.svg" class="comments-icon"/>
                        <p class="comments-num">${commentNum}</p>
                    </button>
                </div>
            </div>`
       }

        if (viewType === 'feed') {
            feedPostContainer.insertBefore(newPost, feedPostContainer.firstChild)
        } else if (viewType === 'profile') {
            myPostsContainer.appendChild(newPost)
        }

}

export function addLikeImg (target) {
    target.src = './assets/heart-fill-icon.svg'
}

export function removeLikeImg (target) {
    target.src = './assets/heart-empty-icon.svg'
}

export function removePost(target) {
    const parentNode = target.parentNode
    parentNode.removeChild(target); 
} 

export async function displayPostDetails(currentUser, userHandle, displayName, postContent, posterId, comment, likes, postId, dateIsoString) {
    const postDetailContainer = document.querySelector('#post-detailed')
    const userHandleTxt = document.querySelector('#detail-user-handle')
    const displayNameTxt = document.querySelector('#detail-display-name')
    const postBodyTxt = document.querySelector('#detail-post-body');
    const likesIcon = document.querySelector('#detail-likes-img')
    const likesNumTxt = document.querySelector('#detail-likes-num');
    const commentsNumTxt = document.querySelector('#detail-comments-num');
    const dateTxt = document.querySelector('#date-detail');
    const commentDiv = document.querySelector('#comment-section');
    const deleteBtn = document.querySelector('#detail-delete-btn');

    let commentNum = 0; 
    let likesNum = 0;
    let likesImgSrc = null;
    const date = convertDate(dateIsoString); 

    const displaynameValue = displayName ?  displayName : ''

    // if currentUser = psoterId 
    // unhide the delte btn 
    // THEN ADD EVENT LISTENER TO DELETE BTN! 
    postDetailContainer.setAttribute('data-post-id', postId)
    postDetailContainer.setAttribute('data-poster-id', posterId)

    commentDiv.innerHTML = ''

    
    if (currentUser === posterId) {
        deleteBtn.classList.add('delete-btn', 'btn', 'd-flex', 'align-items-center')
        showEl(deleteBtn);
    } else {
        hideEl(deleteBtn); 
        deleteBtn.classList.remove('delete-btn', 'btn', 'd-flex', 'align-items-center')
    }


    if (comment) {
        commentNum = Object.keys(comment).length
        showEl(commentDiv)
    } else {
        hideEl(commentDiv)
    }

    if (likes) {
        likesNum = Object.keys(likes).length
        if (Object.keys(likes).includes(currentUser)) {
            likesImgSrc = './assets/heart-fill-icon.svg'
        } else {
            likesImgSrc = './assets/heart-empty-icon.svg'
        }
    } else {
        likesImgSrc = './assets/heart-empty-icon.svg'
    }

    likesIcon.src = likesImgSrc
    userHandleTxt.textContent = `@${userHandle}`
    displayNameTxt.textContent = displaynameValue
    postBodyTxt.innerHTML = postContent
    likesNumTxt.textContent = likesNum 
    commentsNumTxt.textContent = commentNum
    dateTxt.textContent = date; 

    const commentIdArr = Object.keys(comment)

    try {
        if (commentIdArr.length) {
            for (const commentItem of commentIdArr) {
                const { commentContent, commentId, commenterId, datePosted } = comment[commentItem]
                
                const post = await getOneUser(commenterId)
    
                displayComments(post.userhandle, post.displayname, commentContent, commentId, datePosted)
            }
        } else {
            console.log('no comments')
        }
    } catch (error) {
        console.error('Erorr in displaying Comments:', error)
    }
}

export function clearPostDetailDiv() {
    const userHandleTxt = document.querySelector('#detail-user-handle')
    const displayNameTxt = document.querySelector('#detail-display-name')
    const postBodyTxt = document.querySelector('#detail-post-body');
    const likesNumTxt = document.querySelector('#detail-likes-num');
    const commentsNumTxt = document.querySelector('#detail-comments-num');

    userHandleTxt.textContent = ''
    displayNameTxt.textContent = ''
    postBodyTxt.innerHTML = ''
    likesNumTxt.textContent = '' 
    commentsNumTxt.textContent = ''
}