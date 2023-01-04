import Sidebar from './Sidebar'
import "../styles.scss"
import "../fonts.scss"
import Navbar from './Navbar'
import DMList from './DMList'
import Main from './Main/Main'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import { auth, firestore } from '../main'
import SignIn from './SignIn'
import { doc } from 'firebase/firestore'
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
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth as any)

  const [userData, ignored, ignore] = useDocument(
    user ? doc(firestore, 'users', user.uid) : null
  )
  console.log("Funny app ig")
  
  if(user && !userDataRef){
    console.log("Ok now am reading")
    const docRef = firestore.doc(`users/${user.uid}`) 
    setUserDataRef(docRef)
    let userStatus = 0

    docRef.get().then(doc => {
      console.log(doc.data())
      if (!doc.exists) {
        docRef.set({
          DMs: [],
          friends: [],
          incomingRequests: [],
          outgoingRequests: [],
          blocked: [],
          userStatus: 0,
          status: 0,
          tag: getNewUserTag(),
          username: user.displayName,
          profilePictureURL: user.photoURL
        })
      }
      userStatus = doc.data()?.userStatus
    
      const isOfflineForDatabase = {
        status: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      }
      
      const isOnlineForDatabase = {
        status: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      }
  
      const isOnlineForFirestore = {
        status: userStatus,
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      }
      
      firebase.database().ref('.info/connected').on('value', snapshot => {
        if(!snapshot.val()) return
  
        const userStatusDatabaseRef = firebase.database().ref('/status/' + user.uid);
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
          userStatusDatabaseRef.set(isOnlineForDatabase);
          docRef.update(isOnlineForFirestore)
          setLoading(false)
        });
      })
    })
  }



  if(loading && user) return (
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