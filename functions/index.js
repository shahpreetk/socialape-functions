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

const db = admin.firestore();

// Gets all Screams
app.get('/screams', (req, res) => {
  db
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

  db
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

// Function Checking if email is valid or not
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
}
// Function Checking if string is empty or not
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}

// Signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle
  }

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = 'Please fill it in'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Please fill a valid Email address'
  }

  if (isEmpty(newUser.password)) errors.password = 'Please fill it in';
  if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
  if (isEmpty(newUser.userHandle)) errors.userHandle = 'Please fill it in';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          userHandle: 'this handle is already taken'
        });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idtoken => {
      token = idtoken;
      const userCredentials = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.userHandle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({
        token
      });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({
          email: 'Email is already in use'
        })
      } else {
        return res.status(500).json({
          error: err.code
        });
      }
    });
});

// Login route
app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors = {};

  if(isEmpty(user.email)) errors.email = 'Please fill it in';
  if(isEmpty(user.password)) errors.password = 'Please fill it in';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({token});
    })
    .catch(err => {
      console.error(err);
      if(err.code === "auth/wrong-password") return res.status(403).json({general: 'Wrong credentials, please try again'});
      else return res.status(500).json({error: err.code});
    });
});

// https://baseurl.com/api
exports.api = functions.region('europe-west1').https.onRequest(app);