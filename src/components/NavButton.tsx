import { useRef } from "react"
import { MenuTab } from "./App"

interface NavButtonProps{
  text: string,
  menuTabOfThis: MenuTab,
  currentMenuTab: MenuTab,
  setMenuTab: Function,
  pingCount?: number | undefined
}

export default function NavButton({text, menuTabOfThis, currentMenuTab, setMenuTab, pingCount=undefined}: NavButtonProps){
  const button = useRef<HTMLButtonElement>(null)

  return (
    <button ref={button} onClick={() => setMenuTab(menuTabOfThis)} className={`navBtn ${menuTabOfThis == currentMenuTab ? "selected" : ""}`}>
      {text}
      {pingCount != undefined && (<div className="navPing">{pingCount}</div>)}
    </button>
  )
}