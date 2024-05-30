import { displayComments } from "./comments.js";

function displayPosts(userHandle, displayName, commentNum, likeNum, content, imageSrc, postId, userId, viewType) {
       const feedPostContainer = document.querySelector('#post-container-div')
       const userPostContainer = document.querySelector('#user-posts');
       const myPostsContainer = document.querySelector('#my-posts')

       const newPost = document.createElement('section');

       if (viewType === 'feed') {
           newPost.className = 'post col-sm-12 offset-md-1 col-md-10'
       }

       newPost.setAttribute('data-post-id', postId);
       newPost.innerHTML = `
       <div class="poster-detail-div d-flex">
            <img src=${imageSrc} alt="${displayName}'s profile image" class="profile-pic"/>
            <div>
                <h3 class="user-handle" data-user-id=${userId}>@${userHandle}</h3>
                <p class="display-name">${displayName}</p>
            </div>
        </div>
        <div class="post-body">
            <p>${content}</p>
        </div>
        <div class="d-flex btn-divs justify-content-end">
            <div>
                <button class="likes-btn btn d-flex align-items-center">
                    <img alt="Likes" src="../../assets/heart-empty-icon.svg" class="likes-icon"/>
                    <p class="likes-num">${likeNum}</p>
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
            feedPostContainer.appendChild(newPost)
        } else if (viewType === 'user profile') {
            userPostContainer.appendChild(newPost)
        } else if (viewType === 'my profile') {
            myPostsContainer.appendChild(newPost)
        }
}

function displayPostDetails(userHandle, displayName, imageSrc, commentNum, likeNum, content, commentArr) {
    const userHandleTxt = document.querySelector('#user-handle')
    const displayNameTxt = document.querySelector('#display-name')
    const profileImg = document.querySelector('#profile-pic')
    const postBodyTxt = document.querySelector('#post-body')
    const likesNum = document.querySelector('#likes-num');
    const commentsNum = document.querySelector('#comments-num');

    userHandleTxt.textContent = `@${userHandle}`
    displayNameTxt.textContent = displayName
    profileImg.src = imageSrc
    postBodyTxt.innerHTML = content
    likesNum = likeNum 
    commentsNum = commentNum

    commentArr.forEach(({commentHandle, commentName, commentBody}) => {
        displayComments(commentHandle, commentName, commentBody)
    })

}
