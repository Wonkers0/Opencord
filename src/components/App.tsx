import Sidebar from './Sidebar'
import "../styles.scss"
import "../fonts.scss"
import Navbar from './Navbar'
import DMList from './DMList'
import Main from './Main/Main'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import { auth, firestore } from '../main'
import SignIn from './SignIn'
import { doc } from 'firebase/firestore'
import SignInForm from './SignInForm'
import firebase from 'firebase/compat'

export enum MenuTab{
  ONLINE_FRIENDS,
  ALL_FRIENDS,
  PENDING_REQUESTS,
  BLOCKED_USERS,
  ADD_FRIEND,
  DM,
}

export type DocRef = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>

export default function App() {
  const [menuTab, setMenuTab] = useState(MenuTab.ONLINE_FRIENDS)
  const [userDataRef, setUserDataRef] = useState<DocRef | null>(null)
  const [user] = useAuthState(auth as any)

  const [userData, loading, error] = useDocument(
    user ? doc(firestore, 'users', user.uid) : null
  )
  
  if(user && !userDataRef){
    const docRef = firestore.doc(`users/${user.uid}`) 
    setUserDataRef(docRef)

    docRef.get().then(doc => {
      if (!doc.exists) {
        docRef.set({
          DMs: [],
          friends: [],
          incomingRequests: [],
          outgoingRequests: [],
          blocked: [],
          status: 0,
          tag: getNewUserTag(),
          username: user.displayName,
          profilePictureURL: user.photoURL
        })
      }
    })

    firebase.database().ref('.info/connected').on('value', snapshot => {
      if(!snapshot.val()) return 

      const userStatusDatabaseRef = firebase.database().ref('/status/' + user.uid);
      userStatusDatabaseRef.onDisconnect().set({online: false}).then(function() {
        userStatusDatabaseRef.set({online: true});
      });
    })
  }



  if(loading) return (
    <div className="loadingWrapper">
      <video src="../src/assets/loading.mp4" autoPlay muted loop />
      <h1>LOADING...</h1>
    </div>
  )
  return (
    <div>
      {
        user ? 
        (
          <>
            <Sidebar />
            <Navbar menuTab={menuTab} setMenuTab={setMenuTab} userID={user.uid} />
            <DMList userData={userData?.data()} />
            <Main menuTab={menuTab} userData={userData?.data()} userDataRef={userDataRef} userID={user.uid} setMenuTab={setMenuTab} />
          </>
        ) : (<SignIn />)
      }
    </div>
  )
}

const getNewUserTag = () => {
  let tag = "#"
  for(let i = 0; i < 4; i++) tag += Math.floor(Math.random() * 9.999)

  return tag
}