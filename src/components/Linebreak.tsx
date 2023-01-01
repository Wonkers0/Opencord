interface LinebreakProps{
  widthPx?: number,
  heightPx?: number,
  color?: string,
  vertical?: boolean,
  style?: Object
}

export default function Linebreak({widthPx=32, heightPx=2, color="rgba(79,84,92,0.48)", vertical=false, style={}}: LinebreakProps){
  const defaultStyles = {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    backgroundColor: color,
    borderRadius: `${heightPx}px`,
    transform: vertical ? "rotate(90deg)" : ""
  }

  for(let key of Object.keys(defaultStyles))
    if(!Object.keys(style).includes(key))
      //@ts-ignore
      style[key] = defaultStyles[key]
  
  return (
    <div style={style}></div>
  )
}