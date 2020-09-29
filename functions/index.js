const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/FBAuth');
const {getAllScreams, postOneScream} = require('./handlers/screams');
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');

// Scream routes (gets all screams, creates a scream)
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// Authentication/Users routes (signup, login)
app.post('/signup', signup);
app.post('/login', login);

// Users routes
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

// https://baseurl.com/api
exports.api = functions.region('europe-west1').https.onRequest(app);