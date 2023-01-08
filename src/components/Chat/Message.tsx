import { useRef, useEffect } from "react"
import { UserData } from "../App"

interface MessageProps{
    author: UserData,
    content: string,
    timestamp: number
}

export default function Message({author, content, timestamp}: MessageProps){
    let msgDate = getMsgDate(new Date(timestamp))
    const msgText = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        if(msgText.current) msgText.current.innerText = content.replaceAll("\\n", "\n")
    }, [])

    return (
        <div className="messageWrapper">
            <img src={author.profilePictureURL} alt="User Profile Picture" />
            <div className="msgInfo">
                <h1><span className="username">{author.username}</span> <span className="msgTimestamp">{msgDate}</span></h1>
                <p ref={msgText}></p>
            </div>
        </div>
    )
}

function getMsgDate(date: Date): string {
    let currentDays = Math.floor(getLocalTimestamp(new Date().getTime())/86400000) // Gets the amount of days since the epoch
    let msgDays = Math.floor(getLocalTimestamp(date.getTime())/86400000) // Gets the amount of days since the epoch up until the date the message was sent
    let msgDate, msgTime

    switch(currentDays - msgDays){
        case 0:
            msgDate = "Today at"; break;
        case 1:
            msgDate = "Yesterday at"; break;
        default:
            msgDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    msgTime = `${date.getHours() % 12 == 0 ? 12 : date.getHours() % 12}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()} ${date.getHours() > 12 ? "PM" : "AM"}`
    return `${msgDate} ${msgTime}`
}

const getLocalTimestamp = (timestamp: number): number => {
    const date = new Date(timestamp)
    return (date.getTime() - date.getTimezoneOffset() * 60000)
}