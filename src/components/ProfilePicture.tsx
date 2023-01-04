import { DocumentData } from "firebase/firestore"

export enum PFPType{
  WITH_STATUS,
  WITHOUT_STATUS
}

export enum Status{
  ONLINE="onlineStatus",
  IDLE="idleStatus",
  DO_NOT_DISTURB="dndStatus",
  INVISIBLE="offlineStatus"
}

export const statusInfo = new Map<Status, string>([
  [Status.ONLINE, "Online"],
  [Status.IDLE, "Idle"],
  [Status.DO_NOT_DISTURB, "Do Not Disturb"],
  [Status.INVISIBLE, "Offline"]
])

interface Props{
  pfpType?: PFPType,
  profileStatus?: Status,
  userData: DocumentData | undefined
}

export default function ProfilePicture({pfpType=PFPType.WITH_STATUS, profileStatus=Status.ONLINE, userData}: Props){
  const status = pfpType == PFPType.WITH_STATUS ? <img src={`../src/assets/${profileStatus}.png`} alt="Profile Status" className="profileStatus" /> : <></>
  
  return (
    <div className="userProfilePicture">
      <img src={userData ? userData.profilePictureURL : "../src/assets/404.svg"} alt="Profile Picture" id="userPFP" />
      {status}
    </div>
  )
}