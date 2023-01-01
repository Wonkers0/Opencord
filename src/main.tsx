import ReactDOM from 'react-dom/client'
import App, { DocRef } from './components/App'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyAzYmCx74VqtrxQSXCcsxpj-cD3i9G54gI",
  authDomain: "opencord-f72ae.firebaseapp.com",
  projectId: "opencord-f72ae",
  storageBucket: "opencord-f72ae.appspot.com",
  messagingSenderId: "708719708777",
  appId: "1:708719708777:web:4f6b52eefb84319ecc70f8",
  measurementId: "G-D3S8XBRF4R"
})

export const auth = firebase.auth()
export const firestore = firebase.firestore()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
