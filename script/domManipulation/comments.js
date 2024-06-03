import { showEl, convertDate } from "../utils/index.js";

export function displayComments(userHandle, displayName, commentBody, commentId, datePosted) {
    const commentContainer = document.querySelector('#comment-section')
    const newComment = document.createElement('section');
    
    showEl(commentContainer)

    newComment.setAttribute('data-comment-id', commentId); 
    newComment.classList.add('px-3', 'mx-1', 'my-2')

    const date = convertDate(datePosted);

    newComment.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <h4 class="user-handle">@${userHandle}</h4>
            <p class="display-name">(${displayName})</p>
        </div>
        <p class="date">${date}</p>
    </div>
    <p class="py-2 mx-4">${commentBody}</p>`

    commentContainer.appendChild(newComment)
}