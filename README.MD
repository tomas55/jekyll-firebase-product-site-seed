# Purpose
Setup a simple one page product site with an email registration running on Google firebase and sending emails using Gmail, plus required cookie consent and privacy page for complience.
> **Note:** Email sending is configured for service accounts which work with GSuite only.   

# Components
1. Jekyll static website - frontend for the product single page using [HTML5 UP Spectral theme](http://html5up.net) and adapted from https://github.com/arkadianriver/spectral.
2. Cookie consent generated from https://cookieconsent.insites.com
3. Firebase database for storing signup emails using Firebase sdk on website.  
4. Firebase functions: one to send confrimation emails on added signup; the second handles confirmation links.
5. [Nodemailer](http://nodemailer.com) and [Email templates](https://email-templates.js.org) are used to send confirmation mails via Gmail.

# Setup 
## Firebase project 
1. Create a new Firebase project in https://console.firebase.google.com or use an egzisting one
2. Configure domain for your product (optional)
3. Create Firebase database and add root object


## Jekyll site configuration

1. Configure jekyll:
* `_config.yml` - main configuration
* `jekyll/_data/features.yml` - feature blocks configuration
* `jekyll/_daya/spotlights.yml` - spotlights configuration  
Update `index.html` or layouts to remove unused parts

2. Go to Firebase project settings and setup web access to database https://console.firebase.google.com/u/0/project/race-league/settings/general/
4. Create to `/jekyll/js/firebase.js` and copy configuration to the file:
```
 var firebaseConfig = {
    apiKey: "xxxxxxxxxxxxxxxxx",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "00000000000000000",
    appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  };
```
add a collection name for signups like this: 
```
 var config = {
      signupCollection: 'signups'
  };
```
5. Update privacy policy page `jekyll/privacy.md` (optional)
6. run `jekyll build` to build or `jekyll serve` to test locally

## Confirgure email sending using Google account

1. Generate key for a default service account from Firebase console:
_settings > Project settings > Service accounts_ and click *Generate new private key*
2. Create `functions/src/service-key.json` file and copy private key contents into it
3. Go to *Manage service account permissions*
5. Select a service account to which you have generated the key and click *edit*. Enable *Domain wide delegation*
6. Enable gmail api for the project in Google cloud console https://console.cloud.google.com
7. Setup cloud functions environment parameters of a gmail account (user) which used to send emails and a sender email to be shown to receipients:
`firebase functions:config:set gmail.user="my-account@domain.com" gmail.sender="Sender Name <sender@domain.com>"`
8. If your sender email is different than one of the user, set sending  alias in *Gmail > Settings > Accounts > Send as email*
9. You need to give permissions to the service account in GSuite admin. Go to *Google Admin > Security > Settings > Advanced Settings > Manage API client access*, enter Service Account Id (numbers) and API scopes - https://mail.google.com/
10. Change email templates to your liking in `functions/src/emails/confirm` folder.

# Deployment

Run:
```
jekyll build

firebase deploy

```


# Licenses

All code, but Jekyll templates are distributed under [MIT license](../functions/LICENCE). Jekyll templates are distributed under [CC v.3](../jekyll/LICENSE.txt)
