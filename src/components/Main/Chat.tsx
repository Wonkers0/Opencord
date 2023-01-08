import { v4 as uuidv4 } from 'uuid';
import { firestore } from "../../main"
import { DocRef, MenuTab, UserData } from '../App';
import DMStart from '../Chat/DMStart';
import GroupStart from '../GroupStart';
import { doc, DocumentData } from 'firebase/firestore';
import MsgBox from '../Chat/MsgBox';
import { useDocument } from 'react-firebase-hooks/firestore';
import Message from '../Chat/Message';
import { useEffect, useState, useRef } from 'react';

interface Props{
  chatID: string,
  userID: string,
  chatterData: DocumentData | undefined,
  DM: boolean
}

export default function Chat({chatID, userID, chatterData, DM}: Props){
  let [chatData, loading, error] = useDocument(doc(firestore, "chats", chatID))
  const [loadedMessages, setLoadedMessages] = useState<JSX.Element[]>([])
  const messagesToLoad = 35
  const messagesWrapper = useRef<HTMLDivElement>(null)
  let messages: JSX.Element[] = []

  useEffect(() => {
    if(!loading && chatData){
      let messageData = chatData.data()?.messages
      const userMap = new Map<string, UserData>([])
      const dbReads: Promise<any>[] = []
      
      for(const message of messageData){
        if(!userMap.has(message.author)){
          dbReads.push(firestore.doc(`users/${message.author}`).get().then(doc => {
            userMap.set(message.author, doc.data() as UserData)
          }))
        }
      }
  
      Promise.all(dbReads).then(() => {
        if(messageData){
          // @ts-ignore
          const old = messageData.map((x) => x)
          messageData = messageData.splice(Math.max(0, messageData.length - messagesToLoad))

          for(const message of messageData){
            let authorData = userMap.get(message.author)
            if(authorData) messages.push(<Message key={old.indexOf(message)} author={authorData} content={message.content} timestamp={message.sentAt} />)
            else throw Error("Missing message author data 🤔")
          }
        }
        setLoadedMessages(messages)
      })
    }
  }, [chatData])

  useEffect(() => {
    if(!messagesWrapper.current) return
    messagesWrapper.current.scrollTop = messagesWrapper.current.scrollHeight
  }, [loadedMessages]) // Scroll to bottom of conversation after messages have been loaded

  return (
    <main>
      <div className="chatWrapper">
        <section ref={messagesWrapper} className="messages">
          {DM && chatterData ? <DMStart chatterData={chatterData} /> : <GroupStart />}
          {loadedMessages}
        </section>
        <MsgBox chatterData={chatterData} userID={userID} chatID={chatID} />
      </div>
    </main>
  )
}

export function createChat(chatDoc: DocRef, users: string[], isDM: boolean): Promise<void>{
  for(let user of users){
    const userDoc = firestore.doc(`users/${user}`)
    userDoc.get().then(doc => {
      const currentChats = doc.data()?.chats == null ? [] : doc.data()?.chats

      currentChats.push({
        DM: isDM ? users.filter(id => id != user)[0] : false,
        chatID: chatDoc.id,
        closed: false
      })


      userDoc.update({chats: currentChats})
    })
  }

  return chatDoc.set({
    messages: [],
    users: users,
    DM: isDM
  })
}


/* 
  Starts a new DM with another user, unless it already exists, then it switches to it.
  @param userID - The ID of the user that is currently authenticated on the app
  @param chatterID - The ID of the user that the first user wants to chat with
*/
export function startDMWithUser(userID: string, chatterID: string, setMenuTab: Function, viewChat: Function){
  const userDoc = firestore.doc(`users/${userID}`)
  const chatterDoc = firestore.doc(`users/${chatterID}`)
  let chatID: string | null = null

  userDoc.get().then(doc => {
    const currentChats = doc.data()?.chats
    for(let chat of currentChats){
      if(chat.DM == chatterID){
        chatID = chat.chatID
        chat.closed = false
        userDoc.update({chats: currentChats})
        break
      } 
    }
    // Chat does not exist, create it first
    if(chatID == null){
      chatID = uuidv4()
      createChat(firestore.doc(`chats/${chatID}`), [userID, chatterID], true)
    }

    chatterDoc.get().then(doc => {
      // Switch to chat
      viewChat({
        id: chatID,
        isDM: true,
        chatterData: doc.data()
      })
      setMenuTab(MenuTab.DM)
    })
  })

  return chatID
}