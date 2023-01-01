import { useRef, useState } from "react"

interface BtnProps{
  children: JSX.Element,
  extraClass?: string,
  tooltip: string,
  clickable?: boolean,
  indicatorType?: IndicatorType
}

export enum IndicatorType{
  UNREAD = "unread",
  SELECTED = "selected",
  NONE = ""
}

export default function CircleButton({children, extraClass="", tooltip="😔 Missing Tooltip", clickable=true, indicatorType=IndicatorType.NONE}: BtnProps){
  const [indicatorState, setIndicatorType] = useState(indicatorType) // Set to selected when clicked on (but no servers rn so just a todo)
  const circleBtn = useRef<HTMLDivElement>(null)
  const tooltipElem = useRef<HTMLDivElement>(null)

  const handleHover = (hoverIn: boolean) => {
    if(hoverIn){
      tooltipElem.current?.classList.add("visible")
      circleBtn.current?.classList.add("selected")
    } 
    else{
      tooltipElem.current?.classList.remove("visible")
      if(indicatorType != IndicatorType.SELECTED) circleBtn.current?.classList.remove("selected")
    } 
  }
  
  return (
    <div className="circleBtnWrapper">
      <div ref={circleBtn} className={"circleBtn " + extraClass + (indicatorType == IndicatorType.SELECTED ? " selected" : "")}
       onMouseEnter={() => {handleHover(true)}} 
       onMouseLeave={() => {handleHover(false)}}
       style={{cursor: clickable ? "pointer" : ""}}>
        {children}
      </div>
      <div ref={tooltipElem} className="tooltip">{tooltip}</div>
      <div className={`btnIndicator ${indicatorType}`}></div>
    </div>
  )
}