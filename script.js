let signUpDiv = document.querySelector("#signUpDiv");
let signInDiv = document.querySelector("#signInDiv");
let signInBtn = document.querySelector("#signInBtn");
let signUpBtn = document.querySelector("#signUpBtn");

signUpBtn.addEventListener('click', () => {
    signInDiv.style.display = "none";
    signUpDiv.style.display = "block";
});
signInBtn.addEventListener('click', () => {
    signUpDiv.style.display = "none";
    signInDiv.style.display = "block";
});