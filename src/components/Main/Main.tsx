import { DocumentData, doc } from "firebase/firestore"
import { useEffect, useRef } from "react"
import { firestore } from "../../main"
import { DocRef, MenuTab } from "../App"
import Linebreak from "../Linebreak"
import AddFriend from "./AddFriend"
import AllFriends from "./AllFriends"
import OnlineFriends from "./OnlineFriends"
import PendingRequests from "./PendingRequests"

interface MainProps{
  menuTab: MenuTab,
  userData: DocumentData | undefined
  userDataRef: DocRef | null,
  userID: string,
  setMenuTab: Function
}

export default function Main({menuTab, userData, userDataRef, userID, setMenuTab}: MainProps): JSX.Element{
  const menuTabs = new Map<MenuTab, JSX.Element>([
    [MenuTab.ONLINE_FRIENDS, <OnlineFriends />],
    [MenuTab.ADD_FRIEND, <AddFriend userData={userData} userDataRef={userDataRef} userID={userID} />],
    [MenuTab.PENDING_REQUESTS, <PendingRequests userData={userData} userDataRef={userDataRef} userID={userID} />],
    [MenuTab.ALL_FRIENDS, <AllFriends userData={userData} setMenuTab={setMenuTab} />]
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