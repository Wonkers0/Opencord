import Sidebar from './Sidebar'
import "../styles.scss"
import "../fonts.scss"
import Navbar from './Navbar'
import DMList from './DMList'
import Main from './Main'
import { useState } from 'react'

export enum MenuTab{
  ONLINE_FRIENDS,
  ALL_FRIENDS,
  PENDING_REQUESTS,
  BLOCKED_USERS,
  ADD_FRIEND,
  DM,
}

export default function App() {
  const [menuTab, setMenuTab] = useState(MenuTab.ONLINE_FRIENDS);

  return (
    <>
      <Sidebar />
      <Navbar menuTab={menuTab} setMenuTab={setMenuTab}/>
      <DMList />
      <Main menuTab={menuTab} />
    </>
  )
}
