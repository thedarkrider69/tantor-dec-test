import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <main className="auth-panel">
        <form className="auth-card form">
          <h2>Mot de passe oublié</h2>
          <p style={{textAlign: "center", marginTop: 0}}>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
          <label className="label">Email<input className="input" type="email" placeholder="votre@email.com" required /></label>
          <Link className="btn btn-primary" href="/verify-email">Envoyer le mot de passe</Link>
          <p style={{textAlign: "center"}}>Vous vous souvenez de votre mot de passe ? <Link href="/login"><strong>Se connecter</strong></Link></p>
        </form>
      </main>
    </div>
  );
}
