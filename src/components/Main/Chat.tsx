import { firestore } from "../../main"

interface Props{
}

export default function Chat({}: Props){
  return
  (
    <main>
      <div className="chatWrapper">

      </div>
    </main>
  )
}

export function startChat(chatID: string, users: string[]): Promise<void>{
  const chatDoc = firestore.doc(`chats/${chatID}`)
  return chatDoc.set({
    messages: [],
    users: users
  })
}

export async function chatExistsForUser(userID: string, users: string[]): Promise<boolean>{
  const userDoc = firestore.doc(`users/${userID}`)
  const docData = await (await userDoc.get()).data()

  const chatPromises: Promise<any>[] = []
  let foundChat = true;
  for(let chat of docData?.chats){
    chatPromises.push(firestore.doc(`chats/${chat}`).get().then(doc => {
      if(doc.data()?.users == users) foundChat = true;
    }))
  }

  await Promise.all(chatPromises)
  return foundChat
}