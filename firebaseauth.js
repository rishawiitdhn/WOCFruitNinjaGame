import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgfisfCjUQuLekqjfdvRx8w9Qh4DyfD0E",
  authDomain: "fruit-ninja-game-6adad.firebaseapp.com",
  projectId: "fruit-ninja-game-6adad",
  storageBucket: "fruit-ninja-game-6adad.firebasestorage.app",
  messagingSenderId: "48500241643",
  appId: "1:48500241643:web:6ccd37d7cf591eb0087aae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


function showMessage(message, divId){
  let messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function(){
    messageDiv.style.opacity = 0;
  }, 5000)
}

let signUp = document.querySelector("#submitSignUp");
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  
  const auth = getAuth();
  const db = getFirestore();
  

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
  
    }
    showMessage("Account Created Successfully", "signUpMessage");
  const docRef = doc(db, "users", user.uid);
  localStorage.setItem('userData', userData);
  setDoc(docRef, userData)
  .then(() => {
    window.location.href = 'index.html';
  })
  .catch((error) => {
    console.error("Error writing document", error);
  })
  })
  .catch((error) =>{
    const errorCode = error.code;
    if(errorCode === 'auth/email-already-in-use'){
      showMessage("Email Address Already Exists !!!", "signUpMessage");
    }
    else{
      showMessage("Unable To Create User", "signUpMessage");
    }
  })
})

const signIn = document.getElementById("submitSignIn");
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login Successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = "main.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        showMessage('Account does not exist', 'signInMessage');
      } else if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Email or Password', 'signInMessage');
      } else {
        showMessage('Account Does Not Exist!', 'signInMessage');
      }
    })
  })