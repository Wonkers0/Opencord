import { doc } from "firebase/firestore"
import { useDocument } from "react-firebase-hooks/firestore"
import { firestore } from "../main"

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
  userID: string
}

export default function ProfilePicture({userID}: Props){
  const [userData, loading, error] = useDocument(doc(firestore, `users/${userID}`))
  const status = !loading ? <img src={`../src/assets/${Object.values(Status)[userData?.data()?.status]}.png`} alt="Profile Status" className="profileStatus" /> : <></>
  
  return (
    <div className="userProfilePicture">
      <img src={loading ? "../src/assets/loadingProfile.svg" : userData?.data()?.profilePictureURL} alt="Profile Picture" id="userPFP" />
      {status}
    </div>
  )
}