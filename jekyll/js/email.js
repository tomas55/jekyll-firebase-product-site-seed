

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var dbRef = firebase.database();

  document.getElementById('signupForm').addEventListener('submit', submitForm)

  function submitForm(e) {
    e.preventDefault();
    var email = getInputVal('email');
    
    saveSignup(email, true);
  }

  function getInputVal(id) {
    return document.getElementById(id).value;
  }

  function saveSignup(email, contactConsent) {
    dbRef.ref(config.signupCollection + '/' + email.replace(/\./g, '%2E')).set({
      email: email,
      contact_consent: contactConsent,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }, function(err) {
      var regContainer = document.getElementById('registration');
      if (err) {
        regContainer.innerHTML = '<p>Something went wrong, please, try again later.</p>';
      } else {        
        regContainer.innerHTML = '<h2>Thank you for joining!</h2>';
      }
    });
    gtag('event', 'sign_up');
  }