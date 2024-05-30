function displayProfileResults (userArr) {
    const searchReturnDiv = document.querySelector('#search-return')

    userArr.forEach(({userHandle, displayName, profileImg, userId}) => {
        const newProfile = document.createElement('section');
        newProfile.className = 'profile-result col-sm-12 col-md-6 d-flex'
        newProfile.setAttribute('data-user-id', userId)

        newProfile.innerHTML = `
        <img alt="${displayName}'s profile picture" src=${profileImg} class="profile-pic" />
        <div>
            <h3 class='user-handle'>@${userHandle}</h3>
            <p class='display-name'>${displayName}</p>
        </div>`

        searchReturnDiv.appendChild(newProfile)
    })
}

export function displayProfileDetails (userHandle, displayName, profileImg, bio, postsNum, userId) {
    const userHandleTxt = document.querySelector('#user-handle')
    const displayNameTxt = document.querySelector('#display-name');
    const postsNumTxt = document.querySelector('#posts')
    const bioTxt = document.querySelector('#bio')
    const profilePic = document.querySelector('#profile-pic')

    // if userId===currentId show edit button

    userHandleTxt.textContent = userHandle
    displayNameTxt.textContent = displayName
    // postsNumTxt.textContent = postsNum
    bioTxt.innerHTML = bio 
    profilePic.src = profileImg
}

export function convertToInput (value, type, oldItem, parentItem) {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'text');
    inputEl.classList.add('form-control', 'custom-text-input');
    if (type === 'display name') {
        inputEl.classList.add('update-display-name');
        inputEl.setAttribute('id', 'display-name')
    } else if (type === 'user handle') {
        inputEl.classList.add('update-user-handle')
        inputEl.setAttribute('id', 'user-handle')
    }
    inputEl.value = value;
    console.log(value);

    parentItem.replaceChild(inputEl, oldItem)
}

export function convertToTextarea (value, oldItem, parentItem) {
    const textareaEl = document.createElement('textarea')

    textareaEl.setAttribute('id', 'bio')
    textareaEl.setAttribute('row', '10'); 
    textareaEl.classList.add('update-bio', 'form-control', 'custom-text-input', 'mx-4')
    textareaEl.value = value;

    // textareaEl.style.height = 'auto'
    // textareaEl.style.height = `${textareaEl.scrollHeight}px`

    parentItem.replaceChild(textareaEl, oldItem)
}

export function convertBack (value, oldItem, targetItem, parentItem, type) {
    const newEl = document.createElement(targetItem); 
    if (type === 'user handle') {
        newEl.classList.add('user-handle');
        newEl.setAttribute('id', 'user-handle')
    } else if (type === 'display name') {
        newEl.classList.add('display-name');
        newEl.setAttribute('id', 'display-name')
    } else if (type === 'bio') {
        newEl.classList.add('my-4', 'px-4'); 
        newEl.setAttribute('id', 'bio')
    }

    if (type === 'user handle') {
        newEl.textContent = `@${value}`;
    } else {
        newEl.textContent = value;
    }


    parentItem.replaceChild(newEl, oldItem)
}