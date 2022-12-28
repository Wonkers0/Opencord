import { MenuTab } from "./App"

interface MainProps{
  menuTab: MenuTab
}

export default function Main({menuTab}: MainProps){
  switch(menuTab){
    case MenuTab.ONLINE_FRIENDS: {
      return (
        <main>
          <div className="mainWrapper">
            <img src="../src/assets/wumpus.svg" alt="Lonely Wumpus" />
            <h1>No one's around to play with Wumpus.</h1>
          </div>
        </main>
      )
    }
    default:
      return (
        <main>
          <div className="mainWrapper">
            <img src="../src/assets/thinking-face.png" alt="" />
            <h1>Hmm... You weren't supposed to see this.<br/> Maybe shoot me an email at <a target="_blank" href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJqTfglNhTKFPlrVvMRRrWVKrrlprHPbknbxrRSHwvkwdJHwBnWMvDqqdGVzRrPSnszDrJB">opencord.dev@gmail.com</a></h1>
          </div>
        </main>
      )
  }
  
}