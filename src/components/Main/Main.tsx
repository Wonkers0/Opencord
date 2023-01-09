import { DocumentData, DocumentSnapshot } from "firebase/firestore"
import { firestore } from "../../main"
import { DocRef, MenuTab } from "../App"
import AddFriend from "./AddFriend"
import AllFriends from "./AllFriends"
import Chat from "./Chat"
import OnlineFriends from "./OnlineFriends"
import PendingRequests from "./PendingRequests"

interface MainProps{
  menuTab: MenuTab,
  userData: DocumentData | undefined
  userDataRef: DocRef | null,
  userID: string,
  setMenuTab: Function,
  viewChat: Function,
  currentChat: ChatData | null
}

export interface ChatData{
  id: string,
  isDM: boolean,
  chatterData?: DocumentData,
  chatterID?: string
}

export default function Main({menuTab, userData, userDataRef, userID, setMenuTab, viewChat, currentChat}: MainProps): JSX.Element{
  const menuTabs = new Map<MenuTab, JSX.Element>([
    [MenuTab.ONLINE_FRIENDS, <OnlineFriends userDataRef={userDataRef} setMenuTab={setMenuTab} userID={userID} viewChat={viewChat} />],
    [MenuTab.ADD_FRIEND, <AddFriend userData={userData} userDataRef={userDataRef} userID={userID} />],
    [MenuTab.PENDING_REQUESTS, <PendingRequests userData={userData} userDataRef={userDataRef} userID={userID} />],
    [MenuTab.ALL_FRIENDS, <AllFriends userData={userData} userDataRef={userDataRef} setMenuTab={setMenuTab} userID={userID} viewChat={viewChat} />],
    [MenuTab.DM, !currentChat ? (<></>) : (<Chat chatID={currentChat.id} userID={userID} chatterData={currentChat.chatterData} DM={currentChat.isDM} userData={userData} chatterID={currentChat.chatterID}/>)]
  ])

  const mapTab = menuTabs.get(menuTab)
  if(!mapTab) return (
    <main>
      <div className="mainWrapper">
        <img src="../src/assets/thinking-face.png" alt="" />
        <h1>Hmm... You weren't supposed to see this.<br/> Maybe shoot me an email at <a target="_blank" href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJqTfglNhTKFPlrVvMRRrWVKrrlprHPbknbxrRSHwvkwdJHwBnWMvDqqdGVzRrPSnszDrJB">opencord.dev@gmail.com</a></h1>
      </div>
    </main>
  )
  else return mapTab
}

export const removeFriend = (friendID: string, userID: string, userDataRef: DocRef): Promise<void | DocumentSnapshot<DocumentData>> => {
  const friendDoc = firestore.doc(`users/${friendID}`)
  friendDoc.get().then(doc => {
    let newFriends = doc.data()?.friends
    newFriends = newFriends.filter((id: string) => id != userID)

    friendDoc?.update({friends: newFriends})
  })

  return userDataRef?.get().then(doc => {
    const newFriends = doc.data()?.friends.filter((id: string) => id != friendID)

    userDataRef?.update({friends: newFriends})
  })
}