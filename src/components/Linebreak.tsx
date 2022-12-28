interface LinebreakProps{
  widthPx?: number,
  heightPx?: number,
  color?: string,
  vertical?: boolean
}

export default function Linebreak({widthPx=32, heightPx=2, color="rgba(79,84,92,0.48)", vertical=false}: LinebreakProps){
  return (
    <div style={{
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      backgroundColor: color,
      borderRadius: `${heightPx}px`,
      transform: vertical ? "rotate(90deg)" : ""
    }}></div>
  )
}