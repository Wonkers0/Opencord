import { DocumentData } from "firebase/firestore"
import { firestore } from "../../main"
import { DocRef } from "../App"
import { addUserAsFriend } from "../Main/AddFriend"
import { removeFriend } from "../Main/Main"

interface Props{
    chatterData: DocumentData,
    chatterID: string | undefined,
    userID: string,
    userData: DocumentData | undefined
}

export default function DMStart({chatterData, chatterID, userID, userData}: Props){
    return (
        <header>
            <img src={chatterData.profilePictureURL} alt="User Profile Picture" />
            <h1 className="DMUsername">{chatterData.username}</h1>
            <h2 className="DMSubtitle">This is the beginning of your direct message history with <span className="bold">@{chatterData.username}</span></h2>
            <section className="DMButtons">
                {
                    userData?.friends.includes(chatterID) ?
                    (<button className="secondaryBtn" onClick={() => {if(chatterID) removeFriend(chatterID, userID, firestore.doc(`users/${userID}`))}}>Remove Friend</button>) :
                    (<button className="blurpleBtn" style={{height: "1.5rem"}} onClick={() => {if(chatterID && userData) addUserAsFriend(userID, userData, chatterID)}}>Add Friend</button>)
                }
                <button className="secondaryBtn">Block</button>
            </section>
        </header>
    )
}