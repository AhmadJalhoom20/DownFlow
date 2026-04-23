import { app, auth, db, storage } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
  limit,
  getDocs,
  deleteDoc,
  writeBatch,
  collectionGroup,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

console.log("DownScrolled App Initialized");

// --- DOM Elements ---
// Auth
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authToggleLink = document.getElementById("auth-toggle-link");
const authToggleText = document.getElementById("auth-toggle-text");
const authError = document.getElementById("auth-error");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const forgotPasswordModal = document.getElementById("forgot-password-modal");
const resetPasswordForm = document.getElementById("reset-password-form");
const closeResetModalBtn = document.getElementById("close-reset-modal");
const logoutModal = document.getElementById("logout-modal");
const confirmLogoutBtn = document.getElementById("confirm-logout-btn");
const cancelLogoutBtn = document.getElementById("cancel-logout-btn");

// Navigation
const navLinks = document.querySelectorAll(".nav-links li, .mobile-nav a");
const views = document.querySelectorAll(".view-section");

// Modals
const createPostModal = document.getElementById("create-post-modal");
const closeCreatePostBtn = document.getElementById("close-create-post");
const submitPostBtn = document.getElementById("submit-post-btn");
const postTextInput = document.getElementById("post-text-input");
const postImageUpload = document.getElementById("post-image-upload");
const postVideoUpload = document.getElementById("post-video-upload");
const postMediaPreview = document.getElementById("post-media-preview");
const triggerCreateModalBtns = document.querySelectorAll(
  ".trigger-create-modal",
);
const postPrivacySelect = document.getElementById("post-privacy-select");
const selectUsersModal = document.getElementById("select-users-modal");
const closeSelectUsersBtn = document.getElementById("close-select-users");
const selectUsersList = document.getElementById("select-users-list");
const confirmSelectionBtn = document.getElementById("confirm-selection-btn");

// Polls & Emoji
const btnAddList = document.getElementById("btn-add-list");
const pollCreationUi = document.getElementById("poll-creation-ui");
const addPollOptionBtn = document.getElementById("add-poll-option");
const btnAddEmoji = document.getElementById("btn-add-emoji");
const emojiPicker = document.getElementById("emoji-picker");

const commentModal = document.getElementById("comment-modal");
const closeCommentModalBtn = document.getElementById("close-comment-modal");
const submitCommentBtn = document.getElementById("submit-comment-btn");
const commentTextInput = document.getElementById("comment-text-input");
const commentPostPreview = document.getElementById("comment-post-preview");
const commentsListContainer = document.getElementById(
  "comments-list-container",
);

const createStoryModal = document.getElementById("create-story-modal");
const closeCreateStoryBtn = document.getElementById("close-create-story");
const submitStoryBtn = document.getElementById("submit-story-btn");
const storyImageUpload = document.getElementById("story-image-upload");
const storyMediaPreview = document.getElementById("story-media-preview");
const createStoryTrigger = document.querySelector(".create-story");

const storyViewerModal = document.getElementById("story-viewer-modal");
const closeStoryViewerBtn = document.getElementById("close-story-viewer");
const storyViewImage = document.getElementById("story-view-image");
const storyViewName = document.getElementById("story-view-name");
const storyViewTime = document.getElementById("story-view-time");
const storyViewAvatar = document.getElementById("story-view-avatar");
const storyProgressBar = document.querySelector(
  ".story-progress-bar .progress",
);

const editProfileModal = document.getElementById("edit-profile-modal");
const editProfileForm = document.getElementById("edit-profile-form");
const closeEditProfileBtn = document.getElementById("close-edit-profile");
const btnEditProfile = document.getElementById("btn-profile-action");
const avatarUploadInput = document.getElementById("avatar-upload");
const editAvatarPreview = document.getElementById("edit-avatar-preview");

const userListModal = document.getElementById("user-list-modal");
const closeUserListBtn = document.getElementById("close-user-list");
const userListContainer = document.getElementById("user-list-container");
const userListTitle = document.getElementById("user-list-title");

// Messages Elements
const newMessageModal = document.getElementById("new-message-modal");
const closeNewMessageBtn = document.getElementById("close-new-message");
const btnNewMessage = document.getElementById("btn-new-message");
const btnNewMessageMain = document.getElementById("btn-new-message-main");
const newMessageListContainer = document.getElementById(
  "new-message-list-container",
);
const newMessageSearch = document.getElementById("new-message-search");
const conversationsList = document.getElementById("conversations-list");
const chatWindow = document.getElementById("chat-window");
const noChatSelected = document.querySelector(".no-chat-selected");
const activeChatContent = document.querySelector(".active-chat-content");
const chatHeaderAvatar = document.getElementById("chat-header-avatar");
const chatHeaderName = document.getElementById("chat-header-name");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send-btn");

// Chat Context Menu & Edit
const messageContextMenu = document.getElementById("message-context-menu");
const ctxEditMsg = document.getElementById("ctx-edit-msg");
const ctxDeleteMsg = document.getElementById("ctx-delete-msg");
const editMessageModal = document.getElementById("edit-message-modal");
const editMessageInput = document.getElementById("edit-message-input");
const confirmEditMessageBtn = document.getElementById(
  "confirm-edit-message-btn",
);
const cancelEditMessageBtn = document.getElementById("cancel-edit-message-btn");

// Search Elements
const exploreSearchInput = document.getElementById("explore-search-input");
const rightSearchInput = document.getElementById("right-search-input");

// Settings
const settingsUsernameInput = document.getElementById("settings-username");
const btnUpdateAccount = document.getElementById("btn-update-account");
const settingsPasswordInput = document.getElementById("settings-new-password");
const btnChangePassword = document.getElementById("btn-change-password");
const btnDeleteAccount = document.getElementById("btn-delete-account");

// Feeds & Lists
const feedContainer = document.getElementById("feed-container");
const storiesList = document.getElementById("stories-list");
const exploreGrid = document.getElementById("explore-grid");
const notificationsList = document.getElementById("notifications-list");
const whoToFollowContainer = document.getElementById("who-to-follow-container");
const trendsContainer = document.getElementById("trends-container");

// User Data Display
const userProfileMini = document.querySelector(".user-profile-mini");
const userNameDisplay = document.querySelector(".user-info .name");
const userHandleDisplay = document.querySelector(".user-info .handle");
const userAvatarDisplay = document.querySelector(".user-profile-mini .avatar");
const currentUserAvatars = document.querySelectorAll(".current-user-avatar");

// Tabs
const tabForYou = document.getElementById("tab-for-you");
const tabFollowing = document.getElementById("tab-following");
const tabProfilePosts = document.getElementById("tab-profile-posts");
const tabProfileReplies = document.getElementById("tab-profile-replies");
const tabProfileMedia = document.getElementById("tab-profile-media");
const tabProfileLikes = document.getElementById("tab-profile-likes");

// State
let isLoginMode = true;
let currentUser = null;
let userData = null;
let currentReplyPostId = null;
let currentStoryInterval = null;
let profileTargetUid = null;
let activeChatId = null;
let activeChatUnsubscribe = null;
let selectedSpecificUsers = [];
let feedUnsubscribe = null;
let currentFeedType = "forYou"; // 'forYou' or 'following'
let selectedMessageId = null; // For edit/delete
let isPollMode = false;
let uploadedVideoFile = null;

// --- Authentication Logic ---

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    authModal.classList.remove("active");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      userData = userDoc.data();
    } else {
      userData = {
        username: user.email.split("@")[0],
        bio: "",
        followers: [],
        following: [],
      };
    }

    updateUI(user, userData);
    loadFeed("forYou");
    loadStories();
    loadWhoToFollow();
    loadRealTrends();
    setupNotificationsListener();
    setupConversationsListener();
  } else {
    currentUser = null;
    userData = null;
    authModal.classList.add("active");
    resetUI();
  }
});

function updateUI(user, data) {
  const name = user.displayName || "User";
  const handle = `@${data.username || user.email.split("@")[0]}`;
  const photoURL = user.photoURL;

  userNameDisplay.textContent = name;
  userHandleDisplay.textContent = handle;
  setAvatar(userAvatarDisplay, photoURL, name);
  currentUserAvatars.forEach((el) => setAvatar(el, photoURL, name));

  if (settingsUsernameInput) settingsUsernameInput.value = data.username || "";
}

function resetUI() {
  userNameDisplay.textContent = "Guest";
  userHandleDisplay.textContent = "@guest";
  userAvatarDisplay.style.backgroundImage = "";
  userAvatarDisplay.textContent = "";
}

function setAvatar(element, url, name) {
  if (url) {
    element.style.backgroundImage = `url(${url})`;
    element.textContent = "";
  } else {
    element.style.backgroundImage = "";
    element.textContent = name ? name[0].toUpperCase() : "U";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    element.style.color = "white";
    element.style.fontWeight = "bold";
  }
}

// Auth Form
authToggleLink.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  authSubmitBtn.textContent = isLoginMode ? "Log In" : "Sign Up";
  authToggleText.innerHTML = isLoginMode
    ? 'Don\'t have an account? <span id="auth-toggle-link">Sign up</span>'
    : 'Already have an account? <span id="auth-toggle-link">Log in</span>';
  document
    .getElementById("auth-toggle-link")
    .addEventListener("click", () => authToggleLink.click());
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  authSubmitBtn.disabled = true;
  authSubmitBtn.textContent = "Processing...";

  try {
    if (isLoginMode) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const username = email.split("@")[0];
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        username: username,
        bio: "",
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
      });
      await updateProfile(userCredential.user, { displayName: username });
    }
  } catch (error) {
    authError.textContent = error.message.replace("Firebase: ", "");
    authSubmitBtn.disabled = false;
    authSubmitBtn.textContent = isLoginMode ? "Log In" : "Sign Up";
  }
});

// Password Reset
forgotPasswordLink.addEventListener("click", () => {
  authModal.classList.remove("active");
  forgotPasswordModal.classList.add("active");
});
closeResetModalBtn.addEventListener("click", () => {
  forgotPasswordModal.classList.remove("active");
  authModal.classList.add("active");
});
resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await sendPasswordResetEmail(
      auth,
      document.getElementById("reset-email").value,
    );
    alert("Reset link sent!");
    forgotPasswordModal.classList.remove("active");
    authModal.classList.add("active");
  } catch (e) {
    alert(e.message);
  }
});

// Logout Modal
userProfileMini.addEventListener("click", () => {
  logoutModal.classList.add("active");
});
cancelLogoutBtn.addEventListener("click", () =>
  logoutModal.classList.remove("active"),
);
confirmLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  logoutModal.classList.remove("active");
  window.location.reload();
});

// --- Settings Logic ---
btnUpdateAccount.addEventListener("click", async () => {
  const newUsername = settingsUsernameInput.value.trim();
  if (!newUsername) return alert("Username cannot be empty");

  // Validation
  if (/\s/.test(newUsername)) return alert("Username cannot contain spaces");
  if (!/^[a-zA-Z0-9_]+$/.test(newUsername))
    return alert("Username can only contain letters, numbers, and underscores");

  btnUpdateAccount.disabled = true;
  btnUpdateAccount.textContent = "Updating...";

  try {
    // Check uniqueness
    const q = query(
      collection(db, "users"),
      where("username", "==", newUsername),
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty && snapshot.docs[0].id !== currentUser.uid) {
      throw new Error("Username already taken");
    }

    await updateProfile(currentUser, { displayName: newUsername });
    await updateDoc(doc(db, "users", currentUser.uid), {
      username: newUsername,
    });

    // Batch update old posts
    const batch = writeBatch(db);
    const postsQ = query(
      collection(db, "posts"),
      where("authorId", "==", currentUser.uid),
    );
    const postsSnap = await getDocs(postsQ);
    postsSnap.forEach((doc) => {
      batch.update(doc.ref, {
        authorUsername: newUsername,
        authorName: newUsername,
      });
    });
    await batch.commit();

    alert("Account updated!");
    window.location.reload();
  } catch (e) {
    alert(e.message);
  } finally {
    btnUpdateAccount.disabled = false;
    btnUpdateAccount.textContent = "Update Info";
  }
});

btnChangePassword.addEventListener("click", async () => {
  const newPass = settingsPasswordInput.value;
  if (!newPass || newPass.length < 6)
    return alert("Password must be at least 6 chars");

  btnChangePassword.disabled = true;
  try {
    await updatePassword(currentUser, newPass);
    alert("Password changed!");
    settingsPasswordInput.value = "";
  } catch (e) {
    alert("Error: " + e.message + " (You may need to re-login)");
  } finally {
    btnChangePassword.disabled = false;
  }
});

btnDeleteAccount.addEventListener("click", async () => {
  if (!confirm("Are you sure? This is permanent.")) return;

  btnDeleteAccount.disabled = true;
  btnDeleteAccount.textContent = "Deleting...";
  try {
    await deleteDoc(doc(db, "users", currentUser.uid));
    await deleteUser(currentUser);
    alert("Account deleted.");
    window.location.reload();
  } catch (e) {
    alert("Error: " + e.message + " (Re-login required for security)");
  } finally {
    btnDeleteAccount.disabled = false;
    btnDeleteAccount.textContent = "Delete Account";
  }
});

// --- Helper: Base64 ---
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// --- Create Post Modal ---
triggerCreateModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => createPostModal.classList.add("active"));
});
closeCreatePostBtn.addEventListener("click", () => {
  createPostModal.classList.remove("active");
  resetCreatePost();
});

function resetCreatePost() {
  postTextInput.value = "";
  postMediaPreview.innerHTML = "";
  postPrivacySelect.value = "public";
  selectedSpecificUsers = [];
  isPollMode = false;
  pollCreationUi.style.display = "none";
  uploadedVideoFile = null;
}

postImageUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedVideoFile = null; // Clear video
    const base64 = await toBase64(file);
    postMediaPreview.innerHTML = `<img src="${base64}" data-base64="${base64}">`;
  }
});

postVideoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedVideoFile = file;
    postMediaPreview.innerHTML = `<p>Video selected: ${file.name}</p>`;
  }
});

// Polls Logic
btnAddList.addEventListener("click", () => {
  isPollMode = !isPollMode;
  pollCreationUi.style.display = isPollMode ? "block" : "none";
  if (isPollMode) {
    postMediaPreview.innerHTML = ""; // Clear media
    uploadedVideoFile = null;
  }
});

addPollOptionBtn.addEventListener("click", () => {
  const inputs = pollCreationUi.querySelectorAll(".poll-option-input");
  if (inputs.length >= 4) return alert("Max 4 options");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "poll-option-input";
  input.placeholder = `Choice ${inputs.length + 1}`;
  pollCreationUi.querySelector(".poll-input-group").appendChild(input);
});

// Emoji Picker
const emojis = [
  "😀",
  "😂",
  "😍",
  "😭",
  "😡",
  "👍",
  "👎",
  "🔥",
  "✨",
  "🎉",
  "❤️",
  "💔",
  "👀",
  "🚀",
  "💯",
];
emojis.forEach((emoji) => {
  const span = document.createElement("span");
  span.className = "emoji-item";
  span.textContent = emoji;
  span.addEventListener("click", () => {
    postTextInput.value += emoji;
    emojiPicker.style.display = "none";
  });
  emojiPicker.appendChild(span);
});

btnAddEmoji.addEventListener("click", (e) => {
  e.stopPropagation();
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "grid" : "none";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".emoji-wrapper")) {
    emojiPicker.style.display = "none";
  }
});

// Privacy Selection Logic
postPrivacySelect.addEventListener("change", (e) => {
  if (e.target.value === "specific") {
    openSelectUsersModal();
  }
});

function openSelectUsersModal() {
  selectUsersModal.classList.add("active");
  selectedSpecificUsers = [];
  selectUsersList.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  getDocs(query(collection(db, "users"), limit(50))).then((snapshot) => {
    selectUsersList.innerHTML = "";
    snapshot.forEach((doc) => {
      if (doc.id === currentUser.uid) return;
      const user = doc.data();
      const div = document.createElement("div");
      div.className = "user-select-item";
      div.innerHTML = `
                <input type="checkbox" value="${doc.id}">
                <div class="avatar placeholder-avatar" style="background-image: url('${user.photoURL || ""}')"></div>
                <div class="info"><h4>${user.username}</h4><span>@${user.username}</span></div>
            `;
      div.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) selectedSpecificUsers.push(doc.id);
        else
          selectedSpecificUsers = selectedSpecificUsers.filter(
            (id) => id !== doc.id,
          );
      });
      selectUsersList.appendChild(div);
    });
  });
}

closeSelectUsersBtn.addEventListener("click", () =>
  selectUsersModal.classList.remove("active"),
);
confirmSelectionBtn.addEventListener("click", () =>
  selectUsersModal.classList.remove("active"),
);

submitPostBtn.addEventListener("click", async () => {
  const text = postTextInput.value;
  const imgEl = postMediaPreview.querySelector("img");
  const imageBase64 = imgEl ? imgEl.dataset.base64 : null;
  const privacy = postPrivacySelect.value;

  let pollData = null;
  if (isPollMode) {
    const options = Array.from(
      pollCreationUi.querySelectorAll(".poll-option-input"),
    )
      .map((input) => input.value.trim())
      .filter((val) => val);

    if (options.length < 2) return alert("Poll needs at least 2 options");

    pollData = {
      options: options.map((opt) => ({ text: opt, votes: [] })),
      totalVotes: 0,
    };
  }

  if (!text && !imageBase64 && !uploadedVideoFile && !pollData) return;

  submitPostBtn.disabled = true;
  submitPostBtn.textContent = "Posting...";

  try {
    let videoUrl = null;
    if (uploadedVideoFile) {
      const storageRef = ref(
        storage,
        `videos/${Date.now()}_${uploadedVideoFile.name}`,
      );
      await uploadBytes(storageRef, uploadedVideoFile);
      videoUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "posts"), {
      text: text,
      imageUrl: imageBase64,
      videoUrl: videoUrl,
      poll: pollData,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorUsername: userData.username,
      authorPhoto: currentUser.photoURL,
      authorFollowersCount: userData.followers ? userData.followers.length : 0,
      timestamp: serverTimestamp(),
      likes: [],
      commentsCount: 0,
      privacy: privacy,
      allowedUsers: privacy === "specific" ? selectedSpecificUsers : [],
    });

    createPostModal.classList.remove("active");
    resetCreatePost();
  } catch (e) {
    console.error(e);
    alert("Error posting");
  } finally {
    submitPostBtn.disabled = false;
    submitPostBtn.textContent = "Post";
  }
});

// --- Stories Logic ---
createStoryTrigger.addEventListener("click", () =>
  createStoryModal.classList.add("active"),
);
closeCreateStoryBtn.addEventListener("click", () =>
  createStoryModal.classList.remove("active"),
);

storyImageUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await toBase64(file);
    storyMediaPreview.innerHTML = `<img src="${base64}" data-base64="${base64}">`;
  }
});

submitStoryBtn.addEventListener("click", async () => {
  const imgEl = storyMediaPreview.querySelector("img");
  if (!imgEl) return alert("Select an image");

  submitStoryBtn.disabled = true;
  try {
    await addDoc(collection(db, "stories"), {
      imageUrl: imgEl.dataset.base64,
      authorId: currentUser.uid,
      authorName: userData.username,
      authorPhoto: currentUser.photoURL,
      timestamp: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    createStoryModal.classList.remove("active");
    storyMediaPreview.innerHTML = "";
  } catch (e) {
    console.error(e);
  } finally {
    submitStoryBtn.disabled = false;
  }
});

function loadStories() {
  const q = query(
    collection(db, "stories"),
    orderBy("timestamp", "desc"),
    limit(50),
  );
  onSnapshot(q, (snapshot) => {
    storiesList.innerHTML = "";
    snapshot.forEach((doc) => {
      const story = doc.data();
      // Privacy: Only show if I follow them or it's me
      const isFollowing =
        userData.following && userData.following.includes(story.authorId);
      if (story.authorId !== currentUser.uid && !isFollowing) return;

      const div = document.createElement("div");
      div.className = "story-item";
      div.innerHTML = `
                <div class="story-avatar" style="background-image: url('${story.authorPhoto || ""}')"></div>
                <span class="story-user">${story.authorName}</span>
            `;
      div.addEventListener("click", () => openStoryViewer(story));
      storiesList.appendChild(div);
    });
  });
}

function openStoryViewer(story) {
  storyViewerModal.classList.add("active");
  storyViewImage.style.backgroundImage = `url(${story.imageUrl})`;
  setAvatar(storyViewAvatar, story.authorPhoto, story.authorName);
  storyViewName.textContent = story.authorName;
  storyViewTime.textContent = "Just now";

  storyProgressBar.style.width = "0%";
  setTimeout(() => (storyProgressBar.style.width = "100%"), 100);

  if (currentStoryInterval) clearTimeout(currentStoryInterval);
  currentStoryInterval = setTimeout(() => {
    storyViewerModal.classList.remove("active");
  }, 5000);
}

closeStoryViewerBtn.addEventListener("click", () => {
  storyViewerModal.classList.remove("active");
  if (currentStoryInterval) clearTimeout(currentStoryInterval);
});

// --- Feed & Interactions ---
tabForYou.addEventListener("click", () => {
  tabForYou.classList.add("active");
  tabFollowing.classList.remove("active");
  loadFeed("forYou");
});

tabFollowing.addEventListener("click", () => {
  tabFollowing.classList.add("active");
  tabForYou.classList.remove("active");
  loadFeed("following");
});

function loadFeed(type = "forYou") {
  currentFeedType = type;
  if (feedUnsubscribe) feedUnsubscribe();

  feedContainer.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  const q = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc"),
    limit(50),
  );

  feedUnsubscribe = onSnapshot(q, (snapshot) => {
    feedContainer.innerHTML = "";
    let hasPosts = false;

    snapshot.forEach((doc) => {
      const post = doc.data();

      // Feed Type Filtering
      if (type === "following") {
        const isFollowing =
          userData.following && userData.following.includes(post.authorId);
        if (post.authorId !== currentUser.uid && !isFollowing) return;
      } else if (type === "forYou") {
        // Following OR Follower OR Famous (>1000)
        const isFollowing =
          userData.following && userData.following.includes(post.authorId);
        const isFollower =
          userData.followers && userData.followers.includes(post.authorId);
        const isFamous = post.authorFollowersCount > 1000;

        if (
          post.authorId !== currentUser.uid &&
          !isFollowing &&
          !isFollower &&
          !isFamous
        )
          return;
      }

      // Privacy Filtering (Additional Layer)
      if (post.privacy === "followers") {
        const isFollowing =
          userData.following && userData.following.includes(post.authorId);
        if (post.authorId !== currentUser.uid && !isFollowing) return;
      } else if (post.privacy === "friends") {
        const isFollowing =
          userData.following && userData.following.includes(post.authorId);
        const isFollower =
          userData.followers && userData.followers.includes(post.authorId);
        if (post.authorId !== currentUser.uid && (!isFollowing || !isFollower))
          return;
      } else if (post.privacy === "specific") {
        if (
          post.authorId !== currentUser.uid &&
          (!post.allowedUsers || !post.allowedUsers.includes(currentUser.uid))
        )
          return;
      }

      feedContainer.appendChild(createPostElement(doc.id, post));
      hasPosts = true;
    });

    if (!hasPosts) {
      feedContainer.innerHTML = `<div class="no-posts">No posts to show in ${type === "following" ? "Following" : "For You"}.</div>`;
    }
  });
}

function createPostElement(postId, post) {
  const div = document.createElement("div");
  div.className = "post";

  // Linkify Hashtags
  let formattedText = post.text.replace(
    /#(\w+)/g,
    '<span class="hashtag">#$1</span>',
  );

  // Poll HTML
  let pollHtml = "";
  if (post.poll) {
    pollHtml = '<div class="poll-container">';
    const totalVotes = post.poll.totalVotes || 0;

    post.poll.options.forEach((opt, index) => {
      const percentage =
        totalVotes === 0
          ? 0
          : Math.round((opt.votes.length / totalVotes) * 100);
      const hasVoted = opt.votes.includes(currentUser.uid);

      pollHtml += `
                <div class="poll-option" data-index="${index}">
                    <div class="poll-progress" style="width: ${percentage}%"></div>
                    <span class="poll-label">${opt.text}</span>
                    <span class="poll-percentage">${percentage}%</span>
                </div>
            `;
    });
    pollHtml += `<div style="font-size:0.8rem; color:var(--text-secondary); margin-top:5px;">${totalVotes} votes</div></div>`;
  }

  div.innerHTML = `
        <div class="post-avatar" style="background-image: url('${post.authorPhoto || ""}'); background-color: #536471;">
            ${!post.authorPhoto ? (post.authorName ? post.authorName[0].toUpperCase() : "U") : ""}
        </div>
        <div class="post-content">
            <div class="post-header">
                <span class="name">${post.authorName}</span>
                <span class="handle">@${post.authorUsername}</span>
                <span class="time">· ${timeAgo(post.timestamp)}</span>
            </div>
            <div class="post-text">${formattedText}</div>
            ${post.imageUrl ? `<div class="post-image"><img src="${post.imageUrl}" alt="Post Image"></div>` : ""}
            ${post.videoUrl ? `<div class="post-video"><video src="${post.videoUrl}" controls></video></div>` : ""}
            ${pollHtml}
            <div class="post-actions">
                <div class="action-btn like-btn ${post.likes && post.likes.includes(currentUser?.uid) ? "liked" : ""}" data-id="${postId}">
                    <i class="fa-${post.likes && post.likes.includes(currentUser?.uid) ? "solid" : "regular"} fa-heart"></i>
                    <span>${post.likes ? post.likes.length : 0}</span>
                </div>
                <div class="action-btn comment-btn" data-id="${postId}">
                    <i class="fa-regular fa-comment"></i>
                    <span>${post.commentsCount || 0}</span>
                </div>
                <div class="action-btn share-btn">
                    <i class="fa-solid fa-share-nodes"></i>
                </div>
            </div>
        </div>
    `;

  div.querySelector(".post-avatar").addEventListener("click", (e) => {
    e.stopPropagation();
    openProfile(post.authorId);
  });

  // Hashtag Click
  div.querySelectorAll(".hashtag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      performSearch(tag.textContent);
    });
  });

  // Poll Click
  if (post.poll) {
    div.querySelectorAll(".poll-option").forEach((opt) => {
      opt.addEventListener("click", async (e) => {
        e.stopPropagation();
        const index = parseInt(opt.dataset.index);
        await voteOnPoll(postId, post, index);
      });
    });
  }

  div.querySelector(".like-btn").addEventListener("click", async (e) => {
    e.stopPropagation();
    const postRef = doc(db, "posts", postId);
    if (post.likes && post.likes.includes(currentUser.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      if (post.authorId !== currentUser.uid) {
        addNotification(post.authorId, "like", postId);
      }
    }
  });

  div.querySelector(".comment-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    openCommentModal(postId, post);
  });

  div.querySelector(".share-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#post/${postId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"));
  });

  return div;
}

async function voteOnPoll(postId, post, optionIndex) {
  // Check if already voted
  let alreadyVoted = false;
  post.poll.options.forEach((opt) => {
    if (opt.votes.includes(currentUser.uid)) alreadyVoted = true;
  });

  if (alreadyVoted) return alert("You already voted!");

  const newOptions = [...post.poll.options];
  newOptions[optionIndex].votes.push(currentUser.uid);

  await updateDoc(doc(db, "posts", postId), {
    "poll.options": newOptions,
    "poll.totalVotes": post.poll.totalVotes + 1,
  });
}

// --- Search Logic ---
exploreSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch(e.target.value);
});
rightSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch(e.target.value);
});

async function performSearch(queryText) {
  if (!queryText) return;

  // Switch to Explore view
  navLinks.forEach((l) => l.classList.remove("active"));
  document
    .querySelectorAll('[data-page="explore"]')
    .forEach((l) => l.classList.add("active"));
  views.forEach((view) => (view.style.display = "none"));
  document.getElementById("view-explore").style.display = "block";

  exploreSearchInput.value = queryText;
  exploreGrid.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  if (queryText.startsWith("#")) {
    // Search Posts by Hashtag (Client-side filter for now)
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(50),
    );
    const snapshot = await getDocs(q);
    exploreGrid.innerHTML = "";
    exploreGrid.style.display = "block"; // Use block for feed style results

    snapshot.forEach((doc) => {
      const post = doc.data();
      if (post.text && post.text.includes(queryText)) {
        exploreGrid.appendChild(createPostElement(doc.id, post));
      }
    });
    if (exploreGrid.innerHTML === "")
      exploreGrid.innerHTML =
        '<p style="text-align:center; padding:20px;">No posts found.</p>';
  } else {
    // Search Users
    exploreGrid.style.display = "block";
    exploreGrid.innerHTML = "";

    const q = query(collection(db, "users"), limit(50));
    const snapshot = await getDocs(q);
    let found = false;

    snapshot.forEach((doc) => {
      const user = doc.data();
      if (user.username.toLowerCase().includes(queryText.toLowerCase())) {
        found = true;
        const div = document.createElement("div");
        div.className = "follow-item";
        div.innerHTML = `
                    <div class="avatar placeholder-avatar" style="background-image: url('${user.photoURL || ""}')"></div>
                    <div class="info"><h4>${user.username}</h4><span>@${user.username}</span></div>
                    <button class="btn-sm">View</button>
                `;
        div.addEventListener("click", () => openProfile(doc.id));
        exploreGrid.appendChild(div);
      }
    });
    if (!found)
      exploreGrid.innerHTML =
        '<p style="text-align:center; padding:20px;">No users found.</p>';
  }
}

// --- Comments Logic ---
function openCommentModal(postId, post) {
  currentReplyPostId = postId;
  commentModal.classList.add("active");
  commentPostPreview.innerHTML = `
        <div style="display:flex; gap:10px; margin-bottom:10px; opacity:0.7;">
            <div class="post-avatar" style="width:30px; height:30px; background-image: url('${post.authorPhoto || ""}')"></div>
            <div>
                <strong>${post.authorName}</strong>
                <p>${post.text}</p>
            </div>
        </div>
    `;

  commentsListContainer.innerHTML =
    '<div class="loading-spinner-sm"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';
  const q = query(
    collection(db, `posts/${postId}/comments`),
    orderBy("timestamp", "asc"),
  );
  onSnapshot(q, (snapshot) => {
    commentsListContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const comment = doc.data();
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `
                <div class="post-avatar" style="width:30px; height:30px; background-image: url('${comment.authorPhoto || ""}')"></div>
                <div class="comment-content">
                    <div class="comment-header">
                        <strong>${comment.authorName}</strong>
                        <span>${timeAgo(comment.timestamp)}</span>
                    </div>
                    <div>${comment.text}</div>
                </div>
            `;
      commentsListContainer.appendChild(div);
    });
    if (snapshot.empty)
      commentsListContainer.innerHTML =
        '<p style="text-align:center; color:var(--text-secondary); padding:10px;">No comments yet.</p>';
  });
}

closeCommentModalBtn.addEventListener("click", () =>
  commentModal.classList.remove("active"),
);

submitCommentBtn.addEventListener("click", async () => {
  const text = commentTextInput.value;
  if (!text) return;

  try {
    await addDoc(collection(db, `posts/${currentReplyPostId}/comments`), {
      text: text,
      authorId: currentUser.uid,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(db, "posts", currentReplyPostId), {
      commentsCount:
        (await getDoc(doc(db, "posts", currentReplyPostId))).data()
          .commentsCount + 1 || 1,
    });
    commentTextInput.value = "";
  } catch (e) {
    console.error(e);
  }
});

// --- Messages Logic ---
const openNewMessageModal = () => {
  newMessageModal.classList.add("active");
  loadUsersForMessage();
};

btnNewMessage.addEventListener("click", openNewMessageModal);
btnNewMessageMain.addEventListener("click", openNewMessageModal);
closeNewMessageBtn.addEventListener("click", () =>
  newMessageModal.classList.remove("active"),
);

async function loadUsersForMessage() {
  newMessageListContainer.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';
  const q = query(collection(db, "users"), limit(20));
  const snapshot = await getDocs(q);
  newMessageListContainer.innerHTML = "";
  snapshot.forEach((doc) => {
    if (doc.id === currentUser.uid) return;
    const user = doc.data();
    const div = document.createElement("div");
    div.className = "follow-item";
    div.innerHTML = `
            <div class="avatar placeholder-avatar" style="background-image: url('${user.photoURL || ""}')"></div>
            <div class="info"><h4>${user.username}</h4><span>@${user.username}</span></div>
        `;
    div.addEventListener("click", () => startChat(doc.id, user));
    newMessageListContainer.appendChild(div);
  });
}

async function startChat(targetUid, targetUser) {
  newMessageModal.classList.remove("active");

  // Check if chat exists
  const participants = [currentUser.uid, targetUid].sort();
  const chatId = participants.join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatRef);

  if (!chatDoc.exists()) {
    await setDoc(chatRef, {
      participants: participants,
      participantData: {
        [currentUser.uid]: {
          name: userData.username,
          photo: currentUser.photoURL || null,
        },
        [targetUid]: {
          name: targetUser.username,
          photo: targetUser.photoURL || null,
        },
      },
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
    });
  }

  openChatWindow(chatId, targetUser);
}

function setupConversationsListener() {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", currentUser.uid),
    orderBy("lastMessageTime", "desc"),
  );
  onSnapshot(q, (snapshot) => {
    conversationsList.innerHTML = "";
    snapshot.forEach((doc) => {
      const chat = doc.data();
      const otherUid = chat.participants.find((id) => id !== currentUser.uid);
      const otherUser = chat.participantData[otherUid];

      const div = document.createElement("div");
      div.className = `conversation-item ${activeChatId === doc.id ? "active" : ""}`;
      div.innerHTML = `
                <div class="avatar placeholder-avatar" style="background-image: url('${otherUser.photo || ""}')"></div>
                <div class="info">
                    <h4>${otherUser.name}</h4>
                    <span class="last-msg">${chat.lastMessage || "Start a conversation"}</span>
                </div>
            `;
      div.addEventListener("click", () => openChatWindow(doc.id, otherUser));
      conversationsList.appendChild(div);
    });
  });
}

function openChatWindow(chatId, otherUser) {
  activeChatId = chatId;
  noChatSelected.style.display = "none";
  activeChatContent.style.display = "flex";

  chatHeaderName.textContent = otherUser.name || otherUser.username;
  setAvatar(
    chatHeaderAvatar,
    otherUser.photo || otherUser.photoURL,
    otherUser.name || otherUser.username,
  );

  // Highlight active conversation
  document
    .querySelectorAll(".conversation-item")
    .forEach((el) => el.classList.remove("active"));

  // Load Messages
  if (activeChatUnsubscribe) activeChatUnsubscribe();

  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp", "asc"),
  );
  activeChatUnsubscribe = onSnapshot(q, (snapshot) => {
    chatMessages.innerHTML = "";
    const batch = writeBatch(db);
    let needsCommit = false;

    snapshot.forEach((doc) => {
      const msg = doc.data();

      // Mark as seen if it's from the other person and not seen
      if (msg.senderId !== currentUser.uid && msg.status !== "seen") {
        batch.update(doc.ref, { status: "seen" });
        needsCommit = true;
      }

      const div = document.createElement("div");
      div.className = `message-bubble ${msg.senderId === currentUser.uid ? "sent" : "received"} ${msg.isDeleted ? "deleted" : ""}`;

      let statusIcon = "";
      if (msg.senderId === currentUser.uid) {
        if (msg.status === "sent")
          statusIcon = '<i class="fa-solid fa-check msg-status"></i>';
        else if (msg.status === "delivered")
          statusIcon = '<i class="fa-solid fa-check-double msg-status"></i>';
        else if (msg.status === "seen")
          statusIcon =
            '<i class="fa-solid fa-check-double msg-status" style="color:var(--brand-color)"></i>';
      }

      div.innerHTML = `
                ${msg.text}
                ${msg.isEdited ? '<span class="msg-edited">(edited)</span>' : ""}
                ${statusIcon}
            `;

      // Context Menu Handler
      if (msg.senderId === currentUser.uid && !msg.isDeleted) {
        div.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          showContextMenu(e.pageX, e.pageY, doc.id, msg.text);
        });
      }

      chatMessages.appendChild(div);
    });

    if (needsCommit) batch.commit();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// Context Menu Logic
function showContextMenu(x, y, msgId, text) {
  selectedMessageId = msgId;
  messageContextMenu.style.display = "block";
  messageContextMenu.style.left = `${x}px`;
  messageContextMenu.style.top = `${y}px`;

  // Store text for edit
  messageContextMenu.dataset.text = text;
}

document.addEventListener("click", () => {
  messageContextMenu.style.display = "none";
});

ctxDeleteMsg.addEventListener("click", async () => {
  if (!selectedMessageId || !activeChatId) return;
  if (!confirm("Delete this message?")) return;

  try {
    await updateDoc(
      doc(db, `chats/${activeChatId}/messages`, selectedMessageId),
      {
        text: "This message was deleted",
        isDeleted: true,
      },
    );
  } catch (e) {
    alert("Error deleting message");
  }
});

ctxEditMsg.addEventListener("click", () => {
  if (!selectedMessageId) return;
  editMessageInput.value = messageContextMenu.dataset.text;
  editMessageModal.classList.add("active");
});

cancelEditMessageBtn.addEventListener("click", () =>
  editMessageModal.classList.remove("active"),
);

confirmEditMessageBtn.addEventListener("click", async () => {
  const newText = editMessageInput.value.trim();
  if (!newText || !selectedMessageId || !activeChatId) return;

  try {
    await updateDoc(
      doc(db, `chats/${activeChatId}/messages`, selectedMessageId),
      {
        text: newText,
        isEdited: true,
      },
    );
    editMessageModal.classList.remove("active");
  } catch (e) {
    alert("Error editing message");
  }
});

chatSendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !activeChatId) return;

  chatInput.value = "";

  await addDoc(collection(db, `chats/${activeChatId}/messages`), {
    text: text,
    senderId: currentUser.uid,
    timestamp: serverTimestamp(),
    status: "sent", // sent, delivered, seen
    isEdited: false,
    isDeleted: false,
  });

  await updateDoc(doc(db, "chats", activeChatId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
  });
}

// --- Public Profiles ---
document.getElementById("profile-back-btn").addEventListener("click", () => {
  // Simple back logic: go to home
  navLinks.forEach((l) => l.classList.remove("active"));
  document
    .querySelectorAll('[data-page="home"]')
    .forEach((l) => l.classList.add("active"));
  views.forEach((view) => (view.style.display = "none"));
  document.getElementById("view-home").style.display = "block";
});

document.getElementById("btn-mobile-settings").addEventListener("click", () => {
  views.forEach((view) => (view.style.display = "none"));
  document.getElementById("view-settings").style.display = "block";
});

async function openProfile(uid) {
  profileTargetUid = uid;

  document
    .querySelectorAll(".view-section")
    .forEach((v) => (v.style.display = "none"));
  document.getElementById("view-profile").style.display = "block";
  window.scrollTo(0, 0);

  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return;
  const data = userDoc.data();

  document.getElementById("profile-name-header").textContent = data.username;
  document.getElementById("profile-name-display").textContent = data.username;
  document.getElementById("profile-handle-display").textContent =
    `@${data.username}`;
  document.getElementById("profile-bio-display").textContent =
    data.bio || "No bio.";

  const followingCount = data.following ? data.following.length : 0;
  const followersCount = data.followers ? data.followers.length : 0;
  document.getElementById("following-count").textContent = followingCount;
  document.getElementById("followers-count").textContent = followersCount;

  document.getElementById("following-stat").onclick = () =>
    openUserList("Following", data.following || []);
  document.getElementById("followers-stat").onclick = () =>
    openUserList("Followers", data.followers || []);

  const largeAvatar = document.querySelector(".profile-avatar-large");
  setAvatar(largeAvatar, data.photoURL, data.username);

  const actionBtn = document.getElementById("btn-profile-action");
  if (uid === currentUser.uid) {
    actionBtn.textContent = "Edit Profile";
    actionBtn.onclick = () => editProfileModal.classList.add("active");
  } else {
    const isFollowing = userData.following && userData.following.includes(uid);
    actionBtn.textContent = isFollowing ? "Unfollow" : "Follow";
    actionBtn.onclick = () => toggleFollow(uid, isFollowing);
  }

  // Load Post Count
  const postsQ = query(collection(db, "posts"), where("authorId", "==", uid));
  getDocs(postsQ).then((snap) => {
    document.getElementById("profile-post-count").textContent =
      `${snap.size} posts`;
  });

  loadProfileFeed("posts");
}

// Profile Tabs
tabProfilePosts.addEventListener("click", () => switchProfileTab("posts"));
tabProfileReplies.addEventListener("click", () => switchProfileTab("replies"));
tabProfileMedia.addEventListener("click", () => switchProfileTab("media"));
tabProfileLikes.addEventListener("click", () => switchProfileTab("likes"));

function switchProfileTab(tab) {
  document
    .querySelectorAll(".tabs .tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById(`tab-profile-${tab}`).classList.add("active");
  loadProfileFeed(tab);
}

async function loadProfileFeed(tab) {
  const profileFeed = document.getElementById("profile-feed-container");
  profileFeed.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  let q;
  if (tab === "posts") {
    q = query(
      collection(db, "posts"),
      where("authorId", "==", profileTargetUid),
      orderBy("timestamp", "desc"),
    );
  } else if (tab === "media") {
    q = query(
      collection(db, "posts"),
      where("authorId", "==", profileTargetUid),
      orderBy("timestamp", "desc"),
    );
  } else if (tab === "likes") {
    q = query(
      collection(db, "posts"),
      where("likes", "array-contains", profileTargetUid),
      orderBy("timestamp", "desc"),
    );
  } else if (tab === "replies") {
    // Collection Group Query for comments
    q = query(
      collectionGroup(db, "comments"),
      where("authorId", "==", profileTargetUid),
      orderBy("timestamp", "desc"),
    );
  }

  try {
    const snapshot = await getDocs(q);
    profileFeed.innerHTML = "";

    if (snapshot.empty) {
      profileFeed.innerHTML =
        '<p style="padding:20px; text-align:center; color:var(--text-secondary);">No content to show.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (tab === "media" && !data.imageUrl && !data.videoUrl) return;

      if (tab === "replies") {
        // Render Comment
        const div = document.createElement("div");
        div.className = "post"; // Reuse post styling
        div.innerHTML = `
                    <div class="post-avatar" style="background-image: url('${data.authorPhoto || ""}')"></div>
                    <div class="post-content">
                        <div class="post-header">
                            <span class="name">${data.authorName}</span>
                            <span class="time">· ${timeAgo(data.timestamp)}</span>
                        </div>
                        <div class="post-text">${data.text}</div>
                    </div>
                `;
        profileFeed.appendChild(div);
      } else {
        // Render Post
        profileFeed.appendChild(createPostElement(doc.id, data));
      }
    });
  } catch (e) {
    console.error(e);
    profileFeed.innerHTML =
      '<p style="padding:20px; text-align:center; color:var(--danger);">Error loading content. (Requires Firestore Index)</p>';
  }
}

async function toggleFollow(targetUid, isFollowing) {
  const myRef = doc(db, "users", currentUser.uid);
  const targetRef = doc(db, "users", targetUid);

  if (isFollowing) {
    await updateDoc(myRef, { following: arrayRemove(targetUid) });
    await updateDoc(targetRef, { followers: arrayRemove(currentUser.uid) });
  } else {
    await updateDoc(myRef, { following: arrayUnion(targetUid) });
    await updateDoc(targetRef, { followers: arrayUnion(currentUser.uid) });
    addNotification(targetUid, "follow");
  }
  openProfile(targetUid);
  userData = (await getDoc(myRef)).data();
  loadWhoToFollow(); // Refresh suggestions
}

// --- User List Modal ---
closeUserListBtn.addEventListener("click", () =>
  userListModal.classList.remove("active"),
);

async function openUserList(title, uids) {
  userListModal.classList.add("active");
  userListTitle.textContent = title;
  userListContainer.innerHTML =
    '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  if (!uids || uids.length === 0) {
    userListContainer.innerHTML =
      '<p style="text-align:center; padding:20px;">No users found.</p>';
    return;
  }

  const chunks = uids.slice(0, 10);
  userListContainer.innerHTML = "";
  for (const uid of chunks) {
    const d = await getDoc(doc(db, "users", uid));
    if (d.exists()) {
      const u = d.data();
      const div = document.createElement("div");
      div.className = "follow-item";
      div.innerHTML = `
                <div class="avatar placeholder-avatar" style="background-image: url('${u.photoURL || ""}')"></div>
                <div class="info"><h4>${u.username}</h4><span>@${u.username}</span></div>
                <button class="btn-sm">View</button>
            `;
      div.addEventListener("click", () => {
        userListModal.classList.remove("active");
        openProfile(uid);
      });
      userListContainer.appendChild(div);
    }
  }
}

// --- Notifications ---
async function addNotification(targetUid, type, postId = null) {
  await addDoc(collection(db, "notifications"), {
    recipientId: targetUid,
    senderId: currentUser.uid,
    senderName: userData.username,
    senderPhoto: currentUser.photoURL,
    type: type,
    postId: postId,
    timestamp: serverTimestamp(),
    read: false,
  });
}

function setupNotificationsListener() {
  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", currentUser.uid),
    orderBy("timestamp", "desc"),
    limit(20),
  );
  onSnapshot(q, (snapshot) => {
    notificationsList.innerHTML = "";
    snapshot.forEach((doc) => {
      const notif = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
                <div class="post-avatar" style="background-image: url('${notif.senderPhoto || ""}')"></div>
                <div class="post-content">
                    <p><strong>${notif.senderName}</strong> ${notif.type === "like" ? "liked your post" : "followed you"}</p>
                </div>
            `;
      notificationsList.appendChild(div);
    });
  });
}

// --- Real Trends ---
async function loadRealTrends() {
  trendsContainer.innerHTML =
    '<div class="loading-spinner-sm"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';

  const q = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(q);

  const hashtagCounts = {};
  snapshot.forEach((doc) => {
    const text = doc.data().text || "";
    const matches = text.match(/#\w+/g);
    if (matches) {
      matches.forEach((tag) => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    }
  });

  const sortedTrends = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  trendsContainer.innerHTML = "";
  if (sortedTrends.length === 0) {
    trendsContainer.innerHTML =
      '<p style="padding:10px; color:var(--text-secondary);">No trending topics yet.</p>';
  } else {
    sortedTrends.forEach(([tag, count]) => {
      const div = document.createElement("div");
      div.className = "trend-item";
      div.innerHTML = `
                <span class="meta">Trending</span>
                <h4>${tag}</h4>
                <span class="meta">${count} Posts</span>
            `;
      div.addEventListener("click", () => performSearch(tag));
      trendsContainer.appendChild(div);
    });
  }
}

// --- Navigation ---
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = e.currentTarget.getAttribute("data-page")
      ? e.currentTarget
      : e.currentTarget.closest("li, a");
    if (!target) return;

    const page = target.getAttribute("data-page");
    if (!page) return;

    navLinks.forEach((l) => l.classList.remove("active"));
    document
      .querySelectorAll(`[data-page="${page}"]`)
      .forEach((l) => l.classList.add("active"));

    views.forEach((view) => (view.style.display = "none"));
    const viewId = `view-${page === "profile" || page === "settings" ? page : page}`;
    const viewEl = document.getElementById(viewId);
    if (viewEl) viewEl.style.display = "block";

    if (page === "profile") openProfile(currentUser.uid);
    if (page === "explore") loadExplore();

    window.scrollTo(0, 0);
  });
});

async function loadExplore() {
  exploreGrid.innerHTML = "";
  exploreGrid.style.display = "block"; // Use block for feed style
  const q = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    exploreGrid.innerHTML =
      '<p style="text-align:center; padding:20px;">No posts found.</p>';
    return;
  }

  snapshot.forEach((doc) => {
    const post = doc.data();
    if (post.privacy === "public" || !post.privacy) {
      exploreGrid.appendChild(createPostElement(doc.id, post));
    }
  });
}

// --- Utils ---
function timeAgo(timestamp) {
  if (!timestamp) return "Just now";
  const date = timestamp.toDate();
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return seconds + "s";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h";
  return Math.floor(hours / 24) + "d";
}

async function loadWhoToFollow() {
  whoToFollowContainer.innerHTML = "";
  const q = query(collection(db, "users"), limit(10)); // Fetch more to filter
  const snapshot = await getDocs(q);
  let count = 0;

  snapshot.forEach((doc) => {
    if (count >= 5) return;
    if (doc.id === currentUser.uid) return;

    const isFollowing =
      userData.following && userData.following.includes(doc.id);
    if (isFollowing) return; // Exclude followed users

    const user = doc.data();
    const div = document.createElement("div");
    div.className = "follow-item";
    div.innerHTML = `
            <div class="avatar placeholder-avatar" style="background-image: url('${user.photoURL || ""}')"></div>
            <div class="info"><h4>${user.username}</h4><span>@${user.username}</span></div>
            <button class="btn-sm">Follow</button>
        `;
    div.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFollow(doc.id, false);
    });
    div.addEventListener("click", () => openProfile(doc.id));
    whoToFollowContainer.appendChild(div);
    count++;
  });

  if (count === 0) {
    whoToFollowContainer.innerHTML =
      '<p style="padding:10px; color:var(--text-secondary);">No new users to follow.</p>';
  }
}

// --- Edit Profile Logic ---
closeEditProfileBtn.addEventListener("click", () =>
  editProfileModal.classList.remove("active"),
);

avatarUploadInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await toBase64(file);
    editAvatarPreview.style.backgroundImage = `url(${base64})`;
    editAvatarPreview.textContent = "";
    editAvatarPreview.dataset.base64 = base64;
  }
});

editProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newName = document.getElementById("edit-name").value;
  const newBio = document.getElementById("edit-bio").value;
  const newAvatar = editAvatarPreview.dataset.base64;

  try {
    await updateProfile(currentUser, {
      displayName: newName,
      photoURL: newAvatar || currentUser.photoURL,
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      bio: newBio,
      photoURL: newAvatar || currentUser.photoURL,
    });

    // Batch update posts with new photo if changed
    if (newAvatar) {
      const batch = writeBatch(db);
      const postsQ = query(
        collection(db, "posts"),
        where("authorId", "==", currentUser.uid),
      );
      const postsSnap = await getDocs(postsQ);
      postsSnap.forEach((doc) => {
        batch.update(doc.ref, { authorPhoto: newAvatar });
      });
      await batch.commit();
    }

    editProfileModal.classList.remove("active");
    window.location.reload();
  } catch (e) {
    alert(e.message);
  }
});
