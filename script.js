const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('loginBtn').addEventListener('click', googleSignIn);
document.getElementById('uploadBtn').addEventListener('click', uploadLink);

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('linkUpload').style.display = 'block';
        loadLinks();
    } else {
        document.getElementById('linkUpload').style.display = 'none';
    }
});

function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
        console.log("User signed in.");
    }).catch(error => {
        console.error("Error signing in: ", error);
    });
}

function uploadLink() {
    const link = document.getElementById('linkInput').value;
    const allowedEmails = document.getElementById('allowedEmailsInput').value.split(',').map(email => email.trim());
    const user = auth.currentUser;

    if (link && allowedEmails.length > 0 && user) {
        db.collection('userLinks').add({
            link: link,
            uid: user.uid,
            allowedEmails: allowedEmails,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(() => {
            console.log("Link uploaded successfully!");
            loadLinks();
        }).catch(error => {
            console.error("Error uploading link: ", error);
        });
    }
}

function loadLinks() {
    const user = auth.currentUser;
    db.collection('userLinks').where("uid", "==", user.uid).get().then(querySnapshot => {
        const linksList = document.getElementById('linksList');
        linksList.innerHTML = '';
        querySnapshot.forEach(doc => {
            const data = doc.data();
            linksList.innerHTML += `<div>${data.link} - Allowed Emails: ${data.allowedEmails.join(', ')}</div>`;
        });
    });
}
