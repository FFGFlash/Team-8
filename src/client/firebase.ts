import { initializeApp } from 'firebase/app'

export const firebaseErrors: Record<string, string> = {
  'auth/email-already-exists':
    'Looks like we already have a user with that email address.',
  'auth/internal-error':
    "Looks like we're having trouble with our authentication servers, please try again.",
  'auth/user-not-found':
    "We couldn't find a user with those credentials, please try again."
}

export const firebaseConfig = {
  apiKey: 'AIzaSyCZ5wl-H7bOMPzhs69yhheprWO7XBDd8AU',
  authDomain: 'team-8-4f521.firebaseapp.com',
  projectId: 'team-8-4f521',
  storageBucket: 'team-8-4f521.appspot.com',
  messagingSenderId: '655979947953',
  appId: '1:655979947953:web:d004a9ac931dc0e2d67f90',
  measurementId: 'G-98CY10B8DH'
}

initializeApp(firebaseConfig)
