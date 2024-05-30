export function displayComments(userHandle, displayName, commentBody) {
    const commentContainer = document.querySelector('#comment-section')
    const newComment = document.createElement('section');

    newComment.innerHTML = `
    <div>
        <h4 class="user-handle">@${userHandle}</h4>
        <p class="display-name">(${displayName})</p>
    </div>
    <p>${commentBody}</p>`

    newComment.appendChild(commentContainer)

}