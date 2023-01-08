import Sidebar from './Sidebar'
import "../styles.scss"
import "../fonts.scss"
import Navbar from './Navbar'
import DMList from './Chat/DMList'
import Main, { ChatData } from './Main/Main'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import { auth, firestore } from '../main'
import SignIn from './Sign In/SignIn'
import { doc, DocumentData, DocumentSnapshot } from 'firebase/firestore'
import firebase from 'firebase/compat'

export enum MenuTab{
  ONLINE_FRIENDS,
  ALL_FRIENDS,
  PENDING_REQUESTS,
  BLOCKED_USERS,
  ADD_FRIEND,
  DM,
}
interface Chat{
  DM: string | null,
  chatID: string
}

export interface UserData{
  chats: Chat[],
  friends: string[],
  incomingRequests: string[],
  outgoingRequests: string[],
  blocked: string[],
  userStatus: number,
  status: number,
  tag: string,
  username: string,
  profilePictureURL: string 
}

export type DocRef = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
export type DocSnapshot = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>

export default function App() {
  const [menuTab, setMenuTab] = useState(MenuTab.ONLINE_FRIENDS)
  const [userDataRef, setUserDataRef] = useState<DocRef | null>(null)
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth as any)
  const [currentChat, viewChat] = useState<ChatData | null>(null)

  const [userData, ignored, ignore] = useDocument(
    user ? doc(firestore, 'users', user.uid) : null
  )
  
  const establishRealtimeConnection = function(doc:DocSnapshot, docRef: DocRef) {
    console.log("Trying to establish realtime connection to database... (I am hacking into the mainframe)")
    const userStatus = doc.data()?.userStatus
    
    const isOfflineForDatabase = {
      status: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    }
    
    const isOnlineForDatabase = {
      status: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    }

    const isOnlineForFirestore = {
      status: userStatus ? userStatus : 0,
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    }
    
    firebase.database().ref('.info/connected').on('value', snapshot => {
      if(!snapshot.val()) return

      const userStatusDatabaseRef = firebase.database().ref('/status/' + user?.uid);
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
        userStatusDatabaseRef.set(isOnlineForDatabase);
        docRef.update(isOnlineForFirestore)
        setLoading(false)
      });
      console.log("Established connection to realtime database ✔ (I have hacked into the mainframe)")
    })
  }
  
  if(user && !userDataRef){
    const docRef = firestore.doc(`users/${user.uid}`) 
    setUserDataRef(docRef)

    docRef.get().then(doc => {
      console.log(user.uid + ' | ' + doc.exists)
      console.log(doc.data())
      if (!doc.exists) {
        docRef.set({
          chats: [],
          friends: [],
          incomingRequests: [],
          outgoingRequests: [],
          blocked: [],
          userStatus: 0,
          status: 0,
          tag: getNewUserTag(),
          username: user.displayName,
          profilePictureURL: user.photoURL
        }).then(() => establishRealtimeConnection(doc, docRef))
      }
      else establishRealtimeConnection(doc, docRef)
    })
  }

  if(menuTab != MenuTab.DM && currentChat) currentChat.id = ""

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
            <DMList setMenuTab={setMenuTab} viewChat={viewChat} currentChat={currentChat?.id} userData={userData?.data()} userID={user.uid} />
            <Main menuTab={menuTab} userData={userData?.data()} userDataRef={userDataRef} userID={user.uid} setMenuTab={setMenuTab} viewChat={viewChat} currentChat={currentChat}/>
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