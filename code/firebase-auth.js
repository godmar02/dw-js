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

   console.info("signed in:", user);
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
