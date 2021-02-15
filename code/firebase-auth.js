/*jshint esversion: 6 */

//Create an instance of the Google provider object:
var provider = new firebase.auth.GoogleAuthProvider();

//Authenticate with Firebase using the Google provider object.
firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    // Set username and profile picture
    $("#userPicture").attr("src", user.photoURL);
    $("#userName").text(user.displayName);
    $("#userEmail").text(user.email);

    console.info("Authenticated user UID:", user.uid);
    console.info("Authenticated user email:", user.email);

    userEmail = user.email;

  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

function googSignOut() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}
