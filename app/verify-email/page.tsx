import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="auth-panel" style={{minHeight: "100vh"}}>
      <div className="auth-card form">
        <Link className="logo" href="/"><span className="logo-mark">T</span><span>Tantor Déc</span></Link>
        <h2>Vérification de votre adresse e-mail</h2>
        <p>Un code de vérification à 6 chiffres a été envoyé à votre adresse e-mail.</p>
        <input className="input" placeholder="Code à 6 chiffres" />
        <Link className="btn btn-primary" href="/app/dashboard">Continuer</Link>
      </div>
    </div>
  );
}
