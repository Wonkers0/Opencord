import { MouseEventHandler, useRef } from "react"

interface Props{
  children: JSX.Element[] | JSX.Element,
  tooltipText: string,
  className?: string,
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default function TooltipButton({children, tooltipText, className="", onClick= () => {}}: Props){
  const wrapper = useRef<HTMLDivElement>(null)
  const tooltipElem = useRef<HTMLDivElement>(null)

  const handleHover = (hoverIn: boolean) => {
    if(hoverIn) tooltipElem.current?.classList.add("visible")
    else tooltipElem.current?.classList.remove("visible")
  }

  return (
    <div ref={wrapper} className={"tooltipBtnWrapper " + className} onClick={onClick}>
      <div ref={tooltipElem} className="tooltip" id="vertical">{tooltipText}</div>
      {children}
    </div>
  )
}