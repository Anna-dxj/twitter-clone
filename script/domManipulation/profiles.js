import { hideEl, showEl } from "../utils/hideShowDivs.js";

export function displayProfileDetails (type, userHandle, displayName, bio, postsNum, profileImg) {
    const userHandleTxt = document.querySelector('#user-handle')
    const displayNameTxt = document.querySelector('#display-name');
    const postsNumTxt = document.querySelector('#posts')
    const bioTxt = document.querySelector('#bio')
    const profilePic = document.querySelector('#profile-pic')
    const editBtn = document.querySelector('#edit-profile')

    userHandleTxt.textContent = `@${userHandle}`

    if (displayName) {
        displayNameTxt.textContent = displayName
    } else if (!displayName && type === 'my profile') {
        displayNameTxt.textContent = 'Set display name!'
    } else {
        displayNameTxt.textContent = ''
    }

    if (bio) {
        bioTxt.innerHTML = bio
    } else if (!bio && type === 'my profile') {
        bioTxt.innerHTML = 'Set bio and make a post!'
    } else {
        bioTxt.innerHTML = ''
    }

    if (profileImg) {
        profilePic.src = profileImg
    }

    if (postsNum) {
        postsNumTxt.textContent = postsNum
    } else {
        postsNumTxt.textContent = 0
    }

    if (type === 'other profile') {
        hideEl(editBtn)
    } else if (type === 'my profile') {
        showEl(editBtn)
    }

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

    if (value === 'Set display name!') {
        inputEl.placeholder = 'Set display name!'
    } else {
        inputEl.value = value;
    }
    parentItem.replaceChild(inputEl, oldItem)
}

export function convertToTextarea (value, oldItem, parentItem) {
    const textareaEl = document.createElement('textarea')

    textareaEl.setAttribute('id', 'bio')
    textareaEl.setAttribute('row', '10'); 
    textareaEl.classList.add('update-bio', 'form-control', 'custom-text-input', 'mx-4')

    if (value === 'Set bio and profile image!') {
        textareaEl.placeholder = 'Set display name!'
    } else {
        textareaEl.value = value;
    }

    parentItem.replaceChild(textareaEl, oldItem)
}

export function convertBack (value, oldItem, targetItem, parentItem, type) {
    const newEl = document.createElement(targetItem); 

    if (!value && type === 'user handle') {
        targetItem.classList.add('custom-text-warning-input')
        return; 
    } else if (!value && type === 'display name') {
        newEl.textContent = 'Set display name!'
    } else if (!value && type === 'bio') {
        newEl.textContent = 'Set bio and profile image!'
    } else if (value && type === 'user handle') {
        newEl.textContent = `@${value}`
    } else {
        newEl.textContent = value;
    }

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

    parentItem.replaceChild(newEl, oldItem)
}