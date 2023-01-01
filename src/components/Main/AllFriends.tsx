import { DocumentData } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "../../main";
import { MenuTab } from "../App";
import { Status, statusInfo } from "../ProfilePicture";
import TooltipButton from "../TooltipButton";
import UserCard from "../UserCard";

interface Props{
  userData: DocumentData | undefined,
  setMenuTab: Function
}

export default function AllFriends({userData, setMenuTab}: Props){
  const [friendElements, setFriendElements] = useState<JSX.Element[]>([])
  
  const friends = userData?.friends
  const friendCards: JSX.Element[] = []
  let key = 0

  for(const friend of friends){
    const friendDoc = firestore.doc("users/" + friend)
    friendDoc.get().then(doc => {
      const infoText = statusInfo.get(Object.values(Status)[doc.data()?.status])
      if(!infoText) throw new Error("Unrecognized Status")

      friendCards.push(
        <UserCard profilePictureURL={doc.data()?.profilePictureURL} username={doc.data()?.username} usertag={doc.data()?.usertag} infoText={infoText} key={key++}>
          <TooltipButton tooltipText="Remove Friend">
            <i className="fa-solid fa-user-xmark" />  
          </TooltipButton>
        </UserCard>
      )
      if(friendCards.length == friends.length) setFriendElements(friendCards)
    })
  }

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
          <div className="pendingTabWrapper">
            <h1>ALL FRIENDS - {friendElements.length}</h1>
            {friendElements}
          </div>
        )
      }
    </main>
  )
}