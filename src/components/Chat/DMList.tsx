import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../main";
import ChatCard from "./ChatCard";
import TooltipButton from "../Buttons/TooltipButton";
import UserInfo from "../UserInfo";

interface Props{
  userData: DocumentData | undefined,
  setMenuTab: Function,
  userID: string,
  viewChat: Function,
  currentChat: string | undefined
}

export default function DMList({userData, setMenuTab, viewChat, userID, currentChat}: Props){
  const [chats, setChats] = useState<JSX.Element[]>([])
  useEffect(() => {
    const loadedChats: JSX.Element[] = []
    const dbPromises: Promise<any>[] = []
    let i = 0;
    for(const chat of userData?.chats){
      if(chat.closed) continue
      
      dbPromises.push(
        firestore.doc(`users/${chat.DM}`).get().then(doc => {
          loadedChats.push(<ChatCard key={i++} currentChat={currentChat} viewChat={viewChat} setMenuTab={setMenuTab} chatID={chat.chatID} userID={userID} chatterID={chat.DM} chatterData={doc.data()} />)
        })
      )
    }

    Promise.all(dbPromises).then(() => setChats(loadedChats))
  }, [userData])

  return (
    <section className="DMList">
      <button className="friendsTab selected">
        <svg x="0" y="0" className="friendsIcon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path fill="hsl(213,4%,57%)" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path style={{fill:"none"}} d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
        Friends
      </button>

      <div className="DMTitle">
        <span>DIRECT MESSAGES</span>
        <TooltipButton tooltipText="Create DM">
          <i className="fa-solid fa-plus createDM"></i>
        </TooltipButton>
      </div>

      {
        chats.length == 0 ?
        (<svg width="184" height="428" viewBox="0 0 184 428" className="noDMsGFX"><rect x="40" y="6" width="144" height="20" rx="10"></rect><circle cx="16" cy="16" r="16"></circle><rect x="40" y="50" width="144" height="20" rx="10" opacity="0.9"></rect><circle cx="16" cy="60" r="16" opacity="0.9"></circle><rect x="40" y="94" width="144" height="20" rx="10" opacity="0.8"></rect><circle cx="16" cy="104" r="16" opacity="0.8"></circle><rect x="40" y="138" width="144" height="20" rx="10" opacity="0.7"></rect><circle cx="16" cy="148" r="16" opacity="0.7"></circle><rect x="40" y="182" width="144" height="20" rx="10" opacity="0.6"></rect><circle cx="16" cy="192" r="16" opacity="0.6"></circle><rect x="40" y="226" width="144" height="20" rx="10" opacity="0.5"></rect><circle cx="16" cy="236" r="16" opacity="0.5"></circle><rect x="40" y="270" width="144" height="20" rx="10" opacity="0.4"></rect><circle cx="16" cy="280" r="16" opacity="0.4"></circle><rect x="40" y="314" width="144" height="20" rx="10" opacity="0.3"></rect><circle cx="16" cy="324" r="16" opacity="0.3"></circle><rect x="40" y="358" width="144" height="20" rx="10" opacity="0.2"></rect><circle cx="16" cy="368" r="16" opacity="0.2"></circle><rect x="40" y="402" width="144" height="20" rx="10" opacity="0.1"></rect><circle cx="16" cy="412" r="16" opacity="0.1"></circle></svg>) :
        chats
      }

      <UserInfo userData={userData} userID={userID}/>
    </section>
  )
}