// FirebaseUI config.
 var uiConfig = {
   signInSuccessUrl: '<url-to-redirect-to-on-success>',
   signInOptions: [
     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
     firebase.auth.EmailAuthProvider.PROVIDER_ID
   ],
   // tosUrl and privacyPolicyUrl accept either url string or a callback
   // function.
   // Terms of service url/callback.
   tosUrl: '<your-tos-url>',
   // Privacy policy url/callback.
   privacyPolicyUrl: function() {
     window.location.assign('<your-privacy-policy-url>');
   }
 };

 // Initialize the FirebaseUI Widget using Firebase.
 var ui = new firebaseui.auth.AuthUI(firebase.auth());
 // The start method will wait until the DOM is loaded.
 ui.start('#firebaseui-auth-container', uiConfig);

 //auth
 var provider = new firebase.auth.GoogleAuthProvider();
 firebase.auth()
 .signInWithPopup(provider)
 .then((result) => {
   /** @type {firebase.auth.OAuthCredential} */
   var credential = result.credential;

   // This gives you a Google Access Token. You can use it to access the Google API.
   var token = credential.accessToken;
   // The signed-in user info.
   var user = result.user;
   // ...
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
