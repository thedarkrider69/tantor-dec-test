import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-panel" style={{minHeight: "100vh"}}>
      <form className="auth-card form">
        <Link className="logo" href="/"><span className="logo-mark">T</span><span>Tantor Déc</span></Link>
        <h2>Réinitialiser votre mot de passe</h2>
        <p>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
        <label className="label">Adresse email<input className="input" type="email" placeholder="votre@email.com" /></label>
        <button className="btn btn-primary" type="button">Envoyer le lien</button>
        <Link href="/login">Vous vous souvenez de votre mot de passe ? Se connecter</Link>
      </form>
    </div>
  );
}
