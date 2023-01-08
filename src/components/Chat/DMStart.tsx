import { DocumentData } from "firebase/firestore"

interface Props{
    chatterData: DocumentData
}

export default function DMStart({chatterData}: Props){
    return (
        <header>
            <img src={chatterData.profilePictureURL} alt="User Profile Picture" />
            <h1 className="DMUsername">{chatterData.username}</h1>
            <h2 className="DMSubtitle">This is the beginning of your direct message history with <span className="bold">@{chatterData.username}</span></h2>
            <section className="DMButtons">
                <button className="secondaryBtn">Remove Friend</button>
                <button className="secondaryBtn">Block</button>
            </section>
        </header>
    )
}