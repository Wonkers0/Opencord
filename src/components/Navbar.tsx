import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore } from "../main";
import { DocRef, MenuTab } from "./App";
import Linebreak from "./Linebreak";
import NavButton from "./NavButton";

interface NavbarProps{
  menuTab: MenuTab,
  setMenuTab: Function,
  userID: string
}

export default function Navbar({menuTab, setMenuTab, userID}: NavbarProps){
  const [userData, ignored, ignore] = useDocument(doc(firestore, "users", userID))

  return (
    <nav>
      <section className="searchbarWrapper">
        <button className="searchbar">Find or start a conversation</button>
      </section>
      <section className="mainNav">
        <div id="friendsTitle">
          <svg x="0" y="0" className="friendsIcon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path fill="hsl(213,4%,57%)" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
          Friends
        </div>

        <Linebreak vertical widthPx={24} heightPx={0.1} color="rgba(79, 84, 92, 0.48)"/>

        <NavButton text="Online" menuTabOfThis={MenuTab.ONLINE_FRIENDS} currentMenuTab={menuTab} setMenuTab={setMenuTab} />
        <NavButton text="All" menuTabOfThis={MenuTab.ALL_FRIENDS} currentMenuTab={menuTab} setMenuTab={setMenuTab} />
        <NavButton text="Pending" menuTabOfThis={MenuTab.PENDING_REQUESTS} currentMenuTab={menuTab} setMenuTab={setMenuTab} pingCount={userData?.data()?.incomingRequests.length == 0 ? null : userData?.data()?.incomingRequests.length} />
        <NavButton text="Blocked" menuTabOfThis={MenuTab.BLOCKED_USERS} currentMenuTab={menuTab} setMenuTab={setMenuTab} />
        <button className="navBtn friendBtn" onClick={() => setMenuTab(MenuTab.ADD_FRIEND)}>Add Friend</button>
      </section>
    </nav>
  )
}