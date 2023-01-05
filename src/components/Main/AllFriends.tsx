import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../main";
import { DocRef, MenuTab } from "../App";
import { Status, statusInfo } from "../ProfilePicture";
import TooltipButton from "../TooltipButton";
import UserCard from "../UserCard";
import { removeFriend } from "./Main";

interface Props{
  userData: DocumentData | undefined,
  userDataRef: DocRef | null,
  setMenuTab: Function
}

export default function AllFriends({userData, userDataRef, setMenuTab}: Props){
  const [friendElements, setFriendElements] = useState<JSX.Element[]>([])

  const refreshTab = () => {
    userDataRef?.get().then(doc => {
      const friends = doc.data()?.friends
      const friendCards: JSX.Element[] = []
      let key = 0
  
      if(friends.length == 0){
        setFriendElements([])
        return
      }
    
      for(const friend of friends){
        const friendDoc = firestore.doc("users/" + friend)
        friendDoc.get().then(doc => {
          const infoText = statusInfo.get(Object.values(Status)[doc.data()?.status])
          if(!infoText) throw new Error("Unrecognized Status")
    
          friendCards.push(
            <UserCard profilePictureURL={doc.data()?.profilePictureURL} username={doc.data()?.username} usertag={doc.data()?.usertag} infoText={infoText} key={key++}>
              <TooltipButton tooltipText="Message">
                <i className="fa-solid fa-message"></i>
              </TooltipButton>
              <TooltipButton tooltipText="Remove Friend" onClick={() => handleClick(friend)}>
                <i className="fa-solid fa-user-xmark" />
              </TooltipButton>
            </UserCard>
          )
          if(friendCards.length == friends.length) setFriendElements(friendCards)
        })
      }
    })

    console.log("Refreshing All Friends...")
  }

  const handleClick = (friendID: string) => {
    if(!userDataRef) return

    removeFriend(friendID, userData?.id, userDataRef).then(() => refreshTab())
  }

  useEffect(() => {
    refreshTab()
    const id = setInterval(refreshTab, 60 * 1000)
    
    return () => clearInterval(id)
  }, [])

  return (
    <main>
      {
        userData?.friends.length == 0 ?
        (
          <div className="mainWrapper">
            <img src="../src/assets/noFriends.svg" alt="Lonely Bumpus" />
            <h1><span id="bumpus"/>umpus is waiting on friends. You don't have to though!</h1>
            <button className="blurpleBtn" style={{height: "2.5rem", marginTop: "-1.5rem"}} onClick={() => setMenuTab(MenuTab.ADD_FRIEND)}>Add Friend</button>
          </div>
        ) :
        (
          <div className="friendsTabWrapper">
            <header>
              <h1>ALL FRIENDS - {friendElements.length}</h1>
              <TooltipButton tooltipText="Updates every minute">
                <i className="fa-regular fa-circle-question refreshDisclaimer"></i>
              </TooltipButton>
            </header>
            {friendElements}
          </div>
        )
      }
    </main>
  )
}