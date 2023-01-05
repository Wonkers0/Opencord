import firebase from 'firebase/compat/app'
import { auth } from '../main';

export enum ThirdParty{
  GOOGLE="Google",
  GITHUB="Github",
  DISCORD="Discord"
}

interface Props{
  thirdParty: ThirdParty
}

export default function ThirdPartySignIn({thirdParty}: Props){
  const providers = new Map<ThirdParty, firebase.auth.AuthProvider>([
    [ThirdParty.GOOGLE, new firebase.auth.GoogleAuthProvider()],
    [ThirdParty.GITHUB, new firebase.auth.GithubAuthProvider()]
  ])
  const className = thirdParty.toLowerCase();

  const signIn = (thirdParty: ThirdParty) => {
    const provider = providers.get(thirdParty)
    if(!provider) return

    auth.signInWithPopup(provider)
  }
  
  return (
    <button className={`signIn ${className}`} onClick={() => signIn(thirdParty)}>
      <img src={`../src/assets/${className}.png`} alt="Third Party Sign In Logo" />
      Sign in with {thirdParty}
    </button>
  )
}