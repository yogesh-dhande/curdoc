# Pysheets webapp
### About
This projects contains two main components, the web app (frontend code portion) and the main 
cloud functions which acts as the backend service. 
Code for the web app could be found under folder `src` and code for the functions could be found 
under folder `functions`.
```
root - directory
    \src - main web app code base - front end code base
    \functions - main cloud functions code base
```

## Web App
### Install dependencies of Web app
Once the code is cloned, the stable version could be found in `master` branch. 

The web app as well as cloud functions require setting up environment variables to successfully 
run the project. For that, create two env files (`.env` and `.env.prod`) in the `root directory` with the following properties and replace the keys 
with correct config values
```
#firebase
VUE_APP_FIREBASE_CONFIG_API_KEY=your-firebase-project-api-key
VUE_APP_FIREBASE_CONFIG_AUTH_DOMAIN=your-firebase-project-auth-domain
VUE_APP_FIREBASE_CONFIG_PROJECT_ID=your-firebase-project-id
VUE_APP_FIREBASE_CONFIG_DATABASE_URL=your-firebase-project-database-url
```

After setting up the env configs, to build the web app run,
```
npm install

or 

yarn install
```
to install all the dependencies.

### Run the Web app locally
Once all the dependencies are installed, to see the web app in action, execute the following command 
to run the web app locally
```
from the root directory

yarn serve
```
which will up a local instance pointed to port 8080, `http://localhost:8080` 

### Build Web app
Once a change is done to the web app code base, you could see it locally via the above command `yarn serve`,
but to make a production ready version, execute
```
npm run build
```

### Deploy Web app to firebase hosting
Once the code is ready to be deployed to firebase, make sure your firebase project is ready.

Presteps (one time firebase project specific commands, once you setup the following for a specific project doesn't need to do it for every clone)
- check whether you have setup firebase hosting in your project
```
firebase init hosting 

for the questions in the setup process,
- What do you want to use as your public directory - dist
- Configure as a single-page app (rewrite all urls to /index.html) - y
```
then select a firebase project and select folder `dist` as the folder to serve static files from.

- Check whether you have already logged into your firebase project via your firebase project email address
```
firebase login 
```
which will return an email address you have logged into firebase, or it will redirect to a login page

- Setup firebase project
```
firebase use --add

- select the project from the cli dropdown
- What alias do you want to use for this project - give an alies (eg: dev or prod)
```

### Deploy 
Once the above steps are done, use the following command to deploy the production build to your firebase hosting
```
firebase deploy
```

## Cloud Functions
### Deploy cloud functions

Go to `index.js` file in functions directory to view the functions being used. These are serverless functions
which needs to be deployed to the same firebase project. Once a new endpoint is added or update an existing one,
execute the following command to deploy the changes to firebase functions,

Presteps (one time firebase project specific commands, once you setup the following for a specific project doesn't need to do it for every clone)
- check whether you have setup firebase functions in your project
```
firebase init functions

for the questions in the setup process,
- What language would you like to use to write Cloud Functions - JS
- Do you want to use ESLint to catch probable bugs and enforce style - y
```

- Setup firebase project (if you haven't already done this in deploying hosting step)
```
firebase use --add

- select the project from the cli dropdown
- What alias do you want to use for this project - give an alies (eg: dev or prod)
```

### Deploy
Once the above steps are done, use the following command to deploy functions to firebase
```
- cd functions
- firebase deploy --only functions
```

### Summary
Once for every fresh clone, execute the following steps which is described above in detail,
```
1. Setup enviroment configs
2. npm install from root direcory - install dependencies for web app
3. npm install from functions directory - install dependencies for functions
4. firebase use --add - add firebase project
5. yarn serve - to run the web app locally
6. npm run build - to setup production build for web app
7. firebase deploy - to deploy both web app and functions
   - to only deploy functions - firebase deploy --only functions
   - to only deploy web app - firebase deploy --only hosting
```

## Common commands which would require
### Build  Web app
```
npm run build
```

### Test locally
```
firebase serve
```

### Deploy to firebase hosting
```
firebase deploy
```

### Deploy to firebase functions
```
firebase deploy --only functions
```
