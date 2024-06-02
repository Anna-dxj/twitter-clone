import { showEl, hideEl, removeAt, calculateMaxPage } from "./script/utils/index.js";
import { convertBack, convertToInput, convertToTextarea, displayProfileDetails, displayPosts, addLikeImg, removeLikeImg, removePost } from "./script/domManipulation/index.js";
import { loginUser, createUser, getCurrentUser } from "./script/firebase/auth.js";
import { getOneUser, getOnePost, getAllPosts, updateUserInfo, createPost, addLikes, removeLikes, deletePost, fetchPosts } from "./script/crudOperations/index.js";


// login form pages
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form'); 

// login form buttons
const loginBtn = document.querySelector('#login-btn');
const viewSignupBtn = document.querySelector('#switch-to-signup');
const signupBtn = document.querySelector('#signup-btn');
const viewLoginBtn = document.querySelector('#switch-to-login');

// Main sections
const authForms = document.querySelector('#login-signup-div');
const authSections = document.querySelector('#auth-div')

// Main pages
const feedDiv = document.querySelector('#feed-div');
const feedNextBtn = document.querySelector('#feed-next-page-btn');
const feedPrevBtn = document.querySelector('#feed-prev-page-btn');

// const searchDiv = document.querySelector('#search-div');
const myProfileDiv = document.querySelector('#my-profile-div');
const myProfileNextBtn = document.querySelector('#my-next-page-btn');
const myProfilePrevBtn = document.querySelector('#my-prev-page-btn')

const newPostDiv = document.querySelector('#new-post-div');
// const postDetailsDiv = document.querySelector('#post-details-div');

// Post operations
const postContainerDiv = document.querySelector('#post-container-div')
const userPostsContainerDiv = document.querySelector('#my-posts')

// Nav btns
const homeBtn = document.querySelector('#home-btn');
const createBtn = document.querySelector('#create-btn');
const searchBtn = document.querySelector('#search-btn');
const myProfileBtn = document.querySelector('#profile-btn');

// newPostDiv buttons
const createPostBtn = document.querySelector('#create-post');

// searchDiv buttons
const searchUserBtn = document.querySelector('#search-user-btn');
const searchUserForm = document.querySelector('#search-form')
// const searchReturnDiv = document.querySelector('#search-return');
const profileDetailsDiv = document.querySelector('#profile-details-div')

// profileDiv buttons
const editProfileBtn = document.querySelector('#edit-profile');
const saveProfileBtn = document.querySelector('#save-profile');

let currentFeedPage = 1; 
let currentProfilePage = 1; 

async function handleLogin(event) {
    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password')
    const emptyFormWarning = document.querySelector('#empty-login-warning');
    const incorrectCredentialsWarning = document.querySelector('#incorrect-credentials-warning')
    const tooManyAttemptsWarning = document.querySelector('#too-many-attempts-warning')
    const emailValue = emailInput.value.trim()
    const passwordValue = passwordInput.value.trim()
    
    try {
        event.preventDefault()
    
        if (!emailValue || !passwordValue) {
            showEl(emptyFormWarning)
            if (!emailValue){
                emailInput.classList.add('custom-text-warning-input')
            }
            if (!passwordValue) {
                passwordInput.classList.add('custom-text-warning-input')
            }
            return; 
        } else {
            hideEl(emptyFormWarning)
            emailInput.classList.remove('custom-text-warning-input')
            passwordInput.classList.remove('custom-text-warning-input')
        }
    
        const {user, userData} = await loginUser(emailValue, passwordValue)

        if (userData) {
            emailInput.value = ''
            passwordInput.value = ''
            
            hideEl(incorrectCredentialsWarning);
            hideEl(tooManyAttemptsWarning); 

            emailInput.classList.remove('custom-text-warning-input')
            passwordInput.classList.remove('custom-text-warning-input')
            
            const allPosts = await getAllPosts(); 
            
            if (allPosts && Object.keys(allPosts).length > 0) {
                const paginatedPosts = await fetchPosts(currentFeedPage, 'feed'); 
                const feedAllPageTxt = document.querySelector('#feed-all-pages')
            
                const allPostsObj = await getAllPosts();
                const allPostNums = Object.keys(allPostsObj).length
                const maxPagesNum = calculateMaxPage(allPostNums); 
            
                feedAllPageTxt.textContent = maxPagesNum;
                 postContainerDiv.innerHTML = ''
            
                for (const post of paginatedPosts) {
                    const { postContent, postId, creatorId, likes } = post;
            
                    displayPosts(user.uid, userData.userhandle, userData.displaname, postContent, postId, creatorId, 'feed', null, likes)
                }
 
            }

            hideEl(authForms);
            showEl(feedDiv);
            showEl(authSections);
        }
    } catch (error) {
        emailInput.value = ''
        passwordInput.value = ''

        if (error.code === 'auth/too-many-requests') {
            showEl(tooManyRequestsWarning);
        } else {
            showEl(incorrectCredentialsWarning);
            emailInput.classList.add('custom-text-warning-input')
            passwordInput.classList.add('custom-text-warning-input')
        }
    }
}

async function handleSignup(event) {
    const emailInput = document.querySelector('#signup-email')
    const passwordInput = document.querySelector('#signup-password')
    const confirmPasswordInput = document.querySelector('#confirm-password')
    const usernameInput = document.querySelector('#create-username')
    const emptyFormWarning = document.querySelector('#empty-signup-warning')
    const mismatchPasswordWarning = document.querySelector('#passwords-mismatch-warning')
    const passwordLengthWarning = document.querySelector('#password-length-warning')

    const emailValue = emailInput.value.trim()
    const passwordValue = passwordInput.value.trim()
    const confirmPasswordValue = confirmPasswordInput.value.trim()
    const usernameValue = usernameInput.value.trim()
    try {
        event.preventDefault()
    
        if (!emailValue || !passwordValue || !confirmPasswordValue || !usernameValue) {
            showEl(emptyFormWarning);
            if (!emailValue) {
                emailInput.classList.add('custom-text-warning-input')
            }
            if (!passwordValue) {
                passwordInput.classList.add('custom-text-warning-input')
            }
            if (!confirmPasswordValue) {
                confirmPasswordInput.classList.add('custom-text-warning-input')
            }
            if (!usernameValue) {
                usernameInput.classList.add('custom-text-warning-input')
            }
            return 
        } else {
            hideEl(emptyFormWarning)
            emailInput.classList.remove('custom-text-warning-input')
            passwordInput.classList.remove('custom-text-warning-input')
            confirmPasswordInput.classList.remove('custom-text-warning-input')
            usernameInput.classList.remove('custom-text-warning-input')
        }
    
        if (passwordValue.length < 6) {
            showEl(passwordLengthWarning)
            passwordInput.classList.add('custom-text-warning-input')
            passwordInput.value = ''
            return
        } else {
            hideEl(passwordLengthWarning)
            passwordInput.classList.remove('custom-text-warning-input')
        }
    
        if (passwordValue !== confirmPasswordValue) {
            showEl(mismatchPasswordWarning)
            confirmPasswordInput.classList.add('custom-text-warning-input')
            passwordInput.classList.add('custom-text-warning-input')
    
            confirmPasswordInput.value = ''
            passwordInput.value = ''
            return
        } else {
            confirmPasswordInput.classList.remove('custom-text-warning-input')
            passwordInput.classList.remove('custom-text-warning-input')
            hideEl(mismatchPasswordWarning)
        }
    
        await createUser(emailValue, passwordValue, usernameValue);
        
        emailInput.classList.remove('custom-text-warning-input')
        passwordInput.classList.remove('custom-text-warning-input')
        confirmPasswordInput.classList.remove('custom-text-warning-input')
        usernameInput.classList.remove('custom-text-warning-input')

        displayProfileDetails(usernameValue)
    
        hideEl(authForms);
        showEl(myProfileDiv);
        showEl(authSections);
    } catch (error) {
        console.error(error)
    }
}

function handleViewLogin() {
    const emailInput = document.querySelector('#signup-email');
    const passwordInput = document.querySelector('#signup-password');
    const confirmInput = document.querySelector('#confirm-password');
    const usernameInput = document.querySelector('#create-username');

    emailInput.classList.remove('custom-text-warning-input')
    passwordInput.classList.remove('custom-text-warning-input')
    confirmInput.classList.remove('custom-text-warning-input')
    usernameInput.classList.remove('custom-text-warning-input')

    emailInput.value = ''
    passwordInput.value = ''
    confirmInput.value = ''
    usernameInput.value = ''

    hideEl(signupForm)
    showEl(loginForm)
}

function handleViewSignup() {
    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    
    emailInput.classList.remove('custom-text-warning-input');
    passwordInput.classList.remove('custom-text-warning-input')

    emailInput.value = ''
    passwordInput.value = ''

    hideEl(loginForm)
    showEl(signupForm)
}

async function handleShowHomeDiv() {
    hideEl(myProfileDiv);
    hideEl(newPostDiv);
    currentFeedPage = 1
    
    const allPosts = await fetchPosts(currentFeedPage, 'feed'); 
    const currentUser = await getCurrentUser();
    const feedAllPageTxt = document.querySelector('#feed-all-pages')

    const allPostsObj = await getAllPosts();
    const allPostNums = Object.keys(allPostsObj).length
    const maxPagesNum = calculateMaxPage(allPostNums); 

    feedAllPageTxt.textContent = maxPagesNum;
     postContainerDiv.innerHTML = ''

    for (const post of allPosts) {
        const { userhandle, displayname, postContent, postId, creatorId, likes } = post;

        displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', null, likes)
    }


    showEl(feedDiv); 
}

async function handleShowPrevFeedPage() {

    if (currentFeedPage > 1) {
        feedNextBtn.classList.add('next-page-btn', 'custom-btn')
        feedNextBtn.classList.remove('inactive')
        
        currentFeedPage--; 
        postContainerDiv.innerHTML = ''

        const posts = await fetchPosts(currentFeedPage, 'feed'); 
        const currentUser = await getCurrentUser();

        posts.forEach(post => {
            const { creatorId, displayname, likes, postContent, postId,  userhandle } = post
            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', null, likes)
        })
    } else {
        feedNextBtn.classList.remove('next-page-btn', 'custom-btn')
        feedNextBtn.classList.add('inactive')
        return; 
    }
}

async function handleShowNextFeedPage () {

    const allPostsObj = await getAllPosts();
    const allPostNums = Object.keys(allPostsObj).length
    const maxPagesNum = calculateMaxPage(allPostNums); 

    if (currentFeedPage < maxPagesNum) {
        feedNextBtn.classList.add('next-page-btn', 'custom-btn')
        feedNextBtn.classList.remove('inactive')
        currentFeedPage++; 
        postContainerDiv.innerHTML = ''
    
        const posts = await fetchPosts(currentFeedPage, 'feed');
        const currentUser = await getCurrentUser();
    
        posts.forEach(post => {
            const { creatorId, displayname, likes, postContent, postId,  userhandle } = post
            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', null, likes)
        })
    } else {
        feedNextBtn.classList.remove('next-page-btn', 'custom-btn')
        feedNextBtn.classList.add('inactive')
        return; 
    }
}

async function handleShowCreateDiv() {
    const userhandleEl = document.querySelector('#new-post-user-handle');
    const displaynameEl = document.querySelector('#new-post-display-name');

    try {
        const currentUser = await getCurrentUser();
        const {userhandle, displayname} = await getOneUser(currentUser);

        userhandleEl.textContent = `@${userhandle}`;
        displaynameEl.textContent = displayname; 
    
        hideEl(feedDiv)
        hideEl(myProfileDiv)

        showEl(newPostDiv)
    } catch (error) {
        console.error(error)
    }
    
}

async function handleCreateNewPost(event) {
    const newPostInput = document.querySelector('#new-post')
    try {
        event.preventDefault()

        const newPostBody = newPostInput.value.trim()
    
        if (!newPostBody) {
            return;
        }

        const currentUser = await getCurrentUser();
        const { userhandle, displayname } = await getOneUser(currentUser); 
        const {postId, postContent} = await createPost(currentUser, newPostBody);

        newPostInput.value = '' 

        displayPosts(currentUser, userhandle, displayname, postContent, postId, currentUser, 'feed')
        
        hideEl(myProfileDiv);
        hideEl(newPostDiv);
    
        showEl(feedDiv); 
        
    } catch (error) {
        console.error(error)
    }
}

async function handleShowMyProfileDiv() {
    const myPostsDiv = document.querySelector('#my-posts')
    const currentUser = await getCurrentUser()

    try {
        const userData = await getOneUser(currentUser);
        const { userhandle, displayname, bio, posts } = userData; 
        myPostsDiv.innerHTML = ''
        
        if (!posts) {
            hideEl(myPostsDiv)
            displayProfileDetails('my profile', userhandle, displayname, bio)
        } else {
            const postIdsArr = Object.keys(posts).reverse();
            showEl(myPostsDiv)
            
            displayProfileDetails('my profile', userhandle, displayname, bio, postIdsArr.length)

            if (postIdsArr.length) {
                currentProfilePage = 1
                const paginatedPosts = await fetchPosts(currentProfilePage, 'profile', postIdsArr); 
                const myProfileAllPageTxt = document.querySelector('#my-profile-all-pages')
            
                const maxPagesNum = calculateMaxPage(postIdsArr.length); 
            
                myProfileAllPageTxt.textContent = maxPagesNum;
                 postContainerDiv.innerHTML = ''
            
                for (const post of paginatedPosts) {
                    const { postContent, postId, likes, creatorId } = post;
            
                    displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', null, likes)
                }
            }


            hideEl(feedDiv)
            hideEl(newPostDiv)
        }
        showEl(myProfileDiv)


        
    } catch (error) {
        console.error(error)
    }
}

function handleEditProfile(event) {
    const userInfoDiv = document.querySelector('#user-info');
    const profileDetailsDiv = document.querySelector('#profile-details');
    const userHandle = document.querySelector('#user-handle');
    const displayName = document.querySelector('#display-name'); 
    const bio = document.querySelector('#bio')
    
    event.preventDefault()
    hideEl(editProfileBtn)
    showEl(saveProfileBtn)

    const userHandleValue = removeAt(userHandle.textContent)
    
    convertToInput(userHandleValue, 'user handle', userHandle, userInfoDiv);
    convertToInput(displayName.textContent, 'display name', displayName, userInfoDiv);
    convertToTextarea(bio.textContent, bio, profileDetailsDiv)
}

async function handleSaveProfile(event) {
    const userInfoDiv = document.querySelector('#user-info');
    const profileDetailsDiv = document.querySelector('#profile-details');
    const userHandleInput = document.querySelector('#user-handle');
    const displayNameInput = document.querySelector('#display-name'); 
    const bioInput = document.querySelector('#bio');

    try {
        event.preventDefault()
        const userhandleValue = userHandleInput.value.trim(); 
        const displayNameValue = displayNameInput.value.trim(); 
        const bioValue = bioInput.value.trim();

        const currentUser = await getCurrentUser();

        await updateUserInfo(currentUser, userhandleValue, displayNameValue, bioValue) 

        hideEl(saveProfileBtn)
        showEl(editProfileBtn)

        convertBack(userhandleValue, userHandleInput, 'h2', userInfoDiv, 'user handle')
        convertBack(displayNameValue, displayNameInput, 'p', userInfoDiv, 'display name')
        convertBack(bioValue, bioInput, 'p', profileDetailsDiv, 'bio')
    } catch (error) {
        console.error(error)
    }

}
async function handleShowPrevMyProfilePage(){
    if (currentProfilePage > 1) {
        myProfilePrevBtn.classList.add('next-page-btn', 'custom-btn'); 
        myProfilePrevBtn.classList.remove('inactive')

        currentProfilePage--;
        userPostsContainerDiv.innerHTML = ''

        const currentUser = await getCurrentUser()
        const userData = await getOneUser(currentUser);
        const { userhandle, displayname, posts } = userData;
        const postIdsArr = Object.keys(posts).reverse()
        const paginatedPosts = await fetchPosts(currentProfilePage, 'profile', postIdsArr);

        for (const paginatedPost of paginatedPosts) {
            const { postContent, postId, likes, creatorId } = paginatedPost;

            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', null, likes)
        }        
    } else {
        myProfilePrevBtn.classList.remove('next-page-btn', 'custom-btn'); 
        myProfilePrevBtn.classList.add('inactive')
    }
}
async function handleShowNextMyProfilePage(){
    const currentUser = await getCurrentUser()
    const { userhandle, displayname, posts } = await getOneUser(currentUser); 
    const postIdsArr = Object.keys(posts).reverse(); 
    const maxPagesNum = calculateMaxPage(postIdsArr.length)
    
    if (currentFeedPage < maxPagesNum) {
        myProfileNextBtn.classList.add('next-page-btn', 'custom-btn'); 
        myProfileNextBtn.classList.remove('inactive')

        currentProfilePage++;
        userPostsContainerDiv.innerHTML = ''

        const paginatedPosts = await fetchPosts(currentProfilePage, 'profile', postIdsArr);

        for (const paginatedPost of paginatedPosts) {
            const { postContent, postId, likes, creatorId } = paginatedPost;

            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', null, likes)
        }       
    } else {
        myProfileNextBtn.classList.remove('next-page-btn', 'custom-btn'); 
        myProfileNextBtn.classList.add('inactive')
    }
}

async function handleAddLike(event) {
    const targetEl = event.target; 
    const isLikeBtn = targetEl.classList.contains('likes-btn') || targetEl.classList.contains('likes-icon') || targetEl.classList.contains('likes-num'); 

     if (isLikeBtn) {
        const postItem = targetEl.closest('.post')
        const postId = postItem.getAttribute('data-post-id')
        const posterId = postItem.getAttribute('data-poster-id')
        const likeImg = postItem.querySelector('.likes-icon')
        const likesNumEl = postItem.querySelector('.likes-num')

        const { likes } = await getOnePost(postId)

        if (likes) {
            const likesArr = Object.keys(likes)
            let likesNum = likesArr.length;

            if (likesArr.includes(posterId)) {
                await removeLikes(postId, posterId); 
                likesNum--
                removeLikeImg(likeImg); 
            } else {
                await addLikes(postId, posterId); 
                likesNum++
                addLikeImg(likeImg)
            }
            likesNumEl.textContent = likesNum;
        } else {
            await addLikes(postId, posterId); 
            likesNumEl.textContent++
            addLikeImg(likeImg)
        }
     }

}

function handleDeletePost(event) {
    const targetEl = event.target; 
    const isDeleteBtn = targetEl.classList.contains('delete-icon') || targetEl.classList.contains('delete-btn')

    if (isDeleteBtn) {
        const postItem = targetEl.closest('.post');
        const postId = postItem.getAttribute('data-post-id'); 
        const posterId = postItem.getAttribute('data-poster-id'); 
        
        deletePost(postId, posterId);
        removePost(postItem)
    }
}

function handleShowPostDetails(event) {
    const targetEl = event.target
    const isCommentBtn = targetEl.classList.contains('comments-btn') || targetEl.classList.contains('comments-icon') || targetEl.classList.contains('comments-num');

    if (isCommentBtn) {
        console.log('commentBtn!!!')
    }
}

loginBtn.addEventListener('click', handleLogin);
viewSignupBtn.addEventListener('click', handleViewSignup);
signupBtn.addEventListener('click', handleSignup);
viewLoginBtn.addEventListener('click', handleViewLogin)
homeBtn.addEventListener('click', handleShowHomeDiv);
feedPrevBtn.addEventListener('click', handleShowPrevFeedPage)
feedNextBtn.addEventListener('click', handleShowNextFeedPage)
createBtn.addEventListener('click', handleShowCreateDiv);
createPostBtn.addEventListener('click', handleCreateNewPost)
myProfileBtn.addEventListener('click', handleShowMyProfileDiv); 
editProfileBtn.addEventListener('click', handleEditProfile); 
saveProfileBtn.addEventListener('click', handleSaveProfile);
myProfilePrevBtn.addEventListener('click', handleShowPrevMyProfilePage);
myProfileNextBtn.addEventListener('click', handleShowNextMyProfilePage)

postContainerDiv.addEventListener('click', handleAddLike);
userPostsContainerDiv.addEventListener('click', handleAddLike);
postContainerDiv.addEventListener('click', handleDeletePost); 
userPostsContainerDiv.addEventListener('click', handleDeletePost); 
postContainerDiv.addEventListener('click', handleShowPostDetails);
userPostsContainerDiv.addEventListener('click', handleShowPostDetails);
