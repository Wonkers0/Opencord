import { DocumentData } from "firebase/firestore"
import { firestore } from "../../main"
import { MenuTab } from "../App"
import { ChatData } from "../Main/Main"
import ProfilePicture, { Status } from "../ProfilePicture"

interface Props{
    chatterData: DocumentData | undefined,
    chatID: string,
    userID: string,
    viewChat: Function,
    currentChat: string | undefined,
    setMenuTab: Function
}

export default function ChatCard({chatterData, chatID, userID, viewChat, currentChat, setMenuTab}: Props){
    const handleClick = () => {
        setMenuTab(MenuTab.DM)

        const chatData: ChatData = {
            id: chatID,
            isDM: true,
            chatterData: chatterData
        }
        viewChat(chatData)
    }

    const closeChat = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation()

        const userDoc = firestore.doc(`users/${userID}`)
        userDoc.get().then(doc => {
            let chats = doc.data()?.chats 
            for(const chat of chats)
                if(chat.chatID == chatID) chat.closed = true

            userDoc.update({chats: chats}).then(() => {if(chatID == currentChat) setMenuTab(MenuTab.ONLINE_FRIENDS)})
        })
    }
    
    if(!chatterData) return (<></>)
    else return (
        <button className={`chatCard ${currentChat == chatID ? "selected" : ""}`} onClick={handleClick}>
            <div>
                <ProfilePicture userData={chatterData} profileStatus={Object.values(Status)[chatterData.status]}/>
                <h1>{chatterData.username}</h1>
            </div>
            <svg onClick={(event) => closeChat(event)} aria-hidden="true" role="img" width="17" height="17" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
        </button>
    )
}