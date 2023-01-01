import TooltipButton from "./TooltipButton"

interface Props{
  profilePictureURL: string,
  username: string,
  usertag: string,
  infoText: string,
  children: JSX.Element[] | JSX.Element
}

export default function UserCard({profilePictureURL, username, usertag, infoText, children}: Props){
  return (
    <div className="userCard">
      <div className="cardUser">
        <img src={profilePictureURL} alt="User Profile Picture" className="profilePicture" />
        <div className="cardUserInfo">
          <div className="usernameInfo">
            {username}
            <span>{usertag}</span>
          </div>
          {infoText}
        </div>
      </div>

      <div className="cardControls">
        {children}
      </div>

    </div>
  )
}