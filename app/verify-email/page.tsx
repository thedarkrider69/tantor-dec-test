import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <main className="auth-panel">
        <form className="auth-card form">
          <h2>Vérification de votre adresse e-mail</h2>
          <p style={{textAlign: "center", marginTop: 0}}>Un code de vérification à 6 chiffres a été envoyé à votre adresse e-mail.</p>
          <label className="label">Code<input className="input" placeholder="code à 6 chiffres" maxLength={6} /></label>
          <Link className="btn btn-primary" href="/login">Continuer</Link>
          <p style={{textAlign: "center"}}>Vous vous souvenez de votre mot de passe ? <Link href="/login"><strong>Se connecter</strong></Link></p>
        </form>
      </main>
    </div>
  );
}
