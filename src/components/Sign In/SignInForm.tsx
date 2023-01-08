import ThirdPartySignIn, { ThirdParty } from "./ThirdPartySignIn";

export default function SignInForm(){
  return (
    <div className="signInForm">
      <h1>Welcome back!</h1>
      <h2>Well, unless you're new here... Just click the buttons 👇</h2>
      <ThirdPartySignIn thirdParty={ThirdParty.GOOGLE} />
      <ThirdPartySignIn thirdParty={ThirdParty.GITHUB} disabled={true} />
      <ThirdPartySignIn thirdParty={ThirdParty.DISCORD} disabled={true} />
    </div>
  )
}