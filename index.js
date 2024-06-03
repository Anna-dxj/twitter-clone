import { showEl, hideEl, removeAt } from "./script/utils/index.js";
import { convertBack, convertToInput, convertToTextarea, displayProfileDetails, displayPosts, addLikeImg, removeLikeImg, removePost, clearPostDetailDiv, displayPostDetails, displayComments, unsavedProfileFormRevert } from "./script/domManipulation/index.js";
import { loginUser, createUser, getCurrentUser, logoutUser } from "./script/firebase/auth.js";
import { getOnePost, getAllPosts, updateUserInfo, createPost, addLikes, removeLikes, deletePost, fetchPosts, createComment } from "./script/crudOperations/index.js";
import { getAllPostInfo, getCurrentUserData, getOtherUserData, getPostData, getCommentData, getAllUserhandles } from './script/updatingView/index.js'


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

const myProfileDiv = document.querySelector('#my-profile-div');
const myProfileNextBtn = document.querySelector('#my-next-page-btn');
const myProfilePrevBtn = document.querySelector('#my-prev-page-btn')

const newPostDiv = document.querySelector('#new-post-div');

const postDetailsDiv = document.querySelector('#post-details-div');
const backBtn = document.querySelector('#back-btn');
const saveBtnSm = document.querySelector('#comment-btn-sm');
const saveBtnLg = document.querySelector('#comment-btn-lg');
const deleteDetailedPostBtn = document.querySelector('#detail-delete-btn'); 
const detailedPostContainer = document.querySelector('#post-detail-container')

// Post Containers
const postContainerDiv = document.querySelector('#post-container-div')
const userPostsContainerDiv = document.querySelector('#my-posts')

// Nav btns
const homeBtn = document.querySelector('#home-btn');
const createBtn = document.querySelector('#create-btn');
// const searchBtn = document.querySelector('#search-btn');
const myProfileBtn = document.querySelector('#profile-btn');
const logoutBtn = document.querySelector('#logout-btn')

// newPostDiv buttons
const createPostBtn = document.querySelector('#create-post');

// profileDiv buttons
const editProfileBtn = document.querySelector('#edit-profile');
const saveProfileBtn = document.querySelector('#save-profile');

// Profile deatils

let currentFeedPage = 1; 
let currentProfilePage = 1; 
let editingProfile = false;

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
    
        const { user, userData } = await loginUser(emailValue, passwordValue)
        console.log('userdata', userData)

        if (userData) {
            emailInput.value = ''
            passwordInput.value = ''
            
            hideEl(incorrectCredentialsWarning);
            hideEl(tooManyAttemptsWarning); 

            emailInput.classList.remove('custom-text-warning-input')
            passwordInput.classList.remove('custom-text-warning-input')
            
            const allPosts = await getAllPosts(); 
            
            if (allPosts && Object.keys(allPosts).length > 0) {
                const feedAllPageTxt = document.querySelector('#feed-all-pages')

                const { allPosts, maxPagesNum } = await getAllPostInfo(currentFeedPage, 'feed')
            
                feedAllPageTxt.textContent = maxPagesNum;
                postContainerDiv.innerHTML = ''
                
                for (const post of allPosts) {
                    const { userhandle, displayname, postContent, postId, creatorId, likes, comments, dateUpdated } = post;
            
                    displayPosts(user.uid, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
                }
            }

            hideEl(authForms);
            showEl(feedDiv);
            showEl(authSections);
        }
    } catch (error) {
        if (error.code === 'auth/too-many-requests') {
            showEl(tooManyRequestsWarning);
        } else {
            showEl(incorrectCredentialsWarning);
            emailInput.classList.add('custom-text-warning-input')
            passwordInput.classList.add('custom-text-warning-input')
        }

        emailInput.value = ''
        passwordInput.value = ''

        console.error('Erorr logging in:', error)
    }
}

async function handleSignup(event) {
    const emailInput = document.querySelector('#signup-email')
    const passwordInput = document.querySelector('#signup-password')
    const confirmPasswordInput = document.querySelector('#confirm-password')
    const usernameInput = document.querySelector('#create-username')
    const emptyFormWarning = document.querySelector('#empty-signup-warning')
    const mismatchPasswordWarning = document.querySelector('#passwords-mismatch-warning')
    const passwordLengthWarning = document.querySelector('#password-length-warning');
    const emailWarning = document.querySelector('#email-warning');
    const usernameConflictWarning = document.querySelector('#username-warning')
    const myPostsDiv = document.querySelector('#my-posts')

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

        const existingUserhandles = await getAllUserhandles(); 

        for (const existingUserhandle of existingUserhandles) {
            if (existingUserhandle === usernameValue) {
                showEl(usernameConflictWarning);
                usernameInput.classList.add('custom-text-warning-input'); 
                usernameInput.value = ''
                return;
            } else {
                showEl(usernameConflictWarning);
                usernameInput.classList.remove('custom-text-warning-input'); 
            }
        }
    
        await createUser(emailValue, passwordValue, usernameValue);
        
        emailInput.classList.remove('custom-text-warning-input')
        passwordInput.classList.remove('custom-text-warning-input')
        confirmPasswordInput.classList.remove('custom-text-warning-input')
        usernameInput.classList.remove('custom-text-warning-input')

        displayProfileDetails('my profile', usernameValue)
    
        myPostsDiv.innerHTML = ''; 

        hideEl(authForms);
        hideEl(emailWarning); 
        showEl(myProfileDiv);
        showEl(authSections);
    } catch (error) {
        console.error('Error signing up:', error)

        if (error === 'auth/email-already-in-use') {
            console.log('errorasdfsdaf')
            showEl(emailWarning); 
            emailInput.classList.add('custom-text-warning-input'); 

            emailInput.value = ''
            passwordInput.value = ''
            confirmPasswordInput.value = ''
        }
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
    try {
        const feedAllPageTxt = document.querySelector('#feed-all-pages');

        currentFeedPage = 1
    
        hideEl(myProfileDiv);
        hideEl(newPostDiv);
        hideEl(postDetailsDiv)
        
        const { currentUser, allPosts, maxPagesNum } = await getAllPostInfo(currentFeedPage, 'feed')
    
        feedAllPageTxt.textContent = maxPagesNum;
        postContainerDiv.innerHTML = ''
    
        for (const post of allPosts) {
            const { userhandle, displayname, postContent, postId, creatorId, likes, comments, dateUpdated } = post;
    
            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
        }


        showEl(feedDiv); 
    } catch (error) {
        console.error('Error showing home div:', error)
    }
}

async function handleShowPrevFeedPage() {
    try {
        if (currentFeedPage > 1) {
            feedNextBtn.classList.add('next-page-btn', 'custom-btn')
            feedNextBtn.classList.remove('inactive')
            
            currentFeedPage--; 
            postContainerDiv.innerHTML = ''
    
            const { currentUser, allPosts } = await getAllPostInfo(currentFeedPage, 'feed'); 
    
            allPosts.forEach(post => {
                const { creatorId, displayname, likes, postContent, postId,  userhandle, comments, dateUpdated } = post
                displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
            })
        } else {
            feedNextBtn.classList.remove('next-page-btn', 'custom-btn')
            feedNextBtn.classList.add('inactive')

            return; 
        }
    } catch (error) {
        console.error('Erorr showing previous page in feed:', error);
    }
}

async function handleShowNextFeedPage () {
    try {
        const { currentUser, maxPagesNum } = await getAllPostInfo(currentFeedPage, 'feed'); 
    
        if (currentFeedPage < maxPagesNum) {
            feedNextBtn.classList.add('next-page-btn', 'custom-btn')
            feedNextBtn.classList.remove('inactive')

            currentFeedPage++; 
            postContainerDiv.innerHTML = ''
            
            const allPosts = await fetchPosts(currentFeedPage, 'feed'); 
    
            allPosts.forEach(post => {
                const { creatorId, displayname, likes, postContent, postId,  userhandle, comments, dateUpdated } = post

                displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
            })
        } else {
            feedNextBtn.classList.remove('next-page-btn', 'custom-btn')
            feedNextBtn.classList.add('inactive')

            return; 
        }
    } catch (error) {
        console.error('Error in showing next feed page:', error)
    }
}

async function handleShowCreateDiv() {
    try {
        const userhandleEl = document.querySelector('#new-post-user-handle');
        const displaynameEl = document.querySelector('#new-post-display-name');

        const { userhandle, displayname } = await getCurrentUserData(); 

        userhandleEl.textContent = `@${userhandle}`;
        displaynameEl.textContent = displayname; 
    
        hideEl(feedDiv)
        hideEl(myProfileDiv)
        hideEl(postDetailsDiv)

        showEl(newPostDiv)
    } catch (error) {
        console.error('Error in showing create div:', error)
    }
    
}

async function handleCreateNewPost(event) {
    try {
        const newPostInput = document.querySelector('#new-post')
        const feedAllPageTxt = document.querySelector('#feed-all-pages')

        event.preventDefault()

        const newPostBody = newPostInput.value.trim()
        const currentUser = await getCurrentUser(); 
    
        if (!newPostBody) {
            return;
        }

        newPostInput.value = '' 

        await createPost(currentUser, newPostBody);

        const { allPosts, maxPagesNum } = await getAllPostInfo(currentFeedPage, 'feed')

        feedAllPageTxt.textContent = maxPagesNum; 
        postContainerDiv.innerHTML = ''; 

        for (const post of allPosts) {
            const { userhandle, displayname, postContent, postId, creatorId, likes, comments, dateUpdated } = post; 

            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
        }
        
        hideEl(myProfileDiv);
        hideEl(newPostDiv);
        hideEl(postDetailsDiv); 
    
        showEl(feedDiv); 
        
    } catch (error) {
        console.error('Error creating new post:', error)
    }
}

async function handleShowMyProfileDiv() {
    try {
        const myPostsDiv = document.querySelector('#my-posts');

        if (editingProfile) {
            await unsavedProfileFormRevert(); 
        }


        const { currentUser, userhandle, displayname, bio, allUserPosts, userPostArr, maxPagesNum } = await getCurrentUserData(currentProfilePage, 'profile')

        myPostsDiv.innerHTML = ''
        
        if (!posts) {
            hideEl(myPostsDiv)

            displayProfileDetails('my profile', userhandle, displayname, bio)
        } else {
            showEl(myPostsDiv)

            displayProfileDetails('my profile', userhandle, displayname, bio, userPostArr.length)

            if (userPostArr.length) {
                const myProfileAllPageTxt = document.querySelector('#my-profile-all-pages')

                currentProfilePage = 1
            
                myProfileAllPageTxt.textContent = maxPagesNum;
                 postContainerDiv.innerHTML = ''
            
                for (const userPost of allUserPosts) {
                    const { postContent, postId, likes, creatorId, comments, dateUpdated } = userPost;
            
                    displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', comments, likes, dateUpdated)
                }
            }
        }
        hideEl(feedDiv)
        hideEl(newPostDiv)
        hideEl(postDetailsDiv)

        showEl(myProfileDiv)
    } catch (error) {
        console.error('Error showing profile div:', error)
    }
}

function handleEditProfile(event) {
    const userInfoDiv = document.querySelector('#user-info');
    const profileDetailsDiv = document.querySelector('#profile-details');
    const userHandle = document.querySelector('#user-handle');
    const displayName = document.querySelector('#display-name'); 
    const bio = document.querySelector('#bio')
    
    event.preventDefault()

    editingProfile = true; 

    hideEl(editProfileBtn)
    showEl(saveProfileBtn)

    const userHandleValue = removeAt(userHandle.textContent)
    
    convertToInput(userHandleValue, 'user handle', userHandle, userInfoDiv);
    convertToInput(displayName.textContent, 'display name', displayName, userInfoDiv);
    convertToTextarea(bio.textContent, bio, profileDetailsDiv)
}

async function handleSaveProfile(event) {
    
    try {
        const userInfoDiv = document.querySelector('#user-info');
        const profileDetailsDiv = document.querySelector('#profile-details');
        const userHandleInput = document.querySelector('#user-handle');
        const displayNameInput = document.querySelector('#display-name'); 
        const bioInput = document.querySelector('#bio');
        const usernameWarning = document.querySelector('#username-warning-profile')

        event.preventDefault()
        
        const userhandleValue = userHandleInput.value.trim(); 
        const displayNameValue = displayNameInput.value.trim(); 
        const bioValue = bioInput.value.trim();

        // const currentUser = await getCurrentUser();

        const { currentUser, userhandle } = await getCurrentUserData()

        const existingUserhandles = await getAllUserhandles();

        for (const existingUserhandle of existingUserhandles) {
            if (existingUserhandle === userhandleValue && existingUserhandle !== userhandle) {
                console.log('there a problem!')
                userHandleInput.value = userhandle
                userHandleInput.classList.add('custom-text-warning-input')
                showEl(usernameWarning)
                return; 
            } else {
                userHandleInput.classList.remove('custom-text-warning-input')
                hideEl(usernameWarning)
            }
        }

        await updateUserInfo(currentUser, userhandleValue, displayNameValue, bioValue) 

        editingProfile = false; 

        hideEl(saveProfileBtn)
        showEl(editProfileBtn)

        convertBack(userhandleValue, userHandleInput, 'h2', userInfoDiv, 'user handle')
        convertBack(displayNameValue, displayNameInput, 'p', userInfoDiv, 'display name')
        convertBack(bioValue, bioInput, 'p', profileDetailsDiv, 'bio')
    } catch (error) {
        console.error('Error saving profile data:', error)
    }

}
async function handleShowPrevMyProfilePage(){
    try {
        const { currentUser, userhandle, displayname, userPostArr } = await getCurrentUserData(currentProfilePage, 'profile')

        if (currentProfilePage > 1) {
            myProfilePrevBtn.classList.add('next-page-btn', 'custom-btn'); 
            myProfilePrevBtn.classList.remove('inactive')
    
            currentProfilePage--;
            userPostsContainerDiv.innerHTML = ''
    
            const paginatedPosts = await fetchPosts(currentProfilePage, 'profile', userPostArr);
    
            for (const paginatedPost of paginatedPosts) {
                const { postContent, postId, likes, creatorId, comments, dateUpdated } = paginatedPost;
    
                displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', comments, likes, dateUpdated)
            }        
        } else {
            myProfilePrevBtn.classList.remove('next-page-btn', 'custom-btn'); 
            myProfilePrevBtn.classList.add('inactive')
        }
    } catch (error) {
        console.error('Error showing previous profile post page:', error)
    }
}
async function handleShowNextMyProfilePage(){
    try {
        const { currentUser, userhandle, displayname, userPostArr, maxPagesNum } = await getCurrentUserData(currentProfilePage, 'profile')
        
        if (currentFeedPage < maxPagesNum) {
            myProfileNextBtn.classList.add('next-page-btn', 'custom-btn'); 
            myProfileNextBtn.classList.remove('inactive')
            
            currentProfilePage++;
            userPostsContainerDiv.innerHTML = ''
            
            const paginatedPosts = await fetchPosts(currentProfilePage, 'profile', userPostArr);
            
            for (const userPost of paginatedPosts) {
                const { postContent, postId, likes, creatorId, comments, dateUpdated } = userPost;
    
                displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', comments, likes, dateUpdated)
            }       
        } else {
            myProfileNextBtn.classList.remove('next-page-btn', 'custom-btn'); 
            myProfileNextBtn.classList.add('inactive')
        }
    } catch (error) {
     console.error('Error showing next profile post page:', error)   
    }
}

async function handleAddLike(event) {
    try {
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
    } catch (error) {
        console.error('Error adding like:', error)
    }
}

async function handleDeletePost(event) {
    try {
        const targetEl = event.target; 
        const isDeleteBtn = targetEl.classList.contains('delete-icon') || targetEl.classList.contains('delete-btn')
    
        if (isDeleteBtn) {
            const postItem = targetEl.closest('.post');
            const postId = postItem.getAttribute('data-post-id'); 
            const posterId = postItem.getAttribute('data-poster-id'); 
            
            await deletePost(postId, posterId);

            removePost(postItem)
        }
    } catch (error) {
        console.error('Error deleting post:', error)
    }
}

async function handleShowPostDetails(event) {
    try {
        const targetEl = event.target
        const isCommentBtn = targetEl.classList.contains('comments-btn') || targetEl.classList.contains('comments-icon') || targetEl.classList.contains('comments-num');
    
        if (isCommentBtn) {
            const postItem = targetEl.closest('.post')
            const postId = postItem.getAttribute('data-post-id')
            const posterId = postItem.getAttribute('data-poster-id'); 
    
            const { currentUser, userhandle, displayname, postContent, likes, comments, dateUpdated } = await getPostData(postId, posterId); 

            clearPostDetailDiv(); 
            displayPostDetails(currentUser, userhandle, displayname, postContent, posterId, comments, likes, postId, dateUpdated)
            
            showEl(postDetailsDiv);

            hideEl(feedDiv);
            hideEl(myProfileDiv);
        }
    } catch (error) {
        console.error('Error showing post details:', error)
    }
}

async function handleAddComment(event) {
    event.preventDefault(); 

    const type = event.target.id; 

    const postDetails = document.querySelector('#post-detailed')
    const postId = postDetails.getAttribute('data-post-id');
    const posterId = postDetails.getAttribute('data-poster-id');
    const currentUser = await getCurrentUser()

    let commentInput = type === 'comment-btn-lg' 
        ? document.querySelector('#comment-textarea-lg')
        : document.querySelector('#comment-textarea-sm')

    // console.log(commentInput);

    const commentInputValue = commentInput.value.trim(); 
    
    // console.log(commentInputLgValue, commentInputSmValue)

    if (!commentInputValue) {
        return; 
    }

    const { commentId } = await createComment(currentUser, commentInputValue, postId)

    // console.log(await getCommentData(commentId, postId)); 

    const { commentContent, commenterHandle, commenterDisplayname } = await getCommentData(commentId, postId); 

    displayComments(commenterHandle, commenterDisplayname, commentContent, commentId)

    commentInput.value = ''
}

async function handleDeletePostDetail() {
    // Delete the post
    // console.log('delete'); 
    try {
        const postDetails = document.querySelector('#post-detailed');
        const postId = postDetails.getAttribute('data-post-id');
        const posterId = postDetails.getAttribute('data-poster-id');
        const feedAllPageTxt = document.querySelector('#feed-all-pages');

        await deletePost(postId, posterId); 

        const { currentUser, allPosts, maxPagesNum } = await getAllPostInfo(currentFeedPage, 'feed'); 

        feedAllPageTxt.textContent = maxPagesNum; 
        postContainerDiv.innerHTML = ''; 

        for (const post of allPosts) {
            const { userhandle, displayname, postContent, postId, creatorId, likes, comments, dateUpdated } = post; 

            displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'feed', comments, likes, dateUpdated)
        }

        hideEl(postDetailsDiv);
        showEl(feedDiv); 
    } catch (error) {
        console.error('Erorr deleting post (details view):', error)
    }
    
}

async function handleLogout() {
    try {
        await logoutUser()

        hideEl(authSections); 
        showEl(loginForm);
        hideEl(signupForm); 
        showEl(authForms);
    } catch (error) {
        console.error('Error logging out:', error)
    }
}

async function handleShowUserProfile(event) {
    try {
        const targetEl = event.target; 
        const isUserInfoDiv = targetEl.classList.contains('user-info-div') || targetEl.classList.contains('user-handle') || targetEl.classList.contains('display-name')
        
        if (isUserInfoDiv) {
            const myPostsDiv = document.querySelector('#my-posts'); 
            const myProfileAllPageTxt = document.querySelector('#my-profile-all-pages')
            const postItem = targetEl.closest('.post');
            const postId = postItem.getAttribute('data-post-id');
            const posterId = postItem.getAttribute('data-poster-id');
            
            const { currentUser, userhandle, displayname, bio, allUserPosts, userPostArr, maxPagesNum } = await getOtherUserData(posterId, currentProfilePage, 'profile')
            
            if (currentUser === posterId) {
                handleShowMyProfileDiv(); 
                return; 
            }

            currentProfilePage = 1; 

            myPostsDiv.innerHTML = ''; 
            postContainerDiv.innerHTML = ''

            
            myProfileAllPageTxt.textContent = maxPagesNum;
            
            
            for (const userPost of allUserPosts) {
                console.log('yay', userPost)
                const { postContent, postId, likes, creatorId, comments, dateUpdated } = userPost;

                displayPosts(currentUser, userhandle, displayname, postContent, postId, creatorId, 'profile', comments, likes, dateUpdated)
            }
            displayProfileDetails('other profile', userhandle, displayname, bio, userPostArr.length)

            hideEl(feedDiv); 
            showEl (myPostsDiv); 
            showEl(myProfileDiv); 
        }
    } catch (error) {
        console.error(`Error in displaying another user's profile`, error)
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
myProfileNextBtn.addEventListener('click', handleShowNextMyProfilePage);
logoutBtn.addEventListener('click', handleLogout);


postContainerDiv.addEventListener('click', handleAddLike);
userPostsContainerDiv.addEventListener('click', handleAddLike);
detailedPostContainer.addEventListener('click', handleAddLike)

postContainerDiv.addEventListener('click', handleShowUserProfile);
// LIKE BUTTON ON THE DETAILED USER DIV 


postContainerDiv.addEventListener('click', handleDeletePost); 
userPostsContainerDiv.addEventListener('click', handleDeletePost); 
// DELETE BTN ON THE DETAILED UESR DIV 

postContainerDiv.addEventListener('click', handleShowPostDetails);
userPostsContainerDiv.addEventListener('click', handleShowPostDetails);
saveBtnLg.addEventListener('click', handleAddComment)
saveBtnSm.addEventListener('click', handleAddComment)
backBtn.addEventListener('click', handleShowHomeDiv)
deleteDetailedPostBtn.addEventListener('click', handleDeletePostDetail)
