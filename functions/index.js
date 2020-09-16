const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const config = {
  apiKey: "AIzaSyCY4OvHZFZvQckFtqcePZ2lZfY2ODcAnLQ",
  authDomain: "socialape-ba99e.firebaseapp.com",
  databaseURL: "https://socialape-ba99e.firebaseio.com",
  projectId: "socialape-ba99e",
  storageBucket: "socialape-ba99e.appspot.com",
  messagingSenderId: "761967863891",
  appId: "1:761967863891:web:eb1770742855162ec3fea6"
};

const firebase = require('firebase');
firebase.initializeApp(config);

// Gets all Screams
app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
})

// Creates a Scream
app.post('/scream', (req, res) => {

  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin.firestore()
    .collection('screams')
    .add(newScream)
    .then(doc => {
      res.json({
        message: `document ${doc.id} created successfully`
      })
    })
    .catch(err => {
      res.status(500).json({
        error: 'something went wrong'
      });
      console.error(err);
    })
})

// Signup route
app.post('/signup', (req,res) => {
  const newUser = {
    email:req.body.email,
    password:req.body.password,
    confirmPassword:req.body.email,
    userHandle:req.body.userHandle
  }

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res.status(201).json({message: `user ${data.user.uid} signed up successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code});
    });
});

// https://baseurl.com/api
exports.api = functions.region('europe-west1').https.onRequest(app);