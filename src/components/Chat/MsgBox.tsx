import { DocumentData, serverTimestamp } from "firebase/firestore";
import { KeyboardEvent, useRef } from "react";
import { firestore } from "../../main";
import TooltipButton from "../Buttons/TooltipButton";

interface Props{
  chatterData: DocumentData | undefined,
  userID: string,
  chatID: string
}

export default function MsgBox({chatterData, userID, chatID}: Props){
  const textArea = useRef<HTMLTextAreaElement>(null)

  const handleInput = (event: KeyboardEvent) => {
    if(!textArea.current) return

    setTimeout(() => {
      if(!textArea.current) return
      textArea.current.style.height = "0px";
      textArea.current.style.height = textArea.current.scrollHeight + "px";
    }, 0)
  
    if(!event.shiftKey && event.key == "Enter"){
      event.preventDefault()
      let text = textArea.current.value.replaceAll("\\n", "").replaceAll(/^\n+|\n+$/g, "").replaceAll("\n", "\\n")

      if(text.replace(/\\n| |‎|​/gm, "").length == 0) return
      sendMessage(userID, chatID, text)
      textArea.current.value = ''
    } 
  }

  return (
    <section className="msgBoxWrapper">
      <div className="msgBox">
        <TooltipButton tooltipText="Uploads Coming Soon">
          <i className="fa-solid fa-circle-plus msgBoxBtn"></i>
        </TooltipButton>
        <textarea ref={textArea} rows={1} maxLength={1500} placeholder={`Message @${chatterData?.username}`} className="auto-expand" onKeyDown={(event) => handleInput(event)}/>
      </div>

      <div className="sideBtns">
        <TooltipButton tooltipText="Emojis">
          <i className="fa-solid fa-face-kiss msgBoxBtn"></i>
        </TooltipButton>
      </div>
    </section>
  )
}

function sendMessage(userID: string, chatID: string, message: string){
  const chatDoc = firestore.doc(`chats/${chatID}`)

  chatDoc.get().then(doc => {
    const messages = doc.data()?.messages
    let timestamp = new Date().getTime()
    messages.push({
      author: userID,
      content: message,
      sentAt: timestamp
    })
    chatDoc.update({
      messages: messages
    })
  })
}