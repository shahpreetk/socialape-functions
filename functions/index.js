const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/FBAuth');
const {getAllScreams, postOneScream, getScream, commentOnScream, likeScream, unlikeScream} = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams); //gets all screams
app.post('/scream', FBAuth, postOneScream); //creates a scream
app.get('/scream/:screamId', getScream); //gets a particular scream
app.post('/scream/:screamId/comment', FBAuth, commentOnScream); //posts comment on a scream
app.get('/scream/:screamId/like', FBAuth, likeScream); //like scream
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream); //unlike scream

// Authentication/Users routes
app.post('/signup', signup); //signup
app.post('/login', login); //login

// Users routes
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

// https://baseurl.com/api
exports.api = functions.region('europe-west1').https.onRequest(app);