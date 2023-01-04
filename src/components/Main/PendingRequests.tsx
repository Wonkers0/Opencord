import { DocumentData } from "firebase/firestore"
import { useState } from "react"
import { firestore } from "../../main"
import { DocRef } from "../App"
import Linebreak from "../Linebreak"
import TooltipButton from "../TooltipButton"
import UserCard from "../UserCard"

interface Props{
  userData: DocumentData | undefined
  userDataRef: DocRef | null,
  userID: string
}

export default function PendingRequests({userData, userDataRef, userID}: Props){
  const requests = userData?.incomingRequests.length + userData?.outgoingRequests.length
  const incomingRequests = userData?.incomingRequests 
  const outgoingRequests = userData?.outgoingRequests
  const requestObjects: JSX.Element[] = []
  let key = 0

  const [pendingRequests, setPendingRequests] = useState<JSX.Element[]>([])


  const acceptRequest = (requestUserID: string) => {
    const newIncomingRequests = incomingRequests.filter((el: string) => {el != requestUserID})
    const requestDoc = firestore.doc(`users/${requestUserID}`)
    requestDoc.get().then(doc => {
      const newOutcomingRequests = doc.data()?.outgoingRequests.filter((el: string) => {el != userID})
      const newFriends = doc.data()?.friends
      newFriends.push(userID)

      requestDoc.update({
        outgoingRequests: newOutcomingRequests,
        friends: newFriends
      })
    })

    userDataRef?.get().then(doc => {
      const newFriends = doc.data()?.friends
      newFriends.push(requestUserID)

      userDataRef?.update({
        incomingRequests: newIncomingRequests,
        friends: newFriends
      })
    })
  }

  const rejectRequest = (requestUserID: string) => {
    const newRequests = incomingRequests.filter((el: string) => {el != requestUserID})
    
    userDataRef?.update({
      incomingRequests: newRequests
    })
  }

  if(pendingRequests.length != requests){
    for(const request of incomingRequests){
      const requestDoc = firestore.doc("users/" + request)
      requestDoc.get().then(doc => {
        const docData = doc.data()
      
        const profilePictureURL = docData?.profilePictureURL
        const username = docData?.username
        const usertag = docData?.usertag
  
        requestObjects.push(
          <UserCard profilePictureURL={profilePictureURL} username={username} usertag={usertag} infoText="Incoming Friend Request" key={key++}>
            <TooltipButton tooltipText="Accept" className="accept" onClick={() => acceptRequest(request)}>
              <i className="fa-solid fa-check"></i>
            </TooltipButton>
            <TooltipButton tooltipText="Ignore" className="deny" onClick={() => rejectRequest(request)}>
              <svg aria-hidden="true" role="img" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
            </TooltipButton>
          </UserCard>
        )
  
        if(requestObjects.length == requests) setPendingRequests(requestObjects)
      })
    }
  
    for(const request of outgoingRequests){
      const requestDoc = firestore.doc("users/" + request)
      requestDoc.get().then(doc => {
        const docData = doc.data()
        if(!docData) return (<></>)
  
        const profilePictureURL = docData.profilePictureURL
        const username = docData.username
        const usertag = docData.usertag
  
        requestObjects.push(
          <UserCard profilePictureURL={profilePictureURL} username={username} usertag={usertag} infoText="Outgoing Friend Request" key={key++}>
            <TooltipButton tooltipText="Cancel" className="deny">
              <svg aria-hidden="true" role="img" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
            </TooltipButton>
          </UserCard>
        )
  
        if(requestObjects.length == requests) setPendingRequests(requestObjects)
      })
    }
  }

  return (
    <main>
      {requests == 0 ? (
        <div className="mainWrapper">
          <img src="../src/assets/nonePending.svg" alt="Bumpus at a Crossroads" />
          <h1>There are no pending requests. Here's <span id="bumpus"/>umpus for now.</h1>
        </div> 
      ) : (
        <div className="pendingTabWrapper">
          <h1>PENDING - {requests}</h1>
          <Linebreak style={{width: "100%"}} heightPx={1}/>
          <div className="requestsWrapper">
            {pendingRequests}
          </div>
        </div>
      )}
    </main>
  )
}