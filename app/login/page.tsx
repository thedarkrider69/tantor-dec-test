import Link from "next/link";
import { loginAction } from "@/lib/actions";
import { ErrorMessage } from "@/components/forms";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="auth-page">
      <main className="auth-panel">
        <form className="auth-card form" action={loginAction}>
          <h2>Connexion</h2>
          <p style={{textAlign: "center", marginTop: 0}}>Connectez-vous à votre compte</p>
          <ErrorMessage message={searchParams.error} />
          <label className="label">Adresse email<input name="email" className="input" type="email" placeholder="votre@email.com" required /></label>
          <label className="label">Mot de passe<input name="password" className="input" type="password" placeholder="••••••••" required /></label>
          <button className="btn btn-primary" type="submit">Se connecter</button>
          <p style={{textAlign: "center"}}><Link href="/forgot-password">Mot de passe oublié ?</Link></p>
          <p style={{textAlign: "center"}}>Vous n’avez pas de compte ? <Link href="/register"><strong>Créer un compte</strong></Link></p>
          <p style={{fontSize: 12, textAlign: "center"}}>En vous connectant, vous acceptez nos conditions d’utilisation et notre politique de confidentialité.</p>
        </form>
      </main>
    </div>
  );
}
