const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/FBAuth');
const {
    db
} = require('./util/admin')
const {
    getAllScreams,
    postOneScream,
    getScream,
    deleteScream,
    commentOnScream,
    likeScream,
    unlikeScream
} = require('./handlers/screams');
const {
    signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser
} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams); //gets all screams
app.post('/scream', FBAuth, postOneScream); //creates a scream
app.get('/scream/:screamId', getScream); //gets a particular scream
app.delete('/scream/:screamId', FBAuth, deleteScream); //deletes a scream
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

exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}').onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
        .then(doc => {
            if(doc.exists) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    screamId: doc.id
                })
            }
        })
        .then(()=>{
            return;
        })
        .catch(err => {
            console.error(err)
            return;
        })
})

exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}').onCreate(snapshot => {
    db.doc(`/screams/${snapshot.data().screamId}`).get()
        .then(doc => {
            if(doc.exists) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    screamId: doc.id
                })
            }
        })
        .then(()=>{
            return;
        })
        .catch(err => {
            console.error(err)
            return;
        })
})