import { useEffect, useRef, useState } from "react"
import { unmountComponentAtNode } from "react-dom"
import { root } from "../main"

let popup: HTMLDivElement | null
let setTitleOut: Function, setSubtitleOut: Function, setButtonTextOut: Function
export default function Popup(){
  const wrapper = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [buttonTitle, setButtonText] = useState("Okay")

  const handleClick = () => {
    if(!wrapper.current) return

    wrapper.current.style.display = 'none'
  }

  useEffect(() => {
    popup = wrapper.current
    setTitleOut = setTitle
    setSubtitleOut = setSubtitle
    setButtonTextOut = setButtonText
  }, [])

  return (
    <div ref={wrapper} style={{display: 'none'}}>
      <div className="popupBackground"></div>
      <div className="popup">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <footer>
          <button onClick={handleClick} className="blurpleBtn">{buttonTitle}</button>
        </footer>
      </div>
    </div>
  )
}

export function showPopup(titleText: string, subtitleText: string){
  if(!popup) return
  
  setTitleOut(titleText)
  setSubtitleOut(subtitleText)
  popup.style.display = 'block'
}

export function showPopupWithButtonText(titleText: string, subtitleText: string, buttonText: string){
  if(!popup) return
  
  setTitleOut(titleText)
  setSubtitleOut(subtitleText)
  setButtonTextOut(buttonText)
  popup.style.display = 'block'
}
