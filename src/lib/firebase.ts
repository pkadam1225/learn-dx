import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCuObzaIkOPJ5ola4nluouPZApitOVmFq8",
  authDomain: "learndx-8c016.firebaseapp.com",
  projectId: "learndx-8c016",
  storageBucket: "learndx-8c016.firebasestorage.app",
  messagingSenderId: "679049588531",
  appId: "1:679049588531:web:7517fe749d339db8c35846",
  measurementId: "G-S9BP9E2DQB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const googleSignIn = () => signInWithPopup(auth, provider);
export const googleSignOut = () => signOut(auth);
export const watchAuth = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb);