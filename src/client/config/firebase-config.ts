import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const appConfig = {
    apiKey: "AIzaSyCZatCE-zRUEs8hlsSDkXTB-0DdHtzSrcY",
    authDomain: "team-8-dc8ad.firebaseapp.com",
    projectId: "team-8-dc8ad",
    storageBucket: "team-8-dc8ad.appspot.com",
    messagingSenderId: "927870972729",
    appId: "1:927870972729:web:e7ef83fa077c31fe9eaee8",
    measurementId: "G-WVNB8FSJ2X"
  }


const app = initializeApp(appConfig)
const analytics = getAnalytics(app)
