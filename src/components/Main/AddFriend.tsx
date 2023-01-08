import { DocumentData } from "firebase/firestore"
import { useEffect, useRef } from "react"
import { firestore } from "../../main"
import { DocRef } from "../App"
import Linebreak from "../Linebreak"

interface Props{
  userData: DocumentData | undefined
  userDataRef: DocRef | null,
  userID: string
}

export default function AddFriend({userData, userDataRef, userID}: Props){
  const acceptRequest = (requestUserID: string, incomingRequests: string[]) => {
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

  const handleFocus = () => {reqInputWrapper.current?.classList.add("selected")}
  const handleUnfocus = () => {reqInputWrapper.current?.classList.remove("selected")}
  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    reqInputWrapper.current?.classList.remove("error", "success")
    errorHeading.current?.classList.remove("success")
    if(errorHeading.current) errorHeading.current.style.display = "none"

    if(event.currentTarget.value == "") reqButton.current?.setAttribute("disabled", "true")
    else reqButton.current?.removeAttribute("disabled")
  }
  

  const reqInputWrapper = useRef<HTMLDivElement>(null)
  const reqInput = useRef<HTMLInputElement>(null)
  const reqButton = useRef<HTMLButtonElement>(null)
  const errorHeading = useRef<HTMLHeadingElement>(null)
  
  const registerError = (errorMsg: string) => {
    if(!errorHeading.current) return

    reqInputWrapper.current?.classList.add("error")
    errorHeading.current.innerText = errorMsg
    errorHeading.current.style.display = "block"
  }

  const addFriend = () => {
    if(reqInput.current?.value == null || !userData || !userDataRef){
      registerError("Something went wrong. Please try again later.")
      return
    }
    
    const [username, tag] = reqInput.current?.value.split('#')
    if(username == userData.username && `#${tag}` == userData.tag){
      registerError("Really? ಠ_ಠ")
      return
    }

    const query = firestore.collection("users").where("username", "==", username).where("tag", "==", `#${tag}`)
    query.get().then(snapshot => {
      if(snapshot.docs.length == 0){
        registerError("Hm, user not found. Double check that the capitalization, spelling, any spaces, and numbers are correct.")
        return
      }

      const doc = snapshot.docs[0]
       
      if(doc.data()?.outgoingRequests.includes(userID)){
        acceptRequest(doc.id, userData?.incomingRequests)
        return
      }

      if(doc.data()?.friends.includes(userID)){
        registerError("You're already friends with that user!")
        return
      }
      
      let friendRequests = doc.data().incomingRequests
      if(!friendRequests.includes(userID)){
        friendRequests.push(userID)
        let outgoingRequests = userData.outgoingRequests
        if(!outgoingRequests.includes(doc.id)) outgoingRequests.push(doc.id)

        userDataRef.update({
          outgoingRequests: outgoingRequests
        })
        
        doc.ref.update({
          incomingRequests: friendRequests
        })
      }

      reqInputWrapper.current?.classList.add("success")
      errorHeading.current?.classList.add("success")
      if(errorHeading.current){
        errorHeading.current.style.display = "block"
        errorHeading.current.innerText = `Success! Your friend request to <span className="bold">${username}#${tag}</span> was sent.`
      } 
    })
  }
  
  // Adding disabled attribute directly to the button element below bugs out the click event for some reason
  useEffect(() => {reqButton.current?.setAttribute("disabled", "true")}, []) 
  
  return (
    <main>
      <header className="friendHeader">
        <h1>ADD FRIEND</h1>
        <h2>You can add a friend with their Discord Tag. It's cAsE sEnSitIvE!</h2>
        <div className="friendReqInput" ref={reqInputWrapper}>
          <input ref={reqInput} type="text" placeholder="Enter a Username#0000" onInput={(event) => handleInput(event)} onFocus={handleFocus} onBlur={handleUnfocus}/>
          <button ref={reqButton} className="blurpleBtn" onClick={addFriend} style={{width: "10rem"}}>Send Friend Request</button>
        </div>
        <h1 className="errorHeading" ref={errorHeading}></h1>
      </header>
      <Linebreak heightPx={1} style={{width:"100%"}}/>

      <footer className="friendReqFooter">
        <img src="../src/assets/noFriends.svg" alt="Lonely Bumpus" />
        <h1><span id="bumpus"/>umpus is waiting on friends. You don't have to though!</h1>
      </footer>
    </main>
  )
}