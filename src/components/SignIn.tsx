import { copy } from "../copy";

export function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return (
    <section className="sign-in">
      <h1>{copy.signInTitle}</h1>
      <p>{copy.signInBody}</p>
      <button type="button" onClick={onSignIn}>
        {copy.signInButton}
      </button>
    </section>
  );
}
