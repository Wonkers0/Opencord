import { useRef } from "react"
import { MenuTab } from "./App"

interface NavButtonProps{
  text: string,
  menuTabOfThis: MenuTab,
  currentMenuTab: MenuTab,
  setMenuTab: Function
}

export default function NavButton({text, menuTabOfThis, currentMenuTab, setMenuTab}: NavButtonProps){
  const button = useRef<HTMLButtonElement>(null)
  
  return (
    <button ref={button} onClick={() => setMenuTab(menuTabOfThis)} className={`navBtn ${menuTabOfThis == currentMenuTab ? "selected" : ""}`}>{text}</button>
  )
}