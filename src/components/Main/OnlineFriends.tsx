import { DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"
import { firestore } from "../../main"
import { DocRef } from "../App"
import { statusInfo, Status } from "../ProfilePicture"
import TooltipButton from "../TooltipButton"
import UserCard from "../UserCard"
import { removeFriend } from "./Main"

interface Props{
  userData: DocumentData | undefined,
  userDataRef: DocRef | null
}

export default function OnlineFriends({userData, userDataRef}: Props){
  const [friendElements, setFriendElements] = useState<JSX.Element[]>([])

  let refreshTab = () => {
    userDataRef?.get().then(doc => {
      const friends = doc.data()?.friends
      const friendCards: JSX.Element[] = []
      let key = 0
      let friendsEvaluated = 0
  
      if(friends.length == 0){
        setFriendElements([])
        return
      }
  
      for(const friend of friends){
        const friendDoc = firestore.doc("users/" + friend)
        friendDoc.get().then(doc => {
          const infoText = statusInfo.get(Object.values(Status)[doc.data()?.status])
          if(!infoText) throw new Error("Unrecognized Status")
          
          friendsEvaluated++
          if(doc.data()?.status == 3) return
    
          friendCards.push(
            <UserCard profilePictureURL={doc.data()?.profilePictureURL} username={doc.data()?.username} usertag={doc.data()?.usertag} infoText={infoText} key={key++}>
              <TooltipButton tooltipText="Remove Friend" onClick={() => handleClick(friend)}>
                <i className="fa-solid fa-user-xmark" />  
              </TooltipButton>
            </UserCard>
          )
          if(friendsEvaluated == friends.length) setFriendElements(friendCards)
        })
      }
  
      console.log("Refreshing Online Friends...")
    })
  }

  useEffect(() => {
    refreshTab()
    let id = setInterval(refreshTab, 30 * 1000)

    return () => clearInterval(id)
  }, [])

  const handleClick = (friendID: string) => {
    if(!userDataRef) return

    removeFriend(friendID, userData?.id, userDataRef).then(() => refreshTab())
  }

  return (
    <main>
      {friendElements.length == 0 ? 
        (
          <div className="mainWrapper">
            <img src="../src/assets/noneOnline.svg" alt="Lonely Bumpus" />
            <h1>No one's around to play with <span id="bumpus" />umpus.</h1>
          </div>
        ) : (
          <div className="friendsTabWrapper">
            <header>
              <h1>ONLINE - {friendElements.length}</h1>
              <TooltipButton tooltipText="Updates every 30s">
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