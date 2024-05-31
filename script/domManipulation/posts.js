import { displayComments } from "./comments.js";

export function displayPosts(currentUser, userHandle, displayName, content, postId, userId, viewType, comment, likes) {
       const feedPostContainer = document.querySelector('#post-container-div')
       const userPostContainer = document.querySelector('#user-posts');
       const myPostsContainer = document.querySelector('#my-posts')

       let commentNum = 0; 
       let likesNum = 0;
       let likesImgSrc = null; 

       const newPost = document.createElement('section');

       if (viewType === 'feed') {
           newPost.className = 'col-sm-12 offset-md-1 col-md-10'
       }

       newPost.classList.add('post')

       newPost.setAttribute('data-post-id', postId);
       newPost.setAttribute('data-poster-id', userId);

       if (comment) {
        commentNum = comment.length
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


       newPost.innerHTML = `
       <div class="poster-detail-div d-flex">
            <div class='m-2 p-2'>
                <h3 class="user-handle">@${userHandle}</h3>
                <p class="display-name">${displayName}</p>
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

function displayPostDetails(userHandle, displayName, commentNum, likeNum, content, commentArr) {
    const userHandleTxt = document.querySelector('#user-handle')
    const displayNameTxt = document.querySelector('#display-name')
    const postBodyTxt = document.querySelector('#post-body')
    const likesNum = document.querySelector('#likes-num');
    const commentsNum = document.querySelector('#comments-num');

    userHandleTxt.textContent = `@${userHandle}`
    displayNameTxt.textContent = displayName
    postBodyTxt.innerHTML = content
    likesNum = likeNum 
    commentsNum = commentNum

    commentArr.forEach(({commentHandle, commentName, commentBody}) => {
        displayComments(commentHandle, commentName, commentBody)
    })

}
