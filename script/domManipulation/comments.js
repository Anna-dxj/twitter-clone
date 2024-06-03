import { showEl } from "../utils/index.js";

export function displayComments(userHandle, displayName, commentBody, commentId) {
    const commentContainer = document.querySelector('#comment-section')
    const newComment = document.createElement('section');
    
    showEl(commentContainer)

    newComment.setAttribute('data-comment-id', commentId); 
    newComment.classList.add('px-3', 'mx-1', 'my-2')

    newComment.innerHTML = `
    <div>
        <h4 class="user-handle">@${userHandle}</h4>
        <p class="display-name">(${displayName})</p>
    </div>
    <p>${commentBody}</p>`

    // console.log(newComment);

    // newComment.appendChild(commentContainer)
    commentContainer.appendChild(newComment)

}